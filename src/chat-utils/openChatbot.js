window.openChatbot = async function (mode = 'default') {
  try {
    // Charge le widget principal une seule fois
    if (!window.chatWidgetLoaded) {
      await import('/chatbot.js');
      window.chatWidgetLoaded = true;
    }
    // Définit le mode
    window.CHAT_MODE = mode;

    // Charge le flow guidé uniquement quand nécessaire
    if (mode === 'lead-flow') {
      await import('/src/chat-utils/lead-flow.js');
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