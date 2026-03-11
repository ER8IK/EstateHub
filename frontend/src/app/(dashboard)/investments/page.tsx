'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp, ArrowUpRight, ArrowDownRight, Trash2, Clock, DollarSign } from 'lucide-react';
import { investmentsApi } from '@/lib/api/investments.api';
import { propertiesApi } from '@/lib/api/properties.api';
import { useInvestmentsStore } from '@/lib/store/investments.store';
import { CreateInvestmentDto, Property } from '@/lib/types';
import InvestmentForm from '@/components/investments/InvestmentForm';
import { InvestmentWithAnalysis } from '@/lib/api/investments.api';

// ✅ useSearchParams вынесен в отдельный компонент
function InvestmentsContent() {
  const searchParams = useSearchParams();
  const { investments, setInvestments, addInvestment, deleteInvestment, isLoading, setLoading } =
    useInvestmentsStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [invs, props] = await Promise.all([
          investmentsApi.getAll(),
          propertiesApi.getAll(),
        ]);
        setInvestments(invs);
        setProperties(props);
        if (searchParams.get('propertyId')) setShowForm(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreate = async (dto: CreateInvestmentDto) => {
    setIsSubmitting(true);
    try {
      const result = await investmentsApi.create(dto);
      addInvestment(result);
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await investmentsApi.delete(id);
    deleteInvestment(id);
  };

  const avgROI = investments.length
    ? (investments.reduce((s, i) => s + i.analysis.annualROI, 0) / investments.length).toFixed(1)
    : null;

  const totalCashFlow = investments.reduce((s, i) => s + i.analysis.monthlyCashFlow, 0);

  return (
    <div className="space-y-6">

      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Инвестиции</h1>
          <p className="text-gray-400 text-sm mt-1">
            {investments.length} анализов
            {avgROI && (
              <span className={`ml-2 font-semibold ${Number(avgROI) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                · Средний ROI: {avgROI}%
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={properties.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-violet-200"
        >
          <Plus className="w-4 h-4" /> Новый анализ
        </button>
      </div>

      {/* Нет объектов */}
      {properties.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700"
        >
          Сначала добавьте объект на странице «Мои объекты» или найдите на маркетплейсе
        </motion.div>
      )}

      {/* Суммарная статистика */}
      {investments.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">Средний ROI</div>
            <div className={`text-2xl font-bold ${Number(avgROI) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {avgROI}%
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">Суммарный Cash Flow</div>
            <div className={`text-2xl font-bold ${totalCashFlow >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
              {totalCashFlow > 0 ? '+' : ''}{Math.round(totalCashFlow).toLocaleString('ru')} ₽/мес
            </div>
          </div>
        </div>
      )}

      {/* Список */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : investments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <TrendingUp className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Анализов пока нет</p>
          <p className="text-gray-300 text-sm mt-1">Создайте первый инвестиционный анализ</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {investments.map(({ investment, analysis }) => (
              <motion.div
                key={investment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {investment.purchasePrice.toLocaleString('ru')} ₽
                    </div>
                    <div className="text-gray-400 text-sm mt-0.5">
                      Взнос: {investment.downPayment.toLocaleString('ru')} ₽
                      {investment.mortgageRate && (
                        <span className="ml-2 text-violet-500">
                          · {investment.mortgageRate}% / {investment.mortgageTerm} лет
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(investment.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`rounded-xl p-4 ${analysis.annualROI >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {analysis.annualROI >= 0
                        ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                        : <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                      }
                      <span className="text-xs text-gray-400">ROI годовых</span>
                    </div>
                    <div className={`text-2xl font-bold ${analysis.annualROI >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {analysis.annualROI}%
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 ${analysis.monthlyCashFlow >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <DollarSign className={`w-3.5 h-3.5 ${analysis.monthlyCashFlow >= 0 ? 'text-blue-600' : 'text-orange-500'}`} />
                      <span className="text-xs text-gray-400">Cash Flow/мес</span>
                    </div>
                    <div className={`text-2xl font-bold ${analysis.monthlyCashFlow >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                      {analysis.monthlyCashFlow > 0 ? '+' : ''}
                      {Math.round(analysis.monthlyCashFlow).toLocaleString('ru')} ₽
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-50">
                  {analysis.monthlyMortgagePayment > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Ипотека</span>
                      <span className="text-gray-600 font-medium">
                        {Math.round(analysis.monthlyMortgagePayment).toLocaleString('ru')} ₽/мес
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Аренда</span>
                    <span className="text-emerald-600 font-medium">
                      +{investment.expectedRentPerMonth.toLocaleString('ru')} ₽/мес
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Расходы</span>
                    <span className="text-red-400 font-medium">
                      -{investment.expenses.toLocaleString('ru')} ₽/мес
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      Окупаемость
                    </div>
                    <span className="font-medium text-gray-700">
                      {analysis.paybackYears ? `${analysis.paybackYears} лет` : 'Не окупится'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {showForm && (
        <InvestmentForm
          properties={properties}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isLoading={isSubmitting}
          defaultPropertyId={searchParams.get('propertyId') || undefined}
        />
      )}
    </div>
  );
}

// ✅ Экспортируемая страница оборачивает контент в Suspense
export default function InvestmentsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InvestmentsContent />
    </Suspense>
  );
}