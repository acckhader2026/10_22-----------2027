export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'challenge';

export type UnitId = 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4';

export interface UnitDefinition {
  id: UnitId;
  unitNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  bigIdea: string;
  essentialQuestion: string;
}

export interface Objective {
  id: string;
  actionVerb: string;
  text: string;
  bloomLevel: string;
}

export interface CautionBox {
  title: string;
  commonMistake: string;
  whyWrong: string;
  correctWay: string;
}

export interface KeyInsightBox {
  title: string;
  mnemonicOrRule: string;
  explanation: string;
}

export interface ComparisonTable {
  title: string;
  headers: string[];
  rows: {
    aspect: string;
    col1: string;
    col2: string;
    col3?: string;
    col4?: string;
    extra?: string;
  }[];
}

export interface SolvedExample {
  id: string;
  title: string;
  level: DifficultyLevel;
  scenario: string;
  data?: Record<string, any>;
  required: string[];
  thinkingMethod: string;
  steps: {
    stepNumber: number;
    description: string;
    calculation?: string;
    table?: {
      headers: string[];
      rows: (string | number)[][];
    };
    note?: string;
  }[];
  finalResult?: string;
  finalOutcome?: string;
  accountingJustification?: string;
  [key: string]: any;
}

export interface QuickCheckQuestion {
  id: string;
  type?: 'mcq' | 'true_false' | 'fill' | 'why' | 'what_if' | 'apply' | string;
  question?: string;
  options?: string[];
  correctAnswer?: string | boolean;
  correctIndex?: number;
  statement?: string;
  isTrue?: boolean;
  hint?: string;
  answer?: string;
  explanation?: string;
  level?: DifficultyLevel;
  [key: string]: any;
}

export interface RealWorldCase {
  id: string;
  title: string;
  businessContext: string;
  transactions: {
    date: string;
    description: string;
    amount?: number;
    details?: string;
  }[];
  requirements: string[];
  thinkingProcess: string[];
  solution: {
    journalEntries?: {
      date: string;
      accountDr: string;
      amountDr: number;
      accountCr: string;
      amountCr: number;
      explanation: string;
    }[];
    ledgerAccounts?: {
      accountName: string;
      debitSide: { desc: string; amount: number }[];
      creditSide: { desc: string; amount: number }[];
      balance: { type: 'debit' | 'credit'; amount: number };
    }[];
    trialBalance?: {
      accountName: string;
      debit: number;
      credit: number;
    }[];
    financialStatements?: {
      tradingAccount?: {
        sales: number;
        costOfGoodsSold: {
          beginningInventory: number;
          purchases: number;
          endingInventory: number;
          totalCOGS: number;
        };
        grossProfit: number;
      };
      profitAndLoss?: {
        grossProfit: number;
        expenses: { name: string; amount: number }[];
        totalExpenses: number;
        netProfit: number;
      };
      equityStatement?: {
        beginningCapital: number;
        netProfit: number;
        drawings: number;
        endingCapital: number;
      };
      balanceSheet?: {
        currentAssets: { name: string; amount: number }[];
        nonCurrentAssets: { name: string; cost: number; accumulatedDep?: number; net: number }[];
        totalAssets: number;
        currentLiabilities: { name: string; amount: number }[];
        ownerEquity: number;
        totalLiabilitiesAndEquity: number;
      };
    };
    analysisNotes: string[];
  };
}

export interface LessonQuiz {
  id?: string;
  title?: string;
  durationMinutes?: number;
  totalMarks?: number;
  mcqs?: QuickCheckQuestion[];
  trueFalse?: QuickCheckQuestion[];
  appliedQuestions?: {
    id?: string;
    title?: string;
    prompt?: string;
    givenData?: string;
    required?: string;
    modelAnswer?: string;
    markAllocation?: number;
    [key: string]: any;
  }[];
  miniCase?: {
    prompt: string;
    required: string[];
    solution: string;
    markAllocation: number;
  };
}

