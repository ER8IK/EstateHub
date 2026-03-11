import api from './axios';
import axios from 'axios';
import { Property, CreatePropertyDto, PropertyFilters, ApiResponse } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const propertiesApi = {
  getPublic: async (filters: PropertyFilters): Promise<Property[]> => {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    const res = await axios.get<ApiResponse<Property[]>>(
      `${BASE_URL}/properties/public?${params}`
    );
    return res.data.data;
  },

  getPublicById: async (id: string): Promise<Property> => {
    const res = await axios.get<ApiResponse<Property>>(
      `${BASE_URL}/properties/public/${id}`
    );
    return res.data.data;
  },

  getAll: async (): Promise<Property[]> => {
    const res = await api.get<ApiResponse<Property[]>>('/properties');
    return res.data.data;
  },

  getById: async (id: string): Promise<Property> => {
    const res = await api.get<ApiResponse<Property>>(`/properties/${id}`);
    return res.data.data;
  },

  create: async (dto: CreatePropertyDto): Promise<Property> => {
    const res = await api.post<ApiResponse<Property>>('/properties', dto);
    return res.data.data;
  },

  update: async (id: string, dto: Partial<CreatePropertyDto>): Promise<Property> => {
    const res = await api.patch<ApiResponse<Property>>(`/properties/${id}`, dto);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};
