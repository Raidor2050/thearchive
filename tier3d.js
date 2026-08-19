/* THE ARCHIVE // V1.2 THE VAULT — three.js engine */
/* Helix of 29 chapter panels + 6 rooms + starfield. Inspired by the periodic-table helix. */

const VAULT_TARGETS=(function(){
  const chapters=[
    ['arch-open','ARCHIVE // OPEN','The archive opens.'],['arch-index','ARCHIVE // INDEX','Two trails, one memory.'],
    ['j1','JOURNEY // 01','Research first.'],['j2','JOURNEY // 02','Context before contact.'],['j3','JOURNEY // 03','Fit before volume.'],['j4','JOURNEY // 04','Conversations, not pitches.'],['j5','JOURNEY // 05','Consistency scales.'],['j6','JOURNEY // 06','Visible pipelines.'],['j7','JOURNEY // 07','A team of five.'],['jc','JOURNEY // CHECKPOINT','Process builds judgment.'],
    ['p1','PLAYBOOK // 01','Define the partner.'],['p2','PLAYBOOK // 02','Relevance earns replies.'],['p3','PLAYBOOK // 03','Qualify together.'],['p4','PLAYBOOK // 04','Onboarding is a handoff.'],['p5','PLAYBOOK // 05','Keep it warm.'],['p6','PLAYBOOK // 06','The close is a start.'],['p7','PLAYBOOK // 07','Automate the busywork.'],['pc','PLAYBOOK // CHECKPOINT','Source. Connect. Qualify. Activate. Learn.'],
    ['f1','FIELD NOTES // 01','2,000 leads.'],['f2','FIELD NOTES // 02','211 replies.'],['f3','FIELD NOTES // 03','100 prospects.'],['f4','FIELD NOTES // 04','80+ shipments.'],['fc','FIELD NOTES // CHECKPOINT','Thoughtful sourcing.'],
    ['s1','SYSTEMS // 01','A memory for partners.'],['s2','SYSTEMS // 02','Sheets. CRM. Analytics.'],['s3','SYSTEMS // 03','The right record at the right moment.'],
    ['truely','LAST PAGE // TRUELY','The pipeline runs itself.'],
    ['signal','SIGNAL // THE RERUN','Every story, rewritten.'],
    ['vault','VAULT // THIS ROOM','Kept by the keeper.']
  ];
  const rooms=[
    ['room-toolkit','ROOM // TOOLKIT','The equipment behind the work.'],
    ['room-profile','ROOM // PROFILE','RAIYAN KABIR · LV 29'],
    ['room-contact','ROOM // CONTACT','The cleanest way to continue.'],
    ['room-games','ROOM // GAMES','Six stories, playable.'],
    ['room-leaderboards','ROOM // SCORES','Every score the archive kept.'],
    ['room-achievements','ROOM // ACHIEVEMENTS','The archive kept score.']
  ];
  const notes=[
    ['note-1','01 · THE VAULT REMEMBERS'],
    ['note-2','02 · KEEPERS COME BACK'],
    ['note-3','03 · THE STORY IS THE PRODUCT']
  ];
  const all=chapters.map((c,i)=>({id:c[0],kind:'chapter',index:i,label:c[1],sub:c[2]})).concat(
    rooms.map((r,i)=>({id:r[0],kind:'room',index:29+i,label:r[1],sub:r[2]})),
    notes.map((n,i)=>({id:n[0],kind:'note',index:35+i,label:n[1],sub:''}))
  );
  return all;
})();

window.VAULT_CSS_CAPS=VAULT_TARGETS.filter(t=>t.kind!=='note');

