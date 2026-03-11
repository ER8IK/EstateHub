

export const calculateMonthlyMortgage = (
    purchasePrice: number,
    downPayment: number,
    annualRate: number,
    termYears: number
): number => {
    const principal = purchasePrice - downPayment;
    const monthlyRate = annualRate / 100 / 12;
    const months = termYears * 12;

    if (monthlyRate === 0) return principal / months;

    const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(payment * 100) / 100; 
};

export const calculateROI = (
    annualIncome: number,
    annualExpenses: number,
    investedAmount: number
): number => {
    const annualProfit = annualIncome - annualExpenses;
    const roi = (annualProfit / investedAmount) * 100;
    return Math.round(roi * 100) / 100;
};

export const calculatePayback = (
    investedAmount: number,
    monthlyProfit: number
): number => {
    if (monthlyProfit <= 0) return Infinity;
    return Math.round((investedAmount / (monthlyProfit * 12)) * 10) / 10;
}