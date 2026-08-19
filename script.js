document.getElementById('year').textContent = new Date().getFullYear();

  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  let w, h, nodes;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function initNodes(){
    const count = Math.max(18, Math.floor((w*h)/45000));
    nodes = Array.from({length:count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25,
    }));
  }

  function tick(){
    ctx.clearRect(0,0,w,h);
    for(const n of nodes){
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > w) n.vx *= -1;
      if(n.y < 0 || n.y > h) n.vy *= -1;
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 160){
          ctx.strokeStyle = `rgba(201,162,39,${0.14 * (1 - dist/160)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      ctx.fillStyle = 'rgba(237,233,224,0.5)';
      ctx.beginPath();
      ctx.arc(n.x,n.y,1.6,0,Math.PI*2);
      ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); initNodes(); });
  resize();
  initNodes();
  if(!reduceMotion){
    requestAnimationFrame(tick);
  } else {
    tick();
  }

  /* ---------- Chatbox: rule-based Q&A about Anshul ---------- */
  const chatKB = [
    {
      keywords: ['hi','hello','hey','yo','sup'],
      reply: "Hey there! I'm Anshul's little assistant. Ask me about his skills, projects, experience, education, or how to contact him."
    },
    {
      keywords: ['skill','language','tech','stack','know'],
      reply: "Anshul works with C, C++, Java, Python, HTML, and CSS — with a growing focus on AI &amp; ML."
    },
    {
      keywords: ['project','portfolio','chatbot','build','made','work'],
      reply: "He's built four projects so far — this <b>Personal Portfolio Website</b>, a <b>Basic Chatbot</b>, a text-based <b>Hangman Game</b>, and a <b>Stock Portfolio Tracker</b>, all in Python. Check the Project section above for details."
    },
    {
      keywords: ['hangman'],
      reply: "The Hangman Game is a text-based console game where the player guesses a word one letter at a time, from a list of 5 predefined words, with up to 6 incorrect guesses allowed. Built using random word selection, loops, and conditionals."
    },
    {
      keywords: ['stock','portfolio tracker','tracker','investment'],
      reply: "The Stock Portfolio Tracker is a command-line Python tool that takes stock names and quantities as input, calculates total investment value using predefined prices, and exports a summary to a .txt or .csv file — built using dictionaries and file handling."
    },
    {
      keywords: ['experience','intern','codealpha','job','worked'],
      reply: "Anshul completed a 1-month Python Programming internship at <b>CodeAlpha</b>, where he built real-world Python projects and sharpened his problem-solving skills."
    },
    {
      keywords: ['education','study','college','degree','course','university'],
      reply: "He's currently pursuing a B.Tech in Computer Science Engineering, specializing in AI &amp; ML."
    },
    {
      keywords: ['vihaan','venture','startup','freelance','business'],
      reply: "Alongside his studies, Anshul is building <b>Vihaan</b> — a freelance web development studio helping individuals and small brands get fast, affordable websites. Find it on Instagram as @getvihaan."
    },
    {
      keywords: ['resume','cv'],
      reply: "You can grab his resume using the 'Download Resume' button at the top of the page."
    },
    {
      keywords: ['contact','email','reach','linkedin','github','connect','social'],
      reply: "Best ways to reach him: email at work.anshul.in@gmail.com, or via GitHub/LinkedIn — all in the Contact section above."
    },
    {
      keywords: ['name','who'],
      reply: "This is Anshul Kumar's portfolio — a B.Tech CSE (AI &amp; ML) student."
    },
    {
      keywords: ['thank','thanks','bye'],
      reply: "You're welcome! Feel free to reach out to Anshul directly if you'd like to connect further."
    },
  ];

  function getBotReply(message){
    const msg = message.toLowerCase();
    for(const entry of chatKB){
      if(entry.keywords.some(k => msg.includes(k))){
        return entry.reply;
      }
    }
    return "I'm not sure about that one — but you can ask about Anshul's skills, projects, experience, education, or contact info. For anything else, reach him directly through the Contact section.";
  }

  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  function appendMessage(text, sender){
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.innerHTML = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleSend(text){
    const value = (text !== undefined ? text : chatInput.value).trim();
    if(!value) return;
    appendMessage(value.replace(/</g,'&lt;'), 'user');
    chatInput.value = '';
    setTimeout(() => {
      appendMessage(getBotReply(value), 'bot');
    }, 350);
  }

  if(chatSend && chatInput){
    chatSend.addEventListener('click', () => handleSend());
    chatInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') handleSend();
    });
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => handleSend(chip.dataset.q));
    });
  }