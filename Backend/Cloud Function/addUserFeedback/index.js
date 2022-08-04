const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: "ASIA4SLTCEPSIM2BYUBN",
    secretAccessKey: "wNhmLP0yy1X6gpaMN/mfDdbAuGp4AOF5JZITRwA+",
    sessionToken: "FwoGZXIvYXdzEIr//////////wEaDFgUKi+sQIU1u+pGjSLAAVkh9P+FjIR2dy/K8dYmZyh870mwFygMimnnVtj5raHqn/0WsaQcgxsJa96B/KVq7WBCyOpzo1MspIWRZ7kkGZO2E6HkWC8TgbEHHz3Ubd8Kyk36wqlufUVzhu6R6GFHphnKMMJzMINjE9iMV8O6Ksdua6j4lZMJjPPu/8oKOsmOJOBOfv/vv+CRuangEfNSlvOfXNQu0UwsNSwqcy1apagXCLU2xWxr0VjH8lyS1wPpHvYG72GZ3jzdVYfwnAyQGijRkMiWBjIt6gInBP5D+w2OgG7xHkoWNPkjR5OhnwV8ytHzh/2CZgY/hk2GLEh8M0rb6lco"
});
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

async function addUserFeedback(body) {
    try{
        var params = {
            TableName: 'b2b_userFeedback',
            Item: {
                'id' : {S:`${uuid.v4()}`},
                'username':{S: `${body.username}`},
                'feedback': { S: `${body.feedback}` },
                'date': { S: `${new Date()}`}
            }
        };
        
        await ddb.putItem(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        }).promise();
    }catch(e){
        console.log(e);
    }
}

exports.handler = async (event) => {
    let body = JSON.parse(event.body);
    
    await addUserFeedback(body);
    
    const response = {
        statusCode: 200,
        body: {
            data:{},
            message:"User registered successfully"
        },
    };
    return response;
};
exports.helloWorld = async (req, res) => {
    await addUserFeedback(req.body);
    
    const response = {
        statusCode: 200,
        body: {
            data:{},
            message:"Feedback added successfully"
        },
    };
  res.send(response);
};
