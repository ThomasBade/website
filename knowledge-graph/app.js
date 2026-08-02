let pages=[], graph={nodes:[],edges:[]};
const $=s=>document.querySelector(s), avg=(arr,key)=>Math.round(arr.reduce((a,x)=>a+x[key],0)/(arr.length||1));
const level=n=>n>=70?'good':n>=50?'mid':'low';
async function init(){
  const [pr,gr]=await Promise.all([fetch('data/pages.json').then(r=>r.json()),fetch('data/graph.json').then(r=>r.json())]);
  pages=Array.isArray(pr)?pr:pr.items; graph=gr; fillMetrics(); renderRows(); renderTopics(); drawGraph();
}
function fillMetrics(){
  const seo=avg(pages,'seo_score'),geo=avg(pages,'geo_score'),ai=avg(pages,'ai_overview_probability');
  $('#pageCount').textContent=pages.length; $('#topicCount').textContent=graph.nodes.filter(n=>n.type==='topic').length;
  $('#avgSeo').textContent=seo; $('#avgGeo').textContent=geo; $('#avgAi').textContent=ai+'%';
  $('#maturityLabel').textContent=geo>=70?'Fortgeschrittene GEO-Reife':geo>=50?'Entwickelte GEO-Basis':'GEO-Potenzial erschließen';
  $('#generated').textContent='Stand '+new Date(graph.meta.generated_at).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'});
}
function renderRows(){
  const q=$('#search').value.toLowerCase(), sort=$('#sort').value;
  let list=pages.filter(p=>(p.title+' '+p.topics.join(' ')).toLowerCase().includes(q));
  list.sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title):(a,b)=>b[{geo:'geo_score',seo:'seo_score',ai:'ai_overview_probability'}[sort]]-a[{geo:'geo_score',seo:'seo_score',ai:'ai_overview_probability'}[sort]]);
  $('#pageRows').innerHTML=list.map(p=>`<tr data-slug="${p.slug}"><td class="page-title">${esc(p.title)}<small>${p.filename} · ${p.word_count.toLocaleString('de-DE')} Wörter</small></td><td><span class="badge">${p.maturity}</span></td>${scoreCell(p.seo_score)}${scoreCell(p.geo_score)}<td><span class="dot ${level(p.ai_overview_probability)}"></span>${p.ai_overview_probability}%</td><td class="arrow">→</td></tr>`).join('');
  document.querySelectorAll('tbody tr').forEach(tr=>tr.onclick=()=>showDetail(tr.dataset.slug));
}
function scoreCell(n){return `<td><div class="score"><b>${n}</b><span class="bar"><i style="width:${n}%"></i></span></div></td>`}
function renderTopics(){
  const list=graph.nodes.filter(n=>n.type==='topic').sort((a,b)=>b.count-a.count).slice(0,12), max=list[0]?.count||1;
  $('#topics').innerHTML=list.map(t=>`<div class="topic"><div class="topic-line"><b>${esc(t.label)}</b><span>${t.count} Seiten</span></div><div class="topic-track"><i style="width:${t.count/max*100}%"></i></div></div>`).join('');
}
function showDetail(slug){
  const p=pages.find(x=>x.slug===slug), checks=(title,obj)=>`<h3>${title}</h3><div class="check-grid">${Object.entries(obj).map(([k,v])=>`<span class="check ${v?'ok':'no'}">${v?'✓':'○'} ${esc(k)}</span>`).join('')}</div>`;
  $('#detailBody').innerHTML=`<p class="eyebrow">${p.filename}</p><h2>${esc(p.title)}</h2><p>${esc(p.summary)}</p><div class="detail-scores"><div><span>SEO</span><strong>${p.seo_score}</strong></div><div><span>GEO</span><strong>${p.geo_score}</strong></div><div><span>AI Overview</span><strong>${p.ai_overview_probability}%</strong></div></div><div class="chips">${p.topics.map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div>${checks('SEO-Signale',p.seo_checks)}${checks('GEO-Signale',p.geo_checks)}<div class="actions"><a href="data/exports/${p.slug}.md" download>Markdown</a><a href="data/exports/${p.slug}.json" download>JSON</a><a href="data/jsonld/${p.slug}.json" target="_blank">JSON-LD</a><a href="../${p.filename}" target="_blank">Seite öffnen</a></div>`;
  $('#detail').showModal();
}
function drawGraph(){
  const canvas=$('#graphCanvas'),ctx=canvas.getContext('2d'),dpr=devicePixelRatio||1,rect=canvas.getBoundingClientRect(); canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.scale(dpr,dpr);
  const w=rect.width,h=rect.height, topics=graph.nodes.filter(n=>n.type==='topic').sort((a,b)=>b.count-a.count).slice(0,22), tids=new Set(topics.map(n=>n.id));
  const pageNodes=graph.nodes.filter(n=>n.type==='page'&&graph.edges.some(e=>e.source===n.id&&tids.has(e.target))).slice(0,34), nodes=[...topics,...pageNodes];
  nodes.forEach((n,i)=>{const ring=n.type==='topic'?0.28:0.44, angle=i*2.39996+(n.type==='page'?1:.2);n.x=w/2+Math.cos(angle)*w*ring*(.75+(i%5)/12);n.y=h/2+Math.sin(angle)*h*ring*(.72+(i%4)/13)});
  const map=new Map(nodes.map(n=>[n.id,n])); ctx.strokeStyle=getComputedStyle(document.body).getPropertyValue('--line');ctx.globalAlpha=.55;
  graph.edges.filter(e=>map.has(e.source)&&map.has(e.target)).forEach(e=>{const a=map.get(e.source),b=map.get(e.target);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()});ctx.globalAlpha=1;
  nodes.forEach(n=>{ctx.beginPath();ctx.fillStyle=n.type==='topic'?'#1d6b50':'#ed7f43';const r=n.type==='topic'?Math.min(13,5+(n.count||1)) : 4;ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fill();if(n.type==='topic'){ctx.font='11px Segoe UI';ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--ink');ctx.fillText(n.label,n.x+r+4,n.y+4)}});
}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('#search').addEventListener('input',renderRows);$('#sort').addEventListener('change',renderRows);$('#detail .close').onclick=()=>$('#detail').close();$('#detail').onclick=e=>{if(e.target===$('#detail'))$('#detail').close()};
$('#theme').onclick=()=>{document.body.classList.toggle('dark');drawGraph()};$('#resetGraph').onclick=drawGraph;addEventListener('resize',()=>{clearTimeout(window.rt);window.rt=setTimeout(drawGraph,150)});init().catch(e=>{$('#pageRows').innerHTML=`<tr><td>Analyse-Daten fehlen: ${esc(e.message)}. Bitte scripts/analyze.py ausführen.</td></tr>`});
