import { AdminModel } from '../models/AdminModel.js';

export class AuthController {
  constructor(pool) {
    this.adminModel = new AdminModel(pool);
  }

  register = async (req, res) => {
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

  login = async (req, res) => {
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

  getCurrentUser = async (req, res) => {
    try {
      // The user ID is attached to the request by the auth middleware
      const admin = await this.adminModel.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Remove sensitive information
      delete admin.password;

      res.json(admin);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Error getting user information' });
    }
  };

  logout = async (req, res) => {
    try {
      // In a JWT-based system, we don't need to do anything on the server
      // The client will remove the token
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Error during logout' });
    }
  };
} 