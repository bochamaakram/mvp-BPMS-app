-- Migration: Add is_active field to processes table
-- Run this for existing databases

-- Add is_active column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='processes' AND column_name='is_active'
    ) THEN
        ALTER TABLE processes ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Update existing processes to be active by default
UPDATE processes SET is_active = true WHERE is_active IS NULL;
