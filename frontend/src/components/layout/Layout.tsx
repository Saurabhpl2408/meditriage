import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { EmergencyBanner } from './EmergencyBanner';
import { useApp } from '@/context/AppContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { symptoms } = useApp();
  
  // Check for red flag symptoms
  const hasRedFlags = symptoms.some(s => s.severity === 'CRITICAL');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      {hasRedFlags && <EmergencyBanner />}
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}