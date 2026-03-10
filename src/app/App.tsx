import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { HealthProvider } from './context/HealthContext';
import { EaseModeProvider } from './context/EaseModeContext';
import { SheetProvider } from './context/SheetContext';
import { Toaster } from 'sonner';
import { Layout } from './components/layout';
import { Home } from './pages/Home';
import { Activity } from './pages/Activity';
import { EaseMode } from './pages/EaseMode';

export default function App() {
  return (
    <HealthProvider>
      <EaseModeProvider>
      <SheetProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="activity" element={<Activity />} />
              <Route path="tracker" element={<Activity />} />
              <Route path="lighting" element={<EaseMode />} />
              <Route path="ease-mode" element={<EaseMode />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" expand={true} richColors />
      </SheetProvider>
      </EaseModeProvider>
    </HealthProvider>
  );
}
