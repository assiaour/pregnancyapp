/**
 * Seed script for pregnancy app database
 * Run: node server/seed.js
 * Requires: MONGODB_URI in .env (or defaults to localhost)
 */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pregnancy-app';

const weekSchema = new mongoose.Schema({
  week: { type: Number, required: true, unique: true },
  size_cm: Number,
  weight_g: Number,
  fruit: String,
  development: String,
  image: String,
}, { timestamps: true });

const tipSchema = new mongoose.Schema({
  text: String,
  dayOfYear: Number,
}, { timestamps: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  week: Number,
  image: String,
}, { timestamps: true });

const Week = mongoose.model('Week', weekSchema);
const Tip = mongoose.model('Tip', tipSchema);
const Article = mongoose.model('Article', articleSchema);

const WEEKS_DATA = [
  { week: 1, fruit: 'Poppy seed', size_cm: 0.1, weight_g: 0, development: 'Fertilization occurs. The fertilized egg travels to the uterus.' },
  { week: 2, fruit: 'Poppy seed', size_cm: 0.2, weight_g: 0, development: 'The blastocyst implants in the uterine lining.' },
  { week: 3, fruit: 'Poppy seed', size_cm: 0.2, weight_g: 0, development: 'Neural tube begins to form. Heart starts developing.' },
  { week: 4, fruit: 'Poppy seed', size_cm: 0.2, weight_g: 0, development: 'Baby is the size of a poppy seed. Placenta begins forming.' },
  { week: 5, fruit: 'Sesame seed', size_cm: 0.3, weight_g: 0, development: 'Heart is beating. Brain and spinal cord begin developing.' },
  { week: 6, fruit: 'Lentil', size_cm: 0.6, weight_g: 0, development: 'Face features form. Arm and leg buds appear.' },
  { week: 7, fruit: 'Blueberry', size_cm: 1, weight_g: 0, development: 'Baby doubles in size. Kidneys develop.' },
  { week: 8, fruit: 'Raspberry', size_cm: 1.6, weight_g: 1, development: 'Fingers and toes forming. All major organs developing.' },
  { week: 9, fruit: 'Cherry', size_cm: 2.3, weight_g: 2, development: 'Baby can make fists. Tail disappears.' },
  { week: 10, fruit: 'Strawberry', size_cm: 3.1, weight_g: 4, development: 'Teeth buds form. Bones begin hardening.' },
  { week: 11, fruit: 'Lime', size_cm: 4.1, weight_g: 7, development: 'Baby is almost fully formed. Genitals developing.' },
  { week: 12, fruit: 'Plum', size_cm: 5.4, weight_g: 14, development: 'Reflexes develop. Baby can swallow.' },
  { week: 13, fruit: 'Peach', size_cm: 7.4, weight_g: 23, development: 'First trimester complete. Fingerprints form.' },
  { week: 14, fruit: 'Lemon', size_cm: 8.7, weight_g: 43, development: 'Baby can make facial expressions. Hair begins growing.' },
  { week: 15, fruit: 'Apple', size_cm: 10.1, weight_g: 70, development: 'Bones getting stronger. Baby can sense light.' },
  { week: 16, fruit: 'Avocado', size_cm: 11.6, weight_g: 100, development: 'Hearing develops. Baby may hear your voice.' },
  { week: 17, fruit: 'Pear', size_cm: 13, weight_g: 140, development: 'Fat stores begin. Umbilical cord strengthens.' },
  { week: 18, fruit: 'Sweet potato', size_cm: 14.2, weight_g: 190, development: 'Baby is very active. You may feel movements soon.' },
  { week: 19, fruit: 'Mango', size_cm: 15.3, weight_g: 240, development: 'Vernix protects skin. Baby practices swallowing.' },
  { week: 20, fruit: 'Banana', size_cm: 25.6, weight_g: 300, development: 'Halfway there! Baby is halfway through development.' },
  { week: 21, fruit: 'Carrot', size_cm: 26.7, weight_g: 360, development: 'Digestive system preparing. Baby can taste amniotic fluid.' },
  { week: 22, fruit: 'Papaya', size_cm: 27.9, weight_g: 430, development: 'Eyelids and eyebrows forming. Baby practices breathing.' },
  { week: 23, fruit: 'Grapefruit', size_cm: 28.9, weight_g: 501, development: 'Rapid brain growth. Baby can hear sounds.' },
  { week: 24, fruit: 'Cantaloupe', size_cm: 30, weight_g: 600, development: 'Lungs developing. Baby survives if born now with care.' },
  { week: 25, fruit: 'Cauliflower', size_cm: 34.6, weight_g: 660, development: 'Hands fully developed. Baby responds to touch.' },
  { week: 26, fruit: 'Lettuce', size_cm: 35.6, weight_g: 760, development: 'Eyes forming. Baby can open eyes.' },
  { week: 27, fruit: 'Cabbage', size_cm: 36.6, weight_g: 875, development: 'Brain growing rapidly. Sleep cycles develop.' },
  { week: 28, fruit: 'Coconut', size_cm: 37.6, weight_g: 1005, development: 'Third trimester begins. Lungs developing.' },
  { week: 29, fruit: 'Butternut squash', size_cm: 38.6, weight_g: 1153, development: 'Muscles and lungs maturing. Baby can regulate temperature.' },
  { week: 30, fruit: 'Cabbage', size_cm: 39.9, weight_g: 1319, development: 'Baby is getting rounder. Eyes can open and close.' },
  { week: 31, fruit: 'Coconut', size_cm: 41.1, weight_g: 1502, development: 'Baby processes information. All five senses working.' },
  { week: 32, fruit: 'Jicama', size_cm: 42.4, weight_g: 1702, development: 'Baby practices breathing. Skin becoming smooth.' },
  { week: 33, fruit: 'Pineapple', size_cm: 43.7, weight_g: 1918, development: 'Bones hardening. Baby can distinguish day and night.' },
  { week: 34, fruit: 'Cantaloupe', size_cm: 45, weight_g: 2146, development: 'Lungs nearly mature. Baby can recognize songs.' },
  { week: 35, fruit: 'Honeydew', size_cm: 46.2, weight_g: 2383, development: 'Kidneys fully developed. Baby gains weight.' },
  { week: 36, fruit: 'Papaya', size_cm: 47.4, weight_g: 2622, development: 'Baby is almost ready. Lungs mature.' },
  { week: 37, fruit: 'Swiss chard', size_cm: 48.6, weight_g: 2859, development: 'Full term! Baby can arrive any time.' },
  { week: 38, fruit: 'Leek', size_cm: 49.8, weight_g: 3083, development: 'Baby is fully developed. Preparing for birth.' },
  { week: 39, fruit: 'Mini watermelon', size_cm: 50.7, weight_g: 3288, development: 'Baby is ready. Final preparations.' },
  { week: 40, fruit: 'Watermelon', size_cm: 51.2, weight_g: 3462, development: 'Due date! Baby is fully developed and ready to meet you.' },
];

