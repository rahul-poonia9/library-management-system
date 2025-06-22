import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AdminModel {
  constructor(pool) {
    this.pool = pool;
  }

  async createAdmin(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.pool.query(
      `INSERT INTO admins (username, email, password, created_at, last_login)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, username, email, created_at, last_login`,
      [username, email, hashedPassword]
    );
    return result.rows[0];
  }

  async validateCredentials(email, password) {
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

  async generateToken(admin) {
    return jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  async findByEmail(email) {
    const result = await this.pool.query(
      'SELECT id, username, email, created_at, last_login FROM admins WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findById(id) {
    const result = await this.pool.query(
      'SELECT id, username, email, created_at, last_login FROM admins WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
} 