import { describe, it, expect } from 'vitest';
import { masterIntegrityAuditEngine } from '../../domain/assessment/audit/MasterIntegrityAuditEngine';
import { verifiedAssessmentRegistry } from '../../domain/assessment/registry/VerifiedAssessmentRegistry';
import { sourceSnapshotRegistry } from '../../domain/assessment/registry/SourceSnapshotRegistry';

export function runMasterAuditValidationTest() {
  console.log('=== RUNNING MASTER INTEGRITY AUDIT TEST ===');
  
  const report = masterIntegrityAuditEngine.runMasterAudit();
  
  console.log(`Platform Version: ${report.platformVersion}`);
  console.log(`Overall Status: ${report.overallStatus}`);
  console.log(`Total Registered Items: ${report.totalRegisteredItems}`);
  console.log(`Total Reachable Items: ${report.totalLearnerReachableItems}`);
  console.log(`Total Orphan Items: ${report.totalOrphanItems}`);
  console.log(`Zero Orphan Guarantee: ${report.zeroOrphanGuarantee}`);
  
  console.log('\n--- SPLIT COVERAGE METRICS ---');
  console.log(`Source Coverage: ${report.coverage.sourceCoveragePercentage}%`);
  console.log(`Content Coverage: ${report.coverage.contentCoveragePercentage}%`);
  console.log(`Assessment Coverage: ${report.coverage.assessmentCoveragePercentage}%`);
  console.log(`Learner Reachability: ${report.coverage.learnerReachabilityPercentage}%`);
  console.log(`Grading Coverage: ${report.coverage.gradingCoveragePercentage}%`);
  console.log(`Mastery Coverage: ${report.coverage.masteryCoveragePercentage}%`);
  console.log(`Analytics Coverage: ${report.coverage.analyticsCoveragePercentage}%`);

  console.log('\n--- 13 QUALITY GATES STATUS ---');
  report.gates.forEach(g => {
    console.log(`[${g.status}] ${g.gateId}: ${g.gateNameEn} - ${g.evidence}`);
  });

  const allPassed = report.overallStatus === 'PASS';
  console.log(`\nMaster Integrity Audit Passed: ${allPassed}`);
  return { success: allPassed, report };
}

describe('Master Integrity Audit Engine', () => {
  it('should pass full master integrity audit and zero orphan guarantee', () => {
    const res = runMasterAuditValidationTest();
    expect(res.report.overallStatus).toBe('PASS');
    expect(res.report.zeroOrphanGuarantee).toBe(true);
  });
});

// Self-execute if run directly
if (typeof require !== 'undefined' && require.main === module) {
  runMasterAuditValidationTest();
}

