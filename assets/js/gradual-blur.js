// GradualBlur - Version Complète avec Toutes les Fonctionnalités
// Basé sur le code officiel React avec adaptation HTML/CSS/JS

class GradualBlur {
  constructor(options = {}) {
    this.options = this.mergeConfigs(this.getDefaultConfig(), options);
    this.container = null;
    this.blurDivs = [];
    this.isVisible = true;
    this.isHovered = false;
    this.intersectionObserver = null;
    this.resizeObserver = null;
    this.resizeTimeout = null;
    this.animationTimeout = null;

    this.init();
  }

  getDefaultConfig() {
    return {
      position: 'bottom',
      strength: 2,
      height: '6rem',
      divCount: 5,
      exponential: false,
      zIndex: 1000,
      animated: false,
      duration: '0.3s',
      easing: 'ease-out',
      opacity: 1,
      curve: 'linear',
      responsive: false,
      target: 'parent',
      className: '',
      style: {},
      hoverIntensity: null,
      onAnimationComplete: null
    };
  }

  getPresets() {
    return {
      top: { position: 'top', height: '6rem' },
      bottom: { position: 'bottom', height: '6rem' },
      left: { position: 'left', height: '6rem' },
      right: { position: 'right', height: '6rem' },
      subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
      intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
      smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
      sharp: { height: '5rem', curve: 'linear', divCount: 4 },
      header: { position: 'top', height: '8rem', curve: 'ease-out' },
      footer: { position: 'bottom', height: '8rem', curve: 'ease-out' },
      sidebar: { position: 'left', height: '6rem', strength: 2.5 },
      'page-header': { position: 'top', height: '10rem', target: 'page', strength: 3 },
      'page-footer': { position: 'bottom', height: '10rem', target: 'page', strength: 3 }
    };
  }

  getCurveFunctions() {
    return {
      linear: p => p,
      bezier: p => p * p * (3 - 2 * p),
      'ease-in': p => p * p,
      'ease-out': p => 1 - Math.pow(1 - p, 2),
      'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
    };
  }

  mergeConfigs(...configs) {
    return configs.reduce((acc, c) => ({ ...acc, ...c }), {});
  }

  getGradientDirection(position) {
    const directions = {
      top: 'to top',
      bottom: 'to bottom',
      left: 'to left',
      right: 'to right'
    };
    return directions[position] || 'to bottom';
  }

  debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }

  parseValue(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (value.includes('rem')) return num * 16; // Convert rem to px
      if (value.includes('em')) return num * 16; // Convert em to px
      if (value.includes('%')) return num;
      return num;
    }
    return 0;
  }

  init() {
    this.createContainer();
    this.createBlurDivs();
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupResizeObserver();
    this.injectStyles();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = `gradual-blur ${this.options.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'} ${this.options.className}`;
    
    const style = this.getContainerStyle();
    Object.assign(this.container.style, style);

    // Inner container
    this.innerContainer = document.createElement('div');
    this.innerContainer.className = 'gradual-blur-inner';
    this.innerContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
    `;

    this.container.appendChild(this.innerContainer);
  }

  getContainerStyle() {
    const isVertical = ['top', 'bottom'].includes(this.options.position);
    const isHorizontal = ['left', 'right'].includes(this.options.position);
    const isPageTarget = this.options.target === 'page';

    const baseStyle = {
      position: isPageTarget ? 'fixed' : 'absolute',
      pointerEvents: this.options.hoverIntensity ? 'auto' : 'none',
      opacity: this.isVisible ? 1 : 0,
      transition: this.options.animated ? `opacity ${this.options.duration} ${this.options.easing}` : undefined,
      zIndex: isPageTarget ? this.options.zIndex + 100 : this.options.zIndex,
      isolation: 'isolate'
    };

    if (isVertical) {
      baseStyle.height = this.options.height;
      baseStyle.width = this.options.width || '100%';
      baseStyle[this.options.position] = '0';
      baseStyle.left = '0';
      baseStyle.right = '0';
    } else if (isHorizontal) {
      baseStyle.width = this.options.width || this.options.height;
      baseStyle.height = '100%';
      baseStyle[this.options.position] = '0';
      baseStyle.top = '0';
      baseStyle.bottom = '0';
    }

    return { ...baseStyle, ...this.options.style };
  }

  createBlurDivs() {
    // Clear existing divs
    this.innerContainer.innerHTML = '';
    this.blurDivs = [];

    const divs = [];
    const increment = 100 / this.options.divCount;
    const currentStrength = this.isHovered && this.options.hoverIntensity 
      ? this.options.strength * this.options.hoverIntensity 
      : this.options.strength;

    const curveFunc = this.getCurveFunctions()[this.options.curve] || this.getCurveFunctions().linear;

    for (let i = 1; i <= this.options.divCount; i++) {
      let progress = i / this.options.divCount;
      progress = curveFunc(progress);

      let blurValue;
      if (this.options.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * this.options.divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = this.getGradientDirection(this.options.position);

      const div = document.createElement('div');
      const divStyle = {
        position: 'absolute',
        inset: '0',
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: this.options.opacity,
        transition: this.options.animated && this.options.animated !== 'scroll'
          ? `backdrop-filter ${this.options.duration} ${this.options.easing}`
          : undefined
      };

      Object.assign(div.style, divStyle);
      this.innerContainer.appendChild(div);
      this.blurDivs.push(div);
    }
  }

  setupEventListeners() {
    if (this.options.hoverIntensity) {
      this.container.addEventListener('mouseenter', () => {
        this.isHovered = true;
        this.updateBlurDivs();
      });

      this.container.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.updateBlurDivs();
      });
    }
  }

  setupIntersectionObserver() {
    if (this.options.animated !== 'scroll') return;

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
        this.updateVisibility();

        if (this.isVisible && this.options.onAnimationComplete) {
          const ms = parseFloat(this.options.duration) * 1000;
          this.animationTimeout = setTimeout(() => {
            this.options.onAnimationComplete();
          }, ms);
        }
      },
      { threshold: 0.1 }
    );

    this.intersectionObserver.observe(this.container);
  }

  setupResizeObserver() {
    if (!this.options.responsive) return;

    this.resizeObserver = new ResizeObserver(
      this.debounce(() => {
        this.handleResize();
      }, 100)
    );

    this.resizeObserver.observe(document.body);
  }

  handleResize() {
    // Recalculate responsive values
    const w = window.innerWidth;
    let newHeight = this.options.height;
    let newWidth = this.options.width;

    if (w <= 480 && this.options.mobileHeight) {
      newHeight = this.options.mobileHeight;
    } else if (w <= 768 && this.options.tabletHeight) {
      newHeight = this.options.tabletHeight;
    } else if (w <= 1024 && this.options.desktopHeight) {
      newHeight = this.options.desktopHeight;
    }

    if (w <= 480 && this.options.mobileWidth) {
      newWidth = this.options.mobileWidth;
    } else if (w <= 768 && this.options.tabletWidth) {
      newWidth = this.options.tabletWidth;
    } else if (w <= 1024 && this.options.desktopWidth) {
      newWidth = this.options.desktopWidth;
    }

    if (newHeight !== this.options.height || newWidth !== this.options.width) {
      this.options.height = newHeight;
      this.options.width = newWidth;
      this.updateContainer();
    }
  }

  updateBlurDivs() {
    this.createBlurDivs();
  }

  updateContainer() {
    const style = this.getContainerStyle();
    Object.assign(this.container.style, style);
  }

  updateVisibility() {
    if (this.container) {
      this.container.style.opacity = this.isVisible ? 1 : 0;
    }
  }

  attachTo(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    if (element) {
      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(this.container);
    }
  }

  updateOptions(newOptions) {
    // Handle preset
    if (newOptions.preset && this.getPresets()[newOptions.preset]) {
      newOptions = { ...this.getPresets()[newOptions.preset], ...newOptions };
    }

    this.options = this.mergeConfigs(this.options, newOptions);
    this.updateContainer();
    this.updateBlurDivs();
  }

  destroy() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.container && this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }

    this.blurDivs = [];
    this.container = null;
  }

  injectStyles() {
    const styleId = 'gradual-blur-styles';
    if (document.getElementById(styleId)) return;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = `
      .gradual-blur { 
        pointer-events: none; 
        transition: opacity 0.3s ease-out; 
      }
      .gradual-blur-parent { 
        overflow: hidden; 
      }
      .gradual-blur-inner { 
        pointer-events: none; 
      }
      .gradual-blur-inner > div {
        -webkit-backdrop-filter: inherit;
        backdrop-filter: inherit;
      }
      .gradual-blur {
        isolation: isolate;
      }
      @supports not (backdrop-filter: blur(1px)) {
        .gradual-blur-inner > div {
          background: rgba(0, 0, 0, 0.3);
          opacity: 0.5;
        }
      }
      .gradual-blur-fixed {
        position: fixed !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 1000;
      }
    `;

    document.head.appendChild(styleElement);
  }

  // Méthodes statiques pour créer des presets
  static createPreset(presetName) {
    const presets = {
      top: { position: 'top', height: '6rem' },
      bottom: { position: 'bottom', height: '6rem' },
      left: { position: 'left', height: '6rem' },
      right: { position: 'right', height: '6rem' },
      subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
      intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
      smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
      sharp: { height: '5rem', curve: 'linear', divCount: 4 },
      header: { position: 'top', height: '8rem', curve: 'ease-out' },
      footer: { position: 'bottom', height: '8rem', curve: 'ease-out' },
      sidebar: { position: 'left', height: '6rem', strength: 2.5 },
      'page-header': { position: 'top', height: '10rem', target: 'page', strength: 3 },
      'page-footer': { position: 'bottom', height: '10rem', target: 'page', strength: 3 }
    };

    return new GradualBlur(presets[presetName] || presets.subtle);
  }

  // Méthode statique pour créer avec configuration complète
  static create(options = {}) {
    return new GradualBlur(options);
  }
}

// Fonction utilitaire pour initialiser tous les effets de flou
function initializeGradualBlur() {
  // Flou sur les cartes de pricing
  const packCards = document.querySelectorAll('.pack-card');
  packCards.forEach(card => {
    const blur = GradualBlur.create({
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
    const blur = GradualBlur.create({
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
    const blur = GradualBlur.create({
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
    const blur = GradualBlur.create({
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
    const blur = GradualBlur.create({
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
    const blur = GradualBlur.create({
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
    const blur = GradualBlur.create({
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

  console.log('✅ GradualBlur v2.0 initialisé avec succès !');
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