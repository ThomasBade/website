let pages=[], graph={nodes:[],edges:[]}, manifest={};
const graphView={nodes:[],selectedId:null};
const $=s=>document.querySelector(s), avg=(arr,key)=>Math.round(arr.reduce((a,x)=>a+x[key],0)/(arr.length||1));
const level=n=>n>=70?'good':n>=50?'mid':'low';
async function init(){
  const request={cache:'no-store'};
  const [pr,gr,mr]=await Promise.all([fetch('data/pages.json',request).then(r=>r.json()),fetch('data/graph.json',request).then(r=>r.json()),fetch('data/build-manifest.json',request).then(r=>r.json())]);
  pages=Array.isArray(pr)?pr:pr.items; graph=gr; manifest=mr; fillMetrics(); renderRows(); renderTopics(); drawGraph();
}
function fillMetrics(){
  const seo=avg(pages,'seo_score'),geo=avg(pages,'geo_score'),ai=avg(pages,'ai_overview_probability');
  $('#pageCount').textContent=pages.length; $('#topicCount').textContent=graph.nodes.filter(n=>n.type==='topic').length;
  $('#avgSeo').textContent=seo; $('#avgGeo').textContent=geo; $('#avgAi').textContent=ai+'%';
  $('#maturityLabel').textContent=geo>=70?'Fortgeschrittene GEO-Reife':geo>=50?'Entwickelte GEO-Basis':'GEO-Potenzial erschließen';
  $('#generated').textContent='Stand '+new Date(graph.meta.generated_at).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'})+' · Build '+manifest.buildId;
}
function renderRows(){
  const q=$('#search').value.toLowerCase(), category=$('#category').value, sort=$('#sort').value;
  let list=pages.filter(p=>(p.title+' '+p.topics.join(' ')).toLowerCase().includes(q));
  if(category==='interactive')list=list.filter(p=>p.interactive_tool);else if(category!=='all')list=list.filter(p=>(p.tool_capabilities||[]).includes(category));
  list.sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title):(a,b)=>b[{geo:'geo_score',seo:'seo_score',ai:'ai_overview_probability'}[sort]]-a[{geo:'geo_score',seo:'seo_score',ai:'ai_overview_probability'}[sort]]);
  $('#pageRows').innerHTML=list.map(p=>`<tr data-slug="${p.slug}"><td class="page-title">${esc(p.title)}<small>${p.filename} · ${p.word_count.toLocaleString('de-DE')} Wörter${p.content_status==='duplicate-alias'?' · kanonischer Alias':''}${p.interactive_tool?' · Interaktives Werkzeug':''}</small></td><td><span class="badge">${p.interactive_tool?esc(p.tool_type):(p.content_status==='duplicate-alias'?'Alias':p.maturity)}</span></td>${scoreCell(p.seo_score)}${scoreCell(p.geo_score)}<td><span class="dot ${level(p.ai_overview_probability)}"></span>${p.ai_overview_probability}%</td><td class="arrow">→</td></tr>`).join('');
  document.querySelectorAll('tbody tr').forEach(tr=>tr.onclick=()=>showDetail(tr.dataset.slug));
}
function scoreCell(n){return `<td><div class="score"><b>${n}</b><span class="bar"><i style="width:${n}%"></i></span></div></td>`}
function renderTopics(){
  const list=graph.nodes.filter(n=>n.type==='topic').sort((a,b)=>b.count-a.count).slice(0,12), max=list[0]?.count||1;
  $('#topics').innerHTML=list.map(t=>`<div class="topic"><div class="topic-line"><b>${esc(t.label)}</b><span>${t.count} Seiten</span></div><div class="topic-track"><i style="width:${t.count/max*100}%"></i></div></div>`).join('');
}
function showDetail(slug){
  const p=pages.find(x=>x.slug===slug), checks=(title,obj)=>`<h3>${title}</h3><div class="check-grid">${Object.entries(obj).map(([k,v])=>`<span class="check ${v?'ok':'no'}">${v?'✓':'○'} ${esc(k)}</span>`).join('')}</div>`;
  const edges=graph.edges.filter(e=>e.source===p.id), asserted=edges.filter(e=>e.assertionStatus==='asserted').length, extracted=edges.filter(e=>e.assertionStatus==='extracted').length, inferred=edges.filter(e=>e.isInferred).length;
  const tool=p.interactive_tool?`<h3>Interaktives Werkzeug</h3><p><strong>${esc(p.tool_type)}</strong></p><div class="chips">${p.tool_capabilities.map(c=>`<span class="chip">${esc({assessment:'Assessment',checklist:'Checkliste',notes:'Notizen',scoring:'Auswertung',summary:'Management Summary',pdf:'PDF-Export',progress:'Fortschrittsanzeige'}[c]||c)}</span>`).join('')}</div>`:'';
  $('#detailBody').innerHTML=`<p class="eyebrow">${p.filename}</p><h2>${esc(p.title)}</h2><p>${esc(p.summary)}</p><div class="detail-scores"><div><span>SEO</span><strong>${p.seo_score}</strong></div><div><span>GEO</span><strong>${p.geo_score}</strong></div><div><span>AI Overview</span><strong>${p.ai_overview_probability}%</strong></div></div>${tool}<div class="chips">${p.topics.map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div><h3>Provenienz & Graphstatus</h3><p>${edges.length} Beziehungen · ${asserted} explizite Seitenverweise · ${extracted} deterministisch extrahierte Themen · ${inferred} inferierte Kanten. Ungeprüfte Inferenz wird nicht als Fakt veröffentlicht.</p>${checks('SEO-Signale',p.seo_checks)}${checks('GEO-Signale',p.geo_checks)}<div class="actions"><a href="data/exports/${p.slug}.md" download>Markdown</a><a href="data/exports/${p.slug}.json" download>JSON</a><a href="data/jsonld/${p.slug}.json" target="_blank">JSON-LD</a><a href="../${p.filename}" target="_blank">Seite öffnen</a></div>`;
  $('#detail').showModal();
}
function drawGraph(){
  const canvas=$('#graphCanvas'),ctx=canvas.getContext('2d'),dpr=devicePixelRatio||1,rect=canvas.getBoundingClientRect(); canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.scale(dpr,dpr);
  const w=rect.width,h=rect.height, topics=graph.nodes.filter(n=>n.type==='topic').sort((a,b)=>b.count-a.count).slice(0,22), tids=new Set(topics.map(n=>n.id));
  const isLinkNode=n=>n&&(n.type==='page'||n.type==='external'), selectedGraphNode=graph.nodes.find(n=>n.id===graphView.selectedId);
  const selectedLinks=selectedGraphNode?.type==='topic'?graph.edges.filter(e=>e.source===selectedGraphNode.id||e.target===selectedGraphNode.id).map(e=>graph.nodes.find(n=>n.id===(e.source===selectedGraphNode.id?e.target:e.source))).filter(isLinkNode):[];
  const baseLinks=graph.nodes.filter(n=>isLinkNode(n)&&graph.edges.some(e=>(e.source===n.id&&tids.has(e.target))||(e.target===n.id&&tids.has(e.source)))).slice(0,34);
  const pageNodes=[...new Map([...selectedLinks,...baseLinks].map(n=>[n.id,n])).values()], nodes=[...topics,...pageNodes];
  nodes.forEach((n,i)=>{const ring=n.type==='topic'?0.28:0.44, angle=i*2.39996+(isLinkNode(n)?1:.2);n.x=w/2+Math.cos(angle)*w*ring*(.75+(i%5)/12);n.y=h/2+Math.sin(angle)*h*ring*(.72+(i%4)/13);n.r=n.type==='topic'?Math.min(13,5+(n.count||1)):4});
  graphView.nodes=nodes;
  const map=new Map(nodes.map(n=>[n.id,n])),visibleEdges=graph.edges.filter(e=>map.has(e.source)&&map.has(e.target)),selected=graphView.selectedId,selectedNode=map.get(selected);
  const connected=new Set(selected?[selected]:[]);if(selected)visibleEdges.forEach(e=>{if(e.source===selected)connected.add(e.target);if(e.target===selected)connected.add(e.source)});
  const selectedPages=selectedNode?.type==='topic'?[...new Map(visibleEdges.filter(e=>e.source===selected||e.target===selected).map(e=>map.get(e.source===selected?e.target:e.source)).filter(isLinkNode).map(n=>[n.id,n])).values()].sort((a,b)=>a.label.localeCompare(b.label,'de')):[];
  const pageNumbers=new Map(selectedPages.map((n,i)=>[n.id,i+1]));
  visibleEdges.forEach(e=>{const a=map.get(e.source),b=map.get(e.target),active=!selected||e.source===selected||e.target===selected;ctx.strokeStyle=active&&selected?'#c66a36':getComputedStyle(document.body).getPropertyValue('--line');ctx.globalAlpha=selected?(active?.9:.08):.55;ctx.lineWidth=active&&selected?2:1;ctx.setLineDash(e.isInferred?[5,4]:[]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()});ctx.setLineDash([]);ctx.lineWidth=1;ctx.globalAlpha=1;
  nodes.forEach(n=>{const active=!selected||connected.has(n.id);ctx.globalAlpha=active?1:.16;ctx.beginPath();ctx.fillStyle=n.type==='topic'?'#1d6b50':'#ed7f43';ctx.arc(n.x,n.y,n.r+(n.id===selected?3:0),0,Math.PI*2);ctx.fill();if(n.id===selected){ctx.strokeStyle='#102d25';ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1}if(n.type==='topic'&&active){ctx.font='11px Segoe UI';ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--ink');ctx.fillText(n.label,n.x+n.r+4,n.y+4)}if(isLinkNode(n)&&active&&pageNumbers.has(n.id)){ctx.font='700 10px Segoe UI';ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--ink');ctx.fillText(String(pageNumbers.get(n.id)),n.x+7,n.y-6)}});ctx.globalAlpha=1;
  const relationCount=selected?visibleEdges.filter(e=>e.source===selected||e.target===selected).length:0;
  $('.graph-panel .hint').textContent=selectedNode?`Ausgewählt: ${selectedNode.label} · ${relationCount} direkte Beziehungen.`:'Knoten auswählen, um Beziehungen hervorzuheben. Orange: Seiten · Grün: Fachbegriffe.';
  renderGraphRelations(selectedNode,selectedPages);
  $('#resetGraph').disabled=!selected;
}
function renderGraphRelations(selectedNode,selectedPages){const box=$('#graphRelations');if(!selectedNode||selectedNode.type!=='topic'){box.hidden=true;box.innerHTML='';return}box.hidden=false;box.innerHTML=`<div class="relation-head"><strong>${selectedPages.length} verbundene Seiten und Profile</strong><span>Nummern entsprechen den orangefarbenen Knoten in der Grafik.</span></div><ol>${selectedPages.map(n=>`<li><a href="${esc(n.url)}" target="_blank" rel="noopener"><strong>${esc(n.label)}</strong><small>${esc(n.url)}</small></a></li>`).join('')}</ol>`}
function graphNodeAt(event){const canvas=$('#graphCanvas'),rect=canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;return [...graphView.nodes].reverse().find(n=>Math.hypot(n.x-x,n.y-y)<=Math.max(10,n.r+6))}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('#search').addEventListener('input',renderRows);$('#category').addEventListener('change',renderRows);$('#sort').addEventListener('change',renderRows);$('#detail .close').onclick=()=>$('#detail').close();$('#detail').onclick=e=>{if(e.target===$('#detail'))$('#detail').close()};
$('#theme').onclick=()=>{document.body.classList.toggle('dark');drawGraph()};$('#resetGraph').onclick=()=>{graphView.selectedId=null;drawGraph()};$('#graphCanvas').onclick=e=>{const node=graphNodeAt(e);if(node){graphView.selectedId=node.id;drawGraph()}};$('#graphCanvas').onpointermove=e=>{$('#graphCanvas').style.cursor=graphNodeAt(e)?'pointer':'default'};addEventListener('resize',()=>{clearTimeout(window.rt);window.rt=setTimeout(drawGraph,150)});init().catch(e=>{$('#pageRows').innerHTML=`<tr><td>Analyse-Daten fehlen: ${esc(e.message)}. Bitte scripts/analyze.py ausführen.</td></tr>`});
