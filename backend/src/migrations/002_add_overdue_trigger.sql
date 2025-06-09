-- Function to update overdue status
CREATE OR REPLACE FUNCTION update_overdue_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'issued' AND NEW.due_date < CURRENT_TIMESTAMP THEN
    NEW.status := 'overdue';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update status to overdue
CREATE TRIGGER check_overdue_status
  BEFORE INSERT OR UPDATE ON book_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_overdue_status();

-- Update existing records
UPDATE book_issues 
SET status = 'overdue' 
WHERE status = 'issued' 
AND due_date < CURRENT_TIMESTAMP; 