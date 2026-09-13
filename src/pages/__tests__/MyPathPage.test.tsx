import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MyPathPage } from '../MyPathPage';
import { apiClient } from '../../api/apiClient';
import { AuthContext, AuthContextType } from '../../context/AuthContext';

vi.mock('../../api/apiClient', () => ({
  apiClient: {
    request: vi.fn(),
  },
}));

const mockAuth: AuthContextType = {
  user: { id: 'u1', email: 'test@student.eb', role: 'STUDENT', status: 'ACTIVE', full_name: 'طالب اختباري' },
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
};

describe('Section 11 Gate 7: MyPathPage (Adaptive Mastery) Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders INSUFFICIENT_DATA status gracefully for new students with 0 attempts', async () => {
    // Mock API returning insufficient data
    vi.mocked(apiClient.request).mockImplementation(async (endpoint: string) => {
      if (endpoint === '/api/progress/student') {
        return {
          status: 'INSUFFICIENT_DATA',
          totalAttempts: 0,
          compositeMastery: 0,
          confidence: 0,
          masteryComponents: {
            recallAccuracy: 0,
            applicationProficiency: 0,
            analysisMastery: 0,
            stabilityScore: 0
          }
        };
      }
      if (endpoint === '/api/adaptive/path') {
        return {
          adaptivePath: {
            prescriptions: [],
            nextLearningStep: null
          }
        };
      }
      return {};
    });

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/my-path']}>
          <Routes>
            <Route path="/my-path" element={<MyPathPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/مسار الإتقان والتعلم التكيفي/i)).toBeInTheDocument();
    });

    // Verify presence of insufficient data indicator
    expect(screen.getByText('البيانات غير كافية لتقدير موثوق')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders adaptive recommendations when attempts exist', async () => {
    vi.mocked(apiClient.request).mockImplementation(async (endpoint: string) => {
      if (endpoint === '/api/progress/student') {
        return {
          status: 'PROFICIENT',
          totalAttempts: 15,
          compositeMastery: 85,
          confidence: 90,
          masteryComponents: {
            recallAccuracy: 90,
            applicationProficiency: 82,
            analysisMastery: 84,
            stabilityScore: 85
          }
        };
      }
      if (endpoint === '/api/adaptive/path') {
        return {
          adaptivePath: {
            prescriptions: [
              {
                conceptId: 'depreciation-methods',
                conceptTitle: 'طرق الإهلاك المحاسبي',
                severity: 'HIGH',
                prescribedAction: 'مراجعة الدرس الرابع وإعادة حل التمرين رقم 2',
                targetLessonId: 'lesson-4'
              }
            ],
            nextLearningStep: {
              lessonId: 'lesson-5',
              title: 'التسويات الجردية المتقدمة'
            }
          }
        };
      }
      return {};
    });

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/my-path']}>
          <Routes>
            <Route path="/my-path" element={<MyPathPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/85%/i)).toBeInTheDocument();
    });

    expect(screen.getByText('بمستوى ثقة إحصائي: 90%')).toBeInTheDocument();
  });
});
