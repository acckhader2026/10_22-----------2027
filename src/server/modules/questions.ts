import { Request, Response } from 'express';
import { db } from '../db/database';

export function handleGetQuestions(req: Request, res: Response) {
  const { lessonId, type, difficulty, search } = req.query;

  let list = db.questions;

  if (lessonId) {
    list = list.filter(q => q.lesson_id === lessonId);
  }
  if (type) {
    list = list.filter(q => q.type.toLowerCase() === (type as string).toLowerCase());
  }
  if (difficulty) {
    list = list.filter(q => q.difficulty === difficulty);
  }
  if (search) {
    const s = (search as string).toLowerCase();
    list = list.filter(q => q.content.toLowerCase().includes(s) || q.concept.toLowerCase().includes(s));
  }

  // Join options and tags - Sanitize sensitive keys prior to student attempt
  const results = list.map(q => {
    const options = db.questionOptions
      .filter(o => o.question_id === q.id)
      .sort((a, b) => a.order_index - b.order_index)
      .map(({ is_correct, ...opt }) => opt); // P0 Fix: Remove is_correct from options

    const tags = db.questionTags
      .filter(t => t.question_id === q.id)
      .map(t => t.tag);

    const { explanation, ...sanitizedQ } = q;

    return {
      ...sanitizedQ,
      options,
      tags
    };
  });

  return res.json({
    total: results.length,
    questions: results
  });
}

export function handleGetQuestionById(req: Request, res: Response) {
  const { id } = req.params;
  const q = db.questions.find(item => item.id === id);
  if (!q) {
    return res.status(404).json({ error: 'السؤال غير موجود' });
  }

  const options = db.questionOptions
    .filter(o => o.question_id === q.id)
    .sort((a, b) => a.order_index - b.order_index)
    .map(({ is_correct, ...opt }) => opt); // P0 Fix: Remove is_correct from options

  const tags = db.questionTags
    .filter(t => t.question_id === q.id)
    .map(t => t.tag);

  const { explanation, ...sanitizedQ } = q;

  return res.json({
    question: {
      ...sanitizedQ,
      options,
      tags
    }
  });
}
