/* THE ARCHIVE // V1.2 TIER SYSTEM */
/* ARCHIVE -> SIGNAL -> VAULT switching, button, transitions, signal game plumbing. */

function reducedMotion(){try{return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}

function syncTierBtn(){
  const b=ui.tierBtn;if(!b)return;
  const ready=!!state.signalUnlocked;
  const vaultReady=!!state.vaultUnlocked;
  const n=SIGNAL_FLAG_IDS.filter(id=>state.signalFlags[id]).length;
  let label='',show=false,pulse=false;
  if(state.tier==='archive'){
    if(ready){
      show=true;
      if(vaultReady){label='VAULT · READY';pulse=true}
      else label='SIGNAL · '+n+'/4';
    }
  }else if(state.tier==='signal'){
    show=true;
    if(vaultReady){label='VAULT · READY';pulse=true}
    else label='ARCHIVE';
  }else{
    show=true;label='ARCHIVE';
  }
  if(show){b.hidden=false;b.classList.toggle('pulse',pulse);b.textContent=label}
  else b.hidden=true;
}

function setTier(t,instant){
  const prev=state.tier;
  if(t===prev)return;
  if(!TIERS.includes(t))t='archive';
  if(t==='signal'&&!state.signalUnlocked)return;
  if(t==='vault'&&!state.vaultUnlocked)return;
  if(gameState.open)return;
  state.tier=t;
  if(t==='signal'&&!state.signalStarted)state.signalStarted=true;
  document.body.setAttribute('data-tier',t);
  if(t==='vault'){
    if(ui.modal&&!ui.modal.classList.contains('hidden'))closeModal();
    document.body.classList.add('vault-active');
    ui.experience.classList.add('hidden');
    const vr=g$('vaultRoot');if(vr)vr.classList.remove('hidden');
    if(typeof TierLoader!=='undefined'&&TierLoader)try{TierLoader.boot()}catch(e){}
    if(typeof VAULT3D!=='undefined'&&VAULT3D&&typeof VAULT3D.enter==='function')try{VAULT3D.enter()}catch(e){}
    if(!state.vaultVisited){state.vaultVisited=true;toast('THE VAULT · WELCOME, KEEPER');choiceSound()}
  }else{
    if(prev==='vault'){
      if(typeof VAULT3D!=='undefined'&&VAULT3D&&typeof VAULT3D.exit==='function')try{VAULT3D.exit()}catch(e){}
      const vr=g$('vaultRoot');if(vr)vr.classList.add('hidden');
      document.body.classList.remove('vault-active');
      ui.experience.classList.remove('hidden');
    }
    if(state.started){closeModal();autoSeq=0;clearInterval(state.timer);renderScene()}
  }
  document.documentElement.classList.add('tier-ready');
  save();
  syncTierBtn();
}

function transitionTier(next){
  if(reducedMotion()){setTier(next);return}
  const veil=g$('tierVeil');
  const r=ui.tierBtn.getBoundingClientRect();
  const cx=Math.round(r.left+r.width/2),cy=Math.round(r.top+r.height/2);
  veil.style.setProperty('--tier-x',cx+'px');
  veil.style.setProperty('--tier-y',cy+'px');
  veil.style.setProperty('--tier-veil-bg',next==='vault'?'#ffffff':(next==='signal'?'#050a1a':'#000000'));
  veil.classList.remove('veil-out');
  veil.classList.add('veil-in');
  let applied=false;
  const apply=()=>{
    if(applied)return;applied=true;
    veil.removeEventListener('animationend',onEnd);
    setTier(next);
    veil.classList.remove('veil-in');
    void veil.offsetWidth;
    veil.classList.add('veil-out');
    veil.addEventListener('animationend',function h2(){
      veil.removeEventListener('animationend',h2);
      veil.classList.remove('veil-out');
    },{once:true});
  };
  const onEnd=()=>apply();
  veil.addEventListener('animationend',onEnd);
  setTimeout(apply,650);
}

function startSignalGame(id){
  if(gameState.open)return;
  const g=GAMES_ALT[id];if(!g)return;
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
  const done=(score)=>{stopTips();if(score!=null)markSignalGamePlayed(id);showResults(score)};
  g.build(body,done);
  const card=g$('dialogueCard');
  card.classList.add('game-mode');
  const nav=g$('iconNav');if(nav)nav.classList.add('nav-side');
  requestAnimationFrame(()=>requestAnimationFrame(()=>panel.classList.add('open')));
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function markSignalGamePlayed(id){
  if(!id||!SIGNAL_FLAG_IDS.includes(id))return;
  if(state.signalFlags[id])return;
  state.signalFlags[id]=true;
  state.signalXp=Math.min(12,state.signalXp+2);
  unlockSignalAchievement(id);
  save();
  if(SIGNAL_FLAG_IDS.every(k=>state.signalFlags[k]))unlockSignalAchievement('altAllGames');
  syncTierBtn();
}

function unlockSignalAchievement(id){
  if(!SIGNAL_ACHIEVEMENTS[id])return;
  if(!state.signalAchievements)state.signalAchievements=[];
  if(state.signalAchievements.includes(id))return;
  state.signalAchievements.push(id);
  state.signalAchievementsUnlocked=true;
  save();
  toast('SIGNAL ACHIEVEMENT · '+SIGNAL_ACHIEVEMENTS[id].name);
  choiceSound();
}

function latchSignalFinal(){
  if(!state.signalReachedFinal){state.signalReachedFinal=true;save()}
  if(!state.signalComplete&&SIGNAL_FLAG_IDS.every(k=>state.signalFlags[k])){
    state.signalComplete=true;
    state.vaultUnlocked=true;
    document.documentElement.classList.add('vault-ready');
    save();
    syncTierBtn();
    toast('VAULT ACCESS GRANTED · THE VAULT IS OPEN');
    choiceSound();
    try{sfx(220,.6,'triangle',.04,440)}catch(e){}
  }
}

window.addEventListener('keydown',e=>{
  if(isGameBlocking())return;
  if(ui.modal&&!ui.modal.classList.contains('hidden'))return;
  if(!state.started)return;
  const k=e.key.toLowerCase();
  if(k==='s'&&state.signalUnlocked){e.preventDefault();transitionTier(state.tier==='signal'?'archive':'signal');return}
  if(k==='v'&&state.vaultUnlocked){e.preventDefault();transitionTier(state.tier==='vault'?'archive':'vault')}
});

(function initTier(){
  const b=ui.tierBtn;
  b.addEventListener('click',()=>{
    const t=state.tier;
    if(t==='archive')transitionTier(state.vaultUnlocked?'vault':'signal');
    else if(t==='signal')transitionTier(state.vaultUnlocked?'vault':'archive');
    else transitionTier('archive');
  });
  if(state.tier==='vault'&&state.vaultUnlocked){
    document.body.setAttribute('data-tier','vault');
    document.body.classList.add('vault-active');
    ui.experience.classList.add('hidden');
    const vr=g$('vaultRoot');if(vr)vr.classList.remove('hidden');
    if(typeof TierLoader!=='undefined'&&TierLoader)try{TierLoader.boot()}catch(e){}
  }else{
    state.tier='archive';
    document.body.setAttribute('data-tier','archive');
  }
  syncTierBtn();
})();