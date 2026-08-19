/* THE ARCHIVE // V1.2 SIGNAL GAMES */
/* Four games tied to "THE RERUN". Started via startGame() -> startSignalGame(). */

const GAMES_ALT={
  altRouteRelay:{
    id:'altRouteRelay',title:'SIGNAL RELAY',tag:'ROUTING',
    desc:'Tap the next relay on the shortest path before the packet arrives.',
    tips:['The shortest path is already drawn in light.','Decoys sit off the main line.','Every hop makes the next one faster.','A wrong relay costs a life. The packet waits.','The target is always the far corner.']
  },
  altCableTriage:{
    id:'altCableTriage',title:'CABLE TRIAGE',tag:'DIAGNOSTICS',
    desc:'Read the rule. Cut the cable the box wants. Miss and the signal drops.',
    tips:['Match the light color, then the pattern.','The rule table never lies.','Blink means one wire. Solid means another.','A wrong cut costs a life.','Eight boxes. Four cables. One rule each time.']
  },
  altSignalChain:{
    id:'altSignalChain',title:'SIGNAL CHAIN',tag:'MEMORY',
    desc:'The archive repeats its chain. Tap it back in order — no broken links.',
    tips:['Watch the whole chain before you tap.','LEAD opens. HANDOFF closes.','Every round the chain grows by one link.','A broken link replays the same chain.','The chain holds only in order.']
  },
  altAsyncBatch:{
    id:'altAsyncBatch',title:'ASYNC BATCH',tag:'THROUGHPUT',
    desc:'Clear the queue. Type the message before the batch overflows.',
    tips:['Type the word exactly. Enter submits.','The queue refreshes on its own.','A word left sitting costs a life.','Combo builds on clean clears.','Twenty words. Three lives. Keep typing.']
  }
};

