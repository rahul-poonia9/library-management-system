import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { pool } from '../config/database';

const router = express.Router();
const authController = new AuthController(pool);

// Admin registration route
router.post('/register', authController.register);

// Admin login route
router.post('/login', authController.login);

export default router; 