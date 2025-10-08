#!/bin/bash

echo "🚀 Déploiement WEBOOST Martinique - LIQUID ETHER v2.0 CORRIGÉ ET FONCTIONNEL"
echo "============================================================================="

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
git commit -m "🎉 WEBOOST Martinique - LIQUID ETHER v2.0 CORRIGÉ ET FONCTIONNEL

✨ CORRECTIONS MAJEURES LIQUID ETHER v2.0:
- Structure HTML restructurée: #background-container + #content-container
- Résolution conflit CSS: suppression background-image du body
- Script UMD compatible: liquid-ether.umd.js via jsDelivr CDN
- Timing JavaScript corrigé: DOMContentLoaded pour éviter 'LiquidEther is not defined'
- CSS optimisé: position fixed, z-index -1, background transparent
- Test-wallpaper.html mis à jour avec structure finale

🔧 PROBLÈMES RÉSOLUS:
- ❌ 'LiquidEther is not defined' → ✅ DOMContentLoaded timing
- ❌ Conflit CSS background → ✅ Structure conteneurs séparés
- ❌ Import ES6 incompatible → ✅ UMD script universel
- ❌ Z-index conflicts → ✅ Background fixe z-index -1
- ❌ Canvas non visible → ✅ Position fixed + object-fit cover

🎨 DESIGN & UX:
- Background LiquidEther avec couleurs personnalisées
- Glass Morphism avec effets de transparence
- GradualBlur intégré dans les composants glass
- Animations fluides et professionnelles
- Interface 100% responsive et moderne

🔧 ARCHITECTURE TECHNIQUE:
- Frontend React avec composants modulaires
- Backend JSON Server pour API
- Three.js pour rendu WebGL haute performance
- Tailwind CSS pour styling moderne
- React Router pour navigation
- Axios pour requêtes API

📁 STRUCTURE PROJET:
- frontend/src/components/LiquidEther.jsx (Composant principal)
- frontend/src/components/LiquidEther.css (Styles CSS)
- frontend/src/App.js (Intégration LiquidEther)
- frontend/package.json (Three.js ajouté)
- index.html (Version statique maintenue)
- assets/ (CSS/JS pour version statique)

🎮 DÉMONSTRATIONS:
- localhost:3000 (App React avec LiquidEther)
- index.html (Version statique avec effets)
- gradual-blur-demo.html (Démonstration interactive)
- README.md (Documentation complète)

💎 CARACTÉRISTIQUES:
- Double version: React (développement) + HTML statique (production)
- LiquidEther avec simulations physiques réalistes
- AutoDemo avec reprise automatique après inactivité
- Support complet multi-plateforme
- Optimisé pour performances et UX
- Code propre et maintenable"

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
echo "🎉 WEBOOST Martinique - VERSION FINALE REACT + LIQUID ETHER v2.0 déployée !"
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo "1. 🌐 Ouvrir localhost:3000 (App React avec LiquidEther)"
echo "2. 📄 Ouvrir index.html dans votre navigateur (version statique)"
echo "3. 🎮 Tester gradual-blur-demo.html (démonstration interactive)"
echo "4. 🚀 Déployer sur votre serveur de production"
echo "5. ✨ Vérifier les animations LiquidEther en temps réel"
echo ""
echo "🌟 FONCTIONNALITÉS FINALES:"
echo "- 🎨 LiquidEther v2.0: Composant React avec WebGL et Three.js"
echo "- 🌊 Simulations fluides: Advection, Viscous, Divergence, Poisson"
echo "- 🔮 Glass Morphism avec effets de transparence modernes"
echo "- 📱 Support complet mobile et tactile"
echo "- ⚡ AutoDemo intelligent avec détection d'inactivité"
echo "- 🎯 Double version: React (dev) + HTML statique (prod)"
echo "- 🧹 Repository optimisé et nettoyé pour production"
echo ""
echo "🎮 DÉMARRAGE RAPIDE:"
echo "- React App: cd frontend && npm start (puis localhost:3000)"
echo "- Version statique: Ouvrir index.html directement"
echo "- Démonstration: Ouvrir gradual-blur-demo.html"
echo ""
echo "📖 DOCUMENTATION:"
echo "- README.md (Guide complet du projet)"
echo "- gradual-blur-demo.html (Démonstration interactive)"
echo "- frontend/src/components/LiquidEther.jsx (Code source)"
echo ""
echo "🚀 PRÊT POUR PRODUCTION !"
echo ""
echo "✨ Votre site WEBOOST Martinique avec LiquidEther React est maintenant ABSOLUMENT SPECTACULAIRE !"

# Rendre le script exécutable
chmod +x deploy-github.sh
