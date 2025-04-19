 // public/chatbot-widget.js
(function() {
  const FAVICON_URL = 'https://cdn.shopify.com/s/files/1/0023/8390/4804/files/Kirschon_favicon_symbol_e1964298-105b-4a18-9b01-5fe45c6f1e92.png?v=1683971648';

  // 1️⃣ Wrapper
  const wrapper = document.createElement('div');
  wrapper.id = 'kirschon-chat-widget';
  Object.assign(wrapper.style, {
    position: 'fixed',
    bottom:   '80px',
    right:    '80px',
    width:    '140px',
    zIndex:   '9999',
    fontFamily: 'sans-serif'
  });
  document.body.appendChild(wrapper);

  // 2️⃣ Markup: dark pill toggle + chat panel
  wrapper.innerHTML = `
    <!-- dark pill with favicon + CHAT text -->
    <div id="kirschon-toggle" style="
      display: flex;
      align-items: center;
      background: #333;
      padding: 8px;
      border-radius: 50px;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
    ">
      <img src="${FAVICON_URL}" alt="Logo" style="
        width:20px;
        height:20px;
        margin-right:8px;
        flex-shrink:0;
      ">
      <span id="kirschon-toggle-text">CHAT</span>
    </div>

    <!-- chat panel -->
    <div id="kirschon-chatbox" style="
      display: none;
      width: 100%;
      background: #fff;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      box-sizing: border-box;
      margin-top: 8px;
    ">
      <select id="kirschon-lang-select" style="
        width:100%;
        margin-bottom:8px;
        padding:4px;
        font-size:14px;
        box-sizing:border-box;
      ">
        <option value="it">🇮🇹 Italiano</option>
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="es">🇪🇸 Español</option>
      </select>
      <textarea id="kirschon-input" placeholder="Scrivi qui..." style="
        width:100%;
        padding:6px;
        box-sizing:border-box;
        resize: vertical;
        min-height:60px;
      "></textarea>
      <button id="kirschon-send" style="
        margin-top:8px;
        width:100%;
        padding:8px;
        border:none;
        background:#007bff;
        color:#fff;
        border-radius:5px;
        cursor:pointer;
      ">Invia</button>
      <div id="kirschon-replies" style="
        margin-top:10px;
        max-height:300px;
        overflow-y:auto;
      "></div>
    </div>
  `;

  // 3️⃣ References
  const toggle     = wrapper.querySelector('#kirschon-toggle');
  const chatbox    = wrapper.querySelector('#kirschon-chatbox');
  const langSelect = wrapper.querySelector('#kirschon-lang-select');
  const inputEl    = wrapper.querySelector('#kirschon-input');
  const sendBtn    = wrapper.querySelector('#kirschon-send');
  const replyEl    = wrapper.querySelector('#kirschon-replies');

  // 4️⃣ Translations
  const translations = {
    it: { send: "Invia",    placeholder: "Scrivi qui..." },
    en: { send: "Send",     placeholder: "Write here..." },
    fr: { send: "Envoyer",  placeholder: "Écrivez ici..." },
    de: { send: "Senden",   placeholder: "Schreiben Sie qui..." },
    es: { send: "Enviar",   placeholder: "Escribe aquí..." }
  };

  function updateLangUI(lang) {
    const t = translations[lang] || translations.it;
    sendBtn.textContent = t.send;
    inputEl.placeholder = t.placeholder;
  }

  langSelect.addEventListener('change', e => updateLangUI(e.target.value));
  updateLangUI(langSelect.value);

  // 5️⃣ Toggle open/close
  toggle.addEventListener('click', () => {
    const opened = chatbox.style.display === 'block';
    chatbox.style.display = opened ? 'none' : 'block';
  });

  // 6️⃣ Send message
  sendBtn.addEventListener('click', async () => {
    const text = inputEl.value.trim();
    if (!text) return;
    replyEl.innerHTML = `<p><em>Typing…</em></p>`;
    inputEl.value = '';

    try {
      const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language: langSelect.value })
      });
      const data = await res.json();
      replyEl.innerHTML = `<p>${data.reply.replace(/\n/g,'<br>')}</p>`;
    } catch (err) {
      replyEl.innerHTML = `<p><strong>Error:</strong> Try again later.</p>`;
      console.error(err);
    }
  });

  console.log('🟢 Kirschon widget ready');
})();
