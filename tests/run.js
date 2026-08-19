/* THE ARCHIVE // V1.2 TEST RUNNER */
const h=require('./helpers');

(async()=>{
  const files=['00-regression','01-fout','02-migration','03-tier','04-variant','05-games-alt','06-tier3d','07-budget'];
  for(const f of files){
    console.log('RUN tests/'+f+'.js');
    try{await require('./'+f)(h)}
    catch(e){h.section('CRASH');h.ok(false,f+' crashed: '+e.message);console.log(e.stack)}
  }
  h.report();
})();