var AWS = require("aws-sdk");

exports.handler = async (event) => {
    
    console.log("call to get user food orders : ", event.body)
    let body = JSON.parse(event.body);
    console.log("printing username ",body.username)
    let username = body.username;
    const myDocumentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    var params = {
        TableName: 'order_details',
        Item: {
         'username' : {S: username},
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
