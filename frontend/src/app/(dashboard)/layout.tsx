import Navbar from '@/components/layout/Navbar';
import SupportButton from '@/components/layout/SupportTicketModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
      <SupportButton />  
    </div>
  );
}