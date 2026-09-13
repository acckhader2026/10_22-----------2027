import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { UnitPage } from '../UnitPage';

describe('Section 11 Gate 4: Unified UnitPage Suite', () => {
  it('renders Unit 1 map and learning outcomes when unitSlug is unit-1', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum/unit-1']}>
        <Routes>
          <Route path="/curriculum/:unitSlug" element={<UnitPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /الوحدة الأولى/i })).toBeInTheDocument();
    expect(screen.getByText(/المسار البنائي لدروس/i)).toBeInTheDocument();
  });

  it('renders Unit 2 map and learning outcomes when unitSlug is unit-2', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum/unit-2']}>
        <Routes>
          <Route path="/curriculum/:unitSlug" element={<UnitPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /الوحدة الثانية/i })).toBeInTheDocument();
    expect(screen.getByText(/المسار البنائي لدروس/i)).toBeInTheDocument();
  });

  it('renders 404 page when an invalid unit slug is accessed', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum/unit-999']}>
        <Routes>
          <Route path="/curriculum/:unitSlug" element={<UnitPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /الصفحة غير موجودة/i })).toBeInTheDocument();
    expect(screen.getByText(/الوحدة المطلوبة "unit-999" غير موجودة/i)).toBeInTheDocument();
  });
});
