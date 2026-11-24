const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CATS={
link:{n:'Link e comissão',re:/link|venda|comiss|rastre|contou|apareceu|afiliad|cliqu/i,
f:[{id:'canal',q:'Onde você divulgou o link?',o:['Instagram','TikTok','WhatsApp','YouTube','Outro']},{id:'disp',q:'Qual aparelho o comprador usou?',o:['iPhone','Android','Computador','Não sei']},{id:'quando',q:'Quando foi a compra? (dia e hora aproximados)'},{id:'produto',q:'Qual produto ou link?'}],
p:['Abrir o link divulgado em {canal}, em {disp}','Fazer uma compra de teste em ambiente de homologação','Conferir se o pedido registra o creator como origem','Comparar o horário ({quando}) com o registro de cliques de {produto}']},
saque:{n:'Pagamento e saque',re:/saque|pagamento|pix|carteira|saldo|repasse/i,
f:[{id:'valor',q:'Qual o valor?'},{id:'quando',q:'Quando pediu o saque?'},{id:'status',q:'O que aparece no app?',o:['Pendente','Recusado','Sem retorno','Outro']}],
p:['Localizar a solicitação de {valor} feita em {quando}','Comparar o status interno com o exibido no app ({status})','Verificar pendências de conciliação']},
acesso:{n:'Acesso e conta',re:/acesso|senha|login|entrar|membros/i,
f:[{id:'quem',q:'Quem não consegue acessar?',o:['Comprador','Creator','Produtor']},{id:'produto',q:'Qual produto ou área?'},{id:'erro',q:'Que mensagem aparece?'}],
p:['Reproduzir o login como {quem} em {produto}','Registrar a mensagem exibida: {erro}','Verificar o status da conta e do pedido']},
outro:{n:'Outro problema',re:/./,
f:[{id:'tentou',q:'O que você tentou fazer?'},{id:'esperava',q:'O que esperava que acontecesse?'},{id:'aconteceu',q:'O que aconteceu de fato?'}],
p:['Repetir: {tentou}','Comparar o esperado ({esperava}) com o obtido ({aconteceu})']}};
const STATUS=['Aguardando QA','Em análise','Resolvido'];
let fila=[{id:'CC-101',t:'Venda não atribuída a creator (exemplo)',c:'Link e comissão',s:'Aguardando QA',p:100},{id:'CC-102',t:'Saque pendente sem retorno (exemplo)',c:'Pagamento e saque',s:'Em análise',p:67},{id:'CC-103',t:'Creator sem acesso a produto (exemplo)',c:'Acesso e conta',s:'Resolvido',p:100}];
let cur=null,seq=104;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2200)};
const msg=(k,h)=>$('#status').innerHTML=h?`<div class="msg ${k}" ${k==='err'?'role="alert"':''}>${h}</div>`:'';
const mask=t=>{let n=0;const r=t.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g,()=>(n++,'[e-mail]')).replace(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g,()=>(n++,'[CPF]')).replace(/\(?\d{2}\)?\s?9?\d{4}-?\d{4}/g,()=>(n++,'[telefone]'));return{r,n}};
const fill=(s,a)=>s.replace(/\{(\w+)\}/g,(_,k)=>a[k]||'[faltando]');
const hip=(c,a)=>{const h=[];if(c!=='link')return h;if(['Instagram','TikTok'].includes(a.canal))h.push('Navegador embutido do app pode ter isolado cookies. Verificar nos registros.');if(a.disp==='iPhone')h.push('O Safari limita a vida de cookies. Verificar o tempo entre clique e compra.');return h};
function tab(n){$$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===n));$$('.panel').forEach(p=>p.hidden=p.id!==n);if(n==='fila')lista()}
$$('.tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));
$('#ex').onclick=()=>{$('#relato').value='Minha venda não apareceu e o comprador diz que usou meu link. Contato: ana@email.com';$('#relato').focus()};
$('#analisar').onclick=()=>{
const txt=$('#relato').value.trim();$('#perg').hidden=$('#caso').hidden=true;
if(txt.length<15)return msg('err','Escreva pelo menos uma frase com o que aconteceu (mínimo de 15 caracteres).');
const b=$('#analisar');b.disabled=true;msg('load','<span class="spin"></span>Analisando o relato…');
setTimeout(()=>{b.disabled=false;const m=mask(txt),k=['link','saque','acesso'].find(c=>CATS[c].re.test(txt))||'outro';cur={k,m};
$('#perg').innerHTML=`<h2>Faltam algumas informações</h2><p class="meta">Categoria sugerida: <b>${CATS[k].n}</b>${m.n?` · ${m.n} dado(s) pessoal(is) mascarado(s) antes da análise`:''}. Preencha o que souber.</p>`+
CATS[k].f.map(f=>`<label for="q_${f.id}">${f.q}</label>`+(f.o?`<select id="q_${f.id}"><option value="">Selecione</option>${f.o.map(o=>`<option>${o}</option>`).join('')}</select>`:`<input id="q_${f.id}">`)).join('')+'<div class="row"><button class="primary" type="submit">Montar caso</button></div>';
$('#perg').hidden=false;msg('ok','Relato analisado. Responda as perguntas abaixo.')},900)};
$('#perg').onsubmit=e=>{e.preventDefault();const c=CATS[cur.k],a={};c.f.forEach(f=>a[f.id]=$('#q_'+f.id).value.trim());
const n=c.f.filter(f=>a[f.id]).length,p=Math.round(n/c.f.length*100),falta=c.f.filter(f=>!a[f.id]),h=hip(cur.k,a);
const tit=`${c.n}: ${cur.m.r.slice(0,60)}${cur.m.r.length>60?'…':''}`;
const resp=`Oi! Recebemos seu relato e organizamos as informações para o time.${falta.length?' Para avançar, pode nos dizer: '+falta.map(f=>f.q.replace('?','').toLowerCase()).join('; ')+'?':' Vamos verificar e voltamos com um retorno por aqui.'} (Rascunho para revisão humana.)`;
cur.caso={tit,c:c.n,p,txt:`CASO: ${tit}\nCompletude: ${p}%\nRelato (mascarado): ${cur.m.r}\n`+c.f.map(f=>`${f.q} ${a[f.id]||'—'}`).join('\n')+`\nPassos para reproduzir:\n`+c.p.map((s,i)=>`${i+1}. ${fill(s,a)}`).join('\n')+`\nHipóteses a verificar:\n`+(h.join('\n')||'Sem hipótese: dados insuficientes.')};
const ok=p>=50;
$('#caso').innerHTML=`<article class="card"><h3>${esc(tit)}</h3><p class="meta">${c.n} · completude ${p}%: ${n} de ${c.f.length} informações essenciais preenchidas</p><div class="bar"><i style="width:${p}%"></i></div>
${p<75?`<div class="msg warn">Completude baixa: uma pessoa precisa conferir antes de enviar.</div>`:''}
<h4>Relato (dados pessoais mascarados)</h4><p>${esc(cur.m.r)}</p><h4>O que sabemos</h4><table>${c.f.map(f=>`<tr><td>${f.q}</td><td>${esc(a[f.id])||'<i>faltando</i>'}</td></tr>`).join('')}</table>
<h4>Passos para reproduzir (modelo)</h4><ol>${c.p.map(s=>`<li>${esc(fill(s,a))}</li>`).join('')}</ol>
<h4>Hipóteses a verificar, não conclusões</h4>${h.length?`<ul>${h.map(x=>`<li>${x}</li>`).join('')}</ul>`:'<p>Sem hipótese: os dados não explicam o problema. Revisão humana.</p>'}
<h4>Rascunho de resposta ao creator</h4><p>${esc(resp)}</p>
<div class="row"><button id="cp">Copiar caso</button><button id="ap" class="primary" ${ok?'':'disabled'}>Aprovar e enviar à fila</button></div>${ok?'':'<p class="meta">Responda pelo menos metade das perguntas para enviar.</p>'}</article>`;
$('#caso').hidden=false;$('#caso').scrollIntoView({behavior:'smooth'});
$('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(cur.caso.txt);toast('Caso copiado')}catch{toast('Não foi possível copiar neste navegador')}};
$('#ap').onclick=()=>{fila.unshift({id:'CC-'+seq++,t:cur.caso.tit,c:cur.caso.c,s:'Aguardando QA',p:cur.caso.p});$('#cnt').textContent=fila.length;$('#relato').value='';$('#perg').hidden=$('#caso').hidden=true;msg('ok','Caso enviado à fila (fictícia).');toast('Caso enviado à fila');tab('fila')}};
function lista(){const q=$('#busca').value.toLowerCase(),s=$('#filtro').value,l=fila.filter(x=>(!s||x.s===s)&&(x.t+x.id+x.c).toLowerCase().includes(q));
$('#lista').innerHTML=l.length?l.map(x=>`<li><div><b>${x.id}</b> · ${esc(x.t)}<div class="meta">${x.c} · completude ${x.p}%</div></div><div class="row"><span class="pill">${x.s}</span><button data-id="${x.id}">Avançar status</button></div></li>`).join(''):'<li>Nenhum caso encontrado. Limpe a busca ou o filtro.</li>';
$$('#lista button').forEach(b=>b.onclick=()=>{const x=fila.find(y=>y.id===b.dataset.id),i=STATUS.indexOf(x.s);x.s=STATUS[(i+1)%3];toast(x.id+': '+x.s);lista()})}
$('#busca').oninput=$('#filtro').onchange=lista;lista();