-- Créer un utilisateur auth pour le profil existant
-- À exécuter dans le tableau de bord Supabase

-- Vérifier les utilisateurs auth existants
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- Créer un utilisateur auth pour sonyparkerr@gmail.com
-- Note: Remplacez 'VotreMotDePasse123!' par le mot de passe souhaité

-- Option 1: Créer via SQL (nécessite les droits admin)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '124c0dcf-552c-48c7-a131-87b5047e1fa3', -- Même ID que le profil
    'sonyparkerr@gmail.com',
    crypt('VotreMotDePasse123!', gen_salt('bf')), -- Mot de passe crypté
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Mettre à jour le profil pour s'assurer que l'ID correspond
UPDATE profiles 
SET id = '124c0dcf-552c-48c7-a131-87b5047e1fa3' 
WHERE email = 'sonyparkerr@gmail.com';

-- Vérifier que tout est correct
SELECT 
    u.id as auth_id,
    u.email as auth_email,
    p.id as profile_id,
    p.email as profile_email,
    p.role
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'sonyparkerr@gmail.com'; 