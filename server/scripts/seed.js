import mongoose from 'mongoose';
import Product from '../src/models/Product.js';
import Tree from '../src/models/Tree.js';
import dotenv from 'dotenv';
dotenv.config();

const trees = [
  {
    name: 'Mango',
    nameBn: 'আম',
    slug: 'mango',
    sortOrder: 1,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80&auto=format&fit=crop',
    description: 'A beloved tropical fruit tree with sweet, golden varieties.',
    descriptionBn: 'মিষ্টি সোনালি জাতের প্রিয় গ্রীষ্মমন্ডলীয় ফল গাছ।',
  },
  {
    name: 'Guava',
    nameBn: 'পেয়ারা',
    slug: 'guava',
    sortOrder: 2,
    image: 'https://images.unsplash.com/photo-1530878955558-a6c31b9c97db?w=600&q=80&auto=format&fit=crop',
    description: 'Crunchy, vitamin-rich fruit; comes in white and pink flesh varieties.',
    descriptionBn: 'কুঁচকানো ও ভিটামিন সমৃদ্ধ ফল; সাদা ও লাল শাঁসের জাত পাওয়া যায়।',
  },
  {
    name: 'Lemon',
    nameBn: 'লেবু',
    slug: 'lemon',
    sortOrder: 3,
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&q=80&auto=format&fit=crop',
    description: 'A citrus tree grown for its tart, aromatic fruit used daily in kitchens.',
    descriptionBn: 'টক ও সুগন্ধি ফলের জন্য চাষ করা সাইট্রাস গাছ।',
  },
];

