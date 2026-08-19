/* THE ARCHIVE // V1.2 TEST HELPERS */
const fs=require('fs');
const path=require('path');
const {JSDOM}=require('jsdom');

const ROOT=path.join(__dirname,'..');
const KEY='raiyan-ruby-ui-v11';
const SCRIPTS=['games.js','story-data.js','script.js','tier.js','games-alt.js','tier-loader.js','tier3d.js'];

let passed=0,failed=0;
const failures=[];

function ok(cond,msg){
  if(cond){passed++}
  else{failed++;failures.push(msg);console.log('   FAIL '+msg)}
}
function section(name){console.log('\n== '+name)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function waitFor(fn,ms,step){
  step=step||100;
  const t0=Date.now();
  while(Date.now()-t0<ms){
    if(fn())return true;
    await sleep(step);
  }
  return false;
}
function seeded(seed){
  let s=seed>>>0;
  return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296}
}
function report(){
  console.log('\n========================================');
  console.log(passed+' passed · '+failed+' failed');
  if(failures.length)console.log('Failures:\n - '+failures.join('\n - '));
  process.exit(failed?1:0);
}

function loadPage(opts){
  opts=opts||{};
  const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  const dom=new JSDOM(html,{
    runScripts:'dangerously',
    pretendToBeVisual:true,
    url:'http://localhost/',
    beforeParse(w){
      w.matchMedia=w.matchMedia||function(){return{matches:!!opts.reducedMotion,media:'',addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}};
      w.HTMLElement.prototype.scrollIntoView=function(){};
      w.HTMLElement.prototype.getBoundingClientRect=function(){return{left:0,top:0,width:56,height:56,right:56,bottom:56}};
      w.HTMLCanvasElement.prototype.getContext=function(){return null};
      if(opts.preset)w.localStorage.setItem(KEY,opts.preset);
    }
  });
  const {window}=dom;
  const bundle=SCRIPTS.map(s=>fs.readFileSync(path.join(ROOT,s),'utf8')).join('\n;\n');
  const expose='\n;\nwindow.__T={state:state,ui:ui,gameState:gameState,GAMES:GAMES,GAMES_ALT:GAMES_ALT,ALT_ORDER:ALT_ORDER,SIGNAL_FLAG_IDS:SIGNAL_FLAG_IDS,TIERS:TIERS,SIGNAL_SCENES:SIGNAL_SCENES,narrativeScenes:narrativeScenes,GATE_LINES:GATE_LINES,ACHIEVEMENTS:ACHIEVEMENTS,SIGNAL_ACHIEVEMENTS:SIGNAL_ACHIEVEMENTS,VAULT_TARGETS:VAULT_TARGETS,VAULT_CSS_CAPS:VAULT_CSS_CAPS,VAULT3D:VAULT3D,TierLoader:TierLoader};';
  window.eval(bundle+expose);
  return{window:window,doc:window.document,dom:dom};
}

module.exports={ROOT,KEY,ok,section,sleep,waitFor,seeded,report,loadPage};