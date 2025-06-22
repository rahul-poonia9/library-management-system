import { pool } from '../config/database.js';

export class DashboardController {
  static async getStatistics(req, res) {
    try {
      // Get total books
      const booksResult = await pool.query('SELECT COUNT(*) as count FROM books');
      const totalBooks = parseInt(booksResult.rows[0].count);

      // Get total students
      const studentsResult = await pool.query('SELECT COUNT(*) as count FROM students');
      const totalStudents = parseInt(studentsResult.rows[0].count);

      // Get active issues (issued books)
      const activeIssuesResult = await pool.query(`
        SELECT COUNT(*) as count 
        FROM book_issues 
        WHERE status = 'issued'
      `);
      const activeIssues = parseInt(activeIssuesResult.rows[0].count);

      // Get overdue books
      const overdueResult = await pool.query(`
        SELECT COUNT(*) as count 
        FROM book_issues 
        WHERE status = 'issued' AND due_date < CURRENT_TIMESTAMP
      `);
      const overdueBooks = parseInt(overdueResult.rows[0].count);

      // Get returned books (this month)
      const returnedResult = await pool.query(`
        SELECT COUNT(*) as count 
        FROM book_issues 
        WHERE status = 'returned' 
        AND return_date >= DATE_TRUNC('month', CURRENT_DATE)
      `);
      const returnedBooks = parseInt(returnedResult.rows[0].count);

      res.json({
        success: true,
        data: {
          totalBooks,
          totalStudents,
          activeIssues,
          overdueBooks,
          returnedBooks
        }
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({ success: false, message: 'Error getting statistics' });
    }
  }

  static async getBookCategories(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          category as name,
          COUNT(*) as count
        FROM books 
        GROUP BY category 
        ORDER BY count DESC
      `);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error getting book categories:', error);
      res.status(500).json({ success: false, message: 'Error getting book categories' });
    }
  }

  static async getDailyActivity(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          TO_CHAR(issue_date, 'Mon DD') as date,
          COUNT(CASE WHEN status = 'issued' THEN 1 END) as issued,
          COUNT(CASE WHEN status = 'returned' THEN 1 END) as returned
        FROM book_issues 
        WHERE issue_date >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY DATE(issue_date)
        ORDER BY issue_date
      `);

      // Fill in missing days with zero values
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const existingData = result.rows.find(row => row.date === dateStr);
        days.push({
          date: dateStr,
          issued: existingData ? parseInt(existingData.issued) : 0,
          returned: existingData ? parseInt(existingData.returned) : 0
        });
      }

      res.json({
        success: true,
        data: days
      });
    } catch (error) {
      console.error('Error getting daily activity:', error);
      res.status(500).json({ success: false, message: 'Error getting daily activity' });
    }
  }

  static async getRecentActivity(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          bi.id,
          CASE 
            WHEN bi.status = 'returned' THEN 'Book Returned'
            WHEN bi.status = 'issued' AND bi.due_date < CURRENT_TIMESTAMP THEN 'Book Overdue'
            ELSE 'Book Issued'
          END as action,
          bi.issue_date as date,
          json_build_object(
            'id', b.id,
            'title', b.title
          ) as book,
          json_build_object(
            'id', s.id,
            'name', s.name
          ) as student
        FROM book_issues bi
        JOIN books b ON bi.book_id = b.id
        JOIN students s ON bi.student_id = s.id
        ORDER BY bi.created_at DESC
        LIMIT 10
      `);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error getting recent activity:', error);
      res.status(500).json({ success: false, message: 'Error getting recent activity' });
    }
  }

  static async getDepartmentStats(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          s.department,
          COUNT(bi.id) as issues
        FROM book_issues bi
        JOIN students s ON bi.student_id = s.id
        WHERE bi.status = 'issued'
        GROUP BY s.department
        ORDER BY issues DESC
      `);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error getting department stats:', error);
      res.status(500).json({ success: false, message: 'Error getting department stats' });
    }
  }

  static async getOverdueBooks(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          bi.id,
          b.title,
          bi.due_date as dueDate,
          json_build_object(
            'id', s.id,
            'name', s.name
          ) as student
        FROM book_issues bi
        JOIN books b ON bi.book_id = b.id
        JOIN students s ON bi.student_id = s.id
        WHERE bi.status = 'issued' AND bi.due_date < CURRENT_TIMESTAMP
        ORDER BY bi.due_date ASC
        LIMIT 10
      `);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error getting overdue books:', error);
      res.status(500).json({ success: false, message: 'Error getting overdue books' });
    }
  }
} 