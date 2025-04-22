const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getResponseFromOpenAI } = require('./openai');
const { getShopifyProducts } = require('./shopify');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  console.log("✅ Richiesta ricevuta:", req.body);
  const { message, language, location } = req.body;


  const products = await getShopifyProducts(language);
  const aiResponse = await getResponseFromOpenAI(message, language, products);
  res.json({ reply: aiResponse });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));