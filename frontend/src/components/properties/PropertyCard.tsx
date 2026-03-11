'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, MapPin, Maximize2, ArrowUpRight, Trash2 } from 'lucide-react';
import { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
  onDelete: (id: string) => void;
}

const typeLabels: Record<string, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  commercial: 'Коммерческая',
  land: 'Земля',
};

const typeColors: Record<string, string> = {
  apartment: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  house: 'bg-green-500/10 text-green-400 border-green-500/20',
  commercial: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  land: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function PropertyCard({ property, onDelete }: PropertyCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900/50 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <span className={`text-xs px-2 py-1 rounded-lg border ${typeColors[property.type]}`}>
          {typeLabels[property.type]}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(property.id)}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <Link
            href={`/properties/${property.id}`}
            className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <h3 className="font-semibold text-white mb-1">{property.title}</h3>

      <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{property.address}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-800/50 rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-1">Площадь</div>
          <div className="text-white font-medium flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-slate-400" />
            {property.area} м²
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3">
          <div className="text-xs text-slate-500 mb-1">Аренда/мес</div>
          <div className="text-white font-medium">
            {property.rentPerMonth
              ? `${property.rentPerMonth.toLocaleString('ru')} ₽`
              : '—'}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 mb-1">Стоимость</div>
        <div className="text-xl font-bold text-white">
          {property.price.toLocaleString('ru')} ₽
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          {(property.price / property.area).toLocaleString('ru')} ₽/м²
        </div>
      </div>
    </motion.div>
  );
}