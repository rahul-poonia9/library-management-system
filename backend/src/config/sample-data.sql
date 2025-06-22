-- Sample Books
INSERT INTO books (title, author, isbn, quantity, category, publisher, publication_year) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 'Fiction', 'Scribner', 1925),
('To Kill a Mockingbird', 'Harper Lee', '9780446310789', 3, 'Fiction', 'Grand Central Publishing', 1960),
('1984', 'George Orwell', '9780451524935', 4, 'Science Fiction', 'Signet Classic', 1949),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 2, 'Romance', 'Penguin Classics', 1813),
('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 3, 'Fantasy', 'Mariner Books', 1937),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 4, 'Fiction', 'Little, Brown and Company', 1951),
('Lord of the Flies', 'William Golding', '9780399501487', 3, 'Fiction', 'Penguin Books', 1954),
('Animal Farm', 'George Orwell', '9780451526342', 5, 'Political Fiction', 'Signet', 1945),
('The Alchemist', 'Paulo Coelho', '9780062315007', 6, 'Fiction', 'HarperOne', 1988),
('Brave New World', 'Aldous Huxley', '9780060850524', 4, 'Science Fiction', 'Harper Perennial', 1932),
('The Art of War', 'Sun Tzu', '9780140439199', 3, 'Non-Fiction', 'Penguin Classics', -500),
('A Brief History of Time', 'Stephen Hawking', '9780553380163', 4, 'Science', 'Bantam', 1988),
('The Psychology of Money', 'Morgan Housel', '9780857197689', 5, 'Business', 'Harriman House', 2020),
('Clean Code', 'Robert C. Martin', '9780132350884', 6, 'Technology', 'Prentice Hall', 2008),
('Design Patterns', 'Erich Gamma', '9780201633610', 4, 'Technology', 'Addison-Wesley', 1994),
('The Lean Startup', 'Eric Ries', '9780307887894', 3, 'Business', 'Crown Business', 2011),
('Sapiens', 'Yuval Noah Harari', '9780062316097', 5, 'History', 'Harper', 2014),
('The Power of Habit', 'Charles Duhigg', '9780812981605', 4, 'Self-Help', 'Random House', 2012),
('Atomic Habits', 'James Clear', '9780735211292', 6, 'Self-Help', 'Avery', 2018),
('The 7 Habits of Highly Effective People', 'Stephen Covey', '9780743269513', 4, 'Self-Help', 'Free Press', 1989);

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
(2, 2, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '1 day', 'issued'),
(3, 3, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'issued'),
(4, 4, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '2 days', 'issued'),
(5, 5, CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '22 days', 'issued'); 