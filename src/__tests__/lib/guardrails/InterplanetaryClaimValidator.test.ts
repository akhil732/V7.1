import { describe, it, expect } from 'vitest';
import {
  validateInterplanetaryClaims,
  formatValidationReport,
  type PeriodLordPair,
} from '../../../lib/guardrails/InterplanetaryClaimValidator';

/**
 * Test suite for the Interplanetary Relation Claim Validator.
 * Ensures the guardrail catches rulership-based hallucinations.
 */

const createMockIPRelations = (
  natalAfflicted: PeriodLordPair[] = [],
  transitAfflicted: PeriodLordPair[] = []
) => ({
  natal: {
    context: 'NATAL' as const,
    pairs: [
      {
        lordA: 'Mercury',
        signA: 'Scorpio',
        lordB: 'Venus',
        signB: 'Virgo',
        label: 'MD–AD',
        relation: 'NONE' as const,
        severity: 'NONE' as const,
        impactEnglish: 'No inimical relation.',
        impactTelugu: 'ప్రతికూల సంబంధం లేదు.',
      },
    ],
    afflictedPairs: natalAfflicted,
    worstSeverity: 'NONE' as const,
  },
  transit: {
    context: 'TRANSIT' as const,
    pairs: [
      {
        lordA: 'Mercury',
        signA: 'Libra',
        lordB: 'Venus',
        signB: 'Scorpio',
        label: 'MD–AD',
        relation: 'NONE' as const,
        severity: 'NONE' as const,
        impactEnglish: 'No inimical relation in transit.',
        impactTelugu: 'గోచారంలో ప్రతికూల సంబంధం లేదు.',
      },
    ],
    afflictedPairs: transitAfflicted,
    worstSeverity: 'NONE' as const,
  },
});

