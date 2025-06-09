# 📚 Library Management System

A modern, easy-to-use library management system built with React and Node.js. This system helps librarians manage books, student records, and book lending efficiently.

## 🌟 Features

- **Book Management**
  - Add and manage books in the library
  - Track book quantities and availability
  - Search books by title, author, or ISBN
  - View book lending history

- **Student Management**
  - Register and manage student records
  - Track student borrowing history
  - Manage student departments and semesters

- **Book Lending**
  - Issue books to students
  - Track due dates and return status
  - Automatic overdue detection
  - Send reminder notifications for overdue books

- **Dashboard**
  - Real-time overview of library statistics
  - Track total books, students, and active loans
  - Monitor overdue books
  - View recent activities

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd library-management-system
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file with the following:
   ```env
   PORT=5000
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=library_db
   ```

3. **Set up the Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Initialize the Database**
   ```bash
   cd backend
   npm run migrate
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on http://localhost:5000

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will open in your browser at http://localhost:5173

## 💡 Usage

1. **Managing Books**
   - Click on "Books" in the sidebar
   - Use the "Add Book" button to add new books
   - Edit or delete books using the action buttons
   - Search books using the search bar

2. **Managing Students**
   - Navigate to "Students" section
   - Add new students with their details
   - View and edit student information
   - Search students by name or roll number

3. **Issuing Books**
   - Go to "Issue Books" section
   - Select a book and student
   - Set the due date
   - Confirm the issue

4. **Handling Returns**
   - Find the book issue in the list
   - Click "Return Book" to process the return
   - The system will automatically update book availability

5. **Monitoring Overdues**
   - Check the dashboard for overdue books
   - Use the "Send Reminder" button to notify students
   - Track overdue status in real-time

## 🔧 Technical Details

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL
- **Authentication**: JWT-based auth system
- **Real-time Updates**: React Query
- **UI Components**: Custom components with Shadcn UI

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or need help, please:
1. Check the existing issues in the repository
2. Create a new issue with detailed information about your problem
3. Contact the development team

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries 