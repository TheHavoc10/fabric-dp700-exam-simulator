(() => {
'use strict';
const QUESTIONS=window.DP700_QUESTIONS||[];
const STUDY=window.DP700_STUDY||{sections:[],terms:[]};
const SPECIALS=window.DP700_SPECIALS||{};
const INTERACTIVES=window.DP700_INTERACTIVE||{};
function slotsFor(q){const fields=SPECIALS[q.id]||[];const curated=INTERACTIVES[q.id]?.fields||[];
 return fields.map((f,i)=>{const choices=curated[i]?.choices;
  return choices?.length&&choices.some(c=>normalizeAns(c)===normalizeAns(f.answer))?{...f,choices}:f;
 });}

const KEY='fabric-dp700-simulator-v1';
const $=x=>document.querySelector(x);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=Object.fromEntries(QUESTIONS.map(q=>[q.id,q]));
const allTopics=[...new Set(QUESTIONS.map(q=>q.topic))].sort((a,b)=>a.localeCompare(b,'es'));
function fresh(){return {v:1,history:{},stars:[],session:null,settings:{count:40,minutes:'',timePreferenceV2:true,filter:'all',topic:'all',mode:'practice'},date:null}}
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&v.v===1){const settings={...fresh().settings,...(v.settings||{})};if(!v.settings?.timePreferenceV2){if(Number(settings.minutes)===90)settings.minutes='';settings.timePreferenceV2=true}return {...fresh(),...v,settings}}}catch(e){console.warn(e)}return fresh()}
let app=load(),page='home',bankFilter='all',bankTopic='all',bankSearch='',toastTimer=null,glossaryFilter='Todas',glossarySearch='',glossaryFlipped={};
const caseTabByName=Object.create(null);
const casePanelCache=new Map();
function save(){try{localStorage.setItem(KEY,JSON.stringify(app))}catch(e){msg('No se ha podido guardar el progreso en este navegador')}}
const el=(tag,cl,txt)=>{const x=document.createElement(tag);if(cl)x.className=cl;if(txt!==undefined)x.textContent=txt;return x};
const validHistory=q=>app.history[q.id]||{ok:0,bad:0,last:null};
const attempted=q=>{const h=validHistory(q);return h.ok+h.bad>0};
const wrongs=()=>QUESTIONS.filter(q=>validHistory(q).bad>0);
const status=q=>{const h=validHistory(q);return h.bad>0?'Mal respondida':h.ok>0?'Acertada':'Sin practicar'};
const manual=q=>q.needsManualReview && !(slotsFor(q).length&&slotsFor(q).every(f=>f.kind==='boolean'||(f.choices?.length>0)));
const lbl=q=>slotsFor(q).length?'Completar respuesta'+(manual(q)?' · evaluación guiada':''):q.type==='multiple'?'Selección múltiple':manual(q)?'Revisión visual / manual':'Opción única';
function msg(s){const t=$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2800)}
function fmtTime(ms){const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function timeLeft(){let s=app.session;if(!s||s.mode!=='exam'||s.finished||!Number.isFinite(s.minutes)||s.minutes<=0)return null;return s.startedAt+s.minutes*60000-Date.now()}
function updateClock(){const s=app.session;if(!s||s.finished||s.mode!=='exam')return;let left=timeLeft();if(left===null)return;if(left<=0){finish(true);return}const x=$('#clock');if(x)x.textContent='⏱ '+fmtTime(left)}
function navigate(n){page=n;draw();window.scrollTo({top:0,behavior:'instant'})}
function stats(){let tried=0,correct=0,wrong=0;for(const q of QUESTIONS){const h=validHistory(q);if(h.ok+h.bad){tried++;correct+=h.ok;wrong+=h.bad}}return {tried,correct,wrong,pct:correct+wrong?Math.round(100*correct/(correct+wrong)):0}}
function header(eyebrow,title,subtitle=''){return `<div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="subtitle">${subtitle}</p>`}
function statCard(value,label){return `<article class="stats-card card"><strong>${value}</strong><span>${label}</span></article>`}
function home(){const s=stats();let html=header('Preparación de certificación','Microsoft Fabric DP-700','Banco de 139 preguntas del documento proporcionado. Práctica, simulacro cronometrado y revisión de errores.');html+=`<div class="grid mb">${statCard(QUESTIONS.length,'Preguntas en el banco')}${statCard(s.tried,'Preguntas practicadas')}${statCard(s.pct+' %','Acierto en intentos corregidos')}</div>`;
 html+=`<div class="hero mb"><div class="eyebrow" style="color:#bdbdff">Prepárate a tu ritmo</div><h2>Practica de forma inteligente</h2><p>Responde, consulta las explicaciones del documento y céntrate en los conceptos en los que más fallas. Los ejercicios originalmente gráficos ahora ofrecen casillas de respuesta y revisión guiada.</p><div class="row"><button class="btn" id="startPractice">Iniciar práctica</button><button class="btn" id="startExam">Simulacro de examen</button></div></div>`;
 if(app.session&&!app.session.finished)html+=`<div class="card pad mb"><h3>Tienes una sesión sin terminar</h3><p class="muted small">${app.session.mode==='exam'?'Simulacro':'Práctica'} · ${app.session.ids.length} preguntas · pregunta ${app.session.i+1}</p><button class="btn primary" id="resume">Continuar sesión</button></div>`;
 html+=`<div class="twocol"><div class="card pad"><h3>Qué contiene este simulador</h3><p class="small muted">${QUESTIONS.filter(q=>q.type==='single').length} preguntas de opción única, ${QUESTIONS.filter(q=>q.type==='multiple').length} multirrespuesta y ${QUESTIONS.filter(q=>q.type==='visual').length} ejercicios visuales convertidos (de ellos, ${QUESTIONS.filter(q=>!manual(q)&&q.type==='visual').length} de corrección automática).</p><p class="small muted">Incluye los casos de estudio y las imágenes del documento original.</p><button class="btn" data-go="questions">Explorar preguntas</button></div><div class="card pad"><h3>Estudio dirigido</h3><p class="small muted">${wrongs().length} preguntas con algún fallo y ${app.stars.length} marcadas como favoritas.</p><div class="row"><button class="btn" data-go="errors">Repasar errores</button><button class="btn" data-go="stats">Ver rendimiento</button><button class="btn" data-go="guide">Guía DP-700</button></div></div></div>`;
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;$('#startPractice').onclick=()=>{app.settings.mode='practice';save();navigate('configure')};$('#startExam').onclick=()=>{app.settings.mode='exam';save();navigate('configure')};if($('#resume'))$('#resume').onclick=()=>navigate('practice');wireGo()}
function configure(){let x=app.settings;
 const options=(vals,selected)=>vals.map(v=>`<option value="${esc(v[0])}" ${v[0]===selected?'selected':''}>${esc(v[1])}</option>`).join('');
 let html=header('Personaliza tu estudio','Nueva sesión','Configura un ejercicio breve o un simulacro completo. No se mezclará tu historial con el de Databricks.');
 html+=`<div class="card pad"><div class="toolbar mb"><label class="field">Modo<select id="setMode">${options([['practice','Práctica (corrección inmediata)'],['exam','Examen (corrección al finalizar)']],x.mode)}</select></label><label class="field">Cantidad<select id="setCount">${options([10,20,40,60,100,139].map(v=>[String(v),v+' preguntas']),String(x.count))}</select></label><label class="field">Filtro<select id="setFilter">${options([['all','Todas'],['errors','Falladas'],['new','No practicadas'],['star','Favoritas'],['visual','Revisión manual'],['cases','Casos de estudio']],x.filter)}</select></label><label class="field">Temática<select id="setTopic">${options([['all','Todas las temáticas'],...allTopics.map(t=>[t,t])],x.topic)}</select></label><label class="field">Tiempo (opcional, min)<input id="setTime" type="number" min="10" max="240" placeholder="Sin límite de tiempo" value="${x.minutes??''}"></label></div><p class="hint">Las preguntas se seleccionan aleatoriamente sin repetir dentro de la sesión. En modo examen las soluciones se muestran después de terminar. Los ejercicios de origen gráfico permiten completar sus respuestas; las abiertas tienen autoevaluación guiada para no penalizar sinónimos válidos.</p><div class="row mt"><button class="btn primary" id="run">Crear sesión</button><button class="btn" data-go="home">Cancelar</button></div></div>`;
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;
 for(let [id,field,fn] of [['setMode','mode',v=>v],['setCount','count',Number],['setFilter','filter',v=>v],['setTopic','topic',v=>v],['setTime','minutes',v=>v===''?'':Number(v)]]){$('#'+id).onchange=e=>{app.settings[field]=fn(e.target.value);save()}}$('#run').onclick=()=>start();wireGo()}
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
 app.session={mode:app.settings.mode,ids,i:0,answers:{},written:{},submitted:{},manual:{},reviewed:{},startedAt:Date.now(),minutes:app.settings.minutes===''||app.settings.minutes===null?null:Math.max(10,Math.min(240,Number(app.settings.minutes)||10)),finished:false};save();navigate('practice')}
