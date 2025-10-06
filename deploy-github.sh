#!/bin/bash

# Script de déploiement pour WEBOOST Martinique avec Liquid Glass Theme
# Usage: ./deploy-github.sh "Votre message de commit"

echo "🚀 Déploiement WEBOOST Martinique - Liquid Glass Theme"
echo "=================================================="

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "📁 Initialisation de Git..."
    git init
fi

# Ajouter tous les fichiers
echo "📦 Ajout des fichiers..."
git add .

# Commit avec message
if [ -z "$1" ]; then
    COMMIT_MSG="✨ Add Liquid Glass theme with GradualBlur effects

- Add LiquidEther background component with WebGL
- Integrate GradualBlur progressive blur effects
- Create comprehensive Liquid Glass demo
- Add responsive glass morphism design
- Include multiple blur presets and animations
- Install mathjs dependency for advanced calculations"
else
    COMMIT_MSG="$1"
fi

echo "💾 Commit des modifications..."
git commit -m "$COMMIT_MSG"

# Demander l'URL du repository GitHub
echo ""
echo "🔗 Configuration du repository GitHub"
echo "Entrez l'URL de votre repository GitHub (ou appuyez sur Entrée pour ignorer):"
read REPO_URL

if [ ! -z "$REPO_URL" ]; then
    echo "🌐 Ajout du remote GitHub..."
    git remote remove origin 2>/dev/null || true
    git remote add origin "$REPO_URL"
    
    echo "⬆️  Poussage vers GitHub..."
    git push -u origin main
    
    echo "✅ Déploiement terminé !"
    echo "Votre site est maintenant disponible sur GitHub."
else
    echo "⏭️  Déploiement GitHub ignoré."
fi

echo ""
echo "🎉 Liquid Glass Theme déployé avec succès !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. cd frontend && npm start (pour tester localement)"
echo "2. npm run build (pour créer la version de production)"
echo "3. Déployer sur votre hébergeur préféré"
echo ""
echo "✨ Votre site WEBOOST Martinique a maintenant un thème Liquid Glass incroyable !"
