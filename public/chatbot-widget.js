 // public/chatbot-widget.js
(function() {
  // 1) Wrapper
  const wrapper = document.createElement('div');
  wrapper.id = 'utopia-chat-widget';
  Object.assign(wrapper.style, {
    position: 'fixed',
    bottom:   '80px',      // distance from bottom
    right:    '80px',      // distance from right
    width:    '300px',     // overall widget width
    zIndex:   '9999',
    fontFamily: 'Times New Roman, serif',
    boxSizing: 'border-box'
  });
  document.body.appendChild(wrapper);

  // 2) Initial white bubble with your black favicon
  wrapper.innerHTML = `
    <div id="utopia-bubble" style="
      width:50px; height:50px;
      background:#fff;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer;
    ">
      <img src="https://kirschon-chatbot-final.onrender.com/favicon.ico"
           alt="Chat" style="width:24px; height:24px;">
    </div>

    <!-- 3) Language‑selector bar (step 2) -->
    <div id="utopia-langbar" style="
      display:none;
      background:#fff;
      border-radius:5px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      padding:10px;
      cursor:pointer;
    ">
      <select id="utopia-lang-select" style="
        width:100%; padding:6px; box-sizing:border-box;
        font-family:Times New Roman, serif;
      ">
        <option value="it">🇮🇹 Italiano</option>
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="es">🇪🇸 Español</option>
      </select>
    </div>

    <!-- 4) Full chat window (step 3) -->
    <div id="utopia-chat" style="
      display:none;
      background:#fff;
      border-radius:5px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      overflow:hidden;
      display:flex; flex-direction:column;
      height:400px;
    ">
      <!-- header -->
      <div style="
        background:#000; color:#fff;
        padding:10px; position:relative;
        font-family:Times New Roman, serif;
        display:flex; flex-direction:column;
        box-sizing:border-box;
      ">
        <span style="font-size:16px; font-weight:bold;">
          CHAT WITH UTOPIA
        </span>
        <span style="font-size:14px; margin-top:4px;">
          Our virtual assistant
        </span>
        <span id="utopia-close" style="
          position:absolute; top:8px; right:10px;
          cursor:pointer; font-size:18px;
        ">✕</span>
      </div>
      <!-- messages -->
      <div id="utopia-replies" style="
        flex:1; overflow-y:auto;
        padding:10px; box-sizing:border-box;
        display:flex; flex-direction:column;
      "></div>
      <!-- input area (no send‑box/button) -->
      <div style="padding:10px; box-sizing:border-box;">
        <textarea id="utopia-input" placeholder="Write here…"
          style="
            width:100%; height:60px;
            font-family:Times New Roman, serif;
            box-sizing:border-box;
            padding:6px; border:1px solid #ccc;
            resize:none;
          ">
        </textarea>
      </div>
    </div>
  `;

  // 5) References
  const bubble   = wrapper.querySelector('#utopia-bubble');
  const langbar  = wrapper.querySelector('#utopia-langbar');
  const langSel  = wrapper.querySelector('#utopia-lang-select');
  const chatWin  = wrapper.querySelector('#utopia-chat');
  const closeBtn = wrapper.querySelector('#utopia-close');
  const replies  = wrapper.querySelector('#utopia-replies');
  const input    = wrapper.querySelector('#utopia-input');

  // Helper to append a message bubble
  function appendMsg(who, text) {
    const msg = document.createElement('div');
    msg.style.maxWidth    = '80%';
    msg.style.padding     = '8px';
    msg.style.marginBottom= '8px';
    msg.style.borderRadius= '10px';
    msg.style.fontFamily  = 'Times New Roman, serif';
    if (who === 'utopia') {
      msg.style.background = '#000';
      msg.style.color      = '#fff';
      msg.style.alignSelf  = 'flex-start';
    } else {
      msg.style.background = '#e0e0e0';
      msg.style.color      = '#000';
      msg.style.alignSelf  = 'flex-end';
    }
    msg.innerHTML = text;
    replies.appendChild(msg);
    replies.scrollTop = replies.scrollHeight;
  }

  // 6) Step‑flow
  bubble.addEventListener('click', () => {
    bubble.style.display  = 'none';
    langbar.style.display = 'block';
  });

  langSel.addEventListener('change', () => {
    langbar.style.display = 'none';
    chatWin.style.display = 'flex';
    // initial greeting
    appendMsg('utopia', 'How can I help you?');
  });

  closeBtn.addEventListener('click', () => {
    chatWin.style.display = 'none';
    bubble.style.display  = 'flex';
    replies.innerHTML     = '';
  });

  // 7) Send on Enter (no button)
  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      appendMsg('user', text);
      input.value = '';
      appendMsg('utopia', '<em>Typing…</em>');

      try {
        const res = await fetch(
          'https://kirschon-chatbot-final.onrender.com/api/chat',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              language: langSel.value
            })
          }
        );
        const { reply } = await res.json();
        // replace the “Typing…” last message
        replies.lastChild.innerHTML = reply;
        replies.lastChild.style.color = '#fff';
      } catch (err) {
        replies.lastChild.innerHTML = '<strong>Error, try again later.</strong>';
        replies.lastChild.style.background = '#f00';
      }
      replies.scrollTop = replies.scrollHeight;
    }
  });

  console.log('🟢 Utopia widget ready');
})();
