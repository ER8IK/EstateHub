import { Request, Response, NextFunction } from 'express';
export declare class PropertiesController {
    getPublic(req: Request, res: Response, next: NextFunction): void;
    getByIdPublic(req: Request, res: Response, next: NextFunction): void;
    create(req: Request, res: Response, next: NextFunction): void;
    getAll(req: Request, res: Response, next: NextFunction): void;
    getById(req: Request, res: Response, next: NextFunction): void;
    update(req: Request, res: Response, next: NextFunction): void;
    delete(req: Request, res: Response, next: NextFunction): void;
}
export declare const propertiesController: PropertiesController;
//# sourceMappingURL=properties.controller.d.ts.map