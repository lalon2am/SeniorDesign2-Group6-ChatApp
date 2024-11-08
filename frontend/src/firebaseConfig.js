const admin = require('firebase-admin');

const serviceAccount = require('./path/to/serviceAccountKey.json'); // Replace with your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chatmessaging-app-f9d62.firebaseio.com", // Replace with your project ID
});

const firestore = admin.firestore();

module.exports = { firestore };