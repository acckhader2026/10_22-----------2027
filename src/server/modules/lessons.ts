import { Request, Response } from 'express';
import { db } from '../db/database';

export function handleGetLessons(req: Request, res: Response) {
  const { unitId } = req.query;
  let list = db.lessons;
  if (unitId) {
    list = list.filter(l => l.unit_id === unitId);
  }
  return res.json({
    lessons: list.map(l => ({
      id: l.id,
      unit_id: l.unit_id,
      title: l.title,
      lesson_number: l.lesson_number,
      slug: l.slug,
      learning_objectives: l.learning_objectives,
      difficulty: l.difficulty,
      order_index: l.order_index
    }))
  });
}

export function handleGetLessonById(req: Request, res: Response) {
  const { id } = req.params;
  const lesson = db.lessons.find(l => l.id === id || l.slug === id);
  if (!lesson) {
    return res.status(404).json({ error: 'الدرس غير موجود' });
  }
  return res.json({ lesson });
}
