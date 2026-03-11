'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, Search } from 'lucide-react';
import { propertiesApi } from '@/lib/api/properties.api';
import { usePropertiesStore } from '@/lib/store/properties.store';
import { CreatePropertyDto } from '@/lib/types';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyForm from '@/components/properties/PropertyForm';

export default function PropertiesPage() {
  const { properties, setProperties, addProperty, deleteProperty, isLoading, setLoading } =
    usePropertiesStore();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await propertiesApi.getAll();
        setProperties(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCreate = async (dto: CreatePropertyDto) => {
    setIsSubmitting(true);
    try {
      const property = await propertiesApi.create(dto);
      addProperty(property);
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await propertiesApi.delete(id);
    deleteProperty(id);
  };

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Объекты</h1>
          <p className="text-slate-400 text-sm mt-1">
            {properties.length} объектов в портфеле
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию или адресу..."
          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Home className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">
            {search ? 'Ничего не найдено' : 'Объектов пока нет'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {showForm && (
        <PropertyForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}