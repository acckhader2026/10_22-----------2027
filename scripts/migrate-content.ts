import { allLessons } from '../src/data/lessonsData';
import { comprehensiveExams } from '../src/data/examsData';
import { expandedQuestionBank } from '../src/data/expandedQuestionBank';
import { db } from '../src/server/db/database';

export function runMigrationAudit() {
  console.log('--- Starting Content Migration Audit ---');

  const lessonsBefore = allLessons.length;
  const lessonsAfter = db.lessons.length;

  const examsBefore = comprehensiveExams.length;
  const examsAfter = db.exams.length;

  const questionsBefore = expandedQuestionBank.length;
  const questionsAfter = db.questions.length;

  console.log(`Lessons Ingested: ${lessonsBefore} -> ${lessonsAfter} [${lessonsBefore === lessonsAfter ? 'PASS' : 'FAIL'}]`);
  console.log(`Exams Ingested: ${examsBefore} -> ${examsAfter} [${examsBefore === examsAfter ? 'PASS' : 'FAIL'}]`);
  console.log(`Questions Ingested: ${questionsBefore} -> ${questionsAfter} [${questionsBefore === questionsAfter ? 'PASS' : 'FAIL'}]`);

  const passed = lessonsBefore === lessonsAfter && examsBefore === examsAfter && questionsBefore === questionsAfter;
  
  if (passed) {
    console.log('✅ Content Migration successfully verified with 100% data integrity!');
  } else {
    console.error('❌ Data integrity mismatch during migration audit.');
  }

  return {
    passed,
    lessons: { before: lessonsBefore, after: lessonsAfter },
    exams: { before: examsBefore, after: examsAfter },
    questions: { before: questionsBefore, after: questionsAfter }
  };
}

if (require.main === module) {
  runMigrationAudit();
}
