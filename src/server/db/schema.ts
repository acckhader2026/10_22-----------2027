export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'CONTENT_MANAGER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type TaxonomyLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'MATCHING' | 'FILL_BLANK' | 'SHORT_ANSWER' | 'NUMERICAL' | 'CASE_STUDY' | 'JRE' | 'ACCOUNTING_ENTRY' | 'T_ACCOUNT';

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface DbRefreshToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface DbSubject {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface DbCourse {
  id: string;
  subject_id: string;
  title: string;
  code: string;
  description: string;
}

export interface DbUnit {
  id: string;
  subject_id: string;
  title: string;
  unit_number: number;
  description: string;
  order_index: number;
}

export interface DbLesson {
  id: string;
  unit_id: string;
  title: string;
  lesson_number: number;
  slug: string;
  content: any;
  learning_objectives: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'challenge';
  order_index: number;
  status: 'PUBLISHED' | 'DRAFT';
}

export interface DbLearningObjective {
  id: string;
  lesson_id: string;
  code: string;
  description_ar: string;
  taxonomy_level: TaxonomyLevel;
  blooms_level: string;
}

export interface DbQuestion {
  id: string;
  lesson_id: string;
  unit_id: string;
  type: QuestionType;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'challenge';
  content: string;
  explanation: string;
  learning_objective_id: string;
  concept: string;
  source_document: string;
  source_page: number;
  status: 'ACTIVE' | 'UNMAPPED' | 'REVIEW';
  created_at: string;
  updated_at: string;
}

export interface DbQuestionOption {
  id: string;
  question_id: string;
  content: string;
  is_correct: boolean;
  order_index: number;
}

export interface DbQuestionTag {
  id: string;
  question_id: string;
  tag: string;
}

export interface DbExam {
  id: string;
  title: string;
  subtitle: string;
  time_allowed_minutes: number;
  total_marks: number;
  instructions: string[];
  sections: any[];
}

export interface DbStudentLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  time_spent_seconds: number;
  last_accessed_at: string;
}

export interface DbStudentQuestionAttempt {
  id: string;
  user_id: string;
  question_id: string;
  lesson_id: string;
  exam_attempt_id?: string;
  user_answer: string;
  is_correct: boolean;
  score: number;
  max_score: number;
  time_spent_seconds: number;
  attempt_number: number;
  difficulty: string;
  grading_metadata?: Record<string, any>;
  timestamp: string;
}

export interface DbStudentExamAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  total_score: number;
  max_marks: number;
  percentage: number;
  time_taken_seconds: number;
  answers: Record<string, any>;
  rubric_evaluations?: Record<string, any>;
  submitted_at: string;
}

export interface DbStudentMasterySnapshot {
  id: string;
  user_id: string;
  scope_type: 'LEARNING_OBJECTIVE' | 'CONCEPT' | 'LESSON' | 'UNIT' | 'COURSE';
  scope_id: string;
  mastery_score: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  evidence_count: number;
  status: 'INSUFFICIENT_DATA' | 'NEEDS_REMEDIATION' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERED';
  calculated_at: string;
  algorithm_version: string;
}

export interface DbAdaptiveRecommendation {
  id: string;
  user_id: string;
  weak_concept: string;
  recommended_path: {
    simplified_explanation: string;
    micro_example: string;
    drill_question_ids: string[];
    suggested_lesson_slug: string;
  };
  created_at: string;
  resolved: boolean;
}

export interface DbAuditLog {
  id: string;
  actor_id: string;
  actor_role: string;
  action: string;
  resource: string;
  resource_id: string;
  timestamp: string;
  result: 'SUCCESS' | 'FAILURE' | 'REJECTED';
  metadata?: Record<string, any>;
}

