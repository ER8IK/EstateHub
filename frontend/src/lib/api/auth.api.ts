import api from './axios';
import { AuthResponse, LoginDto, RegisterDto, ApiResponse } from '../types';

export const authApi = {
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', dto);
    return res.data.data;
  },

  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', dto);
    return res.data.data;
  },
};