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
  25:{mode:'mapping',label:'Elige cómo ejecutar cada elemento de Fabric',keepFirstImage:true},
  47:{mode:'mapping',label:'Selecciona el origen y el filtrado del eventstream'},
  90:{mode:'mapping',label:'Asigna la herramienta adecuada a cada equipo'},
  91:{mode:'mapping',label:'Selecciona la herramienta adecuada para cada conjunto de datos'},
  104:{mode:'mapping',label:'Asigna cada fuente al mecanismo de ingesta',keepFirstImage:true},
  117:{mode:'mapping',label:'Elige la condición y el método de notificación'},
  135:{mode:'mapping',label:'Selecciona el patrón de carga de datos'},
  138:{mode:'mapping',label:'Selecciona las herramientas de supervisión y alerta'},
  37:{mode:'sequence',label:'Ordena las acciones en la secuencia correcta',pool:["DROP CONSTRAINT PK_DimCustomer","ADD CONSTRAINT PK_DimCustomer PRIMARY KEY NONCLUSTERED (CustomerKey)","NOT ENFORCED","ALTER TABLE dbo.DimCustomer","ADD CONSTRAINT PK_DimCustomer PRIMARY KEY CLUSTERED (CustomerKey)","ENFORCED"],keepFirstImage:false},
  93:{mode:'sequence',label:'Ordena las acciones en la secuencia correcta',pool:["Add a ForEach activity to iterate over the list of tables and copy the source data to the lakehouse Delta tables.","Add a Get metadata activity to query Control.Object and generate a list of schemas and tables to copy.","Add an Until activity to iterate over the list of tables and copy the source data to the lakehouse Delta tables.","Add a Lookup activity to query Control.Object and generate a list of the schemas and tables to copy.","Add a Copy data activity as an inner activity to the iterator activity."],keepFirstImage:true},
  89:{mode:'mapping',label:'Elige cómo modelar productos y definir la clave de unión'},
  126:{mode:'mapping',label:'Asigna el acceso de menor privilegio a cada identidad',keepFirstImage:true},
  132:{mode:'mapping',label:'Selecciona el entorno Spark para cada notebook'},
  119:{mode:'sequence',label:'Ordena las acciones en la secuencia correcta',pool:["Select pipeline1.","Select the Test stage.","Select Deploy.","From Deploy from, select Development.","From Deploy from, select Production.","Select the Development stage."],keepFirstImage:true},
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

 for(const id of [37,93,119]){
   const item=window.DP700_INTERACTIVE?.[id],replica=window.DP700_REPLICAS[id];
   if(item&&replica)item.fields.forEach(f=>{f.choices=[...replica.pool]});
 }
 for(const [key,optionRows] of Object.entries({"89":[["Added to the model as individual tables","Denormalized by being added to the SalesOrder table","Denormalized into a single product dimension table"],["The product name and the date","The unique system generated identifier","The product category name"]],"126":[["Assign the Admin role for Workspace1.","Assign the Contributor role for Workspace1.","Assign the Viewer role for Workspace1."],["Assign the Viewer role for Workspace2.","Assign the Contributor role for Workspace2.","Configure only item security for Workspace2."],["Assign the Contributor role for Workspace2 and the Viewer role for Workspace4.","Assign the Viewer role for Workspace2 and the Contributor role for Workspace4.","Assign the Member role for Workspace2 and the Viewer role for Workspace4."]],"132":[["A custom Spark pool that has multiple nodes and high concurrency mode enabled","A custom Spark pool that has a single small node and high concurrency mode enabled","A serverless Spark environment","A starter pool"],["A custom Spark pool that has multiple nodes","A custom Spark pool that has a single small node","A serverless Spark environment","A starter pool"]]})){
   const item=window.DP700_INTERACTIVE?.[key];
   if(item)item.fields.forEach((f,i)=>{if(optionRows[i])f.choices=optionRows[i]});
 }
 const choicesByQuestion={"25":[["Add Notebook1 to an Apache Spark job definition.","Add Notebook1 to Pipeline1.","From Real-Time hub, configure the execution of Notebook1."],["Add Notebook2 to an Apache Spark job definition.","Add Notebook2 to Pipeline1.","From Real-Time hub, configure the execution of Notebook2."],["Add Pipeline1 to an Apache Spark job definition.","Configure the execution of Pipeline1 by using a schedule.","From Real-Time hub, configure the execution of Pipeline1."],["Add Model1 to Pipeline1.","From Real-Time hub, configure Model1 to refresh.","Set Keep your Direct Lake data up to date to On."]],"47":[["A data pipeline","A Dataflow Gen2 dataflow","An eventstream with a custom endpoint","An eventstream with an external data source"],["A Filter activity in a data pipeline","A filter in a Dataflow Gen2 dataflow","A KQL statement","An eventstream processor"]],"90":[["Data pipelines","Notebooks","Dataflow Gen2 dataflow"],["Data pipelines","Notebooks","Dataflow Gen2 dataflow"],["Data pipelines","Notebooks","Dataflow Gen2 dataflow"]],"91":[["Dataflow Gen2 dataflow","A notebook","A T-SQL statement"],["Dataflow Gen2 dataflow","A notebook","A T-SQL statement"],["Dataflow Gen2 dataflow","A KQL queryset","A T-SQL statement"]],"104":[["Apache Spark Structured Streaming","An eventstream","A data pipeline","A streaming dataflow"],["Apache Spark Structured Streaming","An eventstream","A data pipeline","A streaming dataflow"],["Apache Spark Structured Streaming","An eventstream","A data pipeline","A streaming dataflow"]],"117":[["A Fail activity","An If condition activity","An On failure dependency condition","An On completion dependency condition"],["A Teams activity","An Invoke pipeline activity","An Office365Outlook activity"]],"135":[["Full","Incremental","Snapshot"],["Full","Incremental","Snapshot"]],"138":[["Monitor hub","Azure Monitor","Real-Time Intelligence monitoring"],["A Microsoft Power Automate flow","A Web activity","A Fabric Activator action","A Data Factory trigger"]]};
 for(const [key,arr] of Object.entries(choicesByQuestion)){
   const item=window.DP700_INTERACTIVE?.[key];if(!item)continue;
   item.fields.forEach((field,i)=>{if(arr[i])field.choices=arr[i]});
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
