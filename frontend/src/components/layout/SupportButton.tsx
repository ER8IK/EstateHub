'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, LifeBuoy, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import api from '@/lib/api/axios';

type Priority = 'High' | 'Average' | 'Low';

const priorityColors: Record<Priority, string> = {
  High: 'border-red-400 bg-red-50 text-red-700',
  Average: 'border-amber-400 bg-amber-50 text-amber-700',
  Low: 'border-green-400 bg-green-50 text-green-700',
};

export default function SupportButton() {
  const { isAuthenticated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState<Priority>('Average');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      await api.post('/tickets', {
        summary,
        priority,
        pageUrl: window.location.href,
        inventoryTitle: document.title,
      });
      setSuccess(true);
      setSummary('');
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 2000);
    } catch {
      setError('Ошибка отправки. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Кнопка — фиксированная в правом нижнем углу */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 py-3 rounded-2xl shadow-lg shadow-violet-200 hover:opacity-90 transition-all text-sm font-medium"
      >
        <LifeBuoy className="w-4 h-4" />
        Поддержка
      </button>

      {/* Модалка */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto border border-gray-100"
              >
                {/* Шапка */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5 text-violet-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Создать тикет</h2>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Успех */}
                {success ? (
                  <div className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900">Тикет отправлен!</p>
                    <p className="text-gray-500 text-sm mt-1">Файл загружен в OneDrive</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Описание */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Описание проблемы
                      </label>
                      <textarea
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        placeholder="Опишите проблему..."
                        rows={4}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-gray-50 resize-none"
                      />
                    </div>

                    {/* Приоритет */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Приоритет</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['High', 'Average', 'Low'] as Priority[]).map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                              priority === p
                                ? priorityColors[p]
                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {p === 'High' ? 'Высокий' : p === 'Average' ? 'Средний' : 'Низкий'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Текущая страница */}
                    <div className="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-400">
                      Страница: {typeof window !== 'undefined' ? window.location.pathname : ''}
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {/* Кнопки */}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl text-sm font-medium transition-all"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || !summary.trim()}
                        className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
                      >
                        {isLoading
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : 'Отправить'
                        }
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}