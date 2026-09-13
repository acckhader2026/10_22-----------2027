import crypto from 'crypto';
import { expandedQuestionBank, TraceableQuestion } from '../../../data/expandedQuestionBank';
import { comprehensiveExams } from '../../../data/examsData';
import { sourceSnapshotRegistry } from './SourceSnapshotRegistry';

export type GradingMode = 
  | 'AUTO_EXACT' 
  | 'AUTO_NUMERIC' 
  | 'AUTO_STRUCTURED' 
  | 'AUTO_MULTI_SELECT' 
  | 'AUTO_ORDERING' 
  | 'RUBRIC' 
  | 'MANUAL_REVIEW';

export type AssessmentStatus = 'ACTIVE' | 'ARCHIVED' | 'MANUAL_ONLY' | 'TEACHER_ONLY';

export interface VerifiedAssessmentItem {
  assessment_id: string;
  unit_id: string;
  lesson_id: string;
  concept_id: string;
  learning_objective_id: string;
  source_id: string;
  source_version: string;
  source_hash: string;
  question_type: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'challenge';
  prompt: string;
  options?: Array<{ id: string; text: string; orderIndex: number }>;
  correct_answer: any;
  answer_key_version: string;
  answer_key_hash: string;
  grading_mode: GradingMode;
  rubric_version: string;
  max_score: number;
  manual_review_required: boolean;
  status: AssessmentStatus;
  is_learner_reachable: boolean;
  learner_routes: string[]; // e.g. ['/practice', '/exams/comprehensive-midterm-1', '/question-bank', '/jre']
  created_at: string;
  updated_at: string;
}

export interface StudentSafeAssessmentItem {
  assessment_id: string;
  unit_id: string;
  lesson_id: string;
  concept_id: string;
  learning_objective_id: string;
  question_type: string;
  difficulty: string;
  prompt: string;
  options?: Array<{ id: string; text: string; orderIndex: number }>;
  max_score: number;
  grading_mode: GradingMode;
  manual_review_required: boolean;
  status: AssessmentStatus;
  learner_routes: string[];
}

export class VerifiedAssessmentRegistry {
  private registry: Map<string, VerifiedAssessmentItem> = new Map();

  constructor() {
    this.bootstrapRegistry();
  }

