import { Investment, CreateInvestmentDto, InvestmentAnalysis } from '../../shared/types';
import { AppError } from '../../shared/middleware/error.middleware';
import { generateId } from '../../shared/utils/id.utils';
import {
  calculateMonthlyMortgage,
  calculateROI,
  calculatePayback
} from '../../shared/utils/mortgage.utils';
import { propertiesService } from '../properties/properties.service';


const investments: Investment[] = [];

export class InvestmentsService {

  create(userId: string, dto: CreateInvestmentDto): {
    investment: Investment;
    analysis: InvestmentAnalysis;
  } {
    const property = propertiesService.getByIdInternal(dto.propertyId);
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    if (dto.downPayment >= dto.purchasePrice) {
      throw new AppError('Down payment cannot exceed purchase price', 400);
    }

    
    const investment: Investment = {
      id: generateId(),
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

  getAllByUser(userId: string): {
    investment: Investment;
    analysis: InvestmentAnalysis;
  }[] {
    return investments
      .filter(i => i.userId === userId)
      .map(investment => ({
        investment,
        analysis: this.analyze(investment),
      }));
  }

  getById(id: string, userId: string): {
    investment: Investment;
    analysis: InvestmentAnalysis;
  } {
    const investment = investments.find(i => i.id === id);

    if (!investment) {
      throw new AppError('Investment not found', 404);
    }
    if (investment.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return { investment, analysis: this.analyze(investment) };
  }

  delete(id: string, userId: string): void {
    const { investment } = this.getById(id, userId);
    const index = investments.indexOf(investment);
    investments.splice(index, 1);
  }

  private analyze(investment: Investment): InvestmentAnalysis {
    const monthlyMortgagePayment =
      investment.mortgageRate && investment.mortgageTerm
        ? calculateMonthlyMortgage(
            investment.purchasePrice,
            investment.downPayment,
            investment.mortgageRate,
            investment.mortgageTerm
          )
        : 0;

    
    const monthlyCashFlow =
      investment.expectedRentPerMonth -
      investment.expenses -
      monthlyMortgagePayment;

    const annualROI = calculateROI(
      investment.expectedRentPerMonth * 12,  
      (investment.expenses + monthlyMortgagePayment) * 12, 
      investment.downPayment                 
    );

    const paybackYears = calculatePayback(
      investment.downPayment,
      monthlyCashFlow
    );

    return {
      monthlyMortgagePayment,
      monthlyCashFlow,
      annualROI,
      paybackYears,
    };
  }
}

export const investmentsService = new InvestmentsService();