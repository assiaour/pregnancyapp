require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const geminiKeyFingerprint = (key) => {
  if (!key || typeof key !== 'string') return null;
  return crypto.createHash('sha256').update(key).digest('hex').slice(0, 12);
};

// MongoDB connection (use MONGODB_URI from env - Atlas or Render add-on)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pregnancy-app';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    if (process.env.GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY detected: YES');
      console.log('GEMINI_API_KEY fingerprint:', geminiKeyFingerprint(process.env.GEMINI_API_KEY));
    } else {
      console.warn('GEMINI_API_KEY detected: NO (Chatbot functionality will be disabled)');
    }
  })
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
  source: String, // Added to cite where the article came from
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
    geminiKey: process.env.GEMINI_API_KEY ? 'present' : 'missing',
    geminiKeyFp: geminiKeyFingerprint(process.env.GEMINI_API_KEY),
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

// Update account by email
app.put('/api/accounts/:email', async (req, res) => {
  try {
    const { nom, password } = req.body;
    const account = await Account.findOne({ mail: req.params.email });
    if (!account) return res.status(404).json({ error: 'Not found' });
    if (nom) account.nom = nom;
    if (password) {
      // Typically hash in real app
      account.password = password;
    }
    await account.save();
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
      return res.json({ text: 'Buvez beaucoup d\'eau aujourd\'hui. L\'hydratation aide à prévenir les maux de tête pendant la grossesse.' });
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
      return res.json({ title: 'Aliments à éviter pendant la grossesse', content: 'Découvrez quels aliments éviter pour une grossesse saine.' });
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

// Use the Google Gemini API SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Chat API - powered by Gemini (requires GEMINI_API_KEY in .env)
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      reply: "L'assistant de grossesse n'est pas encore configuré. Veuillez ajouter GEMINI_API_KEY à l'environnement du serveur.",
    });
  }

  try {
    const { message, userId } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }

    console.log('[/api/chat] hit local server', {
      userId: userId ? String(userId).slice(0, 30) : null,
      historyLen: Array.isArray(req.body.history) ? req.body.history.length : null,
      messagePreview: message.slice(0, 40),
    });

    // --- Safety Layer ---
    const lowerMessage = message.toLowerCase();
    const emergencyKeywords = [
      'saignement', 'saignements', 'douleur intense', 'perte de connaissance', 
      'urgence', 'fièvre élevée', 'emergency', 'bleeding', 'severe pain', 
      'fever', 'contract', 'contractions', 'évanouissement'
    ];
    
    // Check if any emergency keyword is in the message
    const hasEmergency = emergencyKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasEmergency) {
      if (userId) {
        // Log the interaction even if it triggered safety
        await ChatHistory.create([
          { userId, role: 'user', content: message },
          { userId, role: 'assistant', content: "Please go to a doctor immediately" }
        ]);
      }
      return res.json({ reply: "Please go to a doctor immediately" });
    }

    // --- Retrieve History ---
    let dbHistory = [];
    if (userId) {
      dbHistory = await ChatHistory.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(); // get plain JS objects
      
      // MongoDB sorts descending (latest first). Reverse to oldest first
      dbHistory = dbHistory.reverse();
    } else if (req.body.history) {
      // Fallback for anonymous users if history passed in body
      dbHistory = req.body.history.slice(-10);
    }

    // Format history for Gemini API -> format needed:
    // { role: "user" | "model", parts: [{ text: "..." }] }
    // Gemini is strict about role alternation, so we also sanitize/clean the input.
    const formattedHistory = dbHistory
      .map(m => {
        const geminiRole = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';
        return {
          role: geminiRole,
          parts: [{ text: String(m.content ?? '') }],
        };
      })
      .filter(
        (m) =>
          (m.role === 'user' || m.role === 'model') &&
          Array.isArray(m.parts) &&
          typeof m.parts?.[0]?.text === 'string' &&
          m.parts[0].text.trim().length > 0
      );

    // Determine the user message role (needed to ensure no consecutive same-role messages if history is mismatched)
    // Actually, for generateContent, we pass history in startChat
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemInstruction = 
      `Tu es l'assistant IA exclusif et expert de notre application de grossesse.
Tâches autorisées :
- Répondre aux questions sur la grossesse.
- Donner des conseils hebdomadaires.
- Répondre aux symptômes (sans poser de diagnostic définitif).
- Fournir des rappels de santé ou de rendez-vous.

Si l'utilisateur pose une question risquée, hors de ce champ (ex: "Quelle est la météo ?"), ou qui frôle un diagnostic sérieux, décline poliment et conseille de consulter un spécialiste. Limite strictement toutes tes réponses à la grossesse. Réponds toujours en français.`;

    // Use Gemini 2.0 Flash
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction,
    });

    // To use history, we start a chat session.
    // Gemini is extremely strict: history MUST (1) start with 'user' and (2) strictly alternate roles.
    // Additionally, sendMessage expects history to end with 'model' so the new message can be 'user'.
    let validatedHistory = [];
    let lastRole = null;

    for (const m of formattedHistory) {
      if (lastRole === null) {
        if (m.role === 'user') {
          validatedHistory.push(m);
          lastRole = 'user';
        }
      } else if (m.role !== lastRole) {
        validatedHistory.push(m);
        lastRole = m.role;
      }
    }

    // Crucially, if the last message in history is a 'user' message,
    // Gemini will fail because sendMessage adds ANOTHER user message.
    // We must ensure the history ends with a 'model' message.
    if (validatedHistory.length > 0 && validatedHistory[validatedHistory.length - 1].role === 'user') {
      validatedHistory.pop(); // Remove the trailing user message so history ends with 'model'
    }

    // Extra safety: history MUST start with 'user'. If it doesn't, send no history at all.
    if (validatedHistory.length > 0 && validatedHistory[0].role !== 'user') validatedHistory = [];

    // Gemini is extremely strict about history shape:
    // - starts with 'user'
    // - alternates roles (user/model/user/model...)
    // - ends with 'model' (so sendMessage can append a final 'user')
    const roles = validatedHistory.map((m) => m.role);
    const startsWithUser = roles.length > 0 ? roles[0] === 'user' : true;
    const alternates = roles.every((r, i) => (i === 0 ? true : r !== roles[i - 1]));
    const endsWithModel = roles.length > 0 ? roles[roles.length - 1] === 'model' : true;

    const safeHistory =
      validatedHistory.length > 0 && startsWithUser && alternates && endsWithModel ? validatedHistory : [];

    const chat = safeHistory.length > 0 ? model.startChat({ history: safeHistory }) : model.startChat();

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const toText = (v) => (v == null ? '' : String(v));
    const safeJsonParse = (s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    };

    const isRateLimitOrQuota = (err) => {
      const status = err?.status || err?.response?.status || err?.response?.statusCode;
      if (status === 429) return true;
      const msg = toText(err?.message || err);
      const lower = msg.toLowerCase();
      if (lower.includes('429') || lower.includes('too many requests') || lower.includes('quota') || lower.includes('rate limit')) return true;
      const parsed = safeJsonParse(msg);
      const parsedStr = parsed ? JSON.stringify(parsed).toLowerCase() : '';
      return parsedStr.includes('429') || parsedStr.includes('quota') || parsedStr.includes('rate');
    };

    const extractRetryDelayMs = (err) => {
      const msg = toText(err?.message || err);
      const parsed = safeJsonParse(msg);
      const retryDelay =
        parsed?.error?.details?.find?.((d) => d?.['@type']?.includes('RetryInfo'))?.retryDelay ||
        parsed?.details?.find?.((d) => d?.['@type']?.includes('RetryInfo'))?.retryDelay;
      if (typeof retryDelay === 'string') {
        const m = retryDelay.match(/(\d+(?:\.\d+)?)s/i);
        if (m) return Math.max(0, Math.round(parseFloat(m[1]) * 1000));
      }
      return null;
    };

    // Generate response (with retry for transient Gemini quota/rate-limit)
    let lastErr = null;
    let result = null;
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        result = await chat.sendMessage(message);
        break;
      } catch (err) {
        lastErr = err;
        if (!isRateLimitOrQuota(err) || attempt === maxAttempts) break;

        const serverSuggested = extractRetryDelayMs(err);
        const backoff = Math.min(60000, 1000 * Math.pow(2, attempt - 1)); // 1s, 2s, 4s (capped)
        const waitMs = serverSuggested != null ? Math.max(serverSuggested, backoff) : backoff;
        console.warn(`[/api/chat] Gemini rate-limit/quota. Retry ${attempt}/${maxAttempts} in ${waitMs}ms`);
        await sleep(waitMs);
      }
    }

    if (!result) throw lastErr || new Error('Gemini request failed');

    const reply = result.response.text() || 'Désolé, je ne peux pas répondre pour le moment.';

    // Save history
    if (userId) {
      await ChatHistory.create([
        { userId, role: 'user', content: message },
        { userId, role: 'assistant', content: reply }
      ]);
    }

    res.json({ reply });
  } catch (err) {
    const rawMsg = (err && (err.message || err.toString())) || 'Chat failed';
    const msg = String(rawMsg);
    const lower = msg.toLowerCase();

    // Gemini quota / rate limit
    if (
      lower.includes('429') ||
      lower.includes('too many requests') ||
      lower.includes('quota') ||
      lower.includes('rate limit')
    ) {
      console.error('Chat error (quota/rate-limit):', msg);
      return res.status(429).json({
        reply:
          "Le chatbot est temporairement indisponible (quota Gemini dépassé). " +
          "Veuillez réessayer plus tard ou ajoutez un compte Gemini avec facturation/quota actif.",
        code: 'GEMINI_QUOTA_EXCEEDED',
      });
    }

    // Misconfiguration
    if (lower.includes('api key') || lower.includes('permission') || lower.includes('unauthorized')) {
      console.error('Chat error (auth/config):', msg);
      return res.status(503).json({
        reply:
          "Le chatbot n'est pas correctement configuré (clé Gemini invalide ou non autorisée). " +
          "Vérifiez GEMINI_API_KEY et les permissions du projet.",
        code: 'GEMINI_AUTH_ERROR',
      });
    }

    // Never leak raw Gemini payloads to the client UI (they are huge and unreadable).
    const looksLikeGeminiPayload =
      lower.includes('generativelanguage.googleapis.com') ||
      lower.includes('googlegenerativeai error') ||
      lower.includes('generatecontent') ||
      (msg.trim().startsWith('{') && msg.trim().endsWith('}'));

    console.error('Chat error:', err);
    res.status(500).json({
      reply: looksLikeGeminiPayload
        ? "Désolé, le chatbot rencontre un problème temporaire. Réessayez dans quelques minutes."
        : (msg || 'Chat failed'),
      code: 'CHAT_FAILED',
    });
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
