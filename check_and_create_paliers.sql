-- Script pour vérifier et créer la table clip_submissions
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier si la table existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'clip_submissions'
);

-- 2. Compter le nombre d'entrées si la table existe
SELECT COUNT(*) as total_submissions FROM clip_submissions;

-- 3. Voir un échantillon des données
SELECT 
  id,
  user_id,
  mission_id,
  views_declared,
  palier,
  status,
  created_at
FROM clip_submissions
ORDER BY created_at DESC
LIMIT 5;

-- 4. Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS clip_submissions (
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

-- 5. Ajouter des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_clip_submissions_user_id ON clip_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_clip_submissions_mission_id ON clip_submissions(mission_id);
CREATE INDEX IF NOT EXISTS idx_clip_submissions_status ON clip_submissions(status);
CREATE INDEX IF NOT EXISTS idx_clip_submissions_palier ON clip_submissions(palier);

-- 6. Activer Row Level Security
ALTER TABLE clip_submissions ENABLE ROW LEVEL SECURITY;

-- 7. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view own submissions" ON clip_submissions;
DROP POLICY IF EXISTS "Users can create own submissions" ON clip_submissions;
DROP POLICY IF EXISTS "Users can update own pending submissions" ON clip_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON clip_submissions;
DROP POLICY IF EXISTS "Admins can update all submissions" ON clip_submissions;

-- 8. Politiques de sécurité améliorées
-- Les utilisateurs peuvent voir leurs propres soumissions
CREATE POLICY "Users can view own submissions" ON clip_submissions
FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres soumissions
CREATE POLICY "Users can create own submissions" ON clip_submissions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres soumissions (uniquement si en attente)
CREATE POLICY "Users can update own pending submissions" ON clip_submissions
FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Les admins peuvent voir toutes les soumissions
CREATE POLICY "Admins can view all submissions" ON clip_submissions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Les admins peuvent modifier toutes les soumissions
CREATE POLICY "Admins can update all submissions" ON clip_submissions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 9. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Trigger pour updated_at
DROP TRIGGER IF EXISTS update_clip_submissions_updated_at ON clip_submissions;
CREATE TRIGGER update_clip_submissions_updated_at 
BEFORE UPDATE ON clip_submissions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Vérification finale
SELECT 
  'Table clip_submissions créée/mise à jour avec succès' as message,
  COUNT(*) as total_entries
FROM clip_submissions; 