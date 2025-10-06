// Modern Interactions - WEBOOST Martinique

document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  initNavigation();
  
  // Smooth scrolling
  initSmoothScrolling();
  
  // FAQ interactions
  initFAQ();
  
  // Form interactions
  initFormInteractions();
  
  // Scroll animations
  initScrollAnimations();
  
  // Chat widget
  initChatWidget();
  
  // Pack card interactions
  initPackInteractions();
});

// Navigation
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
  
  // Nav scroll effect
  const nav = document.querySelector('.modern-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
}

// Smooth scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// FAQ interactions
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
  
  // FAQ search
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

// Form interactions
function initFormInteractions() {
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission
      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Envoyé !';
        submitBtn.style.background = 'var(--success-color, #10b981)';
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          form.reset();
        }, 2000);
      }, 1500);
    });
  }
  
  // Form field animations
  const formInputs = document.querySelectorAll('.form-input, .form-textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    '.pack-card, .process-step, .testimonial-card, .faq-container, .contact-info, .contact-form'
  );
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// Chat widget
function initChatWidget() {
  const chatWidget = document.querySelector('.chat-widget');
  const chatToggle = document.querySelector('.chat-toggle');
  
  // Show chat widget after 3 seconds
  setTimeout(() => {
    if (chatWidget) {
      chatWidget.classList.add('active');
    }
  }, 3000);
  
  // Chat input
  const chatInput = document.querySelector('.chat-input input');
  const chatSubmit = document.querySelector('.chat-input button');
  
  if (chatInput && chatSubmit) {
    chatSubmit.addEventListener('click', () => {
      const message = chatInput.value.trim();
      if (message) {
        // Simulate sending message
        console.log('Message sent:', message);
        chatInput.value = '';
      }
    });
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        chatSubmit.click();
      }
    });
  }
}

// Pack interactions
function initPackInteractions() {
  const packCards = document.querySelectorAll('.pack-card');
  
  packCards.forEach(card => {
    const button = card.querySelector('.pack-button');
    
    if (button) {
      button.addEventListener('click', () => {
        // Add selection effect
        card.classList.add('selected');
        
        // Scroll to contact form
        setTimeout(() => {
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      });
    }
    
    // Hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Parallax effect for hero section
function initParallax() {
  const heroSection = document.querySelector('.hero-section');
  const heroContent = document.querySelector('.hero-content');
  
  if (heroSection && heroContent) {
    window.addEventListener('scroll', throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      heroContent.style.transform = `translateY(${rate}px)`;
    }, 16));
  }
}

// Initialize parallax
initParallax();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    animation: slideInUp 0.6s ease forwards;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modern-nav.scrolled {
    background: rgba(15, 15, 16, 0.95);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
  }
  
  .pack-card.selected {
    transform: scale(1.05);
    border-color: var(--primary);
    box-shadow: 0 20px 40px rgba(138, 43, 226, 0.3);
  }
  
  .form-group.focused .form-input,
  .form-group.focused .form-textarea {
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 768px) {
    .nav-menu.active {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(15, 15, 16, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: var(--spacing-lg);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .nav-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`;
document.head.appendChild(style);
