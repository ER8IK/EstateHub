'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, MapPin, TrendingUp, Shield, Zap,
  ArrowRight, Building2, Home, Store, Trees,
  Star, ChevronRight,
} from 'lucide-react';
import { propertiesApi } from '@/lib/api/properties.api';
import { Property } from '@/lib/types';

const stats = [
  { value: '2,400+', label: 'Объектов' },
  { value: '1,200+', label: 'Инвесторов' },
  { value: '₽12B+', label: 'Сделок' },
  { value: '98%', label: 'Довольных' },
];

const features = [
  {
    icon: TrendingUp,
    title: 'Инвестиционный анализ',
    desc: 'ROI, Cash Flow и срок окупаемости для любого объекта',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
  },
  {
    icon: Shield,
    title: 'Ипотечный калькулятор',
    desc: 'Точный расчёт аннуитетного платежа по вашим условиям',
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Мгновенные результаты',
    desc: 'Анализируйте сотни объектов и выбирайте лучшие',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
  },
];

const typeIcons: Record<string, any> = {
  apartment: Building2,
  house: Home,
  commercial: Store,
  land: Trees,
};

const typeLabels: Record<string, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  commercial: 'Коммерческая',
  land: 'Земля',
};

const statusColors: Record<string, string> = {
  sale: 'bg-green-100 text-green-700',
  rent: 'bg-blue-100 text-blue-700',
  sold: 'bg-gray-100 text-gray-500',
};

const statusLabels: Record<string, string> = {
  sale: 'Продажа',
  rent: 'Аренда',
  sold: 'Продано',
};

export default function HomePage() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    propertiesApi.getAll().then(data => setFeatured(data.slice(0, 6)));
  }, []);

  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Estate<span className="gradient-text">Hub</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/marketplace" className="hover:text-violet-600 transition-colors">Маркетплейс</Link>
            <Link href="/dashboard" className="hover:text-violet-600 transition-colors">Кабинет</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
              Войти
            </Link>
            <Link href="/register" className="text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
              Регистрация
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden">
        {/* Градиентные шары */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Star className="w-3.5 h-3.5 fill-violet-500" />
              Лучший инвестиционный анализатор
            </span>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Найди свою{' '}
              <span className="gradient-text">идеальную</span>
              <br />недвижимость
            </h1>

            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
              Маркетплейс с встроенным инвестиционным анализом. Считай ROI, ипотеку и окупаемость прямо на странице объекта.
            </p>

            {/* Search bar */}
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-xl shadow-gray-200 p-2 max-w-2xl mx-auto border border-gray-100">
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Город, район или адрес..."
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
                />
              </div>
              <Link
                href={`/marketplace?city=${search}`}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-5 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Search className="w-4 h-4" />
                Найти
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Всё что нужно инвестору</h2>
            <p className="text-gray-500">Анализируй, считай, инвестируй — в одном месте</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={`${f.bg} rounded-2xl p-6 card-hover`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Свежие объекты</h2>
              <p className="text-gray-500 mt-1">Актуальные предложения на рынке</p>
            </div>
            <Link
              href="/marketplace"
              className="hidden md:flex items-center gap-2 text-violet-600 font-medium hover:gap-3 transition-all"
            >
              Все объекты <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Объекты появятся после публикации</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => {
                const Icon = typeIcons[p.type] || Building2;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/marketplace/${p.id}`}>
                      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden card-hover shadow-sm">
                        {/* Image placeholder */}
                        <div className="h-44 bg-gradient-to-br from-violet-100 via-blue-50 to-cyan-100 flex items-center justify-center relative">
                          <Icon className="w-12 h-12 text-violet-300" />
                          <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[p.status]}`}>
                            {statusLabels[p.status]}
                          </span>
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                            <MapPin className="w-3.5 h-3.5" />
                            {p.city}, {p.address}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xl font-bold text-gray-900">
                                {p.price.toLocaleString('ru')} ₽
                              </div>
                              <div className="text-xs text-gray-400">
                                {Math.round(p.price / p.area).toLocaleString('ru')} ₽/м²
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-violet-600 text-sm font-medium">
                              Анализ <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link href="/marketplace" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium">
              Все объекты <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 rounded-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Готов инвестировать умно?
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Зарегистрируйся и получи доступ к полному анализу инвестиций
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/register" className="bg-white text-violet-600 font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all">
                  Начать бесплатно
                </Link>
                <Link href="/marketplace" className="text-white border border-white/30 font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-all">
                  Смотреть объекты
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        © 2026 EstateHub — Инвестиционный маркетплейс недвижимости
      </footer>
    </div>
  );
}