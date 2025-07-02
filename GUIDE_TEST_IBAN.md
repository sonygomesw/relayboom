# 🏦 Guide de Test - Système IBAN RelayBoom

## ✅ **Prérequis - Scripts Exécutés**
- [x] `fix_iban_migration.sql` ✅
- [x] `iban_functions_and_views.sql` ✅
- [x] Test : `SELECT * FROM get_pending_payments_stats();` ✅

## 🎯 **Test du Système IBAN**

### **1. Test Interface Clippeur**

#### **Accéder aux paramètres :**
1. Connectez-vous en tant que clippeur
2. Allez sur : `http://localhost:3001/dashboard/clipper/settings`
3. Vous devriez voir la page "Paramètres" avec la section "Informations bancaires"

#### **Renseigner l'IBAN :**
1. Remplissez le formulaire avec :
   - **IBAN** : `FR76 1234 5678 9012 3456 7890 123` (IBAN test)
   - **Banque** : `Crédit Agricole` (optionnel)
   - **Titulaire** : `Votre Nom Complet`
2. Cliquez sur "Sauvegarder"
3. ✅ Le formulaire devrait se transformer en affichage vert "Informations bancaires configurées"

### **2. Test Base de Données**

#### **Vérifier l'IBAN sauvegardé :**
```sql
-- Dans Supabase SQL Editor
SELECT id, pseudo, iban, bank_name, account_holder_name 
FROM profiles 
WHERE role = 'clipper' 
AND iban IS NOT NULL;
```

#### **Tester la fonction de vérification IBAN :**
```sql
-- Remplacez USER_ID_DU_CLIPPEUR par l'ID réel
SELECT * FROM get_clipper_iban_info('USER_ID_DU_CLIPPEUR');
```

### **3. Test Workflow Complet (Simulation)**

#### **Étape 1 : Créer une soumission test**
```sql
-- Exemple avec une soumission de mission existante
-- Remplacez les IDs par des vrais IDs de votre DB
INSERT INTO clip_submissions (
  id, user_id, mission_id, tiktok_url, views_count, status
) VALUES (
  gen_random_uuid(),
  'ID_CLIPPEUR_AVEC_IBAN',
  'ID_MISSION_EXISTANTE', 
  'https://tiktok.com/@test/video/123',
  50000,
  'approved'
);
```

#### **Étape 2 : Créer le paiement en attente**
```sql
-- Récupérer l'ID de la soumission créée
SELECT id FROM clip_submissions WHERE tiktok_url LIKE '%test%' ORDER BY created_at DESC LIMIT 1;

-- Créer le paiement (remplacez SUBMISSION_ID)
SELECT create_pending_payment_for_mission('SUBMISSION_ID');
```

#### **Étape 3 : Vérifier le paiement créé**
```sql
-- Voir tous les paiements en attente
SELECT * FROM admin_pending_payments;

-- Statistiques
SELECT * FROM get_pending_payments_stats();
```

#### **Étape 4 : Marquer comme payé**
```sql
-- Récupérer l'ID du paiement
SELECT id FROM pending_payments WHERE status = 'pending' LIMIT 1;

-- Marquer comme payé (remplacez PAYMENT_ID)
SELECT mark_payment_as_paid('PAYMENT_ID', 'VIREMENT-001', 'Test de paiement');
```

## 🧪 **Tests Fonctionnels**

### **Test 1 : Validation IBAN**
- ✅ IBAN valide : `FR76 1234 5678 9012 3456 7890 123`
- ❌ IBAN invalide : `INVALID123` (doit rejeter)

### **Test 2 : Formatage automatique**
- Tapez : `fr761234567890123456789012`
- Résultat attendu : `FR76 1234 5678 9012 3456 7890 12`

### **Test 3 : Gestion des erreurs**
- Tenter de sauvegarder sans IBAN → Erreur
- Tenter de sauvegarder sans nom titulaire → Erreur

## 🔧 **Dépannage**

### **Erreur : "IBAN manquant"**
- Le clippeur n'a pas configuré son IBAN
- Aller dans `/dashboard/clipper/settings` et remplir le formulaire

### **Erreur : "Soumission non trouvée"**
- L'ID de soumission n'existe pas
- Vérifier avec : `SELECT id FROM clip_submissions;`

### **Erreur : "Mission non trouvée"**
- L'ID de mission dans la soumission n'existe pas
- Vérifier avec : `SELECT id FROM missions;`

## 📊 **Vues Utiles**

### **Pour l'Admin :**
```sql
-- Tous les paiements en attente
SELECT * FROM admin_pending_payments;

-- Statistiques globales
SELECT * FROM get_pending_payments_stats();
```

### **Pour les Clippeurs :**
```sql
-- Ses propres paiements (nécessite auth.uid())
SELECT * FROM clipper_payments;
```

## 🎉 **Résultat Attendu**

Après tous les tests, vous devriez avoir :
- ✅ Interface IBAN fonctionnelle
- ✅ Sauvegarde en base de données
- ✅ Création automatique de paiements
- ✅ Workflow complet de A à Z

## 📞 **Support**

En cas de problème :
1. Vérifiez les logs du navigateur (F12)
2. Vérifiez les erreurs Supabase
3. Testez les fonctions SQL individuellement
4. Vérifiez que tous les scripts ont été exécutés

---

🚀 **Le système IBAN est maintenant prêt pour production !** 