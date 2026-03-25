import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SupportTicketModal from '../components/layout/SupportTicketModal';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'EstateHub — Marketplace недвижимости',
  description: 'Покупка, аренда и инвестиционный анализ недвижимости',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
        <SupportTicketModal />
      </body>
    </html>
  );
}