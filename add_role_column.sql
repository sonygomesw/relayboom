-- Script pour ajouter la colonne role si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role VARCHAR(10) CHECK (role IN ('creator', 'clipper'));
        RAISE NOTICE 'Colonne role ajoutée avec succès';
    ELSE
        RAISE NOTICE 'Colonne role existe déjà';
    END IF;
END
$$;
