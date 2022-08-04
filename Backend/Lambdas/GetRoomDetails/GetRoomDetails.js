var AWS = require("aws-sdk");

exports.handler = async (event) => {
    const myDocumentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    var params = {
        TableName: 'room_details',
    };
    const data = await myDocumentClient.scan(params).promise();
    console.log("dynamo data", data)
    responseBody = JSON.stringify(data.Items);
    statusCode = 200;
  
  const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: responseBody
    };
    return response;
};
