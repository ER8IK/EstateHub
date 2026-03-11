import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';

export class UsersController {

  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const users = usersService.getAll();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid or missing id parameter',
        });
        return;
      }
      
      const user = usersService.getById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  getMe(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId; 
      const user = usersService.getById(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();