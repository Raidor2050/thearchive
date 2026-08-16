/* THE ARCHIVE // V1.1 MINI GAMES */
/* Six short browser games tied to the Guide's stories. */

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
    desc:'Run the pipeline. Tap to jump the dead ends, ride the arc to catch the lead line, beat your best. One hit breaks the flow — tap again to retry instantly.',
    tips:['Tap to jump. Holding does nothing extra.','The lead line rides the same arc that clears each obstacle.','Cores are worth 250 — they sit at the end of the line.','One hit ends the run. Tap again to restart on the spot.','Speed builds every meter. Your best is the real boss.']
  },
  onboardPack: {
    id:'onboardPack', title:'BLACKJACK', tag:'ONBOARDING',
    desc:'Play the hand. Hit or stand against the dealer — get to 21 without busting.',
    tips:['Aces count as eleven or one.','Hit below 17, stand at 17 or higher.','The dealer draws until 17.','Bust and the hand is gone.','Blackjack on two cards wins outright.']
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
  if(typeof closeNav==='function')closeNav();
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
    const retry=el('button','game-btn','RETRY');retry.type='button';retry.onclick=retryGame;
    const done=el('button','game-btn','DONE');done.type='button';done.onclick=closeGamePanel;
    body.appendChild(retry);body.appendChild(done);
    return;
  }
  body.appendChild(el('div','game-score','SCORE · '+score));
  let entryTs=null;
  const b=getBoard(gameState.id);
  const entry={name:(state.playerName||'PLAYER').slice(0,14),score,ts:Date.now()};
  entryTs=entry.ts;
  b.push(entry);
  b.sort((x,y)=>y.score-x.score);
  state.leaderboard[gameState.id]=b.slice(0,20);
  save();
  const wrap=el('div','game-save');
  const input=el('input','game-name');
  input.type='text';input.maxLength=14;input.placeholder='ENTER YOUR NAME';
  input.value=state.playerName||'';
  const saveBtn=el('button','game-btn','SAVE SCORE');saveBtn.type='button';
  const lbBtn=el('button','game-btn','VIEW LEADERBOARD');lbBtn.type='button';
  const msg=el('div','game-msg','AUTO-SAVED TO LEADERBOARD');
  const doneBtn=el('button','game-btn','DONE');doneBtn.type='button';doneBtn.onclick=closeGamePanel;
  const retryBtn=el('button','game-btn','RETRY');retryBtn.type='button';retryBtn.onclick=retryGame;
  function saveScore(){
    const name=(input.value.trim()||'PLAYER').slice(0,14);
    state.playerName=name;
    const b=getBoard(gameState.id);
    const e=b.find(x=>x.ts===entryTs);
    if(e)e.name=name;
    else{b.push({name,score,ts:Date.now()});b.sort((x,y)=>y.score-x.score);state.leaderboard[gameState.id]=b.slice(0,20)}
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
  body.appendChild(wrap);body.appendChild(lbBtn);body.appendChild(msg);body.appendChild(retryBtn);body.appendChild(doneBtn);
  input.focus();
}
function retryGame(){
  if(!gameState.open)return;
  stopTips();stopLoop();
  const id=gameState.id;
  gameState.generation++;
  gameState.open=false;gameState.results=false;gameState.id=null;
  startGame(id);
}
function skipGame(){if(!gameState.open)return;stopTips();stopLoop();showResults(null)}
function closeGamePanel(){stopTips();stopLoop();const id=gameState.id;const panel=g$('gamePanel');const card=g$('dialogueCard');panel.classList.remove('open');card.classList.remove('game-mode');const nav=g$('iconNav');if(nav)nav.classList.remove('nav-side');gameState.generation++;const gen=gameState.generation;setTimeout(()=>{if(gen===gameState.generation)panel.innerHTML=''},500);gameState.open=false;gameState.id=null;gameState.results=false;if(id&&typeof markGamePlayed==='function')markGamePlayed(id)}

