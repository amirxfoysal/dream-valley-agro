import { Router } from 'express';
import Product from '../../models/Product.js';

const router = Router();

const safeUrl = (value) => {
  const s = String(value || '').trim();
  if (/^https?:\/\//i.test(s) || s.startsWith('/')) return s;
  return '';
};

const clean = (body) => {
  const rawImages = Array.isArray(body.images)
    ? body.images
    : body.image
      ? [body.image]
      : [];
  const images = [...new Set(rawImages.map((s) => safeUrl(s)).filter(Boolean))].slice(0, 5);

  return {
    name: (body.name || '').trim(),
    nameBn: (body.nameBn || '').trim(),
    category: (body.category || 'indoor').trim(),
    tree: body.tree === '' || body.tree == null ? null : body.tree,
    price: Number(body.price),
    oldPrice: body.oldPrice === '' || body.oldPrice == null ? null : Number(body.oldPrice),
    stock: Number(body.stock ?? 0),
    description: (body.description || '').trim(),
    descriptionBn: (body.descriptionBn || '').trim(),
    image: images[0] || '',
    images,    care: {
      light: (body.care?.light || '').trim(),
      water: (body.care?.water || '').trim(),
      soil: (body.care?.soil || '').trim(),
    },
    featured: Boolean(body.featured),
  };
};

router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('tree', 'name nameBn slug')
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products', detail: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = clean(req.body);
    if (!data.name || !Number.isFinite(data.price) || data.price < 0) {
      return res.status(400).json({ error: 'Name and a valid price are required' });
    }
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', detail: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = clean(req.body);
    if (!data.name || !Number.isFinite(data.price) || data.price < 0) {
      return res.status(400).json({ error: 'Name and a valid price are required' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', detail: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', detail: err.message });
  }
});

export default router;