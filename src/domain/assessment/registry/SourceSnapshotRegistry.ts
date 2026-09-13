import crypto from 'crypto';

export interface SourceSnapshot {
  source_id: string;
  source_name: string;
  source_version: string;
  publisher: string;
  curriculum_code: string;
  content_hash: string;
  snapshot_hash: string;
  created_at: string;
  verification_status: 'VERIFIED' | 'PENDING' | 'REVOKED';
  verified_by: string;
  unit_scope: string;
  total_referenced_pages: number;
}

export class SourceSnapshotRegistry {
  private snapshots: Map<string, SourceSnapshot> = new Map();

  constructor() {
    this.seedCanonicalSources();
  }

  private hashString(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  private seedCanonicalSources() {
    const canonicalSources: Array<Omit<SourceSnapshot, 'snapshot_hash'>> = [
      {
        source_id: 'MOE-EB-ACC-2025-U01',
        source_name: 'كتاب المحاسبة المالية المعتمد - البكالوريا المصرية (EB) - الوحدة الأولى',
        source_version: 'v2025.1.0',
        publisher: 'وزارة التربية والتعليم والتعليم الفني - قطاع التعليم التجاري',
        curriculum_code: 'EB-ACC-SEC3-U01',
        content_hash: this.hashString('MOE_EGYPT_EB_ACC_UNIT_1_CANONICAL_CONTENT_2025'),
        created_at: '2025-09-01T00:00:00.000Z',
        verification_status: 'VERIFIED',
        verified_by: 'Academic Board of Commercial Education & Standards',
        unit_scope: 'الوحدة الأولى: المبادئ المحاسبية ودورة العمليات المالية',
        total_referenced_pages: 142
      },
      {
        source_id: 'EB-CURRICULUM-FRAMEWORK-U01',
        source_name: 'الإطار المرجعي لمعايير تقييم الكفاءة المحاسبية (EB-CFW)',
        source_version: 'v2.4.0',
        publisher: 'هيئة جودة التعليم والاعتماد الأكاديمي',
        curriculum_code: 'CFW-ACC-01',
        content_hash: this.hashString('CURRICULUM_FRAMEWORK_U01_OBJECTIVES_MATRIX_2025'),
        created_at: '2025-08-15T00:00:00.000Z',
        verification_status: 'VERIFIED',
        verified_by: 'Curriculum & Psychometric Review Committee',
        unit_scope: 'المصفوفة المهارية والمعرفية للوحدة الأولى',
        total_referenced_pages: 48
      },
      {
        source_id: 'EB-JRE-CANONICAL-RUBRIC-20M',
        source_name: 'الدليل المعياري لسلم تقييم مقال الاستدلال المحاسبي (20 درجة)',
        source_version: 'v3.0.0',
        publisher: 'المركز القومي للامتحانات والتقويم التربوي',
        curriculum_code: 'JRE-RUBRIC-20M',
        content_hash: this.hashString('JRE_20_MARKS_RUBRIC_5_CRITERIA_x_4_EACH'),
        created_at: '2025-08-20T00:00:00.000Z',
        verification_status: 'VERIFIED',
        verified_by: 'National Examination Center - Senior Assessment Specialist',
        unit_scope: 'استدلال JRE - الوحدة الأولى وكافة الوحدات المحاسبية',
        total_referenced_pages: 18
      }
    ];

    for (const src of canonicalSources) {
      const snapshot_hash = this.hashString(
        `${src.source_id}:${src.source_version}:${src.content_hash}:${src.created_at}`
      );
      this.snapshots.set(src.source_id, {
        ...src,
        snapshot_hash
      });
    }
  }

  public getSnapshot(sourceId: string): SourceSnapshot | undefined {
    return this.snapshots.get(sourceId);
  }

  public getAllSnapshots(): SourceSnapshot[] {
    return Array.from(this.snapshots.values());
  }

  public verifyIntegrity(sourceId: string, providedHash: string): boolean {
    const snap = this.snapshots.get(sourceId);
    if (!snap) return false;
    return snap.content_hash === providedHash || snap.snapshot_hash === providedHash;
  }
}

export const sourceSnapshotRegistry = new SourceSnapshotRegistry();
