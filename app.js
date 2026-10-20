(() => {
'use strict';
const QUESTIONS=window.DP700_QUESTIONS||[];
const KEY='fabric-dp700-simulator-v1';
const $=x=>document.querySelector(x);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=Object.fromEntries(QUESTIONS.map(q=>[q.id,q]));
const allTopics=[...new Set(QUESTIONS.map(q=>q.topic))].sort((a,b)=>a.localeCompare(b,'es'));
function fresh(){return {v:1,history:{},stars:[],session:null,settings:{count:40,minutes:90,filter:'all',topic:'all',mode:'practice'},date:null}}
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&v.v===1)return {...fresh(),...v,settings:{...fresh().settings,...(v.settings||{})}}}catch(e){console.warn(e)}return fresh()}
let app=load(),page='home',bankFilter='all',bankTopic='all',bankSearch='',toastTimer=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(app))}catch(e){msg('No se ha podido guardar el progreso en este navegador')}}
const el=(tag,cl,txt)=>{const x=document.createElement(tag);if(cl)x.className=cl;if(txt!==undefined)x.textContent=txt;return x};
const validHistory=q=>app.history[q.id]||{ok:0,bad:0,last:null};
const attempted=q=>{const h=validHistory(q);return h.ok+h.bad>0};
const wrongs=()=>QUESTIONS.filter(q=>validHistory(q).bad>0);
const status=q=>{const h=validHistory(q);return h.bad>0?'Mal respondida':h.ok>0?'Acertada':'Sin practicar'};
const manual=q=>q.needsManualReview;
const lbl=q=>q.type==='multiple'?'Selección múltiple':manual(q)?'Revisión visual / manual':'Opción única';
function msg(s){const t=$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2800)}
function fmtTime(ms){const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function timeLeft(){let s=app.session;if(!s||s.mode!=='exam'||s.finished)return null;return s.startedAt+s.minutes*60000-Date.now()}
function updateClock(){const s=app.session;if(!s||s.finished||s.mode!=='exam')return;let left=timeLeft();if(left<=0){finish(true);return}const x=$('#clock');if(x)x.textContent='⏱ '+fmtTime(left)}
function navigate(n){page=n;draw();window.scrollTo({top:0,behavior:'instant'})}
function stats(){let tried=0,correct=0,wrong=0;for(const q of QUESTIONS){const h=validHistory(q);if(h.ok+h.bad){tried++;correct+=h.ok;wrong+=h.bad}}return {tried,correct,wrong,pct:correct+wrong?Math.round(100*correct/(correct+wrong)):0}}
function header(eyebrow,title,subtitle=''){return `<div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="subtitle">${subtitle}</p>`}
function statCard(value,label){return `<article class="stats-card card"><strong>${value}</strong><span>${label}</span></article>`}
function home(){const s=stats();let html=header('Preparación de certificación','Microsoft Fabric DP-700','Banco de 139 preguntas del documento proporcionado. Práctica, simulacro cronometrado y revisión de errores.');html+=`<div class="grid mb">${statCard(QUESTIONS.length,'Preguntas en el banco')}${statCard(s.tried,'Preguntas practicadas')}${statCard(s.pct+' %','Acierto en intentos corregidos')}</div>`;
 html+=`<div class="hero mb"><div class="eyebrow" style="color:#bdbdff">Prepárate a tu ritmo</div><h2>Practica de forma inteligente</h2><p>Responde, consulta las explicaciones del documento y céntrate en los conceptos en los que más fallas. Los ejercicios gráficos que no se pueden corregir automáticamente se evalúan manualmente.</p><div class="row"><button class="btn" id="startPractice">Iniciar práctica</button><button class="btn" id="startExam">Simulacro de examen</button></div></div>`;
 if(app.session&&!app.session.finished)html+=`<div class="card pad mb"><h3>Tienes una sesión sin terminar</h3><p class="muted small">${app.session.mode==='exam'?'Simulacro':'Práctica'} · ${app.session.ids.length} preguntas · pregunta ${app.session.i+1}</p><button class="btn primary" id="resume">Continuar sesión</button></div>`;
 html+=`<div class="twocol"><div class="card pad"><h3>Qué contiene este simulador</h3><p class="small muted">${QUESTIONS.filter(q=>q.type==='single').length} preguntas de opción única, ${QUESTIONS.filter(q=>q.type==='multiple').length} multirrespuesta y ${QUESTIONS.filter(q=>manual(q)).length} ejercicios de revisión manual.</p><p class="small muted">Incluye los casos de estudio y las imágenes del documento original.</p><button class="btn" data-go="questions">Explorar preguntas</button></div><div class="card pad"><h3>Estudio dirigido</h3><p class="small muted">${wrongs().length} preguntas con algún fallo y ${app.stars.length} marcadas como favoritas.</p><div class="row"><button class="btn" data-go="errors">Repasar errores</button><button class="btn" data-go="stats">Ver rendimiento</button></div></div></div>`;
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;$('#startPractice').onclick=()=>{app.settings.mode='practice';save();navigate('configure')};$('#startExam').onclick=()=>{app.settings.mode='exam';save();navigate('configure')};if($('#resume'))$('#resume').onclick=()=>navigate('practice');wireGo()}
function configure(){let x=app.settings;
 const options=(vals,selected)=>vals.map(v=>`<option value="${esc(v[0])}" ${v[0]===selected?'selected':''}>${esc(v[1])}</option>`).join('');
 let html=header('Personaliza tu estudio','Nueva sesión','Configura un ejercicio breve o un simulacro completo. No se mezclará tu historial con el de Databricks.');
 html+=`<div class="card pad"><div class="toolbar mb"><label class="field">Modo<select id="setMode">${options([['practice','Práctica (corrección inmediata)'],['exam','Examen (corrección al finalizar)']],x.mode)}</select></label><label class="field">Cantidad<select id="setCount">${options([10,20,40,60,100,139].map(v=>[String(v),v+' preguntas']),String(x.count))}</select></label><label class="field">Filtro<select id="setFilter">${options([['all','Todas'],['errors','Falladas'],['new','No practicadas'],['star','Favoritas'],['visual','Revisión manual'],['cases','Casos de estudio']],x.filter)}</select></label><label class="field">Temática<select id="setTopic">${options([['all','Todas las temáticas'],...allTopics.map(t=>[t,t])],x.topic)}</select></label><label class="field">Duración del simulacro (min)<input id="setTime" type="number" min="10" max="240" value="${x.minutes}"></label></div><p class="hint">Las preguntas se seleccionan aleatoriamente sin repetir dentro de la sesión. En modo examen las soluciones se muestran después de terminar. Las preguntas gráficas requieren una evaluación manual y no entran en la nota hasta que se califican.</p><div class="row mt"><button class="btn primary" id="run">Crear sesión</button><button class="btn" data-go="home">Cancelar</button></div></div>`;
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;
 for(let [id,field,fn] of [['setMode','mode',v=>v],['setCount','count',Number],['setFilter','filter',v=>v],['setTopic','topic',v=>v],['setTime','minutes',Number]]){$('#'+id).onchange=e=>{app.settings[field]=fn(e.target.value);save()}}$('#run').onclick=()=>start();wireGo()}
function eligible(){const x=app.settings;return QUESTIONS.filter(q=>(x.topic==='all'||q.topic===x.topic)&&(
 x.filter==='all'||x.filter==='errors'&&validHistory(q).bad>0||x.filter==='new'&&!attempted(q)||x.filter==='star'&&app.stars.includes(q.id)||x.filter==='visual'&&manual(q)||x.filter==='cases'&&q.caseStudy))}
function caseName(q){const m=q.title.match(/Caso de estudio\s*[–—-]\s*([^)]+)/i);return q.caseStudy?(m?m[1].trim():'Caso de estudio'):null}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function groupedSelection(candidates,limit){
 // Cada caso es una unidad indivisible: nunca se mezcla o parte entre preguntas sueltas.
 const cases=new Map(),units=[];
 for(const q of candidates){const key=caseName(q);if(key){if(!cases.has(key)){const unit=[];cases.set(key,unit);units.push(unit)}cases.get(key).push(q.id)}else units.push([q.id])}
 cases.forEach(ids=>ids.sort((a,b)=>a-b));shuffle(units);
 const chosen=[];for(const unit of units){if(chosen.length+unit.length<=limit)chosen.push(...unit)}
 // Si el filtro sólo contiene un caso más grande que el límite, mantenerlo íntegro.
 if(!chosen.length&&units.length)chosen.push(...units[0]);
 return chosen;
}
function start(idsOverride=null){const candidates=idsOverride?idsOverride.map(id=>byId[id]).filter(Boolean):eligible();if(!candidates.length){msg('El filtro seleccionado no tiene preguntas');return}if(app.session&&!app.session.finished&&!confirm('Hay una sesión sin terminar. ¿Quieres sustituirla?'))return;
 const ids=idsOverride||groupedSelection(candidates,Number(app.settings.count)||40);
 app.session={mode:app.settings.mode,ids,i:0,answers:{},submitted:{},manual:{},reviewed:{},startedAt:Date.now(),minutes:Math.max(10,Math.min(240,Number(app.settings.minutes)||90)),finished:false};save();navigate('practice')}
