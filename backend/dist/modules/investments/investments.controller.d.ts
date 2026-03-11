import { Request, Response, NextFunction } from 'express';
export declare class InvestmentsController {
    create(req: Request, res: Response, next: NextFunction): void;
    getAll(req: Request, res: Response, next: NextFunction): void;
    getById(req: Request, res: Response, next: NextFunction): void;
    delete(req: Request, res: Response, next: NextFunction): void;
}
export declare const investmentsController: InvestmentsController;
//# sourceMappingURL=investments.controller.d.ts.map