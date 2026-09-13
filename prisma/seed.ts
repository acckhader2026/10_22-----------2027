/**
 * prisma/seed.ts
 * 
 * Production Database Seeder & Legacy Migration for EB Accounting Platform
 * Seeds all core entities into PostgreSQL via Prisma:
 * 1. Subjects, Courses, Units, Lessons, and explicit Learning Objectives
 * 2. RBAC Users with Bcrypt salt rounds = 10 (Admin, Teacher, Content Manager, Student)
 * 3. 62 Validated Questions with explicit LO mapping or UNMAPPED status
 * 4. Comprehensive Examination Papers and Sections
 */

import { PrismaClient, Role, QuestionType, QuestionStatus } from '@prisma/client';
import { hashPassword } from '../src/server/auth/password';
import { allLessons } from '../src/data/lessonsData';
import { comprehensiveExams } from '../src/data/examsData';
import { expandedQuestionBank } from '../src/data/expandedQuestionBank';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('--- [PRISMA SEED] Starting PostgreSQL Database Migration & Seeding ---');

  // 1. Seed Subjects, Courses, Units
  console.log('Seeding Subject, Course, and Unit...');
  const subject = await prisma.subject.upsert({
    where: { slug: 'financial-accounting' },
    update: { name: 'المحاسبة المالية وإتقان الأعمال', status: 'ACTIVE' },
    create: {
      id: 'subj-acc-1',
      name: 'المحاسبة المالية وإتقان الأعمال',
      slug: 'financial-accounting',
      description: 'منهاج المحاسبة المعتمد لشهادة البكالوريا المصرية (EB)',
      status: 'ACTIVE'
    }
  });

  await prisma.course.upsert({
    where: { code: 'EB-ACC-101' },
    update: { title: 'محاسبة الصف العاشر (البكالوريا المصرية)' },
    create: {
      id: 'course-eb-acc-g10',
      subjectId: subject.id,
      title: 'محاسبة الصف العاشر (البكالوريا المصرية)',
      code: 'EB-ACC-101',
      description: 'الأسس النظرية والتطبيقية للمحاسبة المالية، معادلة الميزانية، وقيود اليومية'
    }
  });

  const unit = await prisma.unit.upsert({
    where: { id: 'unit-1' },
    update: { title: 'الوحدة الأولى: لماذا نتعلم المحاسبة؟', unitNumber: 1 },
    create: {
      id: 'unit-1',
      subjectId: subject.id,
      unitNumber: 1,
      title: 'الوحدة الأولى: لماذا نتعلم المحاسبة؟',
      description: 'طبيعة المحاسبة، المعادلة المحاسبية، القيد المزدوج، دفتر الأستاذ، الحسابات الختامية، ومقال JRE',
      orderIndex: 1
    }
  });

  // 2. Seed Lessons & Learning Objectives
  console.log('Seeding Lessons & Learning Objectives...');
  for (let index = 0; index < allLessons.length; index++) {
    const l = allLessons[index];
    await prisma.lesson.upsert({
      where: { slug: `lesson-${l.lessonNumber}` },
      update: {
        title: l.title,
        lessonNumber: l.lessonNumber,
        difficulty: index < 2 ? 'basic' : index < 4 ? 'intermediate' : 'advanced',
        orderIndex: l.lessonNumber,
        contentJson: l as any
      },
      create: {
        id: l.id,
        unitId: unit.id,
        lessonNumber: l.lessonNumber,
        title: l.title,
        slug: `lesson-${l.lessonNumber}`,
        contentJson: l as any,
        difficulty: index < 2 ? 'basic' : index < 4 ? 'intermediate' : 'advanced',
        orderIndex: l.lessonNumber,
        status: 'PUBLISHED'
      }
    });
  }

  const explicitLOs = [
    { id: 'LO-1.1', lessonId: 'lesson-1', code: 'LO-1.1', descriptionAr: 'التمييز بين مستخدمي المعلومات المحاسبية الداخليين والخارجيين وقراراتهم', taxonomyLevel: 'UNDERSTAND', bloomsLevel: 'ANALYZE' },
    { id: 'LO-1.2', lessonId: 'lesson-1', code: 'LO-1.2', descriptionAr: 'شرح مفهوم الكيان الاقتصادي واستقلاليته عن ملاكه', taxonomyLevel: 'UNDERSTAND', bloomsLevel: 'UNDERSTAND' },
    { id: 'LO-2.1', lessonId: 'lesson-2', code: 'LO-2.1', descriptionAr: 'تطبيق معادلة الميزانية: الأصول = الخصوم + حقوق الملكية', taxonomyLevel: 'APPLY', bloomsLevel: 'APPLY' },
    { id: 'LO-2.2', lessonId: 'lesson-2', code: 'LO-2.2', descriptionAr: 'تحليل أثر العمليات المالية المركبة على توازن المعادلة المحاسبية', taxonomyLevel: 'ANALYZE', bloomsLevel: 'ANALYZE' },
    { id: 'LO-3.1', lessonId: 'lesson-3', code: 'LO-3.1', descriptionAr: 'إعداد قيود اليومية وفق نظرية القيد المزدوج وقواعد المدين والدائن', taxonomyLevel: 'APPLY', bloomsLevel: 'APPLY' },
    { id: 'LO-3.2', lessonId: 'lesson-3', code: 'LO-3.2', descriptionAr: 'معالجة قيود الشراء والبيع النقدي والآجل وتأثيرها على حسابات الأستاذ', taxonomyLevel: 'APPLY', bloomsLevel: 'APPLY' },
    { id: 'LO-4.1', lessonId: 'lesson-4', code: 'LO-4.1', descriptionAr: 'ترحيل قيود اليومية إلى دفتر الأستاذ العام (T-Account)', taxonomyLevel: 'APPLY', bloomsLevel: 'APPLY' },
    { id: 'LO-4.2', lessonId: 'lesson-4', code: 'LO-4.2', descriptionAr: 'ترصيد الحسابات وإعداد ميزان المراجعة بالمجاميع والأرصدة', taxonomyLevel: 'ANALYZE', bloomsLevel: 'EVALUATE' },
    { id: 'LO-5.1', lessonId: 'lesson-5', code: 'LO-5.1', descriptionAr: 'إعداد حساب المتاجرة وحساب الأرباح والخسائر لتحديد صافي الدخل', taxonomyLevel: 'APPLY', bloomsLevel: 'APPLY' },
    { id: 'LO-5.2', lessonId: 'lesson-5', code: 'LO-5.2', descriptionAr: 'تبويب عناصر قائمة المركز المالي وفق الأصول والخصوم المتداولة وغير المتداولة', taxonomyLevel: 'ANALYZE', bloomsLevel: 'ANALYZE' },
    { id: 'LO-6.1', lessonId: 'lesson-6', code: 'LO-6.1', descriptionAr: 'صياغة مقال تبرير محاسبي (JRE) وفق معايير المحاور الستة', taxonomyLevel: 'EVALUATE', bloomsLevel: 'CREATE' }
  ];

  for (const lo of explicitLOs) {
    await prisma.learningObjective.upsert({
      where: { code: lo.code },
      update: {
        descriptionAr: lo.descriptionAr,
        taxonomyLevel: lo.taxonomyLevel,
        bloomsLevel: lo.bloomsLevel
      },
      create: {
        id: lo.id,
        lessonId: lo.lessonId,
        code: lo.code,
        descriptionAr: lo.descriptionAr,
        taxonomyLevel: lo.taxonomyLevel,
        bloomsLevel: lo.bloomsLevel
      }
    });
  }

  // 3. Seed Canonical Users with Bcrypt
  console.log('Seeding Canonical RBAC Users...');
  const usersToSeed = [
    {
      id: 'usr-admin-1',
      email: 'admin@eb.edu.eg',
      password: 'AdminPassword123!',
      role: 'ADMIN' as Role,
      firstName: 'أحمد',
      lastName: 'المدير'
    },
    {
      id: 'usr-teacher-1',
      email: 'teacher@eb.edu.eg',
      password: 'TeacherPassword123!',
      role: 'TEACHER' as Role,
      firstName: 'محمود',
      lastName: 'المعلم'
    },
    {
      id: 'usr-content-1',
      email: 'content@eb.edu.eg',
      password: 'ContentPassword123!',
      role: 'CONTENT_MANAGER' as Role,
      firstName: 'سارة',
      lastName: 'المحتوى'
    },
    {
      id: 'usr-student-1',
      email: 'student@eb.edu.eg',
      password: 'StudentPassword123!',
      role: 'STUDENT' as Role,
      firstName: 'عمر',
      lastName: 'الطالب'
    }
  ];

  for (const u of usersToSeed) {
    const passwordHash = await hashPassword(u.password);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        passwordHash,
        role: u.role,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: `${u.firstName} ${u.lastName}`
      },
      create: {
        id: u.id,
        email: u.email,
        passwordHash,
        role: u.role,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: `${u.firstName} ${u.lastName}`,
        isActive: true
      }
    });
  }

  // 4. Seed Questions from Question Bank (62 questions)
  console.log('Seeding Question Bank items with LO verification...');
  const validLOs = new Set(explicitLOs.map(l => l.id));

  const typeMap: Record<string, QuestionType> = {
    mcq: 'MCQ',
    true_false: 'TRUE_FALSE',
    fill_blank: 'FILL_BLANK',
    concept: 'SHORT_ANSWER',
    applied: 'NUMERICAL',
    case: 'CASE_STUDY',
    analytical: 'SHORT_ANSWER',
    jre: 'JRE',
    t_account: 'T_ACCOUNT'
  };

  let unmappedCount = 0;
  for (const q of expandedQuestionBank) {
    const hasValidLO = q.learningObjectiveId && validLOs.has(q.learningObjectiveId);
    const status: QuestionStatus = hasValidLO ? 'ACTIVE' : 'UNMAPPED';
    if (!hasValidLO) unmappedCount++;

    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        stem: q.question,
        options: q.options as any,
        correctAnswer: q.correctAnswer !== undefined ? String(q.correctAnswer) : null,
        explanation: q.explanation || null,
        difficulty: q.difficulty || 'basic',
        concept: q.concept || 'مفاهيم عامة',
        learningObjectiveId: hasValidLO ? q.learningObjectiveId : null,
        status
      },
      create: {
        id: q.id,
        unitId: 'unit-1',
        lessonId: q.lessonId || 'lesson-1',
        learningObjectiveId: hasValidLO ? q.learningObjectiveId : null,
        questionType: typeMap[q.questionType] || 'MCQ',
        stem: q.question,
        options: q.options as any,
        correctAnswer: q.correctAnswer !== undefined ? String(q.correctAnswer) : null,
        explanation: q.explanation || null,
        difficulty: q.difficulty || 'basic',
        concept: q.concept || 'مفاهيم عامة',
        sourceReference: q.sourceMapping?.source_document || 'كتاب الوزارة',
        sourcePage: q.sourceMapping?.source_page || 1,
        status
      }
    });
  }

  // 5. Seed Official Exams
  console.log('Seeding Official Exams and Sections...');
  for (const e of comprehensiveExams) {
    await prisma.exam.upsert({
      where: { id: e.id },
      update: {
        title: e.title,
        subtitle: e.subtitle,
        timeAllowedMinutes: e.timeAllowedMinutes,
        totalMarks: e.totalMarks,
        instructions: e.instructions as any
      },
      create: {
        id: e.id,
        title: e.title,
        subtitle: e.subtitle,
        timeAllowedMinutes: e.timeAllowedMinutes,
        totalMarks: e.totalMarks,
        instructions: e.instructions as any,
        status: 'ACTIVE'
      }
    });
  }

  const finalUserCount = await prisma.user.count();
  const finalQuestionCount = await prisma.question.count();
  const finalExamCount = await prisma.exam.count();

  console.log('=== [PRISMA SEED SUMMARY] ===');
  console.log(`✓ Total Users in PostgreSQL: ${finalUserCount}`);
  console.log(`✓ Total Questions in PostgreSQL: ${finalQuestionCount} (${unmappedCount} UNMAPPED explicitly)`);
  console.log(`✓ Total Exams in PostgreSQL: ${finalExamCount}`);
  console.log('✓ PostgreSQL Database Seeded Successfully.');
}

if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
      console.error('Seed error:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
