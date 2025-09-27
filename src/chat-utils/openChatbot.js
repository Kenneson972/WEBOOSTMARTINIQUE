window.openChatbot = async function (mode = 'default') {
  // Charge le widget principal une seule fois
  if (!window.chatWidgetLoaded) {
    await import('/chatbot.js');          // widget déjà présent côté public
    window.chatWidgetLoaded = true;
  }
  window.CHAT_MODE = mode;                // 'default' ou 'lead-flow'
  window.startChat();                     // fonction exposée par chatbot.js
};