function current(){const s=app.session;return s?byId[s.ids[s.i]]:null}
function hasAnswer(q){const s=app.session;if(slotsFor(q).length)return slotsFor(q).every((v,i)=>String(s.written?.[q.id]?.[i]||'').trim());return q.needsManualReview?true:!!(s.answers[q.id]?.length)}
function graded(q){const s=app.session;return Boolean(s.submitted[q.id])}
function grade(q){const s=app.session;if(slotsFor(q).length&&!manual(q))return slotsFor(q).every((f,i)=>normalizeAns(s.written?.[q.id]?.[i]||'')===normalizeAns(f.answer));const sel=s.answers[q.id]||[];return !manual(q)&&sel.length===q.correct.length&&sel.every(k=>q.correct.includes(k))}
function record(q,good){const h=validHistory(q);h[good?'ok':'bad']++;h.last=Date.now();app.history[q.id]=h}
function submit(){let s=app.session,q=current();if(!s||!q||s.finished||s.mode!=='practice'||s.submitted[q.id]||!hasAnswer(q))return;if(!manual(q)){s.submitted[q.id]=true;record(q,grade(q))}else{s.submitted[q.id]=true}s.reviewed[q.id]=true;save();draw()}
function setManual(good){let s=app.session,q=current();if(!s||!q||!manual(q)||!(s.finished||s.mode==='practice'&&s.submitted[q.id])||s.manual[q.id]!==undefined)return;s.manual[q.id]=good;record(q,good);save();draw()}
function setWritten(index,value){const s=app.session,q=current();if(!s||!q||s.finished||s.submitted[q.id])return;s.written=s.written||{};s.written[q.id]=s.written[q.id]||{};s.written[q.id][index]=value;save();const b=$('#submit');if(b)b.disabled=!hasAnswer(q)}
function selectOption(key){let s=app.session,q=current();if(!s||!q||s.finished||s.submitted[q.id])return;let a=s.answers[q.id]||[];
 // Igual que en Databricks: tocar dos veces la misma opción comprueba en práctica.
 // En multirrespuesta, solo cuando hay tantas seleccionadas como exige la clave.
 if(s.mode==='practice'&&a.includes(key)&&(q.type!=='multiple'||a.length===q.correct.length)){submit();return}
 s.answers[q.id]=q.type==='multiple'?(a.includes(key)?a.filter(x=>x!==key):[...a,key]):[key];save();draw()}
