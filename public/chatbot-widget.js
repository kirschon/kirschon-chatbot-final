 // public/chatbot-widget.js
(function(){
    // 1) Create wrapper
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      position:   'fixed',
      bottom:     '20px',
      right:      '20px',
      width:      '300px',
      zIndex:     '9999',
      fontFamily: 'sans-serif',
      boxSizing:  'border-box'
    });
    document.body.appendChild(wrapper);
  
    // 2) Insert bubble + chat container
    wrapper.innerHTML = `
      <!-- Bubble -->
      <div id="cw-bubble" style="
        width:40px; height:40px;
        background:#fff;
        border:1px solid #000;
        border-radius:50%;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">💬</div>
  
      <!-- Chat window (hidden by default) -->
      <div id="cw-chat" style="
        display:none;
        margin-top:8px;
        background:#fff;
        border:1px solid #000;
        border-radius:5px;
        overflow:hidden;
      ">
        <div id="cw-messages" style="
          height:200px;
          overflow-y:auto;
          padding:8px;
          font-size:14px;
        "></div>
        <div style="display:flex; border-top:1px solid #ddd;">
          <input id="cw-input" type="text" placeholder="Type your message..."
                 style="flex:1; border:none; padding:8px; font-size:14px;"/>
          <button id="cw-send" style="
            border:none;
            background:#000;
            color:#fff;
            padding:0 12px;
            cursor:pointer;
          ">Send</button>
        </div>
      </div>
    `;
  
    // 3) Wire up interactions
    const bubble = wrapper.querySelector('#cw-bubble');
    const chat   = wrapper.querySelector('#cw-chat');
    const input  = wrapper.querySelector('#cw-input');
    const send   = wrapper.querySelector('#cw-send');
    const msgs   = wrapper.querySelector('#cw-messages');
  
    // Toggle chat on bubble click
    bubble.addEventListener('click', () => {
      chat.style.display = chat.style.display === 'none' ? 'block' : 'none';
    });
  
    // Send message on button click
    send.addEventListener('click', async () => {
      const text = input.value.trim();
      if (!text) return;
      // append user message
      const up = document.createElement('div');
      up.textContent = text;
      up.style.textAlign = 'right';
      up.style.margin = '4px 0';
      msgs.appendChild(up);
      input.value = '';
      // show typing indicator
      const tp = document.createElement('div');
      tp.textContent = 'Typing…';
      tp.style.fontStyle = 'italic';
      tp.style.color = '#666';
      msgs.appendChild(tp);
      msgs.scrollTop = msgs.scrollHeight;
  
      // call your API
      try {
        const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
        const { reply } = await res.json();
        tp.textContent = reply;
      } catch (err) {
        tp.textContent = 'Error. Please try again.';
      }
      msgs.scrollTop = msgs.scrollHeight;
    });
  })();
  