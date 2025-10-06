(function(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    // Tente envoi vers API PHP (prod). En preview GitHub Pages, on affiche fallback.
    try{
      const res = await fetch('/api/contact.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const j = await res.json();
      if(j.success){ alert('Merci ! Nous revenons vers vous sous 24h.'); form.reset(); }
      else throw new Error('Erreur API');
    }catch(err){
      console.warn('API contact indisponible, fallback:', err.message);
      alert("Merci ! Votre message est noté. En preview, envoyez-nous directement à contact@weboostmartinique.com.");
    }
  });
})();