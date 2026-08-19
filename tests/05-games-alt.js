/* Signal games — determinism under seeded rng, scoring, flags */
module.exports=async function(h){
  const {ok,section,seeded,sleep,waitFor}=h;
  const origRandom=Math.random;
  function seedFor(){Math.random=seeded(1337)}
  function restore(){Math.random=origRandom}

  section('05a · altRouteRelay — full run');
  {
    const {window}=h.loadPage({});
    const w=window,doc=w.document;
    seedFor();
    try{
      w.startGame('altRouteRelay');
      ok(w.__T.gameState.open===true,'relay opens');
      ok(w.__T.gameState.id==='altRouteRelay','relay id');
      ok(w.__T.gameState.alt&&w.__T.gameState.alt.path.length>=2,'BFS path found (len '+w.__T.gameState.alt.path.length+')');
      ok(doc.querySelectorAll('.sr-cell').length===36,'6x6 grid rendered');
      ok(doc.querySelectorAll('.sr-relay').length>=2,'relay candidates rendered');
      let guard=0;
      while(w.__T.gameState.alt.phase!=='done'&&guard++<60){
        const next=w.__T.gameState.alt.path[w.__T.gameState.alt.hop+1];
        const btn=[...doc.querySelectorAll('.sr-relay')].find(b=>b.textContent==='R'+next[0]+' · C'+next[1]);
        if(!btn)break;
        btn.click();
      }
      ok(w.__T.gameState.alt.phase==='done','relay completed');
      await sleep(1000);
      ok(w.getBoard('altRouteRelay').length===1,'relay score saved to board');
      ok(w.__T.state.signalFlags.altRouteRelay===true,'relay flag set');
      ok(w.__T.state.signalAchievements.includes('altRouteRelay'),'relay achievement');
    }finally{restore()}
  }
  section('05a2 · relay wrong tap');
  {
    const {window}=h.loadPage({});
    const w=window,doc=w.document;
    seedFor();
    try{
      w.startGame('altRouteRelay');
      const correct=w.__T.gameState.alt.path[1];
      const ck=correct[0]*6+correct[1];
      const decoy=w.__T.gameState.alt.opts.find(k=>k!==ck);
      ok(decoy!=null,'decoy available');
      if(decoy!=null){
        const r=Math.floor(decoy/6),c=decoy%6;
        [...doc.querySelectorAll('.sr-relay')].find(b=>b.textContent==='R'+r+' · C'+c).click();
        ok(w.__T.gameState.alt.lives===2,'wrong relay costs a life');
        ok(w.__T.gameState.alt.hop===0,'hop stays on same relay');
      }
      w.skipGame();w.closeGamePanel();
    }finally{restore()}
  }

  section('05b · altCableTriage — full run');
  {
    const {window}=h.loadPage({});
    const w=window,doc=w.document;
    seedFor();
    try{
      w.startGame('altCableTriage');
      ok(doc.querySelectorAll('.ct-rule').length===6,'6 rules rendered');
      ok(doc.querySelectorAll('.ct-cable').length===4,'4 cables rendered');
      for(let i=0;i<6;i++){
        ok(w.__T.gameState.alt&&w.__T.gameState.alt.phase==='round','cable round '+(i+1));
        const ans=w.__T.gameState.alt.answer;
        doc.querySelector('.ct-cable[data-c="'+ans+'"]').click();
        await sleep(450);
      }
      await waitFor(()=>w.__T.gameState.alt.phase==='done',3000);
      ok(w.__T.gameState.alt.phase==='done','triage completed');
      await sleep(1000);
      ok(w.getBoard('altCableTriage').length===1,'triage score saved to board');
      ok(w.__T.state.signalFlags.altCableTriage===true,'triage flag set');
    }finally{restore()}
  }
  section('05b2 · triage wrong cut');
  {
    const {window}=h.loadPage({});
    const w=window,doc=w.document;
    seedFor();
    try{
      w.startGame('altCableTriage');
      const wrong=Array.from(doc.querySelectorAll('.ct-cable')).find(b=>b.dataset.c!==w.__T.gameState.alt.answer);
      wrong.click();
      ok(w.__T.gameState.alt.lives===2,'wrong cut costs a life');
      w.skipGame();w.closeGamePanel();
    }finally{restore()}
  }

  section('05c · altSignalChain — full run (3 rounds)');
  {
    const {window}=h.loadPage({});
    const w=window,doc=w.document;
    seedFor();
    try{
      w.startGame('altSignalChain');
      ok(doc.querySelectorAll('.sc-node').length===6,'6 chain nodes');
      ok(w.__T.gameState.alt.seq.length===3,'round 1 chain length 3');
      for(let r=0;r<3;r++){
        const tapped=await waitFor(()=>w.__T.gameState.alt&&w.__T.gameState.alt.phase==='tap'&&w.__T.gameState.alt.round===r,12000);
        ok(tapped,'round '+(r+1)+' reaches tap phase');
        if(!tapped)break;
        const seq=w.__T.gameState.alt.seq.slice();
        for(let i=0;i<seq.length;i++){
          doc.querySelector('.sc-node[data-id="'+seq[i]+'"]').click();
        }
      }
      await waitFor(()=>w.__T.gameState.alt.phase==='done',5000);
      ok(w.__T.gameState.alt.phase==='done','chain completed');
      await sleep(1000);
      ok(w.getBoard('altSignalChain').length===1,'chain score saved to board');
      ok(w.__T.state.signalFlags.altSignalChain===true,'chain flag set');
    }finally{restore()}
  }
  section('05c2 · chain wrong link');
  {
    const {window}=h.loadPage({});
    const w=window,doc=w.document;
    seedFor();
    try{
      w.startGame('altSignalChain');
      const tapped=await waitFor(()=>w.__T.gameState.alt&&w.__T.gameState.alt.phase==='tap',10000);
      ok(tapped,'tap phase reached');
      if(tapped){
        const wrongId=['lead','email','call','close','flow','handoff'].find(id=>!w.__T.gameState.alt.seq.includes(id));
        doc.querySelector('.sc-node[data-id="'+wrongId+'"]').click();
        ok(w.__T.gameState.alt.lives===2,'broken link costs a life');
        ok(w.__T.gameState.alt.idx===0,'chain resets to start');
      }
      w.skipGame();w.closeGamePanel();
    }finally{restore()}
  }

  section('05d · altAsyncBatch — full run');
  {
    const {window}=h.loadPage({});
    const w=window,doc=w.document;
    seedFor();
    try{
      w.startGame('altAsyncBatch');
      const send=[...doc.querySelectorAll('button')].find(b=>b.textContent==='SEND');
      ok(!!send,'SEND button exists');
      const input=doc.querySelector('.ab-input');
      ok(!!input,'input exists');
      for(let i=0;i<20;i++){
        const word=w.__T.gameState.alt.word;
        ok(word&&word.length>0,'word '+(i+1)+' available: '+word);
        input.value=word;
        send.click();
      }
      await waitFor(()=>w.__T.gameState.alt.phase==='done',3000);
      ok(w.__T.gameState.alt.phase==='done','batch completed');
      await sleep(1000);
      ok(w.getBoard('altAsyncBatch').length===1,'batch score saved to board');
      ok(w.__T.state.signalFlags.altAsyncBatch===true,'batch flag set');
    }finally{restore()}
  }
  section('05d2 · batch wrong word');
  {
    const {window}=h.loadPage({});
    const w=window,doc=w.document;
    seedFor();
    try{
      w.startGame('altAsyncBatch');
      const send=[...doc.querySelectorAll('button')].find(b=>b.textContent==='SEND');
      const input=doc.querySelector('.ab-input');
      input.value='GARBAGE';
      send.click();
      ok(w.__T.gameState.alt.lives===2,'wrong word costs a life');
      w.skipGame();w.closeGamePanel();
    }finally{restore()}
  }

  section('05e · skip marks nothing');
  {
    const {window}=h.loadPage({});
    const w=window;
    seedFor();
    try{
      w.startGame('altRouteRelay');
      w.skipGame();
      ok(w.__T.state.signalFlags.altRouteRelay===undefined,'skipped game sets no flag');
      ok(w.getBoard('altRouteRelay').length===0,'skipped game records no score');
      w.closeGamePanel();
    }finally{restore()}
  }
};