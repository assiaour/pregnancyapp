require('dotenv').config();
const fs = require('fs');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key");
    return;
  }
  try {
    const fetch = globalThis.fetch;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    const models = data.models ? data.models.map(m => m.name) : data;
    fs.writeFileSync('models.json', JSON.stringify(models, null, 2));
    console.log("Saved to models.json");
  } catch (err) {
    console.error(err);
  }
}
test();
