/**
 * Bulk import articles into MongoDB.
 *
 * Usage:
 *   npm run import:articles
 *
 * Data file:
 *   server/data/articles.json
 *
 * Each item should look like:
 * {
 *   "title": "...",
 *   "content": "...",
 *   "category": "Nutrition|Symptoms|Baby Development|Health|Exercise|Mental health",
 *   "week": 12,
 *   "image": "",
 *   "source": "optional"
 * }
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pregnancy-app';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  category: String,
  week: Number,
  image: String,
  source: String,
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

async function main() {
  const dataPath = path.join(__dirname, 'data', 'articles.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) throw new Error('articles.json must be an array');

  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');

  // Upsert by title so you can re-run the import safely.
  let upserts = 0;
  let skipped = 0;
  for (const item of items) {
    if (!item || !item.title) {
      skipped += 1;
      continue;
    }
    await Article.updateOne(
      { title: item.title },
      { $set: item },
      { upsert: true },
    );
    upserts += 1;
  }

  console.log(`Imported/updated ${upserts} articles (skipped ${skipped}).`);
  await mongoose.disconnect();
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
  });

