/* THE ARCHIVE // V1.1 MINI DRILLS */
/* Five short browser games tied to the Guide's story topics. */

const gameState = {open:false,id:null,results:false,tipsTimer:null,keys:[],keysUp:[],raf:null,generation:0};

const GAMES = {
  leadSort: {
    id:'leadSort', title:'LEAD INVADERS', tag:'LEAD SOURCING',
    desc:'Classic invaders. Shoot the fit leads, dodge the return fire, skip the noise.',
    tips:['Shoot the fit leads. Skip the noise.','Audience fit comes first.','A list alone is not a pipeline.','Keep your combo alive.','Dodge the return fire.']
  },
  emailBuild: {
    id:'emailBuild', title:'EMAIL BUILD', tag:'OUTREACH',
    desc:'Assemble the outreach email in the right order.',
    tips:['Open with the subject. Then the greeting.','Personalize the hook before the ask.','A relevant message is shorter and clearer.','End with a clear next step.','Fit before volume. Always.']
  },
  partnerCall: {
    id:'partnerCall', title:'PARTNER CALL', tag:'CONTACT',
    desc:'Tic-tac-toe against the partner. Make a line before they do.',
    tips:['Start in a corner.','Block before you build.','Two threats beat one.','A draw is still a conversation.','Patience wins the round.']
  },
  closeDeal: {
    id:'closeDeal', title:'CLOSE THE DEAL', tag:'CLOSING',
    desc:'Fire when the marker is inside the zone. Closer to center scores more.',
    tips:['The zone shrinks. Stay patient.','Close the deal, not the relationship.','A good deal needs momentum.','Perfect timing beats force.','Know when to hold and when to strike.']
  },
  autoFlow: {
    id:'autoFlow', title:'AUTO FLOW', tag:'AUTOMATION',
    desc:'Watch the workflow sequence, then repeat it.',
    tips:['Automation removes the busywork.','Trigger. Filter. Act. Log.','Consistency beats improvisation.','Let the system carry the memory.','Build it once, run it forever.']
  },
  onboardPack: {
    id:'onboardPack', title:'BLACKJACK', tag:'ONBOARDING',
    desc:'You are the dealer. Read the table, hit or stand, take the house edge.',
    tips:['Aces count as eleven or one.','Seventeen is the classic stand.','The player hits until seventeen.','Bust the player when you can.','The dealer plays last, not first.']
  }
};

function g$(id){return document.getElementById(id)}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function sfx(freq,dur,type,vol,slideTo){
  if(typeof state!=='undefined'&&state&&state.sound===false)return;
  try{ensureAudio()}catch(e){}
  if(typeof audioCtx==='undefined'||!audioCtx)return;
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type||'square';
  const t=audioCtx.currentTime;
  o.frequency.setValueAtTime(freq,t);
  if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
  g.gain.setValueAtTime(vol||.02,t);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(t);o.stop(t+dur+.02);
}

function isGameBlocking(){return gameState.open}
function getBoard(id){if(!state.leaderboard)state.leaderboard={};if(!state.leaderboard[id])state.leaderboard[id]=[];return state.leaderboard[id]}

function onKey(fn){window.addEventListener('keydown',fn);gameState.keys.push(fn)}
function onKeyUp(fn){window.addEventListener('keyup',fn);gameState.keysUp.push(fn)}
function clearKeys(){gameState.keys.forEach(fn=>window.removeEventListener('keydown',fn));gameState.keys=[];gameState.keysUp.forEach(fn=>window.removeEventListener('keyup',fn));gameState.keysUp=[]}

