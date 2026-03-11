import { Investment, CreateInvestmentDto, InvestmentAnalysis } from '../../shared/types';
export declare class InvestmentsService {
    create(userId: string, dto: CreateInvestmentDto): {
        investment: Investment;
        analysis: InvestmentAnalysis;
    };
    getAllByUser(userId: string): {
        investment: Investment;
        analysis: InvestmentAnalysis;
    }[];
    getById(id: string, userId: string): {
        investment: Investment;
        analysis: InvestmentAnalysis;
    };
    delete(id: string, userId: string): void;
    private analyze;
}
export declare const investmentsService: InvestmentsService;
//# sourceMappingURL=investments.service.d.ts.map