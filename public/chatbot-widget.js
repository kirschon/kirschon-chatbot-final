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

  // 2️⃣ markup
  wrapper.innerHTML = `
    <!-- toggle bubble -->
    <button id="kc-toggle" style="
      width:60px; height:60px;
      background:#fff; border:none; border-radius:50%;
      font-size:28px; cursor:pointer; padding:0;
    ">💬</button>

    <!-- chat container -->
    <div id="kc-chatbox" style="
      display:none;
      width:320px; background:#fff;
      border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);
      margin-bottom:8px; overflow:hidden;
    ">
      <!-- header -->
      <div style="
        background:#000; color:#fff;
        padding:10px 12px;
        font-size:16px; font-weight:bold;
        display:flex; justify-content:space-between;
      ">
        <span>CHATTA CON UN ASSISTENTE</span>
        <span id="kc-close" style="cursor:pointer;">✕</span>
      </div>

      <!-- messages -->
      <div id="kc-replies" style="
        padding:10px;
        max-height:200px; overflow-y:auto;
        display:flex; flex-direction:column;
        gap:6px;
      "></div>

      <!-- input area -->
      <div style="
        background:#f0f0f0;
        padding:8px 10px;
      ">
        <textarea id="kc-input" placeholder="Scrivi il tuo messaggio qui…" style="
          width:100%; height:60px;
          border:none; border-radius:20px;
          padding:8px 12px; box-sizing:border-box;
          font-family:inherit; font-size:14px;
          resize:none; background:#e8e8e8;
        "></textarea>
      </div>
    </div>
  `;

  // 3️⃣ refs
  const toggle = wrapper.querySelector('#kc-toggle');
  const chat   = wrapper.querySelector('#kc-chatbox');
  const closeB = wrapper.querySelector('#kc-close');
  const replies= wrapper.querySelector('#kc-replies');
  const input  = wrapper.querySelector('#kc-input');

  // 4️⃣ open/close
  function openChat(){
    toggle.style.display='none';
    chat.style.display='flex';
    input.focus();
  }
  function closeChat(){
    chat.style.display='none';
    toggle.style.display='block';
    replies.innerHTML='';  // optionally clear history
  }
  toggle.addEventListener('click',openChat);
  closeB.addEventListener('click',closeChat);

  // 5️⃣ append bubbles
  function appendMsg(author, text){
    const msg = document.createElement('div');
    Object.assign(msg.style,{
      maxWidth:    '75%',
      padding:     '8px 12px',
      borderRadius:'16px',
      fontFamily:  'Times New Roman, serif',
      fontSize:    '14px',
      lineHeight:  '1.4',
      alignSelf:   author==='utopia' ? 'flex-start' : 'flex-end',
      background:  author==='utopia' ? '#444' : '#e0e0e0',
      color:       author==='utopia' ? '#fff' : '#000'
    });
    msg.innerHTML = text;
    replies.appendChild(msg);
    replies.scrollTop = replies.scrollHeight;
  }

  // 6️⃣ send on Enter
  input.addEventListener('keydown', async e => {
    if(e.key==='Enter' && !e.shiftKey){
      e.preventDefault();
      const txt = input.value.trim(); 
      if(!txt) return;
      appendMsg('user', txt);
      input.value='';

      appendMsg('utopia','<em>Typing…</em>');
      try {
        const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ message: txt })
        });
        const { reply } = await res.json();
        // replace typing…
        const last = replies.lastChild;
        last.innerHTML = reply.replace(/\n/g,'<br>');
        last.style.background = '#444';
        last.style.color = '#fff';
      } catch {
        const last = replies.lastChild;
        last.innerHTML = '<strong>Error, try again.</strong>';
        last.style.background = '#f44';
      }
    }
  });

  console.log('🟢 basic chat widget ready');
})();
