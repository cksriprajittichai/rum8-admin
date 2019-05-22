const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const generateUid = () => {
  const SAMPLE_UID = 'A43GAibFSBQfFLdiOXlhtz3HNMi2';
  const CHAR_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let uid = '';
  while (uid.length < SAMPLE_UID.length) {
    uid += CHAR_SET[getRandomInt(CHAR_SET.length)];
  }

  return uid;
}

const generateEmailFromUid = (uid) => `${uid.substring(0, 10)}@ucsd.edu`;

Object.assign(module.exports, {
  generateUid,
  generateEmailFromUid,
})
