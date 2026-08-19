/* THE ARCHIVE // V1.2 TIER LOADER — vault engine ladder */
/* reduced-motion poster -> WebGL detect -> module(https) -> vendored UMD -> css3d */

(function(){
  let booted=false;
  function reducedMotion(){try{return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
  function supportsGL(){
    try{
      const c=document.createElement('canvas');
      return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')));
    }catch(e){return false}
  }
  function root(){return document.getElementById('vaultRoot')}
  function shell(){
    const r=root();if(!r)return null;
    r.innerHTML='';
    const ov=document.createElement('div');ov.className='vault-overlay';
    ov.innerHTML='<div class="vault-title">THE VAULT</div><div class="vault-hint">DRAG TO LOOK · SCROLL TO MOVE · TAP PANELS TO OPEN</div><button class="vault-exit" type="button">EXIT · ARCHIVE</button><div class="vault-counter">ARCHIVE // VAULT</div>';
    ov.querySelector('.vault-exit').addEventListener('click',()=>{if(typeof setTier==='function')setTier('archive',true)});
    r.appendChild(ov);
    return r;
  }
  function showPoster(){
    const r=shell();if(!r)return;
    const p=document.createElement('div');p.className='vault-poster';
    p.innerHTML='<div class="vault-poster-inner"><div class="vault-poster-title">THE VAULT</div><div class="vault-poster-sub">29 CHAPTERS · 6 ROOMS · 1 KEEPER</div><div class="vault-poster-hint">THE VAULT SLEEPS · MOTION REDUCED</div></div>';
    r.insertBefore(p,r.firstChild);
    if(typeof VAULT3D!=='undefined'&&VAULT3D&&typeof VAULT3D.setMode==='function')VAULT3D.setMode('poster');
  }
  function showCss3d(){
    const r=shell();if(!r)return;
    const wrap=document.createElement('div');wrap.className='vault-css';
    const stars=document.createElement('div');stars.className='vault-css-stars';
    const stage=document.createElement('div');stage.className='vault-css-stage';
    wrap.appendChild(stars);wrap.appendChild(stage);
    r.insertBefore(wrap,r.firstChild);
    const caps=window.VAULT_CSS_CAPS||[];
    let rotX=-8,rotY=0,drag=false,lx=0,ly=0;
    caps.forEach((cap,i)=>{
      const p=document.createElement('div');p.className='vault-css-panel';
      p.innerHTML='<div class="vault-css-num">['+String(cap.index+1).padStart(2,'0')+']</div><div class="vault-css-label">'+cap.label+'</div><div class="vault-css-sub">'+cap.sub+'</div>';
      const a=(i/caps.length)*Math.PI*2;
      p.style.transform='rotateY('+a.toFixed(3)+'rad) translateZ('+(120+cap.radius*18).toFixed(0)+'px)';
      p.addEventListener('click',()=>{if(typeof VAULT3D!=='undefined'&&VAULT3D&&typeof VAULT3D.openTarget==='function')VAULT3D.openTarget(cap.id)});
      stage.appendChild(p);
    });
    function apply(){stage.style.transform='rotateX('+rotX+'deg) rotateY('+rotY+'deg)'}
    apply();
    wrap.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;stage.classList.add('drag')});
    window.addEventListener('pointermove',e=>{if(!drag)return;rotY+=(e.clientX-lx)*.4;rotX+=(e.clientY-ly)*.4;lx=e.clientX;ly=e.clientY;apply()});
    window.addEventListener('pointerup',()=>{drag=false;stage.classList.remove('drag')});
    if(typeof VAULT3D!=='undefined'&&VAULT3D&&typeof VAULT3D.setMode==='function')VAULT3D.setMode('css3d');
  }
  function loadScript(src,ok,err){
    const s=document.createElement('script');s.src=src;s.async=false;
    let done=false;
    const fin=f=>()=>{if(done)return;done=true;clearTimeout(t);f()};
    s.onload=fin(ok);s.onerror=fin(err);
    const t=setTimeout(fin(err),15000);
    document.head.appendChild(s);
  }
  function engineReady(){
    if(typeof VAULT3D==='undefined'||!VAULT3D||typeof VAULT3D.init!=='function'){showCss3d();return}
    try{VAULT3D.init()}catch(e){showCss3d();return}
    if(typeof state!=='undefined'&&state&&state.tier==='vault'){try{VAULT3D.enter()}catch(e){}}
  }
  function loadUmd(){
    loadScript('assets/vendor/three@0.160.1.min.js',engineReady,function(){
      loadScript('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js',engineReady,showCss3d);
    });
  }
  window.__TIER_ENGINE_READY=engineReady;
  window.__TIER_LOAD_UMD=loadUmd;
  function loadModule(){
    const im=document.createElement('script');
    im.type='importmap';
    im.textContent=JSON.stringify({imports:{three:'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.min.js'}});
    document.head.appendChild(im);
    const m=document.createElement('script');
    m.type='module';
    m.textContent="import * as THREE from 'three';window.THREE=THREE;window.__TIER_ENGINE='module';window.__TIER_ENGINE_READY()";
    m.onerror=function(){if(!window.__TIER_ENGINE)window.__TIER_LOAD_UMD()};
    document.head.appendChild(m);
  }
  function boot(){
    if(booted)return;booted=true;
    if(reducedMotion()){showPoster();return}
    if(!supportsGL()){showCss3d();return}
    if(location.protocol==='http:'||location.protocol==='https:')loadModule();
    else loadUmd();
  }
  function ensure(){if(typeof state!=='undefined'&&state&&state.tier==='vault'&&!booted)boot()}
  window.TierLoader={boot:boot,ensure:ensure,ready:function(){return booted}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);
  else setTimeout(ensure,0);
})();