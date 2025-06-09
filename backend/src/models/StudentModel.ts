import { pool } from '../config/database';
import { Student } from '../types';

export class StudentModel {
  static async getAll() {
    const result = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
    return result.rows;
  }

  static async getById(id: number) {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
    const { name, email, department, roll_number, semester } = student;
    const result = await pool.query(
      'INSERT INTO students (name, email, department, roll_number, semester) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, department, roll_number, semester]
    );
    return result.rows[0];
  }

  static async update(id: number, student: Partial<Student>) {
    const { name, email, department, roll_number, semester } = student;
    const result = await pool.query(
      `UPDATE students 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           department = COALESCE($3, department),
           roll_number = COALESCE($4, roll_number),
           semester = COALESCE($5, semester),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [name, email, department, roll_number, semester, id]
    );
    return result.rows[0];
  }

  static async delete(id: number) {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async search(query: string) {
    const result = await pool.query(
      `SELECT * FROM students 
       WHERE name ILIKE $1 
       OR email ILIKE $1 
       OR department ILIKE $1 
       OR roll_number ILIKE $1`,
      [`%${query}%`]
    );
    return result.rows;
  }

  static async getByDepartment(department: string) {
    const result = await pool.query('SELECT * FROM students WHERE department = $1', [department]);
    return result.rows;
  }

  static async getBySemester(semester: number) {
    const result = await pool.query('SELECT * FROM students WHERE semester = $1', [semester]);
    return result.rows;
  }
} 