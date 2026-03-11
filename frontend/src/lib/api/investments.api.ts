import api from './axios';
import {
  Investment,
  InvestmentAnalysis,
  CreateInvestmentDto,
  ApiResponse
} from '../types';

export interface InvestmentWithAnalysis {
  investment: Investment;
  analysis: InvestmentAnalysis;
}

export const investmentsApi = {
  create: async (dto: CreateInvestmentDto): Promise<InvestmentWithAnalysis> => {
    const res = await api.post<ApiResponse<InvestmentWithAnalysis>>('/investments', dto);
    return res.data.data;
  },

  getAll: async (): Promise<InvestmentWithAnalysis[]> => {
    const res = await api.get<ApiResponse<InvestmentWithAnalysis[]>>('/investments');
    return res.data.data;
  },

  getById: async (id: string): Promise<InvestmentWithAnalysis> => {
    const res = await api.get<ApiResponse<InvestmentWithAnalysis>>(`/investments/${id}`);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/investments/${id}`);
  },
};