'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Maximize2, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { propertiesApi } from '@/lib/api/properties.api';
import { Property } from '@/lib/types';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await propertiesApi.getById(id);
        setProperty(data);
      } catch {
        router.push('/properties');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) return null;

  const pricePerMeter = Math.round(property.price / property.area);
  const annualRent = property.rentPerMonth ? property.rentPerMonth * 12 : 0;
  const rentYield = annualRent ? ((annualRent / property.price) * 100).toFixed(2) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl"
    >
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к объектам
      </Link>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">{property.title}</h1>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <MapPin className="w-4 h-4" />
          {property.address}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Стоимость', value: `${property.price.toLocaleString('ru')} ₽`, icon: DollarSign, color: 'blue' },
          { label: 'Площадь', value: `${property.area} м²`, icon: Maximize2, color: 'violet' },
          { label: 'Цена за м²', value: `${pricePerMeter.toLocaleString('ru')} ₽`, icon: DollarSign, color: 'slate' },
          { label: 'Доходность', value: rentYield ? `${rentYield}%` : '—', icon: TrendingUp, color: rentYield ? 'green' : 'slate' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="text-slate-400 text-sm mb-2">{metric.label}</div>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                <Icon className="w-4 h-4 text-slate-500" />
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>

      {property.rentPerMonth && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
          <h3 className="text-green-400 font-medium mb-3">Арендный доход</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 text-sm">В месяц</div>
              <div className="text-white font-bold text-lg">
                {property.rentPerMonth.toLocaleString('ru')} ₽
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">В год</div>
              <div className="text-white font-bold text-lg">
                {annualRent.toLocaleString('ru')} ₽
              </div>
            </div>
          </div>
        </div>
      )}

      <Link
        href="/investments"
        className="block bg-violet-600/10 border border-violet-500/20 hover:border-violet-500/40 rounded-2xl p-5 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-violet-400 font-medium">Создать инвестиционный анализ</div>
            <div className="text-slate-500 text-sm mt-1">
              Рассчитать ROI и срок окупаемости
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}