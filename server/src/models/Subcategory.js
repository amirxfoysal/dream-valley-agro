import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, trim: true, default: '' },
    slug: { type: String, unique: true, index: true },
    parent: { type: String, required: true, trim: true, index: true },
    image: { type: String, trim: true, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

subcategorySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-') +
      '-' +
      Date.now().toString(36);
  }
  next();
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

export const MAIN_CATEGORY_SLUGS = [
  'fruit-trees',
  'flower-plants',
  'ornamental-plants',
  'spice-plants',
  'medicinal-plants',
  'timber-trees',
  'vegetable-plants',
  'organic-fertilizer-pesticides',
  'pots-geo-bags',
  'gardening-tools',
];

export const DEFAULT_SUBCATEGORIES = [
  { name: 'Citrus', nameBn: 'লেবু জাতীয় ফল', slug: 'citrus', parent: 'fruit-trees', sortOrder: 1 },
  { name: 'Orange', nameBn: 'কমলা', slug: 'orange', parent: 'citrus', sortOrder: 1 },
  { name: 'Mandarin', nameBn: 'ম্যান্ডারিন', slug: 'mandarin', parent: 'citrus', sortOrder: 2 },
  { name: 'Kinnow', nameBn: 'কিনু', slug: 'kinnow', parent: 'citrus', sortOrder: 3 },
  { name: 'Tangerine', nameBn: 'ট্যানজারিন', slug: 'tangerine', parent: 'citrus', sortOrder: 4 },
  { name: 'Tangelo', nameBn: 'ট্যাঙেলো', slug: 'tangelo', parent: 'citrus', sortOrder: 5 },
  { name: 'Tangor', nameBn: 'ট্যাঙ্গর', slug: 'tangor', parent: 'citrus', sortOrder: 6 },
  { name: 'Grapefruit', nameBn: 'গ্রেপফ্রুট', slug: 'grapefruit', parent: 'citrus', sortOrder: 7 },
  { name: 'Pomelo', nameBn: 'পমেলো', slug: 'pomelo', parent: 'citrus', sortOrder: 8 },
  { name: 'Kumquat', nameBn: 'কুমকোয়াট', slug: 'kumquat', parent: 'citrus', sortOrder: 9 },
  { name: 'Pomegranate', nameBn: 'ডালিম', slug: 'pomegranate', parent: 'fruit-trees', sortOrder: 2 },
  { name: 'Apple', nameBn: 'আপেল', slug: 'apple', parent: 'fruit-trees', sortOrder: 3 },
  { name: 'Longan', nameBn: 'লংগান', slug: 'longan', parent: 'fruit-trees', sortOrder: 4 },
  { name: 'Grapes', nameBn: 'আঙুর', slug: 'grapes', parent: 'fruit-trees', sortOrder: 5 },
  { name: 'White Sapote', nameBn: 'হোয়াইট সাপোটা', slug: 'white-sapote', parent: 'fruit-trees', sortOrder: 6 },
  { name: 'Persimmon', nameBn: 'পার্সিমন', slug: 'persimmon', parent: 'fruit-trees', sortOrder: 7 },
  { name: 'Rambutan', nameBn: 'রামবুটান', slug: 'rambutan', parent: 'fruit-trees', sortOrder: 8 },
  { name: 'Native Flower Plants', nameBn: 'দেশি ফুলের গাছ', slug: 'native-flower-plants', parent: 'flower-plants', sortOrder: 1 },
  { name: 'Exotic Flower Plants', nameBn: 'বিদেশি ফুলের গাছ', slug: 'exotic-flower-plants', parent: 'flower-plants', sortOrder: 2 },
  { name: 'All-Season Flower Plants', nameBn: 'সারাবছর ফুলের গাছ', slug: 'all-season-flower-plants', parent: 'flower-plants', sortOrder: 3 },
  { name: 'Indoor Ornamental Plants', nameBn: 'ঘরের ভেতরের শোভাময় গাছ', slug: 'indoor-ornamental-plants', parent: 'ornamental-plants', sortOrder: 1 },
  { name: 'Outdoor Ornamental Plants', nameBn: 'বাইরের শোভাময় গাছ', slug: 'outdoor-ornamental-plants', parent: 'ornamental-plants', sortOrder: 2 },
  { name: 'Bonsai & Topiary', nameBn: 'বনসাই ও টোপিয়ারি', slug: 'bonsai-topiary', parent: 'ornamental-plants', sortOrder: 3 },
  { name: 'Native Spice Plants', nameBn: 'দেশি মসলা গাছ', slug: 'native-spice-plants', parent: 'spice-plants', sortOrder: 1 },
  { name: 'Exotic Spice Plants', nameBn: 'বিদেশি মসলা গাছ', slug: 'exotic-spice-plants', parent: 'spice-plants', sortOrder: 2 },
  { name: 'Home Garden Spice Plants', nameBn: 'ঘরের বাগানের মসলা গাছ', slug: 'home-garden-spice-plants', parent: 'spice-plants', sortOrder: 3 },
  { name: 'Ayurvedic Medicinal Plants', nameBn: 'আয়ুর্বেদিক ঔষধি গাছ', slug: 'ayurvedic-medicinal-plants', parent: 'medicinal-plants', sortOrder: 1 },
  { name: 'Herbal Tea Plants', nameBn: 'হারবাল চা গাছ', slug: 'herbal-tea-plants', parent: 'medicinal-plants', sortOrder: 2 },
  { name: 'Aromatic Medicinal Plants', nameBn: 'সুগন্ধি ঔষধি গাছ', slug: 'aromatic-medicinal-plants', parent: 'medicinal-plants', sortOrder: 3 },
  { name: 'Fast-Growing Timber Trees', nameBn: 'দ্রুতবর্ধমান কাঠের গাছ', slug: 'fast-growing-timber-trees', parent: 'timber-trees', sortOrder: 1 },
  { name: 'Premium Timber Trees', nameBn: 'উন্নত কাঠের গাছ', slug: 'premium-timber-trees', parent: 'timber-trees', sortOrder: 2 },
  { name: 'Shade & Timber Trees', nameBn: 'ছায়া ও কাঠের গাছ', slug: 'shade-timber-trees', parent: 'timber-trees', sortOrder: 3 },
  { name: 'Leafy Vegetable Plants', nameBn: 'পাতাজাতীয় সবজি', slug: 'leafy-vegetable-plants', parent: 'vegetable-plants', sortOrder: 1 },
  { name: 'Fruit Vegetable Plants', nameBn: 'ফলজাতীয় সবজি', slug: 'fruit-vegetable-plants', parent: 'vegetable-plants', sortOrder: 2 },
  { name: 'Root Vegetable Plants', nameBn: 'শিকড়জাতীয় সবজি', slug: 'root-vegetable-plants', parent: 'vegetable-plants', sortOrder: 3 },
  { name: 'Organic Fertilizers', nameBn: 'জৈব সার', slug: 'organic-fertilizers', parent: 'organic-fertilizer-pesticides', sortOrder: 1 },
  { name: 'Organic Pesticides', nameBn: 'জৈব কীটনাশক', slug: 'organic-pesticides', parent: 'organic-fertilizer-pesticides', sortOrder: 2 },
  { name: 'Compost & Soil Conditioners', nameBn: 'কম্পোস্ট ও মাটি উন্নয়ন উপকরণ', slug: 'compost-soil-conditioners', parent: 'organic-fertilizer-pesticides', sortOrder: 3 },
  { name: 'Plastic & Ceramic Pots', nameBn: 'প্লাস্টিক ও সিরামিক টব', slug: 'plastic-ceramic-pots', parent: 'pots-geo-bags', sortOrder: 1 },
  { name: 'Geo Bags', nameBn: 'জিও ব্যাগ', slug: 'geo-bags', parent: 'pots-geo-bags', sortOrder: 2 },
  { name: 'Hanging & Wall Pots', nameBn: 'ঝুলন্ত ও দেয়াল টব', slug: 'hanging-wall-pots', parent: 'pots-geo-bags', sortOrder: 3 },
  { name: 'Hand Tools', nameBn: 'হাতিয়ার', slug: 'hand-tools', parent: 'gardening-tools', sortOrder: 1 },
  { name: 'Watering Equipment', nameBn: 'পানি দেওয়ার সরঞ্জাম', slug: 'watering-equipment', parent: 'gardening-tools', sortOrder: 2 },
  { name: 'Plant Care Accessories', nameBn: 'গাছের যত্নের সামগ্রী', slug: 'plant-care-accessories', parent: 'gardening-tools', sortOrder: 3 },
];

