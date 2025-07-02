-- Solution temporaire : désactiver RLS pour tester
-- ⚠️ À utiliser UNIQUEMENT pour les tests, pas en production

-- Désactiver temporairement RLS sur la table missions
ALTER TABLE missions DISABLE ROW LEVEL SECURITY;

-- Vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'missions' 
ORDER BY ordinal_position;

-- Test d'insertion simple
INSERT INTO missions (
    creator_id,
    creator_name,
    title,
    description,
    total_budget,
    price_per_1k_views,
    platforms,
    status
) VALUES (
    '124e6dcf-532c-4467-a131-67b84fe17a7a',
    'sonyparkerr',
    'Test Mission',
    'Test description',
    1000,
    1.0,
    'TikTok',
    'active'
) ON CONFLICT DO NOTHING;

-- Afficher les missions existantes
SELECT id, creator_id, creator_name, title, total_budget, status, created_at 
FROM missions 
ORDER BY created_at DESC 
LIMIT 5; 