/* ---- 1. SIGNAL RELAY ---- */
GAMES_ALT.altRouteRelay.build=function(host,done){
  const N=6;
  function makeWalls(){
    const w=new Set();
    for(let r=0;r<N;r++)for(let c=0;c<N;c++){
      if((r===0&&c===0)||(r===N-1&&c===N-1))continue;
      if(Math.random()<0.2)w.add(r*N+c);
    }
    return w;
  }
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  function bfs(walls){
    const prev=new Map();prev.set('0,0',null);
    const q=['0,0'];let head=0;
    while(head<q.length){
      const [r,c]=q[head++].split(',').map(Number);
      if(r===N-1&&c===N-1)break;
      for(const [dr,dc] of dirs){
        const nr=r+dr,nc=c+dc;
        if(nr<0||nc<0||nr>=N||nc>=N)continue;
        if(walls.has(nr*N+nc))continue;
        const k=nr+','+nc;
        if(prev.has(k))continue;
        prev.set(k,r+','+c);
        q.push(k);
      }
    }
    if(!prev.has((N-1)+','+(N-1)))return null;
    const path=[];let k=(N-1)+','+(N-1);
    while(k!==null){path.unshift(k.split(',').map(Number));k=prev.get(k)}
    return path;
  }
  let walls=makeWalls(),path=bfs(walls),tries=0;
  while(!path&&tries<6){walls=makeWalls();path=bfs(walls);tries++}
  if(!path){walls=new Set();path=bfs(walls)}
  let hop=0,score=0,lives=3,over=false,timer=null,timeLeft=5,opts=[],correct=0;
  const scoreEl=el('div','game-stat','SCORE · 0');
  const hopEl=el('div','game-stat','HOP · 1 / '+(path.length-1));
  const livesEl=el('div','game-stat','LIVES · 3');
  const timeEl=el('div','game-stat','TIME · 5');
  const hud=el('div','game-hud');hud.appendChild(hopEl);hud.appendChild(livesEl);hud.appendChild(timeEl);hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','TAP THE NEXT RELAY ON THE SHORTEST PATH · 1-4 ALSO WORKS · THE PACKET DOES NOT WAIT'));
  host.appendChild(hud);
  const grid=el('div','sr-grid');host.appendChild(grid);
  const rowEl=el('div','sr-row');host.appendChild(rowEl);
  function renderGrid(cr,cc){
    grid.innerHTML='';
    for(let r=0;r<N;r++)for(let c=0;c<N;c++){
      const k=r*N+c;
      const cell=el('div','sr-cell');
      if(walls.has(k))cell.classList.add('wall');
      else if(r===0&&c===0)cell.classList.add('start');
      else if(r===N-1&&c===N-1)cell.classList.add('target');
      grid.appendChild(cell);
    }
    for(let i=0;i<=hop;i++){
      const [r,c]=path[i];
      const cell=grid.children[r*N+c];
      cell.classList.add('path');
      if(i===hop)cell.classList.add('current');
    }
  }
  function renderRound(cr,cc){
    renderGrid(cr,cc);
    rowEl.innerHTML='';
    const [nr,nc]=path[hop+1];
    correct=nr*N+nc;
    const decoys=[];
    for(const [dr,dc] of dirs){
      const rr=cr+dr,cc2=cc+dc;
      if(rr<0||cc2<0||rr>=N||cc2>=N)continue;
      const k=rr*N+cc2;
      if(k===correct||walls.has(k))continue;
      decoys.push(k);
    }
    if(decoys.length<2){
      for(let k=0;k<N*N&&decoys.length<2;k++){
        if(k===correct||walls.has(k)||path.some(p=>p===k))continue;
        decoys.push(k);
      }
    }
    opts=shuffle(shuffle(decoys).slice(0,3).concat([correct]));
    rowEl.appendChild(el('div','game-stat','NEXT RELAY —'));
    opts.forEach(k=>{
      const r=Math.floor(k/N),c=k%N;
      const b=el('button','sr-relay','R'+r+' · C'+c);b.type='button';
      b.onclick=()=>answer(k);
      rowEl.appendChild(b);
    });
    timeLeft=Math.max(2,5-hop*0.5);
    timeEl.textContent='TIME · '+timeLeft;
    clearInterval(timer);
    timer=setInterval(()=>{
      timeLeft--;timeEl.textContent='TIME · '+Math.max(0,timeLeft);
      if(timeLeft<=0&&!over){clearInterval(timer);wrong()}
    },1000);
    gameState.alt={game:'altRouteRelay',phase:'hop',hop,score,lives,path,correct,opts};
  }
  function answer(k){
    if(over)return;
    if(k===correct){clearInterval(timer);hop++;score+=100+hop*50;scoreEl.textContent='SCORE · '+score;hopEl.textContent='HOP · '+(hop+1)+' / '+(path.length-1);sfx(660,.1,'square',.03,1320);if(hop>=path.length-1)finish();else renderRound(path[hop][0],path[hop][1])}
    else wrong();
  }
  function wrong(){
    if(over)return;
    lives--;livesEl.textContent='LIVES · '+Math.max(0,lives);
    sfx(140,.3,'sawtooth',.05,70);
    if(lives<=0){finish();return}
    renderRound(path[hop][0],path[hop][1]);
  }
  function finish(){if(over)return;over=true;clearInterval(timer);gameState.alt={game:'altRouteRelay',phase:'done',score,hop,lives};host.appendChild(el('div','game-msg','PACKET DELIVERED'));setTimeout(()=>{if(gameState.open&&gameState.id==='altRouteRelay')done(score)},700)}
  onKey(e=>{
    if(over)return;
    if(/^[1-4]$/.test(e.key)){e.preventDefault();const i=Number(e.key)-1;if(opts[i]!=null)answer(opts[i])}
  });
  renderRound(0,0);
};

