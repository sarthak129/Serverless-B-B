const fs = require('firebase-admin');

fs.initializeApp();

const db = fs.firestore();
const usersDb = db.collection('userDetails');

exports.helloWorld = async (req, res) => {
  await usersDb.doc().set({
    username: req.body.username,
    securityQuestion: req.body.securityQuestion,
    securityAnswer: req.body.securityAnswer,
    cipher: req.body.cipher
  });

  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    res.send({
      data: {},
      message: "User registered successfully"
    });
  }
};