function current(){const s=app.session;return s?byId[s.ids[s.i]]:null}
function hasAnswer(q){const s=app.session;return q.needsManualReview?true:!!(s.answers[q.id]?.length)}
function graded(q){const s=app.session;return Boolean(s.submitted[q.id])}
function grade(q){const s=app.session,sel=s.answers[q.id]||[];return !manual(q)&&sel.length===q.correct.length&&sel.every(k=>q.correct.includes(k))}
function record(q,good){const h=validHistory(q);h[good?'ok':'bad']++;h.last=Date.now();app.history[q.id]=h}
function submit(){let s=app.session,q=current();if(!s||!q||s.finished||s.mode!=='practice'||s.submitted[q.id]||!hasAnswer(q))return;if(!manual(q)){s.submitted[q.id]=true;record(q,grade(q))}else{s.submitted[q.id]=true}s.reviewed[q.id]=true;save();draw()}
function setManual(good){let s=app.session,q=current();if(!s||!q||!manual(q)||!(s.finished||s.mode==='practice'&&s.submitted[q.id])||s.manual[q.id]!==undefined)return;s.manual[q.id]=good;record(q,good);save();draw()}
function selectOption(key){let s=app.session,q=current();if(!s||!q||s.finished||s.submitted[q.id])return;let a=s.answers[q.id]||[];s.answers[q.id]=q.type==='multiple'?(a.includes(key)?a.filter(x=>x!==key):[...a,key]):[key];save();draw()}
function reviewed(){let s=app.session,q=current();if(!s||!q||s.finished)return;s.reviewed[q.id]=true;save();draw()}
function move(i){const s=app.session;if(!s)return;s.i=Math.max(0,Math.min(s.ids.length-1,i));save();draw();window.scrollTo({top:0,behavior:'instant'})}
function finish(expired=false){let s=app.session;if(!s||s.finished)return;if(!expired&&!confirm('¿Finalizar y corregir el examen o la práctica?'))return;s.finished=true;
 if(s.mode==='exam')for(const id of s.ids){let q=byId[id];if(!manual(q)&&s.answers[id]?.length&&!s.submitted[id]){s.submitted[id]=true;record(q,grade(q))}}
 save();draw();msg(expired?'Tiempo agotado. Se ha corregido el simulacro.':'Sesión finalizada')}
