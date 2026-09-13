import { evaluateJREArgument } from '../assessment/jre/JREEvaluationEngine';
import { CANONICAL_JRE_RUBRIC } from '../assessment/jre/JRERubric';
import { CANONICAL_UNIT_1 } from '../curriculum/CurriculumModel';
import { blueprintEngine } from '../curriculum/BlueprintEngine';
import { coverageMatrixEngine } from '../assessment/coverage/CoverageMatrixEngine';
import { questionQualityEngine } from '../assessment/quality/QuestionQualityEngine';
import { studentMasteryEngine } from '../analytics/StudentMasteryEngine';
import { adaptiveRemediationEngine } from '../adaptive/AdaptiveRemediationEngine';
import { expandedQuestionBank } from '../../data/expandedQuestionBank';

export function runFullPsychometricSuite() {
  const results: Array<{ testName: string; passed: boolean; details: string }> = [];

  // Test 1: JRE Rubric total marks must equal exactly 20 across 5 dimensions
  const jreCriteriaSum = CANONICAL_JRE_RUBRIC.reduce((acc, c) => acc + c.maxMarks, 0);
  results.push({
    testName: 'JRE Rubric 20-Point Total Integrity',
    passed: CANONICAL_JRE_RUBRIC.length === 5 && jreCriteriaSum === 20,
    details: `Criteria count: ${CANONICAL_JRE_RUBRIC.length}, Sum of 5 Criteria: ${jreCriteriaSum}/20`
  });

  // Test 2: Unit 1 Curriculum Model has exactly 6 lessons and 17 objectives
  const lessonCount = CANONICAL_UNIT_1.lessons.length;
  const totalObjectives = CANONICAL_UNIT_1.lessons.reduce((acc, l) => acc + l.objectives.length, 0);
  results.push({
    testName: 'Canonical Curriculum Structure (Unit 1)',
    passed: lessonCount === 6 && totalObjectives === 17,
    details: `Lessons: ${lessonCount}/6, Objectives: ${totalObjectives}/17`
  });

  // Test 3: Question Bank Blueprint Coverage
  const audit = blueprintEngine.auditQuestionBank(expandedQuestionBank);
  results.push({
    testName: 'Question Bank 100% Objective Traceability',
    passed: audit.coveragePercentage === 100,
    details: `Coverage: ${audit.coveragePercentage}%, Covered: ${audit.coveredObjectives}/17`
  });

  // Test 4: Coverage Matrix Classification
  const matrix = coverageMatrixEngine.generateMatrix(expandedQuestionBank);
  results.push({
    testName: 'Coverage Matrix Quad-Color Balance',
    passed: matrix.cells.length === 17 && matrix.redCellsCount === 0,
    details: `Total cells: ${matrix.cells.length}, RED gap cells: ${matrix.redCellsCount}`
  });

  // Test 5: Psychometric Quality Rules
  const quality = questionQualityEngine.validateBank(expandedQuestionBank);
  results.push({
    testName: 'Question Bank 12-Point Quality Validation',
    passed: quality.criticalIssuesCount === 0 && quality.averageQualityScore >= 90,
    details: `Critical issues: ${quality.criticalIssuesCount}, Quality score: ${quality.averageQualityScore}/100`
  });

  // Test 6: Student Mastery Engine - INSUFFICIENT_DATA Handling
  const emptyMastery = studentMasteryEngine.calculateStudentMastery({
    userId: 'test-user',
    questionAttempts: [],
    examAttempts: []
  });
  results.push({
    testName: 'Student Mastery Engine Zero-Data Integrity',
    passed: emptyMastery.status === 'INSUFFICIENT_DATA' && emptyMastery.compositeMastery === 0 && emptyMastery.confidence === 0,
    details: `Status: ${emptyMastery.status}, Score: ${emptyMastery.compositeMastery}, Confidence: ${emptyMastery.confidence}`
  });

  // Test 7: Student Mastery Engine - Transparent Weighted Formula
  const activeMastery = studentMasteryEngine.calculateStudentMastery({
    userId: 'test-user',
    questionAttempts: [
      { question_id: 'eb-mcq-001', lesson_id: 'lesson-1', is_correct: true, difficulty: 'basic', timestamp: '2026-08-25T10:00:00Z' },
      { question_id: 'eb-mcq-002', lesson_id: 'lesson-1', is_correct: true, difficulty: 'advanced', timestamp: '2026-08-25T10:05:00Z' },
      { question_id: 'eb-mcq-003', lesson_id: 'lesson-1', is_correct: false, difficulty: 'intermediate', timestamp: '2026-08-25T10:10:00Z' }
    ],
    examAttempts: []
  });
  results.push({
    testName: 'Student Mastery Formula Transparency',
    passed: activeMastery.status === 'EVALUATED' && activeMastery.compositeMastery > 0 && activeMastery.accuracyComponent.weight === 0.40,
    details: `Composite: ${activeMastery.compositeMastery}%, Accuracy raw: ${activeMastery.accuracyComponent.rawRate.toFixed(1)}%`
  });

  // Test 8: Adaptive Remediation Engine
  const adaptive = adaptiveRemediationEngine.generatePrescription({
    userId: 'test-user',
    attempts: [
      { question_id: 'eb-mcq-003', lesson_id: 'lesson-1', is_correct: false, difficulty: 'basic' }
    ],
    allQuestions: expandedQuestionBank
  });
  results.push({
    testName: 'Adaptive Remediation Misconception Diagnosis',
    passed: adaptive.prescriptions.length > 0 && Boolean(adaptive.prescriptions[0].misconceptionDiagnosed),
    details: `Prescriptions generated: ${adaptive.prescriptions.length}, Diagnosed: ${adaptive.prescriptions[0]?.misconceptionDiagnosed}`
  });

  return results;
}
