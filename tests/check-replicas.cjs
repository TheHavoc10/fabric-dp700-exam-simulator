(function verification(){
 const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
 const context=vm.createContext({window:{},console});
 const paths=[
 'site-chunks/questions-01.js','site-chunks/questions-02.js','site-chunks/questions-03.js','site-chunks/questions-04.js',
 'interactive.js','special-answers.js','replicas.js','replica-ui.js'
 ];
 for(const path of paths)vm.runInContext(fs.readFileSync(path,'utf8'),context,{filename:path,timeout:12000});
 const {DP700_QUESTIONS:q,DP700_SPECIALS:s,DP700_INTERACTIVE:i,DP700_REPLICAS:r,DP700_UI:ui}=context.window;
 const normalize=v=>String(v||'').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^[\s.,;()'"]+|[\s.,;()'"]+$/g,'').replace(/\s+/g,' ').trim();
 assert.equal(q.length,139,'El banco debe mantener 139 preguntas');
 assert.equal(Object.keys(s).length,42,'El banco debe incluir 42 preguntas con campos');
 assert.equal(Object.keys(r).length,43,'Las 43 visuales deben tener una interacción');
 const missing=[];
 for(const [id,fields] of Object.entries(s)){
  const item=i[id],replica=r[id],ques=q.find(x=>x.id===Number(id));
  assert.ok(item&&replica&&ques,'Falta la configuración de '+id);
  const mapped=fields.map((f,idx)=>{
   const options=item.fields?.[idx]?.choices||[];
   if(!options.some(opt=>normalize(opt)===normalize(f.answer)))missing.push({id,idx,answer:f.answer,options});
   return {...f,choices:options};
  });
  const rendered=ui.render(ques,mapped,{},false);
  assert.ok(rendered.includes('replica-panel'),'No se genera UI '+id);
  if(replica.mode==='code'){
    const indexes=[...replica.code.matchAll(/\{\{(\d+)\}\}/g)].map(m=>Number(m[1]));
    assert.equal(indexes.length,fields.length,'Número incorrecto de huecos en '+id);
    for(let idx=0;idx<fields.length;idx++)assert.ok(indexes.includes(idx),'Falta hueco '+idx+' en '+id);
  }
 }
 assert.deepEqual(missing,[],'Todos los campos deben tener una opción exacta');
 const q54=q.find(x=>x.id===54);
 assert.equal(q54.type,'multiple');
 assert.equal(q54.options.length,4);
 assert.deepEqual(Array.from(q54.correct),['A','D']);
 assert.ok(q54.stem.includes('f10173eb9688aa9b'),'La imagen de contexto 54 debe conservarse');
 console.log('OK: 139 preguntas, 43 réplicas visuales, opciones correctas completas y cuatro registros de Q54');
})();
