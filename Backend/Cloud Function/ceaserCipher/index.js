let { caesar } = require('simple-cipher-js');

async function verifyceaserCipher(data) {
  try{
  console.log("data = ",data);
    let encrypted = caesar.encrypt(data.rawText, data.cipher);

    console.log(encrypted)

    return encrypted === data.encryptedText ? true : false;
  }catch(e){
    console.log(e);
    return false;
  }
}

exports.helloWorld = async (req, res) => {

  console.log("req.body = ", req.body);
  let status = await verifyceaserCipher(req.body)

  let response = {};

  res.set('Access-Control-Allow-Origin', '*');

  if(status){
    response.statusCode = 200,
    response.message = "User verified successfully"
  }else{
    response.statusCode = 422,
    response.message = "Invalid ceaser cipher"
  }

if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    res.send(response);
  }
  
};
