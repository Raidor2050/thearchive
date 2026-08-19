/* Tier system — guards, labels, latches, transitions */
module.exports=async function(h){
  const {ok,section,waitFor,sleep}=h;
  const {window}=h.loadPage({});
  const w=window,doc=w.document;

  section('03a · guards');
  w.setTier('signal');
  ok(w.__T.state.tier==='archive','signal blocked while locked');
  w.setTier('vault');
  ok(w.__T.state.tier==='archive','vault blocked while locked');
  w.setTier('bogus');
  ok(w.__T.state.tier==='archive','bogus tier ignored');
  ok(doc.getElementById('tierBtn').hidden===true,'tierBtn hidden while locked');

  section('03b · unlock + labels');
  w.markGamePlayed('leadSort');w.markGamePlayed('emailBuild');
  w.markGamePlayed('partnerCall');w.markGamePlayed('onboardPack');
  w.markGamePlayed('closeDeal');w.markGamePlayed('autoFlow');
  const btn=doc.getElementById('tierBtn');
  ok(btn.hidden===true,'tierBtn still hidden at 6/6 (needs contact)');
  ok(w.__T.state.signalUnlocked===false,'signalUnlocked false at 6/6');
  w.openContact();
  ok(btn.hidden===false,'tierBtn shown after contact popup');
  ok(w.__T.state.signalUnlocked===true,'signalUnlocked latched at contact');
  ok(btn.textContent==='SIGNAL · 0/4','label SIGNAL · 0/4');
  ok(btn.classList.contains('pulse')===false,'no pulse until vault');
  w.closeModal();
  w.setTier('signal');
  ok(w.__T.state.tier==='signal','signal enter allowed');
  ok(doc.body.getAttribute('data-tier')==='signal','body data-tier signal');
  ok(w.__T.state.signalStarted===true,'signalStarted latched');
  ok(w.current().id==='sig1','signal story at sig1');

  section('03c · game-open block');
  w.startGame('altRouteRelay');
  w.setTier('archive');
  ok(w.__T.state.tier==='signal','tier switch blocked while game open');
  w.skipGame();w.closeGamePanel();

  section('03d · vault ladder');
  w.setTier('vault');
  ok(w.__T.state.tier==='signal','vault blocked (vaultUnlocked false)');
  w.markSignalGamePlayed('altRouteRelay');
  ok(w.__T.state.signalFlags.altRouteRelay===true,'flag set');
  w.markSignalGamePlayed('altCableTriage');
  w.markSignalGamePlayed('altSignalChain');
  w.markSignalGamePlayed('altAsyncBatch');
  ok(btn.textContent==='ARCHIVE','signal tier button reads ARCHIVE');
  ok(btn.classList.contains('pulse')===false,'no pulse before vault granted');
  ok(w.__T.state.signalAchievements.length===5,'all 5 signal achievements');
  w.latchSignalFinal();
  ok(w.__T.state.signalComplete===true,'signalComplete latched');
  ok(w.__T.state.vaultUnlocked===true,'vaultUnlocked granted');
  ok(btn.textContent==='VAULT · READY','label VAULT · READY after latch');
  ok(btn.classList.contains('pulse'),'pulse when vault ready');
  ok(doc.documentElement.classList.contains('vault-ready'),'vault-ready class');
  w.setTier('vault');
  ok(w.__T.state.tier==='vault','vault enter allowed');
  ok(doc.body.classList.contains('vault-active'),'vault-active body class');
  ok(doc.getElementById('experience').classList.contains('hidden'),'experience hidden in vault');
  ok(doc.getElementById('vaultRoot').classList.contains('hidden')===false,'vaultRoot shown');
  ok(w.__T.state.vaultVisited===true,'vaultVisited recorded');

  section('03e · vault -> archive');
  w.setTier('archive');
  ok(w.__T.state.tier==='archive','exit to archive');
  ok(doc.body.classList.contains('vault-active')===false,'vault-active removed');
  ok(doc.getElementById('vaultRoot').classList.contains('hidden'),'vaultRoot hidden');
  ok(doc.getElementById('experience').classList.contains('hidden')===false,'experience restored');
  ok(btn.textContent==='VAULT · READY','label back to VAULT · READY (never revoked)');

  section('03f · hotkeys');
  w.start();
  w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'s',bubbles:true}));
  await sleep(800);
  ok(w.__T.state.tier==='signal','S hotkey enters signal');
  w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'v',bubbles:true}));
  await sleep(800);
  ok(w.__T.state.tier==='vault','V hotkey enters vault');
  w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'v',bubbles:true}));
  await sleep(800);
  ok(w.__T.state.tier==='archive','V hotkey exits vault');

  section('03g · latches survive home reset');
  w.setTier('signal');
  w.openHome();
  ok(w.__T.state.signalUnlocked===true,'signalUnlocked survives openHome');
  ok(w.__T.state.vaultUnlocked===true,'vaultUnlocked survives openHome');
  ok(w.__T.state.signalComplete===true,'signalComplete survives openHome');
  ok(w.__T.state.signalFlags.altRouteRelay===undefined,'signalFlags reset by openHome');
  ok(w.__T.state.tier==='archive','tier back to archive after home');
};