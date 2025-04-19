(function() {
  // Create a wrapper div
  const wrapper = document.createElement('div');
  wrapper.id = 'kirschon-chat-widget';
  wrapper.style.position = 'fixed';
  wrapper.style.bottom   = '20px';
  wrapper.style.right    = '20px';
  wrapper.style.zIndex   = '9999';
  wrapper.style.fontFamily = 'sans-serif';
  document.body.appendChild(wrapper);

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
      display:none;
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

  // Toggle logic
  const toggle = document.getElementById('kirschon-toggle');
  const box    = document.getElementById('kirschon-chatbox');
  toggle.addEventListener('click', () => {
    if (box.style.display === 'none') {
      box.style.display = 'block';
      toggle.textContent = '🔼 Close Chat';
    } else {
      box.style.display = 'none';
      toggle.textContent = '💬 Chat with us';
    }
  });

  // Send logic
  document.getElementById('kirschon-send').onclick = async () => {
    const inputEl = document.getElementById('kirschon-input');
    const replyEl = document.getElementById('kirschon-replies');
    const text = inputEl.value.trim();
    if (!text) return;

    // show typing…
    replyEl.innerHTML = `<p><em>Typing…</em></p>`;

    try {
      const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const { reply } = await res.json();
      replyEl.innerHTML = `<p>${reply.replace(/\n/g,'<br>')}</p>`;
    } catch (err) {
      replyEl.innerHTML = `<p><strong>Error:</strong> Please try again later.</p>`;
      console.error(err);
    }
    inputEl.value = '';
  };
})();
