'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Home,
  Trash2,
} from 'lucide-react';
import { InvestmentWithAnalysis } from '@/lib/api/investments.api';

interface InvestmentAnalysisProps {
  data: InvestmentWithAnalysis;
  onDelete: (id: string) => void;
}

export default function InvestmentAnalysisCard({
  data,
  onDelete,
}: InvestmentAnalysisProps) {
  const { investment, analysis } = data;
  const isPositive = analysis.annualROI >= 0;
  const isCashFlowPositive = analysis.monthlyCashFlow >= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4 text-slate-400" />
            <span className="text-white font-semibold">
              {investment.purchasePrice.toLocaleString('ru')} ₽
            </span>
          </div>
          <div className="text-slate-500 text-sm">
            Взнос: {investment.downPayment.toLocaleString('ru')} ₽
            {investment.mortgageRate && (
              <span className="ml-2">
                · Ипотека {investment.mortgageRate}% на {investment.mortgageTerm} лет
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(investment.id)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">

        <div className={`rounded-xl p-4 border ${
          isPositive
            ? 'bg-green-500/5 border-green-500/20'
            : 'bg-red-500/5 border-red-500/20'
        }`}>
          <div className="flex items-center gap-1.5 mb-2">
            {isPositive
              ? <TrendingUp className="w-4 h-4 text-green-400" />
              : <TrendingDown className="w-4 h-4 text-red-400" />
            }
            <span className="text-xs text-slate-400">ROI годовых</span>
          </div>
          <div className={`text-2xl font-bold ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {analysis.annualROI}%
          </div>
        </div>

        <div className={`rounded-xl p-4 border ${
          isCashFlowPositive
            ? 'bg-blue-500/5 border-blue-500/20'
            : 'bg-orange-500/5 border-orange-500/20'
        }`}>
          <div className="flex items-center gap-1.5 mb-2">
            <DollarSign className={`w-4 h-4 ${
              isCashFlowPositive ? 'text-blue-400' : 'text-orange-400'
            }`} />
            <span className="text-xs text-slate-400">Cash Flow/мес</span>
          </div>
          <div className={`text-2xl font-bold ${
            isCashFlowPositive ? 'text-blue-400' : 'text-orange-400'
          }`}>
            {analysis.monthlyCashFlow > 0 ? '+' : ''}
            {Math.round(analysis.monthlyCashFlow).toLocaleString('ru')} ₽
          </div>
        </div>
      </div>

      <div className="space-y-2.5">

        {analysis.monthlyMortgagePayment > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Платёж по ипотеке</span>
            <span className="text-white font-medium">
              {Math.round(analysis.monthlyMortgagePayment).toLocaleString('ru')} ₽/мес
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Ожидаемая аренда</span>
          <span className="text-green-400 font-medium">
            +{investment.expectedRentPerMonth.toLocaleString('ru')} ₽/мес
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Расходы</span>
          <span className="text-red-400 font-medium">
            -{investment.expenses.toLocaleString('ru')} ₽/мес
          </span>
        </div>

        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            Срок окупаемости
          </div>
          <span className="text-white font-medium">
            {analysis.paybackYears
              ? `${analysis.paybackYears} лет`
              : 'Не окупится'
            }
          </span>
        </div>
      </div>
    </motion.div>
  );
}