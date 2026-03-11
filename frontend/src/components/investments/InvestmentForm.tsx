"use client";

import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { CreateInvestmentDto } from "@/lib/types";
import { Property } from "@/lib/types";

interface InvestmentFormProps {
  properties: Property[];
  onSubmit: (dto: CreateInvestmentDto) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  defaultPropertyId?: string; // ← новое
}

export default function InvestmentForm({
  properties,
  onSubmit,
  onClose,
  isLoading,
  defaultPropertyId,
}: InvestmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInvestmentDto>({
    defaultValues: {
      propertyId: defaultPropertyId || "", 
    },
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Новый анализ</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-slate-300">
                Объект недвижимости
              </label>
              <select
                {...register("propertyId", { required: "Выберите объект" })}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 transition-all text-sm"
              >
                <option value="">Выберите объект</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              {errors.propertyId && (
                <p className="text-red-400 text-xs">
                  {errors.propertyId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-300">
                  Цена покупки (₽)
                </label>
                <input
                  {...register("purchasePrice", {
                    required: "Обязательное поле",
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="5000000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all text-sm"
                />
                {errors.purchasePrice && (
                  <p className="text-red-400 text-xs">
                    {errors.purchasePrice.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-slate-300">
                  Первый взнос (₽)
                </label>
                <input
                  {...register("downPayment", {
                    required: "Обязательное поле",
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="1000000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all text-sm"
                />
                {errors.downPayment && (
                  <p className="text-red-400 text-xs">
                    {errors.downPayment.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-4 space-y-3">
              <p className="text-sm text-slate-400">
                Ипотека <span className="text-slate-500">(необязательно)</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Ставка (%)</label>
                  <input
                    {...register("mortgageRate", { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    placeholder="10.5"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Срок (лет)</label>
                  <input
                    {...register("mortgageTerm", { valueAsNumber: true })}
                    type="number"
                    placeholder="20"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-300">Аренда/мес (₽)</label>
                <input
                  {...register("expectedRentPerMonth", {
                    required: "Обязательное поле",
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="35000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all text-sm"
                />
                {errors.expectedRentPerMonth && (
                  <p className="text-red-400 text-xs">
                    {errors.expectedRentPerMonth.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-slate-300">
                  Расходы/мес (₽)
                </label>
                <input
                  {...register("expenses", {
                    required: "Обязательное поле",
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="5000"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all text-sm"
                />
                {errors.expenses && (
                  <p className="text-red-400 text-xs">
                    {errors.expenses.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl transition-all text-sm"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Рассчитать"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
