import { describe, it, expect } from 'vitest';
import {
  VedicReasoningLayer,
  inferVedicDomain,
  buildVedicReasoningSection,
  VedicDomain
} from '../../lib/engines/VedicReasoningLayer';
import { BirthDetails } from '../../types';

describe('VedicReasoningLayer', () => {
  const mockBirthDetails: BirthDetails = {
    name: 'Ananya Sharma',
    gender: 'Female',
    date: '1996-11-01',
    time: '12:00',
    approximateTime: false,
    place: 'Hyderabad, Telangana, India',
    latitude: 17.385,
    longitude: 78.4867,
    timezone: 5.5
  };

  // Canonical horoscope mock with Sagittarius Lagna (H1) and Gemini Moon (H7)
  const mockHoroscopeData = {
    horoscope: {
      ascendant: { sign: 'Sagittarius', degree: 14.5 },
      planets: {
        Ascendant: { sign: 'Sagittarius', degree: 14.5, house: 1 },
        Sun: { sign: 'Libra', degree: 15.2, house: 11 },
        Moon: { sign: 'Gemini', degree: 8.4, house: 7 },
        Mars: { sign: 'Leo', degree: 22.1, house: 9 },
        Mercury: { sign: 'Libra', degree: 28.0, house: 11 },
        Jupiter: { sign: 'Cancer', degree: 5.0, house: 8 }, // 8th house (Trika)
        Venus: { sign: 'Virgo', degree: 12.3, house: 10, combust: false },
        Saturn: { sign: 'Pisces', degree: 7.6, house: 4, retrograde: true },
        Rahu: { sign: 'Virgo', degree: 18.0, house: 10 },
        Ketu: { sign: 'Pisces', degree: 18.0, house: 4 }
      },
      divisional_charts: {
        'D-1_rasi': {
          Ascendant: { sign: 'Sagittarius', degree: 14.5, house: 1 },
          Sun: { sign: 'Libra', degree: 15.2, house: 11 },
          Moon: { sign: 'Gemini', degree: 8.4, house: 7 },
          Mars: { sign: 'Leo', degree: 22.1, house: 9 },
          Mercury: { sign: 'Libra', degree: 28.0, house: 11 },
          Jupiter: { sign: 'Cancer', degree: 5.0, house: 8 },
          Venus: { sign: 'Virgo', degree: 12.3, house: 10 },
          Saturn: { sign: 'Pisces', degree: 7.6, house: 4, retrograde: true },
          Rahu: { sign: 'Virgo', degree: 18.0, house: 10 },
          Ketu: { sign: 'Pisces', degree: 18.0, house: 4 }
        }
      }
    }
  };

  describe('inferVedicDomain', () => {
    it('accurately identifies progeny domain in English and Telugu', () => {
      expect(inferVedicDomain('When will I have a child? We have been trying.')).toBe('progeny');
      expect(inferVedicDomain('మాకు సంతానం ఎప్పుడు కలుగుతుంది?')).toBe('progeny');
      expect(inferVedicDomain('সন্তান বা গর্ভధారణ')).toBe('general'); // non-configured fallback
      expect(inferVedicDomain('संतान प्राप्ति कब होगी?')).toBe('progeny');
    });

    it('identifies marriage domain queries', () => {
      expect(inferVedicDomain('When will I get married?')).toBe('marriage');
      expect(inferVedicDomain('నా వివాహం ఎప్పుడు జరుగుతుంది?')).toBe('marriage');
      expect(inferVedicDomain('शादी का योग कब है?')).toBe('marriage');
    });

    it('identifies career, health, finance, and litigation queries', () => {
      expect(inferVedicDomain('Will I get a promotion in my job?')).toBe('career');
      expect(inferVedicDomain('ఆరోగ్యం ఎలా ఉంటుంది, శస్త్రచికిత్స అవసరమా?')).toBe('health');
      expect(inferVedicDomain('డబ్బు మరియు ఆర్థిక పరిస్థితి ఎలా ఉంది?')).toBe('finance');
      expect(inferVedicDomain('కోర్టు కేసులో విజయం సాధ్యమేనా?')).toBe('litigation');
      expect(inferVedicDomain('Will I buy a house or plot?')).toBe('property');
      expect(inferVedicDomain('When can I go abroad on a visa?')).toBe('foreign_travel');
    });
  });

  describe('Three-Layer Computation', () => {
    it('computes Natal Promise with verified house lords, Trika and Karakas', () => {
      const result = VedicReasoningLayer.compute(
        mockBirthDetails,
        mockHoroscopeData,
        'progeny',
        'When will I have a child?',
        new Date('2026-09-01')
      );

      expect(result.domain).toBe('progeny');
      expect(result.natalPromise).toBeDefined();
      expect(['strong', 'moderate', 'delayed', 'obstructed']).toContain(result.natalPromise.verdict);
      expect(result.natalPromise.primaryHouses.length).toBeGreaterThan(0);
      expect(result.natalPromise.karakas.length).toBeGreaterThan(0);

      // Jupiter is in 8th house (Trika)
      const jupiterKaraka = result.natalPromise.karakas.find((k) => k.planet === 'Jupiter');
      expect(jupiterKaraka).toBeDefined();
      expect(jupiterKaraka?.house).toBe(8);
    });

    it('computes Layer 2 Dasha Activation with double Trika detection', () => {
      const result = VedicReasoningLayer.compute(
        mockBirthDetails,
        mockHoroscopeData,
        'progeny',
        'When will I have a child?',
        new Date('2026-09-01')
      );

      expect(result.dashaActivation).toBeDefined();
      expect(['supportive', 'neutral', 'challenging', 'critical']).toContain(result.dashaActivation.verdict);
      expect(result.dashaActivation.mahadasha).toBeDefined();
      expect(result.dashaActivation.antardasha).toBeDefined();
      expect(typeof result.dashaActivation.doubleTrikaFlag).toBe('boolean');
    });

    it('computes Layer 3 Transit Confirmation', () => {
      const result = VedicReasoningLayer.compute(
        mockBirthDetails,
        mockHoroscopeData,
        'progeny',
        'When will I have a child?',
        new Date('2026-09-01')
      );

      expect(result.transitConfirmation).toBeDefined();
      expect(['confirming', 'neutral', 'contradicting']).toContain(result.transitConfirmation.verdict);
      expect(result.transitConfirmation.jupiterTransit).toBeDefined();
      expect(result.transitConfirmation.saturnTransit).toBeDefined();
      expect(result.transitConfirmation.rahuTransit).toBeDefined();
    });

    it('generates Historical Event Validation questions for chart verification', () => {
      const result = VedicReasoningLayer.compute(
        mockBirthDetails,
        mockHoroscopeData,
        'progeny',
        'When will I have a child?',
        new Date('2026-09-01')
      );

      expect(result.historicalEventWindows.length).toBeGreaterThan(0);
      const firstWindow = result.historicalEventWindows[0];
      expect(firstWindow.validationQuestion).toBeDefined();
      expect(firstWindow.validationQuestionTelugu).toBeDefined();
      expect(firstWindow.expectedEventTypes.length).toBeGreaterThan(0);
    });

    it('generates ranked Future Timing Windows', () => {
      const result = VedicReasoningLayer.compute(
        mockBirthDetails,
        mockHoroscopeData,
        'progeny',
        'When will I have a child?',
        new Date('2026-09-01')
      );

      expect(result.futureTimingWindows.length).toBeGreaterThanOrEqual(2);
      const primary = result.futureTimingWindows[0];
      expect(primary.favorabilityScore).toBeGreaterThanOrEqual(6);
      expect(primary.action).toBeDefined();
      expect(primary.actionTelugu).toBeDefined();
      expect(primary.keyConditions.length).toBeGreaterThan(0);
    });

    it('flags missing divisional charts like D-7 for progeny', () => {
      const result = VedicReasoningLayer.compute(
        mockBirthDetails,
        mockHoroscopeData,
        'progeny',
        'When will I have a child?',
        new Date('2026-09-01')
      );

      expect(result.missingDataItems).toContain('D-7 Saptamsa chart');
    });

    it('formats ground truth prompt block under token constraints', () => {
      const result = VedicReasoningLayer.compute(
        mockBirthDetails,
        mockHoroscopeData,
        'progeny',
        'When will I have a child?',
        new Date('2026-09-01')
      );

      const promptSection = buildVedicReasoningSection(result, 'te');
      expect(promptSection).toContain('VEDIC THREE-LAYER REASONING FRAMEWORK');
      expect(promptSection).toContain('LAYER 1: NATAL PROMISE');
      expect(promptSection).toContain('LAYER 2: DASHA ACTIVATION');
      expect(promptSection).toContain('LAYER 3: SKY CONFIRMATION');
      expect(promptSection).toContain('HISTORICAL VALIDATION QUESTIONS');
      expect(promptSection).toContain('FUTURE TIMING & PREDICTIONS');
      expect(promptSection.length).toBeLessThan(6000);
    });
  });
});
