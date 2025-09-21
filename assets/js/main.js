(function(){
  // Mobile menu
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if(navToggle && mainNav){ navToggle.addEventListener('click',()=> mainNav.classList.toggle('open')); }

  // Year in footer
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // FAQ search
  const search = document.getElementById('faqSearch');
  const list = document.getElementById('faqList');
  if(search && list){
    search.addEventListener('input', function(){
      const q = this.value.toLowerCase();
      list.querySelectorAll('details').forEach(d => { const txt = d.textContent.toLowerCase(); d.style.display = txt.includes(q) ? '' : 'none'; });
    });
  }

  // CTA helpers
  window.scrollToContact = function(){
    document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});
  };
  window.startOrder = function(){
    document.getElementById('packs')?.scrollIntoView({behavior:'smooth'});
  };
})();