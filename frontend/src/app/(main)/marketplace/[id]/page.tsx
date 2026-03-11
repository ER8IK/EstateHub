'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Maximize2, Building2,
  Home, Store, Trees, TrendingUp, Calculator,
  Share2, Heart, CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { propertiesApi } from '@/lib/api/properties.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { Property } from '@/lib/types';

const typeIcons: Record<string, any> = {
  apartment: Building2, house: Home,
  commercial: Store, land: Trees,
};

const typeLabels: Record<string, string> = {
  apartment: 'Квартира', house: 'Дом',
  commercial: 'Коммерческая', land: 'Земля',
};

const statusColors: Record<string, string> = {
  sale: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rent: 'bg-blue-100 text-blue-700 border-blue-200',
  sold: 'bg-gray-100 text-gray-500 border-gray-200',
};

const statusLabels: Record<string, string> = {
  sale: 'Продаётся', rent: 'Аренда', sold: 'Продано',
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    propertiesApi.getPublicById(id)
      .then(setProperty)
      .catch(() => router.push('/marketplace'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) return null;

  const pricePerMeter = Math.round(property.price / property.area);
  const annualRent = property.rentPerMonth ? property.rentPerMonth * 12 : 0;
  const rentYield = annualRent ? ((annualRent / property.price) * 100).toFixed(1) : null;
  const Icon = typeIcons[property.type] || Building2;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">Estate<span className="gradient-text">Hub</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-violet-600">Войти</Link>
            <Link href="/register" className="text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:opacity-90">
              Регистрация
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Назад */}
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к объектам
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Левая колонка */}
          <div className="lg:col-span-2 space-y-5">

            {/* Изображение */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-violet-100 via-blue-50 to-cyan-100 rounded-2xl h-72 flex items-center justify-center relative overflow-hidden"
            >
              <Icon className="w-24 h-24 text-violet-200" />
              <span className={`absolute top-4 right-4 text-sm font-semibold px-3 py-1.5 rounded-full border ${statusColors[property.status]}`}>
                {statusLabels[property.status]}
              </span>
              <span className="absolute top-4 left-4 text-sm font-medium bg-white/80 text-gray-600 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {typeLabels[property.type]}
              </span>
              {/* Action buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`p-2 rounded-xl backdrop-blur-sm transition-all ${saved ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500 hover:text-red-500'}`}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                </button>
                <button className="p-2 bg-white/80 rounded-xl backdrop-blur-sm text-gray-500 hover:text-violet-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Основная информация */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                {property.city}, {property.address}
              </div>

              {/* Метрики */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Стоимость', value: `${property.price.toLocaleString('ru')} ₽` },
                  { label: 'Площадь', value: `${property.area} м²` },
                  { label: 'Цена за м²', value: `${pricePerMeter.toLocaleString('ru')} ₽` },
                ].map(m => (
                  <div key={m.label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                    <div className="font-bold text-gray-900">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Описание */}
              {property.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="font-medium text-gray-700 mb-2">Описание</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{property.description}</p>
                </div>
              )}
            </motion.div>

            {/* Аренда */}
            {property.rentPerMonth && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6"
              >
                <h3 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Доходность от аренды
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-emerald-600 mb-1">В месяц</div>
                    <div className="font-bold text-emerald-800">{property.rentPerMonth.toLocaleString('ru')} ₽</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-600 mb-1">В год</div>
                    <div className="font-bold text-emerald-800">{annualRent.toLocaleString('ru')} ₽</div>
                  </div>
                  {rentYield && (
                    <div>
                      <div className="text-xs text-emerald-600 mb-1">Доходность</div>
                      <div className="font-bold text-emerald-800">{rentYield}% годовых</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Правая колонка — CTA */}
          <div className="space-y-4">

            {/* Цена */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {property.price.toLocaleString('ru')} ₽
              </div>
              <div className="text-sm text-gray-400 mb-6">
                {property.area} м² · {pricePerMeter.toLocaleString('ru')} ₽/м²
              </div>

              {/* Анализировать кнопка */}
              {isAuthenticated ? (
                <Link href={`/investments?propertyId=${property.id}`}>
                  <button className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-3">
                    <Calculator className="w-4 h-4" />
                    Анализировать инвестицию
                  </button>
                </Link>
              ) : (
                <Link href={`/register?redirect=/marketplace/${property.id}`}>
                  <button className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-3">
                    <Calculator className="w-4 h-4" />
                    Анализировать инвестицию
                  </button>
                </Link>
              )}

              <button
                onClick={() => setSaved(!saved)}
                className={`w-full py-3 rounded-xl font-medium border text-sm transition-all flex items-center justify-center gap-2 ${
                  saved
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-red-500' : ''}`} />
                {saved ? 'Сохранено' : 'Сохранить'}
              </button>
            </motion.div>

            {/* Что включает анализ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl p-5"
            >
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-600" />
                Что даёт анализ
              </h3>
              {[
                'Расчёт ипотечного платежа',
                'ROI и доходность в %',
                'Чистый Cash Flow в месяц',
                'Срок окупаемости',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>

            {/* Характеристики */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <h3 className="font-semibold text-gray-800 mb-3">Характеристики</h3>
              {[
                { label: 'Тип', value: typeLabels[property.type] },
                { label: 'Площадь', value: `${property.area} м²` },
                { label: 'Город', value: property.city },
                { label: 'Статус', value: statusLabels[property.status] },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-700">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}