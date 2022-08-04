const language = require('@google-cloud/language');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: "ASIA4SLTCEPSIM2BYUBN",
    secretAccessKey: "wNhmLP0yy1X6gpaMN/mfDdbAuGp4AOF5JZITRwA+",
    sessionToken: "FwoGZXIvYXdzEIr//////////wEaDFgUKi+sQIU1u+pGjSLAAVkh9P+FjIR2dy/K8dYmZyh870mwFygMimnnVtj5raHqn/0WsaQcgxsJa96B/KVq7WBCyOpzo1MspIWRZ7kkGZO2E6HkWC8TgbEHHz3Ubd8Kyk36wqlufUVzhu6R6GFHphnKMMJzMINjE9iMV8O6Ksdua6j4lZMJjPPu/8oKOsmOJOBOfv/vv+CRuangEfNSlvOfXNQu0UwsNSwqcy1apagXCLU2xWxr0VjH8lyS1wPpHvYG72GZ3jzdVYfwnAyQGijRkMiWBjIt6gInBP5D+w2OgG7xHkoWNPkjR5OhnwV8ytHzh/2CZgY/hk2GLEh8M0rb6lco"
});
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const client = new language.LanguageServiceClient();
async function quickstart(data) {
  console.log("inside");

  const document = {
    content: data.feedback,
    type: 'PLAIN_TEXT',
  };

  const [result] = await client.analyzeSentiment({document: document});
  const sentiment = result.documentSentiment;

  console.log(`Text: ${data.feedback}`);
  console.log(sentiment);
  console.log(`Sentiment score: ${sentiment.score}`);
  console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

  let polarity = "neutral";
  if(sentiment.score > 0.2) polarity = "positive";
  else if(sentiment.score < -0.2) polarity = "negative"; 

  await updateFeedback(data,Math.abs(sentiment.score*5),polarity)

}

async function updateFeedback(data,score,polarity){
  try{
        var params = {
            TableName: 'b2b_userFeedback',
            Item: {
                'username':{S: `${data.username}`},
                'feedback': { S: `${data.feedback}` },
                'date': { S: `${new Date()}`},
                'id' : {S:`${data.id}`},
                'score' : {S: `${parseFloat(score).toFixed(1)}`},
                'polarity' : {S: `${polarity}`}
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

exports.helloWorld = async (req, res) => {
  let message = req.query.message || req.body.message || 'Hello World!';
  await quickstart(req.body);
  res.status(200).send(message);
};
