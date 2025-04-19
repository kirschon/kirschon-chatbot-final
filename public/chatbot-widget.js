 // public/chatbot-widget.js
(function() {
  // 1. Crea il wrapper del widget
  const wrapper = document.createElement('div');
  wrapper.id = 'kirschon-chat-widget';
  Object.assign(wrapper.style, {
    position: 'fixed',
    bottom:   '80px',   // ↑ da 20px a 80px per sollevarlo
    right:    '80px',   // ↑ da 20px a 80px per spostarlo a sinistra
    width:    '300px',  // widget più stretto
    zIndex:   '9999',
    fontFamily: 'sans-serif'
  });
  document.body.appendChild(wrapper);

  // 2. Inserisci bottone e chatbox (inizialmente nascosta)
  wrapper.innerHTML = `
    <button id="kirschon-toggle" style="
      width:100%;
      padding:8px;
      border:none;
      background:#333;
      color:#fff;
      border-radius:10px 10px 0 0;
      cursor:pointer;
    ">
      💬 Chat with us
    </button>
    <div id="kirschon-chatbox" style="
      display: none;
      width:100%;
      background:white;
      padding:10px;
      border-radius:0 0 10px 10px;
      box-shadow:0 0 10px rgba(0,0,0,0.1);
    ">
      <textarea id="kirschon-input" placeholder="Write here…" style="
        width:100%;
        padding:6px;
        box-sizing:border-box;
      "></textarea>
      <button id="kirschon-send" style="margin-top:5px;">Send</button>
      <div id="kirschon-replies" style="
        margin-top:10px;
        max-height:300px;
        overflow-y:auto;
      "></div>
    </div>
  `;

  // 3. Prendi i riferimenti *dentro* il wrapper
  const toggleBtn = wrapper.querySelector('#kirschon-toggle');
  const chatbox   = wrapper.querySelector('#kirschon-chatbox');
  const sendBtn   = wrapper.querySelector('#kirschon-send');
  const inputEl   = wrapper.querySelector('#kirschon-input');
  const replyEl   = wrapper.querySelector('#kirschon-replies');

  // 4. Toggle della sola chatbox
  toggleBtn.addEventListener('click', () => {
    const isOpen = chatbox.style.display === 'block';
    chatbox.style.display   = isOpen ? 'none' : 'block';
    toggleBtn.textContent   = isOpen ? '💬 Chat with us' : '🔼 Close Chat';
  });

  // 5. Invio messaggi
  sendBtn.addEventListener('click', async () => {
    const text = inputEl.value.trim();
    if (!text) return;
    replyEl.innerHTML = `<p><em>Typing…</em></p>`;
    inputEl.value = '';
    try {
      const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text })
      });
      const data = await res.json();
      replyEl.innerHTML = `<p>${data.reply.replace(/\n/g,'<br>')}</p>`;
    } catch (err) {
      replyEl.innerHTML = `<p><strong>Error:</strong> Please try again later.</p>`;
      console.error('Chatbot error:', err);
    }
  });

  // Debug log
  console.log('🟢 Kirschon chat widget initialized', { toggleBtn, chatbox });
})();
