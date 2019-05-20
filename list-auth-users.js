var admin = require('firebase-admin');

// Fetch the service account key JSON file contents
var serviceAccount = require('./cse110-firebase-adminsdk-private-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cse110-6b013.firebaseio.com'
});

// Get the Auth service for the default app
var auth = admin.auth();

const listAuthUsers = () => {
  auth.listUsers()
    .then((result) => result.users.forEach(user => console.log(user)))
    .catch((error) => console.log(error))
    .finally(() => exit());
};

const exit = () => {
  admin.app().delete();
}

listAuthUsers();
