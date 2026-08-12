/* THE ARCHIVE // V1.1 MINI DRILLS */
/* Five short browser games tied to the Guide's story topics. */

const gameState = {open:false,id:null,results:false,tipsTimer:null,keys:[],raf:null};

const GAMES = {
  leadSort: {
    id:'leadSort', title:'LEAD SORT', tag:'LEAD SOURCING',
    desc:'Keep the leads that fit the offer. Pass the noise. Fast.',
    tips:['Match the lead to the offer, not the other way around.','Audience fit comes first.','A list alone is not a pipeline.','Decisive beats perfect.','Region and audience both have to line up.']
  },
  emailBuild: {
    id:'emailBuild', title:'EMAIL BUILD', tag:'OUTREACH',
    desc:'Assemble the outreach email in the right order.',
    tips:['Open with the subject. Then the greeting.','Personalize the hook before the ask.','A relevant message is shorter and clearer.','End with a clear next step.','Fit before volume. Always.']
  },
  partnerCall: {
    id:'partnerCall', title:'PARTNER CALL', tag:'CONTACT',
    desc:'Answer partners and prospects. Keep the conversation alive.',
    tips:['Clarify expectations. Remove friction.','Make the next step obvious.','Every reply is a chance to build trust.','Never let a partner hang.','Warm beats correct. Every time.']
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
  }
};

function g$(id){return document.getElementById(id)}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function randBetween(min,max){return min+Math.random()*(max-min)}
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function isGameBlocking(){return gameState.open}
function getBoard(id){if(!state.leaderboard)state.leaderboard={};if(!state.leaderboard[id])state.leaderboard[id]=[];return state.leaderboard[id]}

function onKey(fn){window.addEventListener('keydown',fn);gameState.keys.push(fn)}
function clearKeys(){gameState.keys.forEach(fn=>window.removeEventListener('keydown',fn));gameState.keys=[]}

