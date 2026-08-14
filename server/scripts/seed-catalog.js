import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/Product.js';
import Tree from '../src/models/Tree.js';

dotenv.config();

const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`;

const POOLS = {
  fruit: [
    '1553279768-865429fa0078', '1530878955558-a6c31b9c97db', '1549007953-2f2dc0b24019',
    '1590502593747-42a996133562', '1584556812952-905ffd0c611a', '1591073113125-e46713c829ed',
    '1526318472351-c75fcf070305', '1528825871115-3581a5387919', '1571771894821-ce9b6c11b08e',
  ],
  flower: [
    '1490750967868-88aa4486c946', '1457089328109-e5d9bd499191', '1526047932273-341f2a7631f9',
    '1470509037663-253afd7f0f51', '1508610048659-a06b669e3321',
  ],
  plant: [
    '1614594975525-e45190c55d0b', '1509423350716-97f9360b4e09', '1485955900006-10f4d324d411',
    '1463320898484-cdee8141c787', '1552083375-1447ce886485', '1520412099551-62b6bafeb5bb',
    '1524247108137-732e0f642303', '1545241047-6083a3684587', '1463320726281-696a485928c7',
  ],
  herb: [
    '1471193945509-9ad0617afabf', '1615485290382-441e4d049cb5', '1530610476181-d83430b64dcd',
    '1519699047748-de8e457a634e', '1499002238440-d264edd596ec',
  ],
  veg: [
    '1542838132-92c53300491e', '1518977676601-b53f82aba655', '1540420773420-3366772f4999',
    '1506617564039-2f3b650b7010', '1597362925123-77861d3fbac7', '1500937386664-56d1dfef3854',
    '1561136594-7f68413baa99', '1610832958506-aa56368176cf',
  ],
  tool: [
    '1589923188900-85dae523342b', '1585129777188-94600bc7b4b3', '1591857177580-dc82b9ac4e1e',
    '1446071103084-c257b5f70672',
  ],
  pot: [
    '1416879595882-3373a0480b5b', '1524650359799-842906ca1c06', '1463320726281-696a485928c7',
    '1469796466635-455ede028aca',
  ],
  soil: ['1625246333195-78d9c38ad449', '1587049352846-4a222e784d38'],
  forest: [
    '1509316975850-ff9c5deb0cd9', '1473445730015-841f29a9490b', '1448375240586-882707db888b',
    '1470119693884-47d3a1d1f180',
  ],
};

const pick = (pool, i) => IMG(POOLS[pool][i % POOLS[pool].length]);

const trees = [
  { name: 'Mango', nameBn: 'আম', slug: 'mango', sortOrder: 1, image: pick('fruit', 0), description: 'The king of fruits — sweet, juicy summer varieties.', descriptionBn: 'ফলের রাজা — মিষ্টি রসালো গ্রীষ্মের জাত।' },
  { name: 'Guava', nameBn: 'পেয়ারা', slug: 'guava', sortOrder: 2, image: pick('fruit', 1), description: 'Vitamin-rich fruit with crisp, sweet flesh.', descriptionBn: 'ভিটামিন সমৃদ্ধ মিষ্টি কুঁচকানো ফল।' },
  { name: 'Lemon', nameBn: 'লেবু', slug: 'lemon', sortOrder: 3, image: pick('fruit', 3), description: 'Tart, aromatic citrus for everyday kitchens.', descriptionBn: 'রান্নাঘরের প্রতিদিনের টক সুগন্ধি সাইট্রাস।' },
  { name: 'Papaya', nameBn: 'পেঁপে', slug: 'papaya', sortOrder: 4, image: pick('fruit', 4), description: 'Fast-fruiting, all-season papaya varieties.', descriptionBn: 'দ্রুত ফলনশীল, সারাবছর পেঁপের জাত।' },
  { name: 'Banana', nameBn: 'কলা', slug: 'banana', sortOrder: 5, image: pick('fruit', 7), description: 'Year-round banana varieties for home gardens.', descriptionBn: 'বাড়ির বাগানের জন্য সারাবছর কলার জাত।' },
  { name: 'Jackfruit', nameBn: 'কাঁঠাল', slug: 'jackfruit', sortOrder: 6, image: pick('fruit', 5), description: 'Our national fruit — giant, sweet and aromatic.', descriptionBn: 'আমাদের জাতীয় ফল — বিশাল, মিষ্টি ও সুগন্ধি।' },
  { name: 'Litchi', nameBn: 'লিচু', slug: 'litchi', sortOrder: 7, image: pick('fruit', 2), description: 'Juicy summer favorite with ruby flesh.', descriptionBn: 'রসালো গ্রীষ্মের প্রিয় রুবি শাঁসের ফল।' },
  { name: 'Dragon Fruit', nameBn: 'ড্রাগন ফ্রুট', slug: 'dragon-fruit', sortOrder: 8, image: pick('fruit', 6), description: 'Exotic cactus fruit with striking pink skin.', descriptionBn: 'চমৎকার গোলাপি খোসার বিদেশি ক্যাকটাস ফল।' },
];

const DESC = {
  'native-fruit-trees': (n, b) => [`Healthy graft-grown ${n} sapling from our own nursery, acclimatized to Bangladesh weather and ready to plant.`, `আমাদের নার্সারিতে জোড় কলমে তৈরি সুস্থ ${b} চারা — বাংলাদেশের আবহাওয়ায় অভ্যস্ত ও রোপণের জন্য প্রস্তুত।`],
  'exotic-fruit-trees': (n, b) => [`Imported ${n} plant, carefully raised in local conditions so it thrives in your garden from day one.`, `বিদেশ থেকে আনা ${b} গাছ — স্থানীয় আবহাওয়ায় মানিয়ে বড় করা, যা প্রথম দিন থেকেই আপনার বাগানে ভালো বাড়বে।`],
  'all-season-fruit-trees': (n, b) => [`High-yielding ${n} that fruits almost all year round — perfect for continuous home harvest.`, `প্রায় সারাবছর ফল দেয় এমন উচ্চফলনশীল ${b} — ঘরে নিরবচ্ছিন্ন ফসল তোলার জন্য আদর্শ।`],
  'native-flower-plants': (n, b) => [`Beloved Bangladeshi ${n} — fills your garden, roof or balcony with familiar fragrance and color.`, `বাংলাদেশের প্রিয় ${b} — ছাদ বা বারান্দায় পরিচিত সুবাস ও রঙে ভরিয়ে তুলুক।`],
  'exotic-flower-plants': (n, b) => [`Premium imported ${n} variety with show-stopping blooms that elevate any space.`, `চমকপ্রদ ফুলের জন্য বিখ্যাত আমদানি করা উন্নত ${b} জাত।`],
  'all-season-flower-plants': (n, b) => [`Hardy ${n} that keeps blooming through every season with very little care.`, `খুব কম যত্নেই প্রতিটি মৌসুমে ফুল ধরে এমন মজবুত ${b}।`],
  'indoor-ornamental-plants': (n, b) => [`Air-purifying ${n}, perfect for living rooms and offices — loves indirect light.`, `বাতাস পরিশুদ্ধকারী ${b} — ড্রয়িংরুম ও অফিসের জন্য আদর্শ, আলো ছাড়া অন্ধকারেও ভালো থাকে।`],
  'outdoor-ornamental-plants': (n, b) => [`Sun-loving ${n} that adds structure and greenery to gates, lawns and borders.`, `রোদ-প্রিয় ${b} — গেট, লন ও বর্ডারে সবুজ শোভা বাড়ায়।`],
  'bonsai-topiary': (n, b) => [`Living art — a trained ${n} that turns any corner into a calm, sculptural focal point.`, `জীবন্ত শিল্পকর্ম — প্রশিক্ষিত ${b} যেকোনো কোণকে শান্ত সুন্দর কেন্দ্রবিন্দুতে পরিণত করে।`],
  'native-spice-plants': (n, b) => [`Authentic ${n} for your kitchen garden — fresh flavor steps away from the stove.`, `রান্নাঘরের পাশেই খাঁটি ${b} — চুলার কাছ থেকেই টাটকা স্বাদ।`],
  'exotic-spice-plants': (n, b) => [`World-famous ${n}, grown locally so you get fresh international flavor at home.`, `বিশ্ববিখ্যাত ${b} — দেশেই চাষ করা, ঘরে টাটকা আন্তর্জাতিক স্বাদ।`],
  'home-garden-spice-plants': (n, b) => [`Easy ${n} for containers and beds — start harvesting within weeks.`, `টব ও বেডে চাষের সহজ ${b} — কয়েক সপ্তাহেই ফসল তুলুন।`],
  'ayurvedic-medicinal-plants': (n, b) => [`Traditional ${n} used in Ayurvedic remedies for generations — a living home pharmacy.`, `প্রজন্মের পর প্রজন্ম আয়ুর্বেদিক চিকিৎসায় ব্যবহৃত ${b} — জীবন্ত ঘরোয়া ঔষধি ভান্ডার।`],
  'herbal-tea-plants': (n, b) => [`Grow your own ${n} for fresh, chemical-free herbal tea every single day.`, `প্রতিদিন টাটকা, কীটনাশকমুক্ত হারবাল চায়ের জন্য নিজেই চাষ করুন ${b}।`],
  'aromatic-medicinal-plants': (n, b) => [`Fragrant ${n} that soothes the senses while keeping mosquitoes away naturally.`, `সুগন্ধি ${b} — মন ভালো রাখে, সাথে স্বাভাবিকভাবে মশা দূর রাখে।`],
  'fast-growing-timber-trees': (n, b) => [`Quick-establishing ${n} — meaningful shade within a few years and harvestable timber later.`, `দ্রুত বর্ধনশীল ${b} — কয়েক বছরেই ছায়া, পরে মূল্যবান কাঠ।`],
  'premium-timber-trees': (n, b) => [`High-value ${n} — a long-term investment that grows alongside your family.`, `উচ্চমূল্যের ${b} — পরিবারের সাথে বেড়ে ওঠা দীর্ঘমেয়াদি বিনিয়োগ।`],
  'shade-timber-trees': (n, b) => [`Majestic ${n} — generous canopy for courtyards and roadsides, plus future timber value.`, `রাজকীয় ${b} — উঠান ও রাস্তার ধারে ঘন ছায়া, সাথে ভবিষ্যতে কাঠের মূল্য।`],
  'leafy-vegetable-plants': (n, b) => [`Nutrient-packed ${n} ready for cut-and-come-again harvesting from pots or beds.`, `পুষ্টিগুণে ভরপুর ${b} — টব বা বেডে কেটে আবার হয়, বারবার ফসল।`],
  'fruit-vegetable-plants': (n, b) => [`Productive ${n} seedling — basket after basket of home-grown vegetables.`, `ফলনশীল ${b} চারা — ঝাঁকে ঝাঁকে ঘরে উৎপাদিত সবজি।`],
  'root-vegetable-plants': (n, b) => [`Underground treasure — easy ${n} that stores well after harvest.`, `মাটির নিচের সম্পদ — সহজে চাষ হওয়া ${b}, তোলার পরেও ভালো থাকে।`],
  'organic-fertilizers': (n, b) => [`100% organic ${n} — feeds your soil so plants feed you. No chemicals, ever.`, `১০০% জৈব ${b} — মাটিকে খাওয়ায় যেন গাছ আপনাকে খাওয়ায়। কোনো রাসায়নিক নেই।`],
  'organic-pesticides': (n, b) => [`Plant-safe ${n} that stops pests without harming your family, bees or soil.`, `গাছ-নিরাপদ ${b} — পোকা দূর করে কিন্তু পরিবার, মৌমাছি বা মাটির ক্ষতি করে না।`],
  'compost-soil-conditioners': (n, b) => [`Premium ${n} — the foundation every strong root system deserves.`, `উন্নতমানের ${b} — শক্ত শিকড়ের ভিত্তি, যা প্রতিটি গাছ পাওয়ার যোগ্য।`],
  'plastic-ceramic-pots': (n, b) => [`Stylish, drainage-ready ${n} that instantly upgrades any plant display.`, `পরিপাটি ড্রেনেজ-সহ ${b} — যেকোনো গাছের সৌন্দর্য বাড়িয়ে দেয়।`],
  'geo-bags': (n, b) => [`Durable, UV-treated ${n} — the local favorite for rooftop and rooftop-free gardening.`, `টেকসই, UV-প্রক্রিয়াজাত ${b} — ছাদ ও ছোট জায়গার বাগানের প্রিয় পছন্দ।`],
  'hanging-wall-pots': (n, b) => [`Space-saving ${n} — turn bare walls and railings into lush vertical gardens.`, `জায়গা বাঁচানো ${b} — খালি দেয়াল ও রেলিংকে সবুজ উল্লম্ব বাগান বানান।`],
  'hand-tools': (n, b) => [`Rust-resistant, comfortable ${n} — makes every garden task faster and easier.`, `মরিচা-প্রতিরোধী, আরামদায়ক ${b} — বাগানের প্রতিটি কাজ সহজ ও দ্রুত করে।`],
  'watering-equipment': (n, b) => [`Precise, water-saving ${n} — the right drink for every plant, no more guessing.`, `নিখুঁত, পানি-সাশ্রয়ী ${b} — প্রতিটি গাছে সঠিক পানি, অনুমানের ঝামেলা নেই।`],
  'plant-care-accessories': (n, b) => [`Thoughtful ${n} that keeps plants supported, measured and thriving.`, `যত্নশীল ${b} — গাছকে ধরে রাখে, মাপে ও সবুজ রাখে।`],
};

// [name, nameBn, subcategory, price, pool, treeSlug?]
const PRODUCTS = [
  // Fruit Trees — Native
  ['Himsagar Mango Sapling', 'হিমসাগর আমের চারা', 'native-fruit-trees', 2200, 'fruit', 'mango'],
  ['Langra Mango Sapling', 'ল্যাংড়া আমের চারা', 'native-fruit-trees', 2400, 'fruit', 'mango'],
  ['Kazi Peyara Sapling', 'কাজি পেয়ারার চারা', 'native-fruit-trees', 900, 'fruit', 'guava'],
  ['China-3 Litchi Sapling', 'চায়না-৩ লিচুর চারা', 'native-fruit-trees', 1600, 'fruit', 'litchi'],
  ['Deshi Jam Sapling', 'দেশি জামের চারা', 'native-fruit-trees', 750, 'fruit', 'jackfruit'],
  // Fruit Trees — Exotic
  ['Thailand Guava Sapling', 'থাই পেয়ারার চারা', 'exotic-fruit-trees', 1100, 'fruit', 'guava'],
  ['Dragon Fruit Plant', 'ড্রাগন ফ্রুট গাছ', 'exotic-fruit-trees', 1400, 'fruit', 'dragon-fruit'],
  ['Avocado Plant', 'অ্যাভোকাডো গাছ', 'exotic-fruit-trees', 1800, 'fruit', null],
  ['Kagzi Orange Sapling', 'কাগজি কমলার চারা', 'exotic-fruit-trees', 1500, 'fruit', null],
  ['Rambutan Sapling', 'রামবুটান চারা', 'exotic-fruit-trees', 1900, 'fruit', null],
  // Fruit Trees — All-Season
  ['BARI Papaya Seedling', 'বারি পেঁপের চারা', 'all-season-fruit-trees', 150, 'fruit', 'papaya'],
  ['Sagar Kola Sapling', 'সাগর কলার চারা', 'all-season-fruit-trees', 350, 'fruit', 'banana'],
  ['Elachi Lemon Sapling', 'এলাচি লেবুর চারা', 'all-season-fruit-trees', 600, 'fruit', 'lemon'],
  ['Abu Mango Sapling', 'আবু আমের চারা', 'all-season-fruit-trees', 2000, 'fruit', 'mango'],
  ['Thailand Malta Sapling', 'থাই মালটার চারা', 'all-season-fruit-trees', 1300, 'fruit', null],
  // Flowers — Native
  ['Gandharaj Plant', 'গন্ধরাজ গাছ', 'native-flower-plants', 450, 'flower', null],
  ['Beli Plant', 'বেলি গাছ', 'native-flower-plants', 350, 'flower', null],
  ['Rojonigondha Bulbs', 'রজনীগন্ধা কন্দ', 'native-flower-plants', 250, 'flower', null],
  ['Shiuli Plant', 'শিউলি গাছ', 'native-flower-plants', 400, 'flower', null],
  ['Dolonchapa Plant', 'দোলনচাঁপা গাছ', 'native-flower-plants', 380, 'flower', null],
  // Flowers — Exotic
  ['Dutch Rose Plant', 'ডাচ রোজ গাছ', 'exotic-flower-plants', 550, 'flower', null],
  ['Phalaenopsis Orchid', 'ফ্যালেনোপসিস অর্কিড', 'exotic-flower-plants', 1200, 'flower', null],
  ['Gerbera Plant', 'জারবেরা গাছ', 'exotic-flower-plants', 480, 'flower', null],
  ['Carnation Plant', 'কার্নেশন গাছ', 'exotic-flower-plants', 520, 'flower', null],
  ['African Marigold Plant', 'আফ্রিকান গাঁদফুল গাছ', 'exotic-flower-plants', 300, 'flower', null],
  // Flowers — All-Season
  ['Bagan Bilash (Bougainvillea)', 'বাগানবিলাস গাছ', 'all-season-flower-plants', 400, 'flower', null],
  ['Noyontara Plant', 'নয়নতারা গাছ', 'all-season-flower-plants', 200, 'flower', null],
  ['Rangan Plant (Ixora)', 'রঙ্গন গাছ', 'all-season-flower-plants', 350, 'flower', null],
  ['Makhmali Plant', 'মাখমালি গাছ', 'all-season-flower-plants', 280, 'flower', null],
  ['Jui Plant', 'জুঁই গাছ', 'all-season-flower-plants', 380, 'flower', null],
  // Ornamental — Indoor
  ['Money Plant (Golden Pothos)', 'মানিপ্ল্যান্ট (গোল্ডেন পোথোস)', 'indoor-ornamental-plants', 450, 'plant', null],
  ['Snake Plant', 'স্নেক প্ল্যান্ট', 'indoor-ornamental-plants', 650, 'plant', null],
  ['Monstera Deliciosa', 'মনস্টেরা ডেলিসিওসা', 'indoor-ornamental-plants', 1200, 'plant', null],
  ['Peace Lily', 'পিস লিলি', 'indoor-ornamental-plants', 850, 'plant', null],
  ['ZZ Plant', 'জেড-জেড প্ল্যান্ট', 'indoor-ornamental-plants', 950, 'plant', null],
  // Ornamental — Outdoor
  ['Areca Palm', 'এরেকা পাম', 'outdoor-ornamental-plants', 1100, 'plant', null],
  ['Bottle Palm', 'বোতল পাম', 'outdoor-ornamental-plants', 1600, 'plant', null],
  ['Croton Plant', 'ক্রোটন গাছ', 'outdoor-ornamental-plants', 550, 'plant', null],
  ['Thuja (Jhau) Plant', 'ঝাউ গাছ', 'outdoor-ornamental-plants', 700, 'plant', null],
  ['Boston Fern', 'বস্টন ফার্ন', 'outdoor-ornamental-plants', 600, 'plant', null],
  // Ornamental — Bonsai & Topiary
  ['Ficus Bonsai', 'ফাইকাস বনসাই', 'bonsai-topiary', 2500, 'plant', null],
  ['Jade Bonsai', 'জেড বনসাই', 'bonsai-topiary', 1800, 'plant', null],
  ['Fukien Tea Bonsai', 'ফুকিয়েন টি বনসাই', 'bonsai-topiary', 2800, 'plant', null],
  ['Chinese Elm Bonsai', 'চাইনিজ এলম বনসাই', 'bonsai-topiary', 3000, 'plant', null],
  ['Bougainvillea Bonsai', 'বাগানবিলাস বনসাই', 'bonsai-topiary', 2200, 'plant', null],
  // Spice — Native
  ['Tulsi (Holy Basil)', 'তুলসী গাছ', 'native-spice-plants', 150, 'herb', null],
  ['Pudina (Mint)', 'পুদিনা গাছ', 'native-spice-plants', 120, 'herb', null],
  ['Tejpata (Bay Leaf) Plant', 'তেজপাতা গাছ', 'native-spice-plants', 350, 'herb', null],
  ['Pipul Plant', 'পিপুল গাছ', 'native-spice-plants', 400, 'herb', null],
  ['Dhonia (Coriander)', 'ধনে গাছ', 'native-spice-plants', 100, 'herb', null],
  // Spice — Exotic
  ['Rosemary Plant', 'রোজমেরি গাছ', 'exotic-spice-plants', 450, 'herb', null],
  ['Thyme Plant', 'থাইম গাছ', 'exotic-spice-plants', 480, 'herb', null],
  ['Oregano Plant', 'ওরেগানো গাছ', 'exotic-spice-plants', 460, 'herb', null],
  ['Italian Basil', 'ইতালিয়ান বাসিল', 'exotic-spice-plants', 380, 'herb', null],
  ['Sage Plant', 'সেজ গাছ', 'exotic-spice-plants', 500, 'herb', null],
  // Spice — Home Garden
  ['Ada (Ginger) Rhizome Pack', 'আদা কন্দ প্যাক', 'home-garden-spice-plants', 180, 'veg', null],
  ['Holud (Turmeric) Rhizome Pack', 'হলুদ কন্দ প্যাক', 'home-garden-spice-plants', 160, 'veg', null],
  ['Morich (Chili) Seedling', 'মরিচের চারা', 'home-garden-spice-plants', 100, 'veg', null],
  ['Peyaj (Onion) Seedling', 'পেঁয়াজের চারা', 'home-garden-spice-plants', 120, 'veg', null],
  ['Roshun Pata (Garlic Chives)', 'রসুন পাতা গাছ', 'home-garden-spice-plants', 140, 'herb', null],
  // Medicinal — Ayurvedic
  ['Aloe Vera Plant', 'আলোভেরা গাছ', 'ayurvedic-medicinal-plants', 300, 'plant', null],
  ['Bashok Plant', 'বাসক গাছ', 'ayurvedic-medicinal-plants', 250, 'herb', null],
  ['Ashwagandha Plant', 'অশ্বগন্ধা গাছ', 'ayurvedic-medicinal-plants', 350, 'herb', null],
  ['Neem Sapling', 'নিম গাছের চারা', 'ayurvedic-medicinal-plants', 200, 'forest', null],
  ['Shotomuli Plant', 'শতমূলী গাছ', 'ayurvedic-medicinal-plants', 400, 'herb', null],
  // Medicinal — Herbal Tea
  ['Lemongrass Plant', 'লেমনগ্রাস গাছ', 'herbal-tea-plants', 250, 'herb', null],
  ['Chamomile Plant', 'ক্যামোমাইল গাছ', 'herbal-tea-plants', 450, 'herb', null],
  ['Peppermint Plant', 'পিপারমিন্ট গাছ', 'herbal-tea-plants', 220, 'herb', null],
  ['Green Tea Plant', 'সবুজ চা গাছ', 'herbal-tea-plants', 600, 'forest', null],
  ['Lemon Verbena Plant', 'লেমন ভারবেনা গাছ', 'herbal-tea-plants', 480, 'herb', null],
  // Medicinal — Aromatic
  ['Eucalyptus Sapling', 'ইউক্যালিপটাস চারা', 'aromatic-medicinal-plants', 250, 'forest', null],
  ['Citronella Plant', 'সাইট্রোনেলা গাছ', 'aromatic-medicinal-plants', 280, 'plant', null],
  ['Lavender Plant', 'ল্যাভেন্ডার গাছ', 'aromatic-medicinal-plants', 550, 'herb', null],
  ['Rose Geranium Plant', 'রোজ জেরেনিয়াম গাছ', 'aromatic-medicinal-plants', 420, 'flower', null],
  ['Bena (Vetiver) Roots', 'বেনা মূল', 'aromatic-medicinal-plants', 200, 'herb', null],
  // Timber — Fast-Growing
  ['Akashmoni Sapling', 'আকাশমণি চারা', 'fast-growing-timber-trees', 120, 'forest', null],
  ['Mehagoni Sapling', 'মেহগনি চারা', 'fast-growing-timber-trees', 180, 'forest', null],
  ['Kadam Sapling', 'কদম চারা', 'fast-growing-timber-trees', 200, 'forest', null],
  ['Bash (Bamboo) Rhizome', 'বাঁশ কন্দ', 'fast-growing-timber-trees', 250, 'forest', null],
  ['Ipil-Ipil Sapling', 'ইপিল ইপিল চারা', 'fast-growing-timber-trees', 150, 'forest', null],
  // Timber — Premium
  ['Segun (Teak) Sapling', 'সেগুন চারা', 'premium-timber-trees', 350, 'forest', null],
  ['Gorjon Sapling', 'গর্জন চারা', 'premium-timber-trees', 400, 'forest', null],
  ['Jarul Sapling', 'জারুল চারা', 'premium-timber-trees', 300, 'forest', null],
  ['Chikrashi Sapling', 'চিকরাশি চারা', 'premium-timber-trees', 280, 'forest', null],
  ['Agar Sapling', 'আগর চারা', 'premium-timber-trees', 800, 'forest', null],
  // Timber — Shade
  ['Krishnachura Sapling', 'কৃষ্ণচূড়া চারা', 'shade-timber-trees', 250, 'forest', null],
  ['Shirish Sapling', 'শিরিষ চারা', 'shade-timber-trees', 220, 'forest', null],
  ['Debdaru Sapling', 'দেবদারু চারা', 'shade-timber-trees', 280, 'forest', null],
  ['Karanja Sapling', 'করঞ্জা চারা', 'shade-timber-trees', 200, 'forest', null],
  ['Bot (Banyan) Sapling', 'বট গাছের চারা', 'shade-timber-trees', 400, 'forest', null],
  // Vegetables — Leafy
  ['Palong Shak (Spinach) Seeds', 'পালং শাকের বীজ', 'leafy-vegetable-plants', 80, 'veg', null],
  ['Lal Shak Seeds', 'লাল শাকের বীজ', 'leafy-vegetable-plants', 70, 'veg', null],
  ['Danta Seeds', 'ডাঁটার বীজ', 'leafy-vegetable-plants', 75, 'veg', null],
  ['Pui Shak Plant', 'পুঁই শাক গাছ', 'leafy-vegetable-plants', 90, 'veg', null],
  ['Kochu Shak Corms', 'কচু শাকের কন্দ', 'leafy-vegetable-plants', 110, 'veg', null],
  // Vegetables — Fruit
  ['Tomato Seedling', 'টমেটোর চারা', 'fruit-vegetable-plants', 100, 'veg', null],
  ['Begin (Eggplant) Seedling', 'বেগুনের চারা', 'fruit-vegetable-plants', 90, 'veg', null],
  ['Borboti Seedling', 'বরবটির চারা', 'fruit-vegetable-plants', 95, 'veg', null],
  ['Jhinga Seeds', 'ঝিঙার বীজ', 'fruit-vegetable-plants', 85, 'veg', null],
  ['Kumra Seeds', 'কুমড়ার বীজ', 'fruit-vegetable-plants', 80, 'veg', null],
  // Vegetables — Root
  ['Mula (Radish) Seeds', 'মুলার বীজ', 'root-vegetable-plants', 70, 'veg', null],
  ['Gajor (Carrot) Seeds', 'গাজরের বীজ', 'root-vegetable-plants', 90, 'veg', null],
  ['Misti Alu Vine Cuttings', 'মিষ্টি আলুর ডগা', 'root-vegetable-plants', 120, 'veg', null],
  ['Beet Seeds', 'বিটের বীজ', 'root-vegetable-plants', 95, 'veg', null],
  ['Shalgom Seeds', 'শালগমের বীজ', 'root-vegetable-plants', 75, 'veg', null],
  // Fertilizer — Organic
  ['Vermicompost 5kg', 'কেঁচো সার ৫ কেজি', 'organic-fertilizers', 350, 'soil', null],
  ['Sarisha Kheli 5kg', 'সরিষা খেলি ৫ কেজি', 'organic-fertilizers', 400, 'soil', null],
  ['Cow Dung Compost 10kg', 'গোবর কম্পোস্ট ১০ কেজি', 'organic-fertilizers', 300, 'soil', null],
  ['Bone Meal 1kg', 'বোন মিল ১ কেজি', 'organic-fertilizers', 250, 'soil', null],
  ['Neem Kheli 3kg', 'নিম খেলি ৩ কেজি', 'organic-fertilizers', 380, 'soil', null],
  // Fertilizer — Pesticides
  ['Neem Oil Spray 500ml', 'নিম তেল স্প্রে ৫০০ মিলি', 'organic-pesticides', 450, 'tool', null],
  ['Herbal Insecticide 1L', 'ভেষজ কীটনাশক ১ লিটার', 'organic-pesticides', 650, 'tool', null],
  ['Trichoderma Powder 200g', 'ট্রাইকোডার্মা গুঁড়ো ২০০ গ্রাম', 'organic-pesticides', 300, 'soil', null],
  ['Pheromone Trap', 'ফেরোমন ফাঁদ', 'organic-pesticides', 180, 'tool', null],
  ['Yellow Sticky Trap (5pcs)', 'হলুদ স্টিকি ফাঁদ (৫টি)', 'organic-pesticides', 150, 'tool', null],
  // Fertilizer — Compost & Soil
  ['Premium Potting Mix 10L', 'উন্নত পটিং মিক্স ১০ লিটার', 'compost-soil-conditioners', 400, 'soil', null],
  ['Cocopeat Brick 5kg', 'কোকোপিট ব্লিক ৫ কেজি', 'compost-soil-conditioners', 350, 'soil', null],
  ['Leaf Compost 10kg', 'পাতা কম্পোস্ট ১০ কেজি', 'compost-soil-conditioners', 280, 'soil', null],
  ['Perlite 2L', 'পারলাইট ২ লিটার', 'compost-soil-conditioners', 320, 'soil', null],
  ['Vermiculite 2L', 'ভার্মিকুলাইট ২ লিটার', 'compost-soil-conditioners', 340, 'soil', null],
  // Pots — Plastic & Ceramic
  ['Ceramic Pot Set (3pcs)', 'সিরামিক টব সেট (৩টি)', 'plastic-ceramic-pots', 850, 'pot', null],
  ['Plastic Pot 10 inch', 'প্লাস্টিক টব ১০ ইঞ্চি', 'plastic-ceramic-pots', 220, 'pot', null],
  ['Glazed Ceramic Pot', 'গ্লেজড সিরামিক টব', 'plastic-ceramic-pots', 650, 'pot', null],
  ['Self-Watering Pot', 'সেলফ-ওয়াটারিং টব', 'plastic-ceramic-pots', 580, 'pot', null],
  ['Ceramic Bowl Planter', 'সিরামিক বাটি প্ল্যান্টার', 'plastic-ceramic-pots', 520, 'pot', null],
  // Pots — Geo Bags
  ['Geo Bag 12×12 inch', 'জিও ব্যাগ ১২×১২ ইঞ্চি', 'geo-bags', 120, 'pot', null],
  ['Geo Bag 16×16 inch', 'জিও ব্যাগ ১৬×১৬ ইঞ্চি', 'geo-bags', 160, 'pot', null],
  ['Geo Bag 20×20 inch', 'জিও ব্যাগ ২০×২০ ইঞ্চি', 'geo-bags', 210, 'pot', null],
  ['Grow Bag 4-Handle', 'গ্রো ব্যাগ ৪ হ্যান্ডেল', 'geo-bags', 180, 'pot', null],
  ['Nursery Poly Bag Set (50pcs)', 'নার্সারি পলি ব্যাগ সেট (৫০টি)', 'geo-bags', 250, 'pot', null],
  // Pots — Hanging & Wall
  ['Hanging Basket', 'ঝুলন্ত ঝুড়ি', 'hanging-wall-pots', 350, 'pot', null],
  ['Wall Mount Planter', 'ওয়াল মাউন্ট প্ল্যান্টার', 'hanging-wall-pots', 420, 'pot', null],
  ['Macrame Plant Hanger', 'ম্যাক্রামে প্ল্যান্ট হ্যাঙ্গার', 'hanging-wall-pots', 280, 'pot', null],
  ['Vertical Wall Planter (9 pockets)', 'ভার্টিকাল ওয়াল প্ল্যান্টার (৯ পকেট)', 'hanging-wall-pots', 750, 'pot', null],
  ['Rail Planter', 'রেল প্ল্যান্টার', 'hanging-wall-pots', 380, 'pot', null],
  // Tools — Hand
  ['Garden Trowel', 'বাগান খুরপি', 'hand-tools', 250, 'tool', null],
  ['Pruning Shears', 'ছাঁটাই কাঁচি', 'hand-tools', 550, 'tool', null],
  ['Hand Fork', 'হ্যান্ড ফর্ক', 'hand-tools', 300, 'tool', null],
  ['Weeding Tool', 'আগাছা তোলার হাতিয়ার', 'hand-tools', 280, 'tool', null],
  ['Hand Cultivator', 'হ্যান্ড কাল্টিভেটর', 'hand-tools', 320, 'tool', null],
  // Tools — Watering
  ['Watering Can 5L', 'পানি দেওয়ার ঝাঝরি ৫ লিটার', 'watering-equipment', 450, 'tool', null],
  ['Spray Bottle 1L', 'স্প্রে বোতল ১ লিটার', 'watering-equipment', 250, 'tool', null],
  ['Hose Nozzle Gun', 'পাইপ নজল গান', 'watering-equipment', 380, 'tool', null],
  ['Drip Irrigation Kit', 'ড্রিপ সেচ কিট', 'watering-equipment', 1200, 'tool', null],
  ['Pressure Sprayer 5L', 'প্রেশার স্প্রেয়ার ৫ লিটার', 'watering-equipment', 850, 'tool', null],
  // Tools — Care Accessories
  ['Garden Gloves (Pair)', 'বাগানের গ্লাভস (জোড়া)', 'plant-care-accessories', 180, 'tool', null],
  ['Garden Knee Pad', 'বাগানের হাঁটুর প্যাড', 'plant-care-accessories', 320, 'tool', null],
  ['Plant Ties (Roll)', 'গাছ বাঁধার ফিতা (রোল)', 'plant-care-accessories', 120, 'tool', null],
  ['Soil Moisture Meter', 'মাটির আর্দ্রতা মাপক', 'plant-care-accessories', 650, 'tool', null],
  ['Pruning Saw', 'ছাঁটাই করাত', 'plant-care-accessories', 780, 'tool', null],
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([Product.collection.drop(), Tree.collection.drop()]);

  const insertedTrees = await Tree.insertMany(trees);
  const treeBySlug = Object.fromEntries(insertedTrees.map((t) => [t.slug, t._id]));
  console.log(`Seeded ${insertedTrees.length} trees`);

  const docs = PRODUCTS.map(([name, nameBn, category, price, pool, treeSlug], i) => {
    const [description, descriptionBn] = DESC[category](name, nameBn);
    return {
      name,
      nameBn,
      slug: slugify(name),
      category,
      tree: treeSlug ? treeBySlug[treeSlug] : null,
      price,
      oldPrice: i % 3 === 0 ? Math.round((price * 1.25) / 10) * 10 : null,
      stock: 5 + ((i * 7) % 40),
      description,
      descriptionBn,
      image: pick(pool, i),
      images: [pick(pool, i), pick(pool, i + 1), pick(pool, i + 2)],
      featured: i % 15 === 0,
      care: {
        light: category.includes('indoor') ? 'Indirect bright light' : 'Full sun to partial shade',
        water: 'When topsoil feels dry',
        soil: 'Well-draining rich soil',
      },
    };
  });

  const inserted = await Product.insertMany(docs);
  console.log(`Seeded ${inserted.length} products`);

  const byCat = {};
  inserted.forEach((p) => {
    byCat[p.category] = (byCat[p.category] || 0) + 1;
  });
  console.log('Per subcategory:', byCat);
  console.log('Featured:', inserted.filter((p) => p.featured).length);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Seed error:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
