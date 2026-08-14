import { onRequest } from 'firebase-functions/v2/https';
import app from './index.js';

export const api = onRequest(
  {
    region: 'asia-south1',
    maxInstances: 10,
  },
  app
);
