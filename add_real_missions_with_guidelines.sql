-- ===============================================
-- 🎯 AJOUT DE MISSIONS RÉELLES AVEC CONSIGNES DÉTAILLÉES
-- ===============================================

-- Vider les missions existantes pour repartir proprement
TRUNCATE TABLE submissions CASCADE;
TRUNCATE TABLE missions CASCADE;

-- Insérer des missions complètes avec toutes les données nécessaires
INSERT INTO missions (
  id,
  title,
  description,
  creator_name,
  creator_image,
  creator_thumbnail,
  price_per_1k_views,
  total_budget,
  status,
  featured,
  category,
  content_type,
  platforms,
  duration_min,
  duration_max,
  brand_guidelines,
  created_at
) VALUES 

-- Mission 1: MrBeast - Challenge Viral
(
  gen_random_uuid(),
  'MrBeast - Challenge $1M Impossible',
  'Clippez les moments les plus fous du dernier challenge MrBeast ! Focus sur les réactions authentiques, les twists inattendus, et les moments de tension pure.',
  'MrBeast',
  '/mrbeast.jpg',
  '/mrbeast.jpg',
  0.12,
  5000,
  'active',
  true,
  'Divertissement',
  'UGC',
  'tiktok,instagram,youtube',
  15,
  60,
  '🎯 **CONSIGNES DÉTAILLÉES MRBEAST:**

**CE QU''ON CHERCHE:**
• Moments de tension maximale (éliminations, défis impossibles)
• Réactions authentiques des participants 
• Twists et retournements de situation
• Interactions spontanées et drôles
• Moments "WOW" qui donnent des frissons

**STRUCTURE IDÉALE:**
1. Hook percutant (3 premières secondes)
2. Build-up de tension 
3. Moment clé/révélation/réaction
4. Conclusion mémorable

**HASHTAGS OBLIGATOIRES:**
#MrBeast #Challenge #Viral #TikTok #Money #Impossible

**MENTIONS:**
@mrbeast @mrbeast6000

**EXEMPLES DE CLIPS QUI CARTONNENT:**
• "Il gagne 1M$ en 60 secondes !"
• "La réaction quand il perd tout..."
• "Plot twist personne ne l''a vu venir"
• "Le moment le plus stressant de sa vie"

**INTERDICTIONS:**
❌ Pas de spoilers majeurs dans les 3 premières secondes
❌ Pas de contenu violent ou choquant
❌ Pas de montage trop rapide (garder l''authenticité)

**BONUS:**
💰 +50% si le clip dépasse 1M de vues
🎯 +25% si utilisé dans une compilation officielle',
  NOW()
),

-- Mission 2: Speed Gaming Reactions
(
  gen_random_uuid(),
  'Speed - Rage Gaming Moments',
  'Capturez les meilleures réactions gaming de Speed ! Ses explosions de joie, de rage, ses moments de skill pur - tout ce qui fait vibrer sa communauté.',
  'IShowSpeed',
  '/speedfan.jpg',
  '/speedfan.jpg',
  0.10,
  3000,
  'active',
  true,
  'Gaming',
  'UGC',
  'tiktok,instagram,youtube',
  10,
  45,
  '⚡ **CONSIGNES SPEED GAMING:**

**MOMENTS À PRIVILÉGIER:**
• Rage quits épiques et authentiques
• Moments de skill insane (clutch, plays impossibles)
• Réactions face aux jump scares
• Interactions drôles avec le chat
• Célébrations explosives après victoires

**STYLE RECHERCHÉ:**
• Énergie maximum, authentique Speed
• Pas de censure sur les réactions (dans les limites)
• Garder l''audio original pour l''impact
• Montage dynamique mais pas saccadé

**JEUX PRIORITAIRES:**
🎮 FIFA, Fortnite, Valorant, Horror Games
🔥 Tout nouveau jeu viral du moment

**HASHTAGS:**
#IShowSpeed #Gaming #Rage #Reaction #Viral #Twitch

**MENTIONS:**
@ishowspeed @speed_up1

**FORMATS QUI MARCHENT:**
• "Speed rage quit en 10 secondes"
• "La réaction la plus drôle de Speed"
• "Quand Speed fait un play impossible"
• "Chat vs Speed : qui gagne ?"

**TIMING PARFAIT:**
• Hook dans les 2 premières secondes
• Climax vers 15-20 secondes
• Chute/résolution rapide

**INTERDICTIONS:**
❌ Pas de contenu toxique ou haineux
❌ Pas de spoilers de nouveaux jeux
❌ Pas de clips trop longs (max 45s)',
  NOW()
),

