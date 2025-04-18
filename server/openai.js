require("dotenv").config();
const OpenAI = require("openai");
const generalInfo = require("./info");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function filterRelevantProducts(message, products, limit = 5) {
  const keywords = message.toLowerCase().split(/\s+/);
  const scored = products.map(p => {
    const text = `${p.title} ${p.description}`.toLowerCase();
    const relevance = keywords.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
    return { ...p, relevance };
  });

  const filtered = scored
    .filter(p => p.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);

  console.log("🔍 Prodotti selezionati:", filtered.map(p => p.title));
  return filtered;
}

function isGeneralQuestion(message) {
  const lower = message.toLowerCase();
  return [
    "orari", "aperti", "quando siete", "dove", "spedizione", "contatti",
    "telefono", "email", "showroom", "indirizzo", "shipping", "open", "hours", "location", "contact"
  ].some(keyword => lower.includes(keyword));
}

function getLanguageName(language) {
  switch (language) {
    case 'it': return 'Italian';
    case 'fr': return 'French';
    case 'de': return 'German';
    default: return 'English';
  }
}

async function getResponseFromOpenAI(message, language, products) {
  const languageName = getLanguageName(language);
  const staticDetails = Object.values(generalInfo).join('\n');

  if (isGeneralQuestion(message)) {
    const basePrompt = `
You are an assistant for a luxury home decor boutique on Lake Como.

Use only the following information to answer the question:

${staticDetails}

User's question:
${message}

Answer in English only. Be polite, elegant and helpful.
`;

    const baseResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: 'user', content: basePrompt }],
    });

    const englishAnswer = baseResponse.choices[0].message.content.trim();

    const translationPrompt = `
Translate the following response into ${languageName}. Only return the translation, no extra explanation.

RESPONSE:
${englishAnswer}
`;

    const translated = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: 'user', content: translationPrompt }],
    });

    return translated.choices[0].message.content.trim();
  }

  const relevantProducts = filterRelevantProducts(message, products);
  const productList = relevantProducts.map(p => {
    return "- " + p.title + ": " + p.description + " (" + p.url + ")" + (p.image ? " [img:" + p.image + "]" : "");
  }).join('\n');

  const basePrompt = `
You are an assistant for a luxury home decor brand. Use only the following products and general info to answer:

GENERAL INFO:
${staticDetails}

PRODUCTS:
${productList}

QUESTION:
${message}

Give your reply in English only. Be concise, elegant and informative.
`;

  const baseResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: basePrompt }],
  });

  const englishAnswer = baseResponse.choices[0].message.content.trim();

  const translationPrompt = `
Translate the following response into ${languageName}. Only return the translation, no extra explanation.

RESPONSE:
${englishAnswer}
`;

  const translated = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: translationPrompt }],
  });

  return translated.choices[0].message.content.trim();
}

module.exports = { getResponseFromOpenAI };