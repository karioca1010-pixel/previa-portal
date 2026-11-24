// textos do script nos três idiomas; a chave é o texto em português
const TR={"en": {"Fechar menu": "Close menu", "Abrir menu": "Open menu", "Prévia: o envio será ligado na versão final.": "Preview: sending will be enabled in the final version.", "Digite um email válido.": "Enter a valid email.", "Preencha nome, email e mensagem.": "Fill in name, email and message.", "Retomar a passagem automática": "Resume automatic rotation", "Pausar a passagem automática": "Pause automatic rotation", "Retomar o movimento do navio": "Resume the ship movement", "Pausar o movimento do navio": "Pause the ship movement", "Enviando…": "Sending…", "Mensagem enviada. Obrigado.": "Message sent. Thank you.", "Não foi possível enviar agora. Escreva para contato@portalcomexrio.com.br.": "Could not send right now. Write to contato@portalcomexrio.com.br.", "Usamos cookies para medir o uso do site e melhorar sua experiência.": "We use cookies to measure site usage and improve your experience.", "Política de privacidade": "Privacy policy", "Entendi": "Got it"}, "es": {"Fechar menu": "Cerrar menú", "Abrir menu": "Abrir menú", "Prévia: o envio será ligado na versão final.": "Vista previa: el envío se activará en la versión final.", "Digite um email válido.": "Escriba un email válido.", "Preencha nome, email e mensagem.": "Complete nombre, email y mensaje.", "Retomar a passagem automática": "Reanudar el avance automático", "Pausar a passagem automática": "Pausar el avance automático", "Retomar o movimento do navio": "Reanudar el movimiento del barco", "Pausar o movimento do navio": "Pausar el movimiento del barco", "Enviando…": "Enviando…", "Mensagem enviada. Obrigado.": "Mensaje enviado. Gracias.", "Não foi possível enviar agora. Escreva para contato@portalcomexrio.com.br.": "No fue posible enviar ahora. Escriba a contato@portalcomexrio.com.br.", "Usamos cookies para medir o uso do site e melhorar sua experiência.": "Usamos cookies para medir el uso del sitio y mejorar su experiencia.", "Política de privacidade": "Política de privacidad", "Entendi": "Entendido"}}[document.documentElement.lang]||{},t=s=>TR[s]||s;
const hamb=document.querySelector('.hamb'),menu=document.getElementById('menu');
hamb.addEventListener('click',()=>{const a=menu.classList.toggle('aberto');hamb.setAttribute('aria-expanded',a);hamb.setAttribute('aria-label',a?t('Fechar menu'):t('Abrir menu'))});
document.querySelectorAll('[data-filtro]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-filtro]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  document.querySelectorAll('[data-cats]').forEach(c=>c.hidden=!!b.dataset.filtro&&!c.dataset.cats.split('|').includes(b.dataset.filtro));}));
// Formulários: enviam para o receptor do WordPress (wp-content/mu-plugins/bemore-formularios.php).
// Fora do domínio do Portal (prévia) só mostram o aviso.
const NO_AR=/(^|\.)portalcomexrio\.com\.br$/.test(location.hostname);
async function enviar(f,nome,erro){
  const o=f.querySelector('output');
  if(!f.checkValidity()){o.textContent=t(erro);return}
  if(!NO_AR){o.textContent=t('Prévia: o envio será ligado na versão final.');return}
  const campos=[...f.querySelectorAll('input:not([name=site]),textarea,select')].map(c=>[(c.closest('label')?.firstChild?.textContent||c.getAttribute('aria-label')||c.name).trim(),c.value.trim()]);
  const b=f.querySelector('button[type=submit]');b.disabled=true;o.textContent=t('Enviando…');
  try{const r=await fetch('/wp-json/bemore/v1/formulario',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({formulario:nome,pagina:location.href,site:f.elements.site?.value||'',campos})});
    if(!r.ok)throw r.status;o.textContent=t('Mensagem enviada. Obrigado.');f.reset()}
  catch(_){o.textContent=t('Não foi possível enviar agora. Escreva para contato@portalcomexrio.com.br.')}
  finally{b.disabled=false}}
