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

function getShippingInfo(userLocation) {
  if (!userLocation) return "Shipping is FREE to most European countries. Outside Europe, shipping fees may apply.";
  const europeCountries = [
    "italy", "france", "germany", "spain", "portugal", "netherlands", "austria", "belgium", "switzerland",
    "denmark", "norway", "sweden", "finland", "greece", "ireland", "czech republic", "poland", "hungary",
    "luxembourg", "croatia", "slovenia", "slovakia", "romania", "bulgaria", "estonia", "latvia", "lithuania"
  ];
  const normalized = userLocation.toLowerCase();
  return europeCountries.includes(normalized)
    ? "Shipping is FREE to your country as part of our European shipping policy."
    : "Shipping is FREE to most European countries. Shipping fees may apply to your country.";
}

async function getResponseFromOpenAI(message, language, products, userLocation) {
  const languageName = getLanguageName(language);
  const staticDetails = Object.entries(generalInfo).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('\n');
  const shippingInfo = getShippingInfo(userLocation);

  const combinedInfo = `${staticDetails}\n\nSHIPPING POLICY: ${shippingInfo}`;

  // GENERAL QUESTIONS
  if (isGeneralQuestion(message)) {
    const basePrompt = `
You are an assistant for a luxury home decor boutique on Lake Como.

Use only the following information to answer the question:

${combinedInfo}

User's question:
${message}

Answer in English only. Be polite, elegant and helpful.
    `.trim();

    const baseResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: 'user', content: basePrompt }],
    });

    const englishAnswer = baseResponse.choices[0].message.content.trim();

    const translationPrompt = `
Translate the following response into ${languageName}. Only return the translation, no extra explanation.

RESPONSE:
${englishAnswer}
    `.trim();

    const translated = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: 'user', content: translationPrompt }],
    });

    return translated.choices[0].message.content.trim();
  }

  // PRODUCT QUESTIONS
  const relevantProducts = filterRelevantProducts(message, products);
  const productList = relevantProducts.map(p => {
    return "- " + p.title + ": " + p.description + " (" + p.url + ")" + (p.image ? " [img:" + p.image + "]" : "");
  }).join('\n');

  const basePrompt = `
You are an assistant for a luxury home decor brand. Use only the following products and general info to answer:

GENERAL INFO:
${combinedInfo}

PRODUCTS:
${productList}

QUESTION:
${message}

Give your reply in English only. Be concise, elegant and informative.
  `.trim();

  const baseResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: basePrompt }],
  });

  const englishAnswer = baseResponse.choices[0].message.content.trim();

  const translationPrompt = `
Translate the following response into ${languageName}. Only return the translation, no extra explanation.

RESPONSE:
${englishAnswer}
  `.trim();

  const translated = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: translationPrompt }],
  });

  return translated.choices[0].message.content.trim();
}

module.exports = { getResponseFromOpenAI };
