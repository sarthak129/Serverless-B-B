var AWS = require("aws-sdk");
const request = require('request');
exports.handler =   async (event, context, callback) => {
  const myDocumentClient = new AWS.DynamoDB.DocumentClient();
  let responseBody = "";
  let statusCode = 0;
  
  let reco_data = '';
  console.log("started")
  const axios = require('axios');
  
  axios.post('https://us-central1-assignment1-352422.cloudfunctions.net/test_recommendation', {
    id: '1',
  })
  

  const senddata = {
    id: '1'
  }
  
  var getRecommendataionParams = {
    TableName: 'Tour_recommendation',
    Item: {
      'Customer_id' : '1'
    }
  }
  
  const recommendationData = await myDocumentClient.scan(getRecommendataionParams).promise();
  var daysPredicted = recommendationData.Items[0].days
  
  var params = {
    TableName: 'tour_data',
    Item: {
      'no_of_days' : daysPredicted
    }
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
