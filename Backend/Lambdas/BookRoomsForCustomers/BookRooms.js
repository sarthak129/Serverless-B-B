var AWS = require("aws-sdk");


exports.handler = async (event) => {
    //This lambda code is for booking rooms for customers
    let body = JSON.parse(event.body);
    console.log("printing username ",body.customer_id)
    const myDocumentClient = new AWS.DynamoDB.DocumentClient();
    let responseBody = "";
    let statusCode = 0;
    let result = ' ';
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < 5; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    var params = {
        TableName: 'customer_roombooking',
        Item: {
         'booking_id' : result,
         'customer_id' : body.customer_id,
         'room_id' : body.room_id,
         'checkin_date' : body.checkin_date,
         'checkout_date' : body.checkout_date,
         'no_of_days_of_stay' : body.no_of_days_of_stay,
         'room_type' : body.room_type
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
    
    const getParams = {
        TableName: "room_details"
    }
    
    const room_data = await myDocumentClient.scan(getParams).promise();
    const room_data_response = JSON.stringify(room_data.Items);
    const s1s = JSON.parse(room_data_response)
    
    const availability = s1s[0].number_available - 1;
    console.log(availability)
    
    const updateparams = {
        TableName: "room_details",
        Key: {
            room_id: body.room_id
        },
        UpdateExpression: "set number_available = :n",
        ExpressionAttributeValues: {
            ":n": availability
        }
    };
    
    try {
        const updatedata = await myDocumentClient.update(updateparams).promise();
        responseBody = JSON.stringify(updatedata);
        console.log(responseBody)
        statusCode = 204;
    } catch (err) {
        responseBody = `Unable to update Product: ${err}`;
        statusCode = 403;
    }
    
    // TODO implement
    const response = {
        statusCode: statusCode,
        body: responseBody
    };
    return response;
};
