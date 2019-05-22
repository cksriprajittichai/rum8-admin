const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('../cse110-firebase-adminsdk-private-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cse110-6b013.firebaseio.com'
});

// Get the Auth service for the default app
const auth = admin.auth();

const listAuthUsers = () => {
  auth.listUsers()
    .then((result) => result.users.forEach(user => console.log(user)))
    .catch((err) => console.log(err))
    .finally(() => exit());
};

const exit = () => admin.app().delete();

listAuthUsers();
