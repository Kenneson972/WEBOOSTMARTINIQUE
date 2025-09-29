window.openChatbot = async function (mode = 'default') {
  try {
    // Définir le mode (utilisé par lead-flow.js)
    window.CHAT_MODE = mode;

    // Charger le flow guidé uniquement si demandé
    if (mode === 'lead-flow') {
      try { await import('./lead-flow.js'); } catch(e) { console.warn('lead-flow load error', e); }
    }

    // Ouvrir le widget (sans dépendre d'un import du widget)
    if (window.eliseChatbot && typeof window.eliseChatbot.toggleChat === 'function') {
      window.eliseChatbot.toggleChat();
    } else if (typeof window.toggleChat === 'function') {
      window.toggleChat();
    } else if (typeof window.startChat === 'function') {
      window.startChat();
    } else {
      // Fallback: simule un clic sur la fab si présente
      const fab = document.getElementById('chat-fab');
      if (fab) fab.click();
      else window.dispatchEvent(new CustomEvent('chat:open'));
    }
  } catch (e) {
    console.warn('openChatbot error', e);
  }
};