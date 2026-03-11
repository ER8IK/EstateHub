"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.investmentsService = exports.InvestmentsService = void 0;
const error_middleware_1 = require("../../shared/middleware/error.middleware");
const id_utils_1 = require("../../shared/utils/id.utils");
const mortgage_utils_1 = require("../../shared/utils/mortgage.utils");
const properties_service_1 = require("../properties/properties.service");
const investments = [];
class InvestmentsService {
    create(userId, dto) {
        const property = properties_service_1.propertiesService.getByIdInternal(dto.propertyId);
        if (!property) {
            throw new error_middleware_1.AppError('Property not found', 404);
        }
        if (dto.downPayment >= dto.purchasePrice) {
            throw new error_middleware_1.AppError('Down payment cannot exceed purchase price', 400);
        }
        const investment = {
            id: (0, id_utils_1.generateId)(),
            userId,
            propertyId: dto.propertyId,
            purchasePrice: dto.purchasePrice,
            downPayment: dto.downPayment,
            mortgageRate: dto.mortgageRate,
            mortgageTerm: dto.mortgageTerm,
            expectedRentPerMonth: dto.expectedRentPerMonth,
            expenses: dto.expenses,
            createdAt: new Date(),
        };
        investments.push(investment);
        const analysis = this.analyze(investment);
        return { investment, analysis };
    }
    getAllByUser(userId) {
        return investments
            .filter(i => i.userId === userId)
            .map(investment => ({
            investment,
            analysis: this.analyze(investment),
        }));
    }
    getById(id, userId) {
        const investment = investments.find(i => i.id === id);
        if (!investment) {
            throw new error_middleware_1.AppError('Investment not found', 404);
        }
        if (investment.userId !== userId) {
            throw new error_middleware_1.AppError('Access denied', 403);
        }
        return { investment, analysis: this.analyze(investment) };
    }
    delete(id, userId) {
        const { investment } = this.getById(id, userId);
        const index = investments.indexOf(investment);
        investments.splice(index, 1);
    }
    analyze(investment) {
        const monthlyMortgagePayment = investment.mortgageRate && investment.mortgageTerm
            ? (0, mortgage_utils_1.calculateMonthlyMortgage)(investment.purchasePrice, investment.downPayment, investment.mortgageRate, investment.mortgageTerm)
            : 0;
        const monthlyCashFlow = investment.expectedRentPerMonth -
            investment.expenses -
            monthlyMortgagePayment;
        const annualROI = (0, mortgage_utils_1.calculateROI)(investment.expectedRentPerMonth * 12, (investment.expenses + monthlyMortgagePayment) * 12, investment.downPayment);
        const paybackYears = (0, mortgage_utils_1.calculatePayback)(investment.downPayment, monthlyCashFlow);
        return {
            monthlyMortgagePayment,
            monthlyCashFlow,
            annualROI,
            paybackYears,
        };
    }
}
exports.InvestmentsService = InvestmentsService;
exports.investmentsService = new InvestmentsService();
//# sourceMappingURL=investments.service.js.map