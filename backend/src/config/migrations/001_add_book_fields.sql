-- Add new columns to books table
ALTER TABLE books
ADD COLUMN IF NOT EXISTS available_quantity INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS publisher VARCHAR(255),
ADD COLUMN IF NOT EXISTS publication_year INTEGER,
ADD COLUMN IF NOT EXISTS shelf_location VARCHAR(100);

-- Update available_quantity to match quantity for existing books
UPDATE books SET available_quantity = quantity WHERE available_quantity = 0; 