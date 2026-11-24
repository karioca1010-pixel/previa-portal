const hamb=document.querySelector('.hamb'),menu=document.getElementById('menu');
hamb.addEventListener('click',()=>{const a=menu.classList.toggle('aberto');hamb.setAttribute('aria-expanded',a);hamb.setAttribute('aria-label',a?'Fechar menu':'Abrir menu')});
document.getElementById('f-news')?.addEventListener('submit',e=>{e.preventDefault();const i=e.target.email,o=e.target.querySelector('output');
  o.textContent=i.validity.valid?'Prévia: o envio será ligado na versão final.':'Digite um email válido.';});
document.querySelectorAll('[data-filtro]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-filtro]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  document.querySelectorAll('[data-cats]').forEach(c=>c.hidden=!!b.dataset.filtro&&!c.dataset.cats.split('|').includes(b.dataset.filtro));}));
document.querySelectorAll('[data-previa]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();
  f.querySelector('output').textContent=f.checkValidity()?'Prévia: o envio será ligado na versão final.':'Preencha nome, email e mensagem.';}));

// Carrossel de serviços: passa sozinho a cada 4,5 s, para no mouse, no foco e no botão de pausa.
document.querySelectorAll('[data-carrossel]').forEach(c=>{
  const sec=c.closest('section'),pausa=sec.querySelector('[data-pausa]');
  const passo=d=>{const s=c.querySelector('.slide'),w=s.getBoundingClientRect().width+parseFloat(getComputedStyle(c).columnGap||24);
    const fim=c.scrollLeft+c.clientWidth>=c.scrollWidth-4;
    c.scrollTo({left:d>0&&fim?0:d<0&&c.scrollLeft<4?c.scrollWidth:c.scrollLeft+d*w,behavior:'smooth'})};
  sec.querySelectorAll('[data-passo]').forEach(b=>b.addEventListener('click',()=>passo(+b.dataset.passo)));
  let parado=matchMedia('(prefers-reduced-motion: reduce)').matches,sobre=false;
  pausa.setAttribute('aria-pressed',parado);
  pausa.addEventListener('click',()=>{parado=!parado;pausa.setAttribute('aria-pressed',parado);pausa.setAttribute('aria-label',parado?'Retomar a passagem automática':'Pausar a passagem automática')});
  ['mouseenter','focusin','touchstart'].forEach(e=>c.addEventListener(e,()=>sobre=true,{passive:true}));
  ['mouseleave','focusout'].forEach(e=>c.addEventListener(e,()=>sobre=false));
  setInterval(()=>{if(!parado&&!sobre&&!document.hidden)passo(1)},4500);
});

// Abertura: pausa do navio pelo botão e sozinho quando a dobra sai da tela.
(()=>{const hero=document.querySelector('.hero'),b=hero?.querySelector('.hero-pausa');if(!b)return;let manual=false;
  b.addEventListener('click',()=>{manual=!manual;hero.classList.toggle('pausado',manual);b.setAttribute('aria-pressed',manual);b.setAttribute('aria-label',manual?'Retomar o movimento do navio':'Pausar o movimento do navio')});
  new IntersectionObserver(([e])=>{if(!manual)hero.classList.toggle('pausado',!e.isIntersecting)}).observe(hero);})();

document.querySelectorAll('[data-rota]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-rota]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  document.querySelectorAll('[data-rota-ficha]').forEach(f=>{f.hidden=f.dataset.rotaFicha!==b.dataset.rota;
    if(!f.hidden){const i=f.querySelector('iframe[data-src]');if(i){i.src=i.dataset.src;i.removeAttribute('data-src')}
      if(matchMedia('(max-width:900px)').matches)f.scrollIntoView({behavior:'smooth',block:'start'})}});}));