const VAULT3D=(function(){
  const ROOM_OPENERS={toolkit:'openToolkit',profile:'openProfile',contact:'openContact',games:'openGamesRoom',leaderboards:'openLeaderboards',achievements:'openAchievements'};
  const CHAPTER_TEXT={};
  VAULT_TARGETS.forEach(t=>{
    if(t.kind==='chapter')CHAPTER_TEXT[t.id]={label:t.label,sub:t.sub};
  });
  const hooks={onChapter:function(){},onRoom:function(){},onNote:function(){},onEnter:function(){},onExit:function(){}};
  let mode='idle',active=false,raf=null;
  let renderer=null,scene=null,camera=null;
  let panels=[],rooms=[],noteMeshes=[],blooms=[],stars=null;
  let yaw=0.6,pitch=0.12,dist=9,lookY=0;
  let targetYaw=yaw,targetPitch=pitch,targetDist=dist,targetLookY=0;
  let drag=false,lx=0,ly=0;
  let noteTook=[],noteCount=0;
  const quality=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'low':'auto';

  function makeTexture(label,sub){
    try{
      const c=document.createElement('canvas');c.width=512;c.height=256;
      const ctx=c.getContext('2d');
      if(!ctx)return null;
      ctx.fillStyle='#050a1a';ctx.fillRect(0,0,512,256);
      ctx.strokeStyle='#22d3ee';ctx.lineWidth=4;ctx.strokeRect(14,14,484,228);
      ctx.fillStyle='#a855f7';
      ctx.font='26px monospace';ctx.textAlign='left';
      ctx.fillText('['+label.split(' // ')[0]+']',34,64);
      ctx.fillStyle='#e2e8f0';
      ctx.font='bold 34px monospace';
      ctx.fillText(label,34,124);
      ctx.fillStyle='#94a3b8';
      ctx.font='26px monospace';
      ctx.fillText(sub,34,168);
      ctx.fillStyle='#22d3ee';ctx.fillRect(34,196,444,3);
      return new THREE.CanvasTexture(c);
    }catch(e){return null}
  }

  function init(){
    if(mode==='three')return;
    if(typeof THREE==='undefined'||!THREE.WebGLRenderer)return;
    try{
      const r=document.getElementById('vaultRoot');if(!r)return;
      r.querySelectorAll('.vault-poster,.vault-css').forEach(n=>n.remove());
      renderer=new THREE.WebGLRenderer({antialias:true});
      renderer.setPixelRatio(quality==='low'?1:Math.min(window.devicePixelRatio||1,2));
      renderer.setSize(window.innerWidth,window.innerHeight);
      renderer.domElement.className='vault-canvas';
      renderer.domElement.addEventListener('pointerdown',onDown);
      window.addEventListener('pointermove',onMove);
      window.addEventListener('pointerup',onUp);
      renderer.domElement.addEventListener('wheel',onWheel,{passive:false});
      r.insertBefore(renderer.domElement,r.firstChild);
      scene=new THREE.Scene();
      scene.background=new THREE.Color('#050a1a');
      scene.fog=new THREE.FogExp2('#050a1a',0.035);
      camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,120);
      buildHelix();
      buildRooms();
      buildNotes();
      buildStars();
      mode='three';
      window.addEventListener('resize',onResize);
      if(active)startLoop();
    }catch(e){mode='idle'}
  }

  function panelGeometry(w,h){
    const g=new THREE.PlaneGeometry(w,h);
    const r=Math.random()*Math.PI*2;
    g.rotateY(r);g.rotateZ(Math.sin(r)*0.08);
    return g;
  }

  function buildHelix(){
    panels=[];
    const caps=VAULT_TARGETS.filter(t=>t.kind==='chapter');
    caps.forEach((t,i)=>{
      const tex=makeTexture(t.label,t.sub);
      const mat=new THREE.MeshBasicMaterial({map:tex,color:0xffffff,transparent:true,opacity:0.94});
      const mesh=new THREE.Mesh(panelGeometry(2.3,1.15),mat);
      const a=(i/caps.length)*Math.PI*2;
      const rad=7.2+Math.sin(i*1.7)*0.9;
      const h=(i/caps.length-0.5)*11;
      mesh.position.set(Math.cos(a)*rad,h,Math.sin(a)*rad);
      mesh.lookAt(0,h*0.35,0);
      mesh.userData={target:t};
      scene.add(mesh);
      panels.push(mesh);
      const spr=new THREE.Sprite(new THREE.SpriteMaterial({color:0x22d3ee,transparent:true,opacity:0.05}));
      spr.position.copy(mesh.position);
      spr.scale.set(3.6,3.6,1);
      scene.add(spr);
      blooms.push(spr);
    });
  }

  function buildRooms(){
    rooms=[];
    VAULT_TARGETS.filter(t=>t.kind==='room').forEach((t,i)=>{
      const tex=makeTexture(t.label,t.sub);
      const mat=new THREE.MeshBasicMaterial({map:tex,color:0xffffff,transparent:true,opacity:0.9});
      const mesh=new THREE.Mesh(panelGeometry(2.6,1.3),mat);
      const a=0.7+i*0.9;
      mesh.position.set(Math.cos(a)*5.2,-1.2+Math.sin(i*2.1)*0.8,Math.sin(a)*5.2);
      mesh.lookAt(0,0,0);
      mesh.userData={target:t};
      scene.add(mesh);
      rooms.push(mesh);
      const spr=new THREE.Sprite(new THREE.SpriteMaterial({color:0xa855f7,transparent:true,opacity:0.08}));
      spr.position.copy(mesh.position);
      spr.scale.set(4.4,4.4,1);
      scene.add(spr);
      blooms.push(spr);
    });
  }

  function buildNotes(){
    noteMeshes=[];
    VAULT_TARGETS.filter(t=>t.kind==='note').forEach((t,i)=>{
      const mat=new THREE.MeshBasicMaterial({color:0xa855f7});
      const mesh=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5),mat);
      const a=i*2.1+0.4;
      mesh.position.set(Math.cos(a)*4.4,2.6-Math.sin(i*1.3)*0.9,Math.sin(a)*4.4);
      mesh.userData={target:t};
      scene.add(mesh);
      noteMeshes.push(mesh);
    });
  }

  function buildStars(){
    const N=6000;
    const pos=new Float32Array(N*3);
    const col=new Float32Array(N*3);
    for(let i=0;i<N;i++){
      const r=38+Math.random()*42;
      const th=Math.random()*Math.PI*2;
      const ph=Math.acos(2*Math.random()-1);
      pos[i*3]=r*Math.sin(ph)*Math.cos(th);
      pos[i*3+1]=r*Math.cos(ph);
      pos[i*3+2]=r*Math.sin(ph)*Math.sin(th);
      const c=Math.random()<0.12?0x22d3ee:0xffffff;
      col[i*3]=((c>>16)&255)/255;col[i*3+1]=((c>>8)&255)/255;col[i*3+2]=(c&255)/255;
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    g.setAttribute('color',new THREE.BufferAttribute(col,3));
    const m=new THREE.PointsMaterial({size:0.09,vertexColors:true,transparent:true,opacity:0.85});
    stars=new THREE.Points(g,m);
    scene.add(stars);
  }

  function onDown(e){
    if(mode!=='three')return;
    drag=true;lx=e.clientX;ly=e.clientY;
    renderer.domElement.classList.add('drag');
  }
  function onMove(e){
    if(!drag||mode!=='three')return;
    const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;
    targetYaw-=dx*0.005;
    targetPitch=Math.max(-1.2,Math.min(1.2,targetPitch+dy*0.005));
  }
  function onUp(e){
    if(!drag)return;
    drag=false;
    renderer.domElement.classList.remove('drag');
    if(Math.abs(e.clientX-lx)<4&&Math.abs(e.clientY-ly)<4)pick(e);
  }
  function onWheel(e){
    if(mode!=='three')return;
    e.preventDefault();
    targetDist=Math.max(3.2,Math.min(17,targetDist+e.deltaY*0.006));
  }
  function pick(e){
    if(mode!=='three'||!renderer||!scene||!camera)return;
    const rect=renderer.domElement.getBoundingClientRect();
    const x=((e.clientX-rect.left)/rect.width)*2-1;
    const y=-((e.clientY-rect.top)/rect.height)*2+1;
    const ray=new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(x,y),camera);
    const meshes=panels.concat(rooms).concat(noteMeshes);
    const hits=ray.intersectObjects(meshes,false);
    if(!hits.length)return;
    const t=hits[0].object.userData.target;
    if(t.kind==='note'){
      if(noteTook.includes(t.id))return;
      noteTook.push(t.id);noteCount++;
      hooks.onNote(t.label);
      return;
    }
    openTarget(t.id);
  }
  function openTarget(id){
    const t=VAULT_TARGETS.find(x=>x.id===id);if(!t)return;
    if(t.kind==='chapter'){
      const c=CHAPTER_TEXT[id];
      hooks.onChapter(id);
      const html='<p class="story-lead">'+c.label+'</p><p class="story-small">'+c.sub+'</p><p>Every story in the archive was lived before it was written. This chapter is one of the 29 that Raiyan kept.</p>';
      if(typeof openModal==='function')openModal('VAULT // CHAPTER','THE ARCHIVE IN 3D',html);
    }else if(t.kind==='room'){
      const fn=ROOM_OPENERS[t.id.replace('room-','')];
      hooks.onRoom(t.id);
      if(fn&&typeof window[fn]==='function')window[fn]();
    }
  }
  function startLoop(){
    if(raf||mode!=='three'||!renderer)return;
    const damp=0.08;
    function frame(){
      if(!active||mode!=='three'){raf=null;return}
      yaw+=(targetYaw-yaw)*damp;
      pitch+=(targetPitch-pitch)*damp;
      dist+=(targetDist-dist)*damp;
      lookY+=(targetLookY-lookY)*damp;
      camera.position.set(
        Math.cos(yaw)*Math.cos(pitch)*dist,
        Math.sin(pitch)*dist+lookY,
        Math.sin(yaw)*Math.cos(pitch)*dist
      );
      camera.lookAt(0,lookY,0);
      if(stars)stars.rotation.y+=0.00012;
      renderer.render(scene,camera);
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);
  }
  function onResize(){
    if(mode!=='three'||!renderer||!camera)return;
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  }
  function setMode(m){mode=m}
  function setQuality(q){
    if(renderer&&q==='low')renderer.setPixelRatio(1);
  }
  function enter(){
    active=true;
    if(mode==='three'){const r=document.getElementById('vaultRoot');if(r)r.classList.add('vault-live');startLoop()}
    hooks.onEnter();
  }
  function exit(){
    active=false;
    if(raf){cancelAnimationFrame(raf);raf=null}
    const r=document.getElementById('vaultRoot');if(r)r.classList.remove('vault-live');
    hooks.onExit();
  }
  return {
    init:init,enter:enter,exit:exit,setMode:setMode,setQuality:setQuality,
    openTarget:openTarget,
    isActive:function(){return active},
    getMode:function(){return mode},
    getNoteCount:function(){return noteCount},
    getNotes:function(){return noteTook.slice()},
    hooks:hooks,
    targets:VAULT_TARGETS
  };
})();