(function(){
  const els = document.querySelectorAll('.section, .card, .hero-card, .g-item, .step, .testimonial');
  els.forEach(el=> el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
  },{threshold:.15});
  els.forEach(el=> io.observe(el));
})();