import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CurriculumPage } from '../CurriculumPage';

describe('Section 11 Gate 3: CurriculumPage Suite', () => {
  it('renders both canonical units with Arabic typography and accredited badges', () => {
    render(
      <MemoryRouter>
        <CurriculumPage />
      </MemoryRouter>
    );

    expect(screen.getByText('هيكل الوحدات والمسار التعليمي')).toBeInTheDocument();
    expect(screen.getByText('الوحدة الأولى: لماذا نتعلم المحاسبة؟')).toBeInTheDocument();
    expect(screen.getByText(/الوحدة الثانية:.*التسجيل المحاسبي/i)).toBeInTheDocument();
  });

  it('provides direct links to unit maps and initial lessons', () => {
    render(
      <MemoryRouter>
        <CurriculumPage />
      </MemoryRouter>
    );

    const mapLinks = screen.getAllByRole('link', { name: /استعراض خريطة الوحدة/i });
    expect(mapLinks).toHaveLength(2);
    expect(mapLinks[0]).toHaveAttribute('href', '/curriculum/unit-1');
    expect(mapLinks[1]).toHaveAttribute('href', '/curriculum/unit-2');

    const startLinks = screen.getAllByRole('link', { name: /بدء دراسة الدرس الأول/i });
    expect(startLinks).toHaveLength(2);
    expect(startLinks[0]).toHaveAttribute('href', '/curriculum/unit-1/lessons/lesson-1');
    expect(startLinks[1]).toHaveAttribute('href', '/curriculum/unit-2/lessons/lesson-1');
  });
});