function result(){const s=app.session;if(!s)return{ok:0,bad:0,manual:0,seen:0};let ok=0,bad=0,ungraded=0,seen=0;for(const id of s.ids){const q=byId[id];if(s.answers[id]?.length||s.reviewed[id])seen++;if(manual(q)){if(s.manual[id]===true)ok++;else if(s.manual[id]===false)bad++;else ungraded++}else if(s.submitted[id]){if(grade(q))ok++;else bad++}}return{ok,bad,ungraded,seen,pct:ok+bad?Math.round(ok*100/(ok+bad)):null}}
function practice(){let s=app.session;if(!s){navigate('home');return}const q=current();if(!q){navigate('home');return}let n=s.ids.length;const r=result();
 let html=`<div class="eyebrow">${s.mode==='exam'?'SIMULACRO CRONOMETRADO':'MODO PRÁCTICA'}</div><div class="question-top"><h1 class="question-title">Pregunta ${s.i+1} de ${n} <span class="muted small">· Original #${q.id}</span></h1><div class="row"><span class="pill" id="clock">${s.mode==='exam'?(s.finished?'Finalizado':'⏱ '+fmtTime(timeLeft())):'Sin límite de tiempo'}</span><button class="btn sm" id="bookmark">${app.stars.includes(q.id)?'★ Favorita':'☆ Guardar'}</button></div></div><div class="progress"><div style="width:${Math.round(100*(s.i+1)/n)}%"></div></div>`;
 if(s.finished)html+=`<div class="card pad mb"><div class="between row"><div><strong>Sesión completada</strong><div class="small muted">${r.ok} aciertos · ${r.bad} fallos · ${r.ungraded} preguntas pendientes de autocorrección</div></div><button class="btn sm" id="backHome">Volver al inicio</button></div></div>`;
 html+=`<section class="card pad"><div class="tag-row mb"><span class="chip">${esc(q.topic)}</span><span class="chip ${manual(q)?'warn':''}">${esc(lbl(q))}</span>${q.caseStudy?'<span class="chip">Caso de estudio</span>':''}${q.repeated?'<span class="chip warn">Marcada como repetida en origen</span>':''}</div>`;
 if(q.caseStudy){const name=caseName(q);const members=s.ids.filter(id=>caseName(byId[id])===name);const at=members.indexOf(q.id)+1;html+=`<div class="case-heading"><strong>${esc(name)}</strong><span>Pregunta ${at} de ${members.length} de este caso</span></div>`}
 if(q.context)html+=`<details class="scenario" ${q.caseStudy?'open':''}><summary>Consultar escenario y requisitos del caso</summary><div class="question-text">${q.context}</div></details>`;
 html+=`<div class="question-text">${q.stem}</div>`;
 if(!manual(q)){
  html+=`<div class="question-options" role="group" aria-label="Opciones de respuesta">`;
  for(const op of q.options){const chosen=(s.answers[q.id]||[]).includes(op.key),isKey=q.correct.includes(op.key),show=s.finished||s.mode==='practice'&&graded(q),cl=(show&&isKey?' good':show&&chosen&&!isKey?' bad':chosen?' active':'');
    html+=`<button class="option${cl}" data-opt="${op.key}" ${(s.finished||graded(q))?'disabled':''}><span class="optkey">${op.key}</span><span class="option-content">${op.html}</span></button>`}
  html+='</div>';
  if(q.type==='multiple')html+='<p class="markline">Selecciona todas las opciones correctas.</p>';
 }else html+='<p class="source-warning">Este ejercicio usa una figura, una combinación de desplegables o una respuesta no evaluable automáticamente. Resuélvelo con la imagen y compáralo después con la explicación original. No se inventarán opciones ni una calificación.</p>';
 if(!s.finished){if(s.mode==='practice')html+=`<div class="row mt"><button class="btn primary" id="submit" ${(!hasAnswer(q)||graded(q))?'disabled':''}>${manual(q)?'Mostrar solución':'Comprobar respuesta'}</button></div>`;else if(manual(q))html+=`<div class="row mt"><button class="btn" id="markReviewed" ${s.reviewed[q.id]?'disabled':''}>${s.reviewed[q.id]?'✓ Revisada':'Marcar como revisada'}</button></div>`}
 const show=s.finished||s.mode==='practice'&&graded(q);
 if(show){let good=manual(q)?s.manual[q.id]:s.submitted[q.id]?grade(q):undefined;
 let label=good===true?'Correcta':good===false?'Incorrecta':manual(q)?'Corrección manual':'No respondida';
 html+=`<div class="feedback ${good===true?'good':good===false?'bad':''}"><h3>${label}</h3>`;
 if(!manual(q))html+=`<p class="small">Respuesta del documento: <strong>${q.correct.join(', ')}</strong></p>`;
 html+=`<details open><summary><strong>Explicación del documento original</strong></summary><div class="rationale mt">${q.explanation}</div></details><div class="small muted mt">Fuente: documento de estudio proporcionado. No se ha verificado externamente la vigencia técnica de cada respuesta.</div>`;
 if(manual(q)&&s.manual[q.id]===undefined)html+=`<div class="row mt"><button class="btn primary" id="manualGood">La he acertado</button><button class="btn" id="manualBad">La he fallado</button></div>`;
 html+='</div>'}
 html+=`<div class="footer-actions"><button class="btn" id="prev" ${s.i===0?'disabled':''}>← Anterior</button><div class="row"><button class="btn" id="endSession">${s.finished?'Nueva sesión':'Finalizar sesión'}</button><button class="btn primary" id="next" ${s.i===n-1?'disabled':''}>Siguiente →</button></div></div></section>`;
 html+=`<div class="card pad mt"><div class="row between mb"><h3>Navegación por preguntas</h3><span class="muted tiny">${r.seen} de ${n} respondidas o revisadas</span></div><div class="question-grid">${s.ids.map((id,i)=>`<button data-jump="${i}" class="${i===s.i?'active':s.answers[id]?.length||s.reviewed[id]?'done':''} ${app.stars.includes(id)?'starred':''}" title="Pregunta original ${id}">${i+1}</button>`).join('')}</div></div>`;
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;
 $('#bookmark').onclick=()=>{app.stars=app.stars.includes(q.id)?app.stars.filter(x=>x!==q.id):[...app.stars,q.id];save();draw()};
 document.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>selectOption(b.dataset.opt));
 if($('#submit'))$('#submit').onclick=submit;if($('#markReviewed'))$('#markReviewed').onclick=reviewed;
 if($('#manualGood'))$('#manualGood').onclick=()=>setManual(true);if($('#manualBad'))$('#manualBad').onclick=()=>setManual(false);
 $('#prev').onclick=()=>move(s.i-1);$('#next').onclick=()=>move(s.i+1);$('#endSession').onclick=()=>s.finished?navigate('settings'):finish();
 if($('#backHome'))$('#backHome').onclick=()=>navigate('home');document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>move(Number(b.dataset.jump)));updateClock()}
