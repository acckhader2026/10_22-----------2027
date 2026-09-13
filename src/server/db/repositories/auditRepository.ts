import { db } from '../database';
import { DbAuditLog } from '../schema';

export class AuditRepository {
  async record(data: Omit<DbAuditLog, 'id' | 'timestamp'>): Promise<DbAuditLog> {
    return db.recordAuditLog(data);
  }

  async list(filters?: { actor_id?: string; resource?: string; action?: string }): Promise<DbAuditLog[]> {
    return db.getAuditLogs(filters);
  }
}

export const auditRepository = new AuditRepository();
