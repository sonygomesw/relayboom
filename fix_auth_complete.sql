-- Script complet pour corriger l'authentification
-- À exécuter dans le tableau de bord Supabase

-- 1. Désactiver temporairement RLS sur profiles pour permettre les modifications
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer l'ancien profil orphelin
DELETE FROM profiles WHERE email = 'sonyparkerr@gmail.com';

-- 3. Créer le profil avec le bon ID utilisateur
INSERT INTO profiles (
    id,
    email,
    pseudo,
    role,
    tiktok_username,
    total_earnings,
    created_at,
    updated_at
) VALUES (
    '5b04a40f-8982-42b7-928c-230c8becc529', -- ID du nouvel utilisateur auth
    'sonyparkerr@gmail.com',
    'sonyparkerr',
    'creator',
    null,
    0,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    pseudo = EXCLUDED.pseudo,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 4. Remettre RLS et créer les bonnes politiques pour profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Créer les nouvelles politiques profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- 5. Confirmer l'utilisateur dans auth.users
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'sonyparkerr@gmail.com';

-- 6. Vérifier que tout est correct
SELECT 
    u.id as auth_id,
    u.email as auth_email,
    u.email_confirmed_at,
    p.id as profile_id,
    p.email as profile_email,
    p.role,
    p.pseudo
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'sonyparkerr@gmail.com';

-- 7. Afficher les politiques actuelles
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'missions')
ORDER BY tablename, policyname; 