export const REMOVED_DEFAULT_SLUGS = [
  'native-fruit-trees',
  'exotic-fruit-trees',
  'all-season-fruit-trees',
  'australian-pomegranate',
  'angel-red-pomegranate',
  'granada-pomegranate',
  'sharad-king-pomegranate',
  'anna-apple',
  'kashmiri-apple',
  'golden-dorset-apple',
  'four-season-longan',
  'white-longan',
  'ruby-longan',
  'baikunur-grapes',
  'academic-grapes',
  'jupiter-grapes',
  'w4',
  'champion-red',
  'fuyu',
  'harbofuride',
  'japanese-1',
  'n18',
  'school-boy',
];

export const ensureDefaultSubcategories = async () => {
  const count = await Subcategory.countDocuments();
  if (count === 0) {
    try {
      await Subcategory.insertMany(DEFAULT_SUBCATEGORIES, { ordered: false });
    } catch {
      // duplicate slugs on concurrent seeding — ignore
    }
    return;
  }

  try {
    const removed = await Subcategory.deleteMany({ slug: { $in: REMOVED_DEFAULT_SLUGS } });
    if (removed.deletedCount > 0) {
      const { default: Product } = await import('./Product.js');
      await Product.updateMany(
        { category: { $in: REMOVED_DEFAULT_SLUGS } },
        { $set: { category: 'fruit-trees' } }
      );
    }

    const existing = await Subcategory.find({
      slug: { $in: DEFAULT_SUBCATEGORIES.map((d) => d.slug) },
    })
      .select('slug')
      .lean();
    const existingSlugs = new Set(existing.map((s) => s.slug));
    const missing = DEFAULT_SUBCATEGORIES.filter((d) => !existingSlugs.has(d.slug));
    if (missing.length > 0) {
      await Subcategory.insertMany(missing, { ordered: false });
    }

    // Re-parent misplaced defaults (e.g. a manually created 'orange' left under fruit-trees)
    for (const def of DEFAULT_SUBCATEGORIES) {
      await Subcategory.updateOne(
        { slug: def.slug, parent: { $ne: def.parent } },
        { $set: { parent: def.parent, sortOrder: def.sortOrder } }
      );
    }
  } catch {
    // migration issues shouldn't break the request — ignore
  }
};

export default Subcategory;
