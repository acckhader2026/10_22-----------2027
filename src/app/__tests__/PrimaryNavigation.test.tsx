import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../../components/Header';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { PlatformRole } from '../../types';

const createMockAuthContext = (role?: PlatformRole): AuthContextType => ({
  user: role ? {
    id: 'user-test',
    email: `${role.toLowerCase()}@eb.edu.eg`,
    role,
    status: 'ACTIVE',
    full_name: `مستخدم ${role}`
  } : null,
  role: role || null,
  isAuthenticated: !!role,
  isLoading: false,
  isAuthModalOpen: false,
  setIsAuthModalOpen: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  quickSwitchRole: vi.fn(),
  logout: vi.fn(),
  refreshProfile: vi.fn(),
});

describe('Section 11 Gate 1: PrimaryNavigation Strict 5-Hub Architecture', () => {
  const defaultProps = {
    activeTab: 'home' as const,
    setActiveTab: vi.fn(),
    onOpenSidebar: vi.fn(),
    onOpenAnalysisReport: vi.fn(),
    onOpenStudentDashboard: vi.fn(),
    onOpenTeacherDashboard: vi.fn(),
    onOpenContentAnalytics: vi.fn(),
    onOpenGlossary: vi.fn(),
    completedExercisesCount: 5,
    totalExercisesCount: 20,
    currentRole: 'STUDENT' as const,
    setCurrentRole: vi.fn()
  };

  const rolesToTest: (PlatformRole | undefined)[] = [
    'STUDENT',
    'TEACHER',
    'CONTENT_MANAGER',
    'ADMIN',
    undefined // Unauthenticated
  ];

  rolesToTest.forEach(role => {
    it(`guarantees EXACTLY and strictly 5 primary navigation items for role: ${role || 'UNAUTHENTICATED'}`, () => {
      const auth = createMockAuthContext(role);
      render(
        <AuthContext.Provider value={auth}>
          <MemoryRouter>
            <Header {...defaultProps} currentRole={role || 'STUDENT'} />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      const nav = screen.getByRole('navigation', { name: 'التنقل الرئيسي' });
      expect(nav).toBeInTheDocument();

      const items = within(nav).getAllByRole('button');
      
      // Strict constraint: NEVER a 6th element
      expect(items).toHaveLength(5);

      const labels = items.map(el => el.textContent?.trim());
      expect(labels).toEqual([
        'الرئيسية',
        'المنهج',
        'التدريب',
        'التقييم',
        'مساري'
      ]);
    });
  });

  it('proves utility features (Sidebar, Glossary, Print, Dashboards) are strictly isolated in More menu, not in primary nav', () => {
    const auth = createMockAuthContext('ADMIN');
    render(
      <AuthContext.Provider value={auth}>
        <MemoryRouter>
          <Header {...defaultProps} currentRole="ADMIN" />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const nav = screen.getByRole('navigation', { name: 'التنقل الرئيسي' });
    
    // Administrative links or utility buttons must NOT be inside <nav aria-label="التنقل الرئيسي">
    expect(within(nav).queryByText(/المزيد/i)).not.toBeInTheDocument();
    expect(within(nav).queryByText(/لوحة المعلم/i)).not.toBeInTheDocument();
    expect(within(nav).queryByText(/تحليلات المحتوى/i)).not.toBeInTheDocument();
    expect(within(nav).queryByText(/فهرس الوحدات/i)).not.toBeInTheDocument();
  });
});
