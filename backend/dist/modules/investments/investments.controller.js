"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investmentsController = exports.InvestmentsController = void 0;
const investments_service_1 = require("./investments.service");
class InvestmentsController {
    create(req, res, next) {
        try {
            const userId = req.user.userId;
            const dto = req.body;
            if (!dto.propertyId ||
                !dto.purchasePrice ||
                !dto.downPayment ||
                !dto.expectedRentPerMonth ||
                dto.expenses === undefined) {
                res.status(400).json({
                    success: false,
                    message: 'propertyId, purchasePrice, downPayment, expectedRentPerMonth and expenses are required',
                });
                return;
            }
            const result = investments_service_1.investmentsService.create(userId, dto);
            res.status(201).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    getAll(req, res, next) {
        try {
            const userId = req.user.userId;
            const investments = investments_service_1.investmentsService.getAllByUser(userId);
            res.status(200).json({
                success: true,
                data: investments,
            });
        }
        catch (error) {
            next(error);
        }
    }
    getById(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid id parameter',
                });
                return;
            }
            const result = investments_service_1.investmentsService.getById(id, userId);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    delete(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid id parameter',
                });
                return;
            }
            investments_service_1.investmentsService.delete(id, userId);
            res.status(200).json({
                success: true,
                message: 'Investment deleted',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InvestmentsController = InvestmentsController;
exports.investmentsController = new InvestmentsController();
//# sourceMappingURL=investments.controller.js.map