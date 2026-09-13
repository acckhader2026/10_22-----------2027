import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AssessmentPage } from '../AssessmentPage';
import { QuestionBankPage } from '../QuestionBankPage';
import { MockExamPage } from '../MockExamPage';
import { UnitReviewPage } from '../UnitReviewPage';

describe('Section 11 Gate 6: AssessmentHubPage & Route Separation Suite', () => {
  it('renders the central Assessment Hub with direct links to all assessment modules', () => {
    render(
      <MemoryRouter initialEntries={['/assessment']}>
        <Routes>
          <Route path="/assessment" element={<AssessmentPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/منظومة التقويم والتحقق المعياري/i)).toBeInTheDocument();
    expect(screen.getAllByText(/بنك الأسئلة/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/المراجعات التركيبية/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/الامتحانات المحاكية/i).length).toBeGreaterThanOrEqual(1);
  });

  it('proves Question Bank is an independent route component at /assessment/question-bank', () => {
    render(
      <MemoryRouter initialEntries={['/assessment/question-bank']}>
        <Routes>
          <Route path="/assessment/question-bank" element={<QuestionBankPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/بنك الأسئلة/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/بنك الأسئلة \(130 سؤالاً\)/i)).toBeInTheDocument();
  });

  it('proves Mock Exam is an independent route component at /assessment/mock-exams', () => {
    render(
      <MemoryRouter initialEntries={['/assessment/mock-exams']}>
        <Routes>
          <Route path="/assessment/mock-exams" element={<MockExamPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/الامتحانات المحاكية/i).length).toBeGreaterThanOrEqual(1);
  });

  it('proves Unit Reviews is an independent route component at /assessment/unit-tests', () => {
    render(
      <MemoryRouter initialEntries={['/assessment/unit-tests']}>
        <Routes>
          <Route path="/assessment/unit-tests" element={<UnitReviewPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/المراجعات التركيبية/i).length).toBeGreaterThanOrEqual(1);
  });
});