/* ---- 2. CABLE TRIAGE ---- */
GAMES_ALT.altCableTriage.build=function(host,done){
  const RULES=[
    ['RED','SOLID','GREEN'],['RED','BLINK','BLUE'],
    ['GREEN','SOLID','RED'],['GREEN','BLINK','YELLOW'],
    ['YELLOW','SOLID','BLUE'],['YELLOW','BLINK','RED']
  ];
  const CABLES=['RED','GREEN','YELLOW','BLUE'];
  let round=0,score=0,lives=3,over=false,answer='',stateKey='';
  const scoreEl=el('div','game-stat','SCORE · 0');
  const roundEl=el('div','game-stat','BOX · 1 / 6');
  const livesEl=el('div','game-stat','LIVES · 3');
  const hud=el('div','game-hud');hud.appendChild(roundEl);hud.appendChild(livesEl);hud.appendChild(scoreEl);
  const rulesEl=el('div','ct-rules');
  RULES.forEach(r=>{
    const row=el('div','ct-rule','<span class="ct-light '+r[0].toLowerCase()+'">'+r[0]+'</span><span class="ct-pat '+r[1].toLowerCase()+'">'+r[1]+'</span><span class="ct-cut">CUT '+r[2]+'</span>');
    rulesEl.appendChild(row);
  });
  host.appendChild(el('div','game-hint','READ THE RULE TABLE · MATCH THE BOX · CUT THE CABLE'));
  host.appendChild(hud);
  const box=el('div','ct-box');
  const light=el('div','ct-light-big');
  const patEl=el('div','ct-pat-big');
  box.appendChild(light);box.appendChild(patEl);
  host.appendChild(box);
  const rowEl=el('div','ct-cables');
  host.appendChild(rulesEl);
  host.appendChild(rowEl);
  function startRound(){
    if(over)return;
    if(round>=RULES.length){finish();return}
    stateKey=RULES[round];
    answer=stateKey[2];
    light.className='ct-light-big '+stateKey[0].toLowerCase();
    patEl.textContent=stateKey[1];
    patEl.classList.toggle('blink',stateKey[1]==='BLINK');
    rowEl.innerHTML='';
    CABLES.forEach(c=>{
      const b=el('button','ct-cable',c);b.type='button';b.dataset.c=c;
      b.onclick=()=>answerCheck(c);
      rowEl.appendChild(b);
    });
    roundEl.textContent='BOX · '+(round+1)+' / 6';
    gameState.alt={game:'altCableTriage',phase:'round',round,score,lives,answer};
  }
  function answerCheck(c){
    if(over)return;
    if(c===answer){
      score+=100+round*25;scoreEl.textContent='SCORE · '+score;
      sfx(660,.1,'square',.03,1320);
      round++;
      setTimeout(startRound,350);
    }else{
      lives--;livesEl.textContent='LIVES · '+Math.max(0,lives);
      gameState.alt={game:'altCableTriage',phase:'round',round,score,lives,answer};
      sfx(140,.3,'sawtooth',.05,70);
      const wrongB=rowEl.querySelector('[data-c="'+c+'"]');
      if(wrongB){wrongB.classList.add('wrong');setTimeout(()=>wrongB.classList.remove('wrong'),240)}
      if(lives<=0){finish();return}
      setTimeout(startRound,350);
    }
  }
  function finish(){if(over)return;over=true;gameState.alt={game:'altCableTriage',phase:'done',score,round,lives};host.appendChild(el('div','game-msg','SIGNAL STABILIZED'));setTimeout(()=>{if(gameState.open&&gameState.id==='altCableTriage')done(score)},700)}
  startRound();
};

/* ---- 3. SIGNAL CHAIN ---- */
GAMES_ALT.altSignalChain.build=function(host,done){
  const NODES=[{id:'lead',label:'LEAD',icon:'☄'},{id:'email',label:'EMAIL',icon:'✉'},{id:'call',label:'CALL',icon:'✕'},{id:'close',label:'CLOSE',icon:'◉'},{id:'flow',label:'FLOW',icon:'⟳'},{id:'handoff',label:'HANDOFF',icon:'♠'}];
  const ROUNDS=[3,4,5];
  let round=0,score=0,lives=3,over=false,seq=[],idx=0,playing=false;
  const scoreEl=el('div','game-stat','SCORE · 0');
  const roundEl=el('div','game-stat','CHAIN · 1 / 3');
  const livesEl=el('div','game-stat','LIVES · 3');
  const hud=el('div','game-hud');hud.appendChild(roundEl);hud.appendChild(livesEl);hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','WATCH THE CHAIN · TAP IT BACK IN ORDER · THE LINKS LIGHT UP'));
  host.appendChild(hud);
  const ring=el('div','sc-ring');
  const nodes=NODES.map((n,i)=>{
    const b=el('button','sc-node',n.icon);b.type='button';b.dataset.id=n.id;b.title=n.label;
    b.style.setProperty('--sc-i',i);
    b.appendChild(el('div','sc-label',n.label));
    b.onclick=()=>tap(n.id);
    ring.appendChild(b);
    return {def:n,btn:b};
  });
  host.appendChild(ring);
  const msgEl=el('div','game-stat','');host.appendChild(msgEl);
  function playSeq(cb){
    playing=true;
    let i=0;
    const t=setInterval(()=>{
      if(over){clearInterval(t);return}
      if(i<seq.length){
        flash(nodes.find(n=>n.def.id===seq[i]).btn);
        i++;
      }else{
        clearInterval(t);playing=false;msgEl.textContent='YOUR TURN — REPEAT THE CHAIN';
        gameState.alt={game:'altSignalChain',phase:'tap',round,score,lives,seq,idx};
      }
    },620);
  }
  function flash(btn){btn.classList.add('lit');sfx(440,.07,'square',.02,880);setTimeout(()=>btn.classList.remove('lit'),300)}
  function startRound(){
    if(over)return;
    if(round>=ROUNDS.length){finish();return}
    seq=[];idx=0;
    for(let i=0;i<ROUNDS[round];i++)seq.push(pick(NODES).id);
    roundEl.textContent='CHAIN · '+(round+1)+' / 3';
    msgEl.textContent='WATCH — '+ROUNDS[round]+' LINKS';
    setTimeout(()=>playSeq(()=>{}),900);
    gameState.alt={game:'altSignalChain',phase:'watch',round,score,lives,seq};
  }
  function tap(id){
    if(over||playing)return;
    if(id===seq[idx]){
      flash(nodes.find(n=>n.def.id===id).btn);
      score+=50+idx*10;scoreEl.textContent='SCORE · '+score;
      idx++;
      gameState.alt={game:'altSignalChain',phase:'tap',round,score,lives,seq,idx};
      if(idx>=seq.length){
        score+=200;scoreEl.textContent='SCORE · '+score;
        round++;
        setTimeout(startRound,600);
      }
    }else{
      lives--;livesEl.textContent='LIVES · '+Math.max(0,lives);
      score=Math.max(0,score-30);scoreEl.textContent='SCORE · '+score;
      gameState.alt={game:'altSignalChain',phase:'tap',round,score,lives,seq,idx};
      sfx(140,.3,'sawtooth',.05,70);
      if(lives<=0){finish();return}
      msgEl.textContent='BROKEN LINK — WATCH AGAIN';
      idx=0;
      setTimeout(()=>playSeq(()=>{}),700);
    }
  }
  function finish(){if(over)return;over=true;gameState.alt={game:'altSignalChain',phase:'done',score,round,lives};host.appendChild(el('div','game-msg','CHAIN CLOSED'));setTimeout(()=>{if(gameState.open&&gameState.id==='altSignalChain')done(score)},700)}
  startRound();
};