describe('InterplanetaryClaimValidator', () => {
  describe('Akhil Case — Rulership Hallucination Detection', () => {
    it('should detect Dwirdwadasha claim when no pair was computed as afflicted (Akhil Telugu)', () => {
      const ipRelations = createMockIPRelations([], []);

      // This is the exact Telugu claim that was hallucinated
      const responseText = `
సంబంధం: బుధుడు (మహాదశ నాథుడు) మరియు శుక్రుడు (అంతర్దశ నాథుడు) మీ జాతకంలో ద్విద్వాదశ (2-12) సంబంధాన్ని కలిగి ఉన్నారు.
ఇది ఒక గ్రహం సంచయ భావం వైపు, మరొకటి వ్యయ భావం వైపు లాగడం వల్ల ఏర్పడిన తీవ్ర స్థితి.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(false);
      expect(result.breaches.length).toBeGreaterThan(0);
      expect(result.breaches[0].type).toBe('DWIRDWADASHA');
      expect(result.breaches[0].severity).toBe('CRITICAL');
      expect(result.breaches[0].reason).toContain('no period lord pair was computed');
      expect(result.breaches[0].reason).toContain('RULERSHIP');
    });

    it('should detect Dwirdwadasha claim when no pair was computed as afflicted (English)', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
The MD–AD period lords (Mercury and Venus) sit in a Dwirdwadasha (2–12) 30-degree relation,
which indicates delayed results during this period.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(false);
      expect(result.breaches.some(b => b.type === 'DWIRDWADASHA')).toBe(true);
    });

    it('should PASS when no Dwirdwadasha/Shadashtaka claims are made', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
The current MD–AD period shows Mercury and Venus with no inimical relation.
The energies flow cooperatively, supporting progress in multiple areas.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(true);
      expect(result.breaches.length).toBe(0);
    });

    it('should PASS when Dwirdwadasha is claimed AND computed', () => {
      const afflicted: PeriodLordPair[] = [
        {
          lordA: 'Mercury',
          signA: 'Scorpio',
          lordB: 'Venus',
          signB: 'Libra',
          label: 'MD–AD',
          relation: 'DWIRDWADASHA' as const,
          severity: 'MODERATE' as const,
        },
      ];

      const ipRelations = createMockIPRelations(afflicted, []);

      const responseText = `
The MD–AD lords are in a Dwirdwadasha (2–12) 30° separation,
indicating that results will be delayed or incomplete during this period.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(true);
      expect(result.breaches.length).toBe(0);
    });

    it('should detect Shadashtaka claim when no pair was computed as afflicted', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
The MD–AD lords are in a Shadashtaka (6–8) 150° quincunx relation,
creating severe elemental and modality clash.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(false);
      expect(result.breaches.some(b => b.type === 'SHADASHTAKA')).toBe(true);
    });

    it('should detect multiple breaches in a single response', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
During this dasha, the MD–AD lords enter a Dwirdwadasha (2–12) configuration.
Moreover, the PD lord creates a Shadashtaka (6–8) quincunx with both.
This is a severely afflicted period.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(false);
      expect(result.breaches.length).toBe(2);
      expect(result.breaches.map(b => b.type).sort()).toEqual(['DWIRDWADASHA', 'SHADASHTAKA']);
    });

    it('should extract claim sentences correctly', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
The MD period lord (Mercury) and AD period lord (Venus) share no Dwirdwadasha relation.
This is good news.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      // "no Dwirdwadasha" should NOT trigger a breach — it's a negation
      // The validator catches explicit claims, not explicit denials
      // So this PASS is correct: no breach because it denies the relation
      expect(result.valid).toBe(true);
    });
  });

  describe('Formatting & Reporting', () => {
    it('should format validation report clearly', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
The MD–AD lords enter Dwirdwadasha (2–12) configuration.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);
      const report = formatValidationReport(result);

      expect(report).toContain('FAIL');
      expect(report).toContain('guardrail breach(es) detected');
      expect(report).toContain('DWIRDWADASHA');
      expect(report).toContain('CRITICAL');
      expect(report).toContain('COMPUTED AFFLICTIONS');
    });

    it('should report PASS case clearly', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
The period lords show no inimical relation.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);
      const report = formatValidationReport(result);

      expect(report).toContain('PASS');
      expect(report).toContain('No guardrail breaches');
    });
  });

  describe('Edge Cases', () => {
    it('should handle responses without any period lord mentions', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
Your chart shows strong Jupiter placements.
This indicates luck and prosperity.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(true);
      expect(result.breaches.length).toBe(0);
      expect(result.claims.dwirdwadasha.length).toBe(0);
      expect(result.claims.shadashtaka.length).toBe(0);
    });

    it('should handle mixed language text (English + Telugu)', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
During this MD–AD period, the period lords (బుధుడు Mercury & శుక్రుడు Venus)
are in a ద్విద్వాదశ (Dwirdwadasha 2–12) configuration.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(false);
      expect(result.breaches.length).toBeGreaterThan(0);
    });

    it('should handle uppercase/lowercase variations', () => {
      const ipRelations = createMockIPRelations([], []);

      const responseText = `
The MD period and AD period lords are in DWIRDWADASHA (2-12) relation.
      `;

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.valid).toBe(false);
      expect(result.breaches.some(b => b.type === 'DWIRDWADASHA')).toBe(true);
    });
  });

  describe('Affiliation Detection', () => {
    it('should correctly identify computed afflictions in result object', () => {
      const afflicted: PeriodLordPair[] = [
        {
          lordA: 'Sun',
          signA: 'Aries',
          lordB: 'Moon',
          signB: 'Taurus',
          label: 'MD–AD',
          relation: 'DWIRDWADASHA' as const,
          severity: 'MODERATE' as const,
        },
      ];

      const ipRelations = createMockIPRelations(afflicted, []);

      const responseText = 'No Dwirdwadasha claims here.';

      const result = validateInterplanetaryClaims(responseText, ipRelations);

      expect(result.computedAfflictions.dwirdwadasha).toEqual(['MD–AD']);
      expect(result.computedAfflictions.shadashtaka).toEqual([]);
    });
  });
});
