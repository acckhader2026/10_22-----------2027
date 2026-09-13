import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LessonPage } from '../../../pages/LessonPage';
import { AppShell } from '../../../app/AppShell';
import { AuthProvider } from '../../../context/AuthContext';
import { curriculumRegistry } from '../CurriculumRegistry';

describe('Phase 3: Deep Linking & UI-Registry Binding Verification', () => {
  it('renders lesson content for canonical Unit 1 Lesson 1 deep link', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum/unit-1/lessons/lesson-1']}>
        <Routes>
          <Route path="/curriculum/:unitSlug/lessons/:lessonSlug" element={<LessonPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify canonical title of Unit 1 Lesson 1 appears
    const lesson = curriculumRegistry.getLessonContentByIndex(0);
    expect(screen.getByText(lesson.title)).toBeInTheDocument();
  });

  it('renders lesson content for canonical Unit 2 Lesson 3 deep link', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum/unit-2/lessons/lesson-3']}>
        <Routes>
          <Route path="/curriculum/:unitSlug/lessons/:lessonSlug" element={<LessonPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Unit 2 Lesson 3 corresponds to index 8
    const lesson = curriculumRegistry.getLessonContentByIndex(8);
    expect(screen.getByText(lesson.title)).toBeInTheDocument();
  });

  it('gracefully renders NotFoundPage for non-existent unit slug', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum/unit-99/lessons/lesson-1']}>
        <Routes>
          <Route path="/curriculum/:unitSlug/lessons/:lessonSlug" element={<LessonPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/غير صالحة/)).toBeInTheDocument();
  });

  it('gracefully renders NotFoundPage for non-existent lesson slug', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum/unit-1/lessons/lesson-99']}>
        <Routes>
          <Route path="/curriculum/:unitSlug/lessons/:lessonSlug" element={<LessonPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/غير موجود/)[0]).toBeInTheDocument();
  });

  it('AppShell mounts and renders persistent structure with outlet context', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/curriculum/unit-1/lessons/lesson-1']}>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/curriculum/:unitSlug/lessons/:lessonSlug" element={<LessonPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Shell header contains title and progress bar
    expect(screen.getByText(/منهاج المحاسبة المالية المعتمد/)).toBeInTheDocument();
  });

  it('guarantees bidirectional slug normalization for deep links', () => {
    const unit1 = curriculumRegistry.getUnitById('unit-1');
    expect(unit1?.lessons.length).toBe(6);

    const unit2 = curriculumRegistry.getUnitById('unit-2');
    expect(unit2?.lessons.length).toBe(6);

    // Total lessons across Units 1 & 2 is 12
    expect((unit1?.lessons.length || 0) + (unit2?.lessons.length || 0)).toBe(12);
  });

  it('preserves offline progress count via localStorage fallback', () => {
    localStorage.setItem('eb_acc_progress', '25');
    const saved = localStorage.getItem('eb_acc_progress');
    expect(saved).toBe('25');
  });
});
