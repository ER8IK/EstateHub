'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onDelete: (id: string) => void;
}

export default function PropertyList({ properties, onDelete }: PropertyListProps) {
  return (
    <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}