function listQuestions(filter,topic,search){let list=QUESTIONS.filter(q=>(topic==='all'||q.topic===topic)&&(filter==='all'||filter==='errors'&&validHistory(q).bad>0||filter==='favs'&&app.stars.includes(q.id)||filter==='manual'&&manual(q)||filter==='cases'&&q.caseStudy));if(search){let v=search.toLocaleLowerCase('es');list=list.filter(q=>String(q.id).includes(v)||q.topic.toLocaleLowerCase('es').includes(v)||q.title.toLocaleLowerCase('es').includes(v)||q.stem.replace(/<[^>]*>/g,' ').toLocaleLowerCase('es').includes(v))}return list}
function listing(p='questions'){
 const initial=p==='errors'?'errors':p==='favs'?'favs':'all';
 const make=()=>{const list=listQuestions(bankFilter,bankTopic,bankSearch),opts=(choices,v)=>choices.map(o=>`<option value="${esc(o[0])}" ${o[0]===v?'selected':''}>${esc(o[1])}</option>`).join('');
 const html=header('Banco de estudio',p==='errors'?'Repasar errores':p==='favs'?'Preguntas favoritas':'Banco de preguntas',`${list.length} preguntas · filtra y abre la que te interese.`)+`<div class="card pad mb"><div class="toolbar"><label class="field">Estado<select id="bankFilter">${opts([['all','Todas'],['errors','Con algún error'],['favs','Favoritas'],['manual','Revisión manual'],['cases','Casos de estudio']],bankFilter)}</select></label><label class="field">Temática<select id="bankTopic">${opts([['all','Todas'],...allTopics.map(t=>[t,t])],bankTopic)}</select></label><label class="field">Buscar<input id="bankSearch" placeholder="Número o contenido" value="${esc(bankSearch)}"></label></div></div>`+(list.length?`<div class="qtable">${list.map(q=>`<div class="qrow"><div><strong>Pregunta ${q.id} · ${esc(q.topic)}</strong><small>${lbl(q)} · ${status(q)}${q.caseStudy?' · Caso de estudio':''}</small></div><button class="btn sm" data-open="${q.id}">Practicar</button></div>`).join('')}</div>`:'<div class="empty">No se han encontrado preguntas con este filtro.</div>');
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;
 $('#bankFilter').onchange=e=>{bankFilter=e.target.value;make()};$('#bankTopic').onchange=e=>{bankTopic=e.target.value;make()};$('#bankSearch').oninput=e=>{let pos=e.target.selectionStart;bankSearch=e.target.value;make();let input=$('#bankSearch');input.focus();input.setSelectionRange(pos,pos)};document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{app.settings.mode='practice';app.settings.count=1;start([Number(b.dataset.open)])})}
 bankFilter=initial;make()}
