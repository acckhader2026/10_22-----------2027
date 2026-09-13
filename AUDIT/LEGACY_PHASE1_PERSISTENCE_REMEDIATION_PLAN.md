# خطة المعالجة والتنفيذ لمرحلة قاعدة البيانات واستمرارية التشغيل (Phase 1 Remediation Plan)

## 1. التوصيف التقني الحالي والمستهدف (Current vs. Target Architecture)

| البعد التقني | الحالة الحالية (Current Baseline) | الحالة المستهدفة في المرحلة 1 (Target Architecture) |
| :--- | :--- | :--- |
| **قاعدة البيانات (Database)** | مصفوفات ذاكرة متطايرة مؤقتة في `database.ts` تفقد البيانات عند إعادة التشغيل. | محرك بيانات دائم وآمن على القرص (`data/production_database.json`) مع نسخ احتياطية واستمرارية تامة عبر Restarts. |
| **طبقة الوصول (Data Access)** | وصول مباشر لمصفوفات `db.users`, `db.questions` في الـ API Modules بدون تجريد أو معاملات. | طبقة مستودعات معيارية (`Repository Layer`) وطبقة خدمات (`Service Layer`) تعزل قواعد الأعمال عن التخزين. |
| **سلامة المعاملات (Transactions)** | انعدام المعاملات الذرية؛ أي خطأ يترك النظام في حالة غير متناسقة (Partial Mutation). | دعم المعاملات الذرية الكاملة (`beginTransaction`, `commit`, `rollback`) لعمليات تسليم الامتحانات والتقدم. |
| **سلامة العلاقات (Foreign Keys)** | علاقات غير مفحوصة برمجياً؛ إمكانية إدخال سؤال بدون هدف تعليمي أو محاولة بدون مستخدم. | فرض قيود المفاتيح الأجنبية (`Foreign Key Validation`) وقواعد `RESTRICT` و `CASCADE` المعرفة. |
| **القيود الفريدة (Unique Constraints)** | فحص يدوي مقتضب للبريد الإلكتروني فقط في مسار واحد. | فرض قيود التفرد الإلزامية (`Unique Constraints`) على البريد الإلكتروني، معرفات الأسئلة، والأهداف التعليمية. |
| **سجل التدقيق (Audit Logging)** | غياب سجل التدقيق لعمليات النظام الحساسة. | سجل تدقيق دائم ومحمي (`AuditLogRepository`) يسجل الفاعل، الإجراء، الهدف، وبصمة الوقت. |
| **عزل الملكية (Ownership Isolation)** | اعتماد جزئي في بعض المسارات وغياب في مسارات أخرى. | فرض عزل الملكية على كافة استعلامات ومحاولات وتقارير الطلاب لمنع الوصول غير المصرح. |
| **إعادة التشغيل والاستمرارية (Persistence)** | فشل تام؛ لا توجد استمرارية بعد إيقاف تشغيل الخادم. | نجاح تام لاختبارات `Write -> Restart -> Read` لجميع الكيانات الأساسية. |

---

## 2. مصفوفة المشاكل المصنفة (P0 / P1 Issue Register for Phase 1)

### مشاكل P0 (حرجة وفورية):
1. **P0-DB-1:** إزالة الـ In-memory Fallback المتطاير وتفعيل التخزين الدائم على القرص مع قفل المعاملات.
2. **P0-DB-2:** إنشاء طبقة مستودعات بيانات موحدة (`Repositories`) تربط كافة مسارات الخادم بمصدر حقيقة واحد.
3. **P0-DB-3:** دعم المعاملات الذرية (`Atomic Transactions`) مع القدرة على التراجع (`Rollback`) عند حدوث أي خطأ في تسليم الاختبارات.
4. **P0-DB-4:** فرض التحقق الصارم من المفاتيح الأجنبية (`Foreign Keys`) والقيود الفريدة (`Unique Constraints`).

### مشاكل P1 (عالية الأهمية):
1. **P1-DB-1:** ضمان تكرارية وبراءة الـ Seed (`Seed Idempotency`) بحيث لا تتكرر البيانات عند إعادة التشغيل.
2. **P1-DB-2:** إضافة فحص الجاهزية والاتصال (`/api/health` و `/api/readiness`) مع تفاصيل حالة قاعدة البيانات.
3. **P1-DB-3:** إضافة سجل تدقيق العمليات الحساسة (`Audit Log`).
4. **P1-DB-4:** عزل بيانات المستخدمين (`Ownership & Tenant Isolation`) على مستوى طبقة البيانات.

---

## 3. خطة التنفيذ المنهجية (Execution Steps)

1. **الخطوة 1:** بناء محرك التخزين الدائم الموثوق (`PersistentDiskDatabaseEngine`) في `src/server/db/diskDatabase.ts` مع دعم:
   - قراءة/كتابة ذرية (`Atomic Write via Temp File + Rename`).
   - دعم المعاملات (`Atomic Transaction Context`).
   - فرض المفاتيح الأجنبية والقيود الفريدة.
   - النسخ الاحتياطي التلقائي (`Automated Backups`).
2. **الخطوة 2:** تحديث وبناء طبقة المستودعات (`src/server/db/repositories/`):
   - `UserRepository`
   - `LessonRepository`
   - `LearningObjectiveRepository`
   - `QuestionRepository`
   - `ExamRepository`
   - `AttemptRepository`
   - `MasteryRepository`
   - `AuditRepository`
3. **الخطوة 3:** بناء طبقة الخدمات (`src/server/services/`):
   - `AuthService`
   - `QuestionService`
   - `ExamService`
   - `ProgressService`
   - `AuditService`
4. **الخطوة 4:** ربط وتحديث مسارات السيرفر في `src/server/modules/` للاعتماد الحصري على المستودعات والخدمات.
5. **الخطوة 5:** كتابة حزمة اختبارات شاملة لقاعدة البيانات والمعاملات والاستمرارية (`persistence.test.ts`, `database.test.ts`, `transactions.test.ts`, `isolation.test.ts`).
6. **الخطوة 6:** إجراء المطابقة الشاملة للبيانات (`Data Reconciliation`) وتوليد تقارير Phase 1 الرسمية.
