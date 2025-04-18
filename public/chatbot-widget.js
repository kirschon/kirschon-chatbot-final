(function () {
  const widget = document.createElement('div');
  widget.innerHTML = `
    <div id="chatbox" style="position:fixed;bottom:20px;right:20px;width:370px;background:white;padding:10px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1); font-family:sans-serif;">
      <textarea id="userInput" placeholder="Write here..." style="width:100%;padding:6px;"></textarea>
      <button id="sendBtn" style="margin-top:5px;">Send</button>
      <div id="chatReply" style="margin-top:10px; max-height:300px; overflow-y:auto;"></div>
    </div>`;
  document.body.appendChild(widget);

  document.getElementById('sendBtn').onclick = async () => {
    const input = document.getElementById('userInput').value;
    const lang = navigator.language.slice(0, 2);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, language: lang }),
    });
    renderReply(res.reply);
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
        product.innerHTML = \`
          \${img ? `<img src="\${img}" alt="\${title}" style="width:100%;max-height:150px;object-fit:cover;border-radius:8px;margin-bottom:6px;" />` : ''}
          <strong>\${title}</strong><br/>
          <span>\${desc}</span><br/>
          <a href="\${url}" target="_blank" style="color:#007bff;text-decoration:none;">View Product</a>
        \`;
        container.appendChild(product);
      } else {
        const p = document.createElement('p');
        p.textContent = line;
        container.appendChild(p);
      }
    });
  }
})();