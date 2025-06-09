-- Function to update all overdue book issues
CREATE OR REPLACE FUNCTION update_all_overdue_status()
RETURNS void AS $$
BEGIN
  UPDATE book_issues 
  SET status = 'overdue',
      updated_at = CURRENT_TIMESTAMP
  WHERE status = 'issued' 
  AND due_date < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create a schedule to run this function every hour
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule('update_overdue_books', '0 * * * *', 'SELECT update_all_overdue_status()');

-- Comment out the above line if pg_cron is not available or not needed
-- In that case, you'll need to call this function manually or set up an external scheduler 