-- Ajout des nouveaux champs pour les missions RelayBoom
-- Ces champs permettront aux créateurs de personnaliser leurs missions

-- Ajouter les nouvelles colonnes à la table missions
ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'UGC',
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Divertissement', 
ADD COLUMN IF NOT EXISTS budget_type VARCHAR(50) DEFAULT 'Budget total',
ADD COLUMN IF NOT EXISTS total_budget INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS budget_per_view DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS platforms TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS brand_guidelines TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS duration_min INTEGER,
ADD COLUMN IF NOT EXISTS duration_max INTEGER;

-- Mettre à jour les missions existantes avec des valeurs par défaut
-- (Les colonnes viennent d'être créées, donc on met à jour toutes les lignes existantes)
UPDATE missions SET 
  content_type = CASE 
    WHEN random() < 0.5 THEN 'UGC' 
    ELSE 'Découpage de vidéos' 
  END,
  category = CASE 
    WHEN creator_name = 'Speed' THEN 'Divertissement'
    WHEN creator_name = 'Kai Cenat' THEN 'Divertissement' 
    WHEN creator_name = 'MrBeast' THEN 'Marque'
    ELSE 'Divertissement'
  END,
  budget_type = CASE 
    WHEN random() < 0.6 THEN 'Budget total' 
    ELSE 'Budget par vue' 
  END,
  total_budget = CASE 
    WHEN reward IS NOT NULL THEN reward * 50 -- Estimation: 50 clips par campagne
    ELSE 10000 
  END,
  budget_per_view = CASE 
    WHEN reward IS NOT NULL THEN reward 
    ELSE 25.00 
  END,
  platforms = 'tiktok,instagram,youtube,x',
  duration_min = 15,
  duration_max = 60;

-- Ajouter des contraintes pour assurer la cohérence des données
ALTER TABLE missions 
ADD CONSTRAINT check_content_type 
CHECK (content_type IN ('UGC', 'Découpage de vidéos'));

ALTER TABLE missions 
ADD CONSTRAINT check_category 
CHECK (category IN ('Marque', 'Divertissement', 'Produits', 'Musique', 'Logo', 'Autre'));

ALTER TABLE missions 
ADD CONSTRAINT check_budget_type 
CHECK (budget_type IN ('Budget total', 'Budget par vue'));

-- Ajouter des index pour améliorer les performances des requêtes avec filtres
CREATE INDEX IF NOT EXISTS idx_missions_content_type ON missions(content_type);
CREATE INDEX IF NOT EXISTS idx_missions_category ON missions(category);
CREATE INDEX IF NOT EXISTS idx_missions_budget_type ON missions(budget_type);
CREATE INDEX IF NOT EXISTS idx_missions_filters ON missions(content_type, category, budget_type, status);

-- Commentaires pour documenter les nouveaux champs
COMMENT ON COLUMN missions.content_type IS 'Type de contenu souhaité par le créateur: UGC ou Découpage de vidéos';
COMMENT ON COLUMN missions.category IS 'Catégorie de la mission: Marque, Divertissement, Produits, Musique, Logo, Autre';
COMMENT ON COLUMN missions.budget_type IS 'Type de budget: Budget total ou Budget par vue';
COMMENT ON COLUMN missions.total_budget IS 'Budget total alloué à la mission (si budget_type = Budget total)';
COMMENT ON COLUMN missions.budget_per_view IS 'Budget par vue (si budget_type = Budget par vue)';
COMMENT ON COLUMN missions.platforms IS 'Plateformes cibles séparées par des virgules (tiktok,instagram,youtube,x)';
COMMENT ON COLUMN missions.logo_url IS 'URL du logo de la marque/créateur pour les missions de type Logo';
COMMENT ON COLUMN missions.brand_guidelines IS 'Directives de marque et instructions spécifiques pour les clippeurs';
COMMENT ON COLUMN missions.video_url IS 'URL de la vidéo source à clipper';
COMMENT ON COLUMN missions.duration_min IS 'Durée minimale souhaitée pour les clips (en secondes)';
COMMENT ON COLUMN missions.duration_max IS 'Durée maximale souhaitée pour les clips (en secondes)'; 