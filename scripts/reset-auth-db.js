const admin = require('firebase-admin');
const serviceAccount = require('../cse110-firebase-adminsdk-private-key.json'); // Fetch the service account key JSON file contents

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cse110-6b013.firebaseio.com'
});

const auth = admin.auth();

const deleteAuthUsers = () => {
  auth.listUsers()
    .then((result) => result.users.forEach((userRecord) => {
      const userId = userRecord.uid;

      auth.deleteUser(userId)
        .then(() => console.log(`Deleted auth user: ${userId}`))
        .catch((err) => console.log(err));
    }))
    .catch((err) => console.log(err))
    .finally(() => exit());
};

const exit = () => admin.app().delete()

deleteAuthUsers();
