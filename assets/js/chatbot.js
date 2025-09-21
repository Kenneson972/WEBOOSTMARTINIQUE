/**
 * Chatbot Élise – version cookie
 * L’ID de session est stocké côté serveur dans un cookie HttpOnly.
 * Aucun recours à localStorage : l’historique persiste même en mode privé
 * dès lors que les cookies ne sont pas effacés.
 */
class EliseWebBoostChatbot {
  constructor() {
    this.isOpen = false;
    this.isTyping = false;
    this.isFullscreen = false;

    // !!! Plus de localStorage : le cookie est géré côté PHP.
    this.apiUrl = '/api/chat.php';           // chemin relatif 02switch
    this.whatsappNumber = '596TONVRAINUM';

    this.initializeWhenReady();
  }

  /* ---------- bootstrap DOM ---------- */
  initializeWhenReady() {
    const tryInit = () => {
      if (document.getElementById('chatbot-widget')) {
        this.init();
      } else {
        setTimeout(tryInit, 300);
      }
    };
    tryInit();
  }

  init() {
    this.bindElements();
    this.setupEventListeners();
    this.startEliseWelcome();
    console.log('✅ Chatbot Élise initialisé (cookie session)');
  }

  bindElements() {
    this.chatWidget       = document.getElementById('chatbot-widget');
    this.chatPanel        = document.getElementById('chat-panel');
    this.messagesContainer= document.getElementById('chat-messages');
    this.messageInput     = document.getElementById('message-input');
    this.sendButton       = document.getElementById('send-message-btn');
    this.chatFab          = document.getElementById('chat-fab');
    this.notification     = document.getElementById('chat-notification');
    this.fullscreenBtn    = document.getElementById('fullscreen-btn');
  }

  setupEventListeners() {
    if (this.sendButton) {
      this.sendButton.addEventListener('click', () => this.sendMessage());
    }
    if (this.messageInput) {
      this.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }
  }

  /* ---------- UI helpers ---------- */
  startEliseWelcome() {
    if (!this.messagesContainer || this.messagesContainer.children.length) return;
    setTimeout(() => {
      this.addEliseMessage(
        "Bonjour ! 😊 Je suis Élise, conseillère WebBoost Martinique.\n\n" +
        "Comment puis-je vous aider avec votre projet web ?"
      );
    }, 1200);
  }

  addEliseMessage(text) {
    if (!this.messagesContainer) return;
    const el = document.createElement('div');
    el.className = 'message elise-message';
    el.innerHTML =
      `<div class="elise-avatar-small"></div>
       <div class="message-bubble elise-bubble">${this.format(text)}</div>`;
    this.messagesContainer.appendChild(el);
    this.scrollToBottom();
  }

  addUserMessage(text) {
    if (!this.messagesContainer) return;
    const el = document.createElement('div');
    el.className = 'message user-message';
    el.innerHTML =
      `<div class="message-bubble user-bubble">${this.escape(text)}</div>`;
    this.messagesContainer.appendChild(el);
    this.scrollToBottom();
  }

  showEliseTyping() {
    this.isTyping = true;
    const t = document.createElement('div');
    t.id = 'typing-indicator';
    t.className = 'typing-message';
    t.innerHTML =
      `<div class="elise-avatar-small"></div>
       <div class="typing-bubble">
         <div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
         <span class="typing-text">Élise réfléchit…</span>
       </div>`;
    this.messagesContainer.appendChild(t);
    this.scrollToBottom();
  }

  hideEliseTyping() {
    this.isTyping = false;
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  format(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/(?:\*\*)(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  }

  escape(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /* ---------- chat logic ---------- */
  async sendMessage() {
    const message = this.messageInput?.value?.trim();
    if (!message || this.isTyping) return;

    this.addUserMessage(message);
    this.messageInput.value = '';
    this.showEliseTyping();

    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
        // le cookie session est envoyé automatiquement
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.hideEliseTyping();

      if (data.success && data.response) {
        this.addEliseMessage(data.response);
      } else {
        throw new Error(data.error || 'Réponse invalide');
      }
    } catch (err) {
      console.error('💥 Erreur:', err);
      this.hideEliseTyping();
      this.addEliseMessage(
        `Désolée, petit souci technique… 😔\n\n` +
        `Contactez Kenneson directement :\n📱 https://wa.me/${this.whatsappNumber}`
      );
    }
  }

  /* ---------- UX toggles ---------- */
  toggleChat() {
    if (!this.chatPanel) return;
    this.isOpen = !this.isOpen;
    this.chatPanel.classList.toggle('active', this.isOpen);
    this.chatWidget.classList.toggle('chat-open', this.isOpen);
    if (this.isOpen && this.messageInput) this.messageInput.focus();
  }

  toggleFullscreen() {
    if (!this.chatPanel) return;
    this.isFullscreen = !this.isFullscreen;
    this.chatPanel.classList.toggle('fullscreen', this.isFullscreen);
    const icon = this.fullscreenBtn.querySelector('i');
    if (this.isFullscreen) {
      icon.classList.replace('fa-expand', 'fa-compress');
    } else {
      icon.classList.replace('fa-compress', 'fa-expand');
    }
  }

  /* ---------- debug helper ---------- */
  resetConversation() {
    document.cookie =
      'chat_session_id=; Max-Age=0; path=/; SameSite=Lax;'; // supprime cookie
    if (this.messagesContainer) this.messagesContainer.innerHTML = '';
    this.startEliseWelcome();
    console.log('🔄 Session reset – nouveau cookie créé au prochain envoi');
  }
}

/* helpers globaux */
function toggleChat(e) {
  if (e) e.stopPropagation();
  window.eliseChatbot?.toggleChat();
}
function sendChatMessage() {
  window.eliseChatbot?.sendMessage();
}
function showEliseProfile() {
  document.getElementById('elise-profile-modal')?.classList.add('active');
}
function closeEliseProfile() {
  document.getElementById('elise-profile-modal')?.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () =>
  setTimeout(() => (window.eliseChatbot = new EliseWebBoostChatbot()), 500)
);
