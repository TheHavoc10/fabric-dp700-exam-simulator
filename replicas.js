/* Reconstrucción fiel de preguntas visuales DP-700. Revisadas contra el Word de origen.
   Los campos que no cuentan con alternativas verificables mantienen la revisión guiada. */
window.DP700_REPLICAS={
  7:{mode:'mapping',label:'Selecciona el componente para cada capa'},
  8:{mode:'code',label:'Completa la consulta de diagnóstico del Warehouse',code:'SELECT last_run_start_time, last_run_command\nFROM {{0}}\nWHERE last_run_total_elapsed_time_ms > 7200000\n  AND {{1}};'},
  10:{mode:'match',label:'Asigna una función KQL a cada declaración',keepFirstImage:true},
  67:{mode:'mapping',label:'Elige la vista para cada dato de diagnóstico'},

  69:{mode:'match',label:'Completa la política RLS de KQL con los fragmentos correctos',keepFirstImage:true,
      pool:['AuthorSales','AuthorEmail','AuthorSales.AuthorEmail','BLOCK','FILTER','INLINE','SCHEMABINDING','USER_NAME()']},
  73:{mode:'match',label:'Completa la orquestación dinámica de notebooks',keepFirstImage:true,
      pool:['activities','broadcast','dependencies','execute','notebooks','runMultiple']},
  12:{mode:'code',label:'Completa la consulta T-SQL',
    preamble:'La tabla de referencia y las columnas se mantienen visibles.',
    code:'{{0}}(SO.ModifiedDate) AS OrderDate,\n    P.Name AS ProductName,\n    SUM(SO.OrderQty) AS OrderQty\nFROM dbo.SalesOrderDetail AS SO\nINNER JOIN dbo.Product AS P\n    ON P.ProductID = SO.ProductID\nGROUP BY {{1}}\nORDER BY OrderDate;',
    keepFirstImage:true},
  17:{mode:'yesno',label:'Indica Sí o No para cada afirmación'},
  29:{mode:'match',label:'Asigna las insignias a las entidades'},
  33:{mode:'sequence',label:'Ordena tres acciones; dos son distractores',
    pool:['Change the runtime version.','Install the libraries.','Create a pool.','Create an environment.','Set the default environment.']},
  54:{mode:'image-cards',label:'Selecciona exactamente dos registros de los cuatro que aparecen'}
};
(function(){
 const q33=window.DP700_INTERACTIVE?.[33];
 if(q33)q33.fields.forEach(f=>{f.choices=[...window.DP700_REPLICAS[33].pool]});
 // Las preguntas binarias son una matriz de Sí/No, nunca un campo de texto libre.
 for(const id of [17,30,50,61,96,114,122]){
  const item=window.DP700_INTERACTIVE?.[id];
  if(item){
   item.fields.forEach(f=>f.choices=['Sí','No']);
   if(!window.DP700_REPLICAS[id])window.DP700_REPLICAS[id]={mode:'yesno',label:'Indica Sí o No para cada afirmación'};
  }
 }
 for(const id of [69,73]){
   const item=window.DP700_INTERACTIVE?.[id],replica=window.DP700_REPLICAS[id];
   if(item&&replica)item.fields.forEach(f=>{f.choices=[...replica.pool]});
 }
 // Pregunta 54: cinco imágenes: primera = tabla de contexto, siguientes cuatro = opciones A-D.
 // Se conservan los registros originales en imágenes; no se inventan ni se transcriben GUID.
 const q=window.DP700_QUESTIONS?.find(q=>q.id===54);
 if(!q)return;
 const imgs=[...q.stem.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0]);
 if(imgs.length!==5)return; // fallo conservador: se mantiene original si el formato cambia
 const labels=['A','B','C','D'];
 q.options=imgs.slice(1).map((html,i)=>({key:labels[i],text:'Registro '+labels[i],html:'<strong>Registro '+labels[i]+'</strong><div class="record-image">'+html+'</div>'}));
 q.stem=q.stem.replace(/<p>\s*<img\b[^>]*>\s*<\/p>/gi,'');
 q.correct=['A','D'];
 q.type='multiple';
 q.needsManualReview=false;
})();
