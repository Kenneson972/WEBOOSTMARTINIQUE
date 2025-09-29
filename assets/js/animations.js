(function(){
  const els = document.querySelectorAll('.section, .card, .hero-card, .g-item, .step, .testimonial');
  els.forEach(el=> el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    els.forEach(el=> el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
  },{threshold:.1, rootMargin: '0px 0px -10% 0px'});
  els.forEach(el=> io.observe(el));

  // Fallback sécurité: force visible si non déclenché au bout de 1,2s
  setTimeout(()=>{
    document.querySelectorAll('.reveal:not(.visible)').forEach(el=> el.classList.add('visible'))
  }, 1200);
})();