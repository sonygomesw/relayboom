-- Configuration du Storage Supabase pour les images de missions

-- Créer le bucket pour les images de missions
INSERT INTO storage.buckets (id, name, public)
VALUES ('mission-images', 'mission-images', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre aux utilisateurs authentifiés d'uploader des images
DROP POLICY IF EXISTS "Utilisateurs peuvent uploader des images" ON storage.objects;
CREATE POLICY "Utilisateurs peuvent uploader des images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'mission-images' AND
  auth.role() = 'authenticated'
);

-- Politique pour permettre la lecture publique des images
DROP POLICY IF EXISTS "Images publiquement lisibles" ON storage.objects;
CREATE POLICY "Images publiquement lisibles" ON storage.objects
FOR SELECT USING (bucket_id = 'mission-images');

-- Politique pour permettre aux créateurs de supprimer leurs propres images
DROP POLICY IF EXISTS "Créateurs peuvent supprimer leurs images" ON storage.objects;
CREATE POLICY "Créateurs peuvent supprimer leurs images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'mission-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique pour permettre aux créateurs de mettre à jour leurs images
DROP POLICY IF EXISTS "Créateurs peuvent mettre à jour leurs images" ON storage.objects;
CREATE POLICY "Créateurs peuvent mettre à jour leurs images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'mission-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Storage configuré ✅';
    RAISE NOTICE 'Bucket mission-images créé avec politiques de sécurité';
END
$$; 