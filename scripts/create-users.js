const admin = require('firebase-admin');
const serviceAccount = require('../cse110-firebase-adminsdk-private-key.json'); // Fetch the service account key JSON file contents
const csv = require('fast-csv');
const fs = require('fs');
const {generateUid, generateEmailFromUid} = require('./util.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cse110-6b013.firebaseio.com'
});

const auth = admin.auth();
const db = admin.firestore();
const usersRef = db.collection('users');

const createAuthUser = (authUser) => auth.createUser(authUser);

const createDbUser = (uid, user) => usersRef.doc(uid).set(user);

const exit = () => admin.app().delete()

const createBaseUser = (onComplete) => {
  const baseUser = {};

  const USER_FIELDS_CSV = './user_fields.csv';
  const stream = fs.createReadStream(USER_FIELDS_CSV);

  const csvStream = csv()
    .on('data', (line) => {
      let [key, value] = line;
      const valueIsString = !value || isNaN(value);
      if (!valueIsString) {
        value = parseFloat(value);
      } else if (value === '{}') {
        value = {};
      }
      baseUser[key] = value;
    })
    .on('end', () => {
      onComplete(baseUser);
    });

  stream.pipe(csvStream);
}

const onCreateBaseUserSuccess = (baseUser) => {
  for (let i = 0; i < numUsersToCreate; i++) {
    const uid = generateUid();

    createAuthUser({
      uid,
      email: generateEmailFromUid(uid),
      emailVerified: true,
      password: 'password'
    })
      .then((userRecord) => {
        console.log(`Created new auth user: ${userRecord.uid}`);

        const dbUser = Object.assign({}, baseUser, {email: userRecord.email});
        createDbUser(userRecord.uid, dbUser)
          .then(() => console.log(`Created new database user: ${userRecord.uid}`))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
}

if (process.argv.length !== 3) {
  console.log('Invalid number of arguments');
  console.log('Enter the number of users to create');
  exit();
} else if (isNaN(process.argv[2])) {
  console.log('Invalid argument type');
  console.log('Enter the number of users to create');
  exit();
}

const numUsersToCreate = parseInt(process.argv[2]);

createBaseUser(onCreateBaseUserSuccess);
