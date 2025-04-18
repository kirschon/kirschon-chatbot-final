require("dotenv").config();
const axios = require("axios");

const SHOP = process.env.SHOPIFY_SHOP;
const TOKEN = process.env.SHOPIFY_API_TOKEN;

async function getShopifyProducts(language = "en") {
  const url = `https://${SHOP}/admin/api/2023-04/products.json?limit=250`;
  const headers = {
    "X-Shopify-Access-Token": TOKEN,
    "Content-Type": "application/json",
  };

  try {
    const res = await axios.get(url, { headers });
    const all = res.data.products;

    const keywords = [
      "portacenere", "porta oggetti",
      "petrified wood bowl", "petrified wood ashtray",
      "petrified wood", "ciotola in legno pietrificato"
    ];

    const normalized = all.map((p) => {
      const text = (p.title + " " + p.body_html).toLowerCase();
      const material_tag = keywords.some(k => text.includes(k.toLowerCase())) ? "petrified" : "other";

      return {
        title: p.title,
        description: p.body_html.replace(/<[^>]*>?/gm, ""), // strip HTML
        url: `https://${SHOP}/products/${p.handle}`,
        image: p.images?.[0]?.src || null,
        material_tag,
      };
    });

    return normalized;
  } catch (err) {
    console.error("Errore caricando prodotti da Shopify:", err.response?.data || err.message);
    return [];
  }
}

module.exports = { getShopifyProducts };