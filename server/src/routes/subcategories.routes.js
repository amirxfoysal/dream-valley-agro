import { Router } from 'express';
import Subcategory, { ensureDefaultSubcategories } from '../models/Subcategory.js';
import { errDetail } from '../utils/errors.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    await ensureDefaultSubcategories();
    const subs = await Subcategory.find().sort({ parent: 1, sortOrder: 1, name: 1 }).lean();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load subcategories', detail: errDetail(err) });
  }
});

export default router;
