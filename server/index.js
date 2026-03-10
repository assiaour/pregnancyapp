require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection (use MONGODB_URI from env - Atlas or Render add-on)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pregnancy-app';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema for account data collected in the app (steps 1–8)
const accountSchema = new mongoose.Schema({
  // Step 1
  nom: String,
  dateNaissance: String,
  mail: { type: String, required: true },
  username: String,
  password: String, // NOTE: for real apps, hash this instead of storing plain text
  nombreEnfants: Number,
  // Step 2
  ddr: String,
  semaineGrossesse: Number,
  nombreGrossessesPrecedentes: Number,
  nombreAccouchements: Number,
  typeAccouchement: String,
  complicationsOuiNon: String,
  complicationsDetails: String,
  // Step 3
  nauseesVomissements: String,
  fatigueExcessive: String,
  douleursAbdominales: String,
  priseMedicaments: String,
  medicamentsDetails: String,
  antecedentsFaussesCouches: String,
  // Step 4
  gonflement: String,
  douleursDorsales: String,
  mouvementFoetus: String,
  testDiabete: String,
  pressionArterielle: String,
  // Step 5
  frequenceContractions: String,
  perteLiquide: String,
  saignementVaginal: String,
  preparationAccouchement: String,
  sommeilAnxiete: String,
  // Step 6
  diabeteAvant: String,
  hypertension: String,
  thyroide: String,
  cardiaques: String,
  antecedentsFamiliaux: String,
  vaccins: mongoose.Schema.Types.Mixed,
  // Step 7
  tabacChicha: String,
  alcool: String,
  activitePhysique: String,
  regimeAlimentaire: String,
  soutienFamilial: String,
  preferenceSuivi: String,
  // Step 8
  suiviPoids: String,
  suiviTension: String,
  suiviMouvementsFoetaux: String,
  notificationsRdv: String,
  infosParTrimestre: String,
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);

// Week-by-week baby development
const weekSchema = new mongoose.Schema({
  week: { type: Number, required: true, unique: true },
  size_cm: Number,
  weight_g: Number,
  fruit: String,
  development: String,
  image: String,
}, { timestamps: true });
const Week = mongoose.model('Week', weekSchema);

// Tips of the day
const tipSchema = new mongoose.Schema({
  text: { type: String, required: true },
  dayOfYear: Number, // optional: for deterministic daily tip
}, { timestamps: true });
const Tip = mongoose.model('Tip', tipSchema);

// Articles
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  category: String,
  week: Number,
  image: String,
}, { timestamps: true });
const Article = mongoose.model('Article', articleSchema);

// Chat history (optional - for persistence)
const chatHistorySchema = new mongoose.Schema({
  userId: String,
  role: String,
  content: String,
}, { timestamps: true });
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// Health check (for Render and monitoring)
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Create account (POST from app)
app.post('/api/accounts', async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get account by email (optional – for login / fetch profile)
app.get('/api/accounts/:email', async (req, res) => {
  try {
    const account = await Account.findOne({ mail: req.params.email });
    if (!account) return res.status(404).json({ error: 'Not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Weeks API
app.get('/api/weeks', async (req, res) => {
  try {
    const weeks = await Week.find().sort({ week: 1 });
    res.json(weeks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/weeks/:week', async (req, res) => {
  try {
    const w = await Week.findOne({ week: parseInt(req.params.week, 10) });
    if (!w) return res.status(404).json({ error: 'Not found' });
    res.json(w);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tips API - daily tip (deterministic by day of year)
app.get('/api/tips/daily', async (req, res) => {
  try {
    const dayOfYear = Math.floor((Date.now() / 86400000) % 365);
    let tip = await Tip.findOne({ dayOfYear });
    if (!tip) {
      tip = await Tip.findOne().sort({ createdAt: 1 });
    }
    if (!tip) {
      return res.json({ text: 'Drink plenty of water today. Hydration helps prevent headaches during pregnancy.' });
    }
    res.json(tip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Articles API
app.get('/api/articles', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/articles/daily', async (req, res) => {
  try {
    const articles = await Article.find();
    if (articles.length === 0) {
      return res.json({ title: 'Foods to Avoid During Pregnancy', content: 'Learn which foods to avoid for a healthy pregnancy.' });
    }
    const dayOfYear = Math.floor((Date.now() / 86400000) % 365);
    const idx = dayOfYear % articles.length;
    res.json(articles[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chat API - proxies to OpenAI (requires OPENAI_API_KEY in .env)
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      reply: "The Pregnancy Assistant is not configured yet. Please add OPENAI_API_KEY to the server environment.",
    });
  }
  try {
    const { message, history = [], userId } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }
    const messages = [
      { role: 'system', content: 'You are a helpful, friendly Pregnancy Assistant. Answer questions about pregnancy, symptoms, nutrition, baby development, and general prenatal care. Be supportive and provide accurate, evidence-based information. If unsure, recommend consulting a healthcare provider.' },
      ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
      }),
    });
    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ reply: data.error.message || 'AI error' });
    }
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not respond.';
    if (userId) {
      await ChatHistory.create([{ userId, role: 'user', content: message }, { userId, role: 'assistant', content: reply }]);
    }
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: err.message || 'Chat failed' });
  }
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Pregnancy App API',
    health: '/health',
    docs: 'POST /api/accounts, GET /api/accounts/:email, GET /api/weeks, GET /api/tips/daily, GET /api/articles, POST /api/chat',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
