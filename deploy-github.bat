@echo off
echo 🚀 Déploiement WEBOOST Martinique - Liquid Glass Theme
echo ==================================================

REM Vérifier si Git est initialisé
if not exist ".git" (
    echo 📁 Initialisation de Git...
    git init
)

REM Ajouter tous les fichiers
echo 📦 Ajout des fichiers...
git add .

REM Commit avec message par défaut
echo 💾 Commit des modifications...
git commit -m "✨ Add Liquid Glass theme with GradualBlur effects

- Add LiquidEther background component with WebGL
- Integrate GradualBlur progressive blur effects  
- Create comprehensive Liquid Glass demo
- Add responsive glass morphism design
- Include multiple blur presets and animations
- Install mathjs dependency for advanced calculations"

REM Demander l'URL du repository GitHub
echo.
echo 🔗 Configuration du repository GitHub
set /p REPO_URL="Entrez l'URL de votre repository GitHub (ou appuyez sur Entrée pour ignorer): "

if not "%REPO_URL%"=="" (
    echo 🌐 Ajout du remote GitHub...
    git remote remove origin 2>nul
    git remote add origin "%REPO_URL%"
    
    echo ⬆️  Poussage vers GitHub...
    git push -u origin main
    
    echo ✅ Déploiement terminé !
    echo Votre site est maintenant disponible sur GitHub.
) else (
    echo ⏭️  Déploiement GitHub ignoré.
)

echo.
echo 🎉 Liquid Glass Theme déployé avec succès !
echo.
echo 📋 Prochaines étapes:
echo 1. cd frontend ^&^& npm start (pour tester localement)
echo 2. npm run build (pour créer la version de production)  
echo 3. Déployer sur votre hébergeur préféré
echo.
echo ✨ Votre site WEBOOST Martinique a maintenant un thème Liquid Glass incroyable !
pause
