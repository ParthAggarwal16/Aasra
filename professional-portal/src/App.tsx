import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProfessionalLayout } from './layouts/ProfessionalLayout';
import { DashboardPage } from './pages/professional/DashboardPage';
import { CasesPage } from './pages/professional/CasesPage';
import { CaseDetailPage } from './pages/professional/CaseDetailPage';
import { InterventionPage } from './pages/professional/InterventionPage';
import { AlertsPage } from './pages/professional/AlertsPage';
import { FollowUpsPage } from './pages/professional/FollowUpsPage';
import { SettingsPage } from './pages/professional/SettingsPage';
import { HelpPage } from './pages/professional/HelpPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ProfessionalLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/intervention/:id" element={<InterventionPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/follow-ups" element={<FollowUpsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </ProfessionalLayout>
    </BrowserRouter>
  );
};

export default App;
