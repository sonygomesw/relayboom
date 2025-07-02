-- Script SQL pour le système de déclaration de paliers de vues
-- À exécuter dans Supabase SQL Editor

-- 1. Créer la table clip_submissions pour les déclarations de paliers
CREATE TABLE clip_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  tiktok_link TEXT NOT NULL,
  views_declared INTEGER NOT NULL,
  declared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  palier INTEGER NOT NULL, -- ex: 1000, 5000, 10000, 50000
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  checked_by UUID REFERENCES auth.users(id),
  checked_at TIMESTAMP WITH TIME ZONE,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ajouter des index pour optimiser les performances
CREATE INDEX idx_clip_submissions_user_id ON clip_submissions(user_id);
CREATE INDEX idx_clip_submissions_mission_id ON clip_submissions(mission_id);
CREATE INDEX idx_clip_submissions_status ON clip_submissions(status);
CREATE INDEX idx_clip_submissions_palier ON clip_submissions(palier);

-- 3. Activer Row Level Security
ALTER TABLE clip_submissions ENABLE ROW LEVEL SECURITY;

-- 4. Politiques de sécurité
-- Les utilisateurs peuvent voir leurs propres soumissions
CREATE POLICY "Users can view own submissions" ON clip_submissions
FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres soumissions
CREATE POLICY "Users can create own submissions" ON clip_submissions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres soumissions (uniquement si en attente)
CREATE POLICY "Users can update own pending submissions" ON clip_submissions
FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- 5. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Trigger pour updated_at
CREATE TRIGGER update_clip_submissions_updated_at 
BEFORE UPDATE ON clip_submissions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Ajouter quelques paliers de test pour les missions existantes (optionnel)
-- INSERT INTO clip_submissions (user_id, mission_id, tiktok_link, views_declared, palier) VALUES
-- (auth.uid(), (SELECT id FROM missions LIMIT 1), 'https://tiktok.com/@test/video/123', 2500, 1000);

COMMENT ON TABLE clip_submissions IS 'Table pour stocker les déclarations de paliers de vues des clippeurs';
COMMENT ON COLUMN clip_submissions.palier IS 'Palier de vues déclaré (1000, 5000, 10000, 50000, etc.)';
COMMENT ON COLUMN clip_submissions.status IS 'Statut de la déclaration: pending, approved, rejected';
COMMENT ON COLUMN clip_submissions.views_declared IS 'Nombre de vues déclarées par le clippeur'; 