/* ---- 4. ASYNC BATCH ---- */
GAMES_ALT.altAsyncBatch.build=function(host,done){
  const WORDS=['REPLY','FOLLOW UP','STATUS','PIPELINE','ACTIVATION','HANDOFF','BATCH','QUEUE','LEAD','REPORT','ROUTE','SIGNAL','OUTREACH','CHECKPOINT','DELIVERED'];
  let cleared=0,score=0,lives=3,combo=0,over=false,timer=null,word='',queueT=0;
  const wordsEl=el('div','game-stat','WORDS · 0 / 20');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const livesEl=el('div','game-stat','LIVES · 3');
  const comboEl=el('div','game-stat','COMBO · x0');
  const hud=el('div','game-hud');hud.appendChild(wordsEl);hud.appendChild(comboEl);hud.appendChild(livesEl);hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','TYPE THE WORD EXACTLY · ENTER SUBMITS · THE QUEUE DOES NOT PAUSE'));
  host.appendChild(hud);
  const wordEl=el('div','ab-word','');host.appendChild(wordEl);
  const input=el('input','ab-input');input.type='text';input.maxLength=24;input.autocomplete='off';input.spellcheck=false;
  host.appendChild(input);
  const submit=el('button','game-btn','SEND');submit.type='button';submit.onclick=submitWord;
  host.appendChild(submit);
  function nextWord(){
    word=pick(WORDS);
    wordEl.textContent=word;
    queueT=0;
    input.value='';input.focus();
    gameState.alt={game:'altAsyncBatch',phase:'word',word,score,lives,cleared};
  }
  function submitWord(){
    if(over)return;
    const v=input.value.trim().toUpperCase();
    if(v===word){
      cleared++;combo++;
      score+=50+combo*10;scoreEl.textContent='SCORE · '+score;
      comboEl.textContent='COMBO · x'+combo;
      wordsEl.textContent='WORDS · '+cleared+' / 20';
      sfx(660,.08,'square',.03,1320);
      if(cleared>=20){finish();return}
      nextWord();
    }else{
      combo=0;comboEl.textContent='COMBO · x0';
      score=Math.max(0,score-20);scoreEl.textContent='SCORE · '+score;
      lives--;livesEl.textContent='LIVES · '+Math.max(0,lives);
      sfx(140,.3,'sawtooth',.05,70);
      if(lives<=0){finish();return}
      nextWord();
    }
  }
  timer=setInterval(()=>{
    if(over)return;
    queueT++;
    if(queueT>=3){
      combo=0;comboEl.textContent='COMBO · x0';
      lives--;livesEl.textContent='LIVES · '+Math.max(0,lives);
      sfx(110,.3,'sawtooth',.05,60);
      if(lives<=0){finish();return}
      nextWord();
    }
  },2400);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submitWord()}});
  function finish(){if(over)return;over=true;clearInterval(timer);gameState.alt={game:'altAsyncBatch',phase:'done',score,lives,cleared};host.appendChild(el('div','game-msg','QUEUE CLEARED'));setTimeout(()=>{if(gameState.open&&gameState.id==='altAsyncBatch')done(score)},700)}
  nextWord();
};