const TIPS_DATA = [
  'Drink plenty of water today. Hydration helps prevent headaches during pregnancy.',
  'Take short walks. Gentle exercise can boost your mood and energy.',
  'Eat small, frequent meals to help with nausea and heartburn.',
  'Get enough rest. Your body is working hard to grow your baby.',
  'Take your prenatal vitamins daily. They support baby development.',
  'Avoid raw or undercooked foods. Food safety is important now.',
  'Stay active with prenatal yoga or swimming if your doctor approves.',
  'Practice deep breathing. It helps with stress and prepares for labor.',
  'Eat iron-rich foods like spinach and lean meat to prevent anemia.',
  'Avoid standing for long periods. Take breaks and elevate your feet.',
  'Stay connected with your partner. Share your feelings and thoughts.',
  'Limit caffeine. Stick to under 200mg per day.',
  'Wear comfortable shoes. Your feet may swell during pregnancy.',
  'Sleep on your left side when possible. It improves blood flow.',
  'Join a prenatal class to prepare for birth and parenting.',
  'Listen to your body. Rest when you need it.',
  'Eat fiber-rich foods to prevent constipation.',
  'Apply sunscreen. Pregnancy can make skin more sensitive.',
  'Avoid hot tubs and saunas. They can raise body temperature.',
  'Pack your hospital bag as you approach your due date.',
];

