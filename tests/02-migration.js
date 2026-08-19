/* Migration — v1 -> v2 in place, sanitizers, clamps */
module.exports=async function(h){
  const {ok,section}=h;

  section('02a · v1 user with 6 games -> signalUnlocked backfilled');
  {
    const {window}=h.loadPage({preset:JSON.stringify({started:true,index:4,playedGames:['leadSort','emailBuild','partnerCall','onboardPack','closeDeal','autoFlow'],achievements:['leadSort']})});
    ok(window.__T.state.schemaVersion===2,'schemaVersion bumped to 2');
    ok(window.__T.state.signalUnlocked===true,'signalUnlocked backfilled');
    ok(window.__T.state.contactReached===true,'contactReached backfilled at 6/6');
    ok(window.__T.state.tier==='archive','tier defaults archive');
    ok(window.__T.state.index===4,'archive index preserved');
    ok(window.__T.state.achievements.length===1,'achievements preserved');
    ok(window.__T.state.signalFlags&&Object.keys(window.__T.state.signalFlags).length===0,'signalFlags sanitized empty');
  }
  {
    const {window}=h.loadPage({preset:JSON.stringify({playedGames:['leadSort']})});
    ok(window.__T.state.signalUnlocked===false,'1/6 games -> still locked');
    ok(window.__T.state.contactReached===false,'1/6 games -> contact not backfilled');
  }
  {
    const {window}=h.loadPage({preset:JSON.stringify({schemaVersion:2,signalUnlocked:true})});
    ok(window.__T.state.contactReached===true,'v2 save with signalUnlocked -> contactReached backfilled');
  }
  section('02b · v2 garbage sanitization');
  {
    const {window}=h.loadPage({preset:JSON.stringify({schemaVersion:2,signalFlags:{altRouteRelay:true,x:1,altAsyncBatch:'yes'},signalIndex:-5,history:'nope',signalAchievements:'nope',tier:'bogus',vaultQuality:'high',signalHistory:null})});
    ok(window.__T.state.signalFlags.altRouteRelay===true,'valid flag kept');
    ok(window.__T.state.signalFlags.x===undefined,'unknown flag dropped');
    ok(window.__T.state.signalFlags.altAsyncBatch===undefined,'non-boolean flag dropped');
    ok(window.__T.state.signalIndex===0,'signalIndex clamped');
    ok(window.__T.state.tier==='archive','tier clamped to archive');
    ok(Array.isArray(window.__T.state.signalHistory),'signalHistory array');
    ok(Array.isArray(window.__T.state.signalAchievements),'signalAchievements array');
    ok(window.__T.state.vaultQuality==='auto','vaultQuality clamped to auto');
  }
  section('02c · out-of-range signalIndex');
  {
    const {window}=h.loadPage({preset:JSON.stringify({schemaVersion:2,signalIndex:999})});
    ok(window.__T.state.signalIndex===0,'signalIndex reset when beyond scenes');
  }
  section('02d · pure migrateFromV11');
  {
    const {window}=h.loadPage({});
    const m=window.migrateFromV11({playedGames:['a','b','c','d','e','f']},1);
    ok(m.signalUnlocked===true,'pure fn backfills v1');
    ok(m.contactReached===true,'pure fn backfills contactReached');
    ok(m.schemaVersion===2,'pure fn bumps version');
    const m2=window.migrateFromV11({schemaVersion:2,playedGames:[]},2);
    ok(m2.schemaVersion===2,'v2 stays v2');
    const m3=window.migrateFromV11({schemaVersion:2,signalFlags:{altCableTriage:1}},2);
    ok(m3.signalFlags.altCableTriage===undefined,'pure fn coerces non-boolean flag');
  }
};