function startGame(id){
  if(gameState.open)return;
  const g=GAMES[id];if(!g)return;
  if(typeof closeModal==='function')closeModal();
  gameState.open=true;gameState.id=id;gameState.results=false;
  const panel=g$('gamePanel');
  panel.innerHTML='';
  const head=el('div','game-head');
  const title=el('div','game-title',g.tag+' · '+g.title);
  const skip=el('button','game-btn skip','SKIP');
  skip.type='button';skip.onclick=skipGame;
  head.appendChild(title);head.appendChild(skip);
  const tips=el('div','game-tips','GUIDE · '+g.tips[0]);
  const body=el('div','game-body');
  panel.appendChild(head);panel.appendChild(tips);panel.appendChild(body);
  let i=0;
  gameState.tipsTimer=setInterval(()=>{i=(i+1)%g.tips.length;tips.textContent='GUIDE · '+g.tips[i]},4200);
  const done=(score)=>{stopTips();showResults(score)};
  g.build(body,done);
  const card=g$('dialogueCard');
  card.classList.add('game-mode');
  const nav=g$('iconNav');if(nav)nav.classList.add('nav-side');
  requestAnimationFrame(()=>requestAnimationFrame(()=>panel.classList.add('open')));
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function stopTips(){clearInterval(gameState.tipsTimer);gameState.tipsTimer=null}
function stopLoop(){clearKeys();if(gameState.raf){cancelAnimationFrame(gameState.raf);gameState.raf=null}}

function showResults(score){
  stopTips();stopLoop();
  gameState.results=true;
  const g=GAMES[gameState.id];
  const body=g$('gamePanel').querySelector('.game-body');
  body.innerHTML='';
  if(score==null){
    body.appendChild(el('div','game-score','SKIPPED'));
    body.appendChild(el('div','game-msg','No score recorded.'));
    const done=el('button','game-btn','DONE');done.type='button';done.onclick=closeGamePanel;
    body.appendChild(done);
    return;
  }
  body.appendChild(el('div','game-score','SCORE · '+score));
  const wrap=el('div','game-save');
  const input=el('input','game-name');
  input.type='text';input.maxLength=14;input.placeholder='ENTER YOUR NAME';
  input.value=state.playerName||'';
  const saveBtn=el('button','game-btn','SAVE SCORE');saveBtn.type='button';
  const lbBtn=el('button','game-btn hidden','VIEW LEADERBOARD');lbBtn.type='button';
  const msg=el('div','game-msg','');
  const doneBtn=el('button','game-btn','DONE');doneBtn.type='button';doneBtn.onclick=closeGamePanel;
  function saveScore(){
    const name=(input.value.trim()||'PLAYER').slice(0,14);
    state.playerName=name;
    const b=getBoard(gameState.id);
    b.push({name,score,ts:Date.now()});
    b.sort((x,y)=>y.score-x.score);
    state.leaderboard[gameState.id]=b.slice(0,10);
    save();
    msg.textContent='SCORE SAVED TO LEADERBOARD';
    unlockAchievement('saveScore');
    saveBtn.disabled=true;input.disabled=true;
    lbBtn.classList.remove('hidden');
  }
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveScore()}});
  saveBtn.onclick=saveScore;
  lbBtn.onclick=()=>openLeaderboard(gameState.id);
  wrap.appendChild(input);wrap.appendChild(saveBtn);
  body.appendChild(wrap);body.appendChild(lbBtn);body.appendChild(msg);body.appendChild(doneBtn);
  input.focus();
}
function skipGame(){if(!gameState.open)return;stopTips();stopLoop();showResults(null)}
function closeGamePanel(){stopTips();stopLoop();const id=gameState.id;const panel=g$('gamePanel');const card=g$('dialogueCard');panel.classList.remove('open');card.classList.remove('game-mode');const nav=g$('iconNav');if(nav)nav.classList.remove('nav-side');gameState.generation++;const gen=gameState.generation;setTimeout(()=>{if(gen===gameState.generation)panel.innerHTML=''},500);gameState.open=false;gameState.id=null;gameState.results=false;if(id&&typeof markGamePlayed==='function')markGamePlayed(id)}