const plants = [
  { name: 'Monstera Deliciosa', nameBn: 'মনস্টেরা ডেলিসিওসা', slug: 'monstera-deliciosa', category: 'indoor', price: 1200, oldPrice: 1500, stock: 15, description: 'A stunning tropical plant with large, split leaves that adds a modern touch to any room.', descriptionBn: 'বড় ছিদ্রযুক্ত পাতার এক দারুণ গ্রীষ্মমন্ডলীয় উদ্ভিদ।', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80&auto=format&fit=crop', featured: true, care: { light: 'Indirect bright light', water: 'When soil is dry', soil: 'Well-draining potting mix' } },
  { name: 'Peace Lily', nameBn: 'শান্তি লিলি', slug: 'peace-lily', category: 'indoor', price: 850, oldPrice: null, stock: 30, description: 'Beautiful white spathe flowers and air-purifying qualities.', descriptionBn: 'সুন্দর সাদা ফুল ও বায়ু বিশুদ্ধ করার ক্ষমতা।', image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e8ae5?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Low to moderate indirect light', water: 'Keep soil moist', soil: 'Rich, well-draining soil' } },
  { name: 'Snake Plant', nameBn: 'স্নেক প্ল্যান্ট', slug: 'snake-plant', category: 'indoor', price: 650, oldPrice: 800, stock: 50, description: 'Very hardy plant that tolerates low light and purifies air.', descriptionBn: 'খুবই সহনশীল, কম আলোতে টিকে থাকে ও বায়ু পরিশুদ্ধ করে।', image: 'https://images.unsplash.com/photo-1593482892290-f54924ae0b4d?w=600&q=80&auto=format&fit=crop', featured: true, care: { light: 'Low light', water: 'Water sparingly, let soil dry', soil: 'Well-draining cactus mix' } },
  { name: 'Fiddle Leaf Fig', nameBn: 'ফিডল লিফ ফিগ', slug: 'fiddle-leaf-fig', category: 'indoor', price: 2200, oldPrice: 2800, stock: 8, description: 'Elegant architectural plant with large, violin-shaped leaves.', descriptionBn: 'বড় বেহালা-আকৃতির পাতাযুক্ত সুন্দর উদ্ভিদ।', image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Bright indirect light', water: 'When top inch of soil is dry', soil: 'Rich, well-draining soil' } },
  { name: 'Spider Plant', nameBn: 'স্পাইডার প্ল্যান্ট', slug: 'spider-plant', category: 'indoor', price: 550, oldPrice: null, stock: 20, description: 'Easy-care plant with arching variegated leaves.', descriptionBn: 'ঝুলন্ত বর্ণিল পাতার সহজ যত্নের উদ্ভিদ।', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Bright indirect light', water: 'When soil is dry', soil: 'All-purpose potting mix' } },
  { name: 'Pothos', nameBn: 'পোথোস', slug: 'pothos', category: 'indoor', price: 450, oldPrice: 600, stock: 40, description: 'Trailing vine plant perfect for hanging baskets.', descriptionBn: 'ঝুলন্ত ঝুড়ির জন্য উপযুক্ত লতানো উদ্ভিদ।', image: 'https://images.unsplash.com/photo-1553155964-08bf00e9b1d3?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Bright indirect light', water: 'When soil is dry', soil: 'Well-draining potting mix' } },
  { name: 'Succulent Mix', nameBn: 'সাকুলেন্ট মিশ্রণ', slug: 'succulent-mix', category: 'succulent', price: 700, oldPrice: null, stock: 25, description: 'Assorted low-maintenance succulents in one pot.', descriptionBn: 'এক পাত্রে নানা রকম কম-যত্নের সাকুলেন্ট।', image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Bright direct light', water: 'Water thoroughly, then let soil dry completely', soil: 'Cactus/succulent mix' } },
  { name: 'Spiderwort', nameBn: 'স্পাইডারওয়ার্ট', slug: 'spiderwort', category: 'outdoor', price: 400, oldPrice: null, stock: 35, description: 'Colorful ground cover plant for garden beds.', descriptionBn: 'বাগানের জন্য রঙিন গ্রাউন্ড কভার উদ্ভিদ।', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Full sun to partial shade', water: 'Moderate watering', soil: 'Well-draining garden soil' } },
  { name: 'Basil Seeds', nameBn: 'তুলসি বীজ', slug: 'basil-seeds', category: 'seeds', price: 250, oldPrice: null, stock: 100, description: 'Organic basil seeds to grow your own herbs.', descriptionBn: 'নিজের ভেষজ গাছ বাড়াতে জৈব তুলসি বীজ।', image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Full sun', water: 'Keep soil moist', soil: 'Rich, well-draining soil' } },

  { name: 'Himsagar Mango', nameBn: 'হিমসাগর আম', slug: 'himsagar-mango', category: 'outdoor', tree: 'mango', price: 2200, oldPrice: 2500, stock: 20, description: 'A classic sweet, fiberless Bangladeshi mango variety.', descriptionBn: 'বাংলাদেশের সুপরিচিত মিষ্টি, আঁশহীন আমের জাত।', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Full sun', water: 'Water deeply once a week', soil: 'Rich, sandy loam' } },
  { name: 'Langra Mango', nameBn: 'ল্যাংড়া আম', slug: 'langra-mango', category: 'outdoor', tree: 'mango', price: 2400, oldPrice: null, stock: 15, description: 'A fragrant, sweet variety with green skin even when ripe.', descriptionBn: 'সুগন্ধি মিষ্টি জাত, পাকলেও সবুজ খোসা।', image: 'https://images.unsplash.com/photo-1547512901-dac82d5d9dd7?w=600&q=80&auto=format&fit=crop', featured: true, care: { light: 'Full sun', water: 'Water deeply once a week', soil: 'Rich, sandy loam' } },
  { name: 'Kazi Guava', nameBn: 'কাজি পেয়ারা', slug: 'kazi-guava', category: 'outdoor', tree: 'guava', price: 900, oldPrice: 1100, stock: 25, description: 'A crisp seedless guava cultivar loved for snacks.', descriptionBn: 'খাবারে প্রিয় কুঁচকানো বীজহীন পেয়ারা।', image: 'https://images.unsplash.com/photo-1530878955558-a6c31b9c97db?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Full sun', water: 'Moderate watering', soil: 'Well-draining soil' } },
  { name: 'Bittar Guava', nameBn: 'বিত্তার পেয়ারা', slug: 'bittar-guava', category: 'outdoor', tree: 'guava', price: 850, oldPrice: null, stock: 30, description: 'Large fruited variety with pink sweet flesh.', descriptionBn: 'লাল মিষ্টি শাঁসের বড় ফলের জাত।', image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Full sun', water: 'Moderate watering', soil: 'Well-draining soil' } },
  { name: 'Elachi Lemon', nameBn: 'এলাচি লেবু', slug: 'elachi-lemon', category: 'outdoor', tree: 'lemon', price: 600, oldPrice: null, stock: 40, description: 'Small, fragrant, thin-skinned lemon bursting with juice.', descriptionBn: 'রসে ভরা ছোট সুগন্ধি চিকন-খোসার লেবু।', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&q=80&auto=format&fit=crop', featured: false, care: { light: 'Full sun', water: 'Water when topsoil is dry', soil: 'Well-draining soil' } },
  { name: 'Columbus Lemon', nameBn: 'কলম্বাস লেবু', slug: 'columbus-lemon', category: 'outdoor', tree: 'lemon', price: 680, oldPrice: 780, stock: 18, description: 'Thick-skinned, juicy lemon great for juice and preserves.', descriptionBn: 'রস ও আচারের জন্য চমৎকার মোটা খোসার লেবু।', image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&q=80&auto=format&fit=crop', featured: true, care: { light: 'Full sun', water: 'Water when topsoil is dry', soil: 'Well-draining soil' } },
];

mongoose.connect(process.env.MONGO_URI)
  .then(() => Promise.all([Product.collection.drop(), Tree.collection.drop()]))
  .then(() => Tree.insertMany(trees))
  .then(insertedTrees => {
    const treeByName = Object.fromEntries(insertedTrees.map((t) => [t.slug, t._id]));
    const withTree = plants.map((p) =>
      p.tree ? { ...p, tree: treeByName[p.tree] } : p
    );
    return Product.insertMany(withTree);
  })
  .then(docs => {
    console.log('Seeded', trees.length, 'trees and', docs.length, 'products');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error('Seed error:', err);
    mongoose.disconnect();
  });