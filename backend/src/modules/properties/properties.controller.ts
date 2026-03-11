import { Request, Response, NextFunction } from 'express';
import { propertiesService } from './properties.service';
import { CreatePropertyDto, PropertyFilters } from '../../shared/types';

export class PropertiesController {

  
  getPublic(req: Request, res: Response, next: NextFunction): void {
    try {
      const filters: PropertyFilters = {
        type: req.query.type as any,
        status: req.query.status as any,
        city: req.query.city as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      };
      const properties = propertiesService.getPublic(filters);
      res.status(200).json({ success: true, data: properties });
    } catch (error) {
      next(error);
    }
  }

  getByIdPublic(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const property = propertiesService.getByIdPublic(id as string);
      res.status(200).json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  }

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const dto: CreatePropertyDto = req.body;
      if (!dto.title || !dto.type || !dto.status || !dto.city || !dto.address || !dto.price || !dto.area) {
        res.status(400).json({ success: false, message: 'Заполните все обязательные поля' });
        return;
      }
      const property = propertiesService.create(userId, dto);
      res.status(201).json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  }

  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const properties = propertiesService.getAllByUser(userId);
      res.status(200).json({ success: true, data: properties });
    } catch (error) {
      next(error);
    }
  }

  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const property = propertiesService.getById(id as string, userId);
      res.status(200).json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  }

  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const property = propertiesService.update(id as string, userId, req.body);
      res.status(200).json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  }

  delete(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      propertiesService.delete(id as string, userId);
      res.status(200).json({ success: true, message: 'Удалено' });
    } catch (error) {
      next(error);
    }
  }
}

export const propertiesController = new PropertiesController();