-- Insert test books
INSERT INTO books (title, author, isbn, quantity, category, shelf_location)
VALUES 
  ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 'Fiction', 'A1'),
  ('To Kill a Mockingbird', 'Harper Lee', '9780446310789', 3, 'Fiction', 'A2'),
  ('1984', 'George Orwell', '9780451524935', 4, 'Fiction', 'A3'),
  ('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 2, 'Fantasy', 'B1'),
  ('Database Systems', 'Thomas Connolly', '9780321523068', 6, 'Technical', 'C1');

-- Insert test students
INSERT INTO students (name, email, department, roll_number, semester)
VALUES 
  ('John Doe', 'john.doe@example.com', 'Computer Science', 'CS2023001', 3),
  ('Jane Smith', 'jane.smith@example.com', 'Electrical', 'EE2023002', 4),
  ('Bob Wilson', 'bob.wilson@example.com', 'Mechanical', 'ME2023003', 2);

-- Insert test book issues
INSERT INTO book_issues (book_id, student_id, issue_date, due_date, status)
VALUES 
  (1, 1, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '10 days', 'issued'),
  (2, 2, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '12 days', 'issued'),
  (3, 3, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 'overdue'); 