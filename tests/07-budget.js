/* Budget — every shipped file stays under its cap (bytes) */
module.exports=async function(h){
  const {ok,section}=h;
  const fs=require('fs');
  const path=require('path');
  const ROOT=h.ROOT;
  const limits={
    'index.html':25000,'styles.css':60000,'games.css':20000,'games-alt.css':15000,
    'script.js':40000,'story-data.js':30000,'tier.js':20000,
    'games.js':90000,'games-alt.js':80000,
    'tier-loader.js':20000,'tier3d.js':60000,'tier3d.css':15000,
    'assets/vendor/three@0.160.1.min.js':750000
  };
  section('07 · budget');
  for(const f of Object.keys(limits)){
    const p=path.join(ROOT,f);
    const size=fs.existsSync(p)?fs.statSync(p).size:-1;
    ok(size>=0&&size<=limits[f],f+' '+size+' <= '+limits[f]+(size<0?' (MISSING)':''));
  }
  const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  ok(html.indexOf('V1.2 // THE ARCHIVE')>=0,'title bumped to V1.2');
  const js=fs.readFileSync(path.join(ROOT,'script.js'),'utf8');
  ok(js.indexOf('raiyan-ruby-ui-v11')>=0,'storage key unchanged');
  ok(js.indexOf('schemaVersion')>=0,'schemaVersion wired');
};