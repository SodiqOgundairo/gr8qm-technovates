-- Add elements column to certificate_templates for the visual designer
-- This stores the drag-and-drop positioned elements as JSONB
-- Templates with NULL elements fall back to the legacy fixed-field layout

ALTER TABLE certificate_templates
  ADD COLUMN IF NOT EXISTS elements JSONB DEFAULT NULL;