function openLeaderboard(id){
  const g=GAMES[id];if(!g)return;
  const b=getBoard(id);
  const rows=b.length?`<div class="lb">${b.map((e,i)=>`<div class="lb-row"><span class="lb-rank">${String(i+1).padStart(2,'0')}</span><span class="lb-name">${esc(e.name)}</span><span class="lb-score">${e.score}</span></div>`).join('')}</div>`:'<p class="story-small">No scores yet. Play the drill to set one.</p>';
  openModal('LEADERBOARD',g.title+' · TOP SCORES',rows);
}
function openGamesRoom(){
  const html=`<div class="games-room">${Object.values(GAMES).map(g=>{
    const best=getBoard(g.id)[0];
    return `<article class="game-row"><div class="game-row-main"><div class="game-row-kicker">${g.tag}</div><div class="game-row-title">${g.title}</div><div class="game-row-desc">${g.desc}</div><div class="game-row-best">BEST · ${best?esc(best.name)+' — '+best.score:'NOT PLAYED'}</div></div><div class="game-row-actions"><button class="game-btn" type="button" onclick="startGame('${g.id}')">PLAY</button><button class="game-btn" type="button" onclick="openLeaderboard('${g.id}')">SCORES</button></div></article>`}).join('')}</div>`;
  openModal('GAMES','V1.1 · MINI DRILLS',html);
}

