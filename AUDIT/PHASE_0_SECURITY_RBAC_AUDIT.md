# تقرير التدقيق الأمني والصلاحيات (Security, Authentication & RBAC Forensic Audit)

## 1. ملخص التدقيق الأمني

| المحور الأمني | الحالة الفعلية | التقييم الأمني | مستوى الخطورة |
| :--- | :--- | :---: | :---: |
| **تشفير كلمات المرور (Password Hashing)** | يستخدم `bcryptjs` مع Salt Rounds = 10 في `src/server/auth/password.ts` | 🟢 قوي | منخفض |
| **رموز المصادقة (JWT Tokens)** | توقيع مزدوج (Access 15m + Refresh 7d) في `src/server/auth/jwt.ts` | 🟢 قوي | منخفض |
| **التسجيل وتصعيد الصلاحيات (Privilege Escalation)** | التسجيل يقبل أي Role (بما فيها ADMIN) دون أي تحقق | 🔴 ثغرة حرجة | P0 حرج |
| **تسريب بيانات الامتحانات (Exam Key Leakage)** | مسارات الامتحانات تسرب الإجابات النموذجية للواجهة قبل الحل | 🔴 ثغرة حرجة | P0 حرج |
| **تسريب مفاتيح الأسئلة (Question Key Leakage)** | مسارات الأسئلة ترسل حقل `is_correct` مع كل خيار | 🔴 ثغرة حرجة | P0 حرج |
| **التصحيح الموثوق (Server-Side Grading)** | تصحيح الأسئلة الفردية يقبل `isCorrect` مباشرة من العميل | 🔴 ثغرة حرجة | P0 حرج |
| **حماية الـ Endpoints والـ RBAC** | معظم الـ Endpoints محمية ولكن توجد مسارات إحصائية مكشوفة | 🟡 متوسط | P1 متوسط |

---

## 2. الأدلة الجنائية التفصيلية للثغرات المكتشفة

### 🔴 الثغرة رقم 1: ثغرة التسجيل الذاتي كمسؤول (Self-Assigned Admin Registration)
* **الموقع:** `/src/server/modules/auth.ts` (الأسطر 13، 49-56).
* **الكود الفعلي:**
```typescript
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(['STUDENT', 'TEACHER', 'CONTENT_MANAGER', 'ADMIN']).optional().default('STUDENT')
});
```
* **التحليل:** عند قيام أي مهاجم بإرسال طلب `POST /api/auth/register` مع Body: `{"role": "ADMIN", ...}`، يقوم الخادم بإنشاء حساب بصلاحيات `ADMIN` فوراً دون طلب توكن مدير أو تحقق مسبق.
* **الحل المطلوب لاحقاً:** فرض `role: 'STUDENT'` إلزامياً لجميع عمليات التسجيل العامة، وجعل ترقية الأدوار تتطلب صلاحية مدير معتمد (`ADMIN`).

---

### 🔴 الثغرة رقم 2: تسريب مفاتيح إجابات الأسئلة الفردية (Option Correctness Leakage)
* **الموقع:** `/src/server/modules/questions.ts` (الأسطر 24-37).
* **الكود الفعلي:**
```typescript
export async function handleGetQuestions(req: Request, res: Response) {
  // ...
  const questions = db.getQuestions(filter);
  return res.json({
    data: questions, // questions contains options: [{id, text, is_correct: true/false}]
    meta: { ... }
  });
}
```
* **التحليل:** كائن السؤال يحتوي على `options` بداخلها `is_correct: boolean`. عند إرجاع الأسئلة للطالب، يرى متصفح الطالب خيار الإجابة الصحيحة مباشرة في الـ JSON Response.
* **الحل المطلوب لاحقاً:** تجريد كائنات الأسئلة من حقل `is_correct` و `correctAnswer` و `explanation` في الـ DTO العام، وإرسالها فقط بعد تقديم الإجابة أو للمديرين/المعلمين.

---

### 🔴 الثغرة رقم 3: تسريب كائن الامتحان ونموذج الإجابة مسبقاً (Exam Master Key Leakage)
* **الموقع:** `/src/server/modules/exams.ts` (السطر 28).
* **الكود الفعلي:**
```typescript
export async function handleGetExamById(req: Request, res: Response) {
  const { examId } = req.params;
  const exam = db.getExamById(examId);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  return res.json({ data: exam }); // Returns full exam object with answers and explanations!
}
```
* **التحليل:** الطالب يستطيع فتح DevTools وقراءة كافة حلول الامتحان ونموذج إجابة سؤال الـ JRE التطبيقي فور فتح صفحة الاختبار وقبل بدء الحل.

---

### 🔴 الثغرة رقم 4: الثقة العمياء في تصحيح العميل (Client-Authoritative Question Attempt Scoring)
* **الموقع:** `/src/server/modules/progress.ts` (الأسطر 11، 35-45).
* **الكود الفعلي:**
```typescript
const questionAttemptSchema = z.object({
  questionId: z.string(),
  selectedOptionId: z.string().optional(),
  answerText: z.string().optional(),
  isCorrect: z.boolean(), // <-- Trusted blindly from client!
  timeSpentSeconds: z.number().int().nonnegative().optional()
});
```
* **التحليل:** السيرفر لا يقوم بمقارنة `selectedOptionId` بالإجابة الصحيحة الحقيقية؛ بل يأخذ قيمة `isCorrect` من الـ Payload، ويحسب نقاط الطالب بناءً عليها.

---

### 🟡 الثغرة رقم 5: بيانات اعتماد صلبة ومسارات إحصائية غير مقيدة بالكامل (Hardcoded Fallback Credentials & Analytics Exposure)
* **الموقع:** `/src/context/AuthContext.tsx` (الأسطر 20-25) و `/server.ts` (السطر 74).
* **الكود الفعلي:**
  * في `AuthContext.tsx`:
  ```typescript
  const ROLE_CREDENTIALS: Record<PlatformRole, { email: string; password: string }> = {
    STUDENT: { email: 'student@eb.edu.eg', password: 'Password123!' },
    TEACHER: { email: 'teacher@eb.edu.eg', password: 'Password123!' },
    CONTENT_MANAGER: { email: 'content@eb.edu.eg', password: 'Password123!' },
    ADMIN: { email: 'admin@eb.edu.eg', password: 'Password123!' }
  };
  ```
  * في `server.ts`:
  ```typescript
  app.get('/api/analytics/teacher', handleGetTeacherAnalytics); // No requireRole('TEACHER', 'ADMIN') attached!
  ```
* **التحليل:** مسار تحليلات المعلم غير محمي بـ Middleware `requireRole`, مما يتيح لأي شخص مسجل استخراج تقارير الطلاب بالكامل.
