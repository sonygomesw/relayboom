#!/usr/bin/env node

// 🚀 Script de vérification des performances RelayBoom
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Vérification des performances RelayBoom...\n');

// 1. Analyser la taille du bundle
console.log('📦 Analyse de la taille du bundle...');
try {
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ Build terminé\n');
} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
}

// 2. Vérifier les dépendances lourdes
console.log('📊 Analyse des dépendances...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

const heavyPackages = [];
Object.keys(dependencies).forEach(pkg => {
  try {
    const pkgPath = path.join('node_modules', pkg);
    if (fs.existsSync(pkgPath)) {
      const stats = execSync(`du -sh node_modules/${pkg}`, { encoding: 'utf8' });
      const size = stats.split('\t')[0];
      if (size.includes('M') && parseInt(size) > 5) {
        heavyPackages.push({ name: pkg, size });
      }
    }
  } catch (e) {
    // Ignorer les erreurs
  }
});

if (heavyPackages.length > 0) {
  console.log('⚠️  Packages lourds détectés:');
  heavyPackages.forEach(pkg => {
    console.log(`   - ${pkg.name}: ${pkg.size}`);
  });
} else {
  console.log('✅ Aucun package lourd détecté');
}

// 3. Vérifier les optimisations Next.js
console.log('\n🔧 Vérification de la configuration Next.js...');
const nextConfig = fs.readFileSync('next.config.ts', 'utf8');

const optimizations = [
  { name: 'optimizePackageImports', check: nextConfig.includes('optimizePackageImports') },
  { name: 'removeConsole (prod)', check: nextConfig.includes('removeConsole') },
  { name: 'splitChunks', check: nextConfig.includes('splitChunks') },
  { name: 'Image optimization', check: nextConfig.includes('images') },
];

optimizations.forEach(opt => {
  console.log(`   ${opt.check ? '✅' : '❌'} ${opt.name}`);
});

// 4. Conseils d'optimisation
console.log('\n💡 Conseils d\'optimisation:');

console.log(`
🚀 Base de données (Supabase):
   - Exécutez le script supabase_performance_optimization.sql
   - Utilisez les requêtes avec cache (getCachedData)
   - Limitez les jointures complexes

⚡ Frontend (Next.js):
   - Utilisez les hooks optimisés (useUserData, useMissions)
   - Implémentez la pagination pour les listes
   - Utilisez React.memo pour les composants lourds

📦 Bundle:
   - Analysez avec: npm run analyze
   - Divisez les gros composants
   - Utilisez le lazy loading

🌐 Network:
   - Activez la compression gzip
   - Utilisez un CDN pour les assets
   - Optimisez les images (WebP/AVIF)
`);

// 5. Commandes utiles
console.log('🛠️  Commandes utiles:');
console.log('   npm run build          - Build optimisé');
console.log('   npm run analyze        - Analyser le bundle');
console.log('   npm run dev:turbo      - Dev avec Turbopack');

console.log('\n✨ Vérification terminée !'); 