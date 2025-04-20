 // public/chatbot-widget.js
(function(){
  // 0️⃣ Optional: enforce black placeholder visibility
  const style = document.createElement('style');
  style.textContent = `
    #kc-input::placeholder {
      color: #000 !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);

  // 1️⃣ Create wrapper
  const wrapper = document.createElement('div');
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

  // 2️⃣ Bubble + hidden chat container
  wrapper.innerHTML = `
    <button id="kc-toggle" style="
      width:60px; height:60px;
      background:#fff; border:none; border-radius:50%;
      font-size:28px; cursor:pointer; padding:0;
    ">💬</button>
    <div id="kc-chatbox" style="display:none;"></div>
  `;

  // 3️⃣ Populate chatbox
  const chatbox = wrapper.querySelector('#kc-chatbox');
  chatbox.innerHTML = `
    <div style="
      width:300px; background:#fff;
      border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);
      overflow:hidden; display:flex; flex-direction:column;
    ">
      <!-- LANGUAGE SELECTOR -->
      <div id="kc-lang-container" style="padding:10px; box-sizing:border-box;">
        <select id="kc-lang-select" style="
          width:100%; padding:6px;
          font-size:14px; font-family:inherit;
        ">
          <option value="" disabled selected>Select language</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="es">🇪🇸 Español</option>
        </select>
      </div>
      <!-- HEADER (hidden until after language select) -->
      <div id="kc-header" style="
        display:none;
        background:#000; color:#fff;
        padding:10px; font-size:14px;
        display:flex; align-items:center; justify-content:space-between;
      ">
        <span id="kc-header-text" style="font-family:inherit; line-height:1.4;"></span>
        <span id="kc-close" style="cursor:pointer; font-size:18px;">✕</span>
      </div>
      <!-- REPLIES -->
      <div id="kc-replies" style="
        flex:1; padding:8px; overflow-y:auto;
        display:flex; flex-direction:column; gap:6px;
      "></div>
      <!-- INPUT AREA -->
      <div style="position:relative; padding:8px; background:#f7f7f7;">
        <div id="kc-input-bubble" style="
          position:absolute; top:8px; left:8px; right:8px; bottom:8px;
          background:#d3d3d3; color:#000;
          border-radius:16px; padding:12px;
          font-size:14px; pointer-events:none;
          font-family:inherit;
        ">Type a message…</div>
        <textarea id="kc-input" placeholder="Type a message…" style="
          position:relative; width:100%; height:40px;
          background:transparent; border:none; resize:none;
          padding:12px 12px 0; box-sizing:border-box;
          font-family:inherit; font-size:14px; z-index:1;
        "></textarea>
      </div>
    </div>
  `;

  // 4️⃣ Element references
  const toggleBtn       = wrapper.querySelector('#kc-toggle');
  const chat            = wrapper.querySelector('#kc-chatbox');
  const langCont        = wrapper.querySelector('#kc-lang-container');
  const langSel         = wrapper.querySelector('#kc-lang-select');
  const header          = wrapper.querySelector('#kc-header');
  const headerText      = wrapper.querySelector('#kc-header-text');
  const closeBtn        = wrapper.querySelector('#kc-close');
  const replies         = wrapper.querySelector('#kc-replies');
  const input           = wrapper.querySelector('#kc-input');
  const placeholderBubble = wrapper.querySelector('#kc-input-bubble');

  // 5️⃣ Localized greetings & input prompts
  const greetings = {
    it: "Ciao! Sono Utopia, la tua assistente virtuale. Come posso aiutarti?",
    en: "Hi, I'm Utopia your virtual assistant! How can I help you?",
    fr: "Bonjour ! Je suis Utopia, votre assistante virtuelle. Comment puis-je vous aider ?",
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

  // 6️⃣ Open / close chat
  toggleBtn.addEventListener('click', () => {
    toggleBtn.style.display   = 'none';
    chat.style.display        = 'block';
    langCont.style.display    = 'block';
    header.style.display      = 'none';
    input.focus();
  });
  closeBtn.addEventListener('click', () => {
    chat.style.display        = 'none';
    toggleBtn.style.display   = 'block';
    replies.innerHTML         = '';
  });

  // 7️⃣ After language select → show header & update texts
  langSel.addEventListener('change', e => {
    const lang = e.target.value;
    langCont.style.display      = 'none';
    headerText.textContent      = greetings[lang] || greetings.en;
    header.style.display        = 'flex';
    // update input prompt
    const prompt                 = inputPrompts[lang] || inputPrompts.en;
    input.placeholder            = prompt;
    placeholderBubble.textContent= prompt;
    input.focus();
  });

  // 8️⃣ Hide placeholder on focus or typing
  input.addEventListener('focus', () => placeholderBubble.style.display = 'none');
  input.addEventListener('input', () => placeholderBubble.style.display = 'none');

  // 9️⃣ Helper to append message bubbles
  function appendMsg(author, text) {
    const msg = document.createElement('div');
    Object.assign(msg.style, {
      maxWidth:    '80%',
      padding:     '8px 12px',
      borderRadius:'16px',
      fontFamily:  'Times New Roman, serif',
      fontSize:    '14px',
      lineHeight:  '1.4',
      alignSelf:   author==='utopia' ? 'flex-start' : 'flex-end',
      background:  author==='utopia' ? '#000' : '#d3d3d3',
      color:       author==='utopia' ? '#fff' : '#000'
    });
    msg.innerHTML = text;
    replies.appendChild(msg);
    replies.scrollTop = replies.scrollHeight;
  }

  // 🔟 Send on Enter
  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const txt = input.value.trim();
      if (!txt) return;
      appendMsg('user', txt);
      input.value = '';
      appendMsg('utopia', '<em>Typing…</em>');
      try {
        const res = await fetch(
          'https://kirschon-chatbot-final.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: txt, language: langSel.value })
        });
        const { reply } = await res.json();
        const last = replies.lastChild;
        last.innerHTML = reply.replace(/\n/g,'<br>');
      } catch {
        const last = replies.lastChild;
        last.innerHTML = '<strong>Error, try again later.</strong>';
      }
    }
  });

  console.log('🟢 Kirschon widget: localized header & input prompt');
})();