function openLeaderboard(id){
  const g=GAMES[id];if(!g)return;
  const b=getBoard(id).slice(0,10);
  const rows=b.length?`<div class="lb">${b.map((e,i)=>`<div class="lb-row"><span class="lb-rank">${String(i+1).padStart(2,'0')}</span><span class="lb-name">${esc(e.name)}</span><span class="lb-score">${e.score}</span></div>`).join('')}</div>`:'<p class="story-small">No scores yet — the archive only keeps what you run.</p>';
  openModal('LEADERBOARD',g.title+' · TOP SCORES',rows);
}
function openGamesRoom(){
  const html=`<div class="games-room">${Object.values(GAMES).map(g=>{
    const best=getBoard(g.id)[0];
    return `<article class="game-row"><div class="game-row-main"><div class="game-row-kicker">${g.tag}</div><div class="game-row-title">${g.title}</div><div class="game-row-desc">${g.desc}</div><div class="game-row-best">BEST · ${best?esc(best.name)+' — '+best.score:'NOT PLAYED'}</div></div><div class="game-row-actions"><button class="game-btn" type="button" onclick="startGame('${g.id}')">PLAY</button><button class="game-btn" type="button" onclick="openLeaderboard('${g.id}')">SCORES</button></div></article>`}).join('')}</div>`;
  openModal('GAMES','V1.1 · MINI GAMES',html);
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
    'Thanks, Raiyan']},
  {profile:'HEALTH PODCAST · 55K · US',parts:[
    'SUBJECT: A sponsor fit for your wellness episode',
    'Hi Dana, your episode on sleep stood out.',
    'Our brand fits your listeners without interrupting them.',
    'Interested in a short brief?',
    'Best, Raiyan']},
  {profile:'TRAVEL CREATOR · 120K · UK',parts:[
    'SUBJECT: Travel eSIM collab for your audience',
    'Hey Josh, your Japan series was unreal.',
    'We cover the exact travel pain point you teach.',
    'Open to testing the product this month?',
    'Thanks, Raiyan']}
];
GAMES.emailBuild.build=function(host,done){
  let ei=0,score=0,combo=0,lives=3,roundStart=0,finished=false;
  const profileEl=el('div','eb-profile','');
  const slotEl=el('div','eb-slots');
  const chipsEl=el('div','eb-chips');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const livesEl=el('div','game-stat','LIVES · 3');
  const comboEl=el('div','game-stat','COMBO · x0');
  const msgEl=el('div','game-msg','');
  const hud=el('div','game-hud');hud.appendChild(livesEl);hud.appendChild(comboEl);hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','CLICK THE EMAIL PARTS IN THE RIGHT ORDER · 3 LIVES · MISSES COST ONE'));
  host.appendChild(hud);host.appendChild(profileEl);host.appendChild(msgEl);host.appendChild(slotEl);host.appendChild(chipsEl);
  function grade(){return score>=12000?'GRADE S · OUTREACH THAT EARNS A REPLY':score>=8000?'GRADE A · CLEAR AND RELEVANT':score>=4000?'GRADE B · IT WILL WORK':'GRADE C · TIGHTEN THE FIT'}
  function startRound(){
    if(finished)return;
    if(ei>=EMAILS.length){finished=true;msgEl.textContent=grade();setTimeout(()=>{if(gameState.open&&gameState.id==='emailBuild')done(score)},1200);return}
    roundStart=performance.now();
    const e=EMAILS[ei];
    profileEl.textContent='PROSPECT · '+e.profile;
    slotEl.innerHTML='';chipsEl.innerHTML='';msgEl.textContent='';
    const slots=e.parts.map((p,idx)=>{const s=el('div','eb-slot');slotEl.appendChild(s);return s});
    let next=0;
    shuffle(e.parts).forEach(p=>{
      const c=el('button','eb-chip',p);c.type='button';
      c.onclick=()=>{
        if(finished)return;
        const idx=e.parts.indexOf(c.textContent);
        if(idx===next){
          slots[idx].textContent=c.textContent;slots[idx].classList.add('filled');
          c.classList.add('used');c.disabled=true;
          combo++;score+=100+25*combo;scoreEl.textContent='SCORE · '+score;
          comboEl.textContent='COMBO · x'+combo;msgEl.textContent='';
          next++;
          if(next===e.parts.length){
            const bonus=Math.max(0,Math.round(2500-(performance.now()-roundStart)));
            score+=bonus;scoreEl.textContent='SCORE · '+score;
            combo=0;comboEl.textContent='COMBO · x0';
            ei++;setTimeout(startRound,500);
          }
        }else{
          combo=0;comboEl.textContent='COMBO · x0';
          score=Math.max(0,score-30);scoreEl.textContent='SCORE · '+score;
          lives--;livesEl.textContent='LIVES · '+Math.max(0,lives);
          c.classList.add('wrong');setTimeout(()=>c.classList.remove('wrong'),240);
          msgEl.textContent='WRONG PART · THE NEXT PIECE IS: '+e.parts[next];
          if(lives<=0){finished=true;msgEl.textContent='OUT OF LIVES · OUTREACH NEEDS CARE';setTimeout(()=>{if(gameState.open&&gameState.id==='emailBuild')done(score)},900)}
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
  const track=el('div','cd-track');
  const zoneEl=el('div','cd-zone');
  const marker=el('div','cd-marker');
  track.appendChild(zoneEl);track.appendChild(marker);
  const dealEl=el('div','game-stat','DEAL · 1 / 9');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const streakEl=el('div','game-stat','STREAK · x0');
  const hud=el('div','game-hud');hud.appendChild(dealEl);hud.appendChild(streakEl);hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','PRESS SPACE OR CLICK THE TRACK WHEN THE MARKER IS IN THE ZONE · STREAKS MULTIPLY'));
  host.appendChild(hud);host.appendChild(track);
  const W=track.clientWidth||420;
  const MW=marker.clientWidth||8;
  const B=2;
  const C=W/2;
  let deals=0,score=0,zone=70,speed=3.6,pos=0,dir=1,fired=false,streak=0;
  resize();
  function resize(){zoneEl.style.left=(C-zone-B)+'px';zoneEl.style.width=(zone*2+B*2)+'px'}
  let last=performance.now();
  function frame(now){
    if(gameState.results)return;
    const dt=Math.min(50,now-last);last=now;
    if(!fired){
      pos+=dir*speed*(dt/16.6);
      if(pos>=W-MW){pos=W-MW;dir=-1}if(pos<=0){pos=0;dir=1}
      marker.style.left=pos+'px';
    }
    gameState.raf=requestAnimationFrame(frame);
  }
  gameState.raf=requestAnimationFrame(frame);
  function fire(){
    if(fired||deals>=9)return;
    fired=true;
    const dist=Math.abs((pos+MW/2)-C);
    let pts=0,mult=1,label='MISS';
    if(dist<=zone){
      streak++;
      mult=1+0.25*(streak-1);
      pts=Math.round((1-dist/zone)*1000*mult);
      score+=pts;
      streakEl.textContent='STREAK · x'+streak;
      zoneEl.classList.add('hit');
      label=dist<=zone*0.3?'PERFECT +':'GOOD +';
    }else{
      streak=0;
      streakEl.textContent='STREAK · x0';
    }
    scoreEl.textContent='SCORE · '+score;
    const flash=el('div','cd-flash',label+(pts?(' '+pts):''));
    track.appendChild(flash);
    setTimeout(()=>{flash.remove();zoneEl.classList.remove('hit');deals++;if(deals<9){zone=Math.max(30,zone-10);speed+=0.6;resize();dealEl.textContent='DEAL · '+(deals+1)+' / 9';fired=false}else if(gameState.open&&gameState.id==='closeDeal')done(score)},800);
  }
  track.addEventListener('click',fire);
  onKey(e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();fire()}});
};

/* ---- 5. AUTO FLOW (Geometry-Dash-style runner) ---- */
GAMES.autoFlow.build=function(host,done){
  const W=620,H=300,GROUND=H-46,GOAL=3000;
  const c=el('canvas','li-canvas af-canvas');c.width=W;c.height=H;
  const ctx=c.getContext('2d');
  const best=getBoard('autoFlow')[0]?getBoard('autoFlow')[0].score:0;
  let score=0,dist=0,leads=0,speed=4.3,jumpV=0,onGround=true,dead=false;
  let phase='count',count=3,countT=44,last=performance.now(),nextSpawn=340,chain=0;
  let shakeT=0,flashA=0,landT=0,bannerT=0,banner='',milestone=750,impactT=0;
  const scoreEl=el('div','game-stat','SCORE · 0');
  const leadEl=el('div','game-stat','LEADS · 0');
  const distEl=el('div','game-stat','METERS · 0');
  const bestEl=el('div','game-stat','BEST · '+(best?best:'—'));
  const hud=el('div','game-hud');hud.appendChild(distEl);hud.appendChild(leadEl);hud.appendChild(bestEl);hud.appendChild(scoreEl);
  host.appendChild(el('div','game-hint','TAP SPACE / CLICK TO JUMP · ONE HIT ENDS THE RUN · TAP AGAIN TO RETRY ON THE SPOT'));
  host.appendChild(hud);host.appendChild(c);
  const pad=el('div','game-pad');
  const jumpBtn=el('button','game-pad-btn','JUMP ▲');jumpBtn.type='button';
  const down=()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true}));
  jumpBtn.addEventListener('pointerdown',e=>{e.preventDefault();down()});
  pad.appendChild(jumpBtn);
  host.appendChild(pad);
  const player={x:86,w:16,h:16,y:0};
  const obstacles=[],packs=[],parts=[],pops=[];
  let scroll=[0,0,0];
  let coyoteT=0,bufferT=0;
  function spawn(){
    const r=Math.random();
    let type='mail';
    if(r<0.22)type='node';
    else if(r<0.55)type='tab';
    const h=type==='node'?44:(type==='tab'?30:18);
    const ox=W+40;
    obstacles.push({type,x:ox,w:type==='node'?20:(type==='tab'?16:24),h,y:GROUND-h,pass:false,minGap:1e9,seed:Math.random()*6.28});
    if(type==='mail'&&speed>=7.8&&Math.random()<0.3)
      obstacles.push({type:'mail',x:ox+52,w:24,h:18,y:GROUND-18,pass:false,minGap:1e9,seed:Math.random()*6.28});
    placePacks(ox);
  }
  function placePacks(ox){
    const tti=12;
    const T=(ox-102)/speed;
    const phases=[9,15,21];
    const core=Math.random()<0.12;
    for(let i=0;i<phases.length;i++){
      const t=phases[i];
      const yAt=9.5*t-0.33*t*t;
      const isCore=core&&i===phases.length-1;
      packs.push({x:86+speed*(T-tti+t),y:GROUND-16-yAt,size:isCore?10:8,kind:isCore?'core':'packet',t:Math.random()*6.28,got:false});
    }
  }
  function dust(x,y,n,spread){
    for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*spread,vy:-Math.random()*2.2,life:16+Math.random()*10,size:2+Math.random()*2});
  }
  function pop(x,y,text){pops.push({x,y,text,life:20})}
  function doJump(){
    if(phase==='dead'){
      if(impactT>0)return;
      restartRun();
      return;
    }
    if(dead||phase!=='run')return;
    if(onGround||coyoteT>0){
      jumpV=9.5;onGround=false;coyoteT=0;bufferT=0;
      dust(player.x+8,GROUND,4,2.4);sfx(520,.1,'square',.03,820);
    }else{bufferT=120}
  }
  function die(){
    if(dead)return;
    dead=true;phase='dead';impactT=200;shakeT=16;flashA=.6;
    const hb={x:player.x+1,y:GROUND-16-player.y,w:14,h:16};
    for(let i=0;i<10;i++)parts.push({x:hb.x+7,y:hb.y+8,vx:(Math.random()-.5)*4,vy:(Math.random()-.6)*4,life:20,size:2});
    for(let i=0;i<4;i++)parts.push({x:hb.x+3+Math.random()*10,y:hb.y+2+Math.random()*12,vx:(Math.random()-.5)*6,vy:-2-Math.random()*2,life:26,size:6});
    sfx(110,.5,'sawtooth',.06,50);
    sfx(55,.3,'triangle',.08,110);
  }
  function restartRun(){
    dead=false;phase='run';
    score=0;dist=0;leads=0;speed=4.3;jumpV=0;onGround=true;
    obstacles.length=0;packs.length=0;parts.length=0;pops.length=0;
    nextSpawn=340;chain=0;milestone=750;shakeT=0;flashA=0;landT=0;bannerT=0;impactT=0;
    scoreEl.textContent='SCORE · 0';leadEl.textContent='LEADS · 0';distEl.textContent='METERS · 0';
    last=performance.now();
  }
  function finish(){
    if(dead)return;
    dead=true;phase='done';
    stopLoop();
    host.appendChild(el('div','game-msg','PIPELINE AUTOMATED'));
    if(score>best)host.appendChild(el('div','game-msg','NEW BEST · '+score));
    setTimeout(()=>{if(gameState.open&&gameState.id==='autoFlow')done(score)},900);
  }
  function frame(now){
    const dt=Math.min(50,now-last);last=now;
    if(window.__afDie&&!dead&&phase==='run'){window.__afDie=false;die()}
    if(dead){
      if(phase==='dead'){
        impactT-=dt;
        if(shakeT>0)shakeT--;
        if(flashA>0)flashA=Math.max(0,flashA-.04);
        for(const pa of parts){pa.x+=pa.vx;pa.y+=pa.vy;pa.life--;pa.vy+=0.3}
        for(let i=parts.length-1;i>=0;i--)if(parts[i].life<=0)parts.splice(i,1);
      }
    }else{
      if(phase==='count'){
        countT-=dt;
        if(countT<=0){count--;countT=44;if(count<0){phase='run';banner='GO!';bannerT=50;sfx(660,.15,'square',.05,1320)}}
      }else{
        speed=Math.min(11,4.3+dist/260);
        dist+=speed*(dt/16.6);
        distEl.textContent='METERS · '+Math.round(dist);
        score+=Math.round(speed);scoreEl.textContent='SCORE · '+score;
        if(dist>=nextSpawn){spawn();nextSpawn=dist+Math.round(66*speed)}
        if(dist>=GOAL){finish()}
        if(dist>=milestone){
          const notes=['LEADS FILE THEMSELVES','STATUS UPDATES ITSELF','REPORTS BUILD THEMSELVES','ROUTES REROUTE THEMSELVES'];
          banner=notes[Math.floor(milestone/750)-1]||'FLOW STABLE';
          bannerT=70;milestone+=750;shakeT=10;sfx(440,.12,'square',.05,880);
        }
      }
      coyoteT=onGround?100:Math.max(0,coyoteT-dt);
      bufferT=Math.max(0,bufferT-dt);
      if(!onGround){
        jumpV-=0.66*(dt/16.6);
        player.y+=jumpV*(dt/16.6);
        if(player.y<=0){
          player.y=0;onGround=true;jumpV=0;landT=6;dust(player.x+6,GROUND,3,2);
          if(bufferT>0){bufferT=0;doJump()}
        }
      }
      if(phase==='run'){
        obstacles.forEach(o=>o.x-=speed*(dt/16.6));
        for(let i=obstacles.length-1;i>=0;i--)if(obstacles[i].x<-40)obstacles.splice(i,1);
        packs.forEach(p=>{p.x-=speed*(dt/16.6);p.t+=0.1});
        for(let i=packs.length-1;i>=0;i--)if(packs[i].x<-30)packs.splice(i,1);
        const hb={x:player.x+1,y:GROUND-16-player.y,w:14,h:16};
        for(const o of obstacles){
          if(o.pass)continue;
          const overlap=o.x+2<hb.x+hb.w&&o.x+o.w-2>hb.x;
          if(overlap){
            if(GROUND-o.h+2<hb.y+hb.h&&hb.y<GROUND-2){chain=0;die();return}
            const gap=player.y-o.h;
            if(gap<o.minGap)o.minGap=gap;
          }else if(o.x+o.w-2<=hb.x){
            o.pass=true;
            if(o.minGap>0&&o.minGap<=6){score+=15;pop(o.x+o.w/2,GROUND-16-player.y,'+15 NEAR MISS');scoreEl.textContent='SCORE · '+score;sfx(760,.06,'square',.03,1520)}
          }
        }
        for(const p of packs){
          if(!p.got&&p.x+1<hb.x+hb.w&&p.x+p.size-1>hb.x&&p.y+2<hb.y+hb.h&&p.y+p.size-2>hb.y){
            p.got=true;leads++;
            const worth=p.kind==='core'?250:50+Math.min(chain,4)*10;
            if(p.kind==='core')chain=0;else chain++;
            score+=worth;leadEl.textContent='LEADS · '+leads;scoreEl.textContent='SCORE · '+score;
            pop(p.x+4,GROUND-player.y-16,'+'+worth);
            for(let i=0;i<6;i++)parts.push({x:p.x+4,y:p.y+5,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3-1,life:16,size:2});
            sfx(p.kind==='core'?880:640,.1,'square',.04,p.kind==='core'?1760:1280);
          }
        }
      }
      scroll[0]=(scroll[0]+speed*(dt/16.6))%34;
      scroll[1]=(scroll[1]+speed*.35*(dt/16.6))%52;
      scroll[2]=(scroll[2]+speed*.16*(dt/16.6))%72;
      if(shakeT>0)shakeT--;
      if(flashA>0)flashA=Math.max(0,flashA-.04);
      if(landT>0)landT--;
      if(bannerT>0)bannerT--;
      for(const pa of parts){pa.x+=pa.vx;pa.y+=pa.vy;pa.life--;pa.vy+=0.15}
      for(let i=parts.length-1;i>=0;i--)if(parts[i].life<=0)parts.splice(i,1);
      for(const po of pops){po.y-=0.6;po.life--}
      for(let i=pops.length-1;i>=0;i--)if(pops[i].life<=0)pops.splice(i,1);
    }
    gameState.af={phase,dead,onGround,speed,px:player.x,pw:player.w,py:player.y,obs:obstacles.map(o=>({x:o.x,w:o.w,h:o.h})),dist};
    draw(now);
    if(phase!=='done')gameState.raf=requestAnimationFrame(frame);
  }
  function drawPack(p){
    const b=Math.sin(p.t)*1.2;
    if(p.kind==='core'){
      ctx.fillStyle='#fff';
      ctx.fillRect(p.x-b,p.y,10,10);
      ctx.fillStyle='#000';
      ctx.fillRect(p.x+2-b,p.y+2,6,6);
      ctx.fillStyle='#fff';
      ctx.fillRect(p.x+4-b,p.y+4,2,2);
      ctx.fillStyle='rgba(255,255,255,.5)';
      ctx.fillRect(p.x-3-b,p.y+4,2,2);
      ctx.fillRect(p.x+11-b,p.y+4,2,2);
    }else{
      ctx.fillStyle='#fff';
      ctx.fillRect(p.x-b,p.y,8,10);
      ctx.fillStyle='#000';
      ctx.fillRect(p.x+2-b,p.y+3,4,4);
      ctx.fillStyle='rgba(255,255,255,.4)';
      ctx.fillRect(p.x-4-b,p.y+4,3,2);
    }
  }
  function drawOb(o){
    const x=o.x,y=o.y;
    if(o.type==='node'){
      ctx.fillStyle='#fff';
      ctx.fillRect(x+3,y+4,14,6);
      ctx.fillRect(x,y+10,20,8);
      ctx.fillRect(x+3,y+18,14,8);
      ctx.fillRect(x+8,y+26,4,18);
      ctx.fillStyle='#000';
      ctx.fillRect(x+6,y+6,8,2);
      ctx.fillRect(x+4,y+20,12,4);
    }else if(o.type==='tab'){
      ctx.fillStyle='#fff';
      ctx.fillRect(x+3,y+16,10,14);
      ctx.fillRect(x,y,16,18);
      ctx.fillStyle='#000';
      ctx.fillRect(x+3,y+4,10,2);
      ctx.fillRect(x+3,y+8,10,2);
      ctx.fillRect(x+3,y+12,6,2);
    }else{
      ctx.fillStyle='#fff';
      ctx.fillRect(x,y,24,18);
      ctx.fillStyle='#000';
      ctx.beginPath();ctx.moveTo(x,y+2);ctx.lineTo(x+12,y+9);ctx.lineTo(x+24,y+2);ctx.lineTo(x+24,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
      ctx.fillRect(x,y+13,24,2);
    }
  }
  function drawPlayer(now){
    if(phase==='dead')return;
    const px=player.x;
    const py=GROUND-16-player.y+(phase==='count'?Math.sin(now/300)*1.2:0);
    ctx.fillStyle='#fff';
    ctx.fillRect(px,py,16,16);
    ctx.fillStyle='#000';
    ctx.fillRect(px+3,py+3,3,3);
    ctx.fillRect(px+10,py+3,3,3);
    ctx.fillRect(px+6,py+11,4,3);
    if(landT>0){
      ctx.fillStyle='rgba(255,255,255,.4)';
      ctx.fillRect(px+1,py+17,14,2);
    }
    ctx.fillStyle='rgba(255,255,255,.25)';
    ctx.fillRect(px-5,py+5,3,3);
    ctx.fillRect(px-9,py+9,3,3);
  }
  function draw(now){
    ctx.save();
    if(shakeT>0)ctx.translate((Math.random()-.5)*6,(Math.random()-.5)*6);
    ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(255,255,255,.05)';
    for(let i=-1;i<10;i++){
      const sx=i*72-scroll[2];
      const th=40+(i%3)*22;
      ctx.fillRect(sx,H-70-th,34,70+th);
      ctx.fillRect(sx+6,H-84-th,22,84+th);
    }
    ctx.fillStyle='rgba(255,255,255,.14)';
    const pipeY=H-96;
    ctx.fillRect(0,pipeY,W,3);
    for(let i=-1;i<14;i++){
      const sx=i*52-scroll[1];
      ctx.fillRect(sx,pipeY-2,6,7);
      ctx.fillRect(sx+10,pipeY-6,2,11);
      ctx.fillRect(sx+16,pipeY-2,4,7);
    }
    ctx.fillStyle='#fff';
    ctx.fillRect(0,GROUND,W,2);
    ctx.fillStyle='rgba(255,255,255,.5)';
    for(let i=-1;i<22;i++){
      const sx=i*34-scroll[0];
      ctx.fillRect(sx,GROUND+7,14,3);
      ctx.fillRect(sx+6,GROUND+15,8,3);
    }
    packs.forEach(p=>{if(!p.got)drawPack(p)});
    obstacles.forEach(drawOb);
    drawPlayer(now);
    for(const pa of parts){
      ctx.fillStyle='rgba(255,255,255,'+Math.min(1,pa.life/14)+')';
      ctx.fillRect(pa.x,pa.y,pa.size,pa.size);
    }
    for(const po of pops){
      ctx.fillStyle='rgba(255,255,255,'+Math.min(1,po.life/20)+')';
      ctx.font='13px monospace';
      ctx.textAlign='center';
      ctx.fillText(po.text,po.x,po.y);
      ctx.textAlign='left';
    }
    const p=Math.min(1,dist/GOAL);
    ctx.fillStyle='#fff';
    ctx.fillRect(8,8,W-16,5);
    ctx.fillStyle='#000';
    ctx.fillRect(9,9,W-18,3);
    ctx.fillStyle='#fff';
    ctx.fillRect(9,9,(W-18)*p,3);
    ctx.font='12px monospace';
    ctx.fillText('AUTO RUN · '+Math.round(p*100)+'%',W-158,22);
    if(phase==='count'){
      ctx.fillStyle='#fff';
      ctx.font='44px monospace';
      ctx.textAlign='center';
      ctx.fillText(String(count),W/2,H/2-14);
      ctx.font='14px monospace';
      ctx.fillText('GET READY',W/2,H/2+12);
      ctx.textAlign='left';
    }
    if(bannerT>0){
      ctx.fillStyle='rgba(255,255,255,'+(Math.min(1,bannerT/20)*.9)+')';
      ctx.font='18px monospace';
      ctx.textAlign='center';
      ctx.fillText(banner,W/2,H/2-40);
      ctx.textAlign='left';
    }
    if(phase==='dead'&&impactT<=0){
      const blink=.55+.45*Math.sin(now/160);
      ctx.fillStyle='rgba(255,255,255,'+blink+')';
      ctx.font='22px monospace';
      ctx.textAlign='center';
      ctx.fillText('FLOW BROKE',W/2,H/2-44);
      ctx.font='14px monospace';
      ctx.fillText('TAP TO RETRY',W/2,H/2-12);
      ctx.fillText(Math.round(dist)+' M',W/2,H/2+12);
      ctx.textAlign='left';
    }
    if(flashA>0){
      ctx.fillStyle='rgba(255,255,255,'+flashA+')';
      ctx.fillRect(0,0,W,H);
    }
    ctx.restore();
  }
  onKey(e=>{
    const k=e.key;
    if(k===' '||k==='ArrowUp'||k.toLowerCase()==='w'){e.preventDefault();doJump()}
  });
  c.addEventListener('pointerdown',e=>{e.preventDefault();doJump()});
  gameState.raf=requestAnimationFrame(frame);
};

