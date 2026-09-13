import { questionBankData } from './src/data/questionBankData';
import { expandedQuestionBank } from './src/data/expandedQuestionBank';

console.log(`questionBankData total: ${questionBankData.length}`);
console.log(`expandedQuestionBank total: ${expandedQuestionBank.length}`);

// check overlap
let shared = 0;
for (const q of questionBankData) {
  if (expandedQuestionBank.find(eq => eq.id === q.id)) {
    shared++;
  }
}
console.log(`Shared IDs: ${shared}`);
