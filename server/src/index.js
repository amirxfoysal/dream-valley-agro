import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { verifyToken, requireAdmin } from './middleware/auth.js';
import { rateLimit } from './middleware/rateLimit.js';
import adminRoutes from './routes/admin.routes.js';
import productsRoutes from './routes/products.routes.js';
import profileRoutes from './routes/profile.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import adminProductsRoutes from './routes/admin/products.routes.js';
import adminOrdersRoutes from './routes/admin/orders.routes.js';
import adminTreesRoutes from './routes/admin/trees.routes.js';
import adminSubcategoriesRoutes from './routes/admin/subcategories.routes.js';
import adminCustomersRoutes from './routes/admin/customers.routes.js';
import adminCourierRoutes from './routes/admin/courier.routes.js';
import treesRoutes from './routes/trees.routes.js';
import subcategoriesRoutes from './routes/subcategories.routes.js';
import trackingRoutes from './routes/tracking.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// CORS allowlist: env override, otherwise production domain + local dev.
const extraOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  'https://dreamvalleyagro.com',
  'https://www.dreamvalleyagro.com',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  ...extraOrigins,
]);

const corsOrigin = (origin, callback) => {
  // Requests without an Origin (curl, health checks) are allowed;
  // disallowed origins get no CORS headers, so browsers block them.
  if (!origin || allowedOrigins.has(origin)) return callback(null, true);
  return callback(null, false);
};

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Basic security headers
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Referrer-Policy', 'no-referrer');
  res.set('Permitted-Cross-Domain-Policies', 'none');
  next();
});

connectDB();

// Rate limits
const globalLimiter = rateLimit({ name: 'global', windowMs: 60_000, max: 300 });
const trackingLimiter = rateLimit({ name: 'tracking', windowMs: 60_000, max: 20 });
const orderLimiter = rateLimit({ name: 'orders', windowMs: 60_000, max: 10 });

app.use(globalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'dream-valley-agro-api' });
});

app.use('/api/products', productsRoutes);
app.use('/api/trees', treesRoutes);
app.use('/api/subcategories', subcategoriesRoutes);
app.use('/api/profile', verifyToken, profileRoutes);
app.use('/api/orders', orderLimiter, verifyToken, ordersRoutes);
app.use('/api/tracking', trackingLimiter, trackingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', verifyToken, requireAdmin, adminProductsRoutes);
app.use('/api/admin/orders', verifyToken, requireAdmin, adminOrdersRoutes);
app.use('/api/admin/trees', verifyToken, requireAdmin, adminTreesRoutes);
app.use('/api/admin/subcategories', verifyToken, requireAdmin, adminSubcategoriesRoutes);
app.use('/api/admin/customers', verifyToken, requireAdmin, adminCustomersRoutes);
app.use('/api/admin/courier', verifyToken, requireAdmin, adminCourierRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;

// Only listen when running locally (npm run dev / npm start).
// On Firebase Cloud Functions (Cloud Run), K_SERVICE is set and the
// function runtime handles serving — listening here would crash it.
if (!process.env.K_SERVICE) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
