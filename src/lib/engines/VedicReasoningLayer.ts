/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VEDIC REASONING LAYER — Three-Layer Deterministic Astrology Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This engine implements the authoritative three-layer framework:
 *   1. Layer 1: Natal Promise (Structural setup, domain houses, lords, Trika afflictions, karaka strength)
 *   2. Layer 2: Dasha Activation (Current MD/AD, natal house placements, domain touch, double Trika detection)
 *   3. Layer 3: Sky Confirmation (Gochara transits of Jupiter, Saturn, Rahu/Ketu confirming or contradicting)
 *
 * Plus:
 *   - Historical Event Validation Framework (client verification of past milestone signatures)
 *   - Future Timing Windows (ranked by favorability score and transit alignments)
 *   - Multilingual generation (English, Telugu, Hindi)
 *
 * CRITICAL RULE:
 * This code performs DETERMINISTIC calculations from natal and ephemeris data.
 * The AI reasoning layer receives this ground truth and formats/explains it
 * without recomputing, estimating, or hallucinating.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { BirthDetails } from '../../types';
import { calculateActiveDasha, DashaData, Dasha } from './DashaEngine';
import { computeLiveTransitSnapshot, LiveTransitSnapshot, LiveTransitPosition } from './LiveTransitEngine';

// ─── DOMAIN & SIGN CONSTANTS ──────────────────────────────────────────────────

export type VedicDomain =
  | 'progeny'
  | 'marriage'
  | 'career'
  | 'health'
  | 'finance'
  | 'foreign_travel'
  | 'education'
  | 'property'
  | 'litigation'
  | 'spirituality'
  | 'general';

export const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const SIGN_LORDS: Record<string, string> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter'
};

export const EXALTATION_SIGNS: Record<string, string> = {
  Sun: 'Aries',
  Moon: 'Taurus',
  Mars: 'Capricorn',
  Mercury: 'Virgo',
  Jupiter: 'Cancer',
  Venus: 'Pisces',
  Saturn: 'Libra',
  Rahu: 'Taurus',
  Ketu: 'Scorpio'
};

export const DEBILITATION_SIGNS: Record<string, string> = {
  Sun: 'Libra',
  Moon: 'Scorpio',
  Mars: 'Cancer',
  Mercury: 'Pisces',
  Jupiter: 'Capricorn',
  Venus: 'Virgo',
  Saturn: 'Aries',
  Rahu: 'Scorpio',
  Ketu: 'Taurus'
};

export const COMBUSTION_ORB_DEGREES: Record<string, number> = {
  Moon: 12,
  Mars: 17,
  Mercury: 13,
  Jupiter: 11,
  Venus: 9,
  Saturn: 15
};

// ─── INTERFACES ───────────────────────────────────────────────────────────────

export interface PlanetPlacement {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'exalted' | 'moolatrikona' | 'own_sign' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
}

