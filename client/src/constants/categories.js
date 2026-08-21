export const CATEGORIES = [
  {
    slug: 'fruit-trees',
    en: 'Fruit Trees',
    bn: 'ফলের গাছ',
    icon: 'fruit',
  },
  {
    slug: 'flower-plants',
    en: 'Flower Plants',
    bn: 'ফুলের গাছ',
    icon: 'flower',
  },
  {
    slug: 'ornamental-plants',
    en: 'Ornamental Plants',
    bn: 'শোভাময় গাছ',
    icon: 'ornamental',
  },
  {
    slug: 'spice-plants',
    en: 'Spice Plants',
    bn: 'মসলা গাছ',
    icon: 'spice',
  },
  {
    slug: 'medicinal-plants',
    en: 'Medicinal Plants',
    bn: 'ঔষধি গাছ',
    icon: 'medicinal',
  },
  {
    slug: 'timber-trees',
    en: 'Timber Trees',
    bn: 'কাঠের গাছ',
    icon: 'timber',
  },
  {
    slug: 'vegetable-plants',
    en: 'Vegetable Plants',
    bn: 'সবজি গাছ',
    icon: 'vegetable',
  },
  {
    slug: 'organic-fertilizer-pesticides',
    en: 'Organic Fertilizer & Pesticides',
    bn: 'জৈব সার ও কীটনাশক',
    icon: 'fertilizer',
  },
  {
    slug: 'pots-geo-bags',
    en: 'Pots & Geo Bags',
    bn: 'টব ও জিও ব্যাগ',
    icon: 'pots',
  },
  {
    slug: 'gardening-tools',
    en: 'Gardening Tools',
    bn: 'বাগান সরঞ্জাম',
    icon: 'tools',
  },
];

