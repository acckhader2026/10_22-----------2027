import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TrainingPage } from '../TrainingPage';

describe('Section 11 Gate 5: TrainingHubPage Suite', () => {
  it('renders the training hub overview and subnavigation options', () => {
    render(
      <MemoryRouter initialEntries={['/training']}>
        <Routes>
          <Route path="/training" element={<TrainingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/ورش العمل والمحاكاة التفاعلية/i)).toBeInTheDocument();
    expect(screen.getAllByText(/محاكي الحسابات T v2/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ورشة التفسير المحاسبي JRE/i).length).toBeGreaterThan(0);
  });

  it('mounts T-Account simulator on /training/simulators sub-route', () => {
    render(
      <MemoryRouter initialEntries={['/training/simulators']}>
        <Routes>
          <Route path="/training/simulators" element={<TrainingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/محاكي الحسابات T/i).length).toBeGreaterThan(0);
  });

  it('mounts JRE workshop on /training/jre sub-route', () => {
    render(
      <MemoryRouter initialEntries={['/training/jre']}>
        <Routes>
          <Route path="/training/jre" element={<TrainingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/ورشة التفسير المحاسبي JRE/i)).toBeInTheDocument();
  });
});
