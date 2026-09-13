const fs = require('fs');

const lessonFiles = [
  'lesson2_1.ts', 'lesson2_2.ts', 'lesson2_3.ts',
  'lesson2_4.ts', 'lesson2_5.ts', 'lesson2_6.ts'
];

let out = `export const CANONICAL_UNIT_2: UnitSpec = {
  id: 'unit-2',
  unitNumber: 2,
  titleAr: 'الوحدة الثانية: التسجيل المحاسبي (القيد المزدوج، اليومية، الأستاذ وميزان المراجعة)',
  subtitleAr: 'قاعدة القيد المزدوج • منطق المدين والدائن • اليومية والأستاذ T • ميزان المراجعة والتحقيق الاستقصائي',
  descriptionAr: 'الوحدة الثانية',
  badgeAr: 'الوحدة 2 (التسجيل والرقابة)',
  lessons: [
`;

for (let i=0; i<lessonFiles.length; i++) {
  const content = fs.readFileSync('src/data/unit2Lessons/' + lessonFiles[i], 'utf8');
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
  const subtitleMatch = content.match(/subtitle:\s*['"]([^'"]+)['"]/);
  const idMatch = content.match(/id:\s*['"]u2-lesson-([^'"]+)['"]/);
  const lessonNumber = i + 1;
  
  out += `    {
      id: 'lesson-${lessonNumber}', // Adapting 'u2-lesson-${lessonNumber}' -> canonical 'lesson-${lessonNumber}' within unit-2
      lessonNumber: ${lessonNumber},
      unitId: 'unit-2',
      titleAr: '${titleMatch ? titleMatch[1] : ''}',
      subtitleAr: '${subtitleMatch ? subtitleMatch[1] : ''}',
      textbookPages: [35, 41], // Placeholder, adjust if needed
      nominalWeight: 16,
      objectives: [
        // Objectives placeholder
      ]
    },\n`;
}

out += `  ]
};
`;

console.log(out);
