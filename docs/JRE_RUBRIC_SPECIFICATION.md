# JRE 20-Mark Canonical Rubric Specification
**Justified Reasoned Essay (مقال التفسير المحاسبي المدعوم بالأدلة)**
*Document Code: RUBRIC-EB-JRE-2026-CANONICAL*

---

## 1. Absolute Canonical Standard: 20 Marks Total

The JRE assessment model evaluates higher-order accounting synthesis, evaluative judgment, and evidence-based decision-making. 

All platform modules (Student UI, Exam Simulator, AI Evaluator, Teacher Dashboard, and Database exports) must strictly evaluate JRE responses against this **20-point rubric across five 4-point criteria**:

$$\text{Total Marks} = \sum_{i=1}^{5} C_i = 4 + 4 + 4 + 4 + 4 = 20 \text{ Marks}$$

---

## 2. Five Criteria Breakdown (0 to 4 Marks Each)

### Criterion 1: الإطار الفكري وتحديد الموقف المحاسبي (Intellectual Framework & Position) — 4 Marks
- **Descriptor (4/4)**: يحدد الموقف المحاسبي بوضوح تام ودقة مصطلحية فائقة، ويربطه مباشرة بالمعايير ومبادئ المحاسبة ذات الصلة دون أي غموض.
- **Descriptor (3/4)**: يحدد الموقف المحاسبي والمبادئ بدقة جيدة مع صياغة ملائمة.
- **Descriptor (2/4)**: يحدد الموقف المحاسبي بشكل عام مع غياب الربط الصريح ببعض المعايير أو المبادئ الأساسية.
- **Descriptor (1/4)**: موقف محاسبي مشوش أو غير محدد، مع خلط في المبادئ التوجيهية.
- **Descriptor (0/4)**: غياب تام للإطار المحاسبي أو إجابة خارج السياق.

### Criterion 2: عمق التحليل والربط بالمبادئ والسياسات (Deep Conceptual Analysis) — 4 Marks
- **Descriptor (4/4)**: يحلل التأثير المالي على الدورة المحاسبية والقوائم بدقة وعمق، مفسراً سبب تطبيق مبدأ المقابلة أو الاستحقاق أو الحيطة والحذر.
- **Descriptor (3/4)**: تحليل محاسبي منطقي يوضح الأثر على القوائم مع تفسير مقبول للمبادئ.
- **Descriptor (2/4)**: تحليل سطحي يكتفي بذكر المبدأ دون شرح آلية تأثيره على الحسابات.
- **Descriptor (1/4)**: أخطاء تحليلية تؤدي إلى توجيه محاسبي غير سليم.
- **Descriptor (0/4)**: لا يوجد تحليل أو تفسير مالي.

### Criterion 3: استخدام الأدلة النصية والعددية من واقع الحالة (Evidence Usage) — 4 Marks
- **Descriptor (4/4)**: يوظف الأرقام والبيانات الواردة في الحالة بدقة رياضية ومحاسبية تامة لدعم حجته وقراره.
- **Descriptor (3/4)**: يستشهد بالأرقام والبيانات الرئيسية بشكل صحيح ويدمجها في التفسير.
- **Descriptor (2/4)**: استشهاد محدود أو عام بالأرقام دون ربطها بالحسابات الختامية.
- **Descriptor (1/4)**: استخدام خاطئ للأرقام أو تجاهل البيانات الجوهرية للحالة.
- **Descriptor (0/4)**: لا يوجد أي دليل رقمي أو نصي من الحالة.

### Criterion 4: البنية والتماسك المنطقي والدحض (Structure, Coherence & Counter-Arguments) — 4 Marks
- **Descriptor (4/4)**: بناء منهجي محكم متسلسل منطقياً، يناقش الآراء البديلة أو المعالجات الخاطئة ويفندها بأدلة محاسبية قاطعة.
- **Descriptor (3/4)**: تسلسل منطقي واضح مع الإشارة إلى المعالجات الخاطئة وتفنيدها.
- **Descriptor (2/4)**: إجابة متماسكة جزئياً ولكن تفتقر إلى مناقشة البدائل ودحضها.
- **Descriptor (1/4)**: أفكار مبعثرة وتناقضات في الحجج المحاسبية.
- **Descriptor (0/4)**: انعدام البنية المنطقية.

### Criterion 5: الاستنتاج المحاسبي المبرر والأثر على القوائم (Justified Conclusion & Financial Impact) — 4 Marks
- **Descriptor (4/4)**: يقدم توصية ختامية قطعية مبررة توضح الأثر النهائي بدقة على قائمة الدخل والمركز المالي وحقوق الملكية.
- **Descriptor (3/4)**: استنتاج واضح ومبرر يبين الأثر العام على القوائم المالية.
- **Descriptor (2/4)**: استنتاج مبسط يفتقر إلى التفصيل الدقيق للأثر المالي.
- **Descriptor (1/4)**: استنتاج غير مبرر أو يتعارض مع التحليل السابق.
- **Descriptor (0/4)**: غياب تام للاستنتاج والتوصيات.

---

## 3. Mandatory Evaluation Output Format

Every JRE evaluation must yield a structured response:
```json
{
  "totalScore": 17,
  "maxScore": 20,
  "percentage": 85,
  "criteriaBreakdown": [
    { "id": "intellectual-framework", "title": "الإطار الفكري وتحديد الموقف المحاسبي", "score": 4, "max": 4, "feedback": "..." },
    { "id": "deep-analysis", "title": "عمق التحليل والربط بالمبادئ", "score": 3, "max": 4, "feedback": "..." },
    { "id": "evidence-usage", "title": "استخدام الأدلة الرقمية والنصية", "score": 3, "max": 4, "feedback": "..." },
    { "id": "structure-coherence", "title": "البنية والتماسك ودحض البدائل", "score": 4, "max": 4, "feedback": "..." },
    { "id": "justified-conclusion", "title": "الاستنتاج المحاسبي والأثر على القوائم", "score": 3, "max": 4, "feedback": "..." }
  ],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "actionableRecommendation": "...",
  "confidence": 0.95
}
```
