window.openChatbot = async function (mode = 'default') {
  try {
    // Charge le widget principal une seule fois (chemin RELATIF pour GitHub Pages/02switch)
    if (!window.chatWidgetLoaded) {
      await import('../../assets/js/chatbot.js');
      window.chatWidgetLoaded = true;
    }
    // Définit le mode
    window.CHAT_MODE = mode;

    // Charge le flow guidé seulement si demandé (chemin relatif depuis ce fichier)
    if (mode === 'lead-flow') {
      await import('./lead-flow.js');
    }

    // Démarre/affiche le chat selon ce que le widget expose
    if (typeof window.startChat === 'function') {
      window.startChat();
    } else if (typeof window.toggleChat === 'function') {
      window.toggleChat();
    } else if (window.eliseChatbot && typeof window.eliseChatbot.toggleChat === 'function') {
      window.eliseChatbot.toggleChat();
    } else {
      window.dispatchEvent(new CustomEvent('chat:open'));
    }
  } catch (e) {
    console.warn('openChatbot error', e);
  }
};