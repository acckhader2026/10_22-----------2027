export interface QualityCheckIssue {
  ruleId: string;
  ruleNameAr: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  messageAr: string;
}

export interface QuestionQualityReport {
  questionId: string;
  isValid: boolean;
  qualityScore: number; // 0 - 100
  passedChecks: number;
  totalChecks: number;
  issues: QualityCheckIssue[];
  psychometricRecommendations: string[];
}

export interface BankQualitySummary {
  totalQuestions: number;
  validQuestionsCount: number;
  flaggedQuestionsCount: number;
  averageQualityScore: number;
  criticalIssuesCount: number;
  majorIssuesCount: number;
  reports: QuestionQualityReport[];
}

export class QuestionQualityEngine {
  public validateQuestion(q: any): QuestionQualityReport {
    const issues: QualityCheckIssue[] = [];
    let passed = 0;
    const totalChecks = 12;

    const text = String(q.question || q.prompt || '').trim();
    const options: string[] = Array.isArray(q.options) ? q.options : [];
    const correctAnswerStr: string = q.correctAnswer !== undefined && q.correctAnswer !== null ? String(q.correctAnswer).trim() : '';
    const explanation: string = String(q.explanation || '').trim();
    const type: string = String(q.questionType || q.type || 'mcq').toLowerCase();

    // Check 1: Stem length and content presence
    if (text.length >= 12) {
      passed++;
    } else {
      issues.push({
        ruleId: 'STEM_SUFFICIENCY',
        ruleNameAr: 'كفاية نص رأس السؤال',
        severity: 'CRITICAL',
        messageAr: 'نص السؤال قصير جداً ولا يقدم سياقاً محاسبياً كافياً.'
      });
    }

    // Check 2: Unambiguous correct answer
    if (q.correctAnswer !== undefined && q.correctAnswer !== null && correctAnswerStr.length > 0) {
      passed++;
    } else {
      issues.push({
        ruleId: 'UNAMBIGUOUS_KEY',
        ruleNameAr: 'وجود إجابة نموذجية محددة',
        severity: 'CRITICAL',
        messageAr: 'لم يتم تحديد مفتاح الإجابة الصحيحة للسؤال.'
      });
    }

    // Check 3: Plausible distractors (for MCQs)
    if (type.includes('mcq')) {
      if (options.length >= 4) {
        passed++;
      } else {
        issues.push({
          ruleId: 'DISTRACTOR_COUNT',
          ruleNameAr: 'عدد البدائل والمشتتات',
          severity: 'MAJOR',
          messageAr: 'سؤال الاختيار من متعدد يجب أن يحتوي على 4 بدائل متكافئة.'
        });
      }
    } else {
      passed++; // Not applicable
    }

    // Check 4: No duplicated options
    if (options.length > 0) {
      const uniqueOptions = new Set(options.map(o => String(o).trim()));
      if (uniqueOptions.size === options.length) {
        passed++;
      } else {
        issues.push({
          ruleId: 'DUPLICATE_OPTIONS',
          ruleNameAr: 'عدم تكرار البدائل',
          severity: 'CRITICAL',
          messageAr: 'يوجد خيارات مكررة في بدائل السؤال.'
        });
      }
    } else {
      passed++;
    }

    // Check 5: Correct answer exists within options
    if (type.includes('mcq') && options.length > 0) {
      const normalizedOptions = options.map(o => String(o).trim());
      if (normalizedOptions.includes(correctAnswerStr)) {
        passed++;
      } else {
        issues.push({
          ruleId: 'KEY_IN_OPTIONS',
          ruleNameAr: 'تطابق الإجابة مع البدائل',
          severity: 'CRITICAL',
          messageAr: 'الإجابة الصحيحة غير مطابقة حرفياً لأي من الخيارات المتاحة.'
        });
      }
    } else {
      passed++;
    }

    // Check 6: Explanation supports answer
    if (explanation.length >= 15) {
      passed++;
    } else {
      issues.push({
        ruleId: 'EXPLANATION_DEPTH',
        ruleNameAr: 'عمق التفسير والتعليل التعليمي',
        severity: 'MAJOR',
        messageAr: 'التفسير المحاسبي مقتضب ويحتاج لبيان سبب صحة الإجابة وتفنيد البدائل.'
      });
    }

    // Check 7: Objective mapping
    if (q.learningObjectiveId || q.lessonId) {
      passed++;
    } else {
      issues.push({
        ruleId: 'CURRICULUM_MAPPING',
        ruleNameAr: 'الربط بمؤشرات نواتج التعلم',
        severity: 'MAJOR',
        messageAr: 'السؤال غير مربوط بمؤشر ناتج تعلم محدد في وثيقة المنهج.'
      });
    }

    // Check 8: Difficulty assignment
    if (['basic', 'intermediate', 'advanced', 'challenge'].includes(q.difficulty)) {
      passed++;
    } else {
      issues.push({
        ruleId: 'DIFFICULTY_METADATA',
        ruleNameAr: 'تحديد مستوى الصعوبة القياسي',
        severity: 'MINOR',
        messageAr: 'مستوى الصعوبة غير مصنف وفق المعايير الرباعية (basic, intermediate, advanced, challenge).'
      });
    }

    // Check 9: Numerical consistency (for calculation questions)
    const hasNumbers = /\d+[\d,.]*/.test(text);
    if (hasNumbers) {
      if (/\d+[\d,.]*/.test(explanation) || /\d+[\d,.]*/.test(correctAnswerStr)) {
        passed++;
      } else {
        issues.push({
          ruleId: 'NUMERICAL_VERIFICATION',
          ruleNameAr: 'التثبت الرياضي من الأرقام والمعادلات',
          severity: 'MINOR',
          messageAr: 'السؤال يحتوي على أرقام ولكن التفسير يفتقر إلى خطوات الحل الحسابي.'
        });
      }
    } else {
      passed++;
    }

    // Check 10: Grammatical / Terminology clarity
    const hasAccountingKeywords = /محاسب|أصل|خصم|ملكية|مدين|دائن|ميزان|أرباح|خسائر|قيد|ترحيل|استحقاق|مقابلة|حيطة/i.test(text + ' ' + explanation);
    if (hasAccountingKeywords) {
      passed++;
    } else {
      issues.push({
        ruleId: 'ACCOUNTING_TERMINOLOGY',
        ruleNameAr: 'دقة المصطلحات المحاسبية',
        severity: 'MINOR',
        messageAr: 'السؤال يفتقر إلى استخدام المصطلحات المحاسبية الأكاديمية الدقيقة.'
      });
    }

    // Check 11: JRE Rubric Alignment (if JRE type)
    if (type.includes('jre') || type.includes('essay')) {
      if (q.rubric || (q.marks && q.marks >= 10)) {
        passed++;
      } else {
        issues.push({
          ruleId: 'JRE_RUBRIC_SPEC',
          ruleNameAr: 'مطابقة مواصفات مقال الـ JRE',
          severity: 'MAJOR',
          messageAr: 'أسئلة الـ JRE يجب أن ترتبط بسلم التقييم السداسي الرسمي (20 درجة).'
        });
      }
    } else {
      passed++;
    }

    // Check 12: Source Mapping Reference
    if (q.sourceMapping?.source_document || q.sourceMapping?.source_page || q.pageRef) {
      passed++;
    } else {
      issues.push({
        ruleId: 'SOURCE_TRACEABILITY',
        ruleNameAr: 'التوثيق المرجعي من كتاب الوزارة',
        severity: 'MINOR',
        messageAr: 'يُفضل ربط السؤال برقم الصفحة في كتاب الوزارة الرسمي لضمان المرجعية.'
      });
    }

    const qualityScore = Math.round((passed / totalChecks) * 100);
    const criticalCount = issues.filter(i => i.severity === 'CRITICAL').length;
    const isValid = criticalCount === 0 && qualityScore >= 70;

    const psychometricRecommendations: string[] = [];
    if (!isValid) {
      psychometricRecommendations.push('مطلوب مراجعة فورية للسؤال قبل تضمينه في نماذج الامتحانات الرسمية.');
    }
    issues.forEach(iss => {
      psychometricRecommendations.push(`${iss.ruleNameAr}: ${iss.messageAr}`);
    });

    return {
      questionId: q.id || 'unassigned',
      isValid,
      qualityScore,
      passedChecks: passed,
      totalChecks,
      issues,
      psychometricRecommendations
    };
  }

  public validateBank(questions: any[]): BankQualitySummary {
    const reports = questions.map(q => this.validateQuestion(q));
    const validQuestionsCount = reports.filter(r => r.isValid).length;
    const flaggedQuestionsCount = reports.filter(r => !r.isValid).length;
    const averageQualityScore = reports.length > 0
      ? Math.round(reports.reduce((acc, r) => acc + r.qualityScore, 0) / reports.length)
      : 0;

    const criticalIssuesCount = reports.reduce((acc, r) => acc + r.issues.filter(i => i.severity === 'CRITICAL').length, 0);
    const majorIssuesCount = reports.reduce((acc, r) => acc + r.issues.filter(i => i.severity === 'MAJOR').length, 0);

    return {
      totalQuestions: questions.length,
      validQuestionsCount,
      flaggedQuestionsCount,
      averageQualityScore,
      criticalIssuesCount,
      majorIssuesCount,
      reports
    };
  }
}

export const questionQualityEngine = new QuestionQualityEngine();
