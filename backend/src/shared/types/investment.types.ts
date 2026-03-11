export interface Investment {
    id: string;
    userId: string;
    propertyId: string;
    purchasePrice: number;
    downPayment: number;
    mortgageRate?: number | undefined;
    mortgageTerm?: number | undefined;
    expectedRentPerMonth: number;
    expenses: number;
    createdAt: Date;
}

export interface InvestmentAnalysis {
    monthlyMortgagePayment: number;
    monthlyCashFlow: number;
    annualROI: number;
    paybackYears: number;
}

export interface CreateInvestmentDto {
    propertyId: string;
    purchasePrice: number;
    downPayment: number;
    mortgageRate?: number;
    mortgageTerm?: number;
    expectedRentPerMonth: number;
    expenses: number;
}