import { Router } from 'express';
import Product from '../models/Product.js';
import { errDetail } from '../utils/errors.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, featured, tree } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (tree) filter.tree = tree;
    const products = await Product.find(filter)
      .populate('tree', 'name nameBn slug')
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products', detail: errDetail(err) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load product', detail: errDetail(err) });
  }
});

export default router;