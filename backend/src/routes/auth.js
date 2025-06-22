import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
// import { authenticateAdmin } from '../middleware/authMiddleware.js'; // Uncomment if needed

const router = express.Router();
const authController = new AuthController(pool);

// Admin registration route
router.post('/register', authController.register);

// Admin login route
router.post('/login', authController.login);

// Get current user route (protected)
router.get('/me', authenticateToken, authController.getCurrentUser);

// Logout route
router.post('/logout', authenticateToken, authController.logout);

export default router; 