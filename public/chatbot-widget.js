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

  // 2️⃣ inject bubble + chat UI (with close icon)
  wrapper.innerHTML = `
    <!-- Bubble -->
    <button id="kirschon-toggle" style="
      width:60px; height:60px;
      background:#fff; border:none; border-radius:50%;
      font-size:28px; line-height:0; cursor:pointer; padding:0;
    ">💬</button>

    <!-- Chatbox -->
    <div id="kirschon-chatbox" style="
      display:none;
      width:300px; background:#fff;
      padding:10px; border-radius:5px;
      box-shadow:0 0 10px rgba(0,0,0,0.1);
      box-sizing:border-box;
      margin-bottom:8px;
      position:relative;
    ">
      <!-- Close “×” -->
      <span id="kirschon-close" style="
        position:absolute; top:8px; right:8px;
        cursor:pointer; font-size:18px;
      ">✕</span>

      <!-- Language selector -->
      <select id="kirschon-lang-select" style="
        width:100%; margin-bottom:8px;
        padding:4px; font-size:14px;
        font-family:inherit; box-sizing:border-box;
      ">
        <option value="it">🇮🇹 Italiano</option>
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="es">🇪🇸 Español</option>
      </select>

      <!-- Input -->
      <textarea id="kirschon-input" placeholder="" style="
        width:100%; height:100px;
        padding:6px; font-family:inherit;
        font-size:14px; box-sizing:border-box;
        resize:vertical;
      "></textarea>

      <!-- Replies -->
      <div id="kirschon-replies" style="
        margin-top:10px; max-height:150px;
        overflow-y:auto; font-family:inherit;
        font-size:14px;
      "></div>
    </div>
  `;

  // 3️⃣ grab elements
  const toggleBtn  = wrapper.querySelector('#kirschon-toggle');
  const chatbox    = wrapper.querySelector('#kirschon-chatbox');
  const closeBtn   = wrapper.querySelector('#kirschon-close');
  const langSelect = wrapper.querySelector('#kirschon-lang-select');
  const inputEl    = wrapper.querySelector('#kirschon-input');
  const replyEl    = wrapper.querySelector('#kirschon-replies');

  // 4️⃣ language → placeholder map
  const placeholders = {
    it: "Scrivi qui…",
    en: "Write here…",
    fr: "Écrivez qui…",
    de: "Schreiben Sie qui…",
    es: "Escribe aquí…"
  };
  langSelect.addEventListener('change', e => {
    inputEl.placeholder = placeholders[e.target.value] || placeholders.en;
  });
  inputEl.placeholder = placeholders[langSelect.value] || placeholders.en;

  // 5️⃣ show/hide chat
  function hideChat() { chatbox.style.display = 'none'; }
  function showChat() { chatbox.style.display = 'block'; }

  toggleBtn.addEventListener('click', () => {
    chatbox.style.display === 'block' ? hideChat() : showChat();
  });
  closeBtn.addEventListener('click', hideChat);

  // 6️⃣ send on Enter
  inputEl.addEventListener('keydown', async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (!text) return;

      replyEl.innerHTML = `<p><em>Typing…</em></p>`;
      inputEl.value = '';

      try {
        const res = await fetch(
          'https://kirschon-chatbot-final.onrender.com/api/chat',
          {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ message: text, language: langSelect.value })
          }
        );
        const { reply } = await res.json();
        replyEl.innerHTML = `<p>${reply.replace(/\n/g,'<br>')}</p>`;
      } catch {
        replyEl.innerHTML = `<p><strong>Error:</strong> Try again later.</p>`;
      }
    }
  });

  console.log('🟢 Kirschon widget with close button ready');
})();
