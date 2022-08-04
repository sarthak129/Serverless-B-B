import Storage from '@google-cloud/storage';
import { stringify } from 'csv-stringify';
import { BigQuery } from '@google-cloud/bigquery';

const storage = new Storage({});
const bigquery = new BigQuery({});

let headers = {
  UserName: 'UserName',
  Date: 'Date',
  Status: 'Status'
};

async function generateCSV(fileName, username) {
  try {
    let rows = [];

    rows.push([username, new Date().toLocaleString(), "online"]);

    let dataFromCSV = await readData("serverlessb2b", fileName);
    let isHeader = false;
    if (!dataFromCSV.length > 0) {
      isHeader = true;
    }

    console.log("rows = ", rows);

    let res = await createCSVData(rows, isHeader);
    console.log(dataFromCSV + res);
    await insertQuery(username);
    await storage.bucket("serverlessb2b").file(fileName).save(dataFromCSV + res);
  } catch (e) {
    console.log(e);
  }
}

async function readData(bucketName, fileName) {
  let contents = "";
  try {
    contents = await storage.bucket(bucketName).file(fileName).download();
  } catch (e) {
    console.log("File Not Found.")
  }
  return contents.toString();
}

async function createCSVData(rows, isHeader) {
  return new Promise((resolve, reject) => stringify(rows, { header: isHeader, columns: headers }, (err, output) => {
    if (err) reject("");
    resolve(output);
  }));
}

export async function helloWorld(req, res) {
  console.log("body = ", req.body);
  let response = {};
  if (req.body.username) {
    await generateCSV("reportGeneration.csv", req.body.username).catch(console.error);

    response = {
      statusCode: 200,
      message: "Log added successfully"
    };
  } else {
    response = {
      statusCode: 422,
      message: "body missing"
    };
  }
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    res.send(response);
  }
}
