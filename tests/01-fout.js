/* FOUC — head script must pre-paint tier-ready / vault-ready classes */
module.exports=async function(h){
  const {ok,section}=h;

  section('01 · FOUC tier-ready');
  {
    const {window}=h.loadPage({preset:JSON.stringify({signalUnlocked:true})});
    ok(window.document.documentElement.classList.contains('tier-ready'),'tier-ready set when signalUnlocked');
    ok(window.document.documentElement.classList.contains('vault-ready')===false,'no vault-ready without vaultUnlocked');
  }
  {
    const {window}=h.loadPage({preset:JSON.stringify({playedGames:['a','b','c','d','e','f']})});
    ok(window.document.documentElement.classList.contains('tier-ready')===false,'6 playedGames alone no longer grants tier-ready');
  }
  {
    const {window}=h.loadPage({preset:JSON.stringify({contactReached:true})});
    ok(window.document.documentElement.classList.contains('tier-ready'),'tier-ready set via contactReached');
  }
  {
    const {window}=h.loadPage({preset:JSON.stringify({vaultUnlocked:true,signalUnlocked:true})});
    ok(window.document.documentElement.classList.contains('vault-ready'),'vault-ready set when vaultUnlocked');
  }
  {
    const {window}=h.loadPage({});
    ok(window.document.documentElement.classList.contains('tier-ready')===false,'no tier-ready for fresh players');
  }
  {
    const {window}=h.loadPage({preset:'not json{'});
    ok(window.document.documentElement.classList.contains('tier-ready')===false,'corrupt storage never throws');
  }
};