  private hashString(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  private determineGradingMode(type: string): GradingMode {
    const t = type.toLowerCase();
    if (t === 'mcq' || t === 'true_false') return 'AUTO_EXACT';
    if (t === 'numerical' || t === 'number') return 'AUTO_NUMERIC';
    if (t === 'matching' || t === 'ordering') return 'AUTO_ORDERING';
    if (t === 'jre' || t === 'jre_essay' || t === 'essay') return 'RUBRIC';
    if (t === 'accounting_entry' || t === 't_account' || t === 'applied' || t === 'case' || t === 'case_study') {
      return 'AUTO_STRUCTURED';
    }
    return 'AUTO_EXACT';
  }

  private bootstrapRegistry() {
    const defaultSource = sourceSnapshotRegistry.getSnapshot('MOE-EB-ACC-2025-U01')!;

    // 1. Ingest all questions from expandedQuestionBank
    expandedQuestionBank.forEach((q: TraceableQuestion) => {
      const qAny = q as any;
      const qType = q.questionType || qAny.type || 'mcq';
      const gradingMode = this.determineGradingMode(qType);
      const ansKeyStr = JSON.stringify(q.correctAnswer ?? '');
      const answerKeyHash = this.hashString(ansKeyStr);
      const promptText = q.question || qAny.prompt || '';
      const itemHash = this.hashString(`${q.id}:${promptText}:${ansKeyStr}`);

      const options = q.options?.map((opt, idx) => ({
        id: `opt_${idx}`,
        text: typeof opt === 'string' ? opt : (opt as any).content || '',
        orderIndex: idx
      }));

      const routes = ['/question-bank', `/lessons/${q.lessonId || 'lesson-1'}`];
      if (qType === 'jre') routes.push('/jre-talker');

      const item: VerifiedAssessmentItem = {
        assessment_id: q.id,
        unit_id: 'unit-1',
        lesson_id: q.lessonId || 'lesson-1',
        concept_id: q.concept || 'مبادئ عامة',
        learning_objective_id: q.learningObjectiveId || `LO-U01-${q.lessonId || 'L1'}`,
        source_id: defaultSource.source_id,
        source_version: defaultSource.source_version,
        source_hash: defaultSource.content_hash,
        question_type: qType,
        difficulty: (q.difficulty as any) || 'intermediate',
        prompt: promptText,
        options,
        correct_answer: q.correctAnswer,
        answer_key_version: '1.0.0',
        answer_key_hash: answerKeyHash,
        grading_mode: gradingMode,
        rubric_version: qType === 'jre' ? 'JRE-RUBRIC-20M-v3.0' : 'STANDARD-v1.0',
        max_score: (q as any).marks || (qType === 'jre' ? 20 : 2),
        manual_review_required: gradingMode === 'MANUAL_REVIEW',
        status: 'ACTIVE',
        is_learner_reachable: true,
        learner_routes: routes,
        created_at: '2025-09-01T00:00:00.000Z',
        updated_at: '2025-09-01T00:00:00.000Z'
      };

      this.registry.set(q.id, item);
    });

    // 2. Ingest examination items from comprehensiveExams
    comprehensiveExams.forEach(exam => {
      exam.sections.forEach(sec => {
        sec.questions.forEach(q => {
          if (!this.registry.has(q.id)) {
            const qType = q.type || 'mcq';
            const gradingMode = this.determineGradingMode(qType);
            const ansKeyStr = JSON.stringify(q.correctAnswer || (q as any).modelAnswer || '');
            const answerKeyHash = this.hashString(ansKeyStr);

            const options = q.options?.map((opt, idx) => ({
              id: `opt_${idx}`,
              text: opt,
              orderIndex: idx
            }));

            const item: VerifiedAssessmentItem = {
              assessment_id: q.id,
              unit_id: 'unit-1',
              lesson_id: (q as any).lessonId || 'lesson-1',
              concept_id: (q as any).concept || 'امتحان شامل',
              learning_objective_id: (q as any).learningObjectiveId || 'LO-U01-EXAM',
              source_id: defaultSource.source_id,
              source_version: defaultSource.source_version,
              source_hash: defaultSource.content_hash,
              question_type: qType,
              difficulty: 'advanced',
              prompt: q.prompt || '',
              options,
              correct_answer: q.correctAnswer || (q as any).modelAnswer,
              answer_key_version: '1.0.0',
              answer_key_hash: answerKeyHash,
              grading_mode: gradingMode,
              rubric_version: qType.includes('jre') ? 'JRE-RUBRIC-20M-v3.0' : 'STANDARD-v1.0',
              max_score: q.marks || 2,
              manual_review_required: false,
              status: 'ACTIVE',
              is_learner_reachable: true,
              learner_routes: [`/exams/${exam.id}`],
              created_at: '2025-09-01T00:00:00.000Z',
              updated_at: '2025-09-01T00:00:00.000Z'
            };

            this.registry.set(q.id, item);
          } else {
            // Append exam route to reachability
            const existing = this.registry.get(q.id)!;
            const examRoute = `/exams/${exam.id}`;
            if (!existing.learner_routes.includes(examRoute)) {
              existing.learner_routes.push(examRoute);
            }
          }
        });
      });
    });
  }

  public getAssessment(assessmentId: string): VerifiedAssessmentItem | undefined {
    return this.registry.get(assessmentId);
  }

  public getAllAssessments(): VerifiedAssessmentItem[] {
    return Array.from(this.registry.values());
  }

  public getAssessmentsByLesson(lessonId: string): VerifiedAssessmentItem[] {
    return this.getAllAssessments().filter(a => a.lesson_id === lessonId);
  }

  /**
   * Provides student-safe assessment items stripped of all correct answers and hashes
   */
  public getStudentSafeAssessments(lessonId?: string): StudentSafeAssessmentItem[] {
    let items = this.getAllAssessments();
    if (lessonId) {
      items = items.filter(a => a.lesson_id === lessonId);
    }

    return items.map(item => ({
      assessment_id: item.assessment_id,
      unit_id: item.unit_id,
      lesson_id: item.lesson_id,
      concept_id: item.concept_id,
      learning_objective_id: item.learning_objective_id,
      question_type: item.question_type,
      difficulty: item.difficulty,
      prompt: item.prompt,
      options: item.options,
      max_score: item.max_score,
      grading_mode: item.grading_mode,
      manual_review_required: item.manual_review_required,
      status: item.status,
      learner_routes: item.learner_routes
    }));
  }

  public getStudentSafeAssessmentById(assessmentId: string): StudentSafeAssessmentItem | undefined {
    const item = this.registry.get(assessmentId);
    if (!item) return undefined;
    return {
      assessment_id: item.assessment_id,
      unit_id: item.unit_id,
      lesson_id: item.lesson_id,
      concept_id: item.concept_id,
      learning_objective_id: item.learning_objective_id,
      question_type: item.question_type,
      difficulty: item.difficulty,
      prompt: item.prompt,
      options: item.options,
      max_score: item.max_score,
      grading_mode: item.grading_mode,
      manual_review_required: item.manual_review_required,
      status: item.status,
      learner_routes: item.learner_routes
    };
  }

  public updateAnswerKey(assessmentId: string, newAnswerKey: any, author: string): { success: boolean; newVersion: string; error?: string } {
    const item = this.registry.get(assessmentId);
    if (!item) return { success: false, newVersion: '', error: 'Item not found' };

    const versionParts = item.answer_key_version.split('.').map(Number);
    const newVersion = `${versionParts[0]}.${versionParts[1] + 1}.0`;
    const newHash = this.hashString(JSON.stringify(newAnswerKey));

    item.correct_answer = newAnswerKey;
    item.answer_key_version = newVersion;
    item.answer_key_hash = newHash;
    item.updated_at = new Date().toISOString();

    return { success: true, newVersion };
  }
}

export const verifiedAssessmentRegistry = new VerifiedAssessmentRegistry();
