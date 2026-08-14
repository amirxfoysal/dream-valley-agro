import admin from '../config/firebase.js';

const getAuth = () => admin.auth();

export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  try {
    const idToken = header.split(' ')[1];
    const decoded = await getAuth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireAdmin = (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const claimAdmin = user.admin === true;
  const adminEmails = (process.env.FIREBASE_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const adminUids = (process.env.FIREBASE_ADMIN_UIDS || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

  const isEmailAdmin = adminEmails.includes((user.email || '').toLowerCase());
  const isUidAdmin = adminUids.includes(user.uid);

  if (!claimAdmin && !isEmailAdmin && !isUidAdmin) {
    return res.status(403).json({ error: 'Forbidden: not an admin' });
  }

  next();
};