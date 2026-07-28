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