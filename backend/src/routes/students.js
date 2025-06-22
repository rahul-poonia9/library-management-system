import { Router } from 'express';
import { StudentController } from '../controllers/StudentController.js';
import { studentValidation } from '../middleware/validation.js';

const router = Router();

// Get all students
router.get('/', StudentController.getAll);

// Search students
router.get('/search', studentValidation.search, StudentController.search);

// Get students by department
router.get('/department/:department', StudentController.getByDepartment);

// Get students by semester
router.get('/semester/:semester', StudentController.getBySemester);

// Get student by ID
router.get('/:id', StudentController.getById);

// Create new student
router.post('/', studentValidation.create, StudentController.create);

// Update student
router.put('/:id', studentValidation.update, StudentController.update);

// Delete student
router.delete('/:id', StudentController.delete);

export default router; 