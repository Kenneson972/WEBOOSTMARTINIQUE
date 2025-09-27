(function(){
  /*  Mode “lead-flow” : transforme le chat en formulaire guidé
      – Collecte name → email → service → budget → deadline
      – Gère les utilisateurs perdus
      – Envoie les données à /webhook/lead (backend PHP/MySQL déjà en place)
      – Redirige ensuite vers /checkout?plan=…&budget=…&name=…&email=…
  */
  if (window.CHAT_MODE !== 'lead-flow') return;

  const fields = ['name', 'email', 'service', 'budget', 'deadline'];
  let waitingFor = fields[0];
  const data = {};

  window.addEventListener('chat:userMessage', ({ detail }) => {
    const msg = (detail?.text || '').trim();

    // Aide si l’utilisateur est perdu
    if (/perdu|help|je.*comprends pas/i.test(msg)) {
      emitBot("Je vais simplement te poser 5 questions pour trouver le pack idéal 😉");
      askNext(); return;
    }

    // Stocke la réponse
    if (waitingFor) data[waitingFor] = msg;
    waitingFor = fields.find(f => !data[f]);
    waitingFor ? askNext() : recap();
  });

  function askNext() {
    const q = {
      name:     "Ton prénom ?",
      email:    "Ton e-mail pro ?",
      service:  "Type de site : vitrine ou e-commerce ?",
      budget:   "Budget estimé (€) ?",
      deadline: "Deadline idéale (JJ/MM) ?"
    }[waitingFor];
    emitBot(q);
  }

  function recap() {
    const { name, service, budget, deadline } = data;
    emitBot(`Récap 👉 ${name}, ${service}, ${budget} €, pour le ${deadline}. Correct ? (oui / non)`);
    window.addEventListener('chat:userMessage', onConfirm, { once: true });
  }

  function onConfirm({ detail }) {
    if (/^(oui|ok|parfait)/i.test((detail?.text || ''))) {
      fetch('/webhook/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const url = `/checkout?plan=${encodeURIComponent(data.service)}&budget=${encodeURIComponent(data.budget)}&name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}`;
      location.href = url;
    } else {
      waitingFor = fields.find(f => !data[f]) || 'name';
      emitBot("Pas de souci, corrigeons cela 😊");
      askNext();
    }
  }

  function emitBot(text) {
    window.dispatchEvent(new CustomEvent('chat:botMessage', { detail: { text } }));
  }
})();