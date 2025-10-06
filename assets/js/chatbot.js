/**
 * Fichier fourni par le client - inchangé (sauf URL relative API)
 */
class EliseWebBoostChatbot{
  constructor(){
    this.isOpen=false;this.isTyping=false;this.isFullscreen=false;
    this.sessionId=localStorage.getItem('chat_session_id');
    if(!this.sessionId){this.sessionId=`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;localStorage.setItem('chat_session_id',this.sessionId)}
    // IMPORTANT: URL relative pour compatibilité 02switch et fallback GitHub Pages
    this.apiUrl='/api/chat.php';
    this.whatsappNumber='596TONVRAINUM';
    this.initializeWhenReady();
  }
  initializeWhenReady(){const checkDOM=()=>{if(document.getElementById('chatbot-widget')){this.init()}else{setTimeout(checkDOM,300)}};checkDOM()}
  init(){this.bindElements();this.setupEventListeners();this.startEliseWelcome();console.log(`✅ Chatbot Élise initialisé | session_id: ${this.sessionId}`)}
  bindElements(){this.chatWidget=document.getElementById('chatbot-widget');this.chatPanel=document.getElementById('chat-panel');this.messagesContainer=document.getElementById('chat-messages');this.messageInput=document.getElementById('message-input');this.sendButton=document.getElementById('send-message-btn');this.chatFab=document.getElementById('chat-fab');this.notification=document.getElementById('chat-notification');this.fullscreenBtn=document.getElementById('fullscreen-btn')}
  setupEventListeners(){if(this.sendButton){this.sendButton.addEventListener('click',()=>this.sendMessage())}if(this.messageInput){this.messageInput.addEventListener('keypress',(e)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();this.sendMessage()}})}if(this.fullscreenBtn){this.fullscreenBtn.addEventListener('click',()=>this.toggleFullscreen())}}
  startEliseWelcome(){if(!this.messagesContainer||this.messagesContainer.children.length===0){setTimeout(()=>{this.addEliseMessage("Bonjour ! 😊 Je suis Élise, conseillère WebBoost Martinique.\n\nComment puis-je vous aider avec votre projet web ?")},1200)}}
  async sendMessage(){const message=this.messageInput?.value?.trim();if(!message||this.isTyping)return;this.addUserMessage(message);this.messageInput.value='';this.showEliseTyping();
    try{const response=await fetch(this.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:message,session_id:this.sessionId})});if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();this.hideEliseTyping();if(data.success&&data.response){this.addEliseMessage(data.response)}else{throw new Error('Réponse invalide')}}catch(error){console.error('💥 Erreur:',error);this.hideEliseTyping();this.addEliseMessage(`Désolée, petit souci technique... 😔\n\nContactez Kenneson directement :\n📱 https://wa.me/${this.whatsappNumber}`)}}
  addEliseMessage(text){if(!this.messagesContainer)return;const d=document.createElement('div');d.className='message elise-message';d.innerHTML=`<div class="elise-avatar-small"></div><div class="message-bubble elise-bubble">${this.formatMessage(text)}</div>`;this.messagesContainer.appendChild(d);this.scrollToBottom()}
  addUserMessage(text){if(!this.messagesContainer)return;const d=document.createElement('div');d.className='message user-message';d.innerHTML=`<div class="message-bubble user-bubble">${this.escapeHtml(text)}</div>`;this.messagesContainer.appendChild(d);this.scrollToBottom()}
  formatMessage(text){return text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>')}
  escapeHtml(text){const div=document.createElement('div');div.textContent=text;return div.innerHTML}
  showEliseTyping(){this.isTyping=true;const t=document.createElement('div');t.id='typing-indicator';t.className='typing-message';t.innerHTML=`<div class="elise-avatar-small"></div><div class="typing-bubble"><div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div><span class="typing-text">Élise réfléchit...</span></div>`;this.messagesContainer.appendChild(t);this.scrollToBottom()}
  hideEliseTyping(){this.isTyping=false;const el=document.getElementById('typing-indicator');if(el)el.remove()}
  scrollToBottom(){if(this.messagesContainer){this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight}}
  toggleChat(){if(!this.chatPanel)return;this.isOpen=!this.isOpen;this.chatPanel.classList.toggle('active',this.isOpen);this.chatWidget.classList.toggle('chat-open',this.isOpen);if(this.isOpen&&this.messageInput){this.messageInput.focus()}}
  toggleFullscreen(){if(!this.chatPanel)return;this.isFullscreen=!this.isFullscreen;this.chatPanel.classList.toggle('fullscreen',this.isFullscreen);const icon=this.fullscreenBtn.querySelector('i');if(this.isFullscreen){icon.classList.replace('fa-expand','fa-compress')}else{icon.classList.replace('fa-compress','fa-expand')}}
  resetConversation(){localStorage.removeItem('chat_session_id');this.sessionId=`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;localStorage.setItem('chat_session_id',this.sessionId);if(this.messagesContainer){this.messagesContainer.innerHTML=''}this.startEliseWelcome();console.log('🔄 Session réinitialisée :',this.sessionId)}
}
function toggleChat(e){if(e)e.stopPropagation();if(window.eliseChatbot){window.eliseChatbot.toggleChat()}}
function sendChatMessage(){if(window.eliseChatbot){window.eliseChatbot.sendMessage()}}
function showEliseProfile(){const m=document.getElementById('elise-profile-modal');if(m)m.classList.add('active')}
function closeEliseProfile(){const m=document.getElementById('elise-profile-modal');if(m)m.classList.remove('active')}

document.addEventListener('DOMContentLoaded',function(){setTimeout(()=>{window.eliseChatbot=new EliseWebBoostChatbot()},500)});