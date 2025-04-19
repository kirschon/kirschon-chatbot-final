 // public/chatbot-widget.js
(function(){
  // 1️⃣ wrapper
  const wrapper = document.createElement('div');
  wrapper.id = 'kirschon-chat-widget';
  Object.assign(wrapper.style, {
    position:      'fixed',
    bottom:        '20px',
    right:         '20px',
    zIndex:        '9999',
    display:       'flex',
    flexDirection: 'column-reverse',
    alignItems:    'flex-end',
    fontFamily:    'Times New Roman, serif'
  });
  document.body.appendChild(wrapper);

  // 2️⃣ inject bubble + chat UI
  wrapper.innerHTML = `
    <!-- Bubble -->
    <button id="kc-toggle" style="
      width:60px; height:60px;
      background:#fff; border:none; border-radius:50%;
      font-size:28px; line-height:0; cursor:pointer; padding:0;
    ">💬</button>

    <!-- Chatbox -->
    <div id="kc-chatbox" style="
      display:none;
      width:300px; background:#fff;
      padding:10px; border-radius:5px;
      box-shadow:0 0 10px rgba(0,0,0,0.1);
      box-sizing:border-box;
      position:relative;
      margin-bottom:8px;
    ">
      <!-- Close -->
      <span id="kc-close" style="
        position:absolute; top:8px; right:8px;
        cursor:pointer; font-size:18px;
      ">✕</span>

      <!-- LANGUAGE SELECTOR -->
      <div id="kc-lang-container" style="margin-bottom:8px;">
        <select id="kc-lang-select" style="
          width:100%; padding:6px;
          font-size:14px; font-family:inherit;
          box-sizing:border-box;
        ">
          <option value="" disabled selected>Select language</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="es">🇪🇸 Español</option>
        </select>
      </div>

      <!-- GREETING -->
      <div id="kc-greeting" style="
        display:none;
        background:#e0e0e0;
        color:#000;
        padding:8px;
        border-radius:8px;
        margin-bottom:8px;
        font-size:14px;
        line-height:1.4;
      "></div>

      <!-- INPUT LABEL -->
      <div id="kc-input-label" style="
        display:none;
        margin-bottom:4px;
        font-size:14px;
        color:#666;
        font-family:inherit;
      "></div>

      <!-- INPUT -->
      <textarea id="kc-input" style="
        display:none;
        width:100%; height:80px;
        padding:6px; font-family:inherit;
        font-size:14px; box-sizing:border-box;
        resize:vertical;
        border:none;       /* ← no border */
        outline:none;      /* ← no focus outline */
      "></textarea>

      <!-- REPLIES -->
      <div id="kc-replies" style="
        display:none;
        margin-top:10px; max-height:150px;
        overflow-y:auto; font-family:inherit;
        font-size:14px; display:flex; flex-direction:column;
      "></div>
    </div>
  `;

  // 3️⃣ grab elements
  const toggleBtn = wrapper.querySelector('#kc-toggle');
  const chatbox   = wrapper.querySelector('#kc-chatbox');
  const closeBtn  = wrapper.querySelector('#kc-close');
  const langCont  = wrapper.querySelector('#kc-lang-container');
  const langSel   = wrapper.querySelector('#kc-lang-select');
  const greetDiv  = wrapper.querySelector('#kc-greeting');
  const inputLbl  = wrapper.querySelector('#kc-input-label');
  const inputEl   = wrapper.querySelector('#kc-input');
  const replies   = wrapper.querySelector('#kc-replies');

  // 4️⃣ localized greetings & input labels
  const greetings = {
    it: "Ciao! Sono Utopia, la tua assistente virtuale. Come posso aiutarti?",
    en: "Hi, I'm Utopia your virtual assistant! How can I help you?",
    fr: "Bonjour ! Je suis Utopia, votre assistante virtuelle. Comment puis‑je vous aider ?",
    de: "Hallo! Ich bin Utopia, Ihre virtuelle Assistentin. Wie kann ich Ihnen helfen?",
    es: "¡Hola! Soy Utopia, tu asistente virtual. ¿Cómo puedo ayudarte?"
  };
  const inputPrompts = {
    it: "Scrivi un messaggio…",
    en: "Type a message…",
    fr: "Tapez un message…",
    de: "Schreiben Sie eine Nachricht…",
    es: "Escribe un mensaje…"
  };

  // 5️⃣ show/hide chat & bubble
  function showChat() {
    toggleBtn.style.display = 'none';
    chatbox.style.display   = 'block';
    langCont.style.display  = 'block';
    greetDiv.style.display  = 'none';
    inputLbl.style.display  = 'none';
    inputEl.style.display   = 'none';
    replies.style.display   = 'none';
  }
  function hideChat() {
    chatbox.style.display   = 'none';
    toggleBtn.style.display = 'block';
  }

  toggleBtn.addEventListener('click', showChat);
  closeBtn.addEventListener('click', hideChat);

  // 6️⃣ after language select → show greeting, label & input
  langSel.addEventListener('change', e => {
    const lang = e.target.value;
    // hide selector
    langCont.style.display   = 'none';
    // greeting
    greetDiv.textContent     = greetings[lang] || greetings.en;
    greetDiv.style.display   = 'block';
    // input label
    inputLbl.textContent     = inputPrompts[lang] || inputPrompts.en;
    inputLbl.style.display   = 'block';
    // input & replies
    inputEl.style.display    = 'block';
    replies.style.display    = 'flex';
    inputEl.focus();
  });

  // 7️⃣ send on Enter
  inputEl.addEventListener('keydown', async ev => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      const text = inputEl.value.trim();
      if (!text) return;
      appendMsg('user', text);
      inputEl.value = '';
      appendMsg('utopia', '<em>Typing…</em>');
      try {
        const res = await fetch(
          'https://kirschon-chatbot-final.onrender.com/api/chat',
          {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ message:text, language:langSel.value })
          }
        );
        const { reply } = await res.json();
        const last = replies.lastChild;
        last.innerHTML = reply.replace(/\n/g,'<br>');
      } catch {
        const last = replies.lastChild;
        last.innerHTML = '<strong>Error:</strong> Try again later.';
      }
      replies.scrollTop = replies.scrollHeight;
    }
  });

  // 8️⃣ helper to append message
  function appendMsg(author, text) {
    const msg = document.createElement('div');
    Object.assign(msg.style, {
      maxWidth:    '80%',
      padding:     '8px',
      marginBottom:'8px',
      borderRadius:'8px',
      fontFamily:  'Times New Roman, serif',
      fontSize:    '14px',
      lineHeight:  '1.4',
      alignSelf:   author==='utopia' ? 'flex-start' : 'flex-end',
      background:  author==='utopia' ? '#e0e0e0' : '#fff',
      color:       '#000',
      border:      author==='utopia' ? 'none' : 'none'
    });
    msg.innerHTML = text;
    replies.appendChild(msg);
    replies.scrollTop = replies.scrollHeight;
  }

  console.log('🟢 Kirschon widget: added input label & removed textarea border');
})();
