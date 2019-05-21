const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('../../cse110-firebase-adminsdk-private-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cse110-6b013.firebaseio.com'
});

const db = admin.firestore();
const usersRef = db.collection('users');

const keys = [];
const values = [];

const migrate = () => usersRef.listDocuments()
  .then((docs) => {
    docs.forEach((doc) => {
      doc.get()
        .then((snap) => {
          if (snap.exists) {
            keys.forEach((key, i) => {
              const value = values[i];
              if (snap.get(key) === undefined) {
                doc.set({[key]: value}, {merge: true})
                  .then(() => console.log(`Added ${key} to user ${doc.id}`))
                  .catch((err) => console.log(err));
              }
            });
          }
        })
        .catch((err) => console.log(err));
    })
  })
  .catch((err) => console.log(err));

const isEven = (num) => {
  return num % 2 == 0;
}

const exit = () => {
  admin.app().delete();
}

if (!isEven(process.argv.length)) {
  console.log('Invalid number of arguments');
  exit();
} else if (process.argv.length == 2) {
  console.log('Enter keys and values, separated by spaces, all on the same line: <key 1> <value 1> <key 2> <value 2>...');
  console.log('Fields are added only if they do not already exist. Existing fields are not overwritten.');
  exit();
}

process.argv.forEach((input, i) => {
  if (i >= 2) {
    input = input.trim();
    
    if (isEven(i)) {
      keys.push(input);
    } else {
      const isString = !input || isNaN(input);
      values.push(isString ? input : parseFloat(input));
    }
  }
})

migrate();
