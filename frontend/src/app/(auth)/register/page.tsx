'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { RegisterDto } from '@/lib/types';

const inputClass = "w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 text-sm";

const perks = [
  'Анализ ROI и Cash Flow',
  'Ипотечный калькулятор',
  'Публикация объектов',
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterDto>();

  const onSubmit = async (dto: RegisterDto) => {
    try {
      setIsLoading(true);
      setError('');
      const { user, token } = await authApi.register(dto);
      setAuth(user, token);
      router.push('/dashboard');
    } catch {
      setError('Ошибка регистрации. Email уже занят.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Логотип */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-200 mb-4"
          >
            <Building2 className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">
            Estate<span className="gradient-text">Hub</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Создайте аккаунт бесплатно</p>
        </div>

        {/* Перки */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {perks.map(perk => (
            <div key={perk} className="flex items-center gap-1.5 text-xs text-gray-500">
              <CheckCircle className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
              {perk}
            </div>
          ))}
        </div>

        {/* Карточка */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Имя */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Имя</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('name', { required: 'Введите имя' })}
                  placeholder="Александр"
                  className={inputClass}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('email', {
                    required: 'Введите email',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Некорректный email' }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Пароль */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('password', {
                    required: 'Введите пароль',
                    minLength: { value: 6, message: 'Минимум 6 символов' }
                  })}
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-100 rounded-xl p-3"
              >
                <p className="text-red-500 text-sm">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-violet-200 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Создать аккаунт
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium transition-colors">
              Войти
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}