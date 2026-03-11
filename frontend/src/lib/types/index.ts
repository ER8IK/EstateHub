// --- USER ---
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// --- PROPERTY ---
export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land';
export type PropertyStatus = 'sale' | 'rent' | 'sold'; 

export interface Property {
  id: string;
  userId: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;    
  city: string;              
  address: string;
  description?: string;      
  price: number;
  area: number;
  rentPerMonth?: number;
  createdAt: string;
}

export interface CreatePropertyDto {
  title: string;
  type: PropertyType;
  status: PropertyStatus;    
  city: string;              
  address: string;
  description?: string;      
  price: number;
  area: number;
  rentPerMonth?: number;
}

export interface PropertyFilters {  
  type?: PropertyType;
  status?: PropertyStatus;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

// --- INVESTMENT ---
export interface Investment {
  id: string;
  userId: string;
  propertyId: string;
  purchasePrice: number;
  downPayment: number;
  mortgageRate?: number;
  mortgageTerm?: number;
  expectedRentPerMonth: number;
  expenses: number;
  createdAt: string;
}

export interface InvestmentAnalysis {
  monthlyMortgagePayment: number;
  monthlyCashFlow: number;
  annualROI: number;
  paybackYears: number | null;
}

export interface CreateInvestmentDto {
  propertyId: string;
  purchasePrice: number;
  downPayment: number;
  mortgageRate?: number;
  mortgageTerm?: number;
  expectedRentPerMonth: number;
  expenses: number;
}

// --- API ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}