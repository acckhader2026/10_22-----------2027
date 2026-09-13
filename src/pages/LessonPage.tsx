import React from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { LessonViewer } from '../components/LessonViewer';
import { NotFoundPage } from './NotFoundPage';
import { 
  normalizeUnitSlug, 
  normalizeLessonSlug, 
  isValidLessonSlug, 
  getLessonIndexFromSlugs, 
  getSlugsFromLessonIndex 
} from '../routing/routeParams';

interface LessonOutletContext {
  onOpenGlossaryTerm?: (termId: string) => void;
  onCompleteExercise?: () => void;
  completedExercisesCount?: number;
}

interface LessonPageProps {
  onOpenGlossaryTerm?: (termId: string) => void;
  onCompleteExercise?: () => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  onOpenGlossaryTerm,
  onCompleteExercise
}) => {
  const { unitSlug, lessonSlug } = useParams<{ unitSlug: string; lessonSlug: string }>();
  const navigate = useNavigate();
  const outletCtx = useOutletContext<LessonOutletContext>() || {};

  const effectiveOnCompleteExercise = onCompleteExercise || outletCtx.onCompleteExercise;
  const effectiveOnOpenGlossaryTerm = onOpenGlossaryTerm || outletCtx.onOpenGlossaryTerm;

  const normUnit = normalizeUnitSlug(unitSlug);
  const normLesson = normalizeLessonSlug(lessonSlug);

  // Validate unit slug
  if (!normUnit) {
    return (
      <NotFoundPage
        message={`الوحدة "${unitSlug || ''}" غير صالحة. يرجى اختيار unit-1 أو unit-2.`}
        suggestedPath="/curriculum"
      />
    );
  }

  // Validate lesson slug for this unit
  if (!normLesson || !isValidLessonSlug(normUnit, normLesson)) {
    return (
      <NotFoundPage
        message={`الدرس "${lessonSlug || ''}" غير موجود في ${normUnit === 'unit-1' ? 'الوحدة الأولى' : 'الوحدة الثانية'}. الدروس المتاحة هي من lesson-1 إلى lesson-6.`}
        suggestedPath={`/curriculum/${normUnit}`}
      />
    );
  }

  const currentLessonIndex = getLessonIndexFromSlugs(normUnit, normLesson);

  const handleLessonIndexChange = (newIndex: number) => {
    const { unitSlug: nextUnit, lessonSlug: nextLesson } = getSlugsFromLessonIndex(newIndex);
    navigate(`/curriculum/${nextUnit}/lessons/${nextLesson}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExerciseCompleted = () => {
    if (effectiveOnCompleteExercise) {
      effectiveOnCompleteExercise();
    }
  };

  return (
    <div className="py-2">
      <LessonViewer
        currentLessonIndex={currentLessonIndex}
        setCurrentLessonIndex={handleLessonIndexChange}
        onCompleteExercise={handleExerciseCompleted}
        onOpenGlossaryTerm={effectiveOnOpenGlossaryTerm}
      />
    </div>
  );
};
