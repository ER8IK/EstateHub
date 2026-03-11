'use client';

import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { CreatePropertyDto, PropertyType, PropertyStatus } from '@/lib/types';

interface PropertyFormProps {
  onSubmit: (dto: CreatePropertyDto) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'commercial', label: 'Коммерческая' },
  { value: 'land', label: 'Земля' },
];

const propertyStatuses: { value: PropertyStatus; label: string }[] = [
  { value: 'sale', label: 'Продажа' },
  { value: 'rent', label: 'Аренда' },
  { value: 'sold', label: 'Продано' },
];

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50";

export default function PropertyForm({ onSubmit, onClose, isLoading }: PropertyFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreatePropertyDto>();

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
            <h2 className="text-lg font-semibold text-gray-900">Новый объект</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

            {/* Название */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Название</label>
              <input {...register('title', { required: 'Обязательное поле' })} placeholder="Квартира в центре" className={inputClass} />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            {/* Тип + Статус */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Тип</label>
                <select {...register('type', { required: 'Выберите тип' })} className={inputClass}>
                  <option value="">Выберите тип</option>
                  {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Статус</label>
                <select {...register('status', { required: 'Выберите статус' })} className={inputClass}>
                  <option value="">Выберите статус</option>
                  {propertyStatuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
              </div>
            </div>

            {/* Город */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Город</label>
              <input {...register('city', { required: 'Обязательное поле' })} placeholder="Москва" className={inputClass} />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
            </div>

            {/* Адрес */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Адрес</label>
              <input {...register('address', { required: 'Обязательное поле' })} placeholder="ул. Пушкина 10" className={inputClass} />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>

            {/* Цена + Площадь */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Цена (₽)</label>
                <input {...register('price', { required: 'Обязательное поле', valueAsNumber: true })} type="number" placeholder="5000000" className={inputClass} />
                {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Площадь (м²)</label>
                <input {...register('area', { required: 'Обязательное поле', valueAsNumber: true })} type="number" placeholder="65" className={inputClass} />
                {errors.area && <p className="text-red-500 text-xs">{errors.area.message}</p>}
              </div>
            </div>

            {/* Аренда */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Аренда/мес (₽) <span className="text-gray-400 font-normal">(необязательно)</span>
              </label>
              <input {...register('rentPerMonth', { valueAsNumber: true })} type="number" placeholder="30000" className={inputClass} />
            </div>

            {/* Описание */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Описание <span className="text-gray-400 font-normal">(необязательно)</span>
              </label>
              <textarea
                {...register('description')}
                placeholder="Опишите объект..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 rounded-xl transition-all text-sm font-medium">
                Отмена
              </button>
              <button type="submit" disabled={isLoading} className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Создать'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}