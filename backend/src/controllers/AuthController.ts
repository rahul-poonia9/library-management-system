import { Request, Response } from 'express';
import { AdminModel } from '../models/AdminModel';
import { Pool } from 'pg';

export class AuthController {
  private adminModel: AdminModel;

  constructor(pool: Pool) {
    this.adminModel = new AdminModel(pool);
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if admin already exists
      const existingAdmin = await this.adminModel.findByEmail(email);
      if (existingAdmin) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new admin
      const admin = await this.adminModel.createAdmin(username, email, password);
      const token = await this.adminModel.generateToken(admin);

      res.status(201).json({
        message: 'Admin registered successfully',
        admin,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering admin' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Validate credentials
      const admin = await this.adminModel.validateCredentials(email, password);
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = await this.adminModel.generateToken(admin);

      res.json({
        message: 'Login successful',
        admin,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  };
} 