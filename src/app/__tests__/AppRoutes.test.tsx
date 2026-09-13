import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../AppRoutes';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { apiClient } from '../../api/apiClient';

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

const renderWithRouter = (
  initialEntries: string[] = ['/'],
  authOverrides?: Partial<AuthContextType>
) => {
  const authValue = createMockAuthContext(authOverrides);
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Component-Level: AppRoutes Rendering & Navigation Suite', () => {
  beforeEach(() => {
    vi.spyOn(apiClient, 'request').mockImplementation(async () => {
      return { metrics: { avgAccuracyRate: 85, atRiskStudentsCount: 0 }, atRiskStudents: [] };
    });
  });

  describe('404 Not Found Page Rendering', () => {
    it('renders 404 page with Arabic error message for undefined route', () => {
      renderWithRouter(['/non-existent-page-xyz']);
      
      expect(screen.getByText(/خطأ 404 • المسار غير معرّف/i)).toBeInTheDocument();
      expect(screen.getByText(/الصفحة غير موجودة/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /استعراض المنهاج المعتمد/i })).toHaveAttribute('href', '/curriculum');
    });

    it('renders 404 page for invalid unit slug (/curriculum/unit-99)', () => {
      renderWithRouter(['/curriculum/unit-99']);
      
      expect(screen.getByText(/خطأ 404 • المسار غير معرّف/i)).toBeInTheDocument();
      expect(screen.getByText(/الوحدة المطلوبة "unit-99" غير موجودة/i)).toBeInTheDocument();
    });

    it('renders 404 page for invalid lesson slug (/curriculum/unit-1/lessons/lesson-99)', () => {
      renderWithRouter(['/curriculum/unit-1/lessons/lesson-99']);
      
      expect(screen.getByText(/خطأ 404 • المسار غير معرّف/i)).toBeInTheDocument();
      expect(screen.getByText(/الدرس "lesson-99" غير موجود في الوحدة الأولى/i)).toBeInTheDocument();
    });
  });

  describe('Role-Based Route Protection & Unauthorized Page', () => {
    it('redirects STUDENT from /teacher-dashboard to /unauthorized and renders 403 Forbidden', () => {
      renderWithRouter(['/teacher-dashboard'], { role: 'STUDENT' });
      
      expect(screen.getByText(/صلاحيات غير كافية • 403 Forbidden/i)).toBeInTheDocument();
      expect(screen.getByText(/غير مصرح بالدخول/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /تسجيل الدخول بحساب آخر/i })).toBeInTheDocument();
    });

    it('allows TEACHER to access /teacher-dashboard and renders Teacher Dashboard', async () => {
      renderWithRouter(['/teacher-dashboard'], { role: 'TEACHER' });
      
      await waitFor(() => {
        expect(screen.getByText(/لوحة تحليلات المعلم والأداء الصفي/i)).toBeInTheDocument();
      });
    });

    it('redirects STUDENT from /content-analytics to /unauthorized', () => {
      renderWithRouter(['/content-analytics'], { role: 'STUDENT' });
      
      expect(screen.getByText(/صلاحيات غير كافية • 403 Forbidden/i)).toBeInTheDocument();
      expect(screen.getByText(/غير مصرح بالدخول/i)).toBeInTheDocument();
    });

    it('allows CONTENT_MANAGER to access /content-analytics and renders Content Analytics', async () => {
      renderWithRouter(['/content-analytics'], { role: 'CONTENT_MANAGER' });
      
      await waitFor(() => {
        expect(screen.getByText(/لوحة جودة المحتوى والتحليل السيكومتري/i)).toBeInTheDocument();
      });
    });
  });

  describe('Deep Linking to Canonical Lessons & Curriculum', () => {
    it('renders canonical Lesson 1 of Unit 1 directly from deep link', async () => {
      renderWithRouter(['/curriculum/unit-1/lessons/lesson-1']);
      
      // Verify lesson title and unit subtitle are in DOM
      expect(screen.getByText(/ماهية المحاسبة وأسسها ومبادئها الأساسية/i)).toBeInTheDocument();
      expect(screen.getByText(/الوحدة الأولى • الدرس 1 من 6/i)).toBeInTheDocument();
    });

    it('renders canonical Lesson 3 of Unit 2 directly from deep link', async () => {
      renderWithRouter(['/curriculum/unit-2/lessons/lesson-3']);
      
      expect(screen.getByText(/الوحدة الثانية • الدرس 3 من 6/i)).toBeInTheDocument();
    });

    it('renders curriculum overview from /curriculum', () => {
      renderWithRouter(['/curriculum']);
      
      expect(screen.getByText(/هيكل الوحدات والمسار التعليمي/i)).toBeInTheDocument();
      expect(screen.getByText(/الوحدة الأولى/i)).toBeInTheDocument();
      expect(screen.getByText(/الوحدة الثانية/i)).toBeInTheDocument();
    });
  });

  describe('Legacy Route Redirects & Backward Compatibility', () => {
    it('redirects legacy /welcome to /curriculum', async () => {
      renderWithRouter(['/welcome']);
      await waitFor(() => {
        expect(screen.getByText(/هيكل الوحدات والمسار التعليمي/i)).toBeInTheDocument();
      });
    });

    it('redirects legacy /lessons to /curriculum/unit-1/lessons/lesson-1', async () => {
      renderWithRouter(['/lessons']);
      await waitFor(() => {
        expect(screen.getByText(/ماهية المحاسبة وأسسها ومبادئها الأساسية/i)).toBeInTheDocument();
        expect(screen.getByText(/الوحدة الأولى • الدرس 1 من 6/i)).toBeInTheDocument();
      });
    });

    it('redirects legacy /map to /curriculum/unit-1', async () => {
      renderWithRouter(['/map']);
      await waitFor(() => {
        expect(screen.getByText(/الوحدة الأولى: أساسيات المحاسبة والتقارير المالية/i)).toBeInTheDocument();
      });
    });

    it('redirects legacy /simulator to /training/simulators', async () => {
      renderWithRouter(['/simulator']);
      await waitFor(() => {
        expect(screen.getByText(/ورش العمل والمحاكاة التفاعلية/i)).toBeInTheDocument();
      });
    });

    it('redirects legacy /qbank to /assessment/question-bank', async () => {
      renderWithRouter(['/qbank']);
      await waitFor(() => {
        expect(screen.getByText(/التقويم والقياس السيكومتري/i)).toBeInTheDocument();
      });
    });
  });

  describe('History Navigation & Back/Forward Simulation', () => {
    it('navigates across pages without full reload and responds to navigation history', async () => {
      const user = userEvent.setup();
      
      const TestHarness: React.FC = () => {
        const navigate = useNavigate();
        const location = useLocation();

        return (
          <div>
            <div data-testid="current-pathname">{location.pathname}</div>
            <button onClick={() => navigate('/curriculum')}>Go To Curriculum</button>
            <button onClick={() => navigate('/training/simulators')}>Go To Simulators</button>
            <button onClick={() => navigate(-1)}>Go Back</button>
            <button onClick={() => navigate(1)}>Go Forward</button>
            <AppRoutes />
          </div>
        );
      };

      const authValue = createMockAuthContext();

      render(
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={['/']}>
            <TestHarness />
          </MemoryRouter>
        </AuthContext.Provider>
      );

      // Initially at '/'
      expect(screen.getByTestId('current-pathname')).toHaveTextContent('/');

      // Navigate to /curriculum
      await user.click(screen.getByRole('button', { name: 'Go To Curriculum' }));
      await waitFor(() => {
        expect(screen.getByTestId('current-pathname')).toHaveTextContent('/curriculum');
        expect(screen.getByText(/هيكل الوحدات والمسار التعليمي/i)).toBeInTheDocument();
      });

      // Navigate to /training/simulators
      await user.click(screen.getByRole('button', { name: 'Go To Simulators' }));
      await waitFor(() => {
        expect(screen.getByTestId('current-pathname')).toHaveTextContent('/training/simulators');
        expect(screen.getByText(/ورش العمل والمحاكاة التفاعلية/i)).toBeInTheDocument();
      });

      // Go Back to /curriculum
      await user.click(screen.getByRole('button', { name: 'Go Back' }));
      await waitFor(() => {
        expect(screen.getByTestId('current-pathname')).toHaveTextContent('/curriculum');
        expect(screen.getByText(/هيكل الوحدات والمسار التعليمي/i)).toBeInTheDocument();
      });

      // Go Forward to /training/simulators
      await user.click(screen.getByRole('button', { name: 'Go Forward' }));
      await waitFor(() => {
        expect(screen.getByTestId('current-pathname')).toHaveTextContent('/training/simulators');
        expect(screen.getByText(/ورش العمل والمحاكاة التفاعلية/i)).toBeInTheDocument();
      });
    });
  });
});