/* ---- 1. LEAD INVADERS ---- */
GAMES.leadSort.build=function(host,done){
  const W=620,H=300,WID=24,HT=21,cols=6,rows=4;
  const c=el('canvas','li-canvas');c.width=W;c.height=H;
  const ctx=c.getContext('2d');
  let score=0,combo=0,keep=0,lives=3,dead=false,last=performance.now(),timeLeft=60,invuln=0,enemyTimer=900;
  const scoreEl=el('div','game-stat','SCORE · 0');
  const keepEl=el('div','game-stat','CAPTURED · 0');
  const comboEl=el('div','game-stat','COMBO · x0');
  const livesEl=el('div','game-stat','LIVES · '+lives);
  const timeEl=el('div','game-stat','TIME · 60');
  const hud=el('div','game-hud');hud.appendChild(keepEl);hud.appendChild(comboEl);hud.appendChild(livesEl);hud.appendChild(scoreEl);hud.appendChild(timeEl);
  host.appendChild(el('div','game-hint','←/→ OR A/D MOVE · SPACE FIRE · DODGE THE RETURN FIRE · SHOOT THE FIT LEADS'));
  host.appendChild(hud);host.appendChild(c);
  const pad=el('div','game-pad');
  function padBtn(key,label){
    const b=el('button','game-pad-btn',label);b.type='button';
    const down=()=>window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));
    const up=()=>window.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true}));
    b.addEventListener('pointerdown',e=>{e.preventDefault();down()});
    b.addEventListener('pointerup',up);
    b.addEventListener('pointerleave',up);
    b.addEventListener('pointercancel',up);
    pad.appendChild(b);
    return b;
  }
  padBtn('ArrowLeft','◀ LEFT');
  padBtn('ArrowRight','RIGHT ▶');
  padBtn(' ','FIRE');
  host.appendChild(pad);
  const people=[];
  let fitLeft=0;
  for(let r=0;r<rows;r++)for(let i=0;i<cols;i++){
    const fit=(r+i)%2===0;
    if(fit)fitLeft++;
    people.push({x:82+i*84,y:34+r*50,w:WID,h:HT,fit,alive:true,seed:Math.random()*6.28});
  }
  const player={x:W/2-20,w:40};
  let bullets=[],shots=[],fired=false;
  const keyState={left:false,right:false};
  const timer=setInterval(()=>{timeLeft--;timeEl.textContent='TIME · '+Math.max(0,timeLeft);if(timeLeft<=0){if(!dead){sfx(200,.5,'sawtooth',.04,80);finish()}}},1000);
  function finish(){if(dead)return;dead=true;clearInterval(timer);done(score)}
  function frame(now){
    const dt=Math.min(50,now-last);last=now;
    if(!dead){
      if(keyState.left)player.x=Math.max(0,player.x-4.4*(dt/16.6));
      if(keyState.right)player.x=Math.min(W-player.w,player.x+4.4*(dt/16.6));
      bullets.forEach(b=>b.y-=6.2*(dt/16.6));
      bullets=bullets.filter(b=>b.y>-14);
      const alive=people.filter(v=>v.alive);
      enemyTimer-=dt;
      if(alive.length&&enemyTimer<=0){
        const shooter=pick(alive);
        shots.push({x:shooter.x+WID/2-1.5,y:shooter.y+HT});
        enemyTimer=Math.max(420,1200-alive.length*34);
        sfx(300,.06,'triangle',.015,180);
      }
      shots.forEach(b=>b.y+=3.6*(dt/16.6));
      shots=shots.filter(b=>b.y<H-4);
      for(const s of shots){
        if(s.y>H-20&&s.y<H-4&&s.x>player.x&&s.x<player.x+player.w){
          s.y=H;
          if(invuln<=0&&lives>0){
            lives--;combo=0;invuln=1300;
            livesEl.textContent='LIVES · '+lives;
            comboEl.textContent='COMBO · x0';
            sfx(140,.3,'sawtooth',.05,70);
            if(lives<=0){sfx(120,.5,'sawtooth',.06,55);finish();return}
          }
          break;
        }
      }
      invuln-=dt;
      for(const b of bullets){
        const hit=people.find(v=>v.alive&&b.x<v.x+WID&&b.x+4>v.x&&b.y<v.y+HT&&b.y+10>v.y);
        if(hit){
          hit.alive=false;b.y=-99;
          if(hit.fit){
            combo++;score+=100+50*combo;keep++;fitLeft--;
            keepEl.textContent='CAPTURED · '+keep;
            scoreEl.textContent='SCORE · '+score;
            comboEl.textContent='COMBO · x'+combo;
            sfx(660,.1,'square',.03,1320);
            if(fitLeft<=0){sfx(660,.5,'square',.04,1320);finish();return}
          }else{
            combo=0;score=Math.max(0,score-40);
            scoreEl.textContent='SCORE · '+score;
            comboEl.textContent='COMBO · x0';
            sfx(180,.2,'sawtooth',.04,90);
          }
          break;
        }
      }
      bullets=bullets.filter(b=>b.y>-14);
    }
    draw(now);
    if(!dead)gameState.raf=requestAnimationFrame(frame);
  }
  function drawPerson(v,off){
    const x=v.x,y=v.y+off;
    ctx.fillStyle=v.fit?'#fff':'rgba(255,255,255,.16)';
    ctx.fillRect(x+8,y,8,9);
    ctx.fillRect(x+5,y+9,14,7);
    ctx.fillRect(x+1,y+16,WID-2,5);
    if(v.fit){
      ctx.fillStyle='#000';
      ctx.fillRect(x+9,y+3,2,2);
      ctx.fillRect(x+13,y+3,2,2);
    }else{
      ctx.fillStyle='#444';
      ctx.fillRect(x+9,y+3,6,2);
    }
  }
  function draw(now){
    ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
    ctx.fillRect(0,H-2,W,2);
    people.forEach(v=>{if(v.alive)drawPerson(v,Math.sin(now/260+v.seed)*1.6)});
    if(invuln<=0||Math.floor(now/90)%2===0){
      ctx.fillStyle='#fff';
      ctx.fillRect(player.x+16,H-26,8,8);
      ctx.fillRect(player.x,H-18,player.w,6);
      ctx.fillRect(player.x+6,H-12,player.w-12,4);
    }
    bullets.forEach(b=>{ctx.fillStyle='#fff';ctx.fillRect(b.x,b.y,4,10)});
    shots.forEach(b=>{ctx.fillStyle='#fff';ctx.fillRect(b.x-1,b.y,3,9);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(b.x+1,b.y-2,1,3)});
  }
  onKey(e=>{
    const k=e.key;
    if(k==='ArrowLeft'||k.toLowerCase()==='a'){e.preventDefault();keyState.left=true}
    else if(k==='ArrowRight'||k.toLowerCase()==='d'){e.preventDefault();keyState.right=true}
    else if(k===' '||k==='ArrowUp'||k.toLowerCase()==='w'){e.preventDefault();if(!fired&&!dead){fired=true;bullets.push({x:player.x+player.w/2-2,y:H-34});sfx(900,.08,'square',.02,400);setTimeout(()=>fired=false,200)}}
  });
  onKeyUp(e=>{
    const k=e.key;
    if(k==='ArrowLeft'||k.toLowerCase()==='a')keyState.left=false;
    else if(k==='ArrowRight'||k.toLowerCase()==='d')keyState.right=false;
  });
  gameState.raf=requestAnimationFrame(frame);
};

