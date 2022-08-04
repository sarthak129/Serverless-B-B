const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

async function getFeedbackData(body) {
    try {
        var params = {
            TableName: 'b2b_userFeedback',
            Limit:20
        };

        return new Promise((resolve, reject) => {
            let resArray = [];
            ddb.scan(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(resArray);
                } else {
                    console.log(data.Items);
                    data.Items.forEach(function (element, index, array) {
                        let response = {};
                        console.log("element = ", element);
                        response.feedback = element.feedback.S;
                        response.score = element.score.S;
                        response.polarity = element.polarity.S;
                        response.username = element.username.S;
                        response.date = element.date.S;
                        resArray.push(response);
                    });
                }
                resolve(resArray);
            });
        });
    } catch (e) {
        console.log("Error : ", e);
    }
}

async function getUserData(username) {
    try {
        let ExpressionAttributeValues = {};
        let FilterExpression = "";
        FilterExpression = "username = :username";
        ExpressionAttributeValues = {
                ':username': { S: `${username}` }
            };
        var params = {
            FilterExpression,
            ExpressionAttributeValues,
            TableName: 'b2b_userDetails'
        };

        return new Promise((resolve, reject) => {
            let customerId = 0;
            ddb.scan(params, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(0);
                } else {
                    console.log(data.Items);
                    data.Items.forEach(function (element, index, array) {
                        console.log("element = ", element);
                        customerId = element.customerId.N;
                    });
                }
                resolve(customerId);
            });
        });
    } catch (e) {
        console.log("Error : ", e);
    }
}


exports.handler = async (event) => {
    let data =  await getFeedbackData();
    
    for (let i = 0; i < data.length; i++) {
        data[i].customerId = await getUserData(data[i].username);
    }
    
    const response = {
        statusCode: 200,
        body: {
            data
        },
    };
    return response;
};
