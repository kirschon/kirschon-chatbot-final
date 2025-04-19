 // public/chatbot-widget.js
(function() {
  // 1) Wrapper generale
  const wrapper = document.createElement('div');
  wrapper.id = 'utopia-chat-widget';
  Object.assign(wrapper.style, {
    position: 'fixed',
    bottom:   '80px',
    right:    '80px',
    zIndex:   '9999',
    fontFamily: 'Times New Roman, serif',
    color: '#000',
    boxSizing: 'border-box'
  });
  document.body.appendChild(wrapper);

  // 2) Markup interno: bubble, bar e chat
  wrapper.innerHTML = `
    <!-- 2.1 Bubble iniziale -->
    <div id="utopia-bubble" style="
      width:50px; height:50px;
      background:#fff;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer;
    ">
      <img src="/favicon.ico" alt="Chat" style="width:24px; height:24px;">
    </div>

    <!-- 2.2 Barra intermedia -->
    <div id="utopia-bar" style="
      display:none;
      width:280px; height:50px;
      background:#fff;
      border-radius:25px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      display:flex; align-items:center; justify-content:space-between;
      padding:0 15px;
      cursor:pointer;
    ">
      <span style="font-size:16px;">Chat with an assistant</span>
      <img src="/favicon.ico" alt="Chat" style="width:20px; height:20px;">
    </div>

    <!-- 2.3 Chat box completa -->
    <div id="utopia-chat" style="
      display:none;
      width:300px; height:400px;
      background:#fff;
      border-radius:5px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      display:flex; flex-direction:column; overflow:hidden;
    ">
      <!-- Header -->
      <div id="utopia-chat-header" style="
        background:#000; color:#fff;
        padding:10px; font-weight:bold;
        display:flex; justify-content:space-between; align-items:center;
      ">
        <span>CHATTA CON UN ASSISTENTE</span>
        <span id="utopia-close" style="cursor:pointer; font-size:18px;">✕</span>
      </div>
      <!-- Messaggi -->
      <div id="utopia-replies" style="
        flex:1; overflow-y:auto;
        padding:10px; background:#f7f7f7;
        font-family: 'Times New Roman', serif;
        color: #000;
      "></div>
      <!-- Input -->
      <div id="utopia-input-area" style="
        padding:10px; background:#f0f0f0;
      ">
        <textarea
          id="utopia-input"
          placeholder="Write here…"
          style="
            width:100%; height:60px;
            border:1px solid #ccc;
            padding:6px;
            box-sizing:border-box;
            font-family:'Times New Roman', serif;
            color:#000;
            resize:none;
          "
        ></textarea>
        <button id="utopia-send" style="
          margin-top:5px;
          width:100%; padding:8px;
          border:none;
          background:#000; color:#fff;
          border-radius:5px;
          cursor:pointer;
          font-family:'Times New Roman', serif;
        ">Send</button>
      </div>
    </div>
  `;

  // 3) Riferimenti
  const bubble   = wrapper.querySelector('#utopia-bubble');
  const bar      = wrapper.querySelector('#utopia-bar');
  const chat     = wrapper.querySelector('#utopia-chat');
  const closeBtn = wrapper.querySelector('#utopia-close');
  const replies  = wrapper.querySelector('#utopia-replies');
  const input    = wrapper.querySelector('#utopia-input');
  const sendBtn  = wrapper.querySelector('#utopia-send');

  // 4) Apertura bubble → bar
  bubble.addEventListener('click', () => {
    bubble.style.display = 'none';
    bar.style.display    = 'flex';
  });

  // 5) Apertura bar → chat + messaggio di benvenuto
  bar.addEventListener('click', () => {
    bar.style.display    = 'none';
    chat.style.display   = 'flex';
    // greeting
    replies.innerHTML = `
      <div style="margin-bottom:10px; font-family:'Times New Roman', serif; color:#000;">
        <strong>Utopia:</strong> How can I help you?
      </div>
    `;
  });

  // 6) Chiusura chat → bubble
  closeBtn.addEventListener('click', () => {
    chat.style.display   = 'none';
    bubble.style.display = 'flex';
    replies.innerHTML    = '';           // pulisci conversazione
  });

  // 7) Invio messaggio
  sendBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;
    // mostra “typing…”
    replies.innerHTML += `
      <div style="margin-bottom:10px; font-family:'Times New Roman', serif; color:#000;">
        <strong>You:</strong> ${text}
      </div>
      <div style="margin-bottom:10px; font-family:'Times New Roman', serif; color:#666;">
        <em>Typing…</em>
      </div>
    `;
    input.value = '';
    // scroll to bottom
    replies.scrollTop = replies.scrollHeight;

    try {
      const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text })
      });
      const data = await res.json();
      // sostituisci “Typing…” con la risposta
      replies.lastElementChild.innerHTML = `<strong>Utopia:</strong> ${data.reply}`;
      replies.lastElementChild.style.color = '#000';
      replies.scrollTop = replies.scrollHeight;
    } catch (err) {
      replies.innerHTML += `
        <div style="margin-bottom:10px; font-family:'Times New Roman', serif; color:#f00;">
          <strong>Error:</strong> please try again later.
        </div>
      `;
      console.error(err);
    }
  });

  console.log('🟢 Utopia chat widget initialized');
})();
