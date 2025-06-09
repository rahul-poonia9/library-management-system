-- Sample Books
INSERT INTO books (title, author, isbn, quantity, category, publisher, publication_year) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 'Fiction', 'Scribner', 1925),
('To Kill a Mockingbird', 'Harper Lee', '9780446310789', 3, 'Fiction', 'Grand Central Publishing', 1960),
('1984', 'George Orwell', '9780451524935', 4, 'Science Fiction', 'Signet Classic', 1949),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 2, 'Romance', 'Penguin Classics', 1813),
('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 3, 'Fantasy', 'Mariner Books', 1937);

-- Sample Students
INSERT INTO students (name, roll_number, department, semester, phone, email) VALUES
('John Doe', 'CS2023001', 'Computer Science', 4, '1234567890', 'john.doe@example.com'),
('Jane Smith', 'CS2023002', 'Computer Science', 3, '2345678901', 'jane.smith@example.com'),
('Bob Wilson', 'EE2023001', 'Electrical Engineering', 5, '3456789012', 'bob.wilson@example.com'),
('Alice Brown', 'ME2023001', 'Mechanical Engineering', 2, '4567890123', 'alice.brown@example.com'),
('Charlie Davis', 'CE2023001', 'Civil Engineering', 6, '5678901234', 'charlie.davis@example.com');

-- Sample Book Issues
INSERT INTO book_issues (book_id, student_id, issue_date, due_date, status) VALUES
(1, 1, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'issued'),
(2, 2, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '1 day', 'overdue'),
(3, 3, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'issued'),
(4, 4, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '2 days', 'overdue'),
(5, 5, CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '22 days', 'issued'); 