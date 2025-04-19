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
      position:relative;
      margin-bottom:8px;
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
        <option value="en" selected>🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="es">🇪🇸 Español</option>
      </select>

      <!-- Greeting from Utopia -->
      <div id="kirschon-greeting" style="
        background:#e0e0e0;
        color:#000;
        padding:8px;
        border-radius:8px;
        margin-bottom:8px;
        font-size:14px;
        line-height:1.4;
      ">
        Hi, I’m Utopia your virtual assistant! How can I help you?
      </div>

      <!-- Input -->
      <textarea id="kirschon-input" placeholder="" style="
        width:100%; height:80px;
        padding:6px; font-family:inherit;
        font-size:14px; box-sizing:border-box;
        resize:vertical;
      "></textarea>

      <!-- Replies -->
      <div id="kirschon-replies" style="
        margin-top:10px; max-height:150px;
        overflow-y:auto; font-family:inherit;
        font-size:14px; display:flex; flex-direction:column;
      "></div>
    </div>
  `;

  // 3️⃣ grab elements
  const toggleBtn   = wrapper.querySelector('#kirschon-toggle');
  const chatbox     = wrapper.querySelector('#kirschon-chatbox');
  const closeBtn    = wrapper.querySelector('#kirschon-close');
  const langSelect  = wrapper.querySelector('#kirschon-lang-select');
  const inputEl     = wrapper.querySelector('#kirschon-input');
  const replyEl     = wrapper.querySelector('#kirschon-replies');

  // 4️⃣ update (no placeholder needed)
  inputEl.placeholder = '';

  // 5️⃣ show/hide chat + bubble
  function hideChat() {
    chatbox.style.display = 'none';
    toggleBtn.style.display = 'block';
    // reset replies (if you want to keep greeting, do not clear)
    replyEl.innerHTML = '';
  }
  function showChat() {
    toggleBtn.style.display = 'none';
    chatbox.style.display = 'block';
    // show the initial greeting as a reply bubble as well
    appendMsg('utopia', "Hi, I’m Utopia your virtual assistant! How can I help you?");
  }

  toggleBtn.addEventListener('click', showChat);
  closeBtn.addEventListener('click', hideChat);

  // 6️⃣ helper to append message bubbles
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
      border:      author==='utopia' ? 'none' : '1px solid #ccc'
    });
    msg.innerHTML = text;
    replyEl.appendChild(msg);
    replyEl.scrollTop = replyEl.scrollHeight;
  }

  // 7️⃣ send on Enter
  inputEl.addEventListener('keydown', async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (!text) return;

      appendMsg('user', text);
      inputEl.value = '';
      appendMsg('utopia', '<em>Typing…</em>');

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
        // replace the typing bubble
        const last = replyEl.lastChild;
        last.innerHTML = reply.replace(/\n/g,'<br>');
      } catch {
        const last = replyEl.lastChild;
        last.innerHTML = '<strong>Error:</strong> Try again later.';
      }
      replyEl.scrollTop = replyEl.scrollHeight;
    }
  });

  console.log('🟢 Kirschon widget updated: greeting under selector & styled bubbles');
})();