-- Mission 3: Kai Cenat Stream Highlights  
(
  gen_random_uuid(),
  'Kai Cenat - Stream Moments Épiques',
  'Transformez les moments les plus drôles des streams de Kai Cenat en clips TikTok ! Réactions, interactions avec le chat, collaborations et moments spontanés.',
  'Kai Cenat',
  '/kaicenatfan.jpg',
  '/kaicenatfan.jpg',
  0.09,
  2500,
  'active',
  false,
  'Streaming',
  'UGC',
  'tiktok,instagram,youtube',
  15,
  60,
  '🎭 **GUIDE COMPLET KAI CENAT:**

**CONTENU GOLD:**
• Réactions face au contenu viral TikTok
• Interactions hilarantes avec les viewers
• Moments de rage ou de joie pure
• Collaborations avec autres streamers
• Fails techniques ou moments awkward

**PERSONNALITÉ À CAPTURER:**
• Énergie contagieuse de Kai
• Authenticité et spontanéité
• Connexion unique avec sa communauté
• Humour naturel et timing parfait

**STRUCTURE RECOMMANDÉE:**
1. Setup rapide du contexte (2-3s)
2. Build-up de l''émotion
3. Moment clé/réaction/punchline
4. Outro mémorable

**HASHTAGS ESSENTIELS:**
#KaiCenat #Twitch #Reaction #Funny #Viral #Stream

**MENTIONS:**
@kaicenat @kai_cenat

**TYPES DE CLIPS POPULAIRES:**
• "Kai découvre ce TikTok..."
• "La réaction de Kai m''a tué 😭"
• "Quand le chat troll Kai"
• "Kai + [autre streamer] = chaos"

**CONSEILS TECHNIQUES:**
• Garder l''audio original (sa voix = gold)
• Sous-titres pour les moments clés
• Transitions fluides, pas de cuts brutaux
• Préserver l''émotion authentique

**ÉVITER:**
❌ Clips sans contexte clair
❌ Moments trop privés/personnels
❌ Contenu répétitif déjà viral
❌ Audio de mauvaise qualité',
  NOW()
),

-- Mission 4: Créateur Lifestyle
(
  gen_random_uuid(),
  'Lifestyle Créateur - Behind The Scenes',
  'Créez du contenu authentique sur le lifestyle d''un créateur ! Studio sessions, routine quotidienne, coulisses, moments inspirants.',
  'Créateur Pro',
  '/centralfan.jpg',
  '/centralfan.jpg',
  0.08,
  2000,
  'active',
  false,
  'Lifestyle',
  'UGC',
  'tiktok,instagram',
  20,
  60,
  '✨ **MISSION LIFESTYLE CRÉATEUR:**

**ANGLES À EXPLORER:**
• Morning routine d''un créateur (5h-9h)
• Setup de studio et équipement
• Processus créatif en temps réel
• Moments d''inspiration et de doute
• Interaction avec l''équipe/famille

**STORYTELLING:**
• Montrer l''humain derrière le créateur
• Moments de vulnérabilité authentique
• Succès ET échecs (balance importante)
• Conseils pratiques pour l''audience

**ESTHÉTIQUE RECHERCHÉE:**
• Lumière naturelle privilégiée
• Couleurs chaudes et accueillantes
• Angles dynamiques mais pas trop stylisés
• Focus sur les détails authentiques

**HASHTAGS:**
#CreatorLife #BehindTheScenes #Lifestyle #Motivation #Authentic

**FORMATS GAGNANTS:**
• "Ma routine de 5h du matin"
• "Comment je reste créatif"
• "Setup de studio à 0€ vs 10000€"
• "Les coulisses que personne ne voit"

**TIMING IDÉAL:**
• Publier entre 18h-21h (lifestyle content)
• Weekends pour contenu plus personnel
• Éviter lundi matin (trop sérieux)

**INTERDICTIONS:**
❌ Pas de contenu superficiel/fake
❌ Pas de placement produit trop évident
❌ Pas de lifestyle inaccessible/élitiste',
  NOW()
),

-- Mission 5: Éducation/Business
(
  gen_random_uuid(),
  'Business Tips - Mindset Entrepreneur',
  'Clippez les meilleurs conseils business et mindset ! Motivation, success stories, tips pratiques pour entrepreneurs en herbe.',
  'Business Mentor',
  '/tatefan.jpg',
  '/tatefan.jpg',
  0.07,
  1500,
  'active',
  false,
  'Business',
  'UGC',
  'tiktok,linkedin,instagram',
  30,
  90,
  '💼 **MISSION BUSINESS/MINDSET:**

**CONTENU PRIORITAIRE:**
• Tips concrets et actionnables
• Success stories inspirantes
• Erreurs communes à éviter
• Mindset shifts puissants
• Stratégies business simples

**TONE OF VOICE:**
• Motivant mais pas agressif
• Accessible aux débutants
• Basé sur l''expérience réelle
• Honnête sur les difficultés

**STRUCTURE EFFICACE:**
1. Hook: problème/question (5s)
2. Solution/conseil pratique (20-30s)
3. Exemple concret (15-20s)
4. Call-to-action (5s)

**HASHTAGS BUSINESS:**
#Entrepreneur #BusinessTips #Mindset #Success #Motivation

**FORMATS QUI CONVERTISSENT:**
• "3 erreurs qui tuent ton business"
• "Comment j''ai fait 10K€ en 30 jours"
• "Le mindset qui change tout"
• "Business à 0€ qui cartonne"

**PREUVES SOCIALES:**
• Témoignages clients
• Résultats chiffrés
• Avant/après
• Screenshots de revenus

**ÉVITER ABSOLUMENT:**
❌ Promesses irréalistes
❌ Contenu trop théorique
❌ Jargon business complexe
❌ Vente trop agressive',
  NOW()
);

-- Vérifier que les missions ont été créées
SELECT 
  title,
  creator_name,
  price_per_1k_views,
  total_budget,
  status,
  category,
  LENGTH(brand_guidelines) as guidelines_length
FROM missions 
WHERE status = 'active'
ORDER BY created_at DESC; 