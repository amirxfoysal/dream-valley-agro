import admin from '../src/config/firebase.js';

const email = '';
const password = '';

try {
  const user = await admin.auth().getUserByEmail(email);
  const updated = await admin.auth().updateUser(user.uid, { password });
  console.log('Password set successfully for', email);
  console.log('providers now:', JSON.stringify(updated.providerData?.map((p) => p.providerId)));
} catch (err) {
  console.error('Error:', err.code, err.message);
  process.exit(1);
}
process.exit(0);