/* ---- 2. EMAIL BUILD ---- */
const EMAILS=[
  {profile:'TECH CREATOR · 45K · US',parts:[
    'SUBJECT: A partnership that fits your audience',
    'Hi Maya, your setup guides are genuinely useful.',
    'Our travel eSIM would suit your audience well.',
    'Could we take a short call this week?',
    'Best, Raiyan']},
  {profile:'GAMING PUBLISHER · 80K · CA',parts:[
    'SUBJECT: Creator collab for your RPG fans',
    'Hey Sam, I saw your RPG playthrough series.',
    'Our partner program pays well for creators like you.',
    'Want the details? I can send a one-pager.',
    'Cheers, Raiyan']},
  {profile:'FITNESS INFLUENCER · 30K · DE',parts:[
    'SUBJECT: A simple offer for your followers',
    'Hi Lena, your workout tips are solid.',
    'Our app is a natural fit for your audience.',
    'Open to a quick call to explore it?',
    'Thanks, Raiyan']}
];
GAMES.emailBuild.build=function(host,done){
  let ei=0,score=0,combo=0,roundStart=0;
  const profileEl=el('div','eb-profile','');
  const slotEl=el('div','eb-slots');
  const chipsEl=el('div','eb-chips');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const hud=el('div','game-hud');hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','Click the email parts in the right order.'));
  host.appendChild(hud);host.appendChild(profileEl);host.appendChild(slotEl);host.appendChild(chipsEl);
  function startRound(){
    if(ei>=EMAILS.length){done(score);return}
    roundStart=performance.now();
    const e=EMAILS[ei];
    profileEl.textContent='PROSPECT · '+e.profile;
    slotEl.innerHTML='';chipsEl.innerHTML='';
    const slots=e.parts.map((p,idx)=>{const s=el('div','eb-slot');slotEl.appendChild(s);return s});
    let next=0;
    shuffle(e.parts).forEach(p=>{
      const c=el('button','eb-chip',p);c.type='button';
      c.onclick=()=>{
        const idx=e.parts.indexOf(c.textContent);
        if(idx===next){
          slots[idx].textContent=c.textContent;slots[idx].classList.add('filled');
          c.classList.add('used');c.disabled=true;
          combo++;score+=100+25*combo;
          scoreEl.textContent='SCORE · '+score;
          next++;
          if(next===e.parts.length){
            const bonus=Math.max(0,Math.round(2500-(performance.now()-roundStart)));
            score+=bonus;scoreEl.textContent='SCORE · '+score;
            combo=0;ei++;setTimeout(startRound,500);
          }
        }else{
          combo=0;score=Math.max(0,score-30);scoreEl.textContent='SCORE · '+score;
          c.classList.add('wrong');setTimeout(()=>c.classList.remove('wrong'),240);
        }
      };
      chipsEl.appendChild(c);
    });
  }
  startRound();
};

