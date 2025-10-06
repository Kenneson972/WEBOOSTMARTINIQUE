#!/bin/bash

echo "🚀 Déploiement WEBOOST Martinique - Liquid Glass v2.0 + GradualBlur v2.0"
echo "========================================================================"

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "📁 Initialisation de Git..."
    git init
fi

# Ajouter tous les fichiers
echo "📦 Ajout des fichiers..."
git add .

# Commit avec message par défaut
echo "💾 Commit des modifications..."
git commit -m "🎉 WEBOOST Martinique v2.0 - Liquid Glass + GradualBlur Complet

✨ NOUVEAUTÉS MAJEURES:
- LiquidEther v2.0: Background WebGL avec simulations fluides complètes
- GradualBlur v2.0: Effets de flou progressif avec 13 presets
- Glass Morphism: Design moderne avec transparence et flou
- AutoDemo Intelligent: Détection d'inactivité et reprise automatique

🚀 FONCTIONNALITÉS:
- Background LiquidEther avec WebGL et Three.js
- Simulations fluides: Advection, Viscous, Divergence, Poisson
- GradualBlur avec courbes: linear, bezier, ease-in, ease-out, ease-in-out
- 13 presets prêts à l'emploi (subtle, intense, smooth, sharp, etc.)
- Effets hover avec intensity personnalisable
- Responsive design avec breakpoints (480px, 768px, 1024px)
- Intersection Observer pour optimisation des performances
- Support mobile et tactile complet

🎮 DÉMONSTRATIONS:
- index.html: Site principal avec tous les effets automatiques
- test-modern-design.html: Page de test des effets
- gradual-blur-demo.html: Démonstration interactive avec contrôles
- LIQUID_ETHER_FINAL_INTEGRATION.md: Documentation complète
- GRADUAL_BLUR_V2_FINAL.md: Guide d'utilisation GradualBlur

💎 DESIGN:
- Typographie moderne: Inter + Space Grotesk
- Couleurs: Violet (#8a2be2), Rose (#ff1493), Cyan (#00bfff)
- Animations fluides et professionnelles
- Interface 100% responsive et accessible"

# Demander l'URL du repository GitHub
echo ""
echo "🔗 Configuration du repository GitHub"
read -p "Entrez l'URL de votre repository GitHub (ou appuyez sur Entrée pour ignorer): " REPO_URL

if [ ! -z "$REPO_URL" ]; then
    echo "🌐 Ajout du remote GitHub..."
    git remote remove origin 2>/dev/null
    git remote add origin "$REPO_URL"
    
    echo "⬆️  Poussage vers GitHub..."
    git push -u origin main
    
    echo "✅ Déploiement terminé !"
    echo "Votre site est maintenant disponible sur GitHub."
else
    echo "⏭️  Déploiement GitHub ignoré."
fi

echo ""
echo "🎉 WEBOOST Martinique v2.0 déployé avec succès !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Ouvrir index.html dans votre navigateur (site principal)"
echo "2. Tester gradual-blur-demo.html (démonstration interactive)"
echo "3. Déployer sur votre hébergeur préféré"
echo ""
echo "🌟 FONCTIONNALITÉS DISPONIBLES:"
echo "- Background LiquidEther avec simulations fluides WebGL"
echo "- Effets GradualBlur avec 13 presets et animations"
echo "- Design Glass Morphism moderne et responsive"
echo "- AutoDemo intelligent et optimisé mobile"
echo ""
echo "📖 DOCUMENTATION:"
echo "- LIQUID_ETHER_FINAL_INTEGRATION.md (LiquidEther complet)"
echo "- GRADUAL_BLUR_V2_FINAL.md (GradualBlur v2.0)"
echo ""
echo "✨ Votre site WEBOOST Martinique est maintenant ABSOLUMENT SPECTACULAIRE !"

# Rendre le script exécutable
chmod +x deploy-github.sh
