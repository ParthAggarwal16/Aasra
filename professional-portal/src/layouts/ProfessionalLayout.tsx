import React from 'react';
import { useLocation } from 'react-router-dom';
import { SideNavBar } from '../components/professional/SideNavBar';
import { TopNavBar } from '../components/professional/TopNavBar';

interface ProfessionalLayoutProps {
  children: React.ReactNode;
}

export const ProfessionalLayout: React.FC<ProfessionalLayoutProps> = ({ children }) => {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Professional Dashboard';
    if (path === '/cases') return 'Cases Overview';
    if (path.startsWith('/cases/')) return 'Case Details';
    if (path.startsWith('/intervention/')) return 'Action Recommendation';
    if (path === '/alerts') return 'Security & Support Alerts';
    if (path === '/follow-ups') return 'Support Follow-ups';
    if (path === '/settings') return 'Portal Settings';
    if (path === '/help') return 'Help Center';
    return 'AASRA Support Portal';
  };

  return (
    <div className="flex h-full bg-background overflow-hidden">
      <SideNavBar />
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <TopNavBar title={getTitle()} />
        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
