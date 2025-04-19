 // public/chatbot-widget.js
(function() {
  // 1. Creazione wrapper
  const wrapper = document.createElement('div');
  wrapper.id = 'kirschon-chat-widget';
  Object.assign(wrapper.style, {
    position: 'fixed',
    bottom:   '80px',   
    right:    '80px',   
    width:    '300px',  
    zIndex:   '9999',
    fontFamily: 'sans-serif'
  });
  document.body.appendChild(wrapper);

  // 2. Markup interno: solo icona nel toggle e select per la lingua
  wrapper.innerHTML = `
    <button id="kirschon-toggle" style="
      display: inline-block;
      padding: 8px;
      border: none;
      background: #333;
      color: #fff;
      border-radius: 10px;
      cursor: pointer;
      font-size: 18px;
      width: auto;
    ">💬</button>
    <div id="kirschon-chatbox" style="
      display: none;
      width:100%;
      background:white;
      padding:10px;
      border-radius:0 0 10px 10px;
      box-shadow:0 0 10px rgba(0,0,0,0.1);
      box-sizing: border-box;
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
      </select>
      <textarea id="kirschon-input" placeholder="" style="
        width:100%;
        padding:6px;
        box-sizing:border-box;
        resize: vertical;
      "></textarea>
      <button id="kirschon-send" style="
        margin-top:5px;
        width:100%;
        padding:8px;
        border:none;
        background:#007bff;
        color:#fff;
        border-radius:5px;
        cursor:pointer;
      ">Send</button>
      <div id="kirschon-replies" style="
        margin-top:10px;
        max-height:300px;
        overflow-y:auto;
      "></div>
    </div>
  `;

  // 3. Riferimenti e traduzioni
  const toggleBtn = wrapper.querySelector('#kirschon-toggle');
  const chatbox   = wrapper.querySelector('#kirschon-chatbox');
  const langSelect = wrapper.querySelector('#kirschon-lang-select');
  const inputEl   = wrapper.querySelector('#kirschon-input');
  const sendBtn   = wrapper.querySelector('#kirschon-send');
  const replyEl   = wrapper.querySelector('#kirschon-replies');

  const translations = {
    it: { send: "Invia", placeholder: "Scrivi qui..." },
    en: { send: "Send", placeholder: "Write here..." },
    fr: { send: "Envoyer", placeholder: "Écrivez ici..." },
    de: { send: "Senden", placeholder: "Schreiben Sie hier..." },
  };

  function updateLanguageUI(lang) {
    const t = translations[lang] || translations.en;
    sendBtn.textContent = t.send;
    inputEl.placeholder = t.placeholder;
  }

  // 4. Evento cambio lingua
  langSelect.addEventListener('change', e => {
    updateLanguageUI(e.target.value);
  });

  // Imposta lingua di default
  updateLanguageUI(langSelect.value);

  // 5. Toggle del box
  toggleBtn.addEventListener('click', () => {
    const isOpen = chatbox.style.display === 'block';
    chatbox.style.display = isOpen ? 'none' : 'block';
  });

  // 6. Invio messaggio
  sendBtn.addEventListener('click', async () => {
    const text = inputEl.value.trim();
    if (!text) return;

    // Mostra “typing…”
    replyEl.innerHTML = `<p><em>Typing…</em></p>`;
    inputEl.value = '';

    try {
      const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: langSelect.value
        })
      });
      const data = await res.json();
      replyEl.innerHTML = `<p>${data.reply.replace(/\n/g,'<br>')}</p>`;
    } catch (err) {
      replyEl.innerHTML = `<p><strong>Error:</strong> Please try again later.</p>`;
      console.error(err);
    }
  });

  console.log('🟢 Kirschon widget ready');
})();
