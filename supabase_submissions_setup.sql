-- Création de la table submissions pour RelayBoom
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL,
  tiktok_url TEXT,
  description TEXT,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submission_type VARCHAR DEFAULT 'url' CHECK (submission_type IN ('url', 'upload')),
  video_file_url TEXT,
  views_count INTEGER DEFAULT 0,
  earnings DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mission_id ON submissions(mission_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);

-- RLS (Row Level Security)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs peuvent voir leurs propres soumissions
CREATE POLICY "Users can view own submissions" ON submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy : Les utilisateurs peuvent créer leurs propres soumissions
CREATE POLICY "Users can create own submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy : Les utilisateurs peuvent modifier leurs propres soumissions (si pending)
CREATE POLICY "Users can update own pending submissions" ON submissions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_submissions_updated_at 
  BEFORE UPDATE ON submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documentation
COMMENT ON TABLE submissions IS 'Soumissions de clips par les clippeurs pour les missions';
COMMENT ON COLUMN submissions.mission_id IS 'ID de la mission (peut être externe)';
COMMENT ON COLUMN submissions.tiktok_url IS 'URL du clip TikTok soumis';
COMMENT ON COLUMN submissions.submission_type IS 'Type de soumission: url ou upload';
COMMENT ON COLUMN submissions.video_file_url IS 'URL du fichier vidéo si uploadé';
COMMENT ON COLUMN submissions.views_count IS 'Nombre de vues du clip';
COMMENT ON COLUMN submissions.earnings IS 'Gains générés par ce clip'; 