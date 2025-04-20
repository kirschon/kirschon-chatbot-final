 // public/chatbot-widget.js
(function(){
  // — 0) Inject black placeholder CSS for textarea text (optional)
  const style = document.createElement('style');
  style.textContent = `
    #kc-input::placeholder {
      color: transparent;
    }
  `;
  document.head.appendChild(style);

  // — 1) Create wrapper
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

  // — 2) Inject HTML
  wrapper.innerHTML = `
    <button id="kc-toggle" style="
      width:60px; height:60px;
      background:#fff; border:none; border-radius:50%;
      font-size:28px; cursor:pointer; padding:0;
    ">💬</button>
    <div id="kc-chatbox" style="
      display:none;
      width:300px; background:#fff;
      border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);
      overflow:hidden; margin-bottom:8px;
      display:flex; flex-direction:column;
    ">
      <div style="
        background:#000; color:#fff;
        padding:10px; font-size:16px;
        font-weight:bold; display:flex;
        justify-content:space-between;
      ">
        <span>Utopia</span>
        <span id="kc-close" style="cursor:pointer;">✕</span>
      </div>
      <div id="kc-replies" style="
        flex:1; padding:8px;
        overflow-y:auto; display:flex;
        flex-direction:column; gap:6px;
      "></div>
      <!-- Input container with placeholder bubble behind -->
      <div id="kc-input-container" style="
        position:relative;
        padding:8px;
        background:#f7f7f7;
      ">
        <div id="kc-input-bubble" style="
          position:absolute;
          top:8px; left:8px; right:8px; bottom:8px;
          background:#d3d3d3;
          color:#000;
          border-radius:16px;
          padding:12px;
          font-size:14px;
          pointer-events:none;
          font-family:inherit;
        ">Type a message…</div>
        <textarea id="kc-input" placeholder="Type a message…" style="
          position:relative;
          width:100%; height:40px;
          background:transparent;
          border:none; resize:none;
          padding:12px; padding-top:8px;
          box-sizing:border-box;
          font-family:inherit;
          font-size:14px;
          z-index:1;
        "></textarea>
      </div>
    </div>
  `;

  // — 3) Element refs
  const toggle  = wrapper.querySelector('#kc-toggle');
  const chat    = wrapper.querySelector('#kc-chatbox');
  const closeB  = wrapper.querySelector('#kc-close');
  const replies = wrapper.querySelector('#kc-replies');
  const input   = wrapper.querySelector('#kc-input');
  const placeholderBubble = wrapper.querySelector('#kc-input-bubble');

  // — 4) Open/close
  toggle.addEventListener('click',()=>{
    toggle.style.display='none';
    chat.style.display='flex';
    input.focus();
  });
  closeB.addEventListener('click',()=>{
    chat.style.display='none';
    toggle.style.display='block';
    replies.innerHTML=''; // clear history if desired
  });

  // — 5) Message appending
  function appendMsg(author,text){
    const msg = document.createElement('div');
    Object.assign(msg.style,{
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

  // — 6) Typing flow on Enter
  input.addEventListener('focus', ()=>{
    // once the user focuses, hide the placeholder bubble
    placeholderBubble.style.display = 'none';
  });
  input.addEventListener('keydown', async ev=>{
    if(ev.key==='Enter' && !ev.shiftKey){
      ev.preventDefault();
      const txt = input.value.trim(); if(!txt) return;
      appendMsg('user', txt);
      input.value='';
      appendMsg('utopia','<em>Typing…</em>');
      try {
        const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({ message:txt })
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

  console.log('🟢 Kirschon widget updated: black bubbles & placeholder behind input');
})();
