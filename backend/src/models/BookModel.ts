import { pool } from '../config/database';
import { Book } from '../types';

export class BookModel {
  static async getAll() {
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    return result.rows;
  }

  static async getById(id: number) {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) {
    const { title, author, isbn, quantity, category, shelf_location } = book;
    const result = await pool.query(
      `INSERT INTO books (
        title, author, isbn, quantity, category, shelf_location
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, author, isbn, quantity || 1, category, shelf_location]
    );
    return result.rows[0];
  }

  static async update(id: number, book: Partial<Book>) {
    const { title, author, isbn, quantity, category, shelf_location } = book;
    const result = await pool.query(
      `UPDATE books 
       SET title = COALESCE($1, title),
           author = COALESCE($2, author),
           isbn = COALESCE($3, isbn),
           quantity = COALESCE($4, quantity),
           category = COALESCE($5, category),
           shelf_location = COALESCE($6, shelf_location),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [title, author, isbn, quantity, category, shelf_location, id]
    );
    return result.rows[0];
  }

  static async delete(id: number) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check for existing book issues
      const issuesResult = await client.query(
        'SELECT COUNT(*) FROM book_issues WHERE book_id = $1 AND status = \'issued\'',
        [id]
      );
      
      if (parseInt(issuesResult.rows[0].count) > 0) {
        throw new Error('Cannot delete book: There are active issues for this book');
      }

      // If no active issues, proceed with deletion
      const result = await client.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async search(query: string) {
    const result = await pool.query(
      `SELECT * FROM books 
       WHERE title ILIKE $1 
       OR author ILIKE $1 
       OR isbn ILIKE $1 
       OR category ILIKE $1`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async getAvailableBooks() {
    const result = await pool.query('SELECT * FROM books WHERE quantity > 0');
    return result.rows;
  }
} 