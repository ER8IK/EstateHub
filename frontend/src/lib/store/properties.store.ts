import { create } from 'zustand';
import { Property } from '../types';

interface PropertiesState {
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;

  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, property: Property) => void;
  deleteProperty: (id: string) => void;
  setSelectedProperty: (property: Property | null) => void;
  setLoading: (loading: boolean) => void;
}

export const usePropertiesStore = create<PropertiesState>((set) => ({
  properties: [],
  selectedProperty: null,
  isLoading: false,

  setProperties: (properties) => set({ properties }),

  addProperty: (property) =>
    set((state) => ({
      properties: [...state.properties, property],
    })),

  updateProperty: (id, updated) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === id ? updated : p
      ),
    })),

  deleteProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
    })),

  setSelectedProperty: (property) => set({ selectedProperty: property }),

  setLoading: (isLoading) => set({ isLoading }),
}));