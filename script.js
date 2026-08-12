const narrativeScenes = [
  {id:'intro1',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'You made it!',next:'intro2'},
  {id:'intro2',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'Welcome.',next:'intro2b'},
  {id:'intro2b',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'Glad you dropped by.',next:'intro3'},
  {id:'intro3',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:"I keep Raiyan's better stories safe.",next:'intro3b',secret:1},
  {id:'intro3b',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'Some are about partnerships.',next:'intro3c'},
  {id:'intro3c',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'Some are about the quiet work behind them.',next:'intro3d'},
  {id:'intro3d',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:"Want to dive into Raiyan's lore?",choices:[{label:'YES — SHOW ME',next:'beginning1'},{label:'NO — I WILL LOOK AROUND',next:'hub'}]},
  {id:'hub',chapter:'ARCHIVE // INDEX',speaker:'* GUIDE',text:'The archive has two reliable trails.',next:'hub2'},
  {id:'hub2',chapter:'ARCHIVE // INDEX',speaker:'* GUIDE',text:'One explains where the work began.',next:'hub3'},
  {id:'hub3',chapter:'ARCHIVE // INDEX',speaker:'* GUIDE',text:'The other explains how it is done.',choices:[{label:'HOW THE JOURNEY STARTED',next:'beginning1'},{label:'HOW PARTNERSHIPS ARE BUILT',next:'ops1'}]},
  {id:'beginning1',chapter:'JOURNEY // 01',speaker:'* GUIDE',text:'It started with research.',next:'beginning1b'},
  {id:'beginning1b',chapter:'JOURNEY // 01',speaker:'* GUIDE',text:'Finding creators whose audiences fit the offer.',next:'beginning2',game:'leadSort'},
  {id:'lead1',chapter:'BRIEFING // 01',speaker:'* GUIDE',text:'We trained the filter.',next:'lead2'},
  {id:'lead2',chapter:'BRIEFING // 01',speaker:'* GUIDE',text:'The game is a hands-on taste of it.',next:'beginning2'},
  {id:'beginning2',chapter:'JOURNEY // 02',speaker:'* GUIDE',text:'A list alone is not a pipeline.',next:'beginning2b'},
  {id:'beginning2b',chapter:'JOURNEY // 02',speaker:'* GUIDE',text:'Each lead needed context.',next:'beginning2c'},
  {id:'beginning2c',chapter:'JOURNEY // 02',speaker:'* GUIDE',text:'Audience. Region. Channel. Relevance.',next:'beginning2d'},
  {id:'beginning2d',chapter:'JOURNEY // 02',speaker:'* GUIDE',text:'And a reason to reach out.',next:'beginning3'},
  {id:'beginning3',chapter:'JOURNEY // 03',speaker:'* GUIDE',text:'That made outreach a useful first conversation.',next:'beginning3b',game:'emailBuild'},
  {id:'beginning3b',chapter:'JOURNEY // 03',speaker:'* GUIDE',text:'The goal was fit before volume.',next:'beginning4'},
  {id:'beginning4',chapter:'JOURNEY // 04',speaker:'* GUIDE',text:'When a partner replied, the real work began.',next:'beginning4b',secret:2,game:'partnerCall'},
  {id:'beginning4b',chapter:'JOURNEY // 04',speaker:'* GUIDE',text:'Clarify expectations. Remove friction.',next:'beginning4c'},
  {id:'beginning4c',chapter:'JOURNEY // 04',speaker:'* GUIDE',text:'Create a next step that works for both sides.',next:'journeyChoice'},
  {id:'journeyChoice',chapter:'JOURNEY // CHECKPOINT',speaker:'* GUIDE',text:'That habit still shapes the work.',next:'journeyChoice2'},
  {id:'journeyChoice2',chapter:'JOURNEY // CHECKPOINT',speaker:'* GUIDE',text:'Want to see how the system grew, or what it produced?',choices:[{label:'HOW THE SYSTEM SCALED',next:'scale1'},{label:'SEE PRACTICAL OUTCOMES',next:'outcomes1'}]},
  {id:'scale1',chapter:'JOURNEY // 05',speaker:'* GUIDE',text:'As programs grew, consistency mattered.',next:'scale1b'},
  {id:'scale1b',chapter:'JOURNEY // 05',speaker:'* GUIDE',text:'The process became a shared operating system.',next:'scale2'},
  {id:'scale2',chapter:'JOURNEY // 06',speaker:'* GUIDE',text:'Lead lists. Outreach notes. Qualification rules.',next:'scale2b'},
  {id:'scale2b',chapter:'JOURNEY // 06',speaker:'* GUIDE',text:'Follow-ups kept everything visible.',next:'scale2c'},
  {id:'scale2c',chapter:'JOURNEY // 06',speaker:'* GUIDE',text:'Without losing the human context.',next:'scale3'},
  {id:'scale3',chapter:'JOURNEY // 07',speaker:'* GUIDE',text:'It supported a team of five affiliate managers.',next:'scale3b',secret:3},
  {id:'scale3b',chapter:'JOURNEY // 07',speaker:'* GUIDE',text:'Clear handoffs. Visible priorities.',next:'scale3c'},
  {id:'scale3c',chapter:'JOURNEY // 07',speaker:'* GUIDE',text:'And room to improve.',next:'scaleChoice'},
  {id:'scaleChoice',chapter:'JOURNEY // CHECKPOINT',speaker:'* GUIDE',text:'A process helps people make better decisions.',next:'scaleChoice2'},
  {id:'scaleChoice2',chapter:'JOURNEY // CHECKPOINT',speaker:'* GUIDE',text:'The rest is best heard from Raiyan himself.',next:'drillGate'},
  {id:'ops1',chapter:'PLAYBOOK // 01',speaker:'* GUIDE',text:'First, define the partner you need.',next:'ops1b'},
  {id:'ops1b',chapter:'PLAYBOOK // 01',speaker:'* GUIDE',text:'Audience fit. Commercial fit.',next:'ops1c'},
  {id:'ops1c',chapter:'PLAYBOOK // 01',speaker:'* GUIDE',text:'And the ability to activate.',next:'ops2'},
  {id:'ops2',chapter:'PLAYBOOK // 02',speaker:'* GUIDE',text:'Research before you write.',next:'ops2b'},
  {id:'ops2b',chapter:'PLAYBOOK // 02',speaker:'* GUIDE',text:'A relevant message is shorter and clearer.',next:'ops2c'},
  {id:'ops2c',chapter:'PLAYBOOK // 02',speaker:'* GUIDE',text:'And far more likely to start a conversation.',next:'ops3'},
  {id:'ops3',chapter:'PLAYBOOK // 03',speaker:'* GUIDE',text:'When interest appears, qualify it together.',next:'ops3b'},
  {id:'ops3b',chapter:'PLAYBOOK // 03',speaker:'* GUIDE',text:'What can this partner do?',next:'ops3c'},
  {id:'ops3c',chapter:'PLAYBOOK // 03',speaker:'* GUIDE',text:'What do they need?',next:'ops3d'},
  {id:'ops3d',chapter:'PLAYBOOK // 03',speaker:'* GUIDE',text:'What would success look like?',next:'ops4'},
  {id:'ops4',chapter:'PLAYBOOK // 04',speaker:'* GUIDE',text:'Onboarding is not the finish line.',next:'ops4b'},
  {id:'ops4b',chapter:'PLAYBOOK // 04',speaker:'* GUIDE',text:'It is the handoff from interest to action.',next:'ops4c'},
  {id:'ops4c',chapter:'PLAYBOOK // 04',speaker:'* GUIDE',text:'Links. Terms. Assets. Timing.',next:'ops4d'},
  {id:'ops4d',chapter:'PLAYBOOK // 04',speaker:'* GUIDE',text:'And a clear owner.',next:'ops5',game:'onboardPack'},
  {id:'ops5',chapter:'PLAYBOOK // 05',speaker:'* GUIDE',text:'After launch, keep the relationship warm.',next:'ops5b',secret:4},
  {id:'ops5b',chapter:'PLAYBOOK // 05',speaker:'* GUIDE',text:'Performance data shows where to support.',next:'ops5c'},
  {id:'ops5c',chapter:'PLAYBOOK // 05',speaker:'* GUIDE',text:'Or test, or change direction.',next:'opsChoice'},
  {id:'opsChoice',chapter:'PLAYBOOK // CHECKPOINT',speaker:'* GUIDE',text:'Source. Connect. Qualify. Activate. Learn.',next:'opsChoice2'},
  {id:'opsChoice2',chapter:'PLAYBOOK // CHECKPOINT',speaker:'* GUIDE',text:'It works best when the conversation stays human.',next:'opsClose'},
  {id:'opsClose',chapter:'PLAYBOOK // 06',speaker:'* GUIDE',text:'Now the close itself.',game:'closeDeal',next:'opsAuto'},
  {id:'opsAuto',chapter:'PLAYBOOK // 07',speaker:'* GUIDE',text:'Then automate the busywork.',game:'autoFlow',next:'drillGate'},
  {id:'outcomes1',chapter:'FIELD NOTES // 01',speaker:'* GUIDE',text:'One effort started with about 2,000 leads.',next:'outcomes1b'},
  {id:'outcomes1b',chapter:'FIELD NOTES // 01',speaker:'* GUIDE',text:'Not a sprint.',next:'outcomes1c'},
  {id:'outcomes1c',chapter:'FIELD NOTES // 01',speaker:'* GUIDE',text:'A disciplined filter.',next:'outcomes2'},
  {id:'outcomes2',chapter:'FIELD NOTES // 02',speaker:'* GUIDE',text:'Around 300 tailored outreaches.',next:'outcomes2b'},
  {id:'outcomes2b',chapter:'FIELD NOTES // 02',speaker:'* GUIDE',text:'211 replies.',next:'outcomes2c'},
  {id:'outcomes2c',chapter:'FIELD NOTES // 02',speaker:'* GUIDE',text:'The real win was the quality of the next conversation.',next:'outcomes3'},
  {id:'outcomes3',chapter:'FIELD NOTES // 03',speaker:'* GUIDE',text:'About 100 prospects met the bar.',next:'outcomes3b'},
  {id:'outcomes3b',chapter:'FIELD NOTES // 03',speaker:'* GUIDE',text:'Then: activation, communication and growth.',next:'outcomes4'},
  {id:'outcomes4',chapter:'FIELD NOTES // 04',speaker:'* GUIDE',text:'Creator operations needed the same care.',next:'outcomes4b',secret:5},
  {id:'outcomes4b',chapter:'FIELD NOTES // 04',speaker:'* GUIDE',text:'More than 80 shipments across the US and Canada.',next:'outcomes4c'},
  {id:'outcomes4c',chapter:'FIELD NOTES // 04',speaker:'* GUIDE',text:'Every shipment was a relationship to manage well.',next:'outcomesChoice'},
  {id:'outcomesChoice',chapter:'FIELD NOTES // CHECKPOINT',speaker:'* GUIDE',text:'Thoughtful sourcing.',next:'outcomesChoice2'},
  {id:'outcomesChoice2',chapter:'FIELD NOTES // CHECKPOINT',speaker:'* GUIDE',text:'Clear communication. Dependable follow-through.',next:'drillGate'},
  {id:'craft1',chapter:'SYSTEMS // 01',speaker:'* GUIDE',text:'Good partner work needs a memory.',next:'craft1b'},
  {id:'craft1b',chapter:'SYSTEMS // 01',speaker:'* GUIDE',text:'CRM notes. Lead databases. Reporting.',next:'craft1c'},
  {id:'craft1c',chapter:'SYSTEMS // 01',speaker:'* GUIDE',text:'They make every conversation easier to continue.',next:'craft2'},
  {id:'craft2',chapter:'SYSTEMS // 02',speaker:'* GUIDE',text:'HubSpot and Google Sheets keep the pipeline visible.',next:'craft2b'},
  {id:'craft2b',chapter:'SYSTEMS // 02',speaker:'* GUIDE',text:'Analytics show where attention should go.',next:'craft3'},
  {id:'craft3',chapter:'SYSTEMS // 03',speaker:'* GUIDE',text:'The tool is not the point.',next:'craft3b',secret:6},
  {id:'craft3b',chapter:'SYSTEMS // 03',speaker:'* GUIDE',text:'The right record at the right moment is.',next:'craft3c'},
  {id:'craft3c',chapter:'SYSTEMS // 03',speaker:'* GUIDE',text:'Partners get useful follow-through, not noise.',next:'drillGate'},
  {id:'drillGate',chapter:'ARCHIVE // LAST PAGE',speaker:'* GUIDE',text:function(){const r=remainingGames();return r.length?('Before the last page — '+r.length+' drill'+(r.length>1?'s':'')+' remain.'):'All six drills are done. Ready for the last page.'},game:function(){const r=remainingGames();return r.length?r[0]:null},next:'finalContact'},
  {id:'finalContact',chapter:'ARCHIVE // LAST PAGE',speaker:'* GUIDE',text:'That is the shape of it.',next:'finalContact2'},
  {id:'finalContact2',chapter:'ARCHIVE // LAST PAGE',speaker:'* GUIDE',text:'Ready to contact Raiyan?',choices:[{label:'YES — OPEN A CHANNEL',next:'contact'},{label:'NO — I WILL KEEP EXPLORING',next:'hub'}]},
  {id:'profileHint',chapter:'ARCHIVE NOTE // 01',speaker:'* GUIDE',text:'The profile holds the professional record.',next:'profileHint2',secret:8},
  {id:'profileHint2',chapter:'ARCHIVE NOTE // 01',speaker:'* GUIDE',text:'This story is the reasoning behind it.',next:'hub'},
  {id:'toolHint',chapter:'ARCHIVE NOTE // 02',speaker:'* GUIDE',text:'The toolkit is practical.',next:'toolHint2',secret:9},
  {id:'toolHint2',chapter:'ARCHIVE NOTE // 02',speaker:'* GUIDE',text:'These are systems he has actually used.',next:'hub'}
];

const tools = [
 ['Impact','Affiliate tracking and partner operations'],['ShareASale','Affiliate network management'],['Rakuten','Affiliate partner ecosystem'],['CJ','Affiliate program operations'],['Awin','Affiliate network management'],['PartnerStack','SaaS partnerships'],['FirstPromoter','Direct affiliate operations'],['HubSpot','CRM and pipeline management'],['Google Analytics','Performance analysis'],['Ahrefs','Research and publisher discovery'],['Google Sheets','Lead databases and reporting'],['Google Workspace','Research, docs and collaboration']
];
const quests = [
 ['PARTNER RESEARCH','Built practical research habits for finding publishers and creators with genuine audience fit.','done'],
 ['OUTREACH SYSTEMS','Turned lead research into relevant, trackable conversations and qualified opportunities.','done'],
 ['PROGRAM OPERATIONS','Supported affiliate programs with partner communication, reporting and campaign improvement.','done'],
 ['TEAM ENABLEMENT','Helped lead roughly five affiliate managers for about 1.5 years through clear workflows and handoffs.','done'],
 ['CREATOR LOGISTICS','Supported creator partnership operations, including 80+ product shipments across the US and Canada.','done'],
 ['ECHOLABS','Publish EchoLabs as a platform.','todo'],
 ['THE BACKFLIP','Do a backflip.','todo']
];

const state={started:false,index:0,history:[],typing:false,timer:null,charIndex:0,speed:18,sound:true,xp:0,found:[],choices:[],enterCount:0,achievementsUnlocked:false,playerName:'',leaderboard:{},playedGames:[]};
let audioCtx=null,ambientTimer=null;
const $=id=>document.getElementById(id);
const GAME_ORDER=['leadSort','emailBuild','partnerCall','onboardPack','closeDeal','autoFlow'];
function remainingGames(){return GAME_ORDER.filter(id=>!state.playedGames.includes(id))}
function markGamePlayed(id){if(id&&!state.playedGames.includes(id)){state.playedGames.push(id);save()}}
const ui={start:$('startScreen'),begin:$('beginBtn'),experience:$('experience'),chapter:$('microLine'),card:$('dialogueCard'),speaker:$('speakerName'),sceneMark:$('sceneMark'),text:$('dialogueText'),continue:$('continueBtn'),choices:$('choices'),quests:$('questsBtn'),toolkit:$('toolkitBtn'),profile:$('profileBtn'),contact:$('contactBtn'),home:$('homeBtn'),achievements:$('achievementsBtn'),back:$('backBtn'),sound:$('soundBtn'),save:$('saveState'),modal:$('modal'),backdrop:$('modalBackdrop'),modalCard:$('modalCard'),modalKicker:$('modalKicker'),modalSub:$('modalSub'),modalContent:$('modalContent'),modalClose:$('modalClose'),toast:$('toast'),gamePanel:$('gamePanel'),gamesBtn:$('gamesBtn')};
function save(){try{localStorage.setItem('raiyan-ruby-ui-v11',JSON.stringify({...state,timer:null}))}catch{}ui.save.textContent=state.achievementsUnlocked?'ACHIEVEMENTS':'LOCAL'}
function load(){try{Object.assign(state,JSON.parse(localStorage.getItem('raiyan-ruby-ui-v11')||'{}'));if(!narrativeScenes[state.index]){state.index=0;state.history=[]}if(!Array.isArray(state.playedGames))state.playedGames=[]}catch{}}
function current(){return narrativeScenes[state.index]}
function textFor(scene){return typeof scene.text==='function'?scene.text():scene.text}
function ensureAudio(){if(!state.sound)return;try{audioCtx ||= new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume()}catch{}}
function advanceSound(){ensureAudio();if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='square';o.frequency.setValueAtTime(480,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(760,audioCtx.currentTime+.08);g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.02,audioCtx.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.1);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.11)}
function choiceSound(){ensureAudio();if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='triangle';o.frequency.value=220;g.gain.value=.01;o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.15)}
function startAmbient(){if(!state.sound||ambientTimer)return;ensureAudio();if(!audioCtx)return;const notes=[146.83,174.61,196,220,196];let i=0;ambientTimer=setInterval(()=>{if(!state.sound||!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=notes[i++%notes.length];g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0035,audioCtx.currentTime+.18);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+2.1);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+2.15)},2400)}
function stopAmbient(){clearInterval(ambientTimer);ambientTimer=null}
function toast(msg){ui.toast.textContent=msg;ui.toast.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>ui.toast.classList.remove('show'),1400)}
function discover(n){if(state.found.includes(n))return;state.found.push(n);state.xp=Math.min(8,state.xp+1);save();toast('ARCHIVE NOTE FOUND  ·  XP +1');choiceSound()}
function renderChoices(){ui.choices.innerHTML='';current().choices.forEach((c,i)=>{const b=document.createElement('button');b.className='choice-btn';b.type='button';b.textContent=c.label;b.onclick=()=>choose(i,c.next);ui.choices.appendChild(b)});ui.card.classList.add('has-choices')}
function renderScene(){clearInterval(state.timer);state.typing=true;state.charIndex=0;const s=current();ui.chapter.textContent=s.chapter;ui.speaker.textContent=s.speaker;ui.sceneMark.textContent=`[${String(state.index+1).padStart(2,'0')}]`;ui.text.textContent='';ui.choices.innerHTML='';ui.card.classList.remove('ready','has-choices');const chars=[...textFor(s)];state.timer=setInterval(()=>{state.charIndex++;ui.text.textContent=chars.slice(0,state.charIndex).join('');if(state.charIndex>=chars.length)finishTyping()},state.speed)}
function finishTyping(){clearInterval(state.timer);state.timer=null;state.typing=false;const s=current();ui.text.textContent=textFor(s);ui.card.classList.add('ready');if(s.choices)renderChoices();if(Number.isInteger(s.secret))discover(s.secret);const gid=typeof s.game==='function'?s.game():s.game;if(gid&&!state.playedGames.includes(gid))setTimeout(()=>{if(isGameBlocking())return;if(current().id!==s.id)return;startGame(gid,s.id)},250);save()}
function choose(i,next){state.choices.push({scene:current().id,choice:i});choiceSound();if(next==='contact'){openContact();save();return}goto(next)}
function goto(id){const idx=narrativeScenes.findIndex(s=>s.id===id);if(idx<0)return;state.history.push(state.index);state.index=idx;advanceSound();renderScene();save()}
function unlockAchievements(){if(state.achievementsUnlocked)return;state.achievementsUnlocked=true;ui.achievements.hidden=false;ui.achievements.classList.add('unlocked');save();toast('ACHIEVEMENTS UNLOCKED');choiceSound()}
function next(){if(state.typing){finishTyping();advanceSound();return}const s=current();const gid=typeof s.game==='function'?s.game():s.game;if(gid&&!state.playedGames.includes(gid)){if(!isGameBlocking())startGame(gid,s.id);return}if(s.choices)return;if(s.next)goto(s.next);else toast('END OF FILE')}
function back(){if(state.typing){finishTyping();return}const prev=state.history.pop();if(prev===undefined)return;state.index=prev;advanceSound();renderScene();save()}
function openHome(){closeGamePanel();closeModal();clearInterval(state.timer);state.started=false;state.index=0;state.history=[];state.xp=0;state.found=[];state.enterCount=0;state.achievementsUnlocked=false;state.playedGames=[];ui.achievements.hidden=true;ui.achievements.classList.remove('unlocked');save();ui.experience.classList.add('hidden');ui.start.classList.remove('hidden');ui.begin.focus();stopAmbient()}
function openModal(kicker,sub,html){ui.modalKicker.textContent=kicker;ui.modalSub.textContent=sub;ui.modalContent.innerHTML=html;ui.modal.classList.remove('hidden');document.body.classList.add('modal-open');requestAnimationFrame(()=>ui.modalCard.focus())}
function closeModal(){ui.modal.classList.add('hidden');document.body.classList.remove('modal-open')}
function openAchievements(){openModal('ACHIEVEMENTS','The archive kept score.',`<div class="story-modal"><div class="modal-portrait mini-avatar" aria-hidden="true"></div><div><p class="story-lead">You stayed long enough for the archive to notice.</p><p>${state.found.length} optional notes found. ${state.xp} XP earned.</p><p class="story-small">The number is fake. The curiosity is not.</p></div></div>`)}
function openQuests(){openModal('QUESTS','The chapters completed so far.',`<div class="quest-story">${quests.map(([t,d,s],i)=>`<article class="quest ${s}"><div class="quest-meta">${s==='done'?'ACHIEVED':'PENDING'} · ${String(i+1).padStart(2,'0')}</div><div class="quest-title">${t}</div><div class="quest-copy">${d}</div></article>`).join('')}</div>`)}
function openToolkit(){openModal('TOOLKIT','The equipment behind the work.',`<div class="tool-story">${tools.map(([n,d],i)=>`<article class="tool"><div class="tool-index">${String(i+1).padStart(2,'0')}</div><div><div class="tool-name">${n}</div><div class="tool-note">${d}</div></div></article>`).join('')}</div>`)}
function openProfile(){openModal('PROFILE','RAIYAN KABIR · LV 29',`<div class="profile-sheet"><div class="avatar-column"><div class="pixel-portrait large" role="img" aria-label="Detailed monochrome pixel avatar of Raiyan Kabir wearing glasses"><div class="hair"></div><div class="face"></div><div class="earL"></div><div class="earR"></div><div class="frameL"></div><div class="frameR"></div><div class="bridge"></div><div class="eye1"></div><div class="eye2"></div><div class="nose"></div><div class="mouth"></div><div class="chin"></div><div class="neck"></div><div class="shirt"></div><div class="collar"></div></div><div class="avatar-caption">AFFILIATE / PARTNERSHIPS / GROWTH</div></div><div class="profile-copy"><div class="profile-head"><div class="profile-title">RAIYAN KABIR</div><div class="profile-sub">AFFILIATE & PARTNERSHIPS GROWTH OPERATOR</div></div><div class="profile-block"><strong>MONSTERCLAW</strong><span>Managed affiliate programs, recruited partners, handled communication, reviewed performance, optimized campaigns and led roughly five affiliate managers for about 1.5 years.</span></div><div class="profile-block"><strong>TRUELY ESIM</strong><span>Ran international affiliate recruitment and partner operations across a working pipeline of roughly 2,000 leads, 300 outreaches, 211 replies and about 100 qualified prospects.</span></div><div class="profile-block"><strong>ZAGER GUITARS</strong><span>Supported creator partnership operations and coordinated 80+ guitar shipments to creators across the US and Canada.</span></div><div class="profile-block"><strong>CORE WORK</strong><span>Affiliate recruitment, publisher sourcing, lead management, outreach, partnership communications, activation, lifecycle management, data analysis, reporting and campaign optimization.</span></div></div></div>`)}
function openContact(){openModal('CONTACT','The cleanest way to continue the story.',`<div class="contact-story"><div class="contact-panel"><div class="contact-kicker">OPEN A CHANNEL</div><div class="contact-title">EMAIL RAIYAN</div><p>For work, partnerships, campaigns, growth problems or systems that need fixing.</p><a class="contact-link" href="mailto:raiyang3@gmail.com">raiyang3@gmail.com</a></div><div class="contact-panel wide"><div class="contact-kicker">WHATSAPP</div><div class="contact-title">WHATSAPP RAIYAN</div><p>For quick questions or a faster follow-up on anything you saw here.</p><a class="contact-link" href="https://wa.me/8801988667788" target="_blank" rel="noopener">+8801988667788</a></div><div class="contact-panel alt"><div class="contact-kicker">NEXT CHAPTER</div><div class="contact-title">START A CONVERSATION</div><p>Tell him what needs to grow, what is stuck, or what needs a better operating system.</p><a class="contact-link" href="mailto:raiyang3@gmail.com?subject=Let's%20talk">START TRANSMISSION</a></div></div>`)}
function toggleSound(){state.sound=!state.sound;ui.sound.textContent=state.sound?'SOUND ON':'SOUND OFF';ui.sound.setAttribute('aria-pressed',String(state.sound));if(state.sound){ensureAudio();startAmbient()}else stopAmbient();save()}
function start(){if(state.started)return;state.started=true;ui.start.classList.add('hidden');ui.experience.classList.remove('hidden');ensureAudio();startAmbient();renderScene();save()}
ui.begin.onclick=start;ui.continue.onclick=e=>{e.stopPropagation();next()};ui.card.onclick=e=>{if(e.target.closest('.choice-btn'))return;next()};ui.back.onclick=back;ui.sound.onclick=toggleSound;ui.quests.onclick=openQuests;ui.toolkit.onclick=openToolkit;ui.profile.onclick=openProfile;ui.contact.onclick=openContact;ui.home.onclick=openHome;ui.achievements.onclick=openAchievements;ui.gamesBtn.onclick=openGamesRoom;ui.modalClose.onclick=closeModal;ui.backdrop.onclick=closeModal;
window.addEventListener('keydown',e=>{if(isGameBlocking())return;if(e.key==='Enter'&&!state.started){e.preventDefault();start();return}if(!ui.modal.classList.contains('hidden')){if(e.key==='Escape'){e.preventDefault();closeModal()}return}if(!state.started)return;if(e.key==='Enter'){e.preventDefault();state.enterCount++;if(state.enterCount>=12)unlockAchievements();next()}else if(e.key===' '||e.key==='ArrowRight'){e.preventDefault();next()}else if(e.key==='Backspace'||e.key==='ArrowLeft'){e.preventDefault();back()}else if(/^[1-3]$/.test(e.key)&&current().choices){const i=Number(e.key)-1;if(current().choices[i])choose(i,current().choices[i].next)}else if(e.key.toLowerCase()==='q')openQuests();else if(e.key.toLowerCase()==='t')openToolkit();else if(e.key.toLowerCase()==='p')openProfile();else if(e.key.toLowerCase()==='c')openContact();else if(e.key.toLowerCase()==='h')openHome();else if(e.key.toLowerCase()==='g')openGamesRoom()});
load();ui.sound.textContent=state.sound?'SOUND ON':'SOUND OFF';ui.sound.setAttribute('aria-pressed',String(state.sound));if(state.started){ui.start.classList.add('hidden');ui.experience.classList.remove('hidden');if(state.achievementsUnlocked)ui.achievements.hidden=false;ensureAudio();startAmbient();renderScene()}
