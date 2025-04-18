(function () {
  const widget = document.createElement('div');
  widget.innerHTML = `
    <div id="chatbox-container" style="position:fixed;bottom:20px;right:20px;width:370px;z-index:9999;font-family:sans-serif;">
      <button id="toggleChat" style="width:100%;padding:8px;border:none;background:#333;color:#fff;border-radius:10px 10px 0 0;cursor:pointer;">💬 Chat with us</button>
      <div id="chatbox" style="display:block;background:white;padding:10px;border-radius:0 0 10px 10px;box-shadow:0 0 10px rgba(0,0,0,0.1);">
        <textarea id="userInput" placeholder="Write here..." style="width:100%;padding:6px;"></textarea>
        <button id="sendBtn" style="margin-top:5px;">Send</button>
        <div id="chatReply" style="margin-top:10px; max-height:300px; overflow-y:auto;"></div>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  const chatbox = document.getElementById('chatbox');
  const toggleBtn = document.getElementById('toggleChat');

  // Minimize / Expand logic
  toggleBtn.onclick = () => {
    if (chatbox.style.display === 'none') {
      chatbox.style.display = 'block';
      toggleBtn.textContent = '💬 Chat with us';
    } else {
      chatbox.style.display = 'none';
      toggleBtn.textContent = '🔼 Open Chat';
    }
  };

  document.getElementById('sendBtn').onclick = async () => {
    const inputElem = document.getElementById('userInput');
    const container = document.getElementById('chatReply');
    const input = inputElem.value.trim();
    const lang = navigator.language.slice(0, 2);

    if (!input) return;

    // Show user message and typing animation
    container.innerHTML = `<p><strong>You:</strong> ${input}</p><p><em>Typing...</em></p>`;
    inputElem.value = '';

    try {
      const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, language: lang }),
      });
      const data = await res.json();
      renderReply(data.reply);
    } catch (err) {
      container.innerHTML = `<p><strong>Error:</strong> Please try again later.</p>`;
      console.error("Chatbot error:", err);
    }
  };

  function renderReply(text) {
    const container = document.getElementById('chatReply');
    container.innerHTML = '';
    const lines = text.split('\n');
    lines.forEach(line => {
      const match = line.match(/- (.+?): (.+?) \((https?:\/\/[^\s]+)\)(?: \[img:(https?:\/\/[^\s]+)\])?/);
      if (match) {
        const [_, title, desc, url, img] = match;
        const product = document.createElement('div');
        product.style.marginBottom = '15px';
        product.innerHTML = `
          ${img ? `<img src="${img}" alt="${title}" style="width:100%;max-height:150px;object-fit:cover;border-radius:8px;margin-bottom:6px;" />` : ''}
          <strong>${title}</strong><br/>
          <span>${desc}</span><br/>
          <a href="${url}" target="_blank" style="color:#007bff;text-decoration:none;">View Product</a>
        `;
        container.appendChild(product);
      } else {
        const p = document.createElement('p');
        p.textContent = line;
        container.appendChild(p);
      }
    });
  }
})();
