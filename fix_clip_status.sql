-- Script pour corriger le statut des clips de test
-- Les clips soumis doivent être en 'pending', pas 'approved' initialement

UPDATE submissions 
SET 
  status = 'pending',
  views_count = 0
WHERE user_id = '32f35dde-10f6-4bf7-94a0-b689dc2600f4';

-- Vérifier les résultats
SELECT 
  id,
  status,
  views_count,
  created_at,
  missions.title as mission_title
FROM submissions 
LEFT JOIN missions ON submissions.mission_id = missions.id
WHERE user_id = '32f35dde-10f6-4bf7-94a0-b689dc2600f4'
ORDER BY created_at DESC; 