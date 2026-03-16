'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home, TrendingUp, DollarSign, BarChart3,
  ArrowUpRight, ArrowDownRight, Plus, Store,
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth.store';
import { propertiesApi } from '@/lib/api/properties.api';
import { investmentsApi } from '@/lib/api/investments.api';
import { Property } from '@/lib/types';
import { InvestmentWithAnalysis } from '@/lib/api/investments.api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const statusColors: Record<string, string> = {
  sale: 'bg-emerald-100 text-emerald-700',
  rent: 'bg-blue-100 text-blue-700',
  sold: 'bg-gray-100 text-gray-600',
};
const statusLabels: Record<string, string> = {
  sale: 'Продажа', rent: 'Аренда', sold: 'Продано',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [investments, setInvestments] = useState<InvestmentWithAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([propertiesApi.getAll(), investmentsApi.getAll()])
      .then(([props, invs]) => { setProperties(props); setInvestments(invs); })
      .finally(() => setIsLoading(false));
  }, []);

  const totalValue = properties.reduce((s, p) => s + p.price, 0);
  const avgROI = investments.length
    ? investments.reduce((s, i) => s + i.analysis.annualROI, 0) / investments.length
    : 0;
  const totalCashFlow = investments.reduce((s, i) => s + i.analysis.monthlyCashFlow, 0);

  const stats = [
    { label: 'Объектов', value: properties.length, suffix: '', icon: Home, bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: 'Общая стоимость', value: (totalValue / 1_000_000).toFixed(1), suffix: ' млн ₽', icon: DollarSign, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Средний ROI', value: avgROI.toFixed(1), suffix: '%', icon: BarChart3, bg: avgROI >= 0 ? 'bg-emerald-50' : 'bg-red-50', text: avgROI >= 0 ? 'text-emerald-600' : 'text-red-600' },
    { label: 'Cash Flow / мес', value: Math.round(totalCashFlow).toLocaleString('ru'), suffix: ' ₽', icon: TrendingUp, bg: totalCashFlow >= 0 ? 'bg-amber-50' : 'bg-red-50', text: totalCashFlow >= 0 ? 'text-amber-600' : 'text-red-600' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* Заголовок */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900">
          Привет, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Сводка по вашему портфелю недвижимости</p>
      </motion.div>

      {/* Статистика */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm card-hover">
              <div className={`inline-flex p-2.5 rounded-xl ${s.bg} mb-3`}>
                <Icon className={`w-4 h-4 ${s.text}`} />
              </div>
              <div className={`text-2xl font-bold ${s.text}`}>
                {s.value}{s.suffix}
              </div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Быстрые действия */}
      <motion.div variants={item} className="grid sm:grid-cols-3 gap-4">
        {[
          { href: '/marketplace', label: 'Смотреть маркетплейс', icon: Store, gradient: 'from-violet-600 to-blue-600' },
          { href: '/properties', label: 'Добавить объект', icon: Home, gradient: 'from-blue-600 to-cyan-600' },
          { href: '/investments', label: 'Новый анализ', icon: TrendingUp, gradient: 'from-emerald-600 to-teal-600' },
        ].map(action => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <div className={`bg-gradient-to-r ${action.gradient} rounded-2xl p-5 text-white card-hover`}>
                <Icon className="w-5 h-5 mb-2 opacity-90" />
                <div className="font-semibold">{action.label}</div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Мои объекты */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Мои объекты</h2>
          <Link href="/properties" className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">
            Все <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
            <Home className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4 text-sm">Объектов пока нет</p>
            <Link href="/properties" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm px-4 py-2 rounded-xl">
              <Plus className="w-4 h-4" /> Добавить объект
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.slice(0, 3).map(p => (
              <Link key={p.id} href={`/properties/${p.id}`}>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 card-hover shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[p.status]}`}>
                      {statusLabels[p.status]}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                  {/* ✅ Читаемый текст */}
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{p.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 truncate">{p.city}, {p.address}</p>
                  <div className="text-lg font-bold gradient-text">
                    {p.price.toLocaleString('ru')} ₽
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Мои инвестиции */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Мои инвестиции</h2>
          <Link href="/investments" className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium">
            Все <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {investments.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
            <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4 text-sm">Анализов пока нет</p>
            <Link href="/marketplace" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm px-4 py-2 rounded-xl">
              <Store className="w-4 h-4" /> Найти объект
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {investments.slice(0, 3).map(({ investment, analysis }) => (
              <div key={investment.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <div className="font-semibold text-gray-900">
                    {investment.purchasePrice.toLocaleString('ru')} ₽
                  </div>
                  {/* ✅ Было text-gray-400 — не читалось */}
                  <div className="text-gray-600 text-sm">
                    Взнос: {investment.downPayment.toLocaleString('ru')} ₽
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold flex items-center gap-1 justify-end ${analysis.annualROI >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {analysis.annualROI >= 0
                      ? <ArrowUpRight className="w-4 h-4" />
                      : <ArrowDownRight className="w-4 h-4" />
                    }
                    {analysis.annualROI}%
                  </div>
                  <div className="text-gray-500 text-sm">ROI годовых</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}