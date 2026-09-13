import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UnitMapAndOutcomes } from '../components/UnitMapAndOutcomes';
import { NotFoundPage } from './NotFoundPage';
import { normalizeUnitSlug, getSlugsFromLessonIndex } from '../routing/routeParams';

export const UnitPage: React.FC = () => {
  const { unitSlug } = useParams<{ unitSlug: string }>();
  const navigate = useNavigate();

  const normalizedUnit = normalizeUnitSlug(unitSlug);

  if (!normalizedUnit) {
    return (
      <NotFoundPage 
        message={`الوحدة المطلوبة "${unitSlug || ''}" غير موجودة. يتضمن المنهاج حالياً 3 وحدات: unit-1, unit-2, و unit-3.`}
        suggestedPath="/curriculum"
      />
    );
  }

  const handleSelectLesson = (lessonIndex: number) => {
    const { unitSlug: targetUnit, lessonSlug } = getSlugsFromLessonIndex(lessonIndex);
    navigate(`/curriculum/${targetUnit}/lessons/${lessonSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-4">
      <UnitMapAndOutcomes
        key={normalizedUnit}
        initialUnitId={normalizedUnit}
        onSelectLesson={handleSelectLesson}
      />
    </div>
  );
};
