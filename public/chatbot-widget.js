(function() {
  // 1. Crei il wrapper e lo metti subito in pagina
  const wrapper = document.createElement('div');
  wrapper.id = 'kirschon-chat-widget';
  Object.assign(wrapper.style, {
    position: 'fixed',
    bottom:   '20px',
    right:    '20px',
    zIndex:   '9999',
    fontFamily: 'sans-serif'
  });
  document.body.appendChild(wrapper);

  // 2. Popoli il wrapper con bottone e chatbox (chatbox nascosta di default)
  wrapper.innerHTML = `
    <button id="kirschon-toggle" style="
      width:100%;
      padding:8px;
      border:none;
      background:#333;
      color:#fff;
      border-radius:10px 10px 0 0;
      cursor:pointer;
    ">💬 Chat with us</button>
    <div id="kirschon-chatbox" style="
      display: none;
      background: white;
      padding: 10px;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
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

  // 3. Prendi riferimenti *dentro* il wrapper
  const toggleBtn = wrapper.querySelector('#kirschon-toggle');
  const chatbox   = wrapper.querySelector('#kirschon-chatbox');

  // 4. Toggle solo la chatbox, lasciando sempre visibile il bottone
  toggleBtn.addEventListener('click', () => {
    const isOpen = chatbox.style.display === 'block';
    chatbox.style.display = isOpen ? 'none' : 'block';
    toggleBtn.textContent = isOpen ? '💬 Chat with us' : '🔼 Close Chat';
  });

  // 5. (eventuale) log per debug
  console.log('🟢 Chat widget initialized:', { toggleBtn, chatbox });
})();
