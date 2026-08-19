/* Vault — targets data, fallback ladder, hooks, room wiring */
module.exports=async function(h){
  const {ok,section}=h;
  const {window}=h.loadPage({});
  const w=window,doc=w.document;

  section('06a · target data integrity');
  ok(Array.isArray(w.__T.VAULT_TARGETS)&&w.__T.VAULT_TARGETS.length===38,'38 targets (29 chapters + 6 rooms + 3 notes)');
  const chapters=w.__T.VAULT_TARGETS.filter(t=>t.kind==='chapter');
  const rooms=w.__T.VAULT_TARGETS.filter(t=>t.kind==='room');
  const notes=w.__T.VAULT_TARGETS.filter(t=>t.kind==='note');
  ok(chapters.length===29,'29 chapters');
  ok(rooms.length===6,'6 rooms');
  ok(notes.length===3,'3 notes');
  const ids=w.__T.VAULT_TARGETS.map(t=>t.id);
  ok(new Set(ids).size===ids.length,'target ids unique');
  ok(chapters.every((t,i)=>t.index===i),'chapter indices sequential');
  ok(chapters.some(t=>t.label.indexOf('SIGNAL')>=0),'signal chapter present');
  ok(Array.isArray(w.__T.VAULT_CSS_CAPS)&&w.__T.VAULT_CSS_CAPS.length===35,'css caps = 35');

  section('06b · engine idle without three');
  ok(w.__T.VAULT3D.getMode()==='idle','mode idle before boot');
  w.__T.VAULT3D.init();
  ok(w.__T.VAULT3D.getMode()==='idle','init safe without THREE');
  ok(w.__T.VAULT3D.isActive()===false,'not active');
  ok(w.__T.VAULT3D.getNotes().length===0,'no notes taken');

  section('06c · css3d fallback ladder');
  for(const g of ['leadSort','emailBuild','partnerCall','onboardPack','closeDeal','autoFlow'])w.markGamePlayed(g);
  for(const f of ['altRouteRelay','altCableTriage','altSignalChain','altAsyncBatch'])w.markSignalGamePlayed(f);
  w.latchSignalFinal();
  w.setTier('vault');
  ok(w.__T.VAULT3D.getMode()==='css3d','css3d fallback engaged (no WebGL)');
  ok(!!doc.querySelector('.vault-css'),'css3d stage built');
  ok(doc.querySelectorAll('.vault-css-panel').length===35,'35 css3d panels');
  ok(!!doc.querySelector('.vault-exit'),'exit button built');
  ok(!!doc.querySelector('.vault-title'),'title built');
  ok(w.__T.state.tier==='vault','tier is vault');
  ok(w.__T.VAULT3D.isActive()===true,'vault active after enter');

  section('06d · hooks + room wiring');
  const log=[];
  w.__T.VAULT3D.hooks.onRoom=(id)=>log.push('room:'+id);
  w.__T.VAULT3D.hooks.onChapter=(id)=>log.push('chapter:'+id);
  w.__T.VAULT3D.hooks.onNote=(t)=>log.push('note:'+t);
  w.__T.VAULT3D.openTarget('room-profile');
  ok(doc.getElementById('modal').classList.contains('hidden')===false,'profile modal opened from vault room');
  ok(doc.getElementById('modalContent').textContent.indexOf('RAIYAN KABIR')>=0,'profile content in modal');
  ok(log.indexOf('room:room-profile')>=0,'onRoom hook fired');
  w.closeModal();
  w.__T.VAULT3D.openTarget('j1');
  ok(doc.getElementById('modal').classList.contains('hidden')===false,'chapter modal opened');
  ok(doc.getElementById('modalContent').textContent.indexOf('JOURNEY // 01')>=0,'chapter content shown');
  ok(log.indexOf('chapter:j1')>=0,'onChapter hook fired');
  w.closeModal();
  w.__T.VAULT3D.openTarget('nonexistent');
  ok(doc.getElementById('modal').classList.contains('hidden'),'unknown target no-op');

  section('06e · exit');
  w.__T.VAULT3D.exit();
  ok(w.__T.VAULT3D.isActive()===false,'inactive after exit');
  w.setTier('archive');
  ok(w.__T.state.tier==='archive','exit via setTier');
};