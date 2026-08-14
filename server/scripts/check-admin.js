import '../src/config/db.js';
import admin from '../src/config/firebase.js';

const email = 'saniat369@gmail.com';

try {
  const user = await admin.auth().getUserByEmail(email);
  console.log('User exists');
  console.log('uid:', user.uid);
  console.log('emailVerified:', user.emailVerified);
  console.log('providers:', JSON.stringify(user.providerData?.map((p) => ({ uid: p.uid, providerId: p.providerId, email: p.email }) || [])));
  console.log('customClaims:', JSON.stringify(user.customClaims));
  console.log('disabled:', user.disabled);
} catch (err) {
  if (err.code === 'auth/user-not-found') {
    console.log('USER NOT FOUND in Firebase Auth');
  } else {
    console.error('Error:', err.code, err.message);
  }
}
process.exit(0);