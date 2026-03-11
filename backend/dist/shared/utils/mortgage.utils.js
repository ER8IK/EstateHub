export const calculateMonthlyMortgage = (purchasePrice, downPayment, annualRate, termYears) => {
    const principal = purchasePrice - downPayment;
    const monthlyRate = annualRate / 100 / 12;
    const months = termYears * 12;
    if (monthlyRate === 0)
        return principal / months;
    const payment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment * 100) / 100;
};
export const calculateROI = (annualIncome, annualExpenses, investedAmount) => {
    const annualProfit = annualIncome - annualExpenses;
    const roi = (annualProfit / investedAmount) * 100;
    return Math.round(roi * 100) / 100;
};
export const calculatePayback = (investedAmount, monthlyProfit) => {
    if (monthlyProfit <= 0)
        return Infinity;
    return Math.round((investedAmount / (monthlyProfit * 12)) * 10) / 10;
};
//# sourceMappingURL=mortgage.utils.js.map