# 🚀 Guide de Déploiement - RelayBoom

## 📋 Prérequis

- ✅ Compte Supabase avec projet configuré
- ✅ Compte Vercel (recommandé) ou Netlify
- ✅ Nom de domaine (optionnel)

## 🗄️ 1. Configuration Base de Données

### Étape 1: Exécuter le script final
Dans Supabase SQL Editor, exécutez le fichier `final-setup.sql` :

```sql
-- Le script créera automatiquement :
-- ✅ 5 missions d'exemple
-- ✅ Structure complète des tables
-- ✅ Politiques de sécurité
-- ✅ Données de démonstration
```

### Étape 2: Créer un compte admin
1. Inscrivez-vous via l'interface RelayBoom
2. Dans Supabase, modifiez votre profil :
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'votre-email@exemple.com';
```

## 🌐 2. Déploiement sur Vercel

### Méthode 1: Déploiement automatique (Recommandé)

1. **Connecter votre repository GitHub**
   ```bash
   # Poussez votre code sur GitHub
   git add .
   git commit -m "🚀 RelayBoom prêt pour déploiement"
   git push origin main
   ```

2. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez votre compte GitHub
   - Sélectionnez votre repository RelayBoom
   - Cliquez "Deploy"

3. **Configurer les variables d'environnement**
   Dans Vercel Dashboard → Settings → Environment Variables :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-publique
   ```

### Méthode 2: CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redéployer avec les nouvelles variables
vercel --prod
```

## 🔧 3. Configuration Post-Déploiement

### Mise à jour des URLs Supabase
Dans Supabase Dashboard → Authentication → URL Configuration :

```
Site URL: https://votre-domaine.vercel.app
Redirect URLs: 
- https://votre-domaine.vercel.app/onboarding/role
- https://votre-domaine.vercel.app/dashboard/creator
- https://votre-domaine.vercel.app/dashboard/clipper
- https://votre-domaine.vercel.app/admin
```

### Test de fonctionnement
1. ✅ Créer un compte clippeur
2. ✅ Créer un compte créateur  
3. ✅ Tester la soumission de clip
4. ✅ Vérifier l'interface admin

## 🏷️ 4. Nom de Domaine Personnalisé

### Sur Vercel
1. Vercel Dashboard → Domains
2. Ajouter votre domaine
3. Configurer les DNS selon les instructions

### Configuration DNS (exemple)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

## 📊 5. Monitoring et Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics

# Ajouter dans layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Supabase Monitoring
- Dashboard → Settings → Database → Logs
- Surveiller les performances des requêtes
- Configurer des alertes

## 🔒 6. Sécurité Production

### Variables d'environnement
```bash
# Production uniquement
NODE_ENV=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optionnel: Analytics
VERCEL_ANALYTICS_ID=xxx
```

### Politiques RLS Supabase
```sql
-- Vérifier que toutes les tables ont RLS activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Toutes doivent avoir rowsecurity = true
```

## 🚀 7. Optimisations Production

### Performance
```typescript
// next.config.ts - Optimisations production
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Optimisation des images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}
```

### SEO
```typescript
// app/layout.tsx
export const metadata = {
  title: 'RelayBoom - Plateforme de Clipping TikTok',
  description: 'Gagnez de l\'argent en créant des clips viraux TikTok',
  keywords: 'tiktok, clipping, gagner argent, viral, créateurs',
  openGraph: {
    title: 'RelayBoom - Gagnez avec vos TikToks',
    description: 'La plateforme qui connecte créateurs et clippeurs',
    url: 'https://votre-domaine.com',
    siteName: 'RelayBoom',
    images: [
      {
        url: 'https://votre-domaine.com/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
  }
}
```

## ✅ 8. Checklist Final

### Avant le lancement
- [ ] ✅ Build de production réussi
- [ ] ✅ Tests sur tous les rôles (admin, créateur, clippeur)
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ URLs de redirection Supabase mises à jour
- [ ] ✅ Nom de domaine configuré (si applicable)
- [ ] ✅ Analytics installé
- [ ] ✅ Monitoring activé

### Post-lancement
- [ ] ✅ Créer des comptes de test
- [ ] ✅ Vérifier tous les flux utilisateur
- [ ] ✅ Tester les paiements (si implémentés)
- [ ] ✅ Surveiller les logs d'erreur
- [ ] ✅ Optimiser les performances

## 🆘 Dépannage

### Erreurs courantes

**Erreur de connexion Supabase**
```
Solution: Vérifiez les variables d'environnement
```

**Erreur de redirection OAuth**
```
Solution: Mettez à jour les URLs dans Supabase Auth
```

**Page 404 après déploiement**
```
Solution: Vérifiez la configuration des routes dans next.config.ts
```

## 📞 Support

- Documentation Vercel: [vercel.com/docs](https://vercel.com/docs)
- Documentation Supabase: [supabase.com/docs](https://supabase.com/docs)
- Support Next.js: [nextjs.org/docs](https://nextjs.org/docs)

---

🎉 **Félicitations ! RelayBoom est maintenant en ligne !**

Votre plateforme de clipping TikTok est prête à accueillir créateurs et clippeurs du monde entier. 