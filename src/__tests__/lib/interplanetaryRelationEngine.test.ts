import { describe, it, expect } from 'vitest';
import {
  classify,
  forwardSep,
  computeGeometry,
  computeInterplanetaryRelations,
  SIGN_NAMES,
  SIGN_ELEMENTS,
  SIGN_MODALITIES
} from '../../lib/engines/InterplanetaryRelationEngine';

describe('InterplanetaryRelationEngine — Geometric & Elemental Logic', () => {
  describe('The Core Geometric Concept of Dwirdwadasha (2–12 / 30°)', () => {
    it('accurately identifies 30-degree separation and forward 2nd / backward 12th houses (sep = 1)', () => {
      // Aries (A) and Taurus (B)
      const sep = forwardSep('Aries', 'Taurus');
      expect(sep).toBe(1);

      const classification = classify('Aries', 'Taurus');
      expect(classification.relation).toBe('DWIRDWADASHA');
      expect(classification.severity).toBe('MODERATE');

      const geom = computeGeometry('Sun', 'Aries', 'Moon', 'Taurus', 'DWIRDWADASHA');
      expect(geom).toBeDefined();
      expect(geom?.angleDegrees).toBe(30);
      expect(geom?.fromAtoB.house).toBe(2);
      expect(geom?.fromAtoB.roleDescription).toContain('sits in 2nd house from Sun (forward');
      expect(geom?.fromBtoA.house).toBe(12);
      expect(geom?.fromBtoA.roleDescription).toContain('sits in 12th house from Moon (backward');
    });

    it('accurately identifies 30-degree separation when reversed (sep = 11: Pisces to Aries or Taurus to Aries)', () => {
      // Taurus (A) and Aries (B)
      const sep = forwardSep('Taurus', 'Aries');
      expect(sep).toBe(11);

      const classification = classify('Taurus', 'Aries');
      expect(classification.relation).toBe('DWIRDWADASHA');

      const geom = computeGeometry('Venus', 'Taurus', 'Mars', 'Aries', 'DWIRDWADASHA');
      expect(geom).toBeDefined();
      expect(geom?.angleDegrees).toBe(30);
      expect(geom?.fromAtoB.house).toBe(12);
      expect(geom?.fromBtoA.house).toBe(2);
    });

    it('identifies 30-degree separation across zodiac boundary (Pisces to Aries)', () => {
      const sep = forwardSep('Pisces', 'Aries');
      expect(sep).toBe(1);
      const geom = computeGeometry('Jupiter', 'Pisces', 'Mars', 'Aries', 'DWIRDWADASHA');
      expect(geom?.angleDegrees).toBe(30);
      expect(geom?.fromAtoB.house).toBe(2);
      expect(geom?.fromBtoA.house).toBe(12);
    });
  });

  describe('The Core Geometric Concept of Shadashtaka (6–8 / 150° quincunx)', () => {
    it('accurately identifies 150-degree quincunx angle and 6th-8th relative placements (sep = 5)', () => {
      // Aries (A) and Virgo (B)
      const sep = forwardSep('Aries', 'Virgo');
      expect(sep).toBe(5);

      const classification = classify('Aries', 'Virgo');
      expect(classification.relation).toBe('SHADASHTAKA');
      expect(classification.severity).toBe('SEVERE');

      const geom = computeGeometry('Sun', 'Aries', 'Mercury', 'Virgo', 'SHADASHTAKA');
      expect(geom).toBeDefined();
      expect(geom?.angleDegrees).toBe(150);
      expect(geom?.fromAtoB.house).toBe(6);
      expect(geom?.fromBtoA.house).toBe(8);
      expect(geom?.sharedElement).toBe(false);
      expect(geom?.sharedModality).toBe(false);
      expect(geom?.elementClashSummary).toContain(
        'Because these two positions share absolutely no planetary elements (fire, earth, air, or water) or structural modalities (cardinal, fixed, or mutable), they struggle to find common ground, creating a severe clash of energies'
      );
    });

    it('accurately identifies 150-degree quincunx angle and 8th-6th relative placements (sep = 7)', () => {
      // Aries (A) and Scorpio (B)
      const sep = forwardSep('Aries', 'Scorpio');
      expect(sep).toBe(7);

      const classification = classify('Aries', 'Scorpio');
      expect(classification.relation).toBe('SHADASHTAKA');

      const geom = computeGeometry('Mars', 'Aries', 'Ketu', 'Scorpio', 'SHADASHTAKA');
      expect(geom).toBeDefined();
      expect(geom?.angleDegrees).toBe(150);
      expect(geom?.fromAtoB.house).toBe(8);
      expect(geom?.fromBtoA.house).toBe(6);
      expect(geom?.sharedElement).toBe(false);
      expect(geom?.sharedModality).toBe(false);
    });

    it('proves mathematically that ALL 24 possible 6-8 sign pairs share ZERO elements and ZERO modalities', () => {
      for (const signA of SIGN_NAMES) {
        for (const signB of SIGN_NAMES) {
          const sep = forwardSep(signA, signB);
          if (sep === 5 || sep === 7) {
            const elemA = SIGN_ELEMENTS[signA];
            const elemB = SIGN_ELEMENTS[signB];
            const modA = SIGN_MODALITIES[signA];
            const modB = SIGN_MODALITIES[signB];

            // Must share NO elements
            expect(elemA).not.toBe(elemB);
            // Must share NO modalities
            expect(modA).not.toBe(modB);

            const geom = computeGeometry('PlanetA', signA, 'PlanetB', signB, 'SHADASHTAKA');
            expect(geom?.sharedElement).toBe(false);
            expect(geom?.sharedModality).toBe(false);
          }
        }
      }
    });
  });

  describe('computeInterplanetaryRelations — End-to-End Evaluation', () => {
    it('evaluates Natal and Transit independently without cross-chart pollution', () => {
      const report = computeInterplanetaryRelations({
        mdLord: 'Jupiter',
        mdNatalSign: 'Cancer',    // Natal: Cancer & Capricorn are 7th (Saptaka/Opposite, not 2-12 or 6-8)
        mdTransitSign: 'Aries',    // Transit: Aries & Virgo are 6-8 Shadashtaka
        adLord: 'Saturn',
        adNatalSign: 'Capricorn',
        adTransitSign: 'Virgo'
      });

      // Natal check: Cancer to Capricorn is sep = 6 (180° opposition / Samasaptaka) -> No Dwirdwadasha or Shadashtaka
      expect(report.natal.afflictedPairs.length).toBe(0);
      expect(report.natal.worstSeverity).toBe('NONE');

      // Transit check: Aries to Virgo is sep = 5 (150° quincunx) -> Shadashtaka SEVERE
      expect(report.transit.afflictedPairs.length).toBe(1);
      expect(report.transit.worstSeverity).toBe('SEVERE');
      expect(report.transit.afflictedPairs[0].relation).toBe('SHADASHTAKA');
      expect(report.transit.afflictedPairs[0].geometry?.angleDegrees).toBe(150);

      // Prompt block checks
      expect(report.promptBlock).toContain('CHECK A: NATAL CHART');
      expect(report.promptBlock).toContain('CHECK B: TRANSIT CHART');
      expect(report.promptBlock).toContain('Note: Transit period lord affliction present now');
      expect(report.promptBlock).toContain('share zero elements and zero modalities');
    });

    it('detects COMPOUND AFFLICTION when both Natal and Transit period lord relations are afflicted', () => {
      const report = computeInterplanetaryRelations({
        mdLord: 'Sun',
        mdNatalSign: 'Leo',       // Leo to Virgo = sep 1 (Dwirdwadasha 30°)
        mdTransitSign: 'Aries',    // Aries to Scorpio = sep 7 (Shadashtaka 150°)
        adLord: 'Mercury',
        adNatalSign: 'Virgo',
        adTransitSign: 'Scorpio'
      });

      expect(report.natal.afflictedPairs.length).toBe(1);
      expect(report.natal.afflictedPairs[0].relation).toBe('DWIRDWADASHA');
      expect(report.natal.afflictedPairs[0].geometry?.angleDegrees).toBe(30);

      expect(report.transit.afflictedPairs.length).toBe(1);
      expect(report.transit.afflictedPairs[0].relation).toBe('SHADASHTAKA');
      expect(report.transit.afflictedPairs[0].geometry?.angleDegrees).toBe(150);

      expect(report.promptBlock).toContain('COMPOUND AFFLICTION: Both natal AND transit period lord relations are inimical');
    });

    it('handles clean configurations with cooperative period lords', () => {
      const report = computeInterplanetaryRelations({
        mdLord: 'Sun',
        mdNatalSign: 'Aries',
        mdTransitSign: 'Leo',
        adLord: 'Jupiter',
        adNatalSign: 'Sagittarius', // 1-5-9 Trine (Trikona, 120°)
        adTransitSign: 'Aries'      // Trine (120°)
      });

      expect(report.natal.afflictedPairs.length).toBe(0);
      expect(report.transit.afflictedPairs.length).toBe(0);
      expect(report.promptBlock).toContain('Period lord configuration is clean in both natal and transit charts');
    });

    it('incorporates Pratyantardasha (PD) lord when provided', () => {
      const report = computeInterplanetaryRelations({
        mdLord: 'Sun',
        mdNatalSign: 'Aries',
        mdTransitSign: 'Aries',
        adLord: 'Moon',
        adNatalSign: 'Leo',
        adTransitSign: 'Leo',
        pdLord: 'Mars',
        pdNatalSign: 'Virgo',     // Aries to Virgo = 6-8 (MD-PD), Leo to Virgo = 2-12 (AD-PD)
        pdTransitSign: 'Virgo'
      });

      expect(report.natal.pairs.length).toBe(3); // MD-AD, MD-PD, AD-PD
      const mdPd = report.natal.pairs.find(p => p.label === 'MD–PD');
      const adPd = report.natal.pairs.find(p => p.label === 'AD–PD');

      expect(mdPd?.relation).toBe('SHADASHTAKA');
      expect(mdPd?.geometry?.angleDegrees).toBe(150);
      expect(adPd?.relation).toBe('DWIRDWADASHA');
      expect(adPd?.geometry?.angleDegrees).toBe(30);
    });
  });
});
