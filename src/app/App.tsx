import * as React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { HealthProvider } from './context/HealthContext';
import { EaseModeProvider } from './context/EaseModeContext';
import { SheetProvider } from './context/SheetContext';
import { Toaster } from 'sonner';
import { Layout } from './components/layout';
import { Home } from './pages/Home';
import { Activity } from './pages/Activity';
import { EaseMode } from './pages/EaseMode';
import { Insights } from './pages/Insights';
import { Tracker } from './pages/Tracker';
import { Onboarding } from './components/onboarding';
import { Recovery } from './components/recovery';
import { Privacy } from './components/privacy';
import { Timeline } from './components/timeline';
import { LightTracker } from './components/light-tracker';
import { Insights as InsightsPatterns } from './components/insights';
import { EnvironmentScan } from './components/environment-scan';
import { ComfortMode } from './components/comfort-mode';
import { EyeComfort } from './components/eye-comfort';

export default function App() {
  return (
    <HealthProvider>
      <EaseModeProvider>
      <SheetProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Home is the landing page */}
              <Route index element={<Home />} />

              {/* Main pages (nav menu) */}
              <Route path="home" element={<Home />} />
              <Route path="activity" element={<Activity />} />
              <Route path="lighting" element={<EaseMode />} />

              {/* Secondary pages */}
              <Route path="timeline" element={<Timeline />} />
              <Route path="light-tracker" element={<LightTracker />} />
              <Route path="ease" element={<EaseMode />} />
              <Route path="patterns" element={<InsightsPatterns />} />
              <Route path="tracker" element={<Tracker />} />
              <Route path="insights" element={<Insights />} />
              <Route path="recovery" element={<Recovery />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="scan" element={<EnvironmentScan />} />
              <Route path="comfort" element={<ComfortMode />} />
              <Route path="eye-comfort" element={<EyeComfort />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
        <Toaster position="top-center" expand={true} richColors />
      </SheetProvider>
      </EaseModeProvider>
    </HealthProvider>
  );
}
