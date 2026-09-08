import { EnhancedQueryConsultationEngine } from "../engines/QueryConsultationEngine";
import { calculateActiveDasha } from "../engines/DashaEngine";
import { calculateTransits } from "../engines/TransitEngine";
import { calculateManglikDosha } from "../manglikDosha";
import type { BirthDetails } from "../../types";
import { ChartDataValidator, type CanonicalChartData } from "../engines/ChartDataValidator";
import { ReasoningEngine } from "../engines/ReasoningEngine";
import { PresentationEngine } from "../engines/PresentationEngine";
import { CONSULTATION_CONSTRAINTS } from "../engines/ConsultationConstraints";
import {
  computeUnifiedKPGroundTruth,
  buildSystemPrompt as buildUnifiedSystemPrompt
} from "../../components/AdvancedAITab/UnifiedKPGroundTruthEngine";
import {
  extractPlanetsList,
  extractAscendantSign,
  extractAscendantLongitude,
  extractMoonLongitude,
  getHouseFromAscendant,
  getHouseFromMoon,
  getHouseLord,
  getPlanetStrength,
  isDwidwadasha,
  isShashtashtaka,
  getSadeSatiStatus,
  getDashaRelationshipDescription,
  getHouseOccupancy,
  ZODIAC_SIGNS,
  SIGN_LORDS,
  PlanetStrengthResult,
  SadeSatiResult
} from "../astrology/traditionalVedicCalculations";
import { buildTraditionalAIPrompt } from "../astrology/traditionalContextBuilder";
import { computeLiveTransitSnapshot } from "../engines/LiveTransitEngine";

export type ConsultationPersona =
  | "classical_parashari"
  | "vedic_divisional"
  | "vedic_remedial"
  | "kp_stellar"
  | "quick"
  | "classical_jyotish";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    queryDomain?: string;
    confidence?: number;
    sources?: Array<{ title: string; url: string }>;
    vedicGroundTruths?: VedicGroundTruths;
    kpGroundTruths?: VedicGroundTruths; // backward compatibility alias
    traditionalAnalysis?: ComprehensiveVedicAnalysis;
    persona?: ConsultationPersona;
  };
}

export interface VedicGroundTruths {
  domain: string;
  targetHouse: number;
  targetHouseLord: string;
  rasiSign: string;
  navamshaSign: string;
  divisionalFocus: string;
  vedicPromise: "YES" | "DELAYED" | "NO";
  gatekeeperStatus: "OPEN" | "RESTRICTED";
  confidenceScore: number;
  timing: string;
  explanation: string;
  obstacles: string[];
  activeDasha: string;
  moonSign: string;
  transitsSummary: string;
  activeYogas: string[];
  majorHouseAlignment: Array<{
    house: number;
    name: string;
    houseLord: string;
    promise: "YES" | "DELAYED" | "NO";
    status: "OPEN" | "RESTRICTED";
  }>;
  // Backward compatibility fields for legacy UI components
  cuspSubLord?: string;
  cuspPromise?: "YES" | "DELAYED" | "NO";
  rulingPlanets?: string[];
  majorHouseGatekeepers?: Array<{
    house: number;
    name: string;
    subLord: string;
    promise: "YES" | "DELAYED" | "NO";
    status: "OPEN" | "RESTRICTED";
  }>;
}

export type KPGroundTruths = VedicGroundTruths;

export interface EnhancedConsultationRequest {
  birthData: BirthDetails;
  horoscopeData?: any;
  userQuery: string;
  conversationHistory: ConversationMessage[];
  persona?: ConsultationPersona;
  userId?: string;
  language?: "en" | "hi" | "te";
}