/* ---- 3. PARTNER CALL ---- */
GAMES.partnerCall.build=function(host,done){
  const cells=[];const grid=['','','','','','','','',''];
  const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let round=1,score=0,record=[0,0,0],myTurn=true,busy=false,over=false;
  const roundEl=el('div','game-stat','ROUND · 1 / 3');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const recEl=el('div','game-stat','W · 0 / D · 0 / L · 0');
  const hud=el('div','game-hud');hud.appendChild(roundEl);hud.appendChild(scoreEl);hud.appendChild(recEl);
  const msg=el('div','game-stat','YOU ARE ✕ · PARTNER IS ✓');
  const board=el('div','ttt-board');
  const actions=el('div','game-actions');
  host.appendChild(el('div','game-hint','TAP AN EMPTY SQUARE OR PRESS 1-9 · MAKE A LINE BEFORE THE PARTNER DOES'));
  host.appendChild(hud);host.appendChild(msg);host.appendChild(board);host.appendChild(actions);
  for(let i=0;i<9;i++){
    const c=el('button','ttt-cell','');c.type='button';c.dataset.i=i;
    c.onclick=()=>play(i);
    cells.push(c);board.appendChild(c);
  }
  function mark(i,sym){grid[i]=sym;cells[i].textContent=sym;cells[i].classList.add(sym==='✕'?'x':'o');cells[i].disabled=true;sfx(sym==='✕'?760:520,.08,'square',.02)}
  function winner(){for(const l of lines){const [a,b,c]=l;if(grid[a]&&grid[a]===grid[b]&&grid[b]===grid[c])return {sym:grid[a],l}}return null}
  function empty(){const r=[];for(let i=0;i<9;i++)if(!grid[i])r.push(i);return r}
  function updateHud(){roundEl.textContent='ROUND · '+round+' / 3';scoreEl.textContent='SCORE · '+score;recEl.textContent='W · '+record[0]+' / D · '+record[1]+' / L · '+record[2]}
  function canWin(p){for(const l of lines){const [a,b,c]=l;if(grid[a]===p&&grid[a]===grid[b]&&!grid[c])return c;if(grid[a]===p&&grid[a]===grid[c]&&!grid[b])return b;if(grid[b]===p&&grid[b]===grid[c]&&!grid[a])return a}return -1}
  function aiMove(){
    const e=empty();
    if(!e.length)return;
    let m=-1;
    if(Math.random()<.22)m=e[Math.floor(Math.random()*e.length)];
    if(m<0)m=canWin('✓');
    if(m<0)m=canWin('✕');
    if(m<0&&!grid[4])m=4;
    if(m<0){const cor=[0,2,6,8].filter(i=>!grid[i]);if(cor.length)m=cor[Math.floor(Math.random()*cor.length)]}
    if(m<0)m=e[Math.floor(Math.random()*e.length)];
    mark(m,'✓');
    myTurn=true;busy=false;
    const w=winner();
    if(w)endRound(w);
    else if(!empty().length)endRound(null);
  }
  function play(i){
    if(over||busy||!myTurn||grid[i])return;
    mark(i,'✕');
    myTurn=false;
    const w=winner();
    if(w){endRound(w);return}
    if(!empty().length){endRound(null);return}
    busy=true;
    setTimeout(()=>{if(gameState.open&&gameState.id==='partnerCall')aiMove()},420);
  }
  function endRound(w){
    over=true;busy=false;myTurn=false;
    if(!w){record[1]++;score+=100;sfx(660,.2,'square',.03,660)}
    else if(w.sym==='✕'){record[0]++;score+=200;sfx(880,.25,'square',.03,1320)}
    else{record[2]++;score=Math.max(0,score-30);sfx(140,.3,'sawtooth',.05,70)}
    updateHud();
    msg.textContent=!w?'ROUND DRAWN':(w.sym==='✕'?'ROUND WON':'ROUND LOST');
    const nxt=el('button','game-btn',round>=3?'FINISH':'NEXT ROUND');nxt.type='button';
    nxt.onclick=()=>{
      if(round>=3){done(score);return}
      round++;over=false;myTurn=true;busy=false;
      for(let i=0;i<9;i++){grid[i]='';cells[i].textContent='';cells[i].disabled=false;cells[i].classList.remove('x','o')}
      msg.textContent='YOU ARE ✕ · PARTNER IS ✓';
      updateHud();
      nxt.remove();
    };
    actions.appendChild(nxt);
  }
  onKey(e=>{
    if(/^[1-9]$/.test(e.key)){e.preventDefault();play(Number(e.key)-1)}
  });
  updateHud();
};