function statsPage(){let x=stats(),html=header('Aprendizaje continuo','Tus estadísticas','El acierto se calcula sobre intentos corregidos; las preguntas visuales pendientes no afectan al porcentaje.');html+=`<div class="grid mb">${statCard(x.tried+'/'+QUESTIONS.length,'Preguntas practicadas')}${statCard(x.correct+' / '+(x.correct+x.wrong),'Intentos acertados')}${statCard(x.pct+' %','Acierto global')}</div><div class="card pad"><h2>Rendimiento por temática</h2><div class="topics">`;
 for(const topic of allTopics){const list=QUESTIONS.filter(q=>q.topic===topic),a=list.reduce((s,q)=>s+validHistory(q).ok,0),b=list.reduce((s,q)=>s+validHistory(q).bad,0),rate=a+b?Math.round(100*a/(a+b)):0;
 html+=`<div><div class="topic-line"><strong>${esc(topic)}</strong><span>${a+b?rate+' %':'Sin intentos'} · ${a+b} intentos · ${list.length} preguntas</span></div><div class="bar"><span style="width:${rate}%"></span></div></div>`}
 html+=`</div></div><p class="small muted mt">La clasificación por temática es orientativa y se ha generado automáticamente a partir de los enunciados del documento.</p>`;$('#main').innerHTML=`<div class="wrap">${html}</div>`}