export interface LessonMisconception {
  id: string;
  error: string;
  correct: string;
  subLo?: string;
  diagnosticQuestion: string;
}

export interface Lesson {
  id: string;
  unitId?: UnitId | string;
  lessonNumber?: number;
  order?: number;
  title: string;
  subtitle?: string;
  brief?: string;
  estimatedMinutes?: number;
  learningOutcomes?: string[];
  introduction?: {
    title: string;
    content: string;
  };
  sections?: {
    id: string;
    title: string;
    content?: string;
    contentTitle?: string;
    simplifiedDefinition?: string;
    scientificDefinition?: string;
    whyWeStudyThis?: string;
    howToApply?: string[];
    microExample?: string;
    comparison?: ComparisonTable;
    caution?: CautionBox;
    keyInsight?: KeyInsightBox;
  }[];
  summary?: {
    title: string;
    points: string[];
  };
  keyTerms?: {
    term: string;
    definition: string;
  }[];
  [key: string]: any;
}

export interface LessonContent {
  id: string;
  unitId?: UnitId;
  lessonNumber?: number;
  order?: number;
  title: string;
  subtitle?: string;
  brief?: string;
  objectives?: string[];
  estimatedMinutes?: number;
  realWorldIntroduction?: {
    hookStory: string;
    connectionToLesson: string;
  };
  whatYouWillLearn?: string[];
  sections?: {
    id: string;
    title: string;
    content?: string;
    contentTitle?: string;
    simplifiedDefinition?: string;
    scientificDefinition?: string;
    whyWeStudyThis?: string;
    howToApply?: string[];
    microExample?: string;
    comparison?: ComparisonTable;
    caution?: CautionBox;
    keyInsight?: KeyInsightBox;
  }[];
  solvedExamples?: SolvedExample[];
  workedExamples?: SolvedExample[];
  quickChecks?: QuickCheckQuestion[];
  thinkLikeAnAccountantQuestions?: {
    id: string;
    question: string;
    scenario: string;
    guidingQuestions?: string[];
    idealAnswer?: string;
    accountingPrinciple?: string;
    title?: string;
    expertInsight?: string;
    [key: string]: any;
  }[];
  subLo?: string;
  subLoDescription?: string;
  misconceptions?: LessonMisconception[];
  realWorldCase?: RealWorldCase;
  inOneMinuteSummary?: {
    coreDefinitions: { term: string; definition: string }[];
    coreRules: string[];
    vitalRelationships: string[];
    commonTraps: string[];
    solutionCheatsheet: string[];
  };
  lessonQuiz?: LessonQuiz;
  [key: string]: any;
}

export interface CommonErrorItem {
  id: string;
  topic: string;
  error: string;
  whyWrong: string;
  correctMethod: string;
  example: string;
}

export interface UnitOutcomeItem {
  subLo: string;
  bloomLevel: string;
  description: string;
}

export interface MaryamCaseStep {
  step: number;
  title: string;
  analysisOrEntry: string;
  accountingImpact: string;
}

export interface CycleStageLink {
  stage: string;
  output: string;
  questionAnswered: string;
}

export interface ExamNightCheckItem {
  ifRequested: string;
  startWith: string;
  verifyThat: string;
}

export interface JRESampleItem {
  id: string;
  title: string;
  level: string;
  question: string;
  modelAnswer: string;
  totalMarks: number;
  rubric: { criterion: string; marks: number }[];
}

export interface QuestionBankItem {
  id: string;
  lessonId: string;
  category: 'mcq' | 'true_false' | 'terms' | 'applied' | 'cases' | 'higher_thinking';
  level: DifficultyLevel;
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  detailedExplanation: string;
  tags: string[];
}

export interface ComprehensiveExamQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'applied' | 'case' | 'jre_essay';
  prompt: string;
  options?: string[];
  correctAnswer?: string | boolean;
  dataContext?: any;
  required?: string[];
  modelAnswer?: string;
  explanation?: string;
  marks: number;
}