/* ---- 4. CLOSE THE DEAL ---- */
GAMES.closeDeal.build=function(host,done){
  const W=420,C=210;
  let deals=0,score=0,zone=70,speed=4.2,pos=0,dir=1,fired=false;
  const track=el('div','cd-track');
  const zoneEl=el('div','cd-zone');
  const marker=el('div','cd-marker');
  track.appendChild(zoneEl);track.appendChild(marker);
  const dealEl=el('div','game-stat','DEAL · 1 / 5');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const hud=el('div','game-hud');hud.appendChild(dealEl);hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','PRESS SPACE OR CLICK THE TRACK WHEN THE MARKER IS IN THE ZONE.'));
  host.appendChild(hud);host.appendChild(track);
  resize();
  function resize(){zoneEl.style.left=(C-zone)+'px';zoneEl.style.width=(zone*2)+'px'}
  let last=performance.now();
  function frame(now){
    const dt=Math.min(50,now-last);last=now;
    if(!fired){
      pos+=dir*speed*(dt/16.6);
      if(pos>=W){pos=W;dir=-1}if(pos<=0){pos=0;dir=1}
      marker.style.left=pos+'px';
    }
    gameState.raf=requestAnimationFrame(frame);
  }
  gameState.raf=requestAnimationFrame(frame);
  function fire(){
    if(fired||deals>=5)return;
    fired=true;
    const dist=Math.abs(pos-C);
    const pts=dist<=zone?Math.round((1-dist/zone)*1000):0;
    score+=pts;scoreEl.textContent='SCORE · '+score;
    const flash=el('div','cd-flash',pts?('+'+pts):'MISS');
    track.appendChild(flash);
    setTimeout(()=>{flash.remove();deals++;if(deals<5){zone=Math.max(30,zone-10);speed+=0.9;resize();dealEl.textContent='DEAL · '+(deals+1)+' / 5';fired=false}else done(score)},800);
  }
  track.addEventListener('click',fire);
  onKey(e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();fire()}});
};

/* ---- 5. AUTO FLOW ---- */
const AUTO_BLOCKS=['TRIGGER','FILTER','EMAIL','LOG'];
GAMES.autoFlow.build=function(host,done){
  const pad=el('div','af-pad');
  const roundEl=el('div','game-stat','ROUND · 1');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const hud=el('div','game-hud');hud.appendChild(roundEl);hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','WATCH THE SEQUENCE, THEN REPEAT IT BY CLICKING THE BLOCKS.'));
  host.appendChild(hud);host.appendChild(pad);
  const btns=AUTO_BLOCKS.map(b=>{const x=el('button','af-block',b);x.type='button';pad.appendChild(x);return x});
  let seq=[],step=0,score=0,locked=true;
  function startRound(){
    seq.push(pick(AUTO_BLOCKS));
    if(seq.length>6){done(score);return}
    roundEl.textContent='ROUND · '+seq.length;
    locked=true;step=0;
    let d=0;
    seq.forEach(b=>{
      setTimeout(()=>{const bi=AUTO_BLOCKS.indexOf(b);btns[bi].classList.add('lit');setTimeout(()=>btns[bi].classList.remove('lit'),480)},d);
      d+=700;
    });
    setTimeout(()=>{locked=false},d+250);
  }
  btns.forEach((btn,bi)=>{
    btn.onclick=()=>{
      if(locked)return;
      if(AUTO_BLOCKS[bi]===seq[step]){
        btn.classList.add('ok');setTimeout(()=>btn.classList.remove('ok'),200);
        step++;
        if(step===seq.length){
          const add=100*seq.length;score+=add;scoreEl.textContent='SCORE · '+score;
          setTimeout(startRound,500);
        }
      }else{
        done(score);
      }
    };
  });
  startRound();
};

