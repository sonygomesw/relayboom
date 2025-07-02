-- Script SQL à exécuter dans Supabase SQL Editor
-- 1. Ajouter la colonne role à la table profiles
ALTER TABLE profiles ADD COLUMN role VARCHAR(10) CHECK (role IN ('creator', 'clipper'));
