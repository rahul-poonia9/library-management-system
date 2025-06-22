import { pool } from '../config/database.js';

export class BookIssueModel {
  static async getAll(filters = {}) {
    let query = `
      WITH issues_with_status AS (
        SELECT 
          bi.*,
          b.title as book_name,
          s.name as student_name,
          CASE
            WHEN bi.status = 'issued' AND bi.due_date < CURRENT_TIMESTAMP THEN 'overdue'
            ELSE bi.status
          END as current_status,
          json_build_object(
            'id', b.id,
            'title', b.title,
            'author', b.author,
            'isbn', b.isbn,
            'quantity', b.quantity,
            'category', b.category,
            'shelf_location', b.shelf_location,
            'created_at', b.created_at,
            'updated_at', b.updated_at
          ) as book,
          json_build_object(
            'id', s.id,
            'name', s.name,
            'email', s.email,
            'department', s.department,
            'roll_number', s.roll_number,
            'semester', s.semester,
            'created_at', s.created_at,
            'updated_at', s.updated_at
          ) as student
        FROM book_issues bi 
        JOIN books b ON bi.book_id = b.id 
        JOIN students s ON bi.student_id = s.id
      )
      SELECT * FROM issues_with_status
    `;
    
    const values = [];
    const conditions = [];

    if (filters.book_name) {
      values.push(`%${filters.book_name}%`);
      conditions.push(`book_name ILIKE $${values.length}`);
    }
    if (filters.student_name) {
      values.push(`%${filters.student_name}%`);
      conditions.push(`student_name ILIKE $${values.length}`);
    }
    if (filters.status && filters.status !== 'all') {
      values.push(filters.status);
      conditions.push(`current_status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';

    console.log('Executing query:', query);
    console.log('With values:', values);

    const result = await pool.query(query, values);
    // Aliasing current_status back to status for frontend consistency
    return result.rows.map(row => {
      row.status = row.current_status;
      delete row.current_status;
      return row;
    });
  }

  static async getById(id) {
    const result = await pool.query(`
      SELECT 
        bi.*,
        CASE
          WHEN bi.status = 'issued' AND bi.due_date < CURRENT_TIMESTAMP THEN 'overdue'
          ELSE bi.status
        END as status,
        json_build_object(
          'id', b.id,
          'title', b.title,
          'author', b.author,
          'isbn', b.isbn,
          'quantity', b.quantity,
          'category', b.category,
          'shelf_location', b.shelf_location,
          'created_at', b.created_at,
          'updated_at', b.updated_at
        ) as book,
        json_build_object(
          'id', s.id,
          'name', s.name,
          'email', s.email,
          'department', s.department,
          'roll_number', s.roll_number,
          'semester', s.semester,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) as student
      FROM book_issues bi 
      JOIN books b ON bi.book_id = b.id 
      JOIN students s ON bi.student_id = s.id 
      WHERE bi.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async create(bookIssue) {
    const { book_id, student_id, issue_date, due_date } = bookIssue;
    
    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check book availability
      const bookResult = await client.query('SELECT quantity FROM books WHERE id = $1 FOR UPDATE', [book_id]);
      if (!bookResult.rows[0] || bookResult.rows[0].quantity <= 0) {
        throw new Error('Book not available');
      }

      // Decrease book quantity
      await client.query('UPDATE books SET quantity = quantity - 1 WHERE id = $1', [book_id]);

      // Create issue record
      const result = await client.query(
        `INSERT INTO book_issues 
         (book_id, student_id, issue_date, due_date, status) 
         VALUES ($1, $2, $3, $4, 'issued') 
         RETURNING *`,
        [book_id, student_id, issue_date, due_date]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async returnBook(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update issue record
      const result = await client.query(
        `UPDATE book_issues 
         SET return_date = CURRENT_TIMESTAMP, 
             status = 'returned',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 
         RETURNING *`,
        [id]
      );

      if (!result.rows[0]) {
        throw new Error('Issue record not found');
      }

      // Increase book quantity
      await client.query(
        'UPDATE books SET quantity = quantity + 1 WHERE id = $1',
        [result.rows[0].book_id]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getByStudent(studentId) {
    const result = await pool.query(`
      SELECT 
        bi.*,
        CASE
          WHEN bi.status = 'issued' AND bi.due_date < CURRENT_TIMESTAMP THEN 'overdue'
          ELSE bi.status
        END as status,
        json_build_object(
          'id', b.id,
          'title', b.title,
          'author', b.author,
          'isbn', b.isbn,
          'quantity', b.quantity,
          'category', b.category,
          'shelf_location', b.shelf_location,
          'created_at', b.created_at,
          'updated_at', b.updated_at
        ) as book,
        json_build_object(
          'id', s.id,
          'name', s.name,
          'email', s.email,
          'department', s.department,
          'roll_number', s.roll_number,
          'semester', s.semester,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) as student
      FROM book_issues bi 
      JOIN books b ON bi.book_id = b.id 
      JOIN students s ON bi.student_id = s.id 
      WHERE bi.student_id = $1
      ORDER BY bi.created_at DESC
    `, [studentId]);
    return result.rows;
  }

  static async getByBook(bookId) {
    const result = await pool.query(`
      SELECT 
        bi.*,
        CASE
          WHEN bi.status = 'issued' AND bi.due_date < CURRENT_TIMESTAMP THEN 'overdue'
          ELSE bi.status
        END as status,
        json_build_object(
          'id', b.id,
          'title', b.title,
          'author', b.author,
          'isbn', b.isbn,
          'quantity', b.quantity,
          'category', b.category,
          'shelf_location', b.shelf_location,
          'created_at', b.created_at,
          'updated_at', b.updated_at
        ) as book,
        json_build_object(
          'id', s.id,
          'name', s.name,
          'email', s.email,
          'department', s.department,
          'roll_number', s.roll_number,
          'semester', s.semester,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) as student
      FROM book_issues bi 
      JOIN books b ON bi.book_id = b.id 
      JOIN students s ON bi.student_id = s.id 
      WHERE bi.book_id = $1
      ORDER BY bi.created_at DESC
    `, [bookId]);
    return result.rows;
  }

  static async getOverdue() {
    const result = await pool.query(`
      SELECT 
        bi.*,
        CASE
          WHEN bi.status = 'issued' AND bi.due_date < CURRENT_TIMESTAMP THEN 'overdue'
          ELSE bi.status
        END as status,
        json_build_object(
          'id', b.id,
          'title', b.title,
          'author', b.author,
          'isbn', b.isbn,
          'quantity', b.quantity,
          'category', b.category,
          'shelf_location', b.shelf_location,
          'created_at', b.created_at,
          'updated_at', b.updated_at
        ) as book,
        json_build_object(
          'id', s.id,
          'name', s.name,
          'email', s.email,
          'department', s.department,
          'roll_number', s.roll_number,
          'semester', s.semester,
          'created_at', s.created_at,
          'updated_at', s.updated_at
        ) as student
      FROM book_issues bi 
      JOIN books b ON bi.book_id = b.id 
      JOIN students s ON bi.student_id = s.id 
      WHERE (bi.status = 'overdue' OR (bi.status = 'issued' AND bi.due_date < CURRENT_TIMESTAMP))
      ORDER BY bi.due_date ASC
    `);
    return result.rows;
  }
} 