// LiquidEther Background - WEBOOST Martinique
// Version optimisée et améliorée

class LiquidEther {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = {
      colors: ['#8a2be2', '#ff1493', '#00bfff'],
      mouseForce: 25,
      cursorSize: 120,
      resolution: 0.8,
      autoDemo: true,
      autoSpeed: 0.7,
      autoIntensity: 2.5,
      particleCount: 80,
      ...options
    };

    this.mouse = { x: 0.5, y: 0.5, prevX: 0.5, prevY: 0.5 };
    this.time = 0;
    this.particles = [];
    this.waves = [];
    
    this.init();
  }

  init() {
    this.setupContainer();
    this.createCanvas();
    this.setupEventListeners();
    this.startAnimation();
  }

  setupContainer() {
    this.container.style.position = 'absolute';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.overflow = 'hidden';
    this.container.style.zIndex = '-1';
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.width = rect.width;
    this.height = rect.height;
  }

  setupEventListeners() {
    this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0 };
    
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
      this.mouse.x = (e.clientX - rect.left) / rect.width;
      this.mouse.y = (e.clientY - rect.top) / rect.height;
    });

    this.container.addEventListener('mouseleave', () => {
      this.mouse.x = 0.5;
      this.mouse.y = 0.5;
    });
  }

  startAnimation() {
    this.time = 0;
    this.animate();
  }

  animate() {
    this.time += 0.016;
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Créer un gradient radial basé sur la position de la souris
    const gradient = this.ctx.createRadialGradient(
      this.mouse.x * this.width,
      this.mouse.y * this.height,
      0,
      this.mouse.x * this.width,
      this.mouse.y * this.height,
      Math.max(this.width, this.height) * 0.8
    );

    // Ajouter les couleurs du thème avec plus d'intensité
    gradient.addColorStop(0, this.options.colors[0] + '60');
    gradient.addColorStop(0.3, this.options.colors[1] + '40');
    gradient.addColorStop(0.7, this.options.colors[2] + '25');
    gradient.addColorStop(1, this.options.colors[0] + '15');

    // Dessiner le gradient
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Ajouter des vagues liquides
    this.drawWaves();
    
    // Ajouter des particules flottantes
    this.drawParticles();
    
    // Ajouter des connexions entre particules
    this.drawConnections();
  }

  drawParticles() {
    const particleCount = this.options.particleCount;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (this.time * 0.001 + i * 0.1) % (Math.PI * 2);
      const radius = 100 + Math.sin(this.time * 0.002 + i) * 80;
      
      const x = this.width * 0.5 + Math.cos(angle) * radius;
      const y = this.height * 0.5 + Math.sin(angle) * radius;
      
      // Effet de la souris sur les particules
      const mouseDistance = Math.sqrt(
        Math.pow(x - this.mouse.x * this.width, 2) + 
        Math.pow(y - this.mouse.y * this.height, 2)
      );
      
      const mouseInfluence = Math.max(0, 1 - mouseDistance / 300);
      const size = 1.5 + mouseInfluence * 4;
      const opacity = 0.2 + mouseInfluence * 0.6;
      
      // Stocker la particule pour les connexions
      this.particles[i] = { x, y, size, opacity };
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.options.colors[i % this.options.colors.length] + 
        Math.floor(opacity * 255).toString(16).padStart(2, '0');
      this.ctx.fill();
    }
  }

  drawWaves() {
    const waveCount = 3;
    
    for (let i = 0; i < waveCount; i++) {
      const waveOffset = i * Math.PI * 2 / waveCount;
      const waveSpeed = 0.003 + i * 0.001;
      const waveAmplitude = 30 + i * 20;
      
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.options.colors[i] + '30';
      this.ctx.lineWidth = 2;
      
      for (let x = 0; x < this.width; x += 4) {
        const y = this.height * 0.5 + 
          Math.sin((x * 0.01) + (this.time * waveSpeed) + waveOffset) * waveAmplitude +
          Math.sin((x * 0.005) + (this.time * waveSpeed * 0.5)) * (waveAmplitude * 0.3);
        
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.stroke();
    }
  }

  drawConnections() {
    const maxDistance = 150;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        
        if (!particle1 || !particle2) continue;
        
        const distance = Math.sqrt(
          Math.pow(particle1.x - particle2.x, 2) + 
          Math.pow(particle1.y - particle2.y, 2)
        );
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;
          
          this.ctx.beginPath();
          this.ctx.moveTo(particle1.x, particle1.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.strokeStyle = '#ffffff' + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }
}

// Initialiser LiquidEther quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  new LiquidEther('liquidEtherContainer', {
    colors: ['#8a2be2', '#ff1493', '#00bfff'],
    mouseForce: 25,
    cursorSize: 120,
    resolution: 0.6,
    autoDemo: true,
    autoSpeed: 0.7,
    autoIntensity: 2.5
  });
});

// Ajouter des effets GradualBlur CSS
function addGradualBlurEffects() {
  const style = document.createElement('style');
  style.textContent = `
    .gradual-blur-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3rem;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(0, 0, 0, 0.1) 20%,
        rgba(0, 0, 0, 0.3) 60%,
        rgba(0, 0, 0, 0.5) 100%
      );
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: none;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);
}

// Initialiser les effets blur
document.addEventListener('DOMContentLoaded', addGradualBlurEffects);
