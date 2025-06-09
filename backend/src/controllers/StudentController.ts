import { Request, Response } from 'express';
import { StudentModel } from '../models/StudentModel';
import { handleError, ApiError } from '../utils/errorHandler';

export class StudentController {
  static async getAll(req: Request, res: Response) {
    try {
      const students = await StudentModel.getAll();
      res.json({ success: true, data: students });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const student = await StudentModel.getById(parseInt(req.params.id));
      if (!student) {
        throw new ApiError('Student not found', 404);
      }
      res.json({ success: true, data: student });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const student = await StudentModel.create(req.body);
      res.status(201).json({ success: true, data: student });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const student = await StudentModel.update(parseInt(req.params.id), req.body);
      if (!student) {
        throw new ApiError('Student not found', 404);
      }
      res.json({ success: true, data: student });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const student = await StudentModel.delete(parseInt(req.params.id));
      if (!student) {
        throw new ApiError('Student not found', 404);
      }
      res.json({ success: true, data: student });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        throw new ApiError('Search query is required', 400);
      }
      const students = await StudentModel.search(query);
      res.json({ success: true, data: students });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getByDepartment(req: Request, res: Response) {
    try {
      const { department } = req.params;
      const students = await StudentModel.getByDepartment(department);
      res.json({ success: true, data: students });
    } catch (error) {
      handleError(error, res);
    }
  }

  static async getBySemester(req: Request, res: Response) {
    try {
      const semester = parseInt(req.params.semester);
      if (isNaN(semester)) {
        throw new ApiError('Invalid semester', 400);
      }
      const students = await StudentModel.getBySemester(semester);
      res.json({ success: true, data: students });
    } catch (error) {
      handleError(error, res);
    }
  }
} 