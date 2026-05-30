-- Migration: Change platform field to platforms array
-- This migration updates the projects table to support multiple platforms

BEGIN;

-- Add the new platforms column as an array
ALTER TABLE projects ADD COLUMN platforms text[] DEFAULT NULL;

-- Migrate existing data from platform to platforms
UPDATE projects 
SET platforms = CASE 
  WHEN platform IS NOT NULL THEN ARRAY[platform]
  ELSE NULL
END;

-- Drop the old platform column
ALTER TABLE projects DROP COLUMN platform;

-- Rename platforms to platform for consistency (optional, depends on preference)
-- ALTER TABLE projects RENAME COLUMN platforms TO platform;

COMMIT;
