import { Request, Response, NextFunction } from 'express';
import { investmentsService } from './investments.service';
import { CreateInvestmentDto } from '../../shared/types';

export class InvestmentsController {

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const dto: CreateInvestmentDto = req.body;

      if (
        !dto.propertyId ||
        !dto.purchasePrice ||
        !dto.downPayment ||
        !dto.expectedRentPerMonth ||
        dto.expenses === undefined
      ) {
        res.status(400).json({
          success: false,
          message: 'propertyId, purchasePrice, downPayment, expectedRentPerMonth and expenses are required',
        });
        return;
      }

      const result = investmentsService.create(userId, dto);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const investments = investmentsService.getAllByUser(userId);

      res.status(200).json({
        success: true,
        data: investments,
      });
    } catch (error) {
      next(error);
    }
  }

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid id parameter',
        });
        return;
      }

      const result = investmentsService.getById(id, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  delete(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Invalid id parameter',
        });
        return;
      }

      investmentsService.delete(id, userId);

      res.status(200).json({
        success: true,
        message: 'Investment deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const investmentsController = new InvestmentsController();