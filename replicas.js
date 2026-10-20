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
  37:{mode:'sequence',label:'Ordena las acciones en la secuencia correcta',keepFirstImage:true,pool:["DROP CONSTRAINT PK_DimCustomer","ADD CONSTRAINT PK_DimCustomer PRIMARY KEY NONCLUSTERED (CustomerKey)","NOT ENFORCED","ALTER TABLE dbo.DimCustomer","ADD CONSTRAINT PK_DimCustomer PRIMARY KEY CLUSTERED (CustomerKey)","ENFORCED"],keepFirstImage:false},
  93:{mode:'sequence',label:'Ordena las acciones en la secuencia correcta',pool:["Add a ForEach activity to iterate over the list of tables and copy the source data to the lakehouse Delta tables.","Add a Get metadata activity to query Control.Object and generate a list of schemas and tables to copy.","Add an Until activity to iterate over the list of tables and copy the source data to the lakehouse Delta tables.","Add a Lookup activity to query Control.Object and generate a list of the schemas and tables to copy.","Add a Copy data activity as an inner activity to the iterator activity."],keepFirstImage:true},
  89:{mode:'mapping',label:'Elige cómo modelar productos y definir la clave de unión'},
  126:{mode:'mapping',label:'Asigna el acceso de menor privilegio a cada identidad',keepFirstImage:true},
  132:{mode:'mapping',label:'Selecciona el entorno Spark para cada notebook'},
  44:{"mode":"code","label":"Completa la consulta SQL de la dimensión de productos","code":"SELECT ProductID, ProductNumber, ProductName, ModelName,\n       SubCategoryName, CategoryName\nFROM ContosoLake.Products p\n{{0}} ContosoLake.ProductSubCategories s ON p.SubCategoryID = s.SubCategoryID\n{{1}} ContosoLake.ProductCategories c ON c.CategoryID = s.CategoryID\nWHERE {{2}}"},
  46:{"mode":"code","label":"Completa la consulta T-SQL de contratos","code":"WITH result AS (\n SELECT e.EmployeeID, e.EmployeeName, e.EmployeePosition,\n        c.ContractType,\n        {{0}}(date, c.StartDate) AS StartDate\n FROM Employee AS e\n {{1}} Contract AS c ON c.EmployeeID = e.EmployeeID\n)\nSELECT COUNT(DISTINCT EmployeeID) AS TotalEmployees, ContractType\nFROM result\nGROUP BY ContractType\n{{2}} COUNT(DISTINCT EmployeeID) > 2"},
  51:{"mode":"code","label":"Completa el JOIN temporal con la dimensión cliente","code":"SELECT o.OrderLineID, o.OrderDate, c.customer_key,\n       c.customer_id, o.Quantity, o.UnitPrice, o.TaxRate\nFROM Lakehouse1.orderlines o\nINNER JOIN Lakehouse2.dim_customer c\n  ON o.customerid = c.customer_id\n AND {{0}}\n AND {{1}}"},
  55:{"mode":"code","label":"Corrige las conversiones de tipos","code":"SELECT item_id AS ItemId\n {{0}} AS ItemName,\n item_description AS ItemDescription\n {{1}} AS PurchaseDate\nFROM Table1\nWHERE item_type = @itemtype_parameter"},
  74:{"mode":"code","label":"Completa el enmascaramiento dinámico de la tarjeta","code":"{{0}} TABLE dbo.CreditCard\n{{1}} COLUMN [CreditCard]\nADD MASKED\nWITH (FUNCTION = '{{2}}(2,\"XXXXXXXXXX\",4)')"},
  75:{"mode":"code","label":"Completa la expresión dinámica del pipeline","code":"@activity('{{0}}').{{1}}"},
  76:{"mode":"code","label":"Completa las funciones de enmascaramiento","code":"ALTER TABLE DimCustomer\nALTER COLUMN BirthDate\nADD MASKED WITH (FUNCTION = {{0}})\n\nALTER TABLE DimCustomer\nALTER COLUMN EmailAddress\nADD MASKED WITH (FUNCTION = {{1}})"},
  86:{"mode":"code","label":"Completa los permisos T-SQL","code":"GRANT {{0}} ON\nCustomers(CustomerID, FirstName, LastName, Phone)\nTO {{1}}"},
  92:{"mode":"code","label":"Completa la operación MERGE de PySpark","code":"(targetDF.merge(sourceDF, 'sourceDF.Key = targetDF.Key')\n {{0}} set = {'targetDF.LastModified': 'sourceDF.LastModified'}\n {{1}} values = {'targetDF.Key': 'sourceDF.Key',\n                   'targetDF.LastModified': 'sourceDF.LastModified',\n                   'targetDF.Status': 'sourceDF.Status'}\n {{2}} condition = 'targetDF.LastModified > (current_date() - INTERVAL 7 DAYS)',\n                   set = {'targetDF.Status': 'inactive'}\n .execute())"},
  97:{"mode":"sequence","label":"Ordena tres segmentos para crear la tabla KQL","keepFirstImage":true,"pool":["StreamData:long)"," .create table EventStreamData  (","StreamData:dynamic )",".create function EventStreamData (","TimeStamp:datetime, DeviceId:string"]},
  103:{"mode":"match","label":"Coloca los operadores KQL en los huecos originales","pool":["evaluate","extend","lookup","project","sort","summarize","take"],"keepFirstImage":true},
  123:{"mode":"mapping","label":"Selecciona el elemento de Fabric para cada grupo","keepFirstImage":true},
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
 for(const [id,rows] of Object.entries({"44":[["FULL JOIN","INNER JOIN","LEFT ANTI JOIN","LEFT OUTER JOIN","OUTER JOIN"],["FULL JOIN","INNER JOIN","LEFT ANTI JOIN","LEFT OUTER JOIN","OUTER JOIN"],["CategoryID = 1","CategoryName is not null","IsActive = 1","IsActive is not null","ProductNumber is not null","SubCategoryID = 1","SubCategoryName is not null"]],"46":[["CAST","CONVERT","REPLACE","SUBSTRING"],["CROSS JOIN","INNER JOIN","LEFT OUTER JOIN","RIGHT OUTER JOIN"],["CONTAINS","HAVING","LIMIT","WHERE"]],"51":[["c.is_current = 1","o.OrderDate > c.valid_to_datetime","o.OrderDate >= c.valid_from_datetime"],["c.is_current = 1","o.OrderDate < c.valid_to_datetime","o.OrderDate <= c.valid_from_datetime"]],"55":[[",convert(varchar(20), item_name)",",convert(varchar(max), item_name)",",try_cast(item_name as varchar(20))"],[",convert(varchar, purchase_date, 7)",",convert(varchar, purchase_date, 109)",",convert(varchar, purchase_date, 112)"]],"74":[["ALTER","CREATE","DEFAULT","DROP","EMAIL","PARTIAL","REPLACE","UPDATE"],["ALTER","CREATE","DEFAULT","DROP","EMAIL","PARTIAL","REPLACE","UPDATE"],["ALTER","CREATE","DEFAULT","DROP","EMAIL","PARTIAL","REPLACE","UPDATE"]],"75":[["Batch Object Copy","Dynamic Data Copy","Extraction Loop","Lookup Schema and Table"],["output","output.count","output.pipelineReturnValue","output.value"]],"76":[["'default()'","'partial(1900-01-01)'","'random(1900-01-01, 1900-01-01)'"],["'default()'","'email()'","'partial(1, \"@\", 5)'","'random(1, \"@\", 5)'"]],"86":[["ALTER","EXECUTE","READ","SELECT","VIEW"],["User1","[User1]","[user1@contoso.com]"]],"92":[[".whenMatchedInsert(",".whenMatchedUpdate(",".whenNotMatchedBySourceInsert(",".whenNotMatchedBySourceUpdate(",".whenNotMatchedInsert(",".whenNotMatchedUpdate("],[".whenMatchedInsert(",".whenMatchedUpdate(",".whenNotMatchedBySourceInsert(",".whenNotMatchedBySourceUpdate(",".whenNotMatchedInsert(",".whenNotMatchedUpdate("],[".whenMatchedInsert(",".whenMatchedUpdate(",".whenNotMatchedBySourceInsert(",".whenNotMatchedBySourceUpdate(",".whenNotMatchedInsert(",".whenNotMatchedUpdate("]],"123":[["A data pipeline","A Dataflow Gen2","An eventstream","A notebook"],["A data pipeline","A Dataflow Gen2","An eventstream","A notebook"],["A data pipeline","A Dataflow Gen2","An eventstream","A notebook"]]})){
   const item=window.DP700_INTERACTIVE?.[id];if(!item)continue;
   item.fields.forEach((f,i)=>{if(rows[i])f.choices=rows[i]});
 }
 for(const id of [97,103]){
   const item=window.DP700_INTERACTIVE?.[id],replica=window.DP700_REPLICAS[id];
   if(item&&replica)item.fields.forEach(f=>f.choices=replica.pool);
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
