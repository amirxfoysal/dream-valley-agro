import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subcategory, { DEFAULT_SUBCATEGORIES } from '../src/models/Subcategory.js';

dotenv.config();

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await Subcategory.find({ slug: { $in: DEFAULT_SUBCATEGORIES.map((d) => d.slug) } })
    .select('slug')
    .lean();
  const existingSlugs = new Set(existing.map((s) => s.slug));
  const missing = DEFAULT_SUBCATEGORIES.filter((d) => !existingSlugs.has(d.slug));
  if (missing.length === 0) {
    console.log('All default subcategories already exist. Nothing to seed.');
  } else {
    await Subcategory.insertMany(missing, { ordered: false });
    console.log(`Seeded ${missing.length} subcategories:`);
    missing.forEach((m) => console.log(` - ${m.parent} / ${m.name} (${m.slug})`));
  }
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