const ARTICLES_DATA = [
  { title: 'Foods to Avoid During Pregnancy', content: 'During pregnancy, avoid raw or undercooked meat, eggs, and fish. Unpasteurized dairy and deli meats can harbor harmful bacteria. Limit caffeine intake and avoid alcohol completely. Some fish high in mercury (like swordfish) should be avoided. Always wash fruits and vegetables thoroughly.', category: 'Nutrition' },
  { title: 'Managing Morning Sickness', content: 'Morning sickness affects many pregnant women. Eat small, frequent meals throughout the day. Avoid an empty stomach. Ginger, crackers, and cold foods often help. Stay hydrated. If symptoms are severe, consult your doctor about safe medications.', category: 'Symptoms' },
  { title: 'First Trimester: Weeks 1-12', content: 'The first trimester is a time of rapid development. Your baby\'s major organs and structures form. You may experience fatigue, nausea, and breast tenderness. Attend your first prenatal appointment. Take folic acid and avoid harmful substances.', category: 'Baby Development' },
  { title: 'Second Trimester: Weeks 13-27', content: 'Many women feel their best during the second trimester. You may feel your baby move for the first time. Energy often returns. Your bump becomes visible. This is a good time for prenatal classes and preparing your home.', category: 'Baby Development' },
  { title: 'Third Trimester: Weeks 28-40', content: 'Your baby grows rapidly in the third trimester. You may feel more discomfort as your due date approaches. Practice breathing and relaxation techniques. Pack your hospital bag. Watch for signs of labor.', category: 'Baby Development' },
  { title: 'Pregnancy and Exercise', content: 'Exercise during pregnancy is generally safe and beneficial. Walking, swimming, and prenatal yoga are excellent choices. Avoid contact sports and activities with high fall risk. Listen to your body and stay hydrated. Consult your doctor before starting any exercise program.', category: 'Exercise' },
  { title: 'Mental Health During Pregnancy', content: 'Pregnancy can bring a mix of emotions. Anxiety and mood changes are common. Talk to your partner, friends, or a healthcare provider. Rest and self-care matter. If you feel persistently sad or anxious, seek support. You are not alone.', category: 'Mental health' },
  { title: 'Prenatal Vitamins Guide', content: 'Prenatal vitamins provide essential nutrients like folic acid, iron, and calcium. Folic acid helps prevent neural tube defects. Iron supports blood volume. Start taking them before conception if possible. Take with food to reduce nausea.', category: 'Nutrition' },
  { title: 'Common Pregnancy Symptoms', content: 'Common symptoms include fatigue, nausea, heartburn, back pain, and swelling. Most are normal and manageable. Track your symptoms and discuss them with your care provider. Some symptoms need prompt attention.', category: 'Symptoms' },
  { title: 'When to Call Your Doctor', content: 'Call your doctor if you experience severe abdominal pain, bleeding, severe headache, vision changes, sudden swelling, or decreased fetal movement. Trust your instincts. It\'s always better to ask.', category: 'Health' },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Week.deleteMany({});
  await Week.insertMany(WEEKS_DATA);
  console.log(`Seeded ${WEEKS_DATA.length} weeks`);

  await Tip.deleteMany({});
  const tips = TIPS_DATA.map((text, i) => ({ text, dayOfYear: i }));
  await Tip.insertMany(tips);
  console.log(`Seeded ${tips.length} tips`);

  await Article.deleteMany({});
  await Article.insertMany(ARTICLES_DATA);
  console.log(`Seeded ${ARTICLES_DATA.length} articles`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
