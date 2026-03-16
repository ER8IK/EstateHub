'use client';

import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Info } from 'lucide-react';
import { useEffect } from 'react';
import { CreateInvestmentDto, Property } from '@/lib/types';

interface InvestmentFormProps {
  properties: Property[];
  onSubmit: (dto: CreateInvestmentDto) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  defaultPropertyId?: string;
}

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50";

export default function InvestmentForm({
  properties, onSubmit, onClose, isLoading, defaultPropertyId
}: InvestmentFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateInvestmentDto>({
    defaultValues: {
      propertyId: defaultPropertyId || '',
      mortgageRate: 10,
      mortgageTerm: 15,
      expenses: 5000,
    }
  });

  const selectedPropertyId = watch('propertyId');
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  // ✅ Автозаполнение при выборе объекта
  useEffect(() => {
    if (selectedProperty) {
      setValue('purchasePrice', selectedProperty.price);
      setValue('downPayment', Math.round(selectedProperty.price * 0.2)); // 20% взнос
      if (selectedProperty.rentPerMonth) {
        setValue('expectedRentPerMonth', selectedProperty.rentPerMonth);
      }
    }
  }, [selectedPropertyId]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto border border-gray-100"
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Инвестиционный анализ</h2>
              {selectedProperty && (
                <p className="text-sm text-violet-600 mt-0.5">{selectedProperty.title}</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

            {/* Объект */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Объект</label>
              <select {...register('propertyId', { required: 'Выберите объект' })} className={inputClass}>
                <option value="">Выберите объект</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.price.toLocaleString('ru')} ₽
                  </option>
                ))}
              </select>
              {errors.propertyId && <p className="text-red-500 text-xs">{errors.propertyId.message}</p>}
            </div>

            {/* Подсказка об автозаполнении */}
            {selectedProperty && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2"
              >
                <Info className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                <p className="text-xs text-violet-600">
                  Цена и аренда заполнены автоматически из объекта. Вы можете изменить значения.
                </p>
              </motion.div>
            )}

            {/* Цена + Взнос */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Цена покупки (₽)</label>
                <input
                  {...register('purchasePrice', { required: 'Обязательное поле', valueAsNumber: true })}
                  type="number"
                  placeholder="5000000"
                  className={inputClass}
                />
                {errors.purchasePrice && <p className="text-red-500 text-xs">{errors.purchasePrice.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Первый взнос (₽)</label>
                <input
                  {...register('downPayment', { required: 'Обязательное поле', valueAsNumber: true })}
                  type="number"
                  placeholder="1000000"
                  className={inputClass}
                />
                {errors.downPayment && <p className="text-red-500 text-xs">{errors.downPayment.message}</p>}
              </div>
            </div>

            {/* Ставка + Срок */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Ставка (%)</label>
                <input
                  {...register('mortgageRate', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  placeholder="10"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Срок (лет)</label>
                <input
                  {...register('mortgageTerm', { valueAsNumber: true })}
                  type="number"
                  placeholder="15"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Аренда + Расходы */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Аренда / мес (₽)</label>
                <input
                  {...register('expectedRentPerMonth', { required: 'Обязательное поле', valueAsNumber: true })}
                  type="number"
                  placeholder="30000"
                  className={inputClass}
                />
                {errors.expectedRentPerMonth && <p className="text-red-500 text-xs">{errors.expectedRentPerMonth.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Расходы / мес (₽)</label>
                <input
                  {...register('expenses', { required: 'Обязательное поле', valueAsNumber: true })}
                  type="number"
                  placeholder="5000"
                  className={inputClass}
                />
                {errors.expenses && <p className="text-red-500 text-xs">{errors.expenses.message}</p>}
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl transition-all text-sm font-medium">
                Отмена
              </button>
              <button type="submit" disabled={isLoading} className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Рассчитать'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}