export interface ComprehensiveExam {
  id: string;
  title: string;
  subtitle: string;
  timeAllowedMinutes: number;
  totalMarks: number;
  instructions: string[];
  sections: {
    title: string;
    marks: number;
    questions: ComprehensiveExamQuestion[];
  }[];
}

export type PlatformRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'CONTENT_MANAGER';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: PlatformRole;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StudentMasteryProfile {
  userId: string;
  userFullName: string;
  compositeMastery: number;
  totalAttempts: number;
  accuracyRate: number;
  completedLessonsCount: number;
  totalLessons: number;
  weakConcepts: string[];
  strongConcepts: string[];
}

export interface AdaptiveRemediationPath {
  conceptName: string;
  misconception: string;
  simplifiedExplanation: string;
  microExample: string;
  drillQuestionIds: string[];
  suggestedLesson: string;
}

// -------------------------------------------------------------
// Documentary Cycle (الدورة المستندية ومصادر القيد) Types
// -------------------------------------------------------------

export type SourceDocumentType = 
  | 'sales_invoice_credit'     // فاتورة بيع بالأجل
  | 'sales_invoice_cash'       // فاتورة بيع نقدي
  | 'purchase_invoice_credit'  // فاتورة شراء بالأجل
  | 'purchase_invoice_cash'    // فاتورة شراء نقدي
  | 'receipt_voucher'          // سند قبض نقدية / شيكات
  | 'payment_voucher'          // سند صرف نقدية
  | 'bank_cheque'              // شيك بنكي (مسحوب أو وارد)
  | 'warehouse_receipt'        // إذن إضافة مخزني (بضاعة واردة)
  | 'warehouse_issue'          // إذن صرف مخزني (بضاعة منصرفة)
  | 'bank_reconciliation';     // مذكرة تسوية بنكية / إشعار خصم بنكي

export interface DocumentCandidateOption {
  type: SourceDocumentType;
  titleAr: string;
  categoryBadge: string;
  iconName?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface DocumentFacsimileData {
  documentTitle: string;
  documentSubtitle?: string;
  documentNumber: string;
  date: string;
  organizationName: string;
  counterpartyName: string;
  itemsOrDescription: {
    description: string;
    quantity?: number;
    unitPrice?: number;
    total: number;
  }[];
  totalAmount: number;
  currency: string;
  amountInWords: string;
  paymentMethodText: string;
  authorizedSignatory: string;
  treasurerOrReceiver?: string;
  officialStampText?: string;
  notes?: string;
  bankName?: string;
  chequeNumber?: string;
}

export interface ExtractionFieldTarget {
  id: string;
  label: string;
  prompt: string;
  fieldKey: 'date' | 'counterparty' | 'totalAmount' | 'referenceNo' | 'transactionType';
  expectedValue: string;
  options: string[]; // Options for interactive selection/extraction
  explanation: string;
}

export interface PreliminaryAccountTarget {
  accountName: string;
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  impact: 'increase' | 'decrease';
  nature: 'debit' | 'credit';
  explanation: string;
}

export interface DocumentaryScenario {
  id: string;
  scenarioNumber: number;
  title: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  economicEvent: string;
  realWorldContext: string;
  correctDocumentType: SourceDocumentType;
  learningObjectiveId: string; // e.g. LO-ENRICH-DOC.1, LO-ENRICH-DOC.2, LO-ENRICH-DOC.3
  candidateOptions: DocumentCandidateOption[];
  documentFacsimile: DocumentFacsimileData;
  extractionFields: ExtractionFieldTarget[];
  preliminaryAnalysis: {
    account1: PreliminaryAccountTarget;
    account2: PreliminaryAccountTarget;
    accountingEquationRule: string;
    pedagogicalSummary: string;
  };
  journalSeed: {
    description: string;
    date: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    reference: string;
  };
}

export interface DocumentCycleAttemptResult {
  scenarioId: string;
  documentCorrect: boolean;
  extractionCorrectCount: number;
  extractionTotal: number;
  analysisCorrect: boolean;
  totalScore: number; // 0 - 100
  timestamp: string;
}


