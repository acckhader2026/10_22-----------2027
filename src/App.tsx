import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { FocusModeProvider } from './context/FocusModeContext';
import { CurriculumFilterProvider } from './context/CurriculumFilterContext';
import { AppRoutes } from './app/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <FocusModeProvider>
        <CurriculumFilterProvider>
          <AppRoutes />
        </CurriculumFilterProvider>
      </FocusModeProvider>
    </AuthProvider>
  );
}