/* ---- 6. BLACKJACK ---- */
GAMES.onboardPack.build=function(host,done){
  const SUITS=['♠','♥','♦','♣'];
  function deck(){const d=[];for(const s of SUITS)for(const r of [2,3,4,5,6,7,8,9,10,'J','Q','K','A'])d.push({r,s});return shuffle(d)}
  function val(hand){let t=0,a=0;for(const c of hand){if(c.r==='A'){a++;t+=11}else if(typeof c.r==='number')t+=c.r;else t+=10}while(t>21&&a>0){t-=10;a--}return t}
  function isBJ(hand){return hand.length===2&&val(hand)===21}
  function cardText(c){return c.r+c.s}
  function draw(hand){hand.push(deckPile.pop())}
  let deckPile=[],pHand=[],dHand=[],round=1,score=0,record=[0,0,0],busy=false,dealerTurn=false,roundOver=false;
  const roundEl=el('div','game-stat','ROUND · 1 / 5');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const recEl=el('div','game-stat','W · 0 / L · 0 / P · 0');
  const hud=el('div','game-hud');hud.appendChild(roundEl);hud.appendChild(scoreEl);hud.appendChild(recEl);
  const msg=el('div','game-stat','');
  const pBox=el('div','bj-side');
  const pCards=el('div','bj-hand');
  const pVal=el('div','bj-value');
  pBox.appendChild(el('div','bj-label','PLAYER'));pBox.appendChild(pCards);pBox.appendChild(pVal);
  const dBox=el('div','bj-side');
  const dCards=el('div','bj-hand');
  const dVal=el('div','bj-value');
  dBox.appendChild(el('div','bj-label','YOU · DEALER'));dBox.appendChild(dCards);dBox.appendChild(dVal);
  const actions=el('div','game-actions');
  host.appendChild(el('div','game-hint','YOU ARE THE DEALER · THE PLAYER HITS UNTIL 17 · THEN YOU HIT OR STAND'));
  host.appendChild(hud);host.appendChild(msg);host.appendChild(pBox);host.appendChild(dBox);host.appendChild(actions);
  function render(){
    pCards.innerHTML=pHand.map(c=>'<span class="bj-card">'+cardText(c)+'</span>').join('');
    dCards.innerHTML=dHand.map(c=>'<span class="bj-card">'+cardText(c)+'</span>').join('');
    pVal.textContent='VALUE · '+val(pHand);
    dVal.textContent='VALUE · '+val(dHand);
  }
  function updateHud(){roundEl.textContent='ROUND · '+round+' / 5';scoreEl.textContent='SCORE · '+score;recEl.textContent='W · '+record[0]+' / L · '+record[1]+' / P · '+record[2]}
  function settle(winner){
    roundOver=true;busy=true;dealerTurn=false;
    if(winner==='dealer'){record[0]++;score+=150;msg.textContent='DEALER WINS THE HAND';sfx(880,.25,'square',.03,1320)}
    else if(winner==='player'){record[1]++;msg.textContent='PLAYER TAKES THE HAND';sfx(140,.3,'sawtooth',.05,70)}
    else{record[2]++;score+=50;msg.textContent='PUSH · NOBODY WINS';sfx(520,.15,'square',.03,520)}
    updateHud();
    const nxt=el('button','game-btn',round>=5?'FINISH':'NEXT HAND');nxt.type='button';
    nxt.onclick=()=>{
      if(round>=5){done(score);return}
      round++;busy=false;dealerTurn=false;roundOver=false;msg.textContent='';
      nxt.remove();
      startRound();
    };
    actions.appendChild(nxt);
  }
  function buttons(){
    actions.innerHTML='';
    const h=el('button','game-btn','HIT');h.type='button';h.onclick=hit;actions.appendChild(h);
    const s=el('button','game-btn','STAND');s.type='button';s.onclick=stand;actions.appendChild(s);
  }
  function playerTurn(){
    const pv=val(pHand);
    if(pv>21){settle('dealer');return}
    if(pv>=17){
      dealerTurn=true;
      msg.textContent='DEALER TURN · HIT OR STAND';
      buttons();
      return;
    }
    busy=true;
    setTimeout(()=>{if(gameState.open&&gameState.id==='onboardPack'){draw(pHand);render();sfx(300,.06,'triangle',.02,200);busy=false;playerTurn()}},450);
  }
  function hit(){
    if(!dealerTurn||busy||roundOver)return;
    draw(dHand);render();sfx(380,.06,'triangle',.02,260);
    if(val(dHand)>21){dealerTurn=false;settle('player')}
  }
  function stand(){
    if(!dealerTurn||busy||roundOver)return;
    dealerTurn=false;
    const dv=val(dHand),pv=val(pHand);
    settle(dv>pv?'dealer':(dv<pv?'player':'push'));
  }
  function startRound(){
    deckPile=deck();pHand=[];dHand=[];
    draw(pHand);draw(dHand);draw(pHand);draw(dHand);
    actions.innerHTML='';
    render();updateHud();
    if(isBJ(pHand)&&isBJ(dHand)){settle('push');return}
    if(isBJ(dHand)){settle('dealer');return}
    if(isBJ(pHand)){settle('player');return}
    busy=false;msg.textContent='PLAYER TURN · THEY HIT UNTIL 17';
    playerTurn();
  }
  startRound();
};