export const DEFAULT_SUBCATEGORIES = [
  { slug: 'citrus', en: 'Citrus', bn: 'লেবু জাতীয় ফল', parent: 'fruit-trees', sortOrder: 1 },
  { slug: 'orange', en: 'Orange', bn: 'কমলা', parent: 'citrus', sortOrder: 1 },
  { slug: 'mandarin', en: 'Mandarin', bn: 'ম্যান্ডারিন', parent: 'citrus', sortOrder: 2 },
  { slug: 'kinnow', en: 'Kinnow', bn: 'কিনু', parent: 'citrus', sortOrder: 3 },
  { slug: 'tangerine', en: 'Tangerine', bn: 'ট্যানজারিন', parent: 'citrus', sortOrder: 4 },
  { slug: 'tangelo', en: 'Tangelo', bn: 'ট্যাঙেলো', parent: 'citrus', sortOrder: 5 },
  { slug: 'tangor', en: 'Tangor', bn: 'ট্যাঙ্গর', parent: 'citrus', sortOrder: 6 },
  { slug: 'grapefruit', en: 'Grapefruit', bn: 'গ্রেপফ্রুট', parent: 'citrus', sortOrder: 7 },
  { slug: 'pomelo', en: 'Pomelo', bn: 'পমেলো', parent: 'citrus', sortOrder: 8 },
  { slug: 'kumquat', en: 'Kumquat', bn: 'কুমকোয়াট', parent: 'citrus', sortOrder: 9 },
  { slug: 'pomegranate', en: 'Pomegranate', bn: 'ডালিম', parent: 'fruit-trees', sortOrder: 2 },
  { slug: 'apple', en: 'Apple', bn: 'আপেল', parent: 'fruit-trees', sortOrder: 3 },
  { slug: 'longan', en: 'Longan', bn: 'লংগান', parent: 'fruit-trees', sortOrder: 4 },
  { slug: 'grapes', en: 'Grapes', bn: 'আঙুর', parent: 'fruit-trees', sortOrder: 5 },
  { slug: 'white-sapote', en: 'White Sapote', bn: 'হোয়াইট সাপোটা', parent: 'fruit-trees', sortOrder: 6 },
  { slug: 'persimmon', en: 'Persimmon', bn: 'পার্সিমন', parent: 'fruit-trees', sortOrder: 7 },
  { slug: 'rambutan', en: 'Rambutan', bn: 'রামবুটান', parent: 'fruit-trees', sortOrder: 8 },
  { slug: 'native-flower-plants', en: 'Native Flower Plants', bn: 'দেশি ফুলের গাছ', parent: 'flower-plants', sortOrder: 1 },
  { slug: 'exotic-flower-plants', en: 'Exotic Flower Plants', bn: 'বিদেশি ফুলের গাছ', parent: 'flower-plants', sortOrder: 2 },
  { slug: 'all-season-flower-plants', en: 'All-Season Flower Plants', bn: 'সারাবছর ফুলের গাছ', parent: 'flower-plants', sortOrder: 3 },
  { slug: 'indoor-ornamental-plants', en: 'Indoor Ornamental Plants', bn: 'ঘরের ভেতরের শোভাময় গাছ', parent: 'ornamental-plants', sortOrder: 1 },
  { slug: 'outdoor-ornamental-plants', en: 'Outdoor Ornamental Plants', bn: 'বাইরের শোভাময় গাছ', parent: 'ornamental-plants', sortOrder: 2 },
  { slug: 'bonsai-topiary', en: 'Bonsai & Topiary', bn: 'বনসাই ও টোপিয়ারি', parent: 'ornamental-plants', sortOrder: 3 },
  { slug: 'native-spice-plants', en: 'Native Spice Plants', bn: 'দেশি মসলা গাছ', parent: 'spice-plants', sortOrder: 1 },
  { slug: 'exotic-spice-plants', en: 'Exotic Spice Plants', bn: 'বিদেশি মসলা গাছ', parent: 'spice-plants', sortOrder: 2 },
  { slug: 'home-garden-spice-plants', en: 'Home Garden Spice Plants', bn: 'ঘরের বাগানের মসলা গাছ', parent: 'spice-plants', sortOrder: 3 },
  { slug: 'ayurvedic-medicinal-plants', en: 'Ayurvedic Medicinal Plants', bn: 'আয়ুর্বেদিক ঔষধি গাছ', parent: 'medicinal-plants', sortOrder: 1 },
  { slug: 'herbal-tea-plants', en: 'Herbal Tea Plants', bn: 'হারবাল চা গাছ', parent: 'medicinal-plants', sortOrder: 2 },
  { slug: 'aromatic-medicinal-plants', en: 'Aromatic Medicinal Plants', bn: 'সুগন্ধি ঔষধি গাছ', parent: 'medicinal-plants', sortOrder: 3 },
  { slug: 'fast-growing-timber-trees', en: 'Fast-Growing Timber Trees', bn: 'দ্রুতবর্ধমান কাঠের গাছ', parent: 'timber-trees', sortOrder: 1 },
  { slug: 'premium-timber-trees', en: 'Premium Timber Trees', bn: 'উন্নত কাঠের গাছ', parent: 'timber-trees', sortOrder: 2 },
  { slug: 'shade-timber-trees', en: 'Shade & Timber Trees', bn: 'ছায়া ও কাঠের গাছ', parent: 'timber-trees', sortOrder: 3 },
  { slug: 'leafy-vegetable-plants', en: 'Leafy Vegetable Plants', bn: 'পাতাজাতীয় সবজি', parent: 'vegetable-plants', sortOrder: 1 },
  { slug: 'fruit-vegetable-plants', en: 'Fruit Vegetable Plants', bn: 'ফলজাতীয় সবজি', parent: 'vegetable-plants', sortOrder: 2 },
  { slug: 'root-vegetable-plants', en: 'Root Vegetable Plants', bn: 'শিকড়জাতীয় সবজি', parent: 'vegetable-plants', sortOrder: 3 },
  { slug: 'organic-fertilizers', en: 'Organic Fertilizers', bn: 'জৈব সার', parent: 'organic-fertilizer-pesticides', sortOrder: 1 },
  { slug: 'organic-pesticides', en: 'Organic Pesticides', bn: 'জৈব কীটনাশক', parent: 'organic-fertilizer-pesticides', sortOrder: 2 },
  { slug: 'compost-soil-conditioners', en: 'Compost & Soil Conditioners', bn: 'কম্পোস্ট ও মাটি উন্নয়ন উপকরণ', parent: 'organic-fertilizer-pesticides', sortOrder: 3 },
  { slug: 'plastic-ceramic-pots', en: 'Plastic & Ceramic Pots', bn: 'প্লাস্টিক ও সিরামিক টব', parent: 'pots-geo-bags', sortOrder: 1 },
  { slug: 'geo-bags', en: 'Geo Bags', bn: 'জিও ব্যাগ', parent: 'pots-geo-bags', sortOrder: 2 },
  { slug: 'hanging-wall-pots', en: 'Hanging & Wall Pots', bn: 'ঝুলন্ত ও দেয়াল টব', parent: 'pots-geo-bags', sortOrder: 3 },
  { slug: 'hand-tools', en: 'Hand Tools', bn: 'হাতিয়ার', parent: 'gardening-tools', sortOrder: 1 },
  { slug: 'watering-equipment', en: 'Watering Equipment', bn: 'পানি দেওয়ার সরঞ্জাম', parent: 'gardening-tools', sortOrder: 2 },
  { slug: 'plant-care-accessories', en: 'Plant Care Accessories', bn: 'গাছের যত্নের সামগ্রী', parent: 'gardening-tools', sortOrder: 3 },
];

let subcategoryList = DEFAULT_SUBCATEGORIES;

export const setSubcategories = (list) => {
  subcategoryList =
    Array.isArray(list) && list.length
      ? [...list].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      : DEFAULT_SUBCATEGORIES;
};

export const getSubcategories = () => subcategoryList;

export const allCategorySlugs = () => [
  ...CATEGORIES.map((c) => c.slug),
  ...subcategoryList.map((s) => s.slug),
];

export const categoryBySlug = (slug) =>
  CATEGORIES.find((c) => c.slug === slug) ||
  subcategoryList.find((s) => s.slug === slug) ||
  null;

export const categoryName = (slug, bn) => {
  const found = categoryBySlug(slug);
  if (found) return bn ? found.bn : found.en;
  return slug || '';
};

export const subcategoriesOf = (slug) => subcategoryList.filter((s) => s.parent === slug);

export const parentSlugOf = (slug) =>
  subcategoryList.find((s) => s.slug === slug)?.parent || null;

export const categoryChain = (slug) => {
  const chain = [];
  let current = slug;
  let guard = 0;
  while (current && guard < 10) {
    chain.push(current);
    current = parentSlugOf(current);
    guard += 1;
  }
  return chain;
};

export const rootSlugOf = (slug) => {
  const chain = categoryChain(slug);
  return chain[chain.length - 1] || slug;
};

// A view shows products assigned to the active category or directly under it.
// Deeper nested variety products appear only when their own variant is selected,
// e.g. Orange/Mandarin saplings show under Citrus, not under All Fruit Trees.
export const categoryMatches = (productCategory, active) => {
  if (!active || active === 'all') return true;
  if (productCategory === active) return true;
  return parentSlugOf(productCategory) === active;
};
