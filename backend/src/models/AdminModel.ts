import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  last_login: Date;
}

export class AdminModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createAdmin(username: string, email: string, password: string): Promise<Omit<Admin, 'password'>> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.pool.query(
      `INSERT INTO admins (username, email, password, created_at, last_login)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, username, email, created_at, last_login`,
      [username, email, hashedPassword]
    );
    return result.rows[0];
  }

  async validateCredentials(email: string, password: string): Promise<Omit<Admin, 'password'> | null> {
    const result = await this.pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    const admin = result.rows[0];
    if (!admin) return null;

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return null;

    // Update last login
    await this.pool.query(
      'UPDATE admins SET last_login = NOW() WHERE id = $1',
      [admin.id]
    );

    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  async generateToken(admin: Omit<Admin, 'password'>): Promise<string> {
    return jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  async findByEmail(email: string): Promise<Omit<Admin, 'password'> | null> {
    const result = await this.pool.query(
      'SELECT id, username, email, created_at, last_login FROM admins WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }
} 