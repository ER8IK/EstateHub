'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, Building2,
  Home, Store, Trees, ArrowRight, X
} from 'lucide-react';
import Link from 'next/link';
import { propertiesApi } from '@/lib/api/properties.api';
import { Property, PropertyType, PropertyStatus, PropertyFilters } from '@/lib/types';

const typeLabels: Record<string, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  commercial: 'Коммерческая',
  land: 'Земля',
};

const typeIcons: Record<string, any> = {
  apartment: Building2,
  house: Home,
  commercial: Store,
  land: Trees,
};

const statusColors: Record<string, string> = {
  sale: 'bg-emerald-100 text-emerald-700',
  rent: 'bg-blue-100 text-blue-700',
  sold: 'bg-gray-100 text-gray-500',
};

const statusLabels: Record<string, string> = {
  sale: 'Продажа',
  rent: 'Аренда',
  sold: 'Продано',
};

// ─── Внутренний компонент с useSearchParams ────────────────────────────────
function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<PropertyFilters>({
    city: searchParams.get('city') || '',
    type: undefined,
    status: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const [search, setSearch] = useState(searchParams.get('city') || '');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await propertiesApi.getPublic(filters);
        setProperties(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, city: search }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearch('');
  };

  const activeFiltersCount = [
    filters.type, filters.status, filters.city,
    filters.minPrice, filters.maxPrice
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Заголовок + поиск */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Маркетплейс</h1>
        <p className="text-gray-500 mb-6">{properties.length} объектов найдено</p>

        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Поиск по городу..."
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            />
            {search && (
              <button onClick={() => { setSearch(''); setFilters(prev => ({ ...prev, city: '' })); }}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Фильтры
            {activeFiltersCount > 0 && (
              <span className="bg-white text-violet-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Найти
          </button>
        </div>
      </div>

      {/* Панель фильтров */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Тип объекта</label>
                  <select
                    value={filters.type || ''}
                    onChange={e => setFilters(prev => ({ ...prev, type: e.target.value as PropertyType || undefined }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-violet-400 bg-gray-50"
                  >
                    <option value="">Все типы</option>
                    <option value="apartment">Квартира</option>
                    <option value="house">Дом</option>
                    <option value="commercial">Коммерческая</option>
                    <option value="land">Земля</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Статус</label>
                  <select
                    value={filters.status || ''}
                    onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as PropertyStatus || undefined }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-violet-400 bg-gray-50"
                  >
                    <option value="">Все</option>
                    <option value="sale">Продажа</option>
                    <option value="rent">Аренда</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Цена от (₽)</label>
                  <input
                    type="number"
                    placeholder="1 000 000"
                    value={filters.minPrice || ''}
                    onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-violet-400 bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Цена до (₽)</label>
                  <input
                    type="number"
                    placeholder="50 000 000"
                    value={filters.maxPrice || ''}
                    onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-violet-400 bg-gray-50"
                  />
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Сбросить фильтры
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Сетка объектов */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-5 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <Building2 className="w-14 h-14 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">Объектов не найдено</p>
          <p className="text-gray-400 text-sm mt-1">Попробуйте изменить фильтры</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-violet-600 text-sm font-medium hover:underline"
          >
            Сбросить фильтры
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {properties.map((p, i) => {
              const Icon = typeIcons[p.type] || Building2;
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/marketplace/${p.id}`}>
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden group card-hover shadow-sm">
                      <div className="h-48 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-blue-100/50 group-hover:opacity-75 transition-opacity" />
                        <Icon className="w-14 h-14 text-violet-200 group-hover:text-violet-300 transition-colors relative z-10" />
                        <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${statusColors[p.status]}`}>
                          {statusLabels[p.status]}
                        </span>
                        <span className="absolute top-3 left-3 text-xs font-medium bg-white/80 text-gray-600 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {typeLabels[p.type]}
                        </span>
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-violet-600 transition-colors">
                          {p.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{p.city}, {p.address}</span>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-xl font-bold text-gray-900">
                              {p.price.toLocaleString('ru')} ₽
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {p.area} м² · {Math.round(p.price / p.area).toLocaleString('ru')} ₽/м²
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Анализ <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// ─── Navbar отдельно — не нужен Suspense ──────────────────────────────────
'use client';

import { useAuthStore } from '@/lib/store/auth.store';

function MarketplaceNavbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl">Estate<span className="gradient-text">Hub</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/marketplace" className="text-violet-600 font-semibold">Маркетплейс</Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="hover:text-violet-600 transition-colors">Кабинет</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600 hidden md:block">
                {user?.name}
              </span>
              <Link href="/dashboard" className="text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:opacity-90">
                Кабинет
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
                Войти
              </Link>
              <Link href="/register" className="text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Главный экспорт — оборачиваем в Suspense ─────────────────────────────
export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceNavbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <MarketplaceContent />
      </Suspense>
    </div>
  );
}