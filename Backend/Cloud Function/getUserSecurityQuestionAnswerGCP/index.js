const fs = require('firebase-admin');

fs.initializeApp();

const db = fs.firestore();
const usersDb = db.collection('userDetails');

exports.helloWorld = async (req, res) => {
  try {
    console.log("body == ", req.body);
    let response = {};
    if (req.body.username) {
      const snapshot = await usersDb.where('username', '==', req.body.username).get();
      if (snapshot.empty) {
        response = {
          statusCode: 422,
          message: "Invalid User Details"
        };
      } else {
        console.log("doc === ", snapshot.docs);
        response = {
          answer: snapshot.docs[0]._fieldsProto.securityAnswer.stringValue,
          question: snapshot.docs[0]._fieldsProto.securityQuestion.stringValue,
          cipher: snapshot.docs[0]._fieldsProto.cipher.integerValue
        }
      }
    } else {
      response = {
        statusCode: 422,
        message: "body missing"
      };
    }
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', '*');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
    } else {
      res.status(200).send(response);
    }
  } catch (e) {
    console.log(e);
    res.set('Access-Control-Allow-Origin', '*');
    res.status(500).send();
  }
};