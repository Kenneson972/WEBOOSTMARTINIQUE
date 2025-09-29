(function(){
  // Désactive les animations reveal pour stabilité (évite éléments invisibles)
  document.querySelectorAll('.section, .card, .hero-card, .g-item, .step, .testimonial')
    .forEach(el=> el.classList.add('visible'));
})();