function startGame(id){
  if(gameState.open)return;
  const g=GAMES[id];if(!g)return;
  if(typeof closeModal==='function')closeModal();
  gameState.open=true;gameState.id=id;gameState.results=false;
  const panel=g$('gamePanel');
  panel.classList.add('open');
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
function closeGamePanel(){stopTips();stopLoop();const panel=g$('gamePanel');panel.classList.remove('open');panel.innerHTML='';gameState.open=false;gameState.id=null;gameState.results=false}

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

/* ---- 1. LEAD SORT ---- */
const LEAD_OFFERS=[
  {text:'US CREATORS · 5K+ · TRAVEL',region:'US',min:5000},
  {text:'CA GAMERS · 20K+ · GAMING',region:'CA',min:20000},
  {text:'UK TECH · 10K+ · SAAS',region:'UK',min:10000},
  {text:'DE LIFESTYLE · 8K+ · ECOM',region:'DE',min:8000}
];
const LEAD_REGIONS=['US','CA','UK','DE'];
const LEAD_CHANNELS=['YT','IG','TW','BLOG'];
function genLeads(n,offer){
  const out=[];
  for(let k=0;k<n;k++){
    const fit=Math.random()<0.5;
    const region=fit?offer.region:pick(LEAD_REGIONS.filter(r=>r!==offer.region));
    const audience=fit?Math.round(offer.min*randBetween(1,4)/100)*100:Math.round(offer.min*randBetween(0.1,0.95)/100)*100;
    out.push({region,audience,channel:pick(LEAD_CHANNELS),fit});
  }
  return out;
}
GAMES.leadSort.build=function(host,done){
  const CARD_MS=3500;
  const offer=pick(LEAD_OFFERS);
  const leads=genLeads(12,offer);
  let i=0,score=0,combo=0,answered=true;
  const offerEl=el('div','lead-offer','OFFER · '+offer.text);
  const scoreEl=el('div','game-stat','SCORE · 0');
  const comboEl=el('div','game-stat','COMBO · x0');
  const hud=el('div','game-hud');hud.appendChild(scoreEl);hud.appendChild(comboEl);
  const bar=el('div','lead-bar');const fill=el('div','lead-bar-fill');bar.appendChild(fill);
  const board=el('div','lead-board');
  const actions=el('div','game-actions');
  const keep=el('button','game-btn','KEEP (A)');keep.type='button';
  const pass=el('button','game-btn','PASS (D)');pass.type='button';
  actions.appendChild(keep);actions.appendChild(pass);
  host.appendChild(el('div','game-hint','KEEP the leads that fit the offer. PASS the noise.'));
  host.appendChild(offerEl);host.appendChild(hud);host.appendChild(board);host.appendChild(bar);host.appendChild(actions);
  let timer=null;
  function render(){
    if(i>=leads.length){done(score);return}
    const l=leads[i];
    board.innerHTML='';
    board.appendChild(el('div','lead-line','REGION · '+l.region));
    board.appendChild(el('div','lead-line','AUDIENCE · '+l.audience.toLocaleString()));
    board.appendChild(el('div','lead-line','CHANNEL · '+l.channel));
    fill.style.transition='none';fill.style.width='100%';
    requestAnimationFrame(()=>{requestAnimationFrame(()=>{fill.style.transition='width '+CARD_MS+'ms linear';fill.style.width='0%'})});
    answered=false;
    clearTimeout(timer);
    timer=setTimeout(()=>answer(l.fit,false,true),CARD_MS);
  }
  function answer(correct,userFit,timeout){
    if(answered)return;answered=true;clearTimeout(timer);
    if(correct){combo++;score+=100+50*combo}
    else{combo=0;if(!timeout)score=Math.max(0,score-50)}
    scoreEl.textContent='SCORE · '+score;
    comboEl.textContent='COMBO · x'+combo;
    i++;render();
  }
  keep.onclick=()=>answer(leads[i].fit,true,false);
  pass.onclick=()=>answer(!leads[i].fit,false,false);
  onKey(e=>{const k=e.key.toLowerCase();if(k==='a')keep.onclick();else if(k==='d')pass.onclick()});
  render();
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
const PARTNER_LINES=[
  {s:'Partner: "Can you share the reporting template?"',o:['Sure, here it is. Want a quick walkthrough?','I sent it last quarter.','It is internal only.'],a:0},
  {s:'Partner: "Our audience did not click well last month."',o:['Let us review the data and test a new angle.','That is on your side.','Nothing we can do.'],a:0},
  {s:'Prospect: "How much does it cost?"',o:['Here are the tiers. What fits your budget?','Too expensive for you?','Prices are secret.'],a:0},
  {s:'Partner: "Can we change the payout terms?"',o:['We have some flexibility. Let me check.','No.','Ask someone else.'],a:0},
  {s:'Prospect: "I am busy this month."',o:['No rush. I will send a one-pager you can review.','Then you are not a good fit.','I will keep emailing you.'],a:0},
  {s:'Partner: "We need the assets next week."',o:['I will send them by Friday and confirm.','Next week is too soon.','Use your own.'],a:0},
  {s:'Prospect: "Who else are you working with?"',o:['I can share a few relevant case studies.','None of your business.','Everyone.'],a:0},
  {s:'Partner: "The campaign is live. Now what?"',o:['We track performance and optimize together.','Now we wait.','We are done.'],a:0},
  {s:'Prospect: "I need time to think."',o:['Of course. I will send the details to make it easy.','I need an answer now.','Fine.'],a:0},
  {s:'Partner: "Payouts are late again."',o:['I will check the payment pipeline today.','Not my problem.','Try again next month.'],a:0}
];
GAMES.partnerCall.build=function(host,done){
  const qs=shuffle(PARTNER_LINES).slice(0,8);
  let qi=0,score=0,combo=0,timer=null;
  const hud=el('div','game-hud');
  const sit=el('div','pc-sit','');
  const opts=el('div','pc-opts');
  host.appendChild(el('div','game-hint','Pick the response that keeps the relationship moving. (1-3)'));
  host.appendChild(hud);host.appendChild(sit);host.appendChild(opts);
  function render(){
    if(qi>=qs.length){clearInterval(timer);done(score);return}
    const q=qs[qi];
    const order=shuffle(q.o);
    const correctIdx=order.indexOf(q.o[q.a]);
    sit.textContent=q.s;
    opts.innerHTML='';
    order.forEach((o,oi)=>{const b=el('button','game-btn',(oi+1)+' · '+o);b.type='button';b.onclick=()=>pick(oi===correctIdx,false);opts.appendChild(b)});
    const tEl=el('div','pc-timer','');
    hud.innerHTML='';
    hud.appendChild(el('div','game-stat','Q · '+(qi+1)+' / '+qs.length));
    hud.appendChild(el('div','game-stat','SCORE · '+score));
    hud.appendChild(el('div','game-stat','COMBO · x'+combo));
    hud.appendChild(tEl);
    clearInterval(timer);
    const ms=6000,start=performance.now();
    timer=setInterval(()=>{const left=ms-(performance.now()-start);tEl.textContent='TIME · '+Math.max(0,Math.round(left/1000))+'s';if(left<=0){clearInterval(timer);pick(false,true)}},100);
  }
  function pick(correct,timeout){
    clearInterval(timer);
    if(correct){combo++;score+=100+50*combo}
    else{combo=0;if(!timeout)score=Math.max(0,score-40)}
    qi++;render();
  }
  onKey(e=>{if(/^[1-3]$/.test(e.key)){const b=opts.querySelectorAll('.game-btn')[Number(e.key)-1];if(b)b.click()}});
  render();
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
