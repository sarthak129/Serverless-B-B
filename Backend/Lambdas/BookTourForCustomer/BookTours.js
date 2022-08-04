var AWS = require("aws-sdk");

exports.handler = async (event) => {
    
    let body = JSON.parse(event.body);
    console.log("printing username ",body.customer_id)
    const myDocumentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    
    var params = {
        TableName: 'Customer_tour_booking',
        Item: {
        
         'customer_id' : body.customer_id,
         'tour_id' : body.tour_id,
         'no_of_days' : body.no_of_days,
         'tour_country' : body.tour_country,
         'no_of_people' : body.number_of_people,
        }
    };
    
    try {
        const data = await myDocumentClient.put(params).promise();
        responseBody = JSON.stringify(data);
        statusCode = 201;
    } catch (err) {
        responseBody = `Unable to put Product: ${err}`;
        statusCode = 403;
    }
    
    
    const response = {
        statusCode: 200,
        body: responseBody
    };
    return response;
};

