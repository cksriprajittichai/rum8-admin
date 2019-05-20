const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('../cse110-firebase-adminsdk-private-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cse110-6b013.firebaseio.com'
});

const db = admin.firestore();
const usersRef = db.collection('users');

const listUsers = () => usersRef.listDocuments()
  .then((docs) => {
    docs.forEach((doc) => {
      doc.get()
        .then((snap) => {
          if (snap.exists) {
            const user = snap.data();
            console.log(`>>> document UID: ${doc.id}`);
            console.log(JSON.stringify(user, Object.keys(user).sort(), 2));
            console.log('*'.repeat(40));
          }
        })
        .catch((err) => console.log(err));
    })
  })
  .catch((err) => console.log(err));

listUsers();