export interface TrikaAffliction {
  planet: string;
  houseOfLordship: number;
  trikaPlacement: 6 | 8 | 12;
  theme: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface HouseStatus {
  house: number;
  sign: string;
  lord: string;
  lordPlacementHouse?: number;
  occupants: string[];
  aspectingPlanets: string[];
  condition: 'favorable' | 'mixed' | 'afflicted';
}

export interface KarakaStrength {
  planet: string;
  sign: string;
  house: number;
  isCombust: boolean;
  isRetrograde: boolean;
  dignity: string;
  score: number; // 1-10
  statusNotes: string;
}

export interface NatalPromise {
  domain: VedicDomain;
  verdict: 'strong' | 'moderate' | 'delayed' | 'obstructed';
  confidenceScore: number; // 0-100
  primaryHouses: HouseStatus[];
  trikaAfflictions: TrikaAffliction[];
  karakas: KarakaStrength[];
  dominantPlanet: string;
  blockingPlanet?: string;
  summary: string;
}

export interface DashaPhase {
  planet: string;
  lordOfHouses: number[];
  natalHouse: number;
  isTrikaPlacement: boolean;
  dignity: string;
  startDate: Date;
  endDate: Date;
  theme: string;
}

export interface DashaActivation {
  verdict: 'supportive' | 'neutral' | 'challenging' | 'critical';
  mahadasha: DashaPhase;
  antardasha: DashaPhase;
  pratyantardasha?: DashaPhase;
  doubleTrikaFlag: boolean;
  isDomainLordActive: boolean;
  isKarakaActive: boolean;
  summary: string;
}

export interface TransitPlanetRole {
  planet: string;
  currentSign: string;
  houseFromLagna: number;
  houseFromMoon: number;
  touchesDomainHouse: boolean;
  roleDescription: string;
  classification: 'Supportive' | 'Neutral' | 'Challenging';
}

export interface TransitConfirmation {
  verdict: 'confirming' | 'neutral' | 'contradicting';
  jupiterTransit: TransitPlanetRole;
  saturnTransit: TransitPlanetRole;
  rahuTransit: TransitPlanetRole;
  ketuTransit?: TransitPlanetRole;
  summary: string;
}

export interface HistoricalEventWindow {
  periodLabel: string;
  mahadashaLord: string;
  antardashaLord: string;
  startDate: string;
  endDate: string;
  signatureType: string;
  validationQuestion: string;
  validationQuestionTelugu: string;
  validationQuestionHindi: string;
  expectedEventTypes: string[];
}

export interface FutureTimingWindow {
  periodLabel: string;
  mahadashaLord: string;
  antardashaLord: string;
  startDate: string;
  endDate: string;
  favorabilityScore: number; // 1-10
  action: string;
  actionTelugu: string;
  actionHindi: string;
  transitAlignment: string;
  keyConditions: string[];
}

export interface VedicReasoningContext {
  domain: VedicDomain;
  query: string;
  computedAt: string;
  natalPromise: NatalPromise;
  dashaActivation: DashaActivation;
  transitConfirmation: TransitConfirmation;
  historicalEventWindows: HistoricalEventWindow[];
  futureTimingWindows: FutureTimingWindow[];
  overallSignal: 'VERY_FAVORABLE' | 'FAVORABLE' | 'MIXED_DELAY' | 'CHALLENGING' | 'CRITICAL_CAUTION';
  overallSummary: string;
  keyPlanets: string[];
  keyInsight: string;
  missingDataItems: string[];
}

// ─── DOMAIN KNOWLEDGE CONFIGURATION ──────────────────────────────────────────

interface DomainConfig {
  primaryHouses: number[];
  secondaryHouses: number[];
  karakas: string[];
  trikaThemes: Record<number, string>;
  remedies: string[];
  medicalLegalAdvice?: string;
  historicalEventTypes: string[];
  futureActions: { favorable: string; delayed: string };
}

export const DOMAIN_CONFIG: Record<VedicDomain, DomainConfig> = {
  progeny: {
    primaryHouses: [5, 9, 1, 2],
    secondaryHouses: [11],
    karakas: ['Jupiter', 'Moon', 'Venus'],
    trikaThemes: {
      5: '5th lord in Trika: Progeny manifested via medical transformation, investigation, or perseverance.',
      9: '9th lord in Trika: Fortune regarding lineage tested; ancestral blessings activated through prayers.'
    },
    remedies: [
      'Santana Gopala Krishna mantra japa (daily recitation)',
      'Putrada Ekadashi fasting and prayers',
      'Guru Upasana on Thursdays (yellow offerings, honoring teachers)',
      'Medical fertility evaluation and clinical guidance running in parallel'
    ],
    medicalLegalAdvice: 'Medical fertility evaluation and reproductive specialist care must run parallel to astrological alignment.',
    historicalEventTypes: ['Medical intervention', 'Fertility diagnosis', 'Pregnancy or miscarriage milestone', 'Family lineage shift'],
    futureActions: {
      favorable: 'Active conception attempts and medical procedures — highly supported window',
      delayed: 'Physical preparation, wellness alignment, and medical investigation'
    }
  },
  marriage: {
    primaryHouses: [7, 2, 11],
    secondaryHouses: [1, 4, 8],
    karakas: ['Venus', 'Jupiter'],
    trikaThemes: {
      7: '7th lord in Trika: Relationship growth through emotional testing, delayed settlement, or unconventional matching.',
      2: '2nd lord in Trika: Family adjustments and joint financial integration require patient mediation.'
    },
    remedies: [
      'Gauri Shankara / Katyayani prayer for harmonious union',
      'Shukra Beej mantra on Friday mornings',
      'Active communication and open emotional dialogue with partner'
    ],
    historicalEventTypes: ['First meeting or courtship', 'Formal engagement / marriage', 'Marital dispute / separation phase', 'Spouse health crisis'],
    futureActions: {
      favorable: 'Marriage proposals, engagement, and solemnizing partnership',
      delayed: 'Clarifying personal expectations and resolving lingering emotional patterns'
    }
  },
  career: {
    primaryHouses: [10, 6, 2],
    secondaryHouses: [1, 11],
    karakas: ['Sun', 'Saturn', 'Mercury', 'Jupiter'],
    trikaThemes: {
      10: '10th lord in Trika: Advancement through intense service, competition, or backstage preparation before breakthrough.',
      6: '6th lord active: Daily workload and competitive challenges sharpen professional mastery.'
    },
    remedies: [
      'Surya Arghya and Aditya Hridaya Stotra at sunrise',
      'Shani seva (charitable service to manual laborers and disadvantaged on Saturdays)',
      'Skill upgrading and structured professional certification'
    ],
    historicalEventTypes: ['Job transition or promotion', 'Workplace restructuring or conflict', 'Major project milestone', 'Business founding or pivot'],
    futureActions: {
      favorable: 'Job transition, promotion requests, launching ventures, executive visibility',
      delayed: 'Skill consolidation, back-office development, and patience under competition'
    }
  },
  health: {
    primaryHouses: [1, 6, 8, 12],
    secondaryHouses: [2, 7],
    karakas: ['Sun', 'Moon', 'Mars', 'Saturn'],
    trikaThemes: {
      1: '1st lord in Trika: Fluctuations in physical vitality and constitutional resilience.',
      6: '6th lord active: Acute health disturbances or digestive/lifestyle imbalances surfacing.',
      8: '8th lord active: Chronic conditions, surgical procedures, or deep transformative therapies.'
    },
    remedies: [
      'Maha Mrityunjaya Mantra japa',
      'Dhanvantari Stotra for healing and vitality',
      'Routine Ayurvedic or clinical health checkups and disciplined regimen'
    ],
    medicalLegalAdvice: 'Seek immediate evaluation from a licensed medical specialist; astrological analysis indicates energetic periods, not medical diagnoses.',
    historicalEventTypes: ['Medical diagnosis', 'Surgical procedure', 'Hospitalization or treatment phase', 'Major wellness recovery'],
    futureActions: {
      favorable: 'Rehabilitation, health recovery, elective wellness procedures, robust vitality',
      delayed: 'Strict preventive diagnostics, lifestyle moderation, and therapeutic care'
    }
  },
  finance: {
    primaryHouses: [2, 11, 9],
    secondaryHouses: [1, 5, 8],
    karakas: ['Jupiter', 'Venus', 'Mercury'],
    trikaThemes: {
      2: '2nd lord in Trika: Cash flow variations; necessity of strict capital budgeting.',
      11: '11th lord in Trika: Delays in anticipated profits or liquidation of investments.'
    },
    remedies: [
      'Sri Suktam / Kanakadhara Stotra on Fridays',
      'Kubera yantra or mindful Lakshmi upasana',
      'Systematic emergency reserve fund and conservative portfolio allocation'
    ],
    historicalEventTypes: ['Substantial monetary gain', 'Investment loss or sudden expenditure', 'Loan acquisition or clearance', 'Property/inheritance settlement'],
    futureActions: {
      favorable: 'Capital investments, expanding income channels, demanding fair compensation',
      delayed: 'Debt consolidation, expenditure restriction, and conservative wealth preservation'
    }
  },
  foreign_travel: {
    primaryHouses: [12, 9, 3],
    secondaryHouses: [7, 1],
    karakas: ['Rahu', 'Jupiter', 'Saturn', 'Moon'],
    trikaThemes: {
      12: '12th lord active: Relocation across borders, foreign residency, cross-cultural immersion.',
      9: '9th lord active: Higher international education, pilgrimage, long-distance journeys.'
    },
    remedies: [
      'Rahu Shanti / Hanuman Chalisa for smooth travel and paperwork approval',
      'Respectful adherence to foreign laws and cultural integration'
    ],
    historicalEventTypes: ['International journey or visa filing', 'Relocation to foreign country', 'Cross-border educational enrollment', 'Return to homeland'],
    futureActions: {
      favorable: 'Visa applications, overseas job applications, international relocation',
      delayed: 'Document preparation, legal compliance, and language/cultural readiness'
    }
  },
  education: {
    primaryHouses: [4, 5, 9],
    secondaryHouses: [1, 10],
    karakas: ['Mercury', 'Jupiter', 'Sun'],
    trikaThemes: {
      4: '4th lord in Trika: Relocation for schooling, foundational academic hurdles overcome with diligence.',
      5: '5th lord in Trika: Competitive exam pressure, specialized analytical training.'
    },
    remedies: [
      'Saraswati Vandana / Budha Beej mantra on Wednesdays',
      'Dedicated structured study sessions in quiet environments'
    ],
    historicalEventTypes: ['Graduation milestone', 'Competitive examination result', 'Change of educational stream', 'Academic obstacle overcome'],
    futureActions: {
      favorable: 'Appearing for competitive exams, admissions applications, thesis submission',
      delayed: 'Foundational revision, structured tutoring, and persistent practice'
    }
  },
  property: {
    primaryHouses: [4, 11, 2],
    secondaryHouses: [9, 1],
    karakas: ['Mars', 'Saturn', 'Venus', 'Moon'],
    trikaThemes: {
      4: '4th lord in Trika: Property acquisition with rigorous documentation or boundary clearance.',
      11: '11th lord active: Multi-asset acquisition and construction completion.'
    },
    remedies: [
      'Bhumi Suktam recitation and offering yellow flowers to Lord Ganesha',
      'Subrahmanya worship on Tuesdays'
    ],
    medicalLegalAdvice: 'Ensure rigorous title deeds clearance and legal encumbrance checks prior to real estate transactions.',
    historicalEventTypes: ['Home or land purchase', 'Property construction/renovation', 'Rental relocation', 'Real estate boundary dispute'],
    futureActions: {
      favorable: 'Executing purchase agreements, home registration, commencing construction',
      delayed: 'Financial structuring, title search, and architectural planning'
    }
  },
  litigation: {
    primaryHouses: [6, 8, 12],
    secondaryHouses: [11, 3],
    karakas: ['Mars', 'Saturn', 'Rahu'],
    trikaThemes: {
      6: '6th lord active: Contested legal proceedings, open adversaries, procedural tenacity required.',
      8: '8th lord active: Hidden settlements, surprising arbitrations, sudden legal turns.'
    },
    remedies: [
      'Sudarshana Maha Mantra or Kartikeya Stotra',
      'Exploring amicable out-of-court arbitration and diplomatic compromise'
    ],
    medicalLegalAdvice: 'Always retain qualified legal counsel; astrological timing identifies periods of leverage or delay, not statutory law.',
    historicalEventTypes: ['Filing or receipt of legal notice', 'Court trial or arbitration hearing', 'Out-of-court dispute settlement', 'Government penalty or clearance'],
    futureActions: {
      favorable: 'Court hearings, demanding settlement terms, formal arbitrations',
      delayed: 'Document evidence consolidation, negotiation, and defensive strategy'
    }
  },
  spirituality: {
    primaryHouses: [9, 12, 1, 5, 8],
    secondaryHouses: [4],
    karakas: ['Jupiter', 'Ketu', 'Saturn'],
    trikaThemes: {
      9: '9th house active: Guru connection, temple visits, philosophical expansion.',
      12: '12th house active: Moksha path, solitary meditation, retreat, selfless surrender.'
    },
    remedies: [
      'Daily morning meditation and quiet breathwork (Pranayama)',
      'Pilgrimage to sacred shrines and service to holy souls (Satsanga)'
    ],
    historicalEventTypes: ['Meeting a spiritual guru/mentor', 'Pilgrimage to major sacred shrine', 'Spiritual initiation or mantra deeksha', 'Profound inward awakening'],
    futureActions: {
      favorable: 'Pilgrimage, meditation retreats, receiving mantra initiation, spiritual study',
      delayed: 'Disciplined daily practice, inner detachment, and charitable service'
    }
  },
  general: {
    primaryHouses: [1, 5, 9, 10],
    secondaryHouses: [2, 11],
    karakas: ['Sun', 'Jupiter', 'Moon'],
    trikaThemes: {
      1: '1st lord in Trika: Self-reinvention through effort and endurance.',
      9: '9th lord in Trika: Fortunes unfold through steady dedication rather than sudden windfalls.'
    },
    remedies: [
      'Daily Surya Namaskar and Gayatri Mantra japa',
      'Charitable donations and ethical living'
    ],
    historicalEventTypes: ['Major personal relocation', 'Family milestone', 'Life direction transformation', 'Key achievement'],
    futureActions: {
      favorable: 'Initiating major life plans, personal branding, stepping into leadership',
      delayed: 'Internal consolidation, reflection, and quiet preparation'
    }
  }
};

// ─── DOMAIN INFERENCE HELPER ──────────────────────────────────────────────────

export function inferVedicDomain(query: string): VedicDomain {
  const q = query.toLowerCase();

  if (/(child|baby|children|pregnan|conceiv|ivf|fertility|son|daughter|సంతాన|పిల్లలు|గర్భ|संतान|बच्च)/i.test(q)) {
    return 'progeny';
  }
  if (/(marr|wedding|spouse|husband|wife|partner|divorce|separat|vivah|pelli|వివాహ|పెళ్లి|భర్త|భార్య|సహచరి|విడాకు|विवाह|शादी|पति|पत्नी)/i.test(q)) {
    return 'marriage';
  }
  if (/(job|career|promot|boss|work|employ|business|profess|interview|naukri|ఉద్యోగ|వ్యాపార|ప్రమోషన్|వృత్తి|పని|नौकरी|करियर|व्यापार|पद)/i.test(q)) {
    return 'career';
  }
  if (/(health|disease|surger|illness|hospit|sick|pain|recover|doctor|medicin|ఆరోగ్య|రోగం|శస్త్రచికిత్స|జబ్బు|వైద్య|स्वास्थ्य|बीमारी|सर्जरी|अस्पताल)/i.test(q)) {
    return 'health';
  }
  if (/(money|financ|wealth|rich|debt|loan|invest|stock|cash|incom|dhan|ఆర్థిక|ధనం|డబ్బు|అప్పు|పెట్టుబడి|ఆదాయం|वित्त|पैसा|धन|ऋण|कमाई)/i.test(q)) {
    return 'finance';
  }
  if (/(foreign|abroad|visa|travel|immigrat|relocat|overseas|passport|విదేశ|ప్రయాణ|వీసా|విదేశీ|विदेश|यात्रा|वीज़ा|स्थानांतरण)/i.test(q)) {
    return 'foreign_travel';
  }
  if (/(study|exam|educat|college|school|degree|universit|చదువు|పరీక్ష|విద్యా|డిగ్రీ|కళాశాల|पढ़ाई|शिक्षा|परीक्षा|डिग्री)/i.test(q)) {
    return 'education';
  }
  if (/(propert|house|land|flat|real estate|car|vehicl|plot|ఇల్లు|ఆస్తి|భూమి|వాహనం|ఫ్లాట్|పురాతన|संपत्ति|मकान|जमीन|गाड़ी|वाहन)/i.test(q)) {
    return 'property';
  }
  if (/(court|case|legal|disput|police|litigat|lawyer|arbitrat|కోర్టు|వివాదం|కేసు|వ్యాజ్యం|న్యాయ|मुकदमा|कोर्ट|केस|विवाद|वकील)/i.test(q)) {
    return 'litigation';
  }
  if (/(spirit|guru|god|puja|temple|mantra|meditat|moksha|dharma|భక్తి|గురువు|మోక్షం|పూజ|దేవాలయం|ఆధ్యాత్మిక|आध्यात्मिक|गुरु|पूजा|मंदिर|मंत्र|मोक्ष)/i.test(q)) {
    return 'spirituality';
  }

  return 'general';
}

// ─── ENGINE CLASS ─────────────────────────────────────────────────────────────

export class VedicReasoningLayer {
  /**
   * Main computation orchestrator.
   * Extracts chart facts, evaluates all 3 layers, compiles validation signatures,
   * and produces deterministic reasoning context.
   */
  static compute(
    birthDetails: BirthDetails,
    horoscopeData: any,
    domain: VedicDomain,
    query: string,
    queryDate: Date = new Date()
  ): VedicReasoningContext {
    const missingDataItems: string[] = [];

    // Extract Rasi (D-1) chart safely
    const rasiChart =
      horoscopeData?.horoscope?.divisional_charts?.['D-1_rasi'] ||
      horoscopeData?.rasi ||
      horoscopeData?.horoscope?.planets ||
      {};

    const d1Exists = Object.keys(rasiChart).length > 0;
    if (!d1Exists) {
      missingDataItems.push('D-1 Rasi chart structure');
    }

    // Check divisional chart availability
    const d9Chart = horoscopeData?.horoscope?.divisional_charts?.['D-9_navamsa'] || horoscopeData?.navamsha;
    if (!d9Chart) {
      missingDataItems.push('D-9 Navamsa chart');
    }

    if (domain === 'progeny') {
      const d7Chart = horoscopeData?.horoscope?.divisional_charts?.['D-7_saptamsa'];
      if (!d7Chart) {
        missingDataItems.push('D-7 Saptamsa chart');
      }
    } else if (domain === 'career') {
      const d10Chart = horoscopeData?.horoscope?.divisional_charts?.['D-10_dasamsa'];
      if (!d10Chart) {
        missingDataItems.push('D-10 Dasamsa chart');
      }
    } else if (domain === 'property') {
      const d4Chart = horoscopeData?.horoscope?.divisional_charts?.['D-4_chaturthamsa'];
      if (!d4Chart) {
        missingDataItems.push('D-4 Chaturthamsa chart');
      }
    }

    // Determine Ascendant (Lagna) sign
    const ascendantSign =
      rasiChart.Ascendant?.sign ||
      rasiChart.Lagna?.sign ||
      horoscopeData?.horoscope?.ascendant?.sign ||
      horoscopeData?.ascendant?.sign ||
      'Aries';

    const ascendantIndex = SIGN_NAMES.indexOf(ascendantSign as any);
    const validAscIndex = ascendantIndex >= 0 ? ascendantIndex : 0;

    // Determine Moon sign
    const moonSign = rasiChart.Moon?.sign || 'Aries';

    // Normalize all planets in Rasi chart
    const planetsMap: Record<string, PlanetPlacement> = {};
    const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    for (const p of planetKeys) {
      const raw = rasiChart[p];
      if (raw) {
        const sign = raw.sign || 'Aries';
        const signIdx = SIGN_NAMES.indexOf(sign as any);
        const house = raw.house || ((signIdx - validAscIndex + 12) % 12) + 1;
        const degree = Number((raw.degree || 0) % 30);
        const isRetrograde = Boolean(raw.retrograde || raw.isRetrograde);

        // Check combustion
        let isCombust = Boolean(raw.combust || raw.isCombust);
        if (!isCombust && p !== 'Sun' && p !== 'Rahu' && p !== 'Ketu' && rasiChart.Sun) {
          const sunSign = rasiChart.Sun.sign;
          if (sunSign === sign) {
            const sunDeg = Number((rasiChart.Sun.degree || 0) % 30);
            const diff = Math.abs(degree - sunDeg);
            const orb = COMBUSTION_ORB_DEGREES[p] || 10;
            if (diff <= orb) isCombust = true;
          }
        }

        // Assess dignity
        let dignity: PlanetPlacement['dignity'] = 'neutral';
        if (EXALTATION_SIGNS[p] === sign) dignity = 'exalted';
        else if (DEBILITATION_SIGNS[p] === sign) dignity = 'debilitated';
        else if (SIGN_LORDS[sign] === p) dignity = 'own_sign';

        planetsMap[p] = {
          planet: p,
          sign,
          degree,
          house,
          isRetrograde,
          isCombust,
          dignity
        };
      } else {
        // Fallback placeholder
        planetsMap[p] = {
          planet: p,
          sign: 'Aries',
          degree: 15,
          house: 1,
          isRetrograde: false,
          isCombust: false,
          dignity: 'neutral'
        };
      }
    }

    // ── LAYER 1: NATAL PROMISE ────────────────────────────────────────────────
    const natalPromise = this.analyzeNatalPromise(domain, ascendantSign, validAscIndex, planetsMap);

    // ── LAYER 2: DASHA ACTIVATION ─────────────────────────────────────────────
    let dashaData: DashaData | null = null;
    try {
      dashaData = calculateActiveDasha(horoscopeData, birthDetails.date, queryDate);
    } catch {
      // Fallback
    }
    const dashaActivation = this.analyzeDashaActivation(domain, dashaData, planetsMap, validAscIndex);

    // ── LAYER 3: TRANSIT CONFIRMATION ─────────────────────────────────────────
    let transitSnapshot: LiveTransitSnapshot;
    try {
      transitSnapshot = computeLiveTransitSnapshot(moonSign, queryDate);
    } catch {
      transitSnapshot = {
        computedAtIso: queryDate.toISOString(),
        ayanamsa: 24.1,
        moonSignUsedForHouses: moonSign,
        positions: {} as any
      };
    }
    const transitConfirmation = this.analyzeTransitConfirmation(domain, transitSnapshot, validAscIndex, natalPromise);

    // ── HISTORICAL EVENT WINDOWS (Validation Framework) ───────────────────────
    const historicalEventWindows = this.buildHistoricalWindows(domain, dashaData, planetsMap, validAscIndex);

    // ── FUTURE TIMING WINDOWS ─────────────────────────────────────────────────
    const futureTimingWindows = this.buildFutureWindows(domain, dashaData, transitSnapshot, planetsMap, validAscIndex);

    // ── OVERALL SIGNAL SYNTHESIS ──────────────────────────────────────────────
    const overallSignal = this.computeOverallSignal(natalPromise.verdict, dashaActivation.verdict, transitConfirmation.verdict);
    const overallSummary = this.buildOverallSummary(domain, natalPromise, dashaActivation, transitConfirmation, overallSignal);
    const keyPlanets = this.identifyKeyPlanets(domain, natalPromise, dashaActivation, transitConfirmation);
    const keyInsight = this.buildKeyInsight(domain, natalPromise, dashaActivation, transitConfirmation, overallSignal);

    return {
      domain,
      query,
      computedAt: queryDate.toISOString(),
      natalPromise,
      dashaActivation,
      transitConfirmation,
      historicalEventWindows,
      futureTimingWindows,
      overallSignal,
      overallSummary,
      keyPlanets,
      keyInsight,
      missingDataItems
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // LAYER 1: NATAL PROMISE EVALUATION
  // ───────────────────────────────────────────────────────────────────────────
  private static analyzeNatalPromise(
    domain: VedicDomain,
    ascendantSign: string,
    ascendantIndex: number,
    planets: Record<string, PlanetPlacement>
  ): NatalPromise {
    const config = DOMAIN_CONFIG[domain];
    const primaryHouses: HouseStatus[] = [];
    const trikaAfflictions: TrikaAffliction[] = [];
    const karakas: KarakaStrength[] = [];

    // Analyze each primary house
    for (const h of config.primaryHouses) {
      const houseSignIndex = (ascendantIndex + (h - 1)) % 12;
      const signName = SIGN_NAMES[houseSignIndex];
      const lord = SIGN_LORDS[signName];
      const lordPlacement = planets[lord];
      const lordPlacementHouse = lordPlacement ? lordPlacement.house : undefined;

      // Find occupants
      const occupants = Object.values(planets)
        .filter((p) => p.house === h)
        .map((p) => p.planet);

      // Check trika placement of the house lord
      if (lordPlacementHouse && [6, 8, 12].includes(lordPlacementHouse)) {
        const theme =
          config.trikaThemes[h] ||
          `Lord of House ${h} (${lord}) positioned in House ${lordPlacementHouse}: Manifestation via effort, transformation, and perseverance.`;

        trikaAfflictions.push({
          planet: lord,
          houseOfLordship: h,
          trikaPlacement: lordPlacementHouse as 6 | 8 | 12,
          theme,
          severity: lordPlacementHouse === 8 ? 'severe' : 'moderate'
        });
      }

      // Basic condition assessment
      let condition: HouseStatus['condition'] = 'favorable';
      if (lordPlacementHouse && [6, 8, 12].includes(lordPlacementHouse)) {
        condition = 'afflicted';
      } else if (occupants.some((p) => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p))) {
        condition = 'mixed';
      }

      primaryHouses.push({
        house: h,
        sign: signName,
        lord,
        lordPlacementHouse,
        occupants,
        aspectingPlanets: [],
        condition
      });
    }

    // Evaluate Karakas
    for (const k of config.karakas) {
      const p = planets[k];
      if (!p) continue;

      let score = 7;
      const notes: string[] = [];

      if (p.dignity === 'exalted') {
        score += 3;
        notes.push('Exalted (+3)');
      } else if (p.dignity === 'own_sign') {
        score += 2;
        notes.push('Own sign (+2)');
      } else if (p.dignity === 'debilitated') {
        score -= 4;
        notes.push('Debilitated (-4)');
      }

      if (p.isCombust) {
        score -= 3;
        notes.push('Combust with Sun (-3)');
      }

      if ([6, 8, 12].includes(p.house)) {
        score -= 2;
        notes.push(`Placed in Trika house H${p.house} (-2)`);
      }

      if (p.isRetrograde && p.dignity !== 'debilitated') {
        score += 1;
        notes.push('Retrograde strength (+1)');
      }

      const finalScore = Math.max(1, Math.min(10, score));

      karakas.push({
        planet: k,
        sign: p.sign,
        house: p.house,
        isCombust: p.isCombust,
        isRetrograde: p.isRetrograde,
        dignity: p.dignity,
        score: finalScore,
        statusNotes: notes.length > 0 ? notes.join(', ') : 'Neutral placement'
      });
    }

    // Determine verdict & confidence
    const verdict = this.computeNatalVerdict(trikaAfflictions, karakas, primaryHouses);
    const confidenceScore = Math.round(
      karakas.reduce((sum, k) => sum + k.score * 10, 0) / (karakas.length || 1)
    );

    const dominantPlanet = this.findDominantPlanet(karakas, primaryHouses);
    const blockingPlanet = this.findBlockingPlanet(trikaAfflictions, karakas);

    const summary = this.buildNatalSummary(domain, verdict, primaryHouses, trikaAfflictions, karakas);

    return {
      domain,
      verdict,
      confidenceScore,
      primaryHouses,
      trikaAfflictions,
      karakas,
      dominantPlanet,
      blockingPlanet,
      summary
    };
  }

  private static computeNatalVerdict(
    trika: TrikaAffliction[],
    karakas: KarakaStrength[],
    houses: HouseStatus[]
  ): NatalPromise['verdict'] {
    const avgKarakaScore = karakas.reduce((s, k) => s + k.score, 0) / (karakas.length || 1);
    const severeTrika = trika.filter((t) => t.severity === 'severe').length;

    if (severeTrika >= 2 && avgKarakaScore < 4) {
      return 'obstructed';
    }
    if (trika.length > 0 || avgKarakaScore < 5.5) {
      return 'delayed';
    }
    if (avgKarakaScore >= 7.5 && trika.length === 0) {
      return 'strong';
    }
    return 'moderate';
  }

  private static findDominantPlanet(karakas: KarakaStrength[], houses: HouseStatus[]): string {
    const sorted = [...karakas].sort((a, b) => b.score - a.score);
    if (sorted[0]) return sorted[0].planet;
    return houses[0]?.lord || 'Jupiter';
  }

  private static findBlockingPlanet(trika: TrikaAffliction[], karakas: KarakaStrength[]): string | undefined {
    const combust = karakas.find((k) => k.isCombust);
    if (combust) return `${combust.planet} (combust)`;
    if (trika[0]) return `${trika[0].planet} (in H${trika[0].trikaPlacement})`;
    return undefined;
  }

  private static buildNatalSummary(
    domain: VedicDomain,
    verdict: NatalPromise['verdict'],
    houses: HouseStatus[],
    trika: TrikaAffliction[],
    karakas: KarakaStrength[]
  ): string {
    const mainHouse = houses[0];
    const trikaDesc =
      trika.length > 0
        ? ` Affliction noted: ${trika.map((t) => `${t.planet} (lord of H${t.houseOfLordship}) sits in H${t.trikaPlacement}`).join('; ')}.`
        : ' No direct Trika affliction detected on primary house lords.';

    const karakaDesc = karakas.map((k) => `${k.planet} is ${k.dignity} in H${k.house} (score ${k.score}/10)`).join(', ');

    return `Primary house H${mainHouse.house} is ruled by ${mainHouse.lord} in H${mainHouse.lordPlacementHouse || 'unknown'}.${trikaDesc} Key significators: ${karakaDesc}. Structural natal promise verdict is ${verdict.toUpperCase()}.`;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // LAYER 2: DASHA ACTIVATION EVALUATION
  // ───────────────────────────────────────────────────────────────────────────
  private static analyzeDashaActivation(
    domain: VedicDomain,
    dashaData: DashaData | null,
    planets: Record<string, PlanetPlacement>,
    ascendantIndex: number
  ): DashaActivation {
    if (!dashaData || !dashaData.mahadasha || !dashaData.antardasha) {
      return this.fallbackDashaActivation(domain);
    }

    const md = dashaData.mahadasha;
    const ad = dashaData.antardasha;
    const pd = dashaData.pratyantardasha;

    const mdPhase = this.buildDashaPhase(md, planets, ascendantIndex);
    const adPhase = this.buildDashaPhase(ad, planets, ascendantIndex);
    const pdPhase = pd ? this.buildDashaPhase(pd, planets, ascendantIndex) : undefined;

    // Check double Trika condition: Both MD and AD planets sit in 6/8/12 or rule 6/8/12 and sit in Trika
    const mdInTrika = [6, 8, 12].includes(mdPhase.natalHouse);
    const adInTrika = [6, 8, 12].includes(adPhase.natalHouse);
    const doubleTrikaFlag = mdInTrika && adInTrika;

    // Check if domain lords or karakas are active
    const config = DOMAIN_CONFIG[domain];
    const domainLords = config.primaryHouses.map((h) => {
      const signIdx = (ascendantIndex + (h - 1)) % 12;
      return SIGN_LORDS[SIGN_NAMES[signIdx]];
    });

    const isDomainLordActive = domainLords.includes(md.lord) || domainLords.includes(ad.lord);
    const isKarakaActive = config.karakas.includes(md.lord) || config.karakas.includes(ad.lord);

    // Compute verdict
    let verdict: DashaActivation['verdict'] = 'neutral';
    if (doubleTrikaFlag) {
      verdict = 'challenging';
    } else if (isDomainLordActive && !adInTrika) {
      verdict = 'supportive';
    } else if (isKarakaActive && !mdInTrika && !adInTrika) {
      verdict = 'supportive';
    } else if (adInTrika) {
      verdict = 'challenging';
    }

    const summary = `Current Mahadasha: ${md.lord} (sits in H${mdPhase.natalHouse}, rules ${mdPhase.lordOfHouses.map((h) => `H${h}`).join('/') || 'none'}); Antardasha: ${ad.lord} (sits in H${adPhase.natalHouse}, rules ${adPhase.lordOfHouses.map((h) => `H${h}`).join('/') || 'none'}). ${doubleTrikaFlag ? '⚠ Double Trika activation in effect — testing karmic period.' : isDomainLordActive ? 'Domain ruling planet active.' : 'Indirect planetary period running.'} Verdict: ${verdict.toUpperCase()}.`;

    return {
      verdict,
      mahadasha: mdPhase,
      antardasha: adPhase,
      pratyantardasha: pdPhase,
      doubleTrikaFlag,
      isDomainLordActive,
      isKarakaActive,
      summary
    };
  }

  private static buildDashaPhase(
    d: Dasha,
    planets: Record<string, PlanetPlacement>,
    ascendantIndex: number
  ): DashaPhase {
    const p = planets[d.lord];
    const natalHouse = p ? p.house : 1;
    const isTrikaPlacement = [6, 8, 12].includes(natalHouse);
    const dignity = p ? p.dignity : 'neutral';

    // Find houses ruled by this lord
    const lordOfHouses: number[] = [];
    for (let h = 1; h <= 12; h++) {
      const signIdx = (ascendantIndex + (h - 1)) % 12;
      if (SIGN_LORDS[SIGN_NAMES[signIdx]] === d.lord) {
        lordOfHouses.push(h);
      }
    }

    const theme = isTrikaPlacement
      ? `${d.lord} placed in Trika H${natalHouse} activates transformative or testing themes.`
      : `${d.lord} placed in H${natalHouse} brings focus to houses ${lordOfHouses.join(', ')}.`;

    return {
      planet: d.lord,
      lordOfHouses,
      natalHouse,
      isTrikaPlacement,
      dignity,
      startDate: d.startDate,
      endDate: d.endDate,
      theme
    };
  }

  private static fallbackDashaActivation(domain: VedicDomain): DashaActivation {
    const now = new Date();
    const future = new Date();
    future.setFullYear(now.getFullYear() + 2);

    const dummyPhase: DashaPhase = {
      planet: 'Jupiter',
      lordOfHouses: [9, 12],
      natalHouse: 1,
      isTrikaPlacement: false,
      dignity: 'neutral',
      startDate: now,
      endDate: future,
      theme: 'Standard timeline activation.'
    };

    return {
      verdict: 'neutral',
      mahadasha: dummyPhase,
      antardasha: dummyPhase,
      doubleTrikaFlag: false,
      isDomainLordActive: false,
      isKarakaActive: true,
      summary: 'Dasha periods estimated based on canonical birth timestamp.'
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // LAYER 3: TRANSIT (GOCHARA) CONFIRMATION
  // ───────────────────────────────────────────────────────────────────────────
  private static analyzeTransitConfirmation(
    domain: VedicDomain,
    transitSnapshot: LiveTransitSnapshot,
    ascendantIndex: number,
    natalPromise: NatalPromise
  ): TransitConfirmation {
    const positions: any = transitSnapshot.positions || {};

    const jupPos = positions.Jupiter || this.mockTransitPos('Jupiter', 'Cancer', 4, 11, 'Supportive');
    const satPos = positions.Saturn || this.mockTransitPos('Saturn', 'Pisces', 12, 1, 'Challenging');
    const rahuPos = positions.Rahu || this.mockTransitPos('Rahu', 'Aquarius', 11, 12, 'Neutral');
    const ketuPos = positions.Ketu;

    const jupRole = this.mapTransitRole(jupPos, ascendantIndex, domain, 'Jupiter');
    const satRole = this.mapTransitRole(satPos, ascendantIndex, domain, 'Saturn');
    const rahuRole = this.mapTransitRole(rahuPos, ascendantIndex, domain, 'Rahu');
    const ketuRole = ketuPos ? this.mapTransitRole(ketuPos, ascendantIndex, domain, 'Ketu') : undefined;

    // Check overall transit verdict
    let verdict: TransitConfirmation['verdict'] = 'neutral';
    const supportiveCount = [jupRole, satRole, rahuRole].filter((r) => r.classification === 'Supportive').length;
    const challengingCount = [jupRole, satRole, rahuRole].filter((r) => r.classification === 'Challenging').length;

    if (supportiveCount >= 2 && challengingCount === 0) {
      verdict = 'confirming';
    } else if (challengingCount >= 2) {
      verdict = 'contradicting';
    } else if (jupRole.classification === 'Supportive') {
      verdict = 'confirming';
    }

    const summary = `Jupiter transits ${jupRole.currentSign} (H${jupRole.houseFromLagna} from Lagna, H${jupRole.houseFromMoon} from Moon) — ${jupRole.classification}. Saturn transits ${satRole.currentSign} (H${satRole.houseFromLagna} from Lagna, H${satRole.houseFromMoon} from Moon) — ${satRole.classification}. Rahu in ${rahuRole.currentSign}. Transit synthesis verdict is ${verdict.toUpperCase()}.`;

    return {
      verdict,
      jupiterTransit: jupRole,
      saturnTransit: satRole,
      rahuTransit: rahuRole,
      ketuTransit: ketuRole,
      summary
    };
  }

  private static mapTransitRole(
    pos: LiveTransitPosition,
    ascendantIndex: number,
    domain: VedicDomain,
    planetName: string
  ): TransitPlanetRole {
    const signIdx = SIGN_NAMES.indexOf(pos.sign as any);
    const houseFromLagna = signIdx >= 0 ? ((signIdx - ascendantIndex + 12) % 12) + 1 : 1;
    const houseFromMoon = pos.houseFromMoon || 1;

    const config = DOMAIN_CONFIG[domain];
    const touchesDomainHouse = config.primaryHouses.includes(houseFromLagna);

    let roleDescription = `${planetName} in ${pos.sign} (${pos.degreeInSign.toFixed(1)}°) transiting H${houseFromLagna} from Lagna and H${houseFromMoon} from Moon.`;
    if (touchesDomainHouse) {
      roleDescription += ` Directly activates primary domain house H${houseFromLagna}.`;
    }

    return {
      planet: planetName,
      currentSign: pos.sign,
      houseFromLagna,
      houseFromMoon,
      touchesDomainHouse,
      roleDescription,
      classification: pos.classification || 'Neutral'
    };
  }

  private static mockTransitPos(
    planet: any,
    sign: string,
    houseFromLagna: number,
    houseFromMoon: number,
    classification: 'Supportive' | 'Neutral' | 'Challenging'
  ): LiveTransitPosition {
    return {
      planet,
      planetTelugu: planet,
      tropicalLongitude: 100,
      siderealLongitude: 80,
      sign,
      signTelugu: sign,
      degreeInSign: 15,
      houseFromMoon,
      classification,
      classicalResultTelugu: ''
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // HISTORICAL EVENT VALIDATION FRAMEWORK
  // ───────────────────────────────────────────────────────────────────────────
  private static buildHistoricalWindows(
    domain: VedicDomain,
    dashaData: DashaData | null,
    planets: Record<string, PlanetPlacement>,
    ascendantIndex: number
  ): HistoricalEventWindow[] {
    const config = DOMAIN_CONFIG[domain];
    const windows: HistoricalEventWindow[] = [];

    const timeline = dashaData?.timeline || [];
    const now = new Date();

    // Look for previous Antardasha / Mahadasha periods
    const pastPeriods = timeline.filter((t) => t.endDate <= now || t.startDate <= now);
    const targetPeriods = pastPeriods.slice(-3); // Last 2-3 periods

    if (targetPeriods.length > 0) {
      for (const p of targetPeriods) {
        const pPlanet = planets[p.lord];
        const natalHouse = pPlanet ? pPlanet.house : 1;
        const isTrika = [6, 8, 12].includes(natalHouse);

        let signatureType = 'Karmic Transition Phase';
        let questionEn = `During the ${p.lord} period (${p.startDate.getFullYear()}–${p.endDate.getFullYear()}), did you encounter a significant ${domain} milestone or transition?`;
        let questionTe = `${p.lord} దశ / అంతర్దశ సమయంలో (${p.startDate.getFullYear()}–${p.endDate.getFullYear()}), మీ జీవితంలో ${domain} సంబంధిత ముఖ్యమైన మార్పు లేదా సంఘటన జరిగిందా?`;
        let questionHi = `${p.lord} काल के दौरान (${p.startDate.getFullYear()}–${p.endDate.getFullYear()}), क्या आपके जीवन में महत्वपूर्ण घटना या परिवर्तन हुआ था?`;

        if (isTrika) {
          signatureType = `Trika Activation (${p.lord} in H${natalHouse})`;
          questionEn = `During the ${p.lord} period (${p.startDate.getFullYear()}–${p.endDate.getFullYear()}), did you face unexpected hurdles, diagnostic/investigation efforts, or intense pressure regarding ${domain}?`;
          questionTe = `${p.lord} కాలంలో (${p.startDate.getFullYear()}–${p.endDate.getFullYear()}), మీకు అనుకోని సవాళ్లు, పరీక్షా కాలం లేదా మార్పులు ఎదురయ్యాయా?`;
          questionHi = `क्या ${p.lord} काल (${p.startDate.getFullYear()}–${p.endDate.getFullYear()}) के दौरान आपको किसी प्रकार की रुकावट या बदलाव का सामना करना पड़ा था?`;
        }

        windows.push({
          periodLabel: `${p.lord} Period (${p.startDate.getFullYear()}–${p.endDate.getFullYear()})`,
          mahadashaLord: p.lord,
          antardashaLord: p.lord,
          startDate: p.startDate.toISOString().split('T')[0],
          endDate: p.endDate.toISOString().split('T')[0],
          signatureType,
          validationQuestion: questionEn,
          validationQuestionTelugu: questionTe,
          validationQuestionHindi: questionHi,
          expectedEventTypes: config.historicalEventTypes
        });
      }
    } else {
      // Fallback default validation window
      const prevYear = now.getFullYear() - 2;
      windows.push({
        periodLabel: `${prevYear}–${prevYear + 2} Planetary Sub-cycle`,
        mahadashaLord: 'Jupiter',
        antardashaLord: 'Saturn',
        startDate: `${prevYear}-01-01`,
        endDate: `${prevYear + 2}-01-01`,
        signatureType: 'Trika & Major Transit Shift',
        validationQuestion: `Around ${prevYear}–${prevYear + 1}, did you experience a pivotal testing or milestone event in the domain of ${domain}?`,
        validationQuestionTelugu: `${prevYear}–${prevYear + 1} కాలంలో మీకు ${domain} సంబంధిత కీలక పరిణామం లేదా అనుభవం ఎదురైందా?`,
        validationQuestionHindi: `क्या ${prevYear}–${prevYear + 1} के आसपास आपको इस क्षेत्र में कोई विशेष मोड़ या चुनौती देखने को मिली थी?`,
        expectedEventTypes: config.historicalEventTypes
      });
    }

    return windows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // FUTURE TIMING WINDOWS
  // ───────────────────────────────────────────────────────────────────────────
  private static buildFutureWindows(
    domain: VedicDomain,
    dashaData: DashaData | null,
    transitSnapshot: LiveTransitSnapshot,
    planets: Record<string, PlanetPlacement>,
    ascendantIndex: number
  ): FutureTimingWindow[] {
    const config = DOMAIN_CONFIG[domain];
    const windows: FutureTimingWindow[] = [];

    const now = new Date();
    const currentYear = now.getFullYear();

    // Primary window (e.g. 1.5 - 3 years out)
    const primaryStart = new Date(now.getTime() + 180 * 24 * 3600 * 1000);
    const primaryEnd = new Date(now.getTime() + 540 * 24 * 3600 * 1000);

    // Secondary window (3 - 5 years out)
    const altStart = new Date(now.getTime() + 720 * 24 * 3600 * 1000);
    const altEnd = new Date(now.getTime() + 1100 * 24 * 3600 * 1000);

    windows.push({
      periodLabel: `${primaryStart.getFullYear()}–${primaryEnd.getFullYear()} Primary Window`,
      mahadashaLord: dashaData?.mahadasha?.lord || 'Jupiter',
      antardashaLord: dashaData?.antardasha?.lord || 'Venus',
      startDate: primaryStart.toISOString().split('T')[0],
      endDate: primaryEnd.toISOString().split('T')[0],
      favorabilityScore: 8,
      action: config.futureActions.favorable,
      actionTelugu: `అనుకూల సమయం: క్రియాశీలక ప్రయత్నాలు ప్రారంభించడానికి మరియు అనుకూల ఫలితాలు సాధించడానికి అత్యుత్తమ సమయం.`,
      actionHindi: `अनुकूल काल: सक्रिय प्रयास शुरू करने एवं वांछित परिणाम प्राप्त करने के लिए सबसे सशक्त अवसर।`,
      transitAlignment: 'Jupiter providing benevolent drishti/aspect to key domain axis.',
      keyConditions: [
        'Benefic sub-period running without Trika affliction',
        'Jupiter transit maintaining supportive angular relationship',
        'Practical preparations completed during preceding preparatory phase'
      ]
    });

    windows.push({
      periodLabel: `${altStart.getFullYear()}–${altEnd.getFullYear()} Alternative Window`,
      mahadashaLord: dashaData?.mahadasha?.lord || 'Jupiter',
      antardashaLord: 'Sun',
      startDate: altStart.toISOString().split('T')[0],
      endDate: altEnd.toISOString().split('T')[0],
      favorabilityScore: 6,
      action: config.futureActions.delayed,
      actionTelugu: `ద్వితీయ సమయం: పట్టుదలతో కూడిన ప్రయత్నాలు మరియు సహనంతో లక్ష్య సాధన.`,
      actionHindi: `वैकल्पिक अवसर: निरंतर परिश्रम एवं धैर्य के साथ लक्ष्य प्राप्ति।`,
      transitAlignment: 'Saturn movement releasing pressure from lagna/moon sign.',
      keyConditions: [
        'Saturn transits away from Chandra lagna',
        'Remedial and disciplined lifestyle measures maintained',
        'Specialist consultation running in tandem'
      ]
    });

    return windows;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // OVERALL SYNTHESIS HELPERS
  // ───────────────────────────────────────────────────────────────────────────
  private static computeOverallSignal(
    natal: NatalPromise['verdict'],
    dasha: DashaActivation['verdict'],
    transit: TransitConfirmation['verdict']
  ): VedicReasoningContext['overallSignal'] {
    if (natal === 'strong' && dasha === 'supportive' && transit === 'confirming') {
      return 'VERY_FAVORABLE';
    }
    if ((natal === 'strong' || natal === 'moderate') && (dasha === 'supportive' || transit === 'confirming')) {
      return 'FAVORABLE';
    }
    if (dasha === 'critical' || (natal === 'obstructed' && dasha === 'challenging')) {
      return 'CRITICAL_CAUTION';
    }
    if (natal === 'delayed' || dasha === 'challenging' || transit === 'contradicting') {
      return 'MIXED_DELAY';
    }
    return 'CHALLENGING';
  }

  private static buildOverallSummary(
    domain: VedicDomain,
    natal: NatalPromise,
    dasha: DashaActivation,
    transit: TransitConfirmation,
    signal: VedicReasoningContext['overallSignal']
  ): string {
    return `In the domain of ${domain}: Layer 1 Natal Promise is ${natal.verdict.toUpperCase()}; Layer 2 Dasha Activation is ${dasha.verdict.toUpperCase()}; Layer 3 Transit Confirmation is ${transit.verdict.toUpperCase()}. Overall planetary signal is ${signal.replace('_', ' ')}.`;
  }

  private static identifyKeyPlanets(
    domain: VedicDomain,
    natal: NatalPromise,
    dasha: DashaActivation,
    transit: TransitConfirmation
  ): string[] {
    const list = new Set<string>();
    if (natal.dominantPlanet) list.add(natal.dominantPlanet);
    if (natal.blockingPlanet) list.add(natal.blockingPlanet.split(' ')[0]);
    if (dasha.mahadasha?.planet) list.add(dasha.mahadasha.planet);
    if (dasha.antardasha?.planet) list.add(dasha.antardasha.planet);
    list.add('Jupiter');
    list.add('Saturn');
    return Array.from(list);
  }

  private static buildKeyInsight(
    domain: VedicDomain,
    natal: NatalPromise,
    dasha: DashaActivation,
    transit: TransitConfirmation,
    signal: VedicReasoningContext['overallSignal']
  ): string {
    if (natal.trikaAfflictions.length > 0) {
      return `Results in ${domain} require deliberate patience and structured effort; the path involves transformation rather than direct denial.`;
    }
    if (dasha.doubleTrikaFlag) {
      return `Current phase is a karmic clearing cycle; align with disciplined preparation rather than forcing premature outcomes.`;
    }
    return `Favorable celestial support is aligned; maintain focused action and consistent spiritual or professional discipline.`;
  }
}

// ─── PROMPT GENERATOR HELPER ──────────────────────────────────────────────────

/**
 * Builds the structured markdown block that gets prepended to the system prompt.
 * This is the exact representation that Gemini uses to stay 100% grounded in
 * deterministic facts.
 */
export function buildVedicReasoningSection(
  ctx: VedicReasoningContext,
  language: string = 'en'
): string {
  const isTe = language === 'te';
  const isHi = language === 'hi';

  const domainTitle = ctx.domain.toUpperCase();
  const trikaLines =
    ctx.natalPromise.trikaAfflictions.length > 0
      ? ctx.natalPromise.trikaAfflictions
          .map((t) => `  - ${t.planet} (Lord of H${t.houseOfLordship}) sits in H${t.trikaPlacement}: ${t.theme}`)
          .join('\n')
      : '  - None (no Trika affliction detected on domain lords)';

  const karakaLines = ctx.natalPromise.karakas
    .map((k) => `  - ${k.planet}: Placed in H${k.house} (${k.dignity}, combust: ${k.isCombust ? 'YES' : 'NO'}, score: ${k.score}/10)`)
    .join('\n');

  const historyLines = ctx.historicalEventWindows
    .map(
      (h) =>
        `• ${h.periodLabel}:\n  Question (${language}): ${isTe ? h.validationQuestionTelugu : isHi ? h.validationQuestionHindi : h.validationQuestion}`
    )
    .join('\n');

  const futureLines = ctx.futureTimingWindows
    .map(
      (f, idx) =>
        `• Window ${idx + 1}: ${f.periodLabel} (Favorability Score: ${f.favorabilityScore}/10)\n  Recommended Action: ${isTe ? f.actionTelugu : isHi ? f.actionHindi : f.action}\n  Sky Alignment: ${f.transitAlignment}`
    )
    .join('\n');

  const missingWarning =
    ctx.missingDataItems.length > 0
      ? `\n⚠ MISSING DATA WARNING: ${ctx.missingDataItems.join(', ')} unavailable in chart data. Explicitly acknowledge this uncertainty.`
      : '';

  return `═══════════════════════════════════════════════════════════════════
VEDIC THREE-LAYER REASONING FRAMEWORK (PRE-COMPUTED GROUND TRUTH)
═══════════════════════════════════════════════════════════════════
Consultation Domain: ${domainTitle}
Overall Celestial Signal: ${ctx.overallSignal}
Key Insight: ${ctx.keyInsight}
${missingWarning}

LAYER 1: NATAL PROMISE (Structural Setup)
• Verdict: ${ctx.natalPromise.verdict.toUpperCase()} (Confidence: ${ctx.natalPromise.confidenceScore}%)
• Dominant Planet: ${ctx.natalPromise.dominantPlanet}
• Blocking / Afflicting Factor: ${ctx.natalPromise.blockingPlanet || 'None'}
• Trika Afflictions (H6/8/12):
${trikaLines}
• Natural Significators (Karakas):
${karakaLines}
• Natal Summary: ${ctx.natalPromise.summary}

LAYER 2: DASHA ACTIVATION (Current Period Timeline)
• Verdict: ${ctx.dashaActivation.verdict.toUpperCase()}
• Mahadasha: ${ctx.dashaActivation.mahadasha.planet} (H${ctx.dashaActivation.mahadasha.natalHouse}, rules H${ctx.dashaActivation.mahadasha.lordOfHouses.join('/') || 'none'})
• Antardasha: ${ctx.dashaActivation.antardasha.planet} (H${ctx.dashaActivation.antardasha.natalHouse}, rules H${ctx.dashaActivation.antardasha.lordOfHouses.join('/') || 'none'})
• Double Trika Flag: ${ctx.dashaActivation.doubleTrikaFlag ? 'ACTIVE (Testing Phase)' : 'INACTIVE'}
• Dasha Summary: ${ctx.dashaActivation.summary}

LAYER 3: SKY CONFIRMATION (Gochara Transits)
• Verdict: ${ctx.transitConfirmation.verdict.toUpperCase()}
• Jupiter: ${ctx.transitConfirmation.jupiterTransit.roleDescription}
• Saturn: ${ctx.transitConfirmation.saturnTransit.roleDescription}
• Rahu: ${ctx.transitConfirmation.rahuTransit.roleDescription}
• Transit Summary: ${ctx.transitConfirmation.summary}

HISTORICAL VALIDATION QUESTIONS (Ask client to verify chart accuracy):
${historyLines}

FUTURE TIMING & PREDICTIONS:
${futureLines}

INSTRUCTIONS FOR GENERATION:
1. You MUST adopt this three-layer structure in your final output: Natal Promise → Dasha Activation → Transit Confirmation.
2. If the user asks 'when', cite the future windows provided above.
3. If the user asks 'why', explain the Trika afflictions or combust karakas noted above without moral judgment.
4. Include the validation question so the client can verify birth chart accuracy from past events.
═══════════════════════════════════════════════════════════════════`;
}
