const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

async function getUserData(body) {
    try {
        let ExpressionAttributeValues = {};
        let FilterExpression = "";
        FilterExpression = "username = :username AND securityQuestion = :securityQuestion AND securityAnswer = :securityAnswer";
        ExpressionAttributeValues = {
                ':username': { S: `${body.username}` },
                ':securityQuestion' : { S: `${body.securityQuestion}`},
                ':securityAnswer' : { S: `${body.securityAnswer}`}
            };
        var params = {
            FilterExpression,
            ExpressionAttributeValues,
            Select: "COUNT",
            TableName: 'b2b_userDetails'
        };

        const count = await ddb.scan(params).promise();
        console.log(count)
        return count.Count;
    } catch (e) {
        console.log("Error : ", e);
    }
}

exports.handler = async (event) => {
    let body = JSON.parse(event.body);
    let count =  await getUserData(body);
    
    let response = {};
    if (count > 0) {
        response = {
            statusCode: 200,
            body: {
                message:"User Verified Successfully"
            }
        };
    }else{
        response = {
            statusCode: 422,
            body: {
                message: "Incorrect Security Answer"
            }
        };
    }
    return response;
};