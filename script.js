const scenes = [
  {id:'intro1',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'You made it!\nThanks for coming.',next:'intro2'},
  {id:'intro2',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:"Want to dive deeper into Raiyan's lore?",choices:[
    {label:'YES — SHOW ME',next:'prologue'},
    {label:'NO — JUST LOOK AROUND',next:'hub'}
  ]},
  {id:'prologue',chapter:'ARCHIVE // 01',speaker:'* GUIDE',text:'Good.\nThen I will show you the useful parts first.',next:'work'},
  {id:'hub',chapter:'ARCHIVE // INDEX',speaker:'* GUIDE',text:"You can look around on your own.\nI will be here if something catches your eye.",choices:[
    {label:'SEE THE WORK',next:'work'},
    {label:'HOW HE OPERATES',next:'ops'},
    {label:'MEET RAIYAN',next:'profileHint'}
  ]},
  {id:'work',chapter:'WORK // CHAPTERS',speaker:'* GUIDE',text:'Three chapters are easy to start with.\nPick one.',choices:[
    {label:'MONSTERCLAW',next:'monster1'},
    {label:'TRUELY ESIM',next:'truely1'},
    {label:'ZAGER GUITARS',next:'zager1'}
  ]},
  {id:'monster1',chapter:'MONSTERCLAW // 01',speaker:'* GUIDE',text:'Agency-side affiliate work.\nMultiple brands. Multiple programs.',next:'monster2'},
  {id:'monster2',chapter:'MONSTERCLAW // 02',speaker:'* GUIDE',text:'Raiyan recruited partners, managed programs,\nreported performance and optimized campaigns.',next:'monster3'},
  {id:'monster3',chapter:'MONSTERCLAW // 03',speaker:'* GUIDE',text:'He also led roughly five affiliate managers\nfor about 1.5 years.',next:'workReturn',secret:1},
  {id:'truely1',chapter:'TRUELY ESIM // 01',speaker:'* GUIDE',text:'International affiliate operations.\nTravel-tech. Partner growth.',next:'truely2'},
  {id:'truely2',chapter:'TRUELY ESIM // 02',speaker:'* GUIDE',text:'About 2,000 leads.\n300 outreaches. 211 replies.',next:'truely3'},
  {id:'truely3',chapter:'TRUELY ESIM // 03',speaker:'* GUIDE',text:'About 100 qualified prospects.\nThen activation, communication and growth.',next:'workReturn',secret:2},
  {id:'zager1',chapter:'ZAGER GUITARS // 01',speaker:'* GUIDE',text:'Creator partnerships.\nThis time, there were actual boxes.',next:'zager2'},
  {id:'zager2',chapter:'ZAGER GUITARS // 02',speaker:'* GUIDE',text:'Supported 80+ guitar shipments\nto creators across the US and Canada.',next:'workReturn',secret:3},
  {id:'workReturn',chapter:'WORK // INDEX',speaker:'* GUIDE',text:'One chapter down.\nWhere should we look next?',choices:[
    {label:'ANOTHER CHAPTER',next:'work'},
    {label:'HOW HE OPERATES',next:'ops'},
    {label:'SEE HIS SKILLS',next:'skills'}
  ]},
  {id:'ops',chapter:'OPERATING MODEL // 01',speaker:'* GUIDE',text:'Find the right partner.\nMake contact.',next:'ops2'},
  {id:'ops2',chapter:'OPERATING MODEL // 02',speaker:'* GUIDE',text:'Qualify. Onboard. Activate.\nKeep the relationship alive.',next:'ops3'},
  {id:'ops3',chapter:'OPERATING MODEL // 03',speaker:'* GUIDE',text:'Then measure what happened.\nChange what did not work.',next:'opsChoice',secret:4},
  {id:'opsChoice',chapter:'OPERATING MODEL // 04',speaker:'* GUIDE',text:'That is the loop.\nWant to see what sits underneath it?',choices:[
    {label:'SHOW THE SKILLS',next:'skills'},
    {label:'OPEN THE TOOLKIT',next:'toolHint'},
    {label:'BACK TO THE WORK',next:'work'}
  ]},
  {id:'skills',chapter:'SKILLS // 01',speaker:'* GUIDE',text:'Affiliate recruitment.\nLead sourcing. Partnership lifecycle.',next:'skills2'},
  {id:'skills2',chapter:'SKILLS // 02',speaker:'* GUIDE',text:'Outreach. Data analysis. Reporting.\nCampaign optimization.',next:'skillsChoice',secret:5},
  {id:'skillsChoice',chapter:'SKILLS // 03',speaker:'* GUIDE',text:'That is the practical core.\nThe buttons hold the rest.',choices:[
    {label:'MEET RAIYAN',next:'profileHint'},
    {label:'OPEN THE TOOLKIT',next:'toolHint'},
    {label:'SEE THE QUESTS',next:'questHint'}
  ]},
  {id:'questHint',chapter:'ARCHIVE NOTE // 01',speaker:'* GUIDE',text:'Quests record what is already done.\nAnd what is still waiting.',secret:6,next:'hub'},
  {id:'profileHint',chapter:'ARCHIVE NOTE // 02',speaker:'* GUIDE',text:'The profile is the cleanest way\nto see the person behind the work.',secret:7,next:'hub'},
  {id:'toolHint',chapter:'ARCHIVE NOTE // 03',speaker:'* GUIDE',text:'The toolkit is practical.\nThese are tools he has actually worked with.',secret:8,next:'hub'},
  {id:'final',chapter:'ARCHIVE // FINAL',speaker:'* GUIDE',text:'You have the shape of the story now.\nThe buttons can fill in the rest.'}
];

const narrativeScenes = [
  {id:'intro1',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'Welcome.\\nThis is not a list of logos. It is a working record.',next:'intro2'},
  {id:'intro2',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'It begins with a simple question: how do you turn a promising contact into a useful, lasting partnership?',next:'introChoice',secret:1},
  {id:'introChoice',chapter:'ARCHIVE // OPEN',speaker:'* GUIDE',text:'We can follow the journey from the beginning, inspect the operating playbook, or explore the record at your own pace.',choices:[{label:'START AT THE BEGINNING',next:'beginning1'},{label:'SHOW ME THE PLAYBOOK',next:'ops1'},{label:'EXPLORE THE ARCHIVE',next:'hub'}]},
  {id:'hub',chapter:'ARCHIVE // INDEX',speaker:'* GUIDE',text:'Pick a thread. Each one answers a different practical question about the work.',choices:[{label:'HOW THE JOURNEY STARTED',next:'beginning1'},{label:'HOW PARTNERSHIPS ARE BUILT',next:'ops1'},{label:'WHAT THE WORK PRODUCED',next:'outcomes1'}]},
  {id:'beginning1',chapter:'JOURNEY // 01',speaker:'* GUIDE',text:'The work started with the unglamorous part: research.\\nFinding publishers and creators whose audiences genuinely fit the offer.',next:'beginning2'},
  {id:'beginning2',chapter:'JOURNEY // 02',speaker:'* GUIDE',text:'A list alone is not a pipeline. Each lead needed context: audience, region, channel, relevance and a reason to reach out.',next:'beginning3'},
  {id:'beginning3',chapter:'JOURNEY // 03',speaker:'* GUIDE',text:'That changed outreach from a generic request into a useful first conversation.\\nThe goal was fit before volume.',next:'beginning4'},
  {id:'beginning4',chapter:'JOURNEY // 04',speaker:'* GUIDE',text:'When a partner replied, the real work began: clarify expectations, remove friction and create a next step that made sense for both sides.',next:'journeyChoice',secret:2},
  {id:'journeyChoice',chapter:'JOURNEY // CHECKPOINT',speaker:'* GUIDE',text:'That early habit still shapes the work. Where should the story go next?',choices:[{label:'HOW THE SYSTEM SCALED',next:'scale1'},{label:'SEE THE PARTNERSHIP PLAYBOOK',next:'ops1'},{label:'SEE PRACTICAL OUTCOMES',next:'outcomes1'}]},
  {id:'scale1',chapter:'JOURNEY // 05',speaker:'* GUIDE',text:'As the number of programs grew, consistency mattered more than improvisation.\\nThe process became a shared operating system.',next:'scale2'},
  {id:'scale2',chapter:'JOURNEY // 06',speaker:'* GUIDE',text:'Lead lists, outreach notes, qualification rules and follow-ups made it possible to see what was happening without losing the human context.',next:'scale3'},
  {id:'scale3',chapter:'JOURNEY // 07',speaker:'* GUIDE',text:'That same system also supported a team of roughly five affiliate managers for about a year and a half: clear handoffs, visible priorities and room to improve.',next:'scaleChoice',secret:3},
  {id:'scaleChoice',chapter:'JOURNEY // CHECKPOINT',speaker:'* GUIDE',text:'A process is only useful if it helps people make better decisions. Want to see the decision loop?',choices:[{label:'SHOW THE PLAYBOOK',next:'ops1'},{label:'SHOW THE RESULTS',next:'outcomes1'},{label:'SEE THE SYSTEMS',next:'craft1'}]},
  {id:'ops1',chapter:'PLAYBOOK // 01',speaker:'* GUIDE',text:'First, define the partner you actually need.\\nAudience fit, commercial fit and the ability to activate all matter.',next:'ops2'},
  {id:'ops2',chapter:'PLAYBOOK // 02',speaker:'* GUIDE',text:'Then research before writing. A relevant message is shorter, clearer and far more likely to start a real conversation.',next:'ops3'},
  {id:'ops3',chapter:'PLAYBOOK // 03',speaker:'* GUIDE',text:'When interest appears, qualify it together.\\nWhat can this partner do? What do they need? What would success look like?',next:'ops4'},
  {id:'ops4',chapter:'PLAYBOOK // 04',speaker:'* GUIDE',text:'Onboarding is not the finish line. It is the handoff from interest to action: links, terms, assets, timing and a clear owner.',next:'ops5'},
  {id:'ops5',chapter:'PLAYBOOK // 05',speaker:'* GUIDE',text:'After launch, keep the relationship warm and read the signal. Performance data tells you where to support, test or change direction.',next:'opsChoice',secret:4},
  {id:'opsChoice',chapter:'PLAYBOOK // CHECKPOINT',speaker:'* GUIDE',text:'That is the repeatable loop: source, connect, qualify, activate, learn and improve.',choices:[{label:'SEE IT IN PRACTICE',next:'outcomes1'},{label:'SEE THE TOOLKIT',next:'toolHint'},{label:'MEET RAIYAN',next:'profileHint'}]},
  {id:'outcomes1',chapter:'FIELD NOTES // 01',speaker:'* GUIDE',text:'One international recruitment effort started with a working pool of roughly 2,000 leads.\\nIt was not a sprint; it was a disciplined filter.',next:'outcomes2'},
  {id:'outcomes2',chapter:'FIELD NOTES // 02',speaker:'* GUIDE',text:'Around 300 tailored outreaches led to 211 replies.\\nThe useful number was not the reply count; it was the quality of the next conversation.',next:'outcomes3'},
  {id:'outcomes3',chapter:'FIELD NOTES // 03',speaker:'* GUIDE',text:'About 100 prospects met the qualification bar. From there, the work shifted to activation, communication and sustainable growth.',next:'outcomes4'},
  {id:'outcomes4',chapter:'FIELD NOTES // 04',speaker:'* GUIDE',text:'In creator operations, the same attention to detail supported more than 80 product shipments across the US and Canada.\\nEvery shipment represented a relationship to manage well.',next:'outcomesChoice',secret:5},
  {id:'outcomesChoice',chapter:'FIELD NOTES // CHECKPOINT',speaker:'* GUIDE',text:'The pattern is consistent: thoughtful sourcing, clear communication and dependable follow-through.',choices:[{label:'RETURN TO THE JOURNEY',next:'beginning1'},{label:'OPEN THE TOOLKIT',next:'toolHint'},{label:'SEE THE PROFILE',next:'profileHint'}]},
  {id:'craft1',chapter:'SYSTEMS // 01',speaker:'* GUIDE',text:'Good partner work needs a memory. CRM notes, lead databases and reporting make every conversation easier to continue well.',next:'craft2'},
  {id:'craft2',chapter:'SYSTEMS // 02',speaker:'* GUIDE',text:'HubSpot and Google Sheets keep the pipeline visible. Analytics, affiliate platforms and network data show where attention should go next.',next:'craft3'},
  {id:'craft3',chapter:'SYSTEMS // 03',speaker:'* GUIDE',text:'The point is not the tool itself. It is using the right record at the right moment, so partners receive useful follow-through rather than noise.',choices:[{label:'OPEN THE TOOLKIT',next:'toolHint'},{label:'RETURN TO THE PLAYBOOK',next:'ops1'},{label:'EXPLORE THE ARCHIVE',next:'hub'}],secret:6},
  {id:'profileHint',chapter:'ARCHIVE NOTE // 01',speaker:'* GUIDE',text:'The profile holds the professional record.\\nThis story is the reasoning behind it.',secret:8,next:'hub'},
  {id:'toolHint',chapter:'ARCHIVE NOTE // 02',speaker:'* GUIDE',text:'The toolkit is here because good partnership work needs reliable systems, not just good instincts.',secret:9,next:'hub'}
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

const state={started:false,index:0,history:[],typing:false,timer:null,charIndex:0,speed:18,sound:true,xp:0,found:[],choices:[],enterCount:0,achievementsUnlocked:false};
let audioCtx=null,ambientTimer=null;
const $=id=>document.getElementById(id);
const ui={start:$('startScreen'),begin:$('beginBtn'),experience:$('experience'),chapter:$('microLine'),card:$('dialogueCard'),speaker:$('speakerName'),sceneMark:$('sceneMark'),text:$('dialogueText'),continue:$('continueBtn'),choices:$('choices'),quests:$('questsBtn'),toolkit:$('toolkitBtn'),profile:$('profileBtn'),contact:$('contactBtn'),home:$('homeBtn'),achievements:$('achievementsBtn'),back:$('backBtn'),sound:$('soundBtn'),save:$('saveState'),modal:$('modal'),backdrop:$('modalBackdrop'),modalCard:$('modalCard'),modalKicker:$('modalKicker'),modalSub:$('modalSub'),modalContent:$('modalContent'),modalClose:$('modalClose'),toast:$('toast')};
function save(){try{localStorage.setItem('raiyan-ruby-ui-v10',JSON.stringify({...state,timer:null}))}catch{}ui.save.textContent=state.achievementsUnlocked?'ACHIEVEMENTS':'LOCAL'}
function load(){try{Object.assign(state,JSON.parse(localStorage.getItem('raiyan-ruby-ui-v10')||'{}'));if(!narrativeScenes[state.index]){state.index=0;state.history=[]}}catch{}}
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
function finishTyping(){clearInterval(state.timer);state.timer=null;state.typing=false;const s=current();ui.text.textContent=textFor(s);ui.card.classList.add('ready');if(s.choices)renderChoices();if(Number.isInteger(s.secret))discover(s.secret);save()}
function choose(i,next){state.choices.push({scene:current().id,choice:i});choiceSound();goto(next)}
function goto(id){const idx=narrativeScenes.findIndex(s=>s.id===id);if(idx<0)return;state.history.push(state.index);state.index=idx;advanceSound();renderScene();save()}
function unlockAchievements(){if(state.achievementsUnlocked)return;state.achievementsUnlocked=true;ui.achievements.hidden=false;ui.achievements.classList.add('unlocked');save();toast('ACHIEVEMENTS UNLOCKED');choiceSound()}
function next(){if(state.typing){finishTyping();advanceSound();return}const s=current();if(s.choices)return;if(s.next)goto(s.next);else toast('END OF FILE')}
function back(){if(state.typing){finishTyping();return}const prev=state.history.pop();if(prev===undefined)return;state.index=prev;advanceSound();renderScene();save()}
function openModal(kicker,sub,html){ui.modalKicker.textContent=kicker;ui.modalSub.textContent=sub;ui.modalContent.innerHTML=html;ui.modal.classList.remove('hidden');document.body.classList.add('modal-open');requestAnimationFrame(()=>ui.modalCard.focus())}
function closeModal(){ui.modal.classList.add('hidden');document.body.classList.remove('modal-open')}
function openAchievements(){openModal('ACHIEVEMENTS','The archive kept score.',`<div class="story-modal"><div class="modal-portrait mini-avatar" aria-hidden="true"></div><div><p class="story-lead">You stayed long enough for the archive to notice.</p><p>${state.found.length} optional notes found. ${state.xp} XP earned.</p><p class="story-small">The number is fake. The curiosity is not.</p></div></div>`)}
function openQuests(){openModal('QUESTS','The chapters completed so far.',`<div class="quest-story">${quests.map(([t,d,s],i)=>`<article class="quest ${s}"><div class="quest-meta">${s==='done'?'ACHIEVED':'PENDING'} · ${String(i+1).padStart(2,'0')}</div><div class="quest-title">${t}</div><div class="quest-copy">${d}</div></article>`).join('')}</div>`)}
function openToolkit(){openModal('TOOLKIT','The equipment behind the work.',`<div class="tool-story">${tools.map(([n,d],i)=>`<article class="tool"><div class="tool-index">${String(i+1).padStart(2,'0')}</div><div><div class="tool-name">${n}</div><div class="tool-note">${d}</div></div></article>`).join('')}</div>`)}
function openProfile(){openModal('PROFILE','RAIYAN KABIR · LV 29',`<div class="profile-sheet"><div class="avatar-column"><div class="pixel-portrait large" role="img" aria-label="Detailed monochrome pixel avatar of Raiyan Kabir wearing glasses"><div class="hair"></div><div class="face"></div><div class="earL"></div><div class="earR"></div><div class="frameL"></div><div class="frameR"></div><div class="bridge"></div><div class="eye1"></div><div class="eye2"></div><div class="nose"></div><div class="mouth"></div><div class="chin"></div><div class="neck"></div><div class="shirt"></div><div class="collar"></div></div><div class="avatar-caption">AFFILIATE / PARTNERSHIPS / GROWTH</div></div><div class="profile-copy"><div class="profile-title">RAIYAN KABIR</div><div class="profile-sub">AFFILIATE & PARTNERSHIPS GROWTH OPERATOR</div><div class="profile-block"><strong>MONSTERCLAW</strong><span>Managed affiliate programs, recruited partners, handled communication, reviewed performance, optimized campaigns and led roughly five affiliate managers for about 1.5 years.</span></div><div class="profile-block"><strong>TRUELY ESIM</strong><span>Ran international affiliate recruitment and partner operations across a working pipeline of roughly 2,000 leads, 300 outreaches, 211 replies and about 100 qualified prospects.</span></div><div class="profile-block"><strong>ZAGER GUITARS</strong><span>Supported creator partnership operations and coordinated 80+ guitar shipments to creators across the US and Canada.</span></div><div class="profile-block"><strong>CORE WORK</strong><span>Affiliate recruitment, publisher sourcing, lead management, outreach, partnership communications, activation, lifecycle management, data analysis, reporting and campaign optimization.</span></div></div></div>`)}
function openContact(){openModal('CONTACT','The cleanest way to continue the story.',`<div class="contact-story"><div class="contact-panel"><div class="contact-kicker">OPEN A CHANNEL</div><div class="contact-title">EMAIL RAIYAN</div><p>For work, partnerships, campaigns, growth problems or systems that need fixing.</p><a class="contact-link" href="mailto:raiyang3@gmail.com">raiyang3@gmail.com</a></div><div class="contact-panel alt"><div class="contact-kicker">NEXT CHAPTER</div><div class="contact-title">START A CONVERSATION</div><p>Tell him what needs to grow, what is stuck, or what needs a better operating system.</p><a class="contact-link" href="mailto:raiyang3@gmail.com?subject=Let's%20talk">START TRANSMISSION</a></div></div>`)}
function openHome(){closeModal();clearInterval(state.timer);state.started=false;state.index=0;state.history=[];state.xp=0;state.found=[];state.enterCount=0;state.achievementsUnlocked=false;ui.achievements.hidden=true;ui.achievements.classList.remove('unlocked');save();ui.experience.classList.add('hidden');ui.start.classList.remove('hidden');ui.begin.focus();stopAmbient()}
function toggleSound(){state.sound=!state.sound;ui.sound.textContent=state.sound?'SOUND ON':'SOUND OFF';ui.sound.setAttribute('aria-pressed',String(state.sound));if(state.sound){ensureAudio();startAmbient()}else stopAmbient();save()}
function start(){if(state.started)return;state.started=true;ui.start.classList.add('hidden');ui.experience.classList.remove('hidden');ensureAudio();startAmbient();renderScene();save()}
ui.begin.onclick=start;ui.continue.onclick=e=>{e.stopPropagation();next()};ui.card.onclick=e=>{if(e.target.closest('.choice-btn'))return;next()};ui.back.onclick=back;ui.sound.onclick=toggleSound;ui.quests.onclick=openQuests;ui.toolkit.onclick=openToolkit;ui.profile.onclick=openProfile;ui.contact.onclick=openContact;ui.home.onclick=openHome;ui.achievements.onclick=openAchievements;ui.modalClose.onclick=closeModal;ui.backdrop.onclick=closeModal;
window.addEventListener('keydown',e=>{if(e.key==='Enter'&&!state.started){e.preventDefault();start();return}if(!ui.modal.classList.contains('hidden')){if(e.key==='Escape'){e.preventDefault();closeModal()}return}if(!state.started)return;if(e.key==='Enter'){e.preventDefault();state.enterCount++;if(state.enterCount>=12)unlockAchievements();next()}else if(e.key===' '||e.key==='ArrowRight'){e.preventDefault();next()}else if(e.key==='Backspace'||e.key==='ArrowLeft'){e.preventDefault();back()}else if(/^[1-3]$/.test(e.key)&&current().choices){const i=Number(e.key)-1;if(current().choices[i])choose(i,current().choices[i].next)}else if(e.key.toLowerCase()==='q')openQuests();else if(e.key.toLowerCase()==='t')openToolkit();else if(e.key.toLowerCase()==='p')openProfile();else if(e.key.toLowerCase()==='c')openContact();else if(e.key.toLowerCase()==='h')openHome()});
load();ui.sound.textContent=state.sound?'SOUND ON':'SOUND OFF';ui.sound.setAttribute('aria-pressed',String(state.sound));if(state.started){ui.start.classList.add('hidden');ui.experience.classList.remove('hidden');if(state.achievementsUnlocked)ui.achievements.hidden=false;ensureAudio();startAmbient();renderScene()}
