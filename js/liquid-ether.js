// LiquidEther - Script d'animation de fond
// Version UMD compatible avec tous les serveurs

(function() {
    'use strict';
    
    // Configuration par défaut
    const DEFAULT_CONFIG = {
        color: '#9333ea',
        background: '#000000',
        density: 0.8,
        velocity: 0.3,
        size: 1,
        opacity: 0.8
    };

    // Classe LiquidEther
    class LiquidEther {
        constructor(options = {}) {
            this.config = { ...DEFAULT_CONFIG, ...options };
            this.container = null;
            this.canvas = null;
            this.ctx = null;
            this.particles = [];
            this.animationId = null;
            this.isRunning = false;
            
            this.init();
        }

        init() {
            // Attendre que le DOM soit prêt
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            // Trouver le conteneur
            this.container = document.getElementById(this.config.el || 'background-container');
            if (!this.container) {
                console.warn('LiquidEther: Container non trouvé');
                return;
            }

            // Créer le canvas
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);

            // Configurer le canvas
            this.resize();
            window.addEventListener('resize', () => this.resize());

            // Créer les particules
            this.createParticles();

            // Démarrer l'animation
            this.start();

            console.log('✅ LiquidEther initialisé avec succès');
        }

        resize() {
            const rect = this.container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }

        createParticles() {
            this.particles = [];
            const count = Math.floor((this.canvas.width * this.canvas.height * this.config.density) / 10000);
            
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * this.config.velocity * 2,
                    vy: (Math.random() - 0.5) * this.config.velocity * 2,
                    size: Math.random() * this.config.size + 0.5,
                    opacity: Math.random() * this.config.opacity
                });
            }
        }

        update() {
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Rebond sur les bords
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

                // Garder dans les limites
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            });
        }

        draw() {
            // Effacer le canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Dessiner les particules
            this.particles.forEach(particle => {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = this.config.color;
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.fill();
            });

            // Dessiner les connexions
            this.drawConnections();
        }

        drawConnections() {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = this.config.color;
                        this.ctx.globalAlpha = (100 - distance) / 100 * 0.3;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        }

        animate() {
            if (!this.isRunning) return;
            
            this.update();
            this.draw();
            this.animationId = requestAnimationFrame(() => this.animate());
        }

        start() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.animate();
            }
        }

        stop() {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        destroy() {
            this.stop();
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // Exposer LiquidEther globalement
    window.LiquidEther = LiquidEther;

})();
