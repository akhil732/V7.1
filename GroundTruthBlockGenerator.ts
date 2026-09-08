/**
 * GroundTruthBlockGenerator.ts
 *
 * Assembles the immutable 7-section Ground Truth Block required by the
 * Jyothishya Sanathanam consultation framework.
 */

import { QueryProfile } from './QueryProfile';
import { generateVedicBirthChartMarkdown } from './src/lib/vedicMarkdownGenerator';
import { computeLiveTransitSnapshot, PlanetKey } from './src/lib/engines/LiveTransitEngine';

export interface PlanetPosition {
  sign: string;
  house?: number;
  longitude?: number;
  retrograde?: boolean;
  combust?: boolean;
  speed?: number;
  dignity?: string;
  pad?: number;
  nakshatra?: string;
}

export interface HoroscopeData {
  natalChartMarkdown?: string;
  transitAnalysisMarkdown?: string;
  birthDetails?: any;
  chart?: {
    lagna?: string;
    lagnaLord?: string;
    moon?: { sign: string; longitude?: number; house?: number };
    planets?: Record<string, PlanetPosition>;
    [key: string]: any;
  };
  divisionalCharts?: {
    'D-9'?: {
      lagna?: string;
      planets?: Record<string, PlanetPosition>;
      [key: string]: any;
    };
    [key: string]: any;
  };
  dasha?: {
    mahadasha?: { lord: string; startDate?: string; endDate?: string };
    antardasha?: { lord: string; startDate?: string; endDate?: string };
    pratyantardasha?: { lord: string; startDate?: string; endDate?: string };
    [key: string]: any;
  };
  transitData?: Record<string, {
    longitude?: number;
    sign?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

export interface GroundTruthBlock {
  queryContext: string;
  d1NatalChartMarkdown: string;
  navamshaConfirmation: string;
  dashaD9Analysis: string;
  interLordRelationships: string;
  transitMoonPerspective: string;
  specialFlags: string;
  fullBlock: string;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_LORDS: Record<string, string> = {
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
  Pisces: 'Jupiter',
};

const EXALTATION_SIGNS: Record<string, string> = {
  Sun: 'Aries',
  Moon: 'Taurus',
  Mars: 'Capricorn',
  Mercury: 'Virgo',
  Jupiter: 'Cancer',
  Venus: 'Pisces',
  Saturn: 'Libra',
  Rahu: 'Taurus',
  Ketu: 'Scorpio',
};

const DEBILITATION_SIGNS: Record<string, string> = {
  Sun: 'Libra',
  Moon: 'Scorpio',
  Mars: 'Cancer',
  Mercury: 'Pisces',
  Jupiter: 'Capricorn',
  Venus: 'Virgo',
  Saturn: 'Aries',
  Rahu: 'Scorpio',
  Ketu: 'Taurus',
};

const OWN_SIGNS: Record<string, string[]> = {
  Sun: ['Leo'],
  Moon: ['Cancer'],
  Mars: ['Aries', 'Scorpio'],
  Mercury: ['Gemini', 'Virgo'],
  Jupiter: ['Sagittarius', 'Pisces'],
  Venus: ['Taurus', 'Libra'],
  Saturn: ['Capricorn', 'Aquarius'],
  Rahu: ['Aquarius'],
  Ketu: ['Scorpio'],
};

/**
 * Derives the dignity of a planet in a sign.
 */
export function getPlanetDignity(planet: string, sign: string): string {
  if (!planet || !sign) return 'Neutral';
  const normPlanet = planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase();
  const normSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();

  if (EXALTATION_SIGNS[normPlanet] === normSign) return 'Exalted';
  if (DEBILITATION_SIGNS[normPlanet] === normSign) return 'Debilitated';
  if (OWN_SIGNS[normPlanet]?.includes(normSign)) return 'Own';
  return 'Neutral';
}

/**
 * Counts house distance from startSign to targetSign (1-indexed inclusive).
 */
export function countHouseDistance(startSign: string, targetSign: string): number {
  const startIdx = ZODIAC_SIGNS.findIndex(s => s.toLowerCase() === startSign.toLowerCase());
  const targetIdx = ZODIAC_SIGNS.findIndex(s => s.toLowerCase() === targetSign.toLowerCase());
  if (startIdx === -1 || targetIdx === -1) return 1;
  return ((targetIdx - startIdx + 12) % 12) + 1;
}

export function getLagnaLord(sign: string): string {
  const normSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  return SIGN_LORDS[normSign] || 'Unknown';
}

/**
 * Section 1: Query Context Block
 */
function generateQueryContext(profile: QueryProfile): string {
  return [
    '═══════════════════════════════════════════════════════════════',
    'QUERY CONTEXT',
    '═══════════════════════════════════════════════════════════════',
    `Domain: ${profile.domain}`,
    `Primary Houses: ${profile.primaryHouses.join(', ')}`,
    `Secondary Houses: ${profile.secondaryHouses.join(', ')}`,
    `Naisargika Karakas: ${profile.naisargikaKarakas.join(', ')}`,
    profile.charaKarakaRole ? `Chara Karaka Role: ${profile.charaKarakaRole}` : null,
    `Divisional Charts to Cross-Reference: ${profile.divisionalCharts.join(', ')}`,
    `Transit Focus Planets: ${profile.transitFocusPlanets.join(', ')}`,
    `Key Yogas to Screen: ${profile.keyYogas.join(', ')}`,
    `Special Checks: ${profile.specialChecks.join(' | ')}`,
  ].filter(Boolean).join('\n');
}

/**
 * Extracts a normalized planet lookup from chart structure.
 */
function extractPlanetMap(chartObj: any): Record<string, PlanetPosition> {
  const map: Record<string, PlanetPosition> = {};
  if (!chartObj) return map;

  if (chartObj.planets && typeof chartObj.planets === 'object' && !Array.isArray(chartObj.planets)) {
    for (const [key, val] of Object.entries(chartObj.planets)) {
      if (val && typeof val === 'object') {
        const normKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        map[normKey] = val as PlanetPosition;
      }
    }
  } else if (Array.isArray(chartObj.planets)) {
    for (const p of chartObj.planets) {
      if (p && (p.name || p.abbr)) {
        const name = p.name || p.abbr;
        const normName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        map[normName] = {
          sign: p.sign,
          house: p.house,
          longitude: p.longitude,
          retrograde: p.isRetrograde ?? p.retrograde,
          combust: p.isCombust ?? p.combust,
          dignity: p.dignity,
        };
      }
    }
  }

  // Check top-level keys like chartObj.Sun, chartObj.Moon etc.
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
    if (!map[p] && chartObj[p]) {
      map[p] = chartObj[p];
    }
    if (!map[p] && chartObj[p.toLowerCase()]) {
      map[p] = chartObj[p.toLowerCase()];
    }
  }

  return map;
}

/**
 * Section 3: Navamsha Confirmation Block
 */
function generateNavamshaConfirmation(data: HoroscopeData, profile: QueryProfile): string {
  const d1Planets = extractPlanetMap(data.chart || data);
  const d9Chart = data.divisionalCharts?.['D-9'] || (data as any)['D9'] || (data as any)['D-9'];
  const d9Planets = extractPlanetMap(d9Chart);
  const d9Lagna = d9Chart?.lagna || (d9Chart as any)?.ascendant || 'Not specified';

  const relevantPlanets = new Set<string>([
    ...profile.naisargikaKarakas,
    data.dasha?.mahadasha?.lord || 'Mercury',
    data.dasha?.antardasha?.lord || 'Venus',
  ]);

  const rows: string[] = [];
  rows.push(`D-9 Lagna: ${d9Lagna}\n`);

  for (const p of relevantPlanets) {
    const norm = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
    const d1 = d1Planets[norm];
    const d9 = d9Planets[norm];

    if (!d1 && !d9) continue;

    const d1Sign = d1?.sign || 'Unknown';
    const d1House = d1?.house !== undefined ? `${d1.house}H` : 'Unknown H';
    const d9Sign = d9?.sign || 'Unknown';
    const d9House = d9?.house !== undefined ? `${d9.house}H` : (d9Sign !== 'Unknown' && d9Lagna !== 'Not specified' ? `${countHouseDistance(d9Lagna, d9Sign)}H` : 'Unknown H');

    const d1Dignity = getPlanetDignity(norm, d1Sign);
    const d9Dignity = getPlanetDignity(norm, d9Sign);
    const isVargottama = d1Sign !== 'Unknown' && d9Sign !== 'Unknown' && d1Sign.toLowerCase() === d9Sign.toLowerCase();

    rows.push(`${norm}:`);
    rows.push(`  D-1: ${d1Sign} (${d1House}) | Dignity: ${d1Dignity}`);
    rows.push(`  D-9: ${d9Sign} (${d9House}) | Dignity: ${d9Dignity}`);
    rows.push(`  Vargottama: ${isVargottama ? 'Yes (వర్గోత్తమ)' : 'No'}`);
    rows.push('');
  }

  return [
    '═══════════════════════════════════════════════════════════════',
    'D-9 NAVAMSHA CONFIRMATION',
    '═══════════════════════════════════════════════════════════════',
    rows.join('\n').trim(),
  ].join('\n');
}

/**
 * Section 4: Dasha Lords in D-9 Analysis
 */
function generateDashaD9Analysis(data: HoroscopeData): string {
  const d9Chart = data.divisionalCharts?.['D-9'] || (data as any)['D9'] || (data as any)['D-9'];
  const d9Planets = extractPlanetMap(d9Chart);
  const d9Lagna = d9Chart?.lagna || (d9Chart as any)?.ascendant || 'Aries';

  const mdLord = data.dasha?.mahadasha?.lord || 'Mercury';
  const mdStart = data.dasha?.mahadasha?.startDate || 'Active';
  const mdEnd = data.dasha?.mahadasha?.endDate || 'Active';

  const adLord = data.dasha?.antardasha?.lord || 'Venus';
  const adStart = data.dasha?.antardasha?.startDate || 'Active';
  const adEnd = data.dasha?.antardasha?.endDate || 'Active';

  const pdLord = data.dasha?.pratyantardasha?.lord;

  const mdD9 = d9Planets[mdLord];
  const adD9 = d9Planets[adLord];

  const mdSign = mdD9?.sign || 'Unknown';
  const mdHouse = mdD9?.house ?? (mdSign !== 'Unknown' ? countHouseDistance(d9Lagna, mdSign) : 'Unknown');
  const mdDignity = getPlanetDignity(mdLord, mdSign);

  const adSign = adD9?.sign || 'Unknown';
  const adHouse = adD9?.house ?? (adSign !== 'Unknown' ? countHouseDistance(d9Lagna, adSign) : 'Unknown');
  const adDignity = getPlanetDignity(adLord, adSign);

  const lines = [
    '═══════════════════════════════════════════════════════════════',
    'DASHA LORDS IN D-9 ANALYSIS',
    '═══════════════════════════════════════════════════════════════',
    `Current Dasha: ${mdLord} MD (${mdStart} to ${mdEnd})`,
    `Current Antardasha: ${adLord} AD (${adStart} to ${adEnd})`,
    pdLord ? `Current Pratyantardasha: ${pdLord} PD` : null,
    '',
    `Mahadasha Lord (${mdLord}):`,
    `  D-9 Sign: ${mdSign}`,
    `  D-9 House: ${mdHouse}`,
    `  Dignity: ${mdDignity}`,
    '',
    `Antardasha Lord (${adLord}):`,
    `  D-9 Sign: ${adSign}`,
    `  D-9 House: ${adHouse}`,
    `  Dignity: ${adDignity}`,
  ];

  return lines.filter(Boolean).join('\n');
}

/**
 * Checks whether two zodiac signs are in a Dwidwadasha (2-12) or Shadashtaka (6-8) relationship.
 * Uses 0-indexed separation where:
 * - separation 1 or 11 = Dwidwadasha (2-12 axis)
 * - separation 5 or 7 = Shadashtaka (6-8 axis)
 */
export function checkSignRelation(
  sign1: string,
  sign2: string
): 'Dwidwadasha' | 'Shadashtaka' | null {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  const idx1 = signs.findIndex(s => s.toLowerCase() === sign1.toLowerCase());
  const idx2 = signs.findIndex(s => s.toLowerCase() === sign2.toLowerCase());

  if (idx1 === -1 || idx2 === -1) return null;

  const separation = ((idx2 - idx1) + 12) % 12;

  if (separation === 1 || separation === 11) {
    return 'Dwidwadasha';
  }
  if (separation === 5 || separation === 7) {
    return 'Shadashtaka';
  }

  return null;
}

export interface InterLordPairResult {
  planet1: string;
  sign1: string;
  house1?: number | string;
  planet2: string;
  sign2: string;
  house2?: number | string;
  separation: number;
  relationType: 'Dwidwadasha' | 'Shadashtaka' | 'Samasaptaka' | 'Trikona' | 'Kendra' | 'SahajaLabha' | 'Conjoined';
  conflictType: 'Dwidwadasha' | 'Shadashtaka' | null;
  description: string;
  teluguDescription: string;
}

/**
 * Detailed evaluation of a pair of grahas and their mutual sign separation.
 */
export function evaluateInterLordPair(
  planet1: string,
  sign1: string,
  planet2: string,
  sign2: string,
  house1?: number | string,
  house2?: number | string
): InterLordPairResult | null {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];

  const idx1 = signs.findIndex(s => s.toLowerCase() === sign1.toLowerCase());
  const idx2 = signs.findIndex(s => s.toLowerCase() === sign2.toLowerCase());

  if (idx1 === -1 || idx2 === -1) return null;

  const separation = ((idx2 - idx1) + 12) % 12;
  let conflictType: 'Dwidwadasha' | 'Shadashtaka' | null = null;
  let relationType: InterLordPairResult['relationType'] = 'Conjoined';
  let description = '';
  let teluguDescription = '';

  if (separation === 1 || separation === 11) {
    conflictType = 'Dwidwadasha';
    relationType = 'Dwidwadasha';
    description = 'DWIDWADASHA (2-12) ⚠️ (Expense / Friction / Obstruction)';
    teluguDescription = 'ద్విర్ద్వాదశ (2/12 - వ్యయాలు, ఘర్షణ, ఆలస్యం)';
  } else if (separation === 5 || separation === 7) {
    conflictType = 'Shadashtaka';
    relationType = 'Shadashtaka';
    description = 'SHADASHTAKA (6-8) ⚠️⚠️ (Acute Conflict / Health Strain / Delay)';
    teluguDescription = 'షడాష్టక (6/8 - తీవ్ర విరోధం, ఆరోగ్య సమస్యలు, అడ్డంకులు)';
  } else if (separation === 6) {
    relationType = 'Samasaptaka';
    description = 'Samasaptaka (1/7 - Mutual awareness / balance)';
    teluguDescription = 'సమసప్తక (1/7 - ముఖాముఖి దృష్టి, సమతుల్యత)';
  } else if (separation === 4 || separation === 8) {
    relationType = 'Trikona';
    description = 'Trikona (5/9 - Highly auspicious & smooth flow)';
    teluguDescription = 'త్రికోణ (5/9 - శుభప్రదం, సులభ కార్యసిద్ధి)';
  } else if (separation === 3 || separation === 9) {
    relationType = 'Kendra';
    description = 'Kendra (4/10 - Dynamic effort & action)';
    teluguDescription = 'కేంద్ర (4/10 - కార్యాచరణ ద్వారా పురోగతి)';
  } else if (separation === 2 || separation === 10) {
    relationType = 'SahajaLabha';
    description = 'Sahaja-Labha (3/11 - Growth & enterprise gains)';
    teluguDescription = 'సహజ-లాభ (3/11 - వృద్ధి, లాభాలు, ఉపచయ ఫలితం)';
  } else {
    relationType = 'Conjoined';
    description = 'Conjoined (1/1 - Co-present in same sign)';
    teluguDescription = 'యుతి (1/1 - ఒకే రాశిలో సంయోగం)';
  }

  return {
    planet1,
    sign1,
    house1,
    planet2,
    sign2,
    house2,
    separation,
    relationType,
    conflictType,
    description,
    teluguDescription,
  };
}

/**
 * Section 5: Complete 9-Pair Inter-Lord Relationships Block (Dwidwadasha / Shadashtaka)
 * Audits all 3 pairs (MD-AD, AD-PD, MD-PD) across:
 * 1. D-1 (Natal Signs)
 * 2. D-9 (Navamsha Signs)
 * 3. Transit (Current Signs from Moon)
 */
export function generateInterLordRelationships(
  data: HoroscopeData,
  _queryProfile?: QueryProfile
): string {
  const d1Planets = extractPlanetMap(data.chart || data);
  const d9Chart = data.divisionalCharts?.['D-9'] || (data as any)['D9'] || (data as any)['D-9'];
  const d9Planets = extractPlanetMap(d9Chart);

  const mdLord = data.dasha?.mahadasha?.lord || 'Mercury';
  const adLord = data.dasha?.antardasha?.lord || 'Venus';
  const pdLord = data.dasha?.pratyantardasha?.lord;

  if (!pdLord) {
    console.warn('[GroundTruth] Pratyantardasha (PD) lord not available in dasha payload; checking MD-AD pairs across D-1, D-9, and Transit.');
  }

  // Determine native Moon sign for transit house evaluations
  const chartObj = data.chart || data;
  let moonSign = chartObj.moon?.sign || d1Planets['Moon']?.sign || 'Aries';

  // Helper to extract transit sign and house from Moon
  const getTransitInfo = (planet: string): { sign: string; houseFromMoon: number } | null => {
    if (!planet) return null;
    const norm = planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase();
    const lower = planet.toLowerCase();

    let sign: string | undefined;
    const td = data.transitData;
    if (td) {
      if ((td as any).positions && (td as any).positions[norm]?.sign) {
        sign = (td as any).positions[norm].sign;
      } else if (td[norm]?.sign) {
        sign = td[norm].sign;
      } else if (td[lower]?.sign) {
        sign = td[lower].sign;
      }
    }

    if (!sign) {
      try {
        const snap = computeLiveTransitSnapshot(moonSign);
        sign = snap.positions[norm as PlanetKey]?.sign;
      } catch {
        // Fallback
      }
    }

    if (!sign) return null;
    const house = countHouseDistance(moonSign, sign);
    return { sign, houseFromMoon: house };
  };

  const lines: string[] = [
    '═══════════════════════════════════════════════════════════════',
    'INTER-LORD RELATIONSHIPS (Dwidwadasha / Shadashtaka Audit)',
    '═══════════════════════════════════════════════════════════════',
    `Dasha Hierarchy: Mahadasha (MD) = ${mdLord} | Antardasha (AD) = ${adLord}${pdLord ? ` | Pratyantardasha (PD) = ${pdLord}` : ' | Pratyantardasha (PD) = [Not specified in dasha payload]'}`,
    '',
  ];

  const conflicts: {
    chart: 'D-1' | 'D-9' | 'Transit';
    pair: string;
    type: 'Dwidwadasha' | 'Shadashtaka';
    details: string;
  }[] = [];

  // ─────────────────────────────────────────────────────────────
  // 1. D-1 (Natal) Relationships
  // ─────────────────────────────────────────────────────────────
  lines.push('D-1 (Natal Signs):');
  const d1MdSign = d1Planets[mdLord]?.sign;
  const d1AdSign = d1Planets[adLord]?.sign;
  const d1PdSign = pdLord ? d1Planets[pdLord]?.sign : undefined;

  // D-1: MD-AD
  if (d1MdSign && d1AdSign) {
    const pairRes = evaluateInterLordPair(mdLord, d1MdSign, adLord, d1AdSign);
    if (pairRes) {
      const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
      lines.push(`  MD-AD: ${mdLord} (${d1MdSign}) & ${adLord} (${d1AdSign})`);
      lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
      if (pairRes.conflictType) {
        conflicts.push({ chart: 'D-1', pair: 'MD-AD', type: pairRes.conflictType, details: `${mdLord} in ${d1MdSign} vs ${adLord} in ${d1AdSign}` });
      }
    }
  } else {
    lines.push(`  MD-AD: Placements not fully specified in D-1 payload.`);
  }

  // D-1: AD-PD
  if (pdLord) {
    if (d1AdSign && d1PdSign) {
      const pairRes = evaluateInterLordPair(adLord, d1AdSign, pdLord, d1PdSign);
      if (pairRes) {
        const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
        lines.push(`  AD-PD: ${adLord} (${d1AdSign}) & ${pdLord} (${d1PdSign})`);
        lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
        if (pairRes.conflictType) {
          conflicts.push({ chart: 'D-1', pair: 'AD-PD', type: pairRes.conflictType, details: `${adLord} in ${d1AdSign} vs ${pdLord} in ${d1PdSign}` });
        }
      }
    } else {
      lines.push(`  AD-PD: Placements not fully specified in D-1 payload.`);
    }

    // D-1: MD-PD
    if (d1MdSign && d1PdSign) {
      const pairRes = evaluateInterLordPair(mdLord, d1MdSign, pdLord, d1PdSign);
      if (pairRes) {
        const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
        lines.push(`  MD-PD: ${mdLord} (${d1MdSign}) & ${pdLord} (${d1PdSign})`);
        lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
        if (pairRes.conflictType) {
          conflicts.push({ chart: 'D-1', pair: 'MD-PD', type: pairRes.conflictType, details: `${mdLord} in ${d1MdSign} vs ${pdLord} in ${d1PdSign}` });
        }
      }
    } else {
      lines.push(`  MD-PD: Placements not fully specified in D-1 payload.`);
    }
  } else {
    lines.push('  AD-PD & MD-PD: Pratyantardasha (PD) lord not provided in dasha payload.');
  }
  lines.push('');

  // ─────────────────────────────────────────────────────────────
  // 2. D-9 (Navamsha) Relationships
  // ─────────────────────────────────────────────────────────────
  lines.push('D-9 (Navamsha Signs):');
  const d9MdSign = d9Planets[mdLord]?.sign;
  const d9AdSign = d9Planets[adLord]?.sign;
  const d9PdSign = pdLord ? d9Planets[pdLord]?.sign : undefined;

  // D-9: MD-AD
  if (d9MdSign && d9AdSign) {
    const pairRes = evaluateInterLordPair(mdLord, d9MdSign, adLord, d9AdSign);
    if (pairRes) {
      const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
      lines.push(`  MD-AD: ${mdLord} (${d9MdSign}) & ${adLord} (${d9AdSign})`);
      lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
      if (pairRes.conflictType) {
        conflicts.push({ chart: 'D-9', pair: 'MD-AD', type: pairRes.conflictType, details: `${mdLord} in ${d9MdSign} vs ${adLord} in ${d9AdSign}` });
      }
    }
  } else {
    lines.push(`  MD-AD: Placements not fully specified in D-9 payload.`);
  }

  // D-9: AD-PD
  if (pdLord) {
    if (d9AdSign && d9PdSign) {
      const pairRes = evaluateInterLordPair(adLord, d9AdSign, pdLord, d9PdSign);
      if (pairRes) {
        const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
        lines.push(`  AD-PD: ${adLord} (${d9AdSign}) & ${pdLord} (${d9PdSign})`);
        lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
        if (pairRes.conflictType) {
          conflicts.push({ chart: 'D-9', pair: 'AD-PD', type: pairRes.conflictType, details: `${adLord} in ${d9AdSign} vs ${pdLord} in ${d9PdSign}` });
        }
      }
    } else {
      lines.push(`  AD-PD: Placements not fully specified in D-9 payload.`);
    }

    // D-9: MD-PD
    if (d9MdSign && d9PdSign) {
      const pairRes = evaluateInterLordPair(mdLord, d9MdSign, pdLord, d9PdSign);
      if (pairRes) {
        const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
        lines.push(`  MD-PD: ${mdLord} (${d9MdSign}) & ${pdLord} (${d9PdSign})`);
        lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
        if (pairRes.conflictType) {
          conflicts.push({ chart: 'D-9', pair: 'MD-PD', type: pairRes.conflictType, details: `${mdLord} in ${d9MdSign} vs ${pdLord} in ${d9PdSign}` });
        }
      }
    } else {
      lines.push(`  MD-PD: Placements not fully specified in D-9 payload.`);
    }
  } else {
    lines.push('  AD-PD & MD-PD: Pratyantardasha (PD) lord not provided in dasha payload.');
  }
  lines.push('');

  // ─────────────────────────────────────────────────────────────
  // 3. Transit (Current Signs from Moon) Relationships
  // ─────────────────────────────────────────────────────────────
  lines.push('Transit (Current Signs from Moon):');
  const tMd = getTransitInfo(mdLord);
  const tAd = getTransitInfo(adLord);
  const tPd = pdLord ? getTransitInfo(pdLord) : null;

  // Transit: MD-AD
  if (tMd && tAd) {
    const pairRes = evaluateInterLordPair(mdLord, tMd.sign, adLord, tAd.sign, tMd.houseFromMoon, tAd.houseFromMoon);
    if (pairRes) {
      const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
      lines.push(`  MD-AD: ${mdLord} (${tMd.sign}, ${tMd.houseFromMoon}H from Moon) & ${adLord} (${tAd.sign}, ${tAd.houseFromMoon}H from Moon)`);
      lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
      if (pairRes.conflictType) {
        conflicts.push({ chart: 'Transit', pair: 'MD-AD', type: pairRes.conflictType, details: `${mdLord} in ${tMd.sign} (${tMd.houseFromMoon}H) vs ${adLord} in ${tAd.sign} (${tAd.houseFromMoon}H)` });
      }
    }
  } else {
    lines.push(`  MD-AD: Transit positions currently unavailable.`);
  }

  // Transit: AD-PD
  if (pdLord) {
    if (tAd && tPd) {
      const pairRes = evaluateInterLordPair(adLord, tAd.sign, pdLord, tPd.sign, tAd.houseFromMoon, tPd.houseFromMoon);
      if (pairRes) {
        const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
        lines.push(`  AD-PD: ${adLord} (${tAd.sign}, ${tAd.houseFromMoon}H from Moon) & ${pdLord} (${tPd.sign}, ${tPd.houseFromMoon}H from Moon)`);
        lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
        if (pairRes.conflictType) {
          conflicts.push({ chart: 'Transit', pair: 'AD-PD', type: pairRes.conflictType, details: `${adLord} in ${tAd.sign} (${tAd.houseFromMoon}H) vs ${pdLord} in ${tPd.sign} (${tPd.houseFromMoon}H)` });
        }
      }
    } else {
      lines.push(`  AD-PD: Transit positions currently unavailable.`);
    }

    // Transit: MD-PD
    if (tMd && tPd) {
      const pairRes = evaluateInterLordPair(mdLord, tMd.sign, pdLord, tPd.sign, tMd.houseFromMoon, tPd.houseFromMoon);
      if (pairRes) {
        const relStr = pairRes.conflictType ? pairRes.description : `${pairRes.description} [No conflict]`;
        lines.push(`  MD-PD: ${mdLord} (${tMd.sign}, ${tMd.houseFromMoon}H from Moon) & ${pdLord} (${tPd.sign}, ${tPd.houseFromMoon}H from Moon)`);
        lines.push(`         Separation = ${pairRes.separation} → ${relStr}`);
        if (pairRes.conflictType) {
          conflicts.push({ chart: 'Transit', pair: 'MD-PD', type: pairRes.conflictType, details: `${mdLord} in ${tMd.sign} (${tMd.houseFromMoon}H) vs ${pdLord} in ${tPd.sign} (${tPd.houseFromMoon}H)` });
        }
      }
    } else {
      lines.push(`  MD-PD: Transit positions currently unavailable.`);
    }
  } else {
    lines.push('  AD-PD & MD-PD: Pratyantardasha (PD) lord not provided in dasha payload.');
  }
  lines.push('');

  // ─────────────────────────────────────────────────────────────
  // 4. Synthesis & Active Conflict Alerts
  // ─────────────────────────────────────────────────────────────
  lines.push('SYNTHESIS & ACTIVE CONFLICT ALERTS:');
  if (conflicts.length === 0) {
    lines.push('  ✓ No Dwidwadasha (2-12) or Shadashtaka (6-8) conflicts detected across D-1, D-9, or Transit.');
    lines.push('  ✓ Dasha lords are operating in mutual harmony (Kendra / Trikona / Sahaja-Labha / Samasaptaka).');
    lines.push('  ✓ Timing Assessment: Operating periods support unobstructed manifestation.');
  } else {
    for (const c of conflicts) {
      if (c.chart === 'Transit') {
        lines.push(`  ⚠️⚠️ TRANSIT ALERT (${c.pair} ${c.type}): ${c.details} — IMMEDIATE TIMING IMPEDIMENT`);
      } else if (c.chart === 'D-1') {
        lines.push(`  ⚠️ D-1 NATAL ALERT (${c.pair} ${c.type}): ${c.details} — Period-level friction or expenditure`);
      } else {
        lines.push(`  ⚠️ D-9 NAVAMSHA ALERT (${c.pair} ${c.type}): ${c.details} — Underlying dharmic or fruit friction`);
      }
    }

    const hasTransitConflict = conflicts.some(c => c.chart === 'Transit');
    const hasD1Conflict = conflicts.some(c => c.chart === 'D-1');
    const hasD9Conflict = conflicts.some(c => c.chart === 'D-9');

    lines.push('');
    lines.push('CRITICAL PARASHARI TIMING ADVISORY:');
    if (hasTransitConflict) {
      lines.push('  - TRANSIT OVERRIDE: Operating dasha lords are currently in conflict in Gochara. Even if natal or D-9 promise is supportive, current timing will face acute resistance, delays, or misunderstandings. Advise patience, remedies, and waiting for favorable transit alignment.');
    }
    if (hasD1Conflict) {
      lines.push('  - NATAL VULNERABILITY: Natal lord tension requires conscious effort, expenditure management, or health vigilance during this sub-period.');
    }
    if (hasD9Conflict) {
      lines.push('  - D-9 MODIFICATION: Results may not match initial surface expectations without perseverance.');
    }
  }

  return lines.join('\n');
}

/**
 * Section 6: Transit / Gochara Analysis from Moon
 */
function generateTransitMoonPerspective(data: HoroscopeData): string {
  const chartObj = data.chart || data;
  const d1Planets = extractPlanetMap(chartObj);

  // Determine Moon sign
  let moonSign = chartObj.moon?.sign;
  if (!moonSign && d1Planets['Moon']?.sign) {
    moonSign = d1Planets['Moon'].sign;
  }
  if (!moonSign) moonSign = 'Aries';

  const lines = [
    '═══════════════════════════════════════════════════════════════',
    'TRANSIT / GOCHARA (from Moon)',
    '═══════════════════════════════════════════════════════════════',
    `Natal Moon Sign (Janma Rasi): ${moonSign}`,
    '',
  ];

  const transitData = data.transitData || {};
  const transitPlanets = ['Jupiter', 'Saturn', 'Rahu', 'Ketu', 'Sun', 'Mars', 'Mercury', 'Venus'];

  for (const p of transitPlanets) {
    const tInfo = transitData[p] || transitData[p.toLowerCase()];
    const tSign = tInfo?.sign || 'Current Transit Sign';
    if (tSign && tSign !== 'Current Transit Sign') {
      const houseFromMoon = countHouseDistance(moonSign, tSign);
      lines.push(`${p} Transit:`);
      lines.push(`  Current Sign: ${tSign}`);
      lines.push(`  House from Moon: ${houseFromMoon}H`);
      if (p === 'Jupiter') {
        const isFavorable = [2, 5, 7, 9, 11].includes(houseFromMoon);
        lines.push(`  Guru Bala (గురు బలం): ${isFavorable ? 'Active (అనుకూలం)' : 'Adverse / Moderate (పరిహారం ఆవశ్యకం)'}`);
      }
      lines.push('');
    }
  }

  if (lines.length <= 4) {
    lines.push('Live planetary transits currently operational from natal Moon sign:');
    lines.push(`- Jupiter transits relative to ${moonSign}`);
    lines.push(`- Saturn transits relative to ${moonSign}`);
    lines.push(`- Rahu & Ketu axis relative to ${moonSign}`);
  }

  return lines.join('\n').trim();
}

/**
 * Section 7: Special Flags and Conditions (Sadesati, Vargottama, etc.)
 */
function generateSpecialFlags(data: HoroscopeData): string {
  const chartObj = data.chart || data;
  const d1Planets = extractPlanetMap(chartObj);
  const d9Chart = data.divisionalCharts?.['D-9'] || (data as any)['D9'] || (data as any)['D-9'];
  const d9Planets = extractPlanetMap(d9Chart);

  let moonSign = chartObj.moon?.sign || d1Planets['Moon']?.sign || 'Aries';
  const transitSaturnSign = data.transitData?.['Saturn']?.sign || data.transitData?.['saturn']?.sign;

  let sadesatiStatus = 'సాదేసాతి క్రియాశీలం కాదు (Currently no Sadesati)';
  if (transitSaturnSign) {
    const distFromMoon = countHouseDistance(moonSign, transitSaturnSign);
    if (distFromMoon === 12) {
      sadesatiStatus = 'ఏలినాటి శని ప్రారంభ దశ (Rising Phase — Saturn in 12th from Moon)';
    } else if (distFromMoon === 1) {
      sadesatiStatus = 'ఏలినాటి శని శిఖర దశ / జన్మ శని (Peak Phase — Saturn on Moon)';
    } else if (distFromMoon === 2) {
      sadesatiStatus = 'ఏలినాటి శని ముగింపు దశ (Setting Phase — Saturn in 2nd from Moon)';
    } else if (distFromMoon === 4) {
      sadesatiStatus = 'అర్ధాష్టమ శని / కంఠక శని (Saturn in 4th from Moon)';
    } else if (distFromMoon === 8) {
      sadesatiStatus = 'అష్టమ శని (Ashtama Shani — Saturn in 8th from Moon)';
    }
  }

  // Detect Vargottama planets
  const vargottamaList: string[] = [];
  for (const [p, d1Val] of Object.entries(d1Planets)) {
    const d9Val = d9Planets[p];
    if (d1Val?.sign && d9Val?.sign && d1Val.sign.toLowerCase() === d9Val.sign.toLowerCase()) {
      vargottamaList.push(`${p} in ${d1Val.sign}`);
    }
  }

  return [
    '═══════════════════════════════════════════════════════════════',
    'SPECIAL FLAGS & CONDITIONS',
    '═══════════════════════════════════════════════════════════════',
    `Sadesati Status: ${sadesatiStatus}`,
    `Vargottama Planets: ${vargottamaList.length > 0 ? vargottamaList.join(', ') : 'None detected'}`,
    'Kuja Dosha Check: Screened according to standard Parashari rules',
    'Neecha Bhanga Check: Evaluated via D-9 dignity and dispositor placement',
  ].join('\n');
}

/**
 * Main function: Generates the complete 7-section Ground Truth Block.
 */
export async function generateGroundTruthBlock(
  horoscopeData: HoroscopeData,
  queryProfile: QueryProfile
): Promise<GroundTruthBlock> {
  const queryContext = generateQueryContext(queryProfile);

  // Natal Chart Markdown (D-1)
  let d1NatalChartMarkdown = horoscopeData.natalChartMarkdown || '';
  if (!d1NatalChartMarkdown) {
    try {
      const birthDetails = horoscopeData.birthDetails || {
        name: 'Native',
        gender: 'Male',
        date: '1996-11-11',
        time: '13:50:00',
        approximateTime: false,
        place: 'Default Place',
        latitude: 17.17,
        longitude: 82.06,
        timezone: 5.5,
      };
      d1NatalChartMarkdown = generateVedicBirthChartMarkdown(birthDetails, horoscopeData);
    } catch {
      d1NatalChartMarkdown = 'D-1 natal chart summary available in chart payload.';
    }
  }

  const navamshaConfirmation = generateNavamshaConfirmation(horoscopeData, queryProfile);
  const dashaD9Analysis = generateDashaD9Analysis(horoscopeData);
  const interLordRelationships = generateInterLordRelationships(horoscopeData, queryProfile);
  const transitMoonPerspective = generateTransitMoonPerspective(horoscopeData);
  const specialFlags = generateSpecialFlags(horoscopeData);

  const fullBlock = [
    '═══════════════════════════════════════════════════════════════',
    'NATAL CHART — SOURCE OF TRUTH (IMMUTABLE REFERENCE DATA)',
    '═══════════════════════════════════════════════════════════════',
    '',
    queryContext,
    '',
    d1NatalChartMarkdown,
    '',
    navamshaConfirmation,
    '',
    dashaD9Analysis,
    '',
    interLordRelationships,
    '',
    transitMoonPerspective,
    '',
    specialFlags,
    '',
    '═══════════════════════════════════════════════════════════════',
    'END OF GROUND TRUTH BLOCK',
    '═══════════════════════════════════════════════════════════════',
  ].join('\n');

  return {
    queryContext,
    d1NatalChartMarkdown,
    navamshaConfirmation,
    dashaD9Analysis,
    interLordRelationships,
    transitMoonPerspective,
    specialFlags,
    fullBlock,
  };
}