/* ---- 6. BLACKJACK ---- */
GAMES.onboardPack.build=function(host,done){
  const SUITS=['♠','♥','♦','♣'];
  function deck(){const d=[];for(const s of SUITS)for(const r of [2,3,4,5,6,7,8,9,10,'J','Q','K','A'])d.push({r,s});return shuffle(d)}
  function val(hand){let t=0,a=0;for(const c of hand){if(c.r==='A'){a++;t+=11}else if(typeof c.r==='number')t+=c.r;else t+=10}while(t>21&&a>0){t-=10;a--}return t}
  function isBJ(hand){return hand.length===2&&val(hand)===21}
  function cardText(c){return c.r+c.s}
  function draw(hand){hand.push(deckPile.pop())}
  let deckPile=[],pHand=[],dHand=[],round=1,score=0,record=[0,0,0],busy=false,roundOver=false;
  const roundEl=el('div','game-stat','ROUND · 1 / 5');
  const scoreEl=el('div','game-stat','SCORE · 0');
  const recEl=el('div','game-stat','W · 0 / L · 0 / P · 0');
  const hud=el('div','game-hud');hud.appendChild(roundEl);hud.appendChild(scoreEl);hud.appendChild(recEl);
  const msg=el('div','game-stat','');
  const pBox=el('div','bj-side');
  const pCards=el('div','bj-hand');
  const pVal=el('div','bj-value');
  pBox.appendChild(el('div','bj-label','YOU'));pBox.appendChild(pCards);pBox.appendChild(pVal);
  const dBox=el('div','bj-side');
  const dCards=el('div','bj-hand');
  const dVal=el('div','bj-value');
  dBox.appendChild(el('div','bj-label','DEALER'));dBox.appendChild(dCards);dBox.appendChild(dVal);
  const actions=el('div','game-actions');
  host.appendChild(el('div','game-hint','PLAY THE HAND · HIT OR STAND AGAINST THE DEALER · GET TO 21 WITHOUT BUSTING'));
  host.appendChild(hud);host.appendChild(msg);host.appendChild(pBox);host.appendChild(dBox);host.appendChild(actions);
  function render(){
    pCards.innerHTML=pHand.map(c=>'<span class="bj-card">'+cardText(c)+'</span>').join('');
    dCards.innerHTML=dHand.map(c=>'<span class="bj-card">'+cardText(c)+'</span>').join('');
    pVal.textContent='VALUE · '+val(pHand);
    dVal.textContent='VALUE · '+val(dHand);
  }
  function updateHud(){roundEl.textContent='ROUND · '+round+' / 5';scoreEl.textContent='SCORE · '+score;recEl.textContent='W · '+record[0]+' / L · '+record[1]+' / P · '+record[2]}
  function settle(winner){
    roundOver=true;busy=true;
    if(winner==='player'){record[0]++;score+=150;msg.textContent='YOU TAKE THE HAND';sfx(140,.3,'sawtooth',.05,70)}
    else if(winner==='dealer'){record[1]++;msg.textContent='DEALER WINS THE HAND';sfx(880,.25,'square',.03,1320)}
    else{record[2]++;score+=50;msg.textContent='PUSH · NOBODY WINS';sfx(520,.15,'square',.03,520)}
    updateHud();
    actions.innerHTML='';
    const nxt=el('button','game-btn',round>=5?'FINISH':'NEXT HAND');nxt.type='button';
    nxt.onclick=()=>{
      if(round>=5){done(score);return}
      round++;busy=false;roundOver=false;msg.textContent='';
      nxt.remove();
      startRound();
    };
    actions.appendChild(nxt);
  }
  function playerButtons(){
    actions.innerHTML='';
    const h=el('button','game-btn','HIT');h.type='button';h.onclick=hit;actions.appendChild(h);
    const s=el('button','game-btn','STAND');s.type='button';s.onclick=stand;actions.appendChild(s);
  }
  function dealerPlay(){
    while(val(dHand)<17){draw(dHand);render();sfx(380,.06,'triangle',.02,260)}
    const dv=val(dHand),pv=val(pHand);
    settle(dv>pv?'dealer':(dv<pv?'player':'push'));
  }
  function hit(){
    if(busy||roundOver)return;
    draw(pHand);render();sfx(300,.06,'triangle',.02,200);
    if(val(pHand)>21){settle('dealer');return}
  }
  function stand(){
    if(busy||roundOver)return;
    busy=true;
    dealerPlay();
  }
  function startRound(){
    deckPile=deck();pHand=[];dHand=[];
    draw(pHand);draw(dHand);draw(pHand);draw(dHand);
    actions.innerHTML='';
    render();updateHud();
    msg.textContent='YOUR TURN · HIT OR STAND';
    if(isBJ(pHand)&&isBJ(dHand)){settle('push');return}
    if(isBJ(pHand)){settle('player');return}
    if(isBJ(dHand)){settle('dealer');return}
    playerButtons();
  }
  startRound();
};