function reviewed(){let s=app.session,q=current();if(!s||!q||s.finished)return;s.reviewed[q.id]=true;save();draw()}
function move(i){const s=app.session;if(!s)return;s.i=Math.max(0,Math.min(s.ids.length-1,i));save();draw();window.scrollTo({top:0,behavior:'instant'})}
function hasAnsweredInExam(q,id){const s=app.session;return slotsFor(q).length?slotsFor(q).every((f,i)=>String(s.written?.[id]?.[i]||'').trim()):(s.answers[id]?.length>0)}
function finish(expired=false){let s=app.session;if(!s||s.finished)return;if(!expired&&!confirm('¿Finalizar y corregir el examen o la práctica?'))return;s.finished=true;
 if(s.mode==='exam')for(const id of s.ids){let q=byId[id];if(!manual(q)&&hasAnsweredInExam(q,id)&&!s.submitted[id]){s.submitted[id]=true;record(q,grade(q))}}
 save();draw();msg(expired?'Tiempo agotado. Se ha corregido el simulacro.':'Sesión finalizada')}
function result(){const s=app.session;if(!s)return{ok:0,bad:0,manual:0,seen:0};let ok=0,bad=0,ungraded=0,seen=0;for(const id of s.ids){const q=byId[id];if(s.answers[id]?.length||s.written?.[id]&&Object.keys(s.written[id]).length||s.reviewed[id])seen++;if(manual(q)){if(s.manual[id]===true)ok++;else if(s.manual[id]===false)bad++;else ungraded++}else if(s.submitted[id]){if(grade(q))ok++;else bad++}}return{ok,bad,ungraded,seen,pct:ok+bad?Math.round(ok*100/(ok+bad)):null}}
function normalizeAns(v){return String(v||'').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^[\s.,;()'\"]+|[\s.,;()'\"]+$/g,'').replace(/\s+/g,' ').trim()}
function removeLabelPrefix(node,regex){
 const match=(node.textContent||'').match(regex);
 if(!match)return;
 let chars=match[0].length;
 const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),textNodes=[];
 while(walker.nextNode())textNodes.push(walker.currentNode);
 for(const piece of textNodes){if(chars<=0)break;const value=piece.nodeValue||'';
  if(value.length<=chars){chars-=value.length;piece.nodeValue=''}
  else{piece.nodeValue=value.slice(chars);chars=0}
 }
 node.querySelectorAll('strong,b,em,span').forEach(child=>{if(!child.textContent.trim()&&!child.querySelector('img'))child.remove()});
}
function splitRationale(q){
 const holder=document.createElement('div');holder.innerHTML=q.explanation||'';
 const out={correct:[],wrong:[]};let where='correct';
 const titleCorrect=/^(respuestas? correctas?|opci[oó]n correcta|an[aá]lisis detallado para las? (opciones?|respuestas?) correctas?)\s*[:：]?$/i;
 const titleWrong=/^(opciones? incorrectas|respuestas? incorrectas|por qu[eé] (son )?incorrectas las (dem[aá]s|otras).*|por qu[eé] las (dem[aá]s|otras) opciones son incorrectas.*|an[aá]lisis detallado (para las? (opciones?|respuestas?) incorrectas?|de la(s)? opci[oó]n(es)? incorrectas?).*)\s*[:：]?$/i;
 for(const node of [...holder.children]){
  const txt=(node.textContent||'').replace(/\s+/g,' ').trim();
  if(!txt&&!node.querySelector('img'))continue;
  if(titleWrong.test(txt)){where='wrong';continue}
  if(titleCorrect.test(txt))continue;
  if(/^an[aá]lisis detallado para (la capa|el equipo|notebook|model|pipeline|la entidad|las opciones correctas)/i.test(txt)&&txt.length<125){where='correct';continue}
  if(/^([•▪-]\s*)?documentaci[oó]n oficial\s*:/i.test(txt))continue;
  if(/^(opciones|alternativas) (no |in)correctas?\b/i.test(txt)&&txt.length<75){where='wrong';continue}
  if(where==='wrong'){
   // La X identifica visualmente cada distractor. Se suprime la etiqueta repetida,
   // pero se conserva el argumento del documento, incluidos los énfasis originales.
   if(/^(?:opci[oó]n\s+)?[A-H]\s*[.):-]\s*\S/i.test(txt)){
    node.classList.add('wrong-option-heading');
    const cross=document.createElement('span');cross.className='wrong-cross';cross.setAttribute('aria-hidden','true');cross.textContent='✕';
    node.prepend(cross);
   }else if(/^por qu[eé] es incorrect[ao]\s*:/i.test(txt)){
    removeLabelPrefix(node,/^\s*por qu[eé] es incorrect[ao]\s*:\s*/i);
    node.classList.add('wrong-option-reason');
   }
  }
  out[where].push(node.outerHTML);
 }
 const result={correct:out.correct.join(''),wrong:out.wrong.join('')};
 if(!result.correct)result.correct='<p>El documento no ofrece una justificación independiente para esta respuesta.</p>';
 if(!result.wrong)result.wrong='<p>En el material aportado no hay un desglose independiente de los distractores para este ejercicio. No se añaden explicaciones inventadas.</p>';
 return result;
}
const CASE_TABS=[{id:'resumen',label:'Resumen'},{id:'entorno',label:'Entorno existente'},{id:'problemas',label:'Problemas'},{id:'requisitos',label:'Requisitos'},{id:'instrucciones',label:'Instrucciones'},{id:'todo',label:'Todo el caso'}];
function casePanels(context){
 if(casePanelCache.has(context))return casePanelCache.get(context);
 const container=document.createElement('div');container.innerHTML=context;
 const sections={resumen:[],entorno:[],problemas:[],requisitos:[],instrucciones:[]};
 let group='instrucciones';
 for(const node of [...container.children]){
  const txt=(node.textContent||'').replace(/\s+/g,' ').trim();
  if(/^resumen\s*[.\-–—]/i.test(txt)&&txt.length<110)group='resumen';
  else if(/^(entorno existente\s*[.\-–—]\s*)?problemas?(\s+de\s+\w+)?\s*[–—-]?$/i.test(txt)&&txt.length<115)group='problemas';
  else if(/^entorno existente\s*[.\-–—]/i.test(txt)&&txt.length<115)group='entorno';
  else if(/^requisitos\s*[.\-–—]/i.test(txt)&&txt.length<115)group='requisitos';
  else if(/^(caso de estudio|para comenzar el caso de estudio|hotspot|arrastrar y soltar)\s*[–—-]?$/i.test(txt)&&txt.length<110)group='instrucciones';
  const isHeader=txt.length<115&&/^(resumen|entorno existente|requisitos|problemas|caso de estudio|para comenzar el caso de estudio)/i.test(txt);
  if(isHeader){const heading=document.createElement('h4');heading.className='case-subheading';heading.textContent=txt;sections[group].push(heading.outerHTML)}
  else sections[group].push(node.outerHTML);
 }
 const result=Object.fromEntries(Object.entries(sections).map(([key,val])=>[key,val.join('')]));
 result.todo=context;casePanelCache.set(context,result);return result;
}
function renderCaseTabs(q){
 const panels=casePanels(q.context),tabs=CASE_TABS.filter(t=>Boolean(panels[t.id]));
 const name=caseName(q),chosen=caseTabByName[name];const active=tabs.some(t=>t.id===chosen)?chosen:'resumen';
 const markup=tabs.map(t=>`<button type="button" role="tab" data-case-tab="${t.id}" id="case-tab-${t.id}" aria-controls="case-tab-content" aria-selected="${t.id===active}" tabindex="${t.id===active?0:-1}" class="case-tab${t.id===active?' selected':''}">${t.label}</button>`).join('');
 return `<section class="case-panel mb" aria-label="Información del caso ${esc(name)}"><div class="case-tab-bar" role="tablist" aria-label="Apartados del caso">${markup}</div><div id="case-tab-content" class="case-content question-text" role="tabpanel" aria-labelledby="case-tab-${active}">${panels[active]}</div></section>`;
}
function wireCaseTabs(q){if(!q.context||!q.caseStudy)return;
 const panels=casePanels(q.context),name=caseName(q);
 document.querySelectorAll('[data-case-tab]').forEach(b=>b.addEventListener('click',()=>{
  caseTabByName[name]=b.dataset.caseTab;
  document.querySelectorAll('[data-case-tab]').forEach(t=>{const active=t===b;t.classList.toggle('selected',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});
  const content=$('#case-tab-content');content.innerHTML=panels[b.dataset.caseTab]||'';content.setAttribute('aria-labelledby',b.id);
  content.querySelectorAll('.doc-image').forEach(img=>img.onclick=()=>{const v=$('#imageViewer');$('#viewerImg').src=img.src;v.classList.remove('hidden')});
 }));
}

function practice(){let s=app.session;if(!s){navigate('home');return}const q=current();if(!q){navigate('home');return}let n=s.ids.length;const r=result();
 let html=`<div class="eyebrow">${s.mode==='exam'?(timeLeft()===null?'SIMULACRO SIN LÍMITE':'SIMULACRO CRONOMETRADO'):'MODO PRÁCTICA'}</div><div class="question-top"><h1 class="question-title">Pregunta ${s.i+1} de ${n} <span class="muted small">· Original #${q.id}</span></h1><div class="row"><span class="pill" id="clock">${s.mode==='exam'?(s.finished?'Finalizado':timeLeft()===null?'Sin límite de tiempo':'⏱ '+fmtTime(timeLeft())):'Sin límite de tiempo'}</span><button class="btn sm" id="bookmark">${app.stars.includes(q.id)?'★ Favorita':'☆ Guardar'}</button></div></div><div class="progress"><div style="width:${Math.round(100*(s.i+1)/n)}%"></div></div>`;
 if(s.finished)html+=`<div class="card pad mb"><div class="between row"><div><strong>Sesión completada</strong><div class="small muted">${r.ok} aciertos · ${r.bad} fallos · ${r.ungraded} pendientes de revisión guiada</div></div><button class="btn sm" id="backHome">Volver al inicio</button></div></div>`;
 html+=`<section class="card pad"><div class="tag-row mb"><span class="chip">${esc(q.topic)}</span><span class="chip ${manual(q)?'warn':''}">${esc(lbl(q))}</span>${q.caseStudy?'<span class="chip">Caso de estudio</span>':''}${q.repeated?'<span class="chip warn">Marcada como repetida en origen</span>':''}</div>`;
 if(q.caseStudy){const name=caseName(q);const members=s.ids.filter(id=>caseName(byId[id])===name);const at=members.indexOf(q.id)+1;html+=`<div class="case-heading"><strong>${esc(name)}</strong><span>Pregunta ${at} de ${members.length} de este caso</span></div>`}
 if(q.context)html+=q.caseStudy?renderCaseTabs(q):`<details class="scenario"><summary>Consultar escenario y requisitos del caso</summary><div class="question-text">${q.context}</div></details>`;
 const visibleStem=q.stem.replace(/<img\b[^>]*>/gi,'').replace(/<p>\s*<\/p>/gi,'');
 const illustrations=[...q.stem.matchAll(/<img\b[^>]*>/gi)].map(x=>x[0]);
 html+=`<div class="question-text">${slotsFor(q).length?visibleStem:q.stem}</div>`;
 if(slotsFor(q).length&&illustrations.length)html+=`<details class="scenario visual-reference"><summary>Ver tabla, código o imagen del enunciado original (${illustrations.length})</summary><div class="visual-reference-body">${illustrations.join('')}</div></details>`;
 if(!slotsFor(q).length&&!manual(q)){
  html+=`<div class="question-options" role="group" aria-label="Opciones de respuesta">`;
  for(const op of q.options){const chosen=(s.answers[q.id]||[]).includes(op.key),isKey=q.correct.includes(op.key),show=s.finished||s.mode==='practice'&&graded(q),cl=(show&&isKey?' good':show&&chosen&&!isKey?' bad':chosen?' active':'');
    html+=`<button class="option${cl}" data-opt="${op.key}" ${(s.finished||graded(q))?'disabled':''}><span class="optkey">${op.key}</span><span class="option-content">${op.html}</span></button>`}
  html+='</div>';
  if(q.type==='multiple')html+='<p class="markline">Selecciona todas las opciones correctas. En práctica, pulsa de nuevo una opción seleccionada para comprobar cuando hayas elegido todas.</p>';
  else if(!s.finished&&s.mode==='practice'&&!graded(q))html+='<p class="markline">Pulsa una opción para seleccionarla y vuelve a pulsar la misma para comprobarla.</p>';
 }else if(slotsFor(q).length){
   const fields=slotsFor(q),vals=s.written?.[q.id]||{};
   html+='<div class="fill-quiz"><p class="fill-title">Completa las respuestas</p><p class="small muted">'+(fields.every(f=>f.kind==='boolean'||f.choices?.length)?'Selecciona una opción en cada campo. La corrección se realiza automáticamente.':'Responde en texto sin ver la solución. Después compara cada campo y autoevalúa respuestas equivalentes, sin penalizar sinónimos.')+'</p>';
   if(INTERACTIVES[q.id]?.intro)html+=`<div class="form-intro">${INTERACTIVES[q.id].intro}</div>`;
   fields.forEach((f,i)=>{const ans=esc(vals[i]||''),disabled=s.finished||graded(q);
     html+=`<label class="fill-field"><span>${esc(f.label)}</span>${f.kind==='boolean'||f.choices?.length?`<select data-fill="${i}" ${disabled?'disabled':''}><option value="">Selecciona…</option>${(f.choices||['Sí','No']).map(x=>`<option value="${esc(x)}" ${String(vals[i]||'')===x?'selected':''}>${esc(x)}</option>`).join('')}</select>`:`<input data-fill="${i}" value="${ans}" placeholder="Escribe tu respuesta" autocomplete="off" spellcheck="false" ${disabled?'disabled':''}>`}</label>`;
   });html+='</div>';
 }else html+='<p class="source-warning">El original depende de material gráfico y requiere comparación manual con su solución.</p>';
 if(!s.finished){if(s.mode==='practice')html+=`<div class="row mt"><button class="btn primary" id="submit" ${(!hasAnswer(q)||graded(q))?'disabled':''}>${manual(q)?'Mostrar solución':'Comprobar respuesta'}</button></div>`;else if(manual(q))html+=`<div class="row mt"><button class="btn" id="markReviewed" ${s.reviewed[q.id]?'disabled':''}>${s.reviewed[q.id]?'✓ Revisada':'Marcar como revisada'}</button></div>`}
 const show=s.finished||s.mode==='practice'&&graded(q);
 if(show){let good=manual(q)?s.manual[q.id]:s.submitted[q.id]?grade(q):undefined;
 let label=good===true?'Correcta':good===false?'Incorrecta':manual(q)?'Respuesta registrada · revisión guiada':'No respondida';
 html+=`<div class="feedback ${good===true?'good':good===false?'bad':''}"><h3>${label}</h3>`;
 if(!manual(q)&&!slotsFor(q).length)html+=`<p class="small">Respuesta correcta: <strong>${q.correct.join(', ')}</strong></p>`;
 if(slotsFor(q).length){const vals=s.written?.[q.id]||{};html+='<div class="solution-grid">';slotsFor(q).forEach((f,i)=>{
 const got=String(vals[i]||'').trim(),exact=normalizeAns(got)===normalizeAns(f.answer);
 html+=`<div class="solution-row"><span>${esc(f.label)}:</span><strong>${esc(f.answer)}</strong><small class="${exact?'match':'no-match'}">${exact?'✓ Coincide':`Tu respuesta: ${esc(got||'(sin responder)')}`}</small></div>`;
 });html+='</div>'}
 html+=`<div class="explain-controls"><button class="btn why-btn" type="button" id="whyCorrect" aria-expanded="false">¿Por qué es correcta? <span>⌄</span></button><button class="btn why-btn" type="button" id="whyWrong" aria-expanded="false">¿Por qué son incorrectas las demás? <span>⌄</span></button></div>`;
 html+='<div class="explain-detail" id="whyCorrectContent" hidden></div><div class="explain-detail" id="whyWrongContent" hidden></div>';
 if(manual(q)&&s.manual[q.id]===undefined)html+=`<div class="row mt"><button class="btn primary" id="manualGood">Mi respuesta es correcta</button><button class="btn" id="manualBad">Necesito repasarlo</button></div>`;
 html+='</div>'}
 html+=`<div class="footer-actions"><button class="btn" id="prev" ${s.i===0?'disabled':''}>← Anterior</button><div class="row"><button class="btn" id="endSession">${s.finished?'Nueva sesión':'Finalizar sesión'}</button><button class="btn primary" id="next" ${s.i===n-1?'disabled':''}>Siguiente →</button></div></div></section>`;
 html+=`<div class="card pad mt"><div class="row between mb"><h3>Navegación por preguntas</h3><span class="muted tiny">${r.seen} de ${n} respondidas o revisadas</span></div><div class="question-grid">${s.ids.map((id,i)=>`<button data-jump="${i}" class="${i===s.i?'active':s.answers[id]?.length||s.written?.[id]||s.reviewed[id]?'done':''} ${app.stars.includes(id)?'starred':''}" title="Pregunta original ${id}">${i+1}</button>`).join('')}</div></div>`;
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;
 $('#bookmark').onclick=()=>{app.stars=app.stars.includes(q.id)?app.stars.filter(x=>x!==q.id):[...app.stars,q.id];save();draw()};
 document.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>selectOption(b.dataset.opt));
 wireCaseTabs(q);
 if($('#submit'))$('#submit').onclick=submit;if($('#markReviewed'))$('#markReviewed').onclick=reviewed;
 document.querySelectorAll('[data-fill]').forEach(f=>{f.oninput=e=>setWritten(Number(f.dataset.fill),e.target.value);f.onchange=e=>setWritten(Number(f.dataset.fill),e.target.value)});
 if(show){const details=splitRationale(q);
  [['whyCorrect','correct'],['whyWrong','wrong']].forEach(([id,side])=>{const b=$('#'+id),d=$('#'+id+'Content');if(!b||!d)return;d.innerHTML=details[side];b.onclick=()=>{d.hidden=!d.hidden;b.setAttribute('aria-expanded',String(!d.hidden));b.querySelector('span').textContent=d.hidden?'⌄':'⌃'}})
 }
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
function guidePage(){
 let html=header('Guía de estudio','Preparación DP-700','Recorrido de conceptos para entender las decisiones de arquitectura y los distractores del banco.');
 html+='<div class="study-hero"><h2>De la ingesta al consumo: piensa en el flujo completo</h2><p>Origen → Data Factory / Eventstream → OneLake / Lakehouse / Warehouse / Eventhouse → consulta y seguridad → despliegue y operación.</p><p class="small">Guía orientativa basada en las temáticas del documento. No es un temario oficial ni sustituye a la documentación técnica vigente.</p></div>';
 html+='<div class="guide-sections">'+STUDY.sections.map((s,i)=>`<article class="card pad guide-topic"><span class="chip">Módulo ${i+1}</span><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p><div class="exam-tip"><strong>Para el examen</strong><p>${esc(s[2])}</p></div></article>`).join('')+'</div>';
 html+='<div class="card pad mt"><h3>Estudio activo</h3><p>Cuando falles una pregunta, identifica qué restricción del enunciado determina el artefacto correcto. Después compara por qué no encajan los otros. Consulta el glosario para afianzar el vocabulario.</p><div class="row"><button class="btn primary" data-go="glossary">Abrir términos de repaso</button><button class="btn" data-go="errors">Repasar preguntas falladas</button></div></div>';
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;wireGo();
}
function glossaryPage(){
 const categories=['Todas',...new Set(STUDY.terms.map(t=>t.category))];
 const input=(glossarySearch||'').toLocaleLowerCase('es');const items=STUDY.terms.map((t,i)=>({...t,_id:i})).filter(t=>(glossaryFilter==='Todas'||t.category===glossaryFilter)&&(!input||(t.term+' '+t.category+' '+t.meaning+' '+t.exam).toLocaleLowerCase('es').includes(input)));
 let html=header('Aprende por conceptos','Términos de repaso',`Glosario interactivo · ${items.length} de ${STUDY.terms.length} términos. Intenta definir cada concepto antes de mostrar la respuesta.`);
 html+=`<div class="card pad mb glossary-tools"><label class="field">Buscar concepto<input id="termSearch" placeholder="Ej. Eventstream, RLS, Delta…" value="${esc(glossarySearch)}"></label><label class="field">Categoría<select id="termCategory">${categories.map(x=>`<option value="${esc(x)}" ${x===glossaryFilter?'selected':''}>${esc(x)}</option>`).join('')}</select></label><button id="shuffleTerms" class="btn">Ocultar definiciones</button></div>`;
 html+='<div class="term-grid">'+items.map(t=>`<article class="term-card card"><div class="row between"><span class="chip">${esc(t.category)}</span><button class="btn sm" data-flip="${t._id}" aria-expanded="${!!glossaryFlipped[t._id]}">${glossaryFlipped[t._id]?'Ocultar ↑':'Ver respuesta ↓'}</button></div><h3>${esc(t.term)}</h3>${glossaryFlipped[t._id]?`<div class="term-def"><p>${esc(t.meaning)}</p><div class="exam-tip"><strong>Clave de examen</strong><p>${esc(t.exam)}</p></div></div>`:'<p class="muted small">¿Podrías explicarlo sin mirar?</p>'}</article>`).join('')+'</div>';
 if(!items.length)html+='<div class="empty">No hay términos que coincidan.</div>';
 $('#main').innerHTML=`<div class="wrap">${html}</div>`;
 $('#termSearch').oninput=e=>{glossarySearch=e.target.value;const start=e.target.selectionStart;glossaryPage();let x=$('#termSearch');x.focus();x.setSelectionRange(start,start)};
 $('#termCategory').onchange=e=>{glossaryFilter=e.target.value;glossaryPage()};
 $('#shuffleTerms').onclick=()=>{glossaryFlipped={};glossaryPage()};
 document.querySelectorAll('[data-flip]').forEach(b=>b.onclick=()=>{let id=Number(b.dataset.flip);glossaryFlipped[id]=!glossaryFlipped[id];glossaryPage()});
}
function settingsPage(){let html=header('Tu progreso','Datos y ajustes','Los datos del simulador se guardan únicamente en este navegador con una clave separada de Databricks.');html+=`<div class="card pad stack"><h3>Seguridad de tu progreso</h3><p class="small muted">Exporta un archivo JSON para copiar o trasladar favoritos, errores y sesiones. No se envían datos a servidores externos.</p><div class="row"><button class="btn primary" id="export">Exportar progreso</button><label class="btn" for="import" style="cursor:pointer">Importar JSON</label><input id="import" type="file" accept="application/json" hidden><button class="btn danger" id="reset">Borrar progreso local</button></div><div class="divider"></div><h3>Empezar otra sesión</h3><p class="small muted">Puedes configurar un examen nuevo en cualquier momento.</p><button class="btn" id="configure">Configurar sesión</button><p class="source-warning">Las respuestas proceden del documento compartido y pueden incluir información desactualizada. El simulador no verifica automáticamente la documentación de Microsoft Learn.</p></div>`;$('#main').innerHTML=`<div class="wrap">${html}</div>`;
 $('#configure').onclick=()=>navigate('configure');$('#export').onclick=()=>{const out=JSON.stringify({product:'fabric-dp700-exam-simulator',exportedAt:new Date().toISOString(),data:app},null,2),blob=new Blob([out],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='fabric_dp700_progreso_'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 $('#import').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const x=JSON.parse(await f.text());if(x.product!=='fabric-dp700-exam-simulator'||x.data?.v!==1)throw Error('El archivo no es una copia válida del simulador DP-700');if(confirm('¿Sustituir el progreso actual por la copia?')){app={...fresh(),...x.data};save();navigate('home');msg('Progreso importado')}}catch(err){alert('No se pudo importar: '+err.message)}e.target.value=''};
 $('#reset').onclick=()=>{if(confirm('¿Borrar definitivamente todos los intentos y favoritos de Fabric en este navegador?')){app=fresh();save();navigate('home')}}}
function wireGo(){document.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>navigate(x.dataset.go))}
function draw(){const navPage=page==='configure'?'settings':page==='practice'?'home':page;document.querySelectorAll('.navbtn').forEach(x=>x.classList.toggle('selected',x.dataset.page===navPage));const x=stats();$('#sideSummary').innerHTML=`<strong>${x.tried} / ${QUESTIONS.length}</strong>preguntas practicadas<br><strong style="font-size:18px;margin-top:7px">${x.pct} %</strong>acierto total`;
 if(page==='home')home();else if(page==='configure')configure();else if(page==='practice')practice();else if(page==='questions'||page==='errors'||page==='favs')listing(page);else if(page==='stats')statsPage();else if(page==='guide')guidePage();else if(page==='glossary')glossaryPage();else if(page==='settings')settingsPage();else home();
 document.querySelectorAll('.doc-image').forEach(i=>i.addEventListener('click',()=>{let v=$('#imageViewer');$('#viewerImg').src=i.src;v.classList.remove('hidden')}))}
 document.querySelectorAll('.navbtn').forEach(x=>x.onclick=()=>navigate(x.dataset.page));$('#closeViewer').onclick=()=>$('#imageViewer').classList.add('hidden');$('#imageViewer').onclick=e=>{if(e.target.id==='imageViewer')e.currentTarget.classList.add('hidden')};
 window.addEventListener('keydown',e=>{if(e.key==='Escape')$('#imageViewer').classList.add('hidden');if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName))return;if(page!=='practice'||!app.session)return;if(e.key==='ArrowRight')move(app.session.i+1);if(e.key==='ArrowLeft')move(app.session.i-1);if(/^[1-7]$/.test(e.key)){const q=current();if(q&&!manual(q))selectOption(String.fromCharCode(64+Number(e.key)))}});
 setInterval(updateClock,1000);
 if(!QUESTIONS.length){$('#main').textContent='No se ha podido cargar el banco. Comprueba que questions.js está junto a index.html.';return}
 draw();
})();