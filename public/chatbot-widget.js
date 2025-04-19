  // public/chatbot-widget.js
(function(){
    // 1️⃣ Create wrapper
    const wrapper = document.createElement('div');
    wrapper.id = 'kirschon-chat-widget';
    Object.assign(wrapper.style, {
      position:      'fixed',
      bottom:        '20px',
      right:         '20px',
      zIndex:        '9999',
      display:       'flex',
      flexDirection: 'column-reverse',    // bubble at bottom, chat above
      alignItems:    'flex-end',
      fontFamily:    'Times New Roman, serif'
    });
    document.body.appendChild(wrapper);
  
    // 2️⃣ Inject bubble + chat UI
    wrapper.innerHTML = `
      <!-- 2.1 Bubble -->
      <button id="kirschon-toggle" style="
        width: 60px;
        height: 60px;
        background: #fff;
        border: none;
        border-radius: 50%;
        font-size: 28px;
        line-height: 0;
        cursor: pointer;
        padding: 0;
      ">💬</button>
  
      <!-- 2.2 Chatbox (hidden by default) -->
      <div id="kirschon-chatbox" style="
        display: none;
        width: 300px;
        background: #fff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
        margin-bottom: 8px;
      ">
        <select id="kirschon-lang-select" style="
          width: 100%;
          margin-bottom: 8px;
          padding: 4px;
          font-size: 14px;
          font-family: inherit;
          box-sizing: border-box;
        ">
          <option value="it">🇮🇹 Italiano</option>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="es">🇪🇸 Español</option>
        </select>
        <textarea id="kirschon-input" placeholder="" style="
          width: 100%;
          height: 100px;
          padding: 6px;
          font-family: inherit;
          font-size: 14px;
          box-sizing: border-box;
          resize: vertical;
        "></textarea>
        <div id="kirschon-replies" style="
          margin-top: 10px;
          max-height: 150px;
          overflow-y: auto;
          font-family: inherit;
          font-size: 14px;
        "></div>
      </div>
    `;
  
    // 3️⃣ Grab references
    const toggleBtn  = wrapper.querySelector('#kirschon-toggle');
    const chatbox    = wrapper.querySelector('#kirschon-chatbox');
    const langSelect = wrapper.querySelector('#kirschon-lang-select');
    const inputEl    = wrapper.querySelector('#kirschon-input');
    const replyEl    = wrapper.querySelector('#kirschon-replies');
  
    // 4️⃣ Language placeholder map
    const placeholders = {
      it: "Scrivi qui...",
      en: "Write here...",
      fr: "Écrivez ici...",
      de: "Schreiben Sie qui...",
      es: "Escribe aquí..."
    };
  
    // 5️⃣ Update placeholder on language change
    langSelect.addEventListener('change', e => {
      inputEl.placeholder = placeholders[e.target.value] || placeholders.en;
    });
    // set initial placeholder
    inputEl.placeholder = placeholders[langSelect.value] || placeholders.en;
  
    // 6️⃣ Toggle chat visibility
    toggleBtn.addEventListener('click', () => {
      const isOpen = chatbox.style.display === 'block';
      chatbox.style.display = isOpen ? 'none' : 'block';
    });
  
    // 7️⃣ Send on Enter
    inputEl.addEventListener('keydown', async e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = inputEl.value.trim();
        if (!text) return;
  
        // show typing
        replyEl.innerHTML = `<p><em>Typing…</em></p>`;
        inputEl.value = '';
  
        try {
          const res = await fetch('https://kirschon-chatbot-final.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, language: langSelect.value })
          });
          const data = await res.json();
          replyEl.innerHTML = `<p>${data.reply.replace(/\n/g,'<br>')}</p>`;
        } catch (err) {
          replyEl.innerHTML = `<p><strong>Error:</strong> Please try again later.</p>`;
          console.error(err);
        }
      }
    });
  
    console.log('🟢 Kirschon widget updated');
  })();
  