function settingsPage(){let html=header('Tu progreso','Datos y ajustes','Los datos del simulador se guardan únicamente en este navegador con una clave separada de Databricks.');html+=`<div class="card pad stack"><h3>Seguridad de tu progreso</h3><p class="small muted">Exporta un archivo JSON para copiar o trasladar favoritos, errores y sesiones. No se envían datos a servidores externos.</p><div class="row"><button class="btn primary" id="export">Exportar progreso</button><label class="btn" for="import" style="cursor:pointer">Importar JSON</label><input id="import" type="file" accept="application/json" hidden><button class="btn danger" id="reset">Borrar progreso local</button></div><div class="divider"></div><h3>Empezar otra sesión</h3><p class="small muted">Puedes configurar un examen nuevo en cualquier momento.</p><button class="btn" id="configure">Configurar sesión</button><p class="source-warning">Las respuestas proceden del documento compartido y pueden incluir información desactualizada. El simulador no verifica automáticamente la documentación de Microsoft Learn.</p></div>`;$('#main').innerHTML=`<div class="wrap">${html}</div>`;
 $('#configure').onclick=()=>navigate('configure');$('#export').onclick=()=>{const out=JSON.stringify({product:'fabric-dp700-exam-simulator',exportedAt:new Date().toISOString(),data:app},null,2),blob=new Blob([out],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='fabric_dp700_progreso_'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 $('#import').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const x=JSON.parse(await f.text());if(x.product!=='fabric-dp700-exam-simulator'||x.data?.v!==1)throw Error('El archivo no es una copia válida del simulador DP-700');if(confirm('¿Sustituir el progreso actual por la copia?')){app={...fresh(),...x.data};save();navigate('home');msg('Progreso importado')}}catch(err){alert('No se pudo importar: '+err.message)}e.target.value=''};
 $('#reset').onclick=()=>{if(confirm('¿Borrar definitivamente todos los intentos y favoritos de Fabric en este navegador?')){app=fresh();save();navigate('home')}}}
function wireGo(){document.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>navigate(x.dataset.go))}
function draw(){const navPage=page==='configure'?'settings':page==='practice'?'home':page;document.querySelectorAll('.navbtn').forEach(x=>x.classList.toggle('selected',x.dataset.page===navPage));const x=stats();$('#sideSummary').innerHTML=`<strong>${x.tried} / ${QUESTIONS.length}</strong>preguntas practicadas<br><strong style="font-size:18px;margin-top:7px">${x.pct} %</strong>acierto total`;
 if(page==='home')home();else if(page==='configure')configure();else if(page==='practice')practice();else if(page==='questions'||page==='errors'||page==='favs')listing(page);else if(page==='stats')statsPage();else if(page==='settings')settingsPage();else home();
 document.querySelectorAll('.doc-image').forEach(i=>i.addEventListener('click',()=>{let v=$('#imageViewer');$('#viewerImg').src=i.src;v.classList.remove('hidden')}))}
 document.querySelectorAll('.navbtn').forEach(x=>x.onclick=()=>navigate(x.dataset.page));$('#closeViewer').onclick=()=>$('#imageViewer').classList.add('hidden');$('#imageViewer').onclick=e=>{if(e.target.id==='imageViewer')e.currentTarget.classList.add('hidden')};
 window.addEventListener('keydown',e=>{if(e.key==='Escape')$('#imageViewer').classList.add('hidden');if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName))return;if(page!=='practice'||!app.session)return;if(e.key==='ArrowRight')move(app.session.i+1);if(e.key==='ArrowLeft')move(app.session.i-1);if(/^[1-7]$/.test(e.key)){const q=current();if(q&&!manual(q))selectOption(String.fromCharCode(64+Number(e.key)))}});
 setInterval(updateClock,1000);
 if(!QUESTIONS.length){$('#main').textContent='No se ha podido cargar el banco. Comprueba que questions.js está junto a index.html.';return}
 draw();
})();