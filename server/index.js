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

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Pregnancy App API',
    health: '/health',
    docs: 'POST /api/accounts, GET /api/accounts/:email',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
