import { create } from 'zustand';
import { InvestmentWithAnalysis } from '../api/investments.api';
import { useAuthStore } from './auth.store';

interface InvestmentsState {
  investments: InvestmentWithAnalysis[];
  isLoading: boolean;

  setInvestments: (investments: InvestmentWithAnalysis[]) => void;
  addInvestment: (investment: InvestmentWithAnalysis) => void;
  deleteInvestment: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useInvestmentsStore = create<InvestmentsState>((set) => ({
  investments: [],
  isLoading: false,

  setInvestments: (investments) => set({ investments }),

  addInvestment: (investment) =>
    set((state) => ({
      investments: [...state.investments, investment],
    })),

  deleteInvestment: (id) =>
    set((state) => ({
      investments: state.investments.filter(
        (i) => i.investment.id !== id
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));