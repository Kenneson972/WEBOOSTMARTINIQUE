(function(){
  // Reveal on scroll
  const revealEls = document.querySelectorAll('.section, .card, .hero-card, .g-item, .step, .testimonial');
  revealEls.forEach(el=> el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
  },{threshold:.15});
  revealEls.forEach(el=> io.observe(el));

  // Animate counters when visible
  const counters = document.querySelectorAll('[data-animate-counter]');
  const counterIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const target = parseInt(el.getAttribute('data-animate-counter'),10) || 0;
        const numberEl = el.querySelector('.stat-number, .price-amount') || el;
        const duration = 1200; const start = performance.now();
        const step = (now)=>{
          const p = Math.min(1,(now-start)/duration);
          const val = Math.floor(p*target);
          numberEl.textContent = val.toString();
          if(p<1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      }
    });
  },{threshold:.4});
  counters.forEach(c=> counterIO.observe(c));

  // Testimonials slider (basic)
  const slider = document.getElementById('testimonialsSlider');
  const dots = document.querySelectorAll('#testimonialsNav .nav-dot');
  if(slider && dots.length){
    const slides = slider.querySelectorAll('.testimonial-card');
    const activate = (i)=>{
      slides.forEach((s,idx)=> s.classList.toggle('active', idx===i));
      dots.forEach((d,idx)=> d.classList.toggle('active', idx===i));
    };
    dots.forEach((d,idx)=> d.addEventListener('click',()=> activate(idx)));
    let idx=0; activate(0);
    setInterval(()=>{ idx=(idx+1)%slides.length; activate(idx); }, 6000);
  }
})();