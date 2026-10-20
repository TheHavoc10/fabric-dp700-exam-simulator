(function replicaUiFactory(){
  'use strict';
  const cfg=window.DP700_REPLICAS||{};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sel=(f,i,v,disabled)=>'<select class="replica-select" data-fill="'+i+'" aria-label="'+esc(f.label)+'" '+(disabled?'disabled':'')+'><option value="">Selecciona…</option>'+(f.choices||[]).map(x=>'<option value="'+esc(x)+'" '+(v===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select>';
  function render(q,fields,vals,disabled){
    const c=cfg[q.id];if(!c)return '';
    const mode=c.mode;
    let h='<section class="replica-panel" data-replica="'+esc(q.id)+'"><div class="replica-heading"><strong>'+esc(c.label||'Completa la respuesta')+'</strong><span class="replica-hint">Las soluciones se muestran al corregir</span></div>';
    if(mode==='yesno'){
      h+='<div class="replica-binary" role="group" aria-label="Afirmaciones Sí o No"><div class="replica-binary-head"><span>Afirmación</span><span>Sí</span><span>No</span></div>';
      fields.forEach((f,i)=>{h+='<div class="replica-binary-row"><div class="replica-statement">'+esc(f.label)+'</div>';
        for(const ch of ['Sí','No'])h+='<button type="button" data-replica-choice="'+i+'" data-value="'+ch+'" class="replica-binary-btn '+(vals[i]===ch?'selected':'')+'" aria-pressed="'+(vals[i]===ch)+'" '+(disabled?'disabled':'')+'>'+ch+'</button>';
        h+='</div>';
      });h+='</div>';
    }else if(mode==='code'){
      if(c.keepFirstImage){
        const images=[...q.stem.matchAll(/<img\b[^>]*>/gi)];
        if(images.length)h+='<div class="replica-table"><span class="replica-hint">Tabla de origen</span>'+images[0][0]+'</div>';
      }
      let code=String(c.code||'');
      const chunks=code.split(/(\{\{\d+\}\})/g);
      h+='<pre class="replica-code"><code>'+chunks.map(chunk=>{
        const match=chunk.match(/^\{\{(\d+)\}\}$/);if(!match)return esc(chunk);
        const i=Number(match[1]);return fields[i]?sel(fields[i],i,vals[i]||'',disabled):esc(chunk);
      }).join('')+'</code></pre>';
    }else if(mode==='mapping'){
      h+='<div class="replica-map">';
      fields.forEach((f,i)=>h+='<label class="replica-map-row"><span>'+esc(f.label)+'</span>'+sel(f,i,vals[i]||'',disabled)+'</label>');h+='</div>';
    }else if(mode==='match'||mode==='sequence'){
      const choices=(c.pool||[...new Set(fields.flatMap(f=>f.choices||[]))]);
      h+='<div class="replica-drag-layout"><div class="replica-pool"><strong>Opciones disponibles</strong><p class="replica-hint">Toca una tarjeta y después su destino; en ordenador también puedes arrastrarla.</p><div class="replica-source-grid">';
      for(const opt of choices)h+='<button type="button" class="replica-token" data-replica-token="'+esc(opt)+'" draggable="'+(!disabled)+'" '+(disabled?'disabled':'')+'>'+esc(opt)+'</button>';
      h+='</div></div><div class="replica-destinations"><strong>'+(mode==='sequence'?'Orden correcto':'Área de respuesta')+'</strong>';
      fields.forEach((f,i)=>{
        const current=vals[i]||'';
        h+='<div class="replica-destination-row"><label class="replica-destination" data-replica-target="'+i+'" tabindex="'+(disabled?'-1':'0')+'" role="button" aria-label="Destino: '+esc(f.label)+'"><span>'+esc(f.label)+'</span><strong>'+esc(current||'Toca aquí para asignar')+'</strong></label>';
        if(!disabled)h+='<div class="replica-target-actions">'+(mode==='sequence'?'<button type="button" class="replica-small" data-replica-move="'+i+'" data-delta="-1" '+(i===0?'disabled':'')+' aria-label="Subir">↑</button><button type="button" class="replica-small" data-replica-move="'+i+'" data-delta="1" '+(i===fields.length-1?'disabled':'')+' aria-label="Bajar">↓</button>':'')+'<button type="button" class="replica-small" data-replica-clear="'+i+'" aria-label="Quitar respuesta">×</button></div>';
        h+='</div>';
      });h+='</div></div>';
    }
    return h+'</section>';
  }
  function bind(q,ctx){
    if(!cfg[q.id])return;
    const root=document.querySelector('[data-replica="'+q.id+'"]');if(!root)return;
    let pending=null;
    const update=(i,value)=>{
      const s=ctx.session();
      const vals={...(s.written?.[q.id]||{})};
      if((cfg[q.id].mode==='sequence'||cfg[q.id].mode==='match')&&value){
        for(const [k,v] of Object.entries(vals))if(v===value&&Number(k)!==i)ctx.setWritten(Number(k),'');
      }
      ctx.setWritten(i,value);ctx.redraw();
    };
    root.querySelectorAll('[data-replica-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      update(Number(btn.dataset.replicaChoice),btn.dataset.value);
    }));
    root.querySelectorAll('[data-replica-token]').forEach(btn=>{
      const activate=()=>{pending=btn.dataset.replicaToken;root.querySelectorAll('[data-replica-token]').forEach(b=>b.classList.toggle('picked',b===btn))};
      btn.addEventListener('click',activate);
      btn.addEventListener('dragstart',e=>{activate();if(e.dataTransfer)e.dataTransfer.setData('text/plain',pending)});
    });
    root.querySelectorAll('[data-replica-target]').forEach(target=>{
      const commit=(value)=>{if(!value)return;update(Number(target.dataset.replicaTarget),value);pending=null};
      target.addEventListener('click',()=>commit(pending));
      target.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();commit(pending)}});
      target.addEventListener('dragover',e=>e.preventDefault());
      target.addEventListener('drop',e=>{e.preventDefault();commit(e.dataTransfer?.getData('text/plain')||pending)});
    });
    root.querySelectorAll('[data-replica-clear]').forEach(btn=>btn.addEventListener('click',()=>update(Number(btn.dataset.replicaClear),'')));
    root.querySelectorAll('[data-replica-move]').forEach(btn=>btn.addEventListener('click',()=>{
      const i=Number(btn.dataset.replicaMove),j=i+Number(btn.dataset.delta);
      const fields=ctx.fields(),s=ctx.session();if(j<0||j>=fields.length)return;
      const a=String(s.written?.[q.id]?.[i]||''),b=String(s.written?.[q.id]?.[j]||'');
      ctx.setWritten(i,b);ctx.setWritten(j,a);ctx.redraw();
    }));
  }
  window.DP700_UI={render,bind};
})();