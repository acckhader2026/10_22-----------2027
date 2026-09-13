import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { curriculumRegistry } from '../CurriculumRegistry';
import { UnitSpec } from '../CurriculumModel';
import { CurriculumPage } from '../../../pages/CurriculumPage';
import { UnitPage } from '../../../pages/UnitPage';

const fixtureUnit3: UnitSpec = {
  id: 'unit-3-fixture',
  unitNumber: 3,
  subjectCode: 'ACC-EB-SEC3',
  titleAr: 'الوحدة الثالثة: محاسبة التكاليف والمحاسبة الإدارية (Fixture)',
  descriptionAr: 'وحدة معيارية لاختبار قابلية التوسع الهندسي لمنصة البكالوريا المصرية وإثبات عدم وجود قيود هاردكود.',
  totalNominalMarks: 100,
  lessons: [
    {
      id: 'u3-lesson-1',
      lessonNumber: 1,
      unitId: 'unit-3-fixture',
      titleAr: 'مفاهيم التكاليف وتبويب عناصرها',
      subtitleAr: 'التكاليف المباشرة وغير المباشرة، الثابتة والمتغيرة',
      textbookPages: [150, 165],
      nominalWeight: 10,
      objectives: [
        {
          id: 'LO-U3-L1-01',
          code: 'LO-3.1.1',
          lessonId: 'u3-lesson-1',
          titleAr: 'التمييز بين التكاليف المباشرة والتكاليف غير المباشرة',
          taxonomy: 'Understand',
          cognitiveDomain: 'KNOWLEDGE',
          targetDifficulty: 'intermediate',
          weightPercentage: 5,
          bookPageRef: 152,
          primaryMisconceptions: ['الخلط بين التكاليف الثابتة والتكاليف المباشرة'],
          conceptIds: ['cost-classification'],
          isJRERequired: false
        }
      ]
    },
    {
      id: 'u3-lesson-2',
      lessonNumber: 2,
      unitId: 'unit-3-fixture',
      titleAr: 'نقطة التعادل وهامش المساهمة',
      subtitleAr: 'تحليل العلاقة بين التكلفة والحجم والربح (CVP Analysis)',
      textbookPages: [166, 180],
      nominalWeight: 15,
      objectives: [
        {
          id: 'LO-U3-L2-01',
          code: 'LO-3.2.1',
          lessonId: 'u3-lesson-2',
          titleAr: 'حساب نقطة التعادل بالكمية والقيمة',
          taxonomy: 'Apply',
          cognitiveDomain: 'APPLICATION',
          targetDifficulty: 'intermediate',
          weightPercentage: 10,
          bookPageRef: 170,
          primaryMisconceptions: ['إهمال التكاليف الثابتة عند حساب نقطة التعادل'],
          conceptIds: ['break-even-analysis'],
          isJRERequired: true
        }
      ]
    }
  ]
};

describe('GATE 3.3: Curriculum Dynamic Scalability Suite (Zero-Hardcode Verification)', () => {
  beforeEach(() => {
    // Dynamically register third unit fixture before test
    curriculumRegistry.registerUnit(fixtureUnit3);
  });

  afterEach(() => {
    // Unregister fixture and reset back to canonical baseline (Units 1 & 2)
    curriculumRegistry.unregisterUnit('unit-3-fixture');
    curriculumRegistry.resetUnits();
  });

  it('Scalability Requirement 1: CurriculumPage automatically renders third unit without modifying component code', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum']}>
        <CurriculumPage />
      </MemoryRouter>
    );

    // Verify presence of Unit 3 fixture rendered dynamically
    expect(screen.getByText('الوحدة الثالثة: محاسبة التكاليف والمحاسبة الإدارية (Fixture)')).toBeInTheDocument();
    expect(screen.getByText('مفاهيم التكاليف وتبويب عناصرها')).toBeInTheDocument();
    expect(screen.getByText('نقطة التعادل وهامش المساهمة')).toBeInTheDocument();

    // Verify link to unit-3-fixture is generated
    const unitLinks = screen.getAllByRole('link', { name: /استعراض خريطة الوحدة/i });
    expect(unitLinks.some(link => link.getAttribute('href') === '/curriculum/unit-3-fixture')).toBe(true);
  });

  it('Scalability Requirement 2: Unified UnitPage dynamically renders unit-3-fixture without creating a new component', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum/unit-3-fixture']}>
        <Routes>
          <Route path="/curriculum/:unitSlug" element={<UnitPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify that 404 is NOT triggered
    expect(screen.queryByText(/الوحدة المطلوبة.*غير موجودة/i)).not.toBeInTheDocument();

    // Verify Unit 3 title and description are rendered by the unified UnitPage
    expect(screen.getByText('الوحدة الثالثة: محاسبة التكاليف والمحاسبة الإدارية (Fixture)')).toBeInTheDocument();
    expect(screen.getByText(/وحدة معيارية لاختبار قابلية التوسع الهندسي/i)).toBeInTheDocument();

    // Verify Unit 3 lessons appear in the building roadmap
    expect(screen.getByText('مفاهيم التكاليف وتبويب عناصرها')).toBeInTheDocument();
    expect(screen.getByText('نقطة التعادل وهامش المساهمة')).toBeInTheDocument();
  });

  it('Scalability Requirement 3: Cleanup guarantees zero pollution of production curriculum data', () => {
    curriculumRegistry.unregisterUnit('unit-3-fixture');
    curriculumRegistry.resetUnits();

    const units = curriculumRegistry.getUnits();
    expect(units).toHaveLength(2);
    expect(units.map(u => u.id)).toEqual(['unit-1', 'unit-2']);
    expect(curriculumRegistry.getUnitById('unit-3-fixture')).toBeUndefined();
  });
});