document.getElementById('f-news')?.addEventListener('submit',e=>{e.preventDefault();enviar(e.target,'Newsletter','Digite um email válido.')});
document.querySelectorAll('[data-previa]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();enviar(f,document.title.split(' | ')[0],'Preencha nome, email e mensagem.')}));

// Carrossel de serviços: passa sozinho a cada 4,5 s, para no mouse, no foco e no botão de pausa.
document.querySelectorAll('[data-carrossel]').forEach(c=>{
  const sec=c.closest('section'),pausa=sec.querySelector('[data-pausa]');
  const passo=d=>{const s=c.querySelector('.slide'),w=s.getBoundingClientRect().width+parseFloat(getComputedStyle(c).columnGap||24);
    const fim=c.scrollLeft+c.clientWidth>=c.scrollWidth-4;
    c.scrollTo({left:d>0&&fim?0:d<0&&c.scrollLeft<4?c.scrollWidth:c.scrollLeft+d*w,behavior:'smooth'})};
  sec.querySelectorAll('[data-passo]').forEach(b=>b.addEventListener('click',()=>passo(+b.dataset.passo)));
  let parado=matchMedia('(prefers-reduced-motion: reduce)').matches,sobre=false;
  pausa.setAttribute('aria-pressed',parado);
  pausa.addEventListener('click',()=>{parado=!parado;pausa.setAttribute('aria-pressed',parado);pausa.setAttribute('aria-label',parado?t('Retomar a passagem automática'):t('Pausar a passagem automática'))});
  ['mouseenter','focusin','touchstart'].forEach(e=>c.addEventListener(e,()=>sobre=true,{passive:true}));
  ['mouseleave','focusout'].forEach(e=>c.addEventListener(e,()=>sobre=false));
  setInterval(()=>{if(!parado&&!sobre&&!document.hidden)passo(1)},4500);
});

// Abertura: pausa do navio pelo botão e sozinho quando a dobra sai da tela.
(()=>{const hero=document.querySelector('.hero'),b=hero?.querySelector('.hero-pausa');if(!b)return;let manual=false;
  b.addEventListener('click',()=>{manual=!manual;hero.classList.toggle('pausado',manual);b.setAttribute('aria-pressed',manual);b.setAttribute('aria-label',manual?t('Retomar o movimento do navio'):t('Pausar o movimento do navio'))});
  new IntersectionObserver(([e])=>{if(!manual)hero.classList.toggle('pausado',!e.isIntersecting)}).observe(hero);})();

document.querySelectorAll('[data-rota]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-rota]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  document.querySelectorAll('[data-rota-ficha]').forEach(f=>{f.hidden=f.dataset.rotaFicha!==b.dataset.rota;
    if(!f.hidden){const i=f.querySelector('iframe[data-src]');if(i){i.src=i.dataset.src;i.removeAttribute('data-src')}
      if(matchMedia('(max-width:900px)').matches)f.scrollIntoView({behavior:'smooth',block:'start'})}});}));

// Aviso de cookies (substitui o plugin Cookie Notice do site antigo). Some depois do clique e não volta.
(()=>{let visto;try{visto=localStorage.getItem('pcr-cookies')}catch(_){}if(visto)return;
  const pre=(location.pathname.match(/^\/(en|es)\//)||[''])[0]||'/';
  const a=document.createElement('div');a.className='cookies';a.setAttribute('role','region');a.setAttribute('aria-label','Cookies');
  a.innerHTML=`<p>${t('Usamos cookies para medir o uso do site e melhorar sua experiência.')} <a href="${pre}politica-e-privacidade/">${t('Política de privacidade')}</a></p><button type="button" class="btn btn-acao">${t('Entendi')}</button>`;
  a.querySelector('button').onclick=()=>{try{localStorage.setItem('pcr-cookies','1')}catch(_){}a.remove()};document.body.append(a)})();
