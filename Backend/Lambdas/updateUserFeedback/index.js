var request = require('request');

async function sentment(data){
    
    return new Promise((resolve,reject) => {
                    var options = {
            'method': 'POST',
            'url': 'https://us-central1-csci-5408-w22-340718.cloudfunctions.net/sentimentAnalysisOnFeedback',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
        console.log("here");
        let res = request(options);
        console.log("res = ", JSON.stringify(res));
    });
}

exports.handler = async (event,context) => {

    let dbData = event.Records[0].dynamodb.NewImage;
    console.log(JSON.stringify(event.Records[0].dynamodb.NewImage));


    if(!dbData.score){
        let data = {
            id: dbData.id.S,
            feedback: dbData.feedback.S,
            username: dbData.username.S
        };
        console.log(data);
        await sentment(data);
        console.log("request sent");
    }
    const response = {
        statusCode: 200,
    };
    return response;
};
