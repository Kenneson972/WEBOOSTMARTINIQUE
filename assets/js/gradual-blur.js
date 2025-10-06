// GradualBlur - WEBOOST Martinique
// Version optimisée pour HTML/CSS/JS

class GradualBlur {
  constructor(options = {}) {
    this.options = {
      target: 'parent',
      position: 'bottom',
      height: '4rem',
      strength: 3,
      divCount: 6,
      curve: 'bezier',
      exponential: true,
      opacity: 0.8,
      className: '',
      ...options
    };

    this.element = null;
    this.blurDivs = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    this.createBlurElement();
    this.setupIntersectionObserver();
    this.isInitialized = true;
  }

  createBlurElement() {
    // Créer le conteneur principal
    const container = document.createElement('div');
    container.className = `gradual-blur ${this.options.className}`.trim();
    container.style.cssText = `
      position: absolute;
      ${this.getPositionStyles()};
      width: 100%;
      height: ${this.options.height};
      pointer-events: none;
      z-index: 10;
      isolation: isolate;
    `;

    // Créer les divs de flou
    for (let i = 0; i < this.options.divCount; i++) {
      const div = document.createElement('div');
      const blurValue = this.calculateBlurValue(i);
      const opacity = this.calculateOpacity(i);

      div.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(${blurValue}px);
        -webkit-backdrop-filter: blur(${blurValue}px);
        opacity: ${opacity};
        background: rgba(0, 0, 0, 0.1);
      `;

      container.appendChild(div);
      this.blurDivs.push(div);
    }

    this.element = container;
    return container;
  }

  getPositionStyles() {
    switch (this.options.position) {
      case 'top':
        return 'top: 0; left: 0;';
      case 'bottom':
        return 'bottom: 0; left: 0;';
      case 'left':
        return 'top: 0; left: 0; width: auto; height: 100%;';
      case 'right':
        return 'top: 0; right: 0; width: auto; height: 100%;';
      default:
        return 'bottom: 0; left: 0;';
    }
  }

  calculateBlurValue(index) {
    const progress = index / (this.options.divCount - 1);
    
    switch (this.options.curve) {
      case 'linear':
        return this.options.strength * progress;
      case 'ease-in':
        return this.options.strength * Math.pow(progress, 2);
      case 'ease-out':
        return this.options.strength * (1 - Math.pow(1 - progress, 2));
      case 'bezier':
        return this.options.strength * (3 * Math.pow(progress, 2) - 2 * Math.pow(progress, 3));
      default:
        return this.options.strength * progress;
    }
  }

  calculateOpacity(index) {
    const progress = index / (this.options.divCount - 1);
    
    if (this.options.exponential) {
      return this.options.opacity * Math.pow(progress, 2);
    } else {
      return this.options.opacity * progress;
    }
  }

  setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.element.style.opacity = '1';
        } else {
          this.element.style.opacity = '0.5';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observer le parent si possible
    const parent = this.element.parentElement;
    if (parent) {
      observer.observe(parent);
    }
  }

  attachTo(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    if (element && this.element) {
      element.style.position = 'relative';
      element.appendChild(this.element);
    }
  }

  destroy() {
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
    this.blurDivs = [];
    this.element = null;
    this.isInitialized = false;
  }

  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    
    if (this.isInitialized) {
      this.destroy();
      this.init();
    }
  }

  // Méthodes statiques pour créer des presets
  static createPreset(presetName) {
    const presets = {
      subtle: {
        strength: 1.5,
        divCount: 4,
        opacity: 0.4,
        curve: 'ease-out'
      },
      intense: {
        strength: 4,
        divCount: 8,
        opacity: 1,
        curve: 'bezier',
        exponential: true
      },
      smooth: {
        strength: 2.5,
        divCount: 6,
        opacity: 0.7,
        curve: 'ease-in'
      },
      dramatic: {
        strength: 5,
        divCount: 10,
        opacity: 1,
        curve: 'linear',
        exponential: false
      }
    };

    return new GradualBlur(presets[presetName] || presets.subtle);
  }
}

// Fonction utilitaire pour initialiser tous les effets de flou
function initializeGradualBlur() {
  // Flou sur les cartes de pricing
  const packCards = document.querySelectorAll('.pack-card');
  packCards.forEach(card => {
    const blur = new GradualBlur({
      position: 'bottom',
      height: '3rem',
      strength: 2.5,
      divCount: 5,
      curve: 'bezier',
      exponential: true,
      opacity: 0.8,
      className: 'gradual-blur-card'
    });
    blur.attachTo(card);
  });

  // Flou sur les cartes de témoignages
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach(card => {
    const blur = new GradualBlur({
      position: 'bottom',
      height: '2.5rem',
      strength: 2,
      divCount: 4,
      curve: 'ease-out',
      exponential: false,
      opacity: 0.7,
      className: 'gradual-blur-testimonial'
    });
    blur.attachTo(card);
  });

  // Flou sur les cartes hero
  const heroCards = document.querySelectorAll('.hero-card');
  heroCards.forEach(card => {
    const blur = new GradualBlur({
      position: 'bottom',
      height: '2rem',
      strength: 1.5,
      divCount: 3,
      curve: 'linear',
      exponential: true,
      opacity: 0.6,
      className: 'gradual-blur-hero'
    });
    blur.attachTo(card);
  });

  // Flou sur les étapes du processus
  const processSteps = document.querySelectorAll('.process-step');
  processSteps.forEach(step => {
    const blur = new GradualBlur({
      position: 'bottom',
      height: '1.5rem',
      strength: 1,
      divCount: 3,
      curve: 'ease-in',
      exponential: false,
      opacity: 0.5,
      className: 'gradual-blur-process'
    });
    blur.attachTo(step);
  });

  // Flou sur le conteneur FAQ
  const faqContainer = document.querySelector('.faq-container');
  if (faqContainer) {
    const blur = new GradualBlur({
      position: 'bottom',
      height: '4rem',
      strength: 3,
      divCount: 6,
      curve: 'bezier',
      exponential: true,
      opacity: 0.9,
      className: 'gradual-blur-faq'
    });
    blur.attachTo(faqContainer);
  }

  // Flou sur les formulaires
  const contactForms = document.querySelectorAll('.contact-info, .contact-form');
  contactForms.forEach(form => {
    const blur = new GradualBlur({
      position: 'bottom',
      height: '2rem',
      strength: 2,
      divCount: 4,
      curve: 'ease-out',
      exponential: true,
      opacity: 0.6,
      className: 'gradual-blur-form'
    });
    blur.attachTo(form);
  });

  // Flou multi-directionnel sur la navigation
  const nav = document.querySelector('.modern-nav');
  if (nav) {
    const blur = new GradualBlur({
      position: 'bottom',
      height: '1rem',
      strength: 1,
      divCount: 2,
      curve: 'linear',
      exponential: false,
      opacity: 0.4,
      className: 'gradual-blur-nav'
    });
    blur.attachTo(nav);
  }

  console.log('✅ GradualBlur initialisé avec succès !');
}

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  // Attendre un peu pour que tous les éléments soient rendus
  setTimeout(() => {
    initializeGradualBlur();
  }, 100);
});

// Exporter pour utilisation globale
window.GradualBlur = GradualBlur;
window.initializeGradualBlur = initializeGradualBlur;
