// Script principal pour l'initialisation de LiquidEther
// Garantit que tout s'exécute au bon moment

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du site WebBoost Martinique...');
    
    // Variables globales
    let liquidEther = null;
    
    // Fonction d'initialisation de LiquidEther
    function initLiquidEther() {
        try {
            // Vérifier que LiquidEther est disponible
            if (typeof LiquidEther === 'undefined') {
                console.error('❌ LiquidEther non disponible');
                return false;
            }

            console.log('✅ LiquidEther disponible, initialisation...');

            // Initialiser LiquidEther avec configuration optimisée
            liquidEther = new LiquidEther({
                color: '#9333ea',
                background: '#000000',
                density: 0.6,
                velocity: 0.4,
                size: 1.2,
                opacity: 0.7
            });

            console.log('✅ LiquidEther initialisé avec succès !');
            return true;

        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation LiquidEther:', error);
            return false;
        }
    }

    // Gestion de la visibilité pour optimiser les performances
    function setupVisibilityHandling() {
        document.addEventListener('visibilitychange', function() {
            if (!liquidEther) return;
            
            if (document.hidden) {
                liquidEther.stop();
                console.log('⏸️ Animation LiquidEther mise en pause');
            } else {
                liquidEther.start();
                console.log('▶️ Animation LiquidEther reprise');
            }
        });
    }

    // Gestion du redimensionnement de la fenêtre
    function setupResizeHandling() {
        let resizeTimeout;
        window.addEventListener('resize', function() {
            if (!liquidEther) return;
            
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log('📱 Redimensionnement détecté, recréation des particules...');
                liquidEther.createParticles();
            }, 250);
        });
    }

    // Initialisation des animations de révélation
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(reveal => {
            revealObserver.observe(reveal);
        });

        console.log('✅ Animations de révélation initialisées');
    }

    // Initialisation de la navigation mobile
    function initMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const mainNav = document.querySelector('.main-nav');

        if (navToggle && mainNav) {
            navToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Fermer le menu lors du clic sur un lien
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });

            console.log('✅ Navigation mobile initialisée');
        }
    }

    // Initialisation des FAQ
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Fermer tous les autres éléments FAQ
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle l'élément actuel
                item.classList.toggle('active');
            });
        });

        console.log('✅ FAQ initialisées');
    }

    // Initialisation du formulaire de contact
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Récupérer les données du formulaire
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                console.log('📧 Données du formulaire:', data);
                
                // Ici vous pouvez ajouter la logique d'envoi
                // Par exemple, un appel à votre API
                
                // Message de confirmation temporaire
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<span>Envoi en cours...</span>';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Message envoyé !</span><i class="fas fa-check"></i>';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 3000);
                }, 2000);
            });

            console.log('✅ Formulaire de contact initialisé');
        }
    }

    // Fonction principale d'initialisation
    function init() {
        // Attendre un peu pour s'assurer que tout est chargé
        setTimeout(() => {
            // Initialiser LiquidEther
            initLiquidEther();
            
            // Configurer les gestionnaires d'événements
            setupVisibilityHandling();
            setupResizeHandling();
            
            // Initialiser les autres fonctionnalités
            initRevealAnimations();
            initMobileNavigation();
            initFAQ();
            initContactForm();
            
            console.log('✅ Site WebBoost Martinique entièrement initialisé !');
        }, 300);
    }

    // Démarrer l'initialisation
    init();
});
