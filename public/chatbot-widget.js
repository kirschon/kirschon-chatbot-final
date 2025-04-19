 // public/chatbot-widget.js
(function(){
  // ← PUT YOUR ACTUAL FAVICON HERE:
  const FAVICON_URL = 'https://your-cdn-or-shopify-domain.com/path/to/favicon.ico';

  // 1️⃣ create wrapper
  const wrapper = document.createElement('div');
  wrapper.id = 'utopia-chat-widget';
  Object.assign(wrapper.style, {
    position:   'fixed',
    bottom:     '80px',
    right:      '80px',
    width:      '300px',
    zIndex:     '9999',
    fontFamily: 'Times New Roman, serif',
    boxSizing:  'border-box'
  });
  document.body.appendChild(wrapper);

  // 2️⃣ inject the three panels
  wrapper.innerHTML = `
    <!-- A) BUBBLE (step 1) -->
    <div id="utopia-bubble" style="
      width:50px; height:50px;
      background:#fff; border:1px solid #000;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer;
    ">
      <img src="https://kirschon-chatbot-final.onrender.com/favicon.ico" alt="Chat" style="width:24px; height:24px;">
    </div>

    <!-- B) LANGUAGE BAR (step 2) -->
    <div id="utopia-langbar" style="
      display:none;
      background:#fff;
      border-radius:5px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      padding:10px; box-sizing:border-box;
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

    <!-- C) CHAT WINDOW (step 3) -->
    <div id="utopia-chat" style="
      display:none;
      background:#fff;
      border-radius:5px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      overflow:hidden;
      flex-direction:column;
      height:400px;
      display:flex;
      box-sizing:border-box;
    ">
      <!-- header -->
      <div style="
        background:#000; color:#fff;
        padding:10px; position:relative;
        font-family:Times New Roman, serif;
      ">
        <div style="font-weight:bold; font-size:16px;">CHAT WITH UTOPIA</div>
        <div style="font-size:14px; margin-top:4px;">Our virtual assistant</div>
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
      <!-- input -->
      <div style="padding:10px; box-sizing:border-box;">
        <textarea id="utopia-input" placeholder="Write here…" style="
          width:100%; height:60px;
          font-family:Times New Roman, serif;
          box-sizing:border-box;
          padding:6px; border:1px solid #ccc;
          resize:none;
        "></textarea>
      </div>
    </div>
  `;

  // 3️⃣ grab elements
  const bubble   = wrapper.querySelector('#utopia-bubble');
  const langbar  = wrapper.querySelector('#utopia-langbar');
  const langSel  = wrapper.querySelector('#utopia-lang-select');
  const chatWin  = wrapper.querySelector('#utopia-chat');
  const closeBtn = wrapper.querySelector('#utopia-close');
  const replies  = wrapper.querySelector('#utopia-replies');
  const input    = wrapper.querySelector('#utopia-input');

  // helper to append a bubble
  function addMsg(author, text) {
    const msg = document.createElement('div');
    Object.assign(msg.style, {
      maxWidth:    '80%',
      padding:     '8px',
      marginBottom:'8px',
      borderRadius:'10px',
      fontFamily:  'Times New Roman, serif',
      alignSelf:   author==='utopia' ? 'flex-start' : 'flex-end',
      background:  author==='utopia' ? '#000' : '#e0e0e0',
      color:       author==='utopia' ? '#fff' : '#000'
    });
    msg.innerHTML = text;
    replies.appendChild(msg);
    replies.scrollTop = replies.scrollHeight;
  }

  // 4️⃣ flow logic
  bubble.addEventListener('click', () => {
    bubble.style.display  = 'none';
    langbar.style.display = 'block';
  });

  langSel.addEventListener('change', () => {
    langbar.style.display = 'none';
    chatWin.style.display = 'flex';
    addMsg('utopia','How can I help you?');
  });

  closeBtn.addEventListener('click', () => {
    chatWin.style.display = 'none';
    bubble.style.display  = 'flex';
    replies.innerHTML     = '';
  });

  // 5️⃣ send on Enter
  input.addEventListener('keydown', async e => {
    if(e.key==='Enter' && !e.shiftKey){
      e.preventDefault();
      const txt = input.value.trim();
      if(!txt) return;
      addMsg('user', txt);
      input.value='';
      addMsg('utopia','<em>Typing…</em>');

      try {
        const res = await fetch(
          'https://kirschon-chatbot-final.onrender.com/api/chat',
          {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({message:txt, language:langSel.value})
          }
        );
        const {reply} = await res.json();
        const last = replies.lastChild;
        last.innerHTML = reply;
        last.style.color = '#fff';
      } catch(err){
        const last = replies.lastChild;
        last.innerHTML = '<strong>Error, try again later.</strong>';
        last.style.background = '#f00';
      }
      replies.scrollTop = replies.scrollHeight;
    }
  });

  console.log('🟢 Utopia widget initialized');
})();
