import { LessonContent, UnitDefinition } from '../types';
import { lesson1 } from './lesson1';
import { lesson2 } from './lesson2';
import { lesson2_5 as unit1Lesson2_5 } from './lesson2_5';
import { lesson3 } from './lesson3';
import { lesson4 } from './lesson4';
import { lesson5 } from './lesson5';
import { lesson6 } from './lesson6';

import { lesson2_1 } from './unit2Lessons/lesson2_1';
import { lesson2_2 } from './unit2Lessons/lesson2_2';
import { lesson2_3 } from './unit2Lessons/lesson2_3';
import { lesson2_4 } from './unit2Lessons/lesson2_4';
import { lesson2_5 } from './unit2Lessons/lesson2_5';
import { lesson2_6 } from './unit2Lessons/lesson2_6';

import { lesson3_1, lesson3_2, lesson3_3, lesson3_4, lesson3_5, lesson3_6 } from './unit3Lessons';
import { lesson4_1, lesson4_2, lesson4_3, lesson4_4, lesson4_5, lesson4_6 } from './unit4Lessons';

export const unit1Lessons: LessonContent[] = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5,
  lesson6
].map(l => ({ ...l, unitId: 'unit-1' as const }));

export const unit1EnrichmentLesson = { ...unit1Lesson2_5, unitId: 'unit-1' as const };

export const unit2Lessons: LessonContent[] = [
  lesson2_1,
  lesson2_2,
  lesson2_3,
  lesson2_4,
  lesson2_5,
  lesson2_6
].map(l => ({ ...l, unitId: 'unit-2' as const }));

export const unit3Lessons: LessonContent[] = [
  lesson3_1,
  lesson3_2,
  lesson3_3,
  lesson3_4,
  lesson3_5,
  lesson3_6
].map(l => ({ 
  ...l, 
  unitId: 'unit-3' as const,
  whatYouWillLearn: l.whatYouWillLearn || l.learningOutcomes || l.objectives || []
}));

export const unit4Lessons: LessonContent[] = [
  lesson4_1,
  lesson4_2,
  lesson4_3,
  lesson4_4,
  lesson4_5,
  lesson4_6
].map(l => ({ 
  ...l, 
  unitId: 'unit-4' as const,
  whatYouWillLearn: l.whatYouWillLearn || l.learningOutcomes || l.objectives || []
}));

export const allLessons: LessonContent[] = [
  ...unit1Lessons,
  ...unit2Lessons,
  ...unit3Lessons,
  ...unit4Lessons
];

export const availableUnits: UnitDefinition[] = [
  {
    id: 'unit-4',
    unitNumber: 4,
    title: 'الوحدة الرابعة: ميزان المراجعة وتصحيح الأخطاء',
    shortTitle: 'الوحدة الرابعة',
    subtitle: 'ميزان المراجعة • الأخطاء المؤثرة وغير المؤثرة • الحساب المعلق • قيود التصحيح • دراسة حالة زيد والـ JRE',
    badge: 'الوحدة 4 (ميزان المراجعة وتصحيح الأخطاء - المنهج المعتمد)',
    bigIdea: 'الميزان المتوازن ليس بالضرورة نظاماً محاسبياً دقيقاً. تصحيح الأخطاء يعزز من الدقة المحاسبية، والتساوي الحسابي أداة رقابية أولية لا تضمن بمفردها التمثيل الصادق.',
    essentialQuestion: 'هل تصحيح الأخطاء المحاسبية يعيد المصداقية للقوائم المالية، أم أنه يعيد فقط التوازن الحسابي؟'
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: 'الوحدة الثالثة: دفاتر اليومية المساعدة',
    shortTitle: 'الوحدة الثالثة',
    subtitle: 'الدفاتر المساعدة • المبيعات والمشتريات • المردودات والخصومات • دفتر النقدية • التطبيق المتكامل والـ JRE',
    badge: 'الوحدة 3 (الدفاتر المتخصصة - المنهج المعتمد)',
    bigIdea: 'عندما يتضاعف حجم المعاملات، يصبح دفتر اليومية العام غير كافٍ. تخصيص دفاتر لكل نوع من المعاملات المتكررة يزيد الكفاءة دون التضحية بالرقابة.',
    essentialQuestion: 'كيف نوازن بين كفاءة تقسيم العمل المحاسبي وبين استمرار دقة وموثوقية الأرصدة عبر الرقابة المزدوجة؟'
  },
  {
    id: 'unit-1',
    unitNumber: 1,
    title: 'الوحدة الأولى: أساسيات المحاسبة والتقارير المالية',
    shortTitle: 'الوحدة الأولى',
    subtitle: 'المبادئ الأساسية • معادلة الميزانية • أثر المعاملات المالية • القوائم المالية',
    badge: 'الوحدة 1 (الأساسيات المحاسبية)',
    bigIdea: 'المحاسبة هي لغة الأعمال ونظام لمعالجة البيانات المالية لتوفير معلومات ملائمة وموثوقة لاتخاذ القرارات.',
    essentialQuestion: 'كيف تترجم المعاملات المالية إلى قوائم مالية متوازنة تعكس المركز المالي والأداء الحقيقي للمنشأة؟'
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    title: 'الوحدة الثانية: التسجيل المحاسبي والدورة المستندية',
    shortTitle: 'الوحدة الثانية',
    subtitle: 'القيد المزدوج • دفتر اليومية العام • دفتر الأستاذ والترصيد • ميزان المراجعة',
    badge: 'الوحدة 2 (التسجيل والترحيل)',
    bigIdea: 'كل عملية مالية لها طرفان متساويان في القيمة ومتعاكسان في الطبيعة، وتوثيقها يبدأ بمستند ثبوتي وينتهي بميزان مراجعة متوازن.',
    essentialQuestion: 'كيف تضمن الدورة المستندية والقيد المزدوج سلامة السجلات المالية واكتشاف الأخطاء المحاسبية؟'
  }
];

export function getLessonsForUnit(unitId: string): LessonContent[] {
  if (unitId === 'unit-1') return unit1Lessons;
  if (unitId === 'unit-2') return unit2Lessons;
  if (unitId === 'unit-3') return unit3Lessons;
  if (unitId === 'unit-4') return unit4Lessons;
  return unit3Lessons;
}
