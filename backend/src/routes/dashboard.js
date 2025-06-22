import express from 'express';
import { DashboardController } from '../controllers/DashboardController.js';

const router = express.Router();

// Dashboard statistics
router.get('/statistics', DashboardController.getStatistics);

// Book categories distribution
router.get('/book-categories', DashboardController.getBookCategories);

// Daily activity trend
router.get('/daily-activity', DashboardController.getDailyActivity);

// Recent activity
router.get('/recent-activity', DashboardController.getRecentActivity);

// Department statistics
router.get('/department-stats', DashboardController.getDepartmentStats);

// Overdue books
router.get('/overdue-books', DashboardController.getOverdueBooks);

export default router; 