import { Router } from 'express';
import mongoose from 'mongoose';
import Upload from '../models/Upload.js';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid upload id' });
    }
    const upload = await Upload.findById(req.params.id).lean();
    if (!upload) return res.status(404).json({ error: 'Not found' });
    res.setHeader('Content-Type', upload.contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.end(Buffer.from(upload.data.buffer));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load upload', detail: err.message });
  }
});

export default router;
