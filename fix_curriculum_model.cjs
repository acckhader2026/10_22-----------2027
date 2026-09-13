const fs = require('fs');
let content = fs.readFileSync('src/domain/curriculum/CurriculumModel.ts', 'utf8');

content = content.replace(
  /export const CANONICAL_UNIT_2: UnitSpec = \{\s*id: 'unit-2',\s*unitNumber: 2,\s*titleAr: 'الوحدة الثانية[^']*',\s*subtitleAr: [^\n]+,\s*descriptionAr: [^\n]+,\s*badgeAr: [^\n]+,/,
  `export const CANONICAL_UNIT_2: UnitSpec = {
  id: 'unit-2',
  unitNumber: 2,
  subjectCode: 'ACC.U2',
  titleAr: 'الوحدة الثانية: التسجيل المحاسبي (القيد المزدوج، اليومية، الأستاذ وميزان المراجعة)',
  descriptionAr: 'قاعدة القيد المزدوج • منطق المدين والدائن • اليومية والأستاذ T • ميزان المراجعة والتحقيق الاستقصائي',
  totalNominalMarks: 100,`
);

fs.writeFileSync('src/domain/curriculum/CurriculumModel.ts', content);
