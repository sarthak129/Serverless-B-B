const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

async function getUserData(body) {
    try {
        let ExpressionAttributeValues = {};
        let FilterExpression = "";
        FilterExpression = "username = :username";
        ExpressionAttributeValues = {
                ':username': { S: `${body.username}` }
            };
        var params = {
            FilterExpression,
            ExpressionAttributeValues,
            TableName: 'b2b_userDetails'
        };

        return new Promise((resolve, reject) => {
            let response = {};
            ddb.scan(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log(data.Items);
                    data.Items.forEach(function (element, index, array) {
                        console.log("element = ", element);
                        response.question = element.securityQuestion.S;
                        response.answer = element.securityAnswer.S;
                        response.cipher = element.cipher.N;
                    });
                }
                resolve(response);
            });
        });
    } catch (e) {
        console.log("Error : ", e);
    }
}

exports.handler = async (event) => {
    let body = JSON.parse(event.body);
   let data =  await getUserData(body);
    
    const response = {
        statusCode: 200,
        body: data,
    };
    return response;
};
