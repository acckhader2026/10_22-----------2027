import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../Header';
import { MobileNavigation } from '../MobileNavigation';
import { Sidebar } from '../Sidebar';
import { AuthContext, AuthContextType } from '../../context/AuthContext';

const createMockAuthContext = (overrides?: Partial<AuthContextType>): AuthContextType => ({
  user: {
    id: 'user-1',
    email: 'student@eb.edu.eg',
    role: 'STUDENT',
    status: 'ACTIVE',
    full_name: 'طالب اختبار'
  },
  role: 'STUDENT',
  isAuthenticated: true,
  isLoading: false,
  isAuthModalOpen: false,
  setIsAuthModalOpen: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  quickSwitchRole: vi.fn(),
  logout: vi.fn(),
  refreshProfile: vi.fn(),
  ...overrides,
});

describe('Navigation Architecture Compliance Suite (Section 9 Rules)', () => {
  const defaultHeaderProps = {
    activeTab: 'home' as const,
    setActiveTab: vi.fn(),
    onOpenSidebar: vi.fn(),
    onOpenAnalysisReport: vi.fn(),
    onOpenStudentDashboard: vi.fn(),
    onOpenTeacherDashboard: vi.fn(),
    onOpenContentAnalytics: vi.fn(),
    onOpenGlossary: vi.fn(),
    completedExercisesCount: 10,
    totalExercisesCount: 20,
    currentRole: 'STUDENT' as const,
    setCurrentRole: vi.fn()
  };

  it('Gate 9.1: Header primary navigation must contain strictly and exactly 5 items', () => {
    const authValue = createMockAuthContext();
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Header {...defaultHeaderProps} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const primaryNav = screen.getByRole('navigation', { name: 'التنقل الرئيسي' });
    expect(primaryNav).toBeInTheDocument();

    const buttons = within(primaryNav).getAllByRole('button');
    // STRICT CONTRACT: Exactly 5 items in Primary Navigation
    expect(buttons).toHaveLength(5);

    const buttonLabels = buttons.map(btn => btn.textContent?.trim());
    expect(buttonLabels).toEqual([
      'الرئيسية',
      'المنهج',
      'التدريب',
      'التقييم',
      'مساري'
    ]);
  });

  it('Gate 9.2: Header primary navigation buttons trigger proper tab activations', () => {
    const setActiveTabMock = vi.fn();
    const authValue = createMockAuthContext();
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Header {...defaultHeaderProps} setActiveTab={setActiveTabMock} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const primaryNav = screen.getByRole('navigation', { name: 'التنقل الرئيسي' });
    
    fireEvent.click(within(primaryNav).getByText('الرئيسية'));
    expect(setActiveTabMock).toHaveBeenCalledWith('home');

    fireEvent.click(within(primaryNav).getByText('المنهج'));
    expect(setActiveTabMock).toHaveBeenCalledWith('curriculum');

    fireEvent.click(within(primaryNav).getByText('التدريب'));
    expect(setActiveTabMock).toHaveBeenCalledWith('training');

    fireEvent.click(within(primaryNav).getByText('التقييم'));
    expect(setActiveTabMock).toHaveBeenCalledWith('assessment');

    fireEvent.click(within(primaryNav).getByText('مساري'));
    expect(setActiveTabMock).toHaveBeenCalledWith('mypath');
  });

  it('Gate 9.3: More/Utility dropdown is cleanly isolated and provides secondary utilities', () => {
    const onOpenSidebarMock = vi.fn();
    const onOpenGlossaryMock = vi.fn();
    const authValue = createMockAuthContext();
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <Header 
            {...defaultHeaderProps} 
            onOpenSidebar={onOpenSidebarMock}
            onOpenGlossary={onOpenGlossaryMock}
          />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const moreButton = screen.getByRole('button', { name: /المزيد والمرافق/i });
    expect(moreButton).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Toggle open
    fireEvent.click(moreButton);
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    // Verify presence of utility items
    expect(within(menu).getByText('فهرس الوحدات والمحتوى')).toBeInTheDocument();
    expect(within(menu).getByText('قاموس المصطلحات والمبادئ')).toBeInTheDocument();
    expect(within(menu).getByText('تصدير وطباعة (PDF)')).toBeInTheDocument();
    expect(within(menu).getByText('تقارير المطابقة والمنهجية')).toBeInTheDocument();

    // Interacting with sidebar trigger
    fireEvent.click(within(menu).getByText('فهرس الوحدات والمحتوى'));
    expect(onOpenSidebarMock).toHaveBeenCalledTimes(1);
  });

  it('Gate 9.4: MobileNavigation renders exactly the 5 primary routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MobileNavigation />
      </MemoryRouter>
    );

    const mobileNav = screen.getByRole('navigation', { name: 'شريط التنقل السفلي للهاتف' });
    expect(mobileNav).toBeInTheDocument();

    const links = within(mobileNav).getAllByRole('link');
    expect(links).toHaveLength(5);

    const linkHrefs = links.map(link => link.getAttribute('href'));
    expect(linkHrefs).toEqual([
      '/',
      '/curriculum',
      '/training',
      '/assessment',
      '/my-path'
    ]);

    const labels = links.map(link => link.textContent?.trim());
    expect(labels).toEqual([
      'الرئيسية',
      'المنهج',
      'التدريب',
      'التقييم',
      'مساري'
    ]);
  });

  it('Gate 9.5: Sidebar contains all 5 primary sections with proper navigation targets', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar 
          isOpen={true} 
          onClose={vi.fn()} 
          onSelectLesson={vi.fn()} 
          onSelectUnit={vi.fn()} 
        />
      </MemoryRouter>
    );

    expect(screen.getByText('الأقسام الرئيسية (المحاور الخمسة)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /الرئيسية/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /المنهج والوحدات/i })).toHaveAttribute('href', '/curriculum');
    expect(screen.getByRole('link', { name: /التدريب والمحاكيات/i })).toHaveAttribute('href', '/training');
    expect(screen.getByRole('link', { name: /التقييم والامتحانات/i })).toHaveAttribute('href', '/assessment');
    expect(screen.getByRole('link', { name: /مساري \(الإتقان التكيفي\)/i })).toHaveAttribute('href', '/my-path');
  });
});
