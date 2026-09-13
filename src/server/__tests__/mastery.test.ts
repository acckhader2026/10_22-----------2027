import { describe, it, expect } from 'vitest';
import { studentMasteryEngine } from '../../domain/analytics/StudentMasteryEngine';
import { db } from '../db/database';

describe('P0 Production - Canonical Student Mastery Engine', () => {
  it('should return INSUFFICIENT_DATA with confidence 0 for a brand new student with zero attempts', () => {
    const evalResult = studentMasteryEngine.calculateStudentMastery({
      userId: 'usr-new-student-999',
      questionAttempts: [],
      examAttempts: []
    });

    expect(evalResult.status).toBe('INSUFFICIENT_DATA');
    expect(evalResult.confidence).toBe(0);
    expect(evalResult.compositeMastery).toBe(0);
    expect(evalResult.totalQuestionsAttempted).toBe(0);
  });

  it('should compute multi-dimensional mastery based on 4 weighted pillars without legacy heuristics', () => {
    const attempts = [
      {
        id: 'att-1',
        user_id: 'usr-calc-test',
        question_id: 'eb-mcq-001',
        lesson_id: 'lesson-1',
        user_answer: 'correct',
        is_correct: true,
        score: 2,
        max_score: 2,
        time_spent_seconds: 20,
        attempt_number: 1,
        difficulty: 'basic' as const,
        timestamp: new Date().toISOString()
      },
      {
        id: 'att-2',
        user_id: 'usr-calc-test',
        question_id: 'eb-mcq-002',
        lesson_id: 'lesson-1',
        user_answer: 'correct',
        is_correct: true,
        score: 2,
        max_score: 2,
        time_spent_seconds: 25,
        attempt_number: 1,
        difficulty: 'intermediate' as const,
        timestamp: new Date().toISOString()
      },
      {
        id: 'att-3',
        user_id: 'usr-calc-test',
        question_id: 'eb-mcq-003',
        lesson_id: 'lesson-1',
        user_answer: 'wrong',
        is_correct: false,
        score: 0,
        max_score: 2,
        time_spent_seconds: 30,
        attempt_number: 1,
        difficulty: 'advanced' as const,
        timestamp: new Date().toISOString()
      }
    ];

    const evalResult = studentMasteryEngine.calculateStudentMastery({
      userId: 'usr-calc-test',
      questionAttempts: attempts as any,
      examAttempts: []
    });

    expect(evalResult.totalQuestionsAttempted).toBe(3);
    expect(evalResult.totalCorrect).toBe(2);
    expect(evalResult.accuracyComponent.rawRate).toBeCloseTo(66.67, 1);
    expect(evalResult.compositeMastery).toBeGreaterThan(0);
    expect(evalResult.compositeMastery).toBeLessThanOrEqual(100);
    expect(evalResult.confidence).toBeGreaterThan(0);
  });

  it('should store and preserve algorithmVersion in mastery snapshots', () => {
    const snapshot = db.recalculateAndSaveMasterySnapshot('usr-student-1');
    expect(snapshot).toBeDefined();
    expect(snapshot.algorithm_version).toBe('mastery-v1.0');
    expect(snapshot.user_id).toBe('usr-student-1');
  });
});
