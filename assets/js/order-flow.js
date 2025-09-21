(function(){
  class OrderFlow{
    constructor(){
      this.modal = document.getElementById('order-modal');
      this.overlay = document.getElementById('order-overlay');
      this.form = document.getElementById('orderForm');
      this.steps = Array.from(document.querySelectorAll('.order-step'));
      this.progress = document.getElementById('order-progress');
      this.summaryBox = document.getElementById('order-summary-box');
      this.submitBtn = document.getElementById('order-submit');
      this.current = 0;
      this.data = { pack:null, options:[], name:'', email:'', phone:'', company:'', details:'', budget:'', deadline:'', consent:false };
      this.bind();
    }
    bind(){
      // open/close
      document.querySelectorAll('[data-open-order]').forEach(btn=> btn.addEventListener('click',(e)=>{
        e.preventDefault();
        const p = btn.getAttribute('data-pack') || null; this.open(p);
      }));
      document.querySelectorAll('[data-close-order]').forEach(btn=> btn.addEventListener('click',()=> this.close()));
      this.overlay?.addEventListener('click',()=> this.close());

      // nav
      document.querySelectorAll('[data-next]').forEach(b=> b.addEventListener('click',()=> this.next()));
      document.querySelectorAll('[data-prev]').forEach(b=> b.addEventListener('click',()=> this.prev()));

      // pack selection
      document.querySelectorAll('input[name="order_pack"]').forEach(r=> r.addEventListener('change',()=>{
        this.data.pack = r.value; this.persist();
      }));

      // options selection
      document.querySelectorAll('input[name="order_options"]')?.forEach(c=> c.addEventListener('change',()=>{
        const checked = Array.from(document.querySelectorAll('input[name="order_options"]:checked')).map(x=>x.value);
        this.data.options = checked; this.persist();
      }));

      // client info
      ['name','email','phone','company'].forEach(id=>{
        const el = document.getElementById('order_'+id); if(el){ el.addEventListener('input',()=>{ this.data[id]=el.value.trim(); this.persist(); }); }
      });

      // project
      ['details','budget','deadline'].forEach(id=>{
        const el = document.getElementById('order_'+id); if(el){ el.addEventListener('input',()=>{ this.data[id]=el.value.trim(); this.persist(); }); }
      });
      const consent = document.getElementById('order_consent');
      if(consent){ consent.addEventListener('change',()=>{ this.data.consent = !!consent.checked; this.persist(); }); }

      // submit
      this.form?.addEventListener('submit',(e)=> this.submit(e));

      // restore if any
      const saved = localStorage.getItem('order_flow');
      if(saved){ try{ this.data = JSON.parse(saved) || this.data; this.hydrate(); }catch(e){} }

      this.updateUI();
    }

    hydrate(){
      if(this.data.pack){ const r=document.querySelector(`input[name="order_pack"][value="${this.data.pack}"]`); if(r) r.checked = true; }
      if(this.data.options?.length){ this.data.options.forEach(v=>{ const c=document.querySelector(`input[name="order_options"][value="${v}"]`); if(c) c.checked = true; }); }
      ['name','email','phone','company','details','budget','deadline'].forEach(id=>{
        const el = document.getElementById('order_'+id); if(el && this.data[id]) el.value = this.data[id];
      });
      const consent = document.getElementById('order_consent'); if(consent) consent.checked = !!this.data.consent;
    }

    open(preselect){
      if(preselect){ const r=document.querySelector(`input[name="order_pack"][value="${preselect}"]`); if(r){ r.checked=true; this.data.pack=preselect; this.persist(); }}
      this.modal?.classList.add('active'); this.overlay?.classList.add('active');
      this.current = 0; this.updateUI();
    }
    close(){ this.modal?.classList.remove('active'); this.overlay?.classList.remove('active'); }

    next(){ if(this.validateStep(this.current)){ this.current = Math.min(this.current+1, this.steps.length-1); this.updateUI(); } }
    prev(){ this.current = Math.max(this.current-1, 0); this.updateUI(); }

    validateStep(i){
      // basic validations per step
      if(i===0){ // pack
        if(!this.data.pack){ alert('Sélectionnez un pack pour continuer.'); return false; }
      }
      if(i===2){ // infos client
        if(!this.data.name || !this.data.email){ alert('Renseignez au minimum nom et email.'); return false; }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.email)){ alert('Email invalide.'); return false; }
      }
      if(i===3){ // projet
        if(!this.data.details){ alert('Décrivez brièvement votre projet.'); return false; }
      }
      return true;
    }

    updateUI(){
      this.steps.forEach((s,idx)=> s.classList.toggle('active', idx===this.current));
      if(this.progress){ const perc = ((this.current+1)/this.steps.length)*100; this.progress.style.width = perc+'%'; }
      this.renderSummary();
    }

    renderSummary(){
      if(!this.summaryBox) return;
      const opt = (this.data.options||[]).map(o=>`<li>${this.escape(o)}</li>`).join('') || '<li>Aucune option</li>';
      this.summaryBox.innerHTML = `
        <div class="sum-row"><strong>Pack</strong><span>${this.escape(this.data.pack||'-')}</span></div>
        <div class="sum-row"><strong>Options</strong><ul class="sum-list">${opt}</ul></div>
        <div class="sum-row"><strong>Client</strong><span>${this.escape(this.data.name||'-')} — ${this.escape(this.data.email||'-')} ${this.escape(this.data.phone||'')}</span></div>
        <div class="sum-row"><strong>Entreprise</strong><span>${this.escape(this.data.company||'-')}</span></div>
        <div class="sum-row"><strong>Budget</strong><span>${this.escape(this.data.budget||'-')}</span></div>
        <div class="sum-row"><strong>Deadline</strong><span>${this.escape(this.data.deadline||'-')}</span></div>
        <div class="sum-row"><strong>Projet</strong><div class="sum-multiline">${this.escape(this.data.details||'-')}</div></div>`;
    }

    escape(t){ const d=document.createElement('div'); d.textContent=t||''; return d.innerHTML; }
    persist(){ try{ localStorage.setItem('order_flow', JSON.stringify(this.data)); }catch(e){} }

    async submit(e){
      e.preventDefault();
      if(!this.validateStep(3)){ this.current=3; this.updateUI(); return; }
      if(!this.data.consent){ alert('Veuillez accepter la politique de confidentialité.'); return; }
      this.submitBtn?.setAttribute('disabled','true'); this.submitBtn.textContent='Envoi...';
      try{
        const res = await fetch('/api/order.php',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(this.data)});
        if(!res.ok) throw new Error('HTTP '+res.status);
        const j = await res.json();
        if(j.success){
          alert('Merci ! Votre commande a été enregistrée. Nous revenons vers vous sous 24h.');
          localStorage.removeItem('order_flow'); this.form?.reset(); this.close();
        }else{ throw new Error(j.error||'Erreur API'); }
      }catch(err){
        console.warn('Order API indisponible, fallback:', err.message);
        alert("Merci ! Votre demande est notée. En preview, envoyez-nous directement à contact@weboostmartinique.com.");
        this.close();
      }finally{
        this.submitBtn?.removeAttribute('disabled'); this.submitBtn.textContent='Valider ma commande';
      }
    }
  }

  // Expose helper
  window.openOrder = function(pack){
    if(!window.__orderFlow) window.__orderFlow = new OrderFlow();
    window.__orderFlow.open(pack||null);
  };

  document.addEventListener('DOMContentLoaded',()=>{
    window.__orderFlow = new OrderFlow();
  });
})();