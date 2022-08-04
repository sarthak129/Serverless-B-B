const fs = require('firebase-admin');

fs.initializeApp();

const db = fs.firestore();
const usersFeedback = db.collection('userFeedback');

exports.helloWorld = async (req, res) => {
  let message = req.query.message || req.body.message || 'Hello World!';

  const snapshot = await usersFeedback.get();
  let data = snapshot.docs.map(doc => doc.data());
  console.log("data = ", data)
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    res.send({data});
  }
};
