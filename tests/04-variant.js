/* Variant — parallel story positions, archive parity, signal data integrity */
module.exports=async function(h){
  const {ok,section}=h;
  const {window}=h.loadPage({});
  const w=window,doc=w.document;

  section('04a · signal data integrity');
  ok(w.__T.SIGNAL_SCENES.length===29,'29 signal scenes');
const ids=new Set();
  let badNext=0,games=[];
  w.__T.SIGNAL_SCENES.forEach((s,i)=>{
    ids.add(s.id);
    if(!s.text)badNext++;
    if(!s.choices&&i<w.__T.SIGNAL_SCENES.length-1&&!s.next)badNext++;
    if(s.game)games.push(s.game);
    if(s.choices)for(const c of s.choices)if(!c.next)badNext++;
  });
  ok(badNext===0,'all scenes have text+next and choices have next');
  ok(ids.size===w.__T.SIGNAL_SCENES.length,'scene ids unique');
  ok(games.filter(g=>['altRouteRelay','altCableTriage','altSignalChain','altAsyncBatch'].includes(g)).length===4,'4 signal games placed');
  ok(w.__T.ALT_ORDER.length===4,'ALT_ORDER has 4 ids');
  const secrets=w.__T.SIGNAL_SCENES.filter(s=>Number.isInteger(s.secret)).map(s=>s.secret);
  ok(secrets.every(n=>n>=100),'signal secrets numbered 100+');
  ok(w.remainingSignalGames().length===4,'remainingSignalGames full at start');

  section('04b · dynamic gate');
  const gate=w.__T.SIGNAL_SCENES.find(s=>s.id==='sigGate');
  ok(typeof gate.text==='function'&&gate.text().length>0,'gate text dynamic');
  ok(gate.game()==='altRouteRelay','gate points at first remaining game');
  ok(gate.next()==='sigGate','gate loops while games remain');
  w.__T.state.signalFlags.altRouteRelay=true;
  ok(gate.game()==='altCableTriage','gate advances through games');
  w.__T.state.signalFlags.altCableTriage=true;w.__T.state.signalFlags.altSignalChain=true;w.__T.state.signalFlags.altAsyncBatch=true;
  ok(gate.game()===null,'gate done when all played');
  ok(gate.next()==='signalFinal','gate opens final after all games');

  section('04c · parallel positions');
  w.markGamePlayed('leadSort');w.markGamePlayed('emailBuild');
  w.markGamePlayed('partnerCall');w.markGamePlayed('onboardPack');
  w.markGamePlayed('closeDeal');w.markGamePlayed('autoFlow');
  w.openContact();w.closeModal();
  w.setTier('signal');
  ok(w.current().id==='sig1','signal current at sig1');
  w.goto('sig5');
  ok(w.__T.state.signalIndex===w.__T.SIGNAL_SCENES.findIndex(s=>s.id==='sig5'),'signalIndex follows signal story');
  ok(w.__T.state.index===0,'archive index untouched');
  w.finishTyping();
  w.back();
  ok(w.current().id==='sig1','signal back() uses signalHistory');
  const sig4=w.__T.SIGNAL_SCENES.find(s=>s.id==='sig4');
  w.goto('sig4');
  w.finishTyping();
  w.choose(1,sig4.choices[1].next);
  ok(w.__T.state.tier==='archive','__archive__ choice returns to archive');
  ok(w.__T.state.signalIndex===w.__T.SIGNAL_SCENES.findIndex(s=>s.id==='sig4'),'signal position preserved');
  w.goto('beginning1');
  ok(w.current().id==='beginning1','archive story reachable after return');

  section('04d · archive parity');
  ok(w.__T.narrativeScenes.length===99,'archive scenes unchanged (99)');
  const order=['leadSort','emailBuild','partnerCall','onboardPack','closeDeal','autoFlow'];
  ok(order.every(id=>w.__T.GAMES[id]),'six archive games intact');
  ok(w.__T.GATE_LINES.leadSort.length>0,'gate lines intact');
  const iIntro3=w.__T.narrativeScenes.findIndex(s=>s.id==='intro3');
  w.__T.state.index=iIntro3;w.renderScene();w.finishTyping();
  ok(doc.getElementById('dialogueText').textContent==="I keep Raiyan's better stories safe.",'archive scene intro3 text identical');
  const iHub2=w.__T.narrativeScenes.findIndex(s=>s.id==='hub2');
  w.__T.state.index=iHub2;w.renderScene();w.finishTyping();
  ok(doc.getElementById('dialogueText').textContent==='One explains where the work began.','archive scene hub2 text identical');

  section('04e · signal secrets isolate');
  w.setTier('signal');
  w.goto('sig11');w.finishTyping();
  ok(w.__T.state.signalFound.includes(101),'signal note 101 to signalFound');
  ok(w.__T.state.found.includes(101)===false,'not in archive found');
  ok(w.__T.state.signalXp===1,'signal XP credited');
  ok(w.__T.state.xp===1,'archive XP untouched by signal notes (1 from intro3)');

  section('04f · tier markers');
  ok(doc.getElementById('microLine').textContent==='SIGNAL // CHECKPOINT','chapter renders signal chapter');
  ok(doc.getElementById('sceneMark').textContent==='[19]','signal scene mark is 19-based index');
};