/* THE ARCHIVE // V1.2 SIGNAL RERUN DATA */
/* The second copy of Raiyan's stories — "THE RERUN". Loaded before script.js. */

const ALT_GATE_LINES={
  altRouteRelay:'The route still needs its last relay tested.',
  altCableTriage:'One wire still has to be cut by hand.',
  altSignalChain:'The chain cannot close until it is tapped back.',
  altAsyncBatch:'The queue will not forgive the backlog.'
};

const ALT_ORDER=['altRouteRelay','altCableTriage','altSignalChain','altAsyncBatch'];

function remainingSignalGames(){return ALT_ORDER.filter(id=>!state.signalFlags[id])}

const SIGNAL_SCENES=[
  {id:'sig1',chapter:'SIGNAL // OPEN',speaker:'* GUIDE',text:'You found the rerun.',next:'sig2'},
  {id:'sig2',chapter:'SIGNAL // OPEN',speaker:'* GUIDE',text:'The archive keeps two copies of every story.',next:'sig3'},
  {id:'sig3',chapter:'SIGNAL // OPEN',speaker:'* GUIDE',text:'This one is the signal copy. Rewritten. Reframed. Replayed.',next:'sig4'},
  {id:'sig4',chapter:'SIGNAL // OPEN',speaker:'* GUIDE',text:'Same lessons. Different light.',choices:[{label:'RUN THE RERUN',next:'sig5'},{label:'RETURN TO THE ORIGINAL',next:'__archive__'}]},
  {id:'sig5',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'It still starts with research.',next:'sig5b'},
  {id:'sig5b',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'Finding the creators whose audiences fit the offer.',next:'sig6'},
  {id:'sig6',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'The list is a relay now, not a roster.',next:'sig6b'},
  {id:'sig6b',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'Every name waits its turn on the shortest path.',next:'sig7'},
  {id:'sig7',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'The packet moves one hop at a time.',next:'sig7b',game:'altRouteRelay'},
  {id:'sig7b',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'Relays on the main line run themselves.',next:'sig8'},
  {id:'sig8',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'The email changed shape in the rerun.',next:'sig8b'},
  {id:'sig8b',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'Shorter. Sharper. One reason to reply.',next:'sig8c'},
  {id:'sig8c',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'The box wants exactly one wire cut.',next:'sig9',game:'altCableTriage'},
  {id:'sig9',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'When a partner replies, the call becomes the test.',next:'sig9b'},
  {id:'sig9b',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'The chain holds only if every link is tapped back in order.',next:'sig10',game:'altSignalChain'},
  {id:'sig10',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'Onboarding never ends in the rerun.',next:'sig10b'},
  {id:'sig10b',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'It hands off to a queue that never stops.',next:'sig10c'},
  {id:'sig10c',chapter:'SIGNAL // JOURNEY',speaker:'* GUIDE',text:'Clear the batch before the backlog wins.',next:'sig11',game:'altAsyncBatch'},
  {id:'sig11',chapter:'SIGNAL // CHECKPOINT',speaker:'* GUIDE',text:'Four reruns lived. The signal knows you now.',next:'sig12',secret:101},
  {id:'sig12',chapter:'SIGNAL // CHECKPOINT',speaker:'* GUIDE',text:'Research. Outreach. Calls. Handoffs. Closes.',next:'sig12b'},
  {id:'sig12b',chapter:'SIGNAL // CHECKPOINT',speaker:'* GUIDE',text:'The numbers rerun the same way: 2,000 leads. 300 outreaches. 211 replies. 100 prospects.',next:'sig13',secret:102},
  {id:'sig13',chapter:'SIGNAL // SYSTEMS',speaker:'* GUIDE',text:'Systems keep the memory. People keep the judgment.',next:'sig13b'},
  {id:'sig13b',chapter:'SIGNAL // SYSTEMS',speaker:'* GUIDE',text:'n8n files the leads. Sheets keep the status. Reports build themselves.',next:'sig14'},
  {id:'sig14',chapter:'SIGNAL // FIELD NOTES',speaker:'* GUIDE',text:'Creator logistics ship the same care — 80+ boxes across the border.',next:'sigGate'},
  {id:'sigGate',chapter:'SIGNAL // LAST PAGE',speaker:'* GUIDE',text:function(){const r=remainingSignalGames();if(r.length)return ALT_GATE_LINES[r[0]];return 'The rerun is complete. The vault is calling.'},game:function(){const r=remainingSignalGames();return r.length?r[0]:null},next:function(){return remainingSignalGames().length?'sigGate':'signalFinal'}},
  {id:'signalFinal',chapter:'SIGNAL // LAST PAGE',speaker:'* GUIDE',text:'Every signal chapter is lived through.',next:'signalFinal2'},
  {id:'signalFinal2',chapter:'SIGNAL // LAST PAGE',speaker:'* GUIDE',text:'One page remains — his own voice, rebuilt.',next:'signalFinal3'},
  {id:'signalFinal3',chapter:'SIGNAL // LAST PAGE',speaker:'* GUIDE',text:'Below the archive, below the signal, the vault waits for its keeper.',next:'signalFinal4',secret:103},
  {id:'signalFinal4',chapter:'SIGNAL // LAST PAGE',speaker:'* GUIDE',text:'Press the button in the lower left when you are ready.'}
];

const SIGNAL_ACHIEVEMENTS={
  altRouteRelay:{name:'SIGNAL RELAY',desc:'Routed the packet home.',icon:'◈'},
  altCableTriage:{name:'CABLE TRIAGE',desc:'Cut only what the box asked for.',icon:'⚡'},
  altSignalChain:{name:'SIGNAL CHAIN',desc:'Held the whole chain in memory.',icon:'❖'},
  altAsyncBatch:{name:'ASYNC BATCH',desc:'Outran the queue.',icon:'≋'},
  altAllGames:{name:'TRANSMISSION COMPLETE',desc:'Relived every story in the rerun.',icon:'◎'}
};