export class ConsultationError extends Error {
  constructor(message: string, public originalError?: Error | unknown) {
    super(message);
    this.name = "ConsultationError";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRADITIONAL VEDIC ANALYSIS INTERFACES (Natal → Dasha → Transit → Verdict)
// ─────────────────────────────────────────────────────────────────────────────

export interface NatalAnalysisResult {
  lagnaSign: string;
  lagnaLord: string;
  relevantHouses: number[];
  relevantKarakas: string[];
  houseOccupancy: Array<{ house: number; occupants: any[] }>;
  houseLords: Array<{
    house: number;
    lord: string;
    sign: string;
    housePosition: number;
    strength: PlanetStrengthResult;
  }>;
  karakaAnalysis: Array<{
    karaka: string;
    sign: string;
    house: number;
    strength: PlanetStrengthResult;
  }>;
  conclusion: string;
  verdict: 'strong' | 'moderate' | 'delayed' | 'obstructed';
}

export interface DashaAnalysisResult {
  md: {
    lord: string;
    house: number;
    sign: string;
    strength: PlanetStrengthResult;
    startDate?: Date;
    endDate?: Date;
  };
  ad: {
    lord: string;
    house: number;
    sign: string;
    strength: PlanetStrengthResult;
    startDate?: Date;
    endDate?: Date;
  };
  pd?: {
    lord: string;
    house: number;
    sign: string;
    strength: PlanetStrengthResult;
  };
  natalPositions: Array<{ role: 'MD' | 'AD' | 'PD'; lord: string; house: number }>;
  dashaRelationships: Array<{ pair: string; type: string; description: string }>;
  doubleTrika: boolean;
  conclusion: string;
  verdict: 'supportive' | 'neutral' | 'challenging' | 'critical';
}

export interface TransitAnalysisResult {
  moonSign: string;
  moonLongitude: number;
  allPlanetaryTransits?: Array<{
    planet: string;
    sign: string;
    houseFromMoon: number;
    degreeInSign?: number;
    isRetrograde?: boolean;
    classification?: string;
    classicalResultTelugu?: string;
  }>;
  dashaLordPositions: Array<{
    lord: string;
    transitSign: string;
    houseFromMoon: number;
    description: string;
  }>;
  karakaTransit: Array<{
    karaka: string;
    transitSign: string;
    houseFromMoon: number;
    description: string;
  }>;
  sadeSati: SadeSatiResult;
  transitJupiter: { sign: string; houseFromMoon: number; aspectsRelevant: boolean };
  transitSaturn: { sign: string; houseFromMoon: number; aspectsRelevant: boolean };
  conclusion: string;
  verdict: 'confirming' | 'neutral' | 'contradicting';
}

export interface FinalVerdictResult {
  summary: string;
  support: string;
  activation: string;
  currentCondition: string;
  verdict: 'Favourable' | 'Mixed' | 'Delayed' | 'Difficult';
  timeline: string;
  actionRecommendations: string[];
  validationQuestions: string[];
}

export interface ComprehensiveVedicAnalysis {
  domain?: string;
  natalAnalysis: NatalAnalysisResult;
  dashaAnalysis: DashaAnalysisResult;
  transitAnalysis: TransitAnalysisResult;
  finalVerdict: FinalVerdictResult;
  historicalEventWindows?: Array<{ periodLabel: string; validationQuestion: string }>;
  futureTimingWindows?: Array<{ periodLabel: string; description: string; favorabilityScore: number; action: string }>;
  metadata: {
    methodology: 'Traditional Vedic (Natal → Dasha → Transit)';
    queryType: string;
    timestamp: string;
    sadeSatiActive: boolean;
    sadeSatiPhase: string;
    verdict: 'Favourable' | 'Mixed' | 'Delayed' | 'Difficult';
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN HOUSE & KARAKA MAPPINGS
// ─────────────────────────────────────────────────────────────────────────────

interface DomainRule {
  domain: string;
  relevantHouses: number[];
  relevantKarakas: string[];
}

const DOMAIN_RULES: Record<string, DomainRule> = {
  MARRIAGE: {
    domain: 'Marriage / Relationship',
    relevantHouses: [7, 2, 11],
    relevantKarakas: ['Venus', 'Jupiter', 'Moon']
  },
  CAREER: {
    domain: 'Career / Profession',
    relevantHouses: [10, 6, 2, 11],
    relevantKarakas: ['Sun', 'Saturn', 'Mercury', 'Jupiter']
  },
  PROGENY: {
    domain: 'Progeny / Children',
    relevantHouses: [5, 9, 1, 2],
    relevantKarakas: ['Jupiter', 'Moon', 'Venus']
  },
  HEALTH: {
    domain: 'Health / Vitality',
    relevantHouses: [1, 6, 8, 12],
    relevantKarakas: ['Sun', 'Moon', 'Mars', 'Saturn']
  },
  FINANCE: {
    domain: 'Finance / Wealth',
    relevantHouses: [2, 11, 9, 5],
    relevantKarakas: ['Jupiter', 'Mercury', 'Venus']
  },
  EDUCATION: {
    domain: 'Education / Academics',
    relevantHouses: [4, 5, 9],
    relevantKarakas: ['Mercury', 'Jupiter']
  },
  PROPERTY: {
    domain: 'Property / Real Estate / Vehicles',
    relevantHouses: [4, 11, 2],
    relevantKarakas: ['Mars', 'Moon', 'Saturn', 'Venus']
  },
  LITIGATION: {
    domain: 'Litigation / Legal Disputes',
    relevantHouses: [6, 8, 12],
    relevantKarakas: ['Mars', 'Saturn', 'Rahu']
  },
  FOREIGN_TRAVEL: {
    domain: 'Foreign Travel / Relocation',
    relevantHouses: [12, 9, 3],
    relevantKarakas: ['Rahu', 'Jupiter', 'Saturn', 'Moon']
  },
  SPIRITUALITY: {
    domain: 'Spirituality / Dharma',
    relevantHouses: [9, 12, 1, 5],
    relevantKarakas: ['Jupiter', 'Ketu', 'Saturn']
  },
  GENERAL: {
    domain: 'Life Overview / General',
    relevantHouses: [1, 5, 9, 10],
    relevantKarakas: ['Sun', 'Moon', 'Jupiter']
  }
};

export class EnhancedGeminiConsultationService {
  private queryEngine: EnhancedQueryConsultationEngine;

  constructor() {
    this.queryEngine = new EnhancedQueryConsultationEngine();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PART 4: REFACTORED TRADITIONAL VEDIC METHODS (Natal → Dasha → Transit)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Stage 1: Natal Analysis (From Ascendant / Lagna)
   */
  public performNatalAnalysis(
    horoscopeData: any,
    birthDetails: BirthDetails,
    relevantHouses: number[],
    relevantKarakas: string[]
  ): NatalAnalysisResult {
    const ascSign = extractAscendantSign(horoscopeData);
    const ascLon = extractAscendantLongitude(horoscopeData);
    const lagnaSign = ascSign;
    const lagnaLord = SIGN_LORDS[lagnaSign] || 'Saturn';
    const lagnaSignIdx = ZODIAC_SIGNS.indexOf(lagnaSign as any) !== -1 ? ZODIAC_SIGNS.indexOf(lagnaSign as any) : 10;

    const planetsList = extractPlanetsList(horoscopeData);

    // 1. House lords and placements
    const houseLords = relevantHouses.map(houseNum => {
      const sign = ZODIAC_SIGNS[(lagnaSignIdx + houseNum - 1) % 12];
      const lord = getHouseLord(houseNum, sign);
      const lordPlanet = planetsList.find(p => p.name.toLowerCase() === lord.toLowerCase());
      const lordHousePosition = lordPlanet ? lordPlanet.house : getHouseFromAscendant(lordPlanet?.longitude || 0, ascLon);
      const strength = getPlanetStrength(lord, lordPlanet?.sign || sign);

      return {
        house: houseNum,
        lord,
        sign,
        housePosition: lordHousePosition,
        strength
      };
    });

    // 2. House occupancy
    const houseOccupancy = relevantHouses.map(houseNum => ({
      house: houseNum,
      occupants: getHouseOccupancy(horoscopeData, houseNum, true)
    }));

    // 3. Karaka analysis
    const karakaAnalysis = relevantKarakas.map(karaka => {
      const kPlanet = planetsList.find(p => p.name.toLowerCase() === karaka.toLowerCase());
      const sign = kPlanet?.sign || 'Aries';
      const house = kPlanet ? kPlanet.house : getHouseFromAscendant(kPlanet?.longitude || 0, ascLon);
      const strength = getPlanetStrength(karaka, sign);

      return {
        karaka,
        sign,
        house,
        strength
      };
    });

    // 4. Evaluate Trika afflictions (6, 8, 12 placements) and Benefic strengths
    const trikaAfflictedLords = houseLords.filter(h => [6, 8, 12].includes(h.housePosition));
    const debilitatedLords = houseLords.filter(h => h.strength.dignity === 'Debilitated');
    const exaltedOrOwnLords = houseLords.filter(h => ['Exalted', 'Own Sign'].includes(h.strength.dignity));

    let verdict: 'strong' | 'moderate' | 'delayed' | 'obstructed' = 'moderate';
    let conclusion = '';

    if (exaltedOrOwnLords.length >= 1 && trikaAfflictedLords.length === 0) {
      verdict = 'strong';
      conclusion = `Strong natal promise: Primary house lord (${houseLords[0]?.lord}) is well-placed in House ${houseLords[0]?.housePosition} (${houseLords[0]?.strength.dignity}), free from Trika afflictions.`;
    } else if (trikaAfflictedLords.length > 0) {
      verdict = 'delayed';
      conclusion = `Natal setup indicates delay or transformation: House ${trikaAfflictedLords[0].house} lord (${trikaAfflictedLords[0].lord}) sits in Trika House ${trikaAfflictedLords[0].housePosition}. Classical Parashari indicates initial obstacles requiring perseverance before fruition.`;
    } else if (debilitatedLords.length > 0) {
      verdict = 'obstructed';
      conclusion = `Afflicted natal indications: Key significator ${debilitatedLords[0].lord} is in debilitation (${debilitatedLords[0].sign}). Requires remedial support and sustained effort.`;
    } else {
      verdict = 'moderate';
      conclusion = `Balanced natal promise: Relevant houses (${relevantHouses.join(', ')}) possess steady planetary placements under Lagna lord ${lagnaLord}.`;
    }

    return {
      lagnaSign,
      lagnaLord,
      relevantHouses,
      relevantKarakas,
      houseOccupancy,
      houseLords,
      karakaAnalysis,
      conclusion,
      verdict
    };
  }

  /**
   * Stage 2: Dasha Analysis (Vimshottari MD, AD, PD from Lagna)
   */
  public performDashaAnalysis(
    horoscopeData: any,
    birthDetails: BirthDetails,
    currentDateTime: Date = new Date(),
    natalAnalysis?: NatalAnalysisResult
  ): DashaAnalysisResult {
    const ascLon = extractAscendantLongitude(horoscopeData);
    const planetsList = extractPlanetsList(horoscopeData);

    let mdLord = 'Mercury';
    let adLord = 'Venus';
    let pdLord = 'Venus';
    let mdStartDate: Date | undefined;
    let mdEndDate: Date | undefined;
    let adStartDate: Date | undefined;
    let adEndDate: Date | undefined;

    try {
      const activeDasha = calculateActiveDasha(horoscopeData, birthDetails.date, currentDateTime);
      if (activeDasha) {
        mdLord = activeDasha.mahadasha?.lord || mdLord;
        adLord = activeDasha.antardasha?.lord || adLord;
        pdLord = activeDasha.pratyantardasha?.lord || adLord;
        mdStartDate = activeDasha.mahadasha?.startDate ? new Date(activeDasha.mahadasha.startDate) : undefined;
        mdEndDate = activeDasha.mahadasha?.endDate ? new Date(activeDasha.mahadasha.endDate) : undefined;
        adStartDate = activeDasha.antardasha?.startDate ? new Date(activeDasha.antardasha.startDate) : undefined;
        adEndDate = activeDasha.antardasha?.endDate ? new Date(activeDasha.antardasha.endDate) : undefined;
      }
    } catch (e) {}

    const mdPlanet = planetsList.find(p => p.name.toLowerCase() === mdLord.toLowerCase());
    const adPlanet = planetsList.find(p => p.name.toLowerCase() === adLord.toLowerCase());
    const pdPlanet = planetsList.find(p => p.name.toLowerCase() === pdLord.toLowerCase());

    const mdHouse = mdPlanet ? mdPlanet.house : (mdPlanet ? getHouseFromAscendant(mdPlanet.longitude, ascLon) : 1);
    const adHouse = adPlanet ? adPlanet.house : (adPlanet ? getHouseFromAscendant(adPlanet.longitude, ascLon) : 1);
    const pdHouse = pdPlanet ? pdPlanet.house : (pdPlanet ? getHouseFromAscendant(pdPlanet.longitude, ascLon) : 1);

    const mdSign = mdPlanet?.sign || 'Aries';
    const adSign = adPlanet?.sign || 'Aries';
    const pdSign = pdPlanet?.sign || 'Aries';

    const mdStrength = getPlanetStrength(mdLord, mdSign);
    const adStrength = getPlanetStrength(adLord, adSign);
    const pdStrength = getPlanetStrength(pdLord, pdSign);

    // Dasha relationships
    const dashaRelationships: Array<{ pair: string; type: string; description: string }> = [];

    const mdAdRel = getDashaRelationshipDescription(mdLord, adLord, mdHouse, adHouse);
    if (mdAdRel.type !== 'Neutral') {
      dashaRelationships.push({ pair: `${mdLord}-${adLord}`, ...mdAdRel });
    }

    const adPdRel = getDashaRelationshipDescription(adLord, pdLord, adHouse, pdHouse);
    if (adPdRel.type !== 'Neutral') {
      dashaRelationships.push({ pair: `${adLord}-${pdLord}`, ...adPdRel });
    }

    const doubleTrika = [6, 8, 12].includes(mdHouse) && [6, 8, 12].includes(adHouse);

    // Relate to relevant houses if available
    const relevantHouses = natalAnalysis?.relevantHouses || [1, 7, 10];
    const mdConnects = relevantHouses.includes(mdHouse);
    const adConnects = relevantHouses.includes(adHouse);

    let verdict: 'supportive' | 'neutral' | 'challenging' | 'critical' = 'neutral';
    let conclusion = '';

    if (doubleTrika) {
      verdict = 'critical';
      conclusion = `Intense testing phase: Both Mahadasha lord (${mdLord}) and Antardasha lord (${adLord}) activate Trika houses (${mdHouse} and ${adHouse}) simultaneously. Demands caution, patience, and non-impulsive decisions.`;
    } else if (isShashtashtaka(mdHouse, adHouse)) {
      verdict = 'challenging';
      conclusion = `Friction & transformation: Mahadasha lord (${mdLord}) in House ${mdHouse} and Antardasha lord (${adLord}) in House ${adHouse} form a Shashtashtaka (6-8) relationship, creating conflicting dynamics or testing resolve.`;
    } else if (isDwidwadasha(mdHouse, adHouse)) {
      verdict = 'challenging';
      conclusion = `Distance & expenditure: ${mdLord} and ${adLord} sit in a 2-12 (Dwidwadasha) alignment, indicating adjustments, foreign distance, or high expenditure before gains.`;
    } else if (mdConnects || adConnects || ['Exalted', 'Own Sign'].includes(adStrength.dignity)) {
      verdict = 'supportive';
      conclusion = `Supportive timing: Antardasha lord ${adLord} is strong in House ${adHouse} (${adStrength.dignity}) and directly activates the domain of interest.`;
    } else {
      verdict = 'neutral';
      conclusion = `Steady progress: Running ${mdLord} Mahadasha and ${adLord} Antardasha providing moderate, consistent momentum.`;
    }

    return {
      md: {
        lord: mdLord,
        house: mdHouse,
        sign: mdSign,
        strength: mdStrength,
        startDate: mdStartDate,
        endDate: mdEndDate
      },
      ad: {
        lord: adLord,
        house: adHouse,
        sign: adSign,
        strength: adStrength,
        startDate: adStartDate,
        endDate: adEndDate
      },
      pd: {
        lord: pdLord,
        house: pdHouse,
        sign: pdSign,
        strength: pdStrength
      },
      natalPositions: [
        { role: 'MD', lord: mdLord, house: mdHouse },
        { role: 'AD', lord: adLord, house: adHouse },
        { role: 'PD', lord: pdLord, house: pdHouse }
      ],
      dashaRelationships,
      doubleTrika,
      conclusion,
      verdict
    };
  }

  /**
   * Stage 3: Transit Analysis (From Natal Moon Sign + Sade Sati)
   */
  public performTransitAnalysis(
    horoscopeData: any,
    birthDetails: BirthDetails,
    currentDateTime: Date = new Date(),
    natalAnalysis?: NatalAnalysisResult,
    dashaAnalysis?: DashaAnalysisResult
  ): TransitAnalysisResult {
    const moonLon = extractMoonLongitude(horoscopeData);
    const moonSignIdx = Math.floor((((moonLon % 360) + 360) % 360) / 30);
    const moonSign = horoscopeData?.rasi || horoscopeData?.planets?.find((p: any) => p.name === 'Moon')?.sign || ZODIAC_SIGNS[moonSignIdx] || 'Aries';

    // Current real sidereal transits
    let transitSaturnLon = 345; // Default Pisces
    let transitSaturnSign = 'Pisces';
    let transitJupiterLon = 75; // Default Gemini / Cancer
    let transitJupiterSign = 'Gemini';
    let allPlanetaryTransits: Array<{
      planet: string;
      sign: string;
      houseFromMoon: number;
      degreeInSign?: number;
      isRetrograde?: boolean;
      classification?: string;
      classicalResultTelugu?: string;
    }> = [];

    try {
      const liveTransits = computeLiveTransitSnapshot(moonSign, currentDateTime);
      if (liveTransits?.positions) {
        if (liveTransits.positions.Saturn?.siderealLongitude !== undefined) {
          transitSaturnLon = liveTransits.positions.Saturn.siderealLongitude;
          transitSaturnSign = liveTransits.positions.Saturn.sign || 'Pisces';
        }
        if (liveTransits.positions.Jupiter?.siderealLongitude !== undefined) {
          transitJupiterLon = liveTransits.positions.Jupiter.siderealLongitude;
          transitJupiterSign = liveTransits.positions.Jupiter.sign || 'Gemini';
        }

        allPlanetaryTransits = (Object.keys(liveTransits.positions) as Array<keyof typeof liveTransits.positions>).map(key => {
          const pos = liveTransits.positions[key];
          return {
            planet: pos.planet,
            sign: pos.sign,
            houseFromMoon: pos.houseFromMoon,
            degreeInSign: pos.degreeInSign,
            isRetrograde: !!pos.isRetrograde,
            classification: pos.classification,
            classicalResultTelugu: pos.classicalResultTelugu
          };
        });
      }
    } catch (e) {}

    const sadeSati = getSadeSatiStatus(transitSaturnLon, moonLon);
    const jupiterHouseFromMoon = getHouseFromMoon(transitJupiterLon, moonLon);
    const saturnHouseFromMoon = getHouseFromMoon(transitSaturnLon, moonLon);

    // Check transits of dasha lords
    const dashaLords = [dashaAnalysis?.md.lord || 'Mercury', dashaAnalysis?.ad.lord || 'Venus'];
    const planetsList = extractPlanetsList(horoscopeData);

    const dashaLordPositions = dashaLords.map(lord => {
      const p = planetsList.find(item => item.name.toLowerCase() === lord.toLowerCase());
      const pLon = p?.longitude || 0;
      const houseFromMoon = getHouseFromMoon(pLon, moonLon);
      const sign = p?.sign || 'Aries';
      return {
        lord,
        transitSign: sign,
        houseFromMoon,
        description: `${lord} sits in House ${houseFromMoon} relative to Natal Moon (${moonSign})`
      };
    });

    // Check relevant karakas
    const relevantKarakas = natalAnalysis?.relevantKarakas || ['Jupiter', 'Venus'];
    const karakaTransit = relevantKarakas.map(karaka => {
      const p = planetsList.find(item => item.name.toLowerCase() === karaka.toLowerCase());
      const pLon = p?.longitude || 0;
      const houseFromMoon = getHouseFromMoon(pLon, moonLon);
      const sign = p?.sign || 'Aries';
      return {
        karaka,
        transitSign: sign,
        houseFromMoon,
        description: `Karaka ${karaka} in House ${houseFromMoon} from Moon`
      };
    });

    // Transit Jupiter aspects 5th, 7th, 9th from its position
    const jupiterAspects = [5, 7, 9].map(h => ((jupiterHouseFromMoon + h - 2) % 12) + 1);
    const jupiterAspectsRelevant = jupiterAspects.some(h => natalAnalysis?.relevantHouses?.includes(h));

    // Transit Saturn aspects 3rd, 7th, 10th from its position
    const saturnAspects = [3, 7, 10].map(h => ((saturnHouseFromMoon + h - 2) % 12) + 1);
    const saturnAspectsRelevant = saturnAspects.some(h => natalAnalysis?.relevantHouses?.includes(h));

    let verdict: 'confirming' | 'neutral' | 'contradicting' = 'confirming';
    let conclusion = '';

    if (sadeSati.active && sadeSati.saturnHouseFromMoon === 1) {
      verdict = 'contradicting';
      conclusion = `Intense Gochara pressure: ${sadeSati.description} Demands deliberate discipline and emotional equilibrium.`;
    } else if (jupiterAspectsRelevant || [1, 2, 5, 7, 9, 11].includes(jupiterHouseFromMoon)) {
      verdict = 'confirming';
      conclusion = `Auspicious transit support: Transiting Jupiter in ${transitJupiterSign} (House ${jupiterHouseFromMoon} from Moon) casts protective benevolent aspects.`;
    } else if (sadeSati.active) {
      verdict = 'neutral';
      conclusion = `Moderate transit influence: ${sadeSati.phase} active, bringing lessons in diligence, balanced by natal dasha momentum.`;
    } else {
      verdict = 'confirming';
      conclusion = `Favourable transit conditions: Free from Sade Sati intensity; benefic planetary transits align smoothly with natal factors.`;
    }

    return {
      moonSign,
      moonLongitude: moonLon,
      allPlanetaryTransits,
      dashaLordPositions,
      karakaTransit,
      sadeSati,
      transitJupiter: {
        sign: transitJupiterSign,
        houseFromMoon: jupiterHouseFromMoon,
        aspectsRelevant: jupiterAspectsRelevant
      },
      transitSaturn: {
        sign: transitSaturnSign,
        houseFromMoon: saturnHouseFromMoon,
        aspectsRelevant: saturnAspectsRelevant
      },
      conclusion,
      verdict
    };
  }

  /**
   * Stage 4: Final Verdict (Synthesizes Natal, Dasha, and Transit stages)
   */
  public generateFinalVerdict(
    userQuery: string,
    natalAnalysis: NatalAnalysisResult,
    dashaAnalysis: DashaAnalysisResult,
    transitAnalysis: TransitAnalysisResult
  ): FinalVerdictResult {
    let verdict: 'Favourable' | 'Mixed' | 'Delayed' | 'Difficult' = 'Mixed';

    if (natalAnalysis.verdict === 'strong' && dashaAnalysis.verdict === 'supportive' && transitAnalysis.verdict === 'confirming') {
      verdict = 'Favourable';
    } else if (dashaAnalysis.doubleTrika || natalAnalysis.verdict === 'obstructed') {
      verdict = 'Difficult';
    } else if (natalAnalysis.verdict === 'delayed' || dashaAnalysis.verdict === 'challenging' || transitAnalysis.sadeSati.active) {
      verdict = 'Delayed';
    } else {
      verdict = 'Mixed';
    }

    // Specific timeline calculation
    let timeline = 'Next 12–24 months';
    if (dashaAnalysis.ad.endDate) {
      const endYear = new Date(dashaAnalysis.ad.endDate).getFullYear();
      if (verdict === 'Favourable') {
        timeline = `Immediate supportive window active through ${new Date(dashaAnalysis.ad.endDate).toLocaleDateString()}`;
      } else if (verdict === 'Delayed') {
        timeline = `Favourable opening begins from ${endYear}–${endYear + 1} following the current ${dashaAnalysis.ad.lord} Antardasha transition`;
      } else if (verdict === 'Difficult') {
        timeline = `Transformation phase through late ${endYear}; clarity emerges in subsequent sub-period`;
      } else {
        timeline = `Gradual realization across ${new Date().getFullYear()}–${endYear}`;
      }
    }

    const summary = `Based on the classical three-layer synthesis (Natal Promise: ${natalAnalysis.verdict}, Dasha Activation: ${dashaAnalysis.verdict}, Transit Condition: ${transitAnalysis.verdict}), the indication is ${verdict.toUpperCase()}. ${natalAnalysis.conclusion} ${dashaAnalysis.conclusion}`;
    const support = natalAnalysis.conclusion;
    const activation = dashaAnalysis.conclusion;
    const currentCondition = transitAnalysis.conclusion;

    const actionRecommendations = [
      `Strengthen benefic significator ${natalAnalysis.relevantKarakas[0] || 'Jupiter'} through traditional Upasanas and charity.`,
      `Practice patience during the active ${dashaAnalysis.md.lord}-${dashaAnalysis.ad.lord} sub-period; avoid hasty decisions.`,
      transitAnalysis.sadeSati.active
        ? `Perform light Saturday oil lamp offerings or Hanuman Chalisa recitation to ease ${transitAnalysis.sadeSati.phase} discipline.`
        : `Take proactive, well-planned steps aligned with the active dasha timing.`
    ];

    const validationQuestions = [
      `During earlier sub-periods of ${dashaAnalysis.ad.lord} or ${dashaAnalysis.md.lord}, did you experience a significant life transition or relocation?`,
      `Did major milestones or family developments occur when Jupiter was last in harmonious aspect to your Natal Moon (${transitAnalysis.moonSign})?`
    ];

    return {
      summary,
      support,
      activation,
      currentCondition,
      verdict,
      timeline,
      actionRecommendations,
      validationQuestions
    };
  }

  /**
   * Complete 4-stage query analysis pipeline.
   */
  public analyzeQuery(
    userQuery: string,
    birthDetails: BirthDetails,
    horoscopeData?: any,
    currentDateTime: Date = new Date()
  ): ComprehensiveVedicAnalysis {
    const qLower = (userQuery || '').toLowerCase();

    // Identify domain
    let matchedDomain = 'GENERAL';
    if (qLower.includes('marri') || qLower.includes('spouse') || qLower.includes('wife') || qLower.includes('husband') || qLower.includes('partner') || qLower.includes('love') || qLower.includes('vivah') || qLower.includes('పెళ్లి') || qLower.includes('వివాహం')) {
      matchedDomain = 'MARRIAGE';
    } else if (qLower.includes('job') || qLower.includes('career') || qLower.includes('work') || qLower.includes('business') || qLower.includes('promotion') || qLower.includes('profession') || qLower.includes('ఉద్యోగం') || qLower.includes('వృత్తి')) {
      matchedDomain = 'CAREER';
    } else if (qLower.includes('child') || qLower.includes('progeny') || qLower.includes('baby') || qLower.includes('conceive') || qLower.includes('pregnancy') || qLower.includes('son') || qLower.includes('daughter') || qLower.includes('సంతానం') || qLower.includes('పిల్లలు')) {
      matchedDomain = 'PROGENY';
    } else if (qLower.includes('health') || qLower.includes('disease') || qLower.includes('surgery') || qLower.includes('sick') || qLower.includes('pain') || qLower.includes('ఆరోగ్యం') || qLower.includes('చికిత్స')) {
      matchedDomain = 'HEALTH';
    } else if (qLower.includes('money') || qLower.includes('wealth') || qLower.includes('finance') || qLower.includes('income') || qLower.includes('debt') || qLower.includes('profit') || qLower.includes('ధనం') || qLower.includes('ఆర్థికం')) {
      matchedDomain = 'FINANCE';
    } else if (qLower.includes('study') || qLower.includes('exam') || qLower.includes('college') || qLower.includes('degree') || qLower.includes('education') || qLower.includes('విద్య') || qLower.includes('చదువు')) {
      matchedDomain = 'EDUCATION';
    } else if (qLower.includes('house') || qLower.includes('property') || qLower.includes('land') || qLower.includes('vehicle') || qLower.includes('car') || qLower.includes('ఆస్తి') || qLower.includes('వాహనం')) {
      matchedDomain = 'PROPERTY';
    } else if (qLower.includes('court') || qLower.includes('case') || qLower.includes('legal') || qLower.includes('litigat') || qLower.includes('dispute') || qLower.includes('వ్యాజ్యం')) {
      matchedDomain = 'LITIGATION';
    } else if (qLower.includes('visa') || qLower.includes('foreign') || qLower.includes('abroad') || qLower.includes('travel') || qLower.includes('relocat') || qLower.includes('విదేశీ')) {
      matchedDomain = 'FOREIGN_TRAVEL';
    } else if (qLower.includes('spiritual') || qLower.includes('guru') || qLower.includes('moksha') || qLower.includes('pooja') || qLower.includes('dharma') || qLower.includes('ఆధ్యాత్మికత')) {
      matchedDomain = 'SPIRITUALITY';
    }

    const domainRule = DOMAIN_RULES[matchedDomain] || DOMAIN_RULES.GENERAL;

    // Execute 4 stages
    const natalAnalysis = this.performNatalAnalysis(
      horoscopeData,
      birthDetails,
      domainRule.relevantHouses,
      domainRule.relevantKarakas
    );

    const dashaAnalysis = this.performDashaAnalysis(
      horoscopeData,
      birthDetails,
      currentDateTime,
      natalAnalysis
    );

    const transitAnalysis = this.performTransitAnalysis(
      horoscopeData,
      birthDetails,
      currentDateTime,
      natalAnalysis,
      dashaAnalysis
    );

    const finalVerdict = this.generateFinalVerdict(
      userQuery,
      natalAnalysis,
      dashaAnalysis,
      transitAnalysis
    );

    const historicalEventWindows = finalVerdict.validationQuestions.map((vq, idx) => ({
      periodLabel: idx === 0 ? `Past ${dashaAnalysis.ad.lord} sub-period` : `Jupiter Transit Cycle`,
      validationQuestion: vq
    }));

    const futureTimingWindows = [
      {
        periodLabel: finalVerdict.timeline,
        description: `Primary window: active ${dashaAnalysis.md.lord}-${dashaAnalysis.ad.lord} sub-period aligns with transit support`,
        favorabilityScore: finalVerdict.verdict === 'Favourable' ? 9 : finalVerdict.verdict === 'Mixed' ? 7 : 5,
        action: finalVerdict.actionRecommendations[0] || 'Active effort and remedy practice'
      }
    ];

    return {
      domain: domainRule.domain,
      natalAnalysis,
      dashaAnalysis,
      transitAnalysis,
      finalVerdict,
      historicalEventWindows,
      futureTimingWindows,
      metadata: {
        methodology: 'Traditional Vedic (Natal → Dasha → Transit)',
        queryType: domainRule.domain,
        timestamp: new Date().toISOString(),
        sadeSatiActive: transitAnalysis.sadeSati.active,
        sadeSatiPhase: transitAnalysis.sadeSati.phase,
        verdict: finalVerdict.verdict
      }
    };
  }

  /**
   * Refactored Vedic Ground Truths Generator:
   * Completely free of KP Cusp Sub Lords, KP Gatekeepers, or Star Lords.
   * Feeds pure Parashari classical truth to components expecting VedicGroundTruths.
   */
  public computeKPGroundTruths(
    userQuery: string,
    birthData: BirthDetails,
    horoscopeData?: any
  ): VedicGroundTruths {
    const analysis = this.analyzeQuery(userQuery, birthData, horoscopeData);

    const primaryHouse = analysis.natalAnalysis.relevantHouses[0] || 1;
    const primaryHouseLord = analysis.natalAnalysis.houseLords[0]?.lord || 'Venus';

    const majorHouses = [
      { house: 1, name: "Self / Vitality" },
      { house: 2, name: "Finance / Family" },
      { house: 4, name: "Home / Property" },
      { house: 5, name: "Children / Intellect" },
      { house: 6, name: "Competition / Service" },
      { house: 7, name: "Marriage / Union" },
      { house: 9, name: "Fortune / Dharma" },
      { house: 10, name: "Career / Status" },
      { house: 11, name: "Gains / Fulfillment" },
      { house: 12, name: "Moksha / Foreign" }
    ];

    const majorHouseAlignment = majorHouses.map(h => {
      const hLord = analysis.natalAnalysis.houseLords.find(item => item.house === h.house)?.lord || primaryHouseLord;
      const isOpen = analysis.finalVerdict.verdict !== 'Difficult';
      return {
        house: h.house,
        name: h.name,
        houseLord: hLord,
        promise: (analysis.finalVerdict.verdict === 'Favourable' ? 'YES' : analysis.finalVerdict.verdict === 'Delayed' ? 'DELAYED' : 'NO') as 'YES' | 'DELAYED' | 'NO',
        status: (isOpen ? 'OPEN' : 'RESTRICTED') as 'OPEN' | 'RESTRICTED'
      };
    });

    const vedicPromise: 'YES' | 'DELAYED' | 'NO' =
      analysis.finalVerdict.verdict === 'Favourable' ? 'YES' :
      analysis.finalVerdict.verdict === 'Delayed' ? 'DELAYED' : 'NO';

    return {
      domain: analysis.metadata.queryType,
      targetHouse: primaryHouse,
      targetHouseLord: primaryHouseLord,
      rasiSign: analysis.natalAnalysis.lagnaSign,
      navamshaSign: horoscopeData?.navamsa || 'Navamsha Alignment',
      divisionalFocus: 'Parashari D-1 Natal & Vimshottari Dasha',
      vedicPromise,
      gatekeeperStatus: vedicPromise === 'NO' ? 'RESTRICTED' : 'OPEN',
      confidenceScore: analysis.finalVerdict.verdict === 'Favourable' ? 90 : analysis.finalVerdict.verdict === 'Mixed' ? 82 : 75,
      timing: analysis.finalVerdict.timeline,
      explanation: `${analysis.natalAnalysis.conclusion} Active Dasha: ${analysis.dashaAnalysis.md.lord}-${analysis.dashaAnalysis.ad.lord} (${analysis.dashaAnalysis.conclusion}). Transits: ${analysis.transitAnalysis.conclusion}`,
      obstacles: analysis.dashaAnalysis.dashaRelationships.map(r => r.description),
      activeDasha: `${analysis.dashaAnalysis.md.lord} MD / ${analysis.dashaAnalysis.ad.lord} AD`,
      moonSign: analysis.transitAnalysis.moonSign,
      transitsSummary: `${analysis.transitAnalysis.sadeSati.description} Transiting Jupiter in ${analysis.transitAnalysis.transitJupiter.sign}.`,
      activeYogas: ['Parashari Natal Promise', 'Vimshottari Dasha Activation', 'Gochara Transit Alignment'],
      majorHouseAlignment,
      cuspSubLord: primaryHouseLord,
      cuspPromise: vedicPromise,
      rulingPlanets: [analysis.natalAnalysis.lagnaLord, analysis.dashaAnalysis.md.lord, analysis.dashaAnalysis.ad.lord],
      majorHouseGatekeepers: majorHouseAlignment.map(m => ({
        house: m.house,
        name: m.name,
        subLord: m.houseLord,
        promise: m.promise,
        status: m.status
      }))
    };
  }

  /**
   * Pre-computed consultation facts without exposing raw ephemeris.
   */
  public computeConsultationFacts(
    birthData: BirthDetails,
    horoscopeData?: any
  ): Record<string, any> {
    const analysis = this.analyzeQuery('general overview', birthData, horoscopeData);

    return {
      nativeInfo: {
        name: birthData.name,
        place: birthData.place,
        approximateTime: birthData.approximateTime
      },
      chartSummary: {
        lagna: analysis.natalAnalysis.lagnaSign,
        lagnaLord: analysis.natalAnalysis.lagnaLord,
        moonSign: analysis.transitAnalysis.moonSign
      },
      dashaPhase: {
        mahadasha: analysis.dashaAnalysis.md.lord,
        antardasha: analysis.dashaAnalysis.ad.lord,
        pratyantardasha: analysis.dashaAnalysis.pd?.lord
      },
      transits: {
        sadeSatiActive: analysis.transitAnalysis.sadeSati.active,
        sadeSatiPhase: analysis.transitAnalysis.sadeSati.phase,
        saturnHouseFromMoon: analysis.transitAnalysis.sadeSati.saturnHouseFromMoon
      },
      doshas: {
        manglik: calculateManglikDosha(horoscopeData)
      },
      methodology: 'Natal → Dasha → Transit'
    };
  }

  /**
   * Generate consultation response.
   */
  async generateConsultationResponse(
    request: EnhancedConsultationRequest
  ): Promise<ConversationMessage> {
    let canonicalChart: CanonicalChartData | undefined;
    try {
      if (request.horoscopeData) {
        try {
          canonicalChart = ChartDataValidator.validateConsistency(
            request.horoscopeData,
            request.birthData
          );
        } catch (validationError: any) {
          if (validationError?.message?.includes('CHART_DATA')) {
            return {
              role: "assistant",
              content: `చార్ట్ డేటా సమస్య: జాతకం పూర్తిగా లేదా సరిగ్గా లోడ్ కాలేదు. (${validationError.message})`,
              timestamp: new Date(),
              metadata: { persona: request.persona || "quick" }
            };
          }
        }
      }

      const queryIntent = this.queryEngine.recognizeIntent(request.userQuery);
      const domainClassification = this.queryEngine.classifyDomain(queryIntent);

      const traditionalAnalysis = this.analyzeQuery(
        request.userQuery,
        request.birthData,
        request.horoscopeData
      );

      const vedicGroundTruths = this.computeKPGroundTruths(
        request.userQuery,
        request.birthData,
        request.horoscopeData
      );

      const consultationFacts = this.computeConsultationFacts(
        request.birthData,
        request.horoscopeData
      );

      if (!this.validateDataSafety(consultationFacts)) {
        throw new ConsultationError("Data safety validation failed: raw ephemeris data detected");
      }

      const persona = request.persona || "classical_jyotish";
      const systemPrompt = this.buildSystemPrompt(
        domainClassification,
        queryIntent,
        vedicGroundTruths,
        persona,
        request.language || "te",
        request.birthData,
        request.horoscopeData,
        traditionalAnalysis
      );

      const userMessage = this.buildUserMessage(
        request.userQuery,
        consultationFacts,
        domainClassification,
        request.conversationHistory
      );

      const responseText = await this.callGeminiWithRetry(
        systemPrompt,
        userMessage,
        request.conversationHistory,
        persona,
        request.language || "te"
      );

      return {
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
        metadata: {
          queryDomain: domainClassification.domain,
          confidence: queryIntent.confidence,
          vedicGroundTruths,
          kpGroundTruths: vedicGroundTruths,
          traditionalAnalysis,
          persona
        }
      };
    } catch (error) {
      console.warn("Enhanced consultation warning (using deterministic fallback):", error);
      return {
        role: "assistant",
        content: this.generateFallbackConsultationResponse(
          request.userQuery,
          request.birthData,
          request.horoscopeData,
          request.language || "te"
        ),
        timestamp: new Date(),
        metadata: {
          persona: request.persona || "classical_jyotish"
        }
      };
    }
  }

  /**
   * Streaming consultation generator.
   */
  async generateStreamingConsultationResponse(
    request: EnhancedConsultationRequest,
    onChunk: (accumulatedText: string) => void
  ): Promise<ConversationMessage> {
    const queryIntent = this.queryEngine.recognizeIntent(request.userQuery);
    const domainClassification = this.queryEngine.classifyDomain(queryIntent);

    const traditionalAnalysis = this.analyzeQuery(
      request.userQuery,
      request.birthData,
      request.horoscopeData
    );

    const vedicGroundTruths = this.computeKPGroundTruths(
      request.userQuery,
      request.birthData,
      request.horoscopeData
    );

    const consultationFacts = this.computeConsultationFacts(
      request.birthData,
      request.horoscopeData
    );

    const persona = request.persona || "classical_jyotish";
    const systemPrompt = this.buildSystemPrompt(
      domainClassification,
      queryIntent,
      vedicGroundTruths,
      persona,
      request.language || "te",
      request.birthData,
      request.horoscopeData,
      traditionalAnalysis
    );

    const userMessage = this.buildUserMessage(
      request.userQuery,
      consultationFacts,
      domainClassification,
      request.conversationHistory
    );

    const responseText = await this.callGeminiWithRetry(
      systemPrompt,
      userMessage,
      request.conversationHistory,
      persona,
      request.language || "te"
    );

    onChunk(responseText);

    return {
      role: "assistant",
      content: responseText,
      timestamp: new Date(),
      metadata: {
        queryDomain: domainClassification.domain,
        confidence: queryIntent.confidence,
        vedicGroundTruths,
        kpGroundTruths: vedicGroundTruths,
        traditionalAnalysis,
        persona
      }
    };
  }

  public buildSystemPrompt(
    domainClassification: any,
    queryIntent: any,
    vedicGroundTruths: VedicGroundTruths,
    persona: ConsultationPersona,
    language: "en" | "hi" | "te",
    birthData?: BirthDetails,
    horoscopeData?: any,
    traditionalAnalysis?: ComprehensiveVedicAnalysis
  ): string {
    if (persona === 'classical_jyotish' || persona === 'classical_parashari') {
      return buildTraditionalAIPrompt(
        birthData,
        horoscopeData,
        queryIntent?.rawQuery || '',
        language,
        traditionalAnalysis
      );
    }
    const unified = computeUnifiedKPGroundTruth(
      queryIntent?.rawQuery || queryIntent?.intent || 'general query',
      birthData || ({} as any),
      horoscopeData || {}
    );
    return buildUnifiedSystemPrompt(persona, unified);
  }

  private buildUserMessage(
    userQuery: string,
    facts: Record<string, any>,
    classification: any,
    conversationHistory: ConversationMessage[],
    language: "en" | "hi" | "te" = "te"
  ): string {
    let message = `USER QUERY: "${userQuery}"\n\n`;
    message += `PRE-COMPUTED ASTROLOGICAL FACTS:\n${JSON.stringify(facts, null, 2)}\n\n`;
    message += `DOMAIN FOCUS: ${classification.domain}\n`;
    message += `SUGGESTED ANALYSIS ANGLE: ${classification.analysisAngle}\n`;

    if (language === 'te') {
      message += `\n[MANDATORY INSTRUCTION: You MUST format the ENTIRE astrological analysis strictly in 100% fluent Telugu script (తెలుగు లిపి). Do NOT write English paragraphs.]\n`;
    }

    if (conversationHistory.length > 0) {
      message += `\nCONVERSATION CONTEXT (last 4 exchanges):\n`;
      conversationHistory.slice(-8).forEach(msg => {
        message += `${msg.role.toUpperCase()}: ${msg.content}\n`;
      });
    }

    return message;
  }

  private async callGeminiWithRetry(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: ConversationMessage[],
    persona: ConsultationPersona,
    language: "en" | "hi" | "te",
    maxRetries: number = 2
  ): Promise<string> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const fullPrompt = `${systemPrompt}\n\n${userMessage}`;

        const res = await fetch("/api/advanced-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: fullPrompt,
            systemInstructionOverride: systemPrompt,
            userQuery: userMessage,
            conversationHistory,
            persona,
            language
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.answer) {
            return data.answer;
          }
        } else if (res.status === 429 && attempt < maxRetries) {
          const backoff = Math.pow(2, attempt) * 1000;
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }
      } catch (err) {
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
      }
    }

    return this.generateFallbackConsultationResponse(userMessage);
  }

  public validateDataSafety(data: any): boolean {
    if (!data) return true;
    const forbiddenKeys = [
      "rawEphemeris",
      "coordinateMatrix"
    ];

    const dataKeys = JSON.stringify(data).toLowerCase();
    return !forbiddenKeys.some(key => dataKeys.includes(key.toLowerCase()));
  }

  public generateFallbackConsultationResponse(
    userMessage: string,
    birthData?: BirthDetails,
    horoscopeData?: any,
    language: "en" | "hi" | "te" = "te"
  ): string {
    const defaultBirthDetails: BirthDetails = birthData || {
      name: "Native",
      gender: "Male",
      date: new Date().toISOString().split('T')[0],
      time: "12:00",
      approximateTime: false,
      place: "Hyderabad",
      latitude: 17.385,
      longitude: 78.486,
      timezone: 5.5
    };

    const analysis = this.analyzeQuery(userMessage, defaultBirthDetails, horoscopeData);

    const isTe = language === 'te';
    const isHi = language === 'hi';

    if (isTe) {
      return `## ${analysis.metadata.queryType} విశ్లేషణ (Vedic Consultation)

### 1. జన్మ కుండలి వాగ్దానం (Natal Analysis)
- **లగ్నం**: ${analysis.natalAnalysis.lagnaSign} (అధిపతి: ${analysis.natalAnalysis.lagnaLord})
- **ముఖ్య భావాలు**: ${analysis.natalAnalysis.relevantHouses.map(h => `${h}వ భావం`).join(', ')}
- **భావ అధిపతులు**: ${analysis.natalAnalysis.houseLords.map(h => `${h.house}వ అధిపతి ${h.lord} (${h.strength.dignity})`).join('; ')}
- **తీర్పు**: **${analysis.natalAnalysis.verdict === 'strong' ? 'అనుకూలం' : analysis.natalAnalysis.verdict === 'delayed' ? 'ఆలస్యం / రూపాంతరం' : 'మిశ్రమం'}** — ${analysis.natalAnalysis.conclusion}

### 2. దశా ఫలితం (Dasha Activation)
- **ప్రస్తుత మహాదశ**: ${analysis.dashaAnalysis.md.lord} (లగ్నం నుండి ${analysis.dashaAnalysis.md.house}వ భావంలో)
- **ప్రస్తుత అంతర్దశ**: ${analysis.dashaAnalysis.ad.lord} (లగ్నం నుండి ${analysis.dashaAnalysis.ad.house}వ భావంలో)
- **దశల సంబంధం**: ${analysis.dashaAnalysis.dashaRelationships.length > 0 ? analysis.dashaAnalysis.dashaRelationships[0].description : 'సమతుల్య సంబంధం'}
- **తీర్పు**: **${analysis.dashaAnalysis.verdict === 'supportive' ? 'మద్దతుగా ఉంది' : analysis.dashaAnalysis.verdict === 'challenging' ? 'సవాలుతో కూడినది' : 'సాధారణం'}** — ${analysis.dashaAnalysis.conclusion}

### 3. గోచార స్థితి (Transit Condition w.r.t Moon)
- **చంద్ర రాశి**: ${analysis.transitAnalysis.moonSign}
- **శని గోచారం & సాడేసతి**: ${analysis.transitAnalysis.sadeSati.description}
- **గురు గోచారం**: ${analysis.transitAnalysis.transitJupiter.sign}లో (${analysis.transitAnalysis.transitJupiter.houseFromMoon}వ భావం). ${analysis.transitAnalysis.transitJupiter.aspectsRelevant ? 'లగ్న/భావాలపై శుభ దృష్టి ఉంది.' : ''}
- **తీర్పు**: **${analysis.transitAnalysis.verdict === 'confirming' ? 'గోచారం అనుకూలిస్తోంది' : 'జాగ్రత్త అవసరం'}**

---

### తుది తీర్పు & కాల నిర్ణయం (Final Verdict)
- **ఫలితం**: **${analysis.finalVerdict.verdict === 'Favourable' ? 'అనుకూలం (Favourable)' : analysis.finalVerdict.verdict === 'Delayed' ? 'ఆలస్యం (Delayed)' : 'మిశ్రమం (Mixed)'}**
- **సమయం**: **${analysis.finalVerdict.timeline}**
- **సూచన**: ${analysis.finalVerdict.summary}

### నివారణోపాయాలు (Remedies)
${analysis.finalVerdict.actionRecommendations.map(r => `- ${r}`).join('\n')}`;
    }

    if (isHi) {
      return `## ${analysis.metadata.queryType} विश्लेषण (Vedic Consultation)

### 1. जन्म कुंडली स्थिति (Natal Analysis)
- **लग्न**: ${analysis.natalAnalysis.lagnaSign} (स्वामी: ${analysis.natalAnalysis.lagnaLord})
- **प्रमुख भाव**: ${analysis.natalAnalysis.relevantHouses.map(h => `${h}वां भाव`).join(', ')}
- **भावेश स्थिति**: ${analysis.natalAnalysis.houseLords.map(h => `${h.house}वें भाव के स्वामी ${h.lord} (${h.strength.dignity})`).join('; ')}
- **निष्कर्ष**: **${analysis.natalAnalysis.verdict}** — ${analysis.natalAnalysis.conclusion}

### 2. दशा सक्रियता (Dasha Activation)
- **वर्तमान महादशा**: ${analysis.dashaAnalysis.md.lord} (लग्न से ${analysis.dashaAnalysis.md.house}वें भाव में)
- **वर्तमान अंतर्दशा**: ${analysis.dashaAnalysis.ad.lord} (लग्न से ${analysis.dashaAnalysis.ad.house}वें भाव में)
- **दशा संबंध**: ${analysis.dashaAnalysis.dashaRelationships.length > 0 ? analysis.dashaAnalysis.dashaRelationships[0].description : 'सामान्य स्थिति'}
- **निष्कर्ष**: **${analysis.dashaAnalysis.verdict}** — ${analysis.dashaAnalysis.conclusion}

### 3. गोचर स्थिति (Transit Condition w.r.t Moon)
- **चंद्र राशि**: ${analysis.transitAnalysis.moonSign}
- **शनि गोचर / साढ़ेसाती**: ${analysis.transitAnalysis.sadeSati.description}
- **बृहस्पति गोचर**: ${analysis.transitAnalysis.transitJupiter.sign} (चंद्रमा से ${analysis.transitAnalysis.transitJupiter.houseFromMoon}वां भाव)
- **निष्कर्ष**: **${analysis.transitAnalysis.verdict}**

---

### अंतिम निर्णय व समय (Final Verdict & Timing)
- **आकलन**: **${analysis.finalVerdict.verdict}**
- **समय सीमा**: **${analysis.finalVerdict.timeline}**
- **सारांश**: ${analysis.finalVerdict.summary}

### अनुशंसित उपाय (Remedies)
${analysis.finalVerdict.actionRecommendations.map(r => `- ${r}`).join('\n')}`;
    }

    return `## ${analysis.metadata.queryType} Analysis

### NATAL ANALYSIS
- **Ascendant (Lagna)**: ${analysis.natalAnalysis.lagnaSign} (Ruled by ${analysis.natalAnalysis.lagnaLord})
- **Relevant Houses**: Houses ${analysis.natalAnalysis.relevantHouses.join(', ')}
- **House Lords**: ${analysis.natalAnalysis.houseLords.map(h => `House ${h.house} Lord ${h.lord} in House ${h.housePosition} (${h.strength.dignity})`).join('; ')}
- **Conclusion**: ${analysis.natalAnalysis.conclusion} (Verdict: **${analysis.natalAnalysis.verdict.toUpperCase()}**)

### DASHA ANALYSIS
- **Current Mahadasha**: ${analysis.dashaAnalysis.md.lord} in House ${analysis.dashaAnalysis.md.house} from Ascendant
- **Current Antardasha**: ${analysis.dashaAnalysis.ad.lord} in House ${analysis.dashaAnalysis.ad.house} from Ascendant
- **Dasha Relationship**: ${analysis.dashaAnalysis.dashaRelationships.length > 0 ? analysis.dashaAnalysis.dashaRelationships[0].description : 'Harmonious'}
- **Conclusion**: ${analysis.dashaAnalysis.conclusion} (Verdict: **${analysis.dashaAnalysis.verdict.toUpperCase()}**)

### TRANSIT ANALYSIS
- **Natal Moon Sign**: ${analysis.transitAnalysis.moonSign}
- **Sade Sati**: ${analysis.transitAnalysis.sadeSati.active ? `Active (${analysis.transitAnalysis.sadeSati.phase})` : 'Inactive'} — ${analysis.transitAnalysis.sadeSati.description}
- **Jupiter Transit**: ${analysis.transitAnalysis.transitJupiter.sign} (House ${analysis.transitAnalysis.transitJupiter.houseFromMoon} from Moon)
- **Conclusion**: ${analysis.transitAnalysis.conclusion} (Verdict: **${analysis.transitAnalysis.verdict.toUpperCase()}**)

### FINAL VERDICT
- **Assessment**: **${analysis.finalVerdict.verdict}**
- **Timing**: **${analysis.finalVerdict.timeline}**
- **Direct Answer**: ${analysis.finalVerdict.summary}

### Recommended Actions
${analysis.finalVerdict.actionRecommendations.map(r => `- ${r}`).join('\n')}`;
  }
}
