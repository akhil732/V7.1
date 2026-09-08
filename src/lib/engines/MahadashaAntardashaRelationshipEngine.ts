/**
 * MahadashaAntardashaRelationshipEngine.ts
 *
 * Core engine for detecting Dwidwadasha (2-12) and Shadashtaka (6-8)
 * relationships between Mahadasha and Antardasha (and Pratyantardasha) lords
 * across three chart layers:
 *   1. D-1 (Natal) — structural/lifetime checks
 *   2. D-9 (Navamsha) — dharmic/subtle checks (marriage-timing context)
 *   3. Transit (Gochara from Moon) — real-time activation checks
 *
 * Used by:
 *   - GroundTruthBlockGenerator.ts (exports this as Section 5)
 *   - useAdvancedAIChat.ts hook (feeds into AI system prompt)
 *   - AdvancedAITab.tsx (renders as context badge)
 *
 * Key principle: Sign-to-sign sequential counting (1-indexed, 1–12).
 * Separation formula: sep = ((targetSignIdx - sourceSignIdx) + 12) % 12
 * where:
 *   - sep 1 or 11 → Dwidwadasha (2-12 axis)
 *   - sep 5 or 7  → Shadashtaka (6-8 axis)
 */

import { computeLiveTransitSnapshot } from './LiveTransitEngine';

export type PlanetName =
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn'
  | 'Rahu' | 'Ketu';

export type SignName =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type RelationType =
  | 'Dwidwadasha' | 'Shadashtaka'
  | 'Samasaptaka' | 'Trikona' | 'Kendra' | 'SahajaLabha' | 'Conjoined'
  | 'Unknown';

export type ConflictType = 'Dwidwadasha' | 'Shadashtaka' | null;

export type ChartLayer = 'D-1' | 'D-9' | 'Transit';

export type DashaPairType = 'MD-AD' | 'AD-PD' | 'MD-PD';

/**
 * Result of evaluating one pair of dasha lords (e.g., MD-AD in D-1).
 */
export interface DashaPairEvaluation {
  pair: DashaPairType;
  chart: ChartLayer;
  planet1: PlanetName;
  sign1: SignName;
  house1?: number | string;
  planet2: PlanetName;
  sign2: SignName;
  house2?: number | string;
  separation: number; // 0–11 (0-indexed separation forward)
  relationType: RelationType;
  conflictType: ConflictType;
  description: string; // English description
  teluguDescription: string; // Telugu description
}

/**
 * Aggregated result across all three chart layers for one dasha pair (MD-AD, etc.).
 */
export interface DashaPairConflictSummary {
  pair: DashaPairType;
  evaluations: DashaPairEvaluation[];
  hasConflict: boolean;
  conflictLayers: ChartLayer[];
  riskLevel: 'None' | 'Moderate' | 'High' | 'Severe'; // Dwidwadasha=Moderate, Shadashtaka=High/Severe
  summary: string; // Human-readable synthesis
  telugusiSummary: string; // Telugu summary
}

/**
 * Full consolidated report for all dasha pairs (MD-AD, AD-PD, MD-PD) across all layers.
 */
export interface MahadashaAntardashaRelationshipReport {
  hasAnyConflict: boolean;
  pairSummaries: DashaPairConflictSummary[];
  criticalAlert: string | null; // Non-null if Transit Shadashtaka detected
  recommendedActions: string[];
  telugugRecommendedActions: string[];
}

// ═══════════════════════════════════════════════════════════════════
// 1. HELPER FUNCTIONS: Sign Normalization & Separation Calculation
// ═══════════════════════════════════════════════════════════════════

const SIGN_NAMES: SignName[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_ALIASES: Record<string, number> = {
  // English
  'aries': 0, 'taurus': 1, 'gemini': 2, 'cancer': 3, 'leo': 4, 'virgo': 5,
  'libra': 6, 'scorpio': 7, 'sagittarius': 8, 'capricorn': 9, 'aquarius': 10, 'pisces': 11,
  // Sanskrit (Hindi/Devanagari)
  'mesha': 0, 'vrishabha': 1, 'mithuna': 2, 'karka': 3, 'simha': 4, 'kanya': 5,
  'tula': 6, 'vrischika': 7, 'dhanu': 8, 'makara': 9, 'kumbha': 10, 'meena': 11,
  // Telugu
  'meesam': 0, 'rishabham': 1, 'midhunam': 2, 'kadagam': 3, 'simham': 4, 'kanni': 5,
  'tulam': 6, 'viruchigam': 7, 'dhanusu': 8, 'magaram': 9, 'kumbam': 10, 'meenam': 11,
};

/**
 * Normalize a sign name (case-insensitive, supports aliases) to 0-indexed position.
 * Returns -1 if sign not recognized.
 */
export function normalizeSignIndex(sign: string | undefined): number {
  if (!sign) return -1;
  const normalized = sign.trim().toLowerCase();
  const idx = SIGN_ALIASES[normalized];
  return idx !== undefined ? idx : -1;
}

/**
 * Get the sign name at a given 0-indexed position.
 */
export function getSignName(idx: number): SignName | 'Unknown' {
  return SIGN_NAMES[idx] || 'Unknown';
}

/**
 * Calculate the forward separation between two signs (0–11).
 * Formula: ((target - source) + 12) % 12
 *
 * Examples:
 *   Aries → Taurus: ((1 - 0) + 12) % 12 = 1
 *   Pisces → Aries: ((0 - 11) + 12) % 12 = 1 (next in cycle)
 *   Aries → Libra: ((6 - 0) + 12) % 12 = 6
 */
export function calculateSeparation(sourceSignIdx: number, targetSignIdx: number): number {
  if (sourceSignIdx < 0 || targetSignIdx < 0) return -1;
  return ((targetSignIdx - sourceSignIdx) + 12) % 12;
}

// ═══════════════════════════════════════════════════════════════════
// 2. RELATION TYPE DETECTION
// ═══════════════════════════════════════════════════════════════════

/**
 * Determine the relationship type based on sign separation.
 *
 * The six classical Rashi-Kuta pairings (used in marriage compatibility,
 * extended to Dasha lord analysis):
 *
 *   sep 0     → Conjoined (1-1, same sign)
 *   sep 1,11  → Dwidwadasha (2-12, loss axis)
 *   sep 2,10  → Sahaja-Labha (3-11, growth axis)
 *   sep 3,9   → Kendra (4-10, dynamic effort)
 *   sep 4,8   → Trikona (5-9, auspicious flow)
 *   sep 5,7   → Shadashtaka (6-8, conflict axis)
 *   sep 6     → Samasaptaka (7-7, opposition)
 */
export function getRelationType(separation: number): RelationType {
  if (separation === 0) return 'Conjoined';
  if (separation === 1 || separation === 11) return 'Dwidwadasha';
  if (separation === 2 || separation === 10) return 'SahajaLabha';
  if (separation === 3 || separation === 9) return 'Kendra';
  if (separation === 4 || separation === 8) return 'Trikona';
  if (separation === 5 || separation === 7) return 'Shadashtaka';
  if (separation === 6) return 'Samasaptaka';
  return 'Unknown';
}

/**
 * Extract conflict type (if any) from relation type.
 */
export function getConflictType(relationType: RelationType): ConflictType {
  if (relationType === 'Dwidwadasha' || relationType === 'Shadashtaka') {
    return relationType;
  }
  return null;
}

/**
 * Get human-readable English description of a relation type.
 */
export function getRelationDescription(relationType: RelationType): string {
  switch (relationType) {
    case 'Dwidwadasha':
      return 'DWIDWADASHA (2-12) ⚠️ (Expense / Friction / Loss)';
    case 'Shadashtaka':
      return 'SHADASHTAKA (6-8) ⚠️⚠️ (Acute Conflict / Health Strain / Sudden Change)';
    case 'Samasaptaka':
      return 'Samasaptaka (1-7, Mutual Opposition - Balance required)';
    case 'Trikona':
      return 'Trikona (5-9, Highly Auspicious & Smooth Flow)';
    case 'Kendra':
      return 'Kendra (4-10, Dynamic Effort & Action)';
    case 'SahajaLabha':
      return 'Sahaja-Labha (3-11, Growth & Enterprise Gains)';
    case 'Conjoined':
      return 'Conjoined (1-1, Co-present in Same Sign)';
    default:
      return 'Unknown relation';
  }
}

/**
 * Get Telugu description of a relation type.
 */
export function getTeluguRelationDescription(relationType: RelationType): string {
  switch (relationType) {
    case 'Dwidwadasha':
      return 'ద్విర్ద్వాదశ (2-12) ⚠️ వ్యయాలు, ఘర్షణ, నష్టం';
    case 'Shadashtaka':
      return 'షడాష్టక (6-8) ⚠️⚠️ తీవ్ర విరోధం, ఆరోగ్య సమస్యలు, ఆకస్మిక మార్పు';
    case 'Samasaptaka':
      return 'సమసప్తక (1-7) సమతుల్యత అవసరం';
    case 'Trikona':
      return 'త్రికోణ (5-9) శుభప్రదం, సులభ కార్యసిద్ధి';
    case 'Kendra':
      return 'కేంద్ర (4-10) కార్యాచరణ ద్వారా ఫలితం';
    case 'SahajaLabha':
      return 'సహజ-లాభ (3-11) వృద్ధి, లాభాలు';
    case 'Conjoined':
      return 'యుతి (1-1) ఒకే రాశిలో';
    default:
      return 'తెలియని సంబంధం';
  }
}

// ═══════════════════════════════════════════════════════════════════
// 3. PLANET EXTRACTION & SIGN LOOKUP
// ═══════════════════════════════════════════════════════════════════

export interface PlanetPosition {
  sign: SignName | string;
  house?: number | string;
  longitude?: number;
  retrograde?: boolean;
  combust?: boolean;
  speed?: number;
  dignity?: string;
  nakshatra?: string;
}

/**
 * Extract planet map from a chart object (D-1 or D-9).
 * Handles multiple payload formats:
 *   - { planets: {...} }
 *   - { positions: {...} }
 *   - { Sun: {...}, Moon: {...}, ... }
 *   - { planets: [{name: 'Sun', ...}, ...] }
 */
export function extractPlanetMap(chartObj: any): Record<string, PlanetPosition> {
  const map: Record<string, PlanetPosition> = {};
  if (!chartObj) return map;

  // Handle nested positions property if present (from live transit snapshot, etc.)
  if (chartObj.positions && typeof chartObj.positions === 'object' && !Array.isArray(chartObj.positions)) {
    chartObj = chartObj.positions;
  }

  // Handle top-level planet keys
  for (const planetName of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
    if (chartObj[planetName] && typeof chartObj[planetName] === 'object') {
      map[planetName] = chartObj[planetName];
    } else if (chartObj[planetName.toLowerCase()] && typeof chartObj[planetName.toLowerCase()] === 'object') {
      map[planetName] = chartObj[planetName.toLowerCase()];
    }
  }

  // Handle { planets: {...} } format
  if (chartObj.planets && typeof chartObj.planets === 'object' && !Array.isArray(chartObj.planets)) {
    for (const [key, val] of Object.entries(chartObj.planets)) {
      if (val && typeof val === 'object') {
        const normKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        map[normKey] = val as PlanetPosition;
      }
    }
  }

  // Handle { planets: [{name: 'Sun', ...}, ...] } format
  if (Array.isArray(chartObj.planets)) {
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
          nakshatra: p.nakshatra,
        };
      }
    }
  }

  return map;
}

/**
 * Get the sign of a planet from a chart object.
 * Returns the sign name (e.g., 'Aries') or 'Unknown' if not found.
 */
export function getPlanetSign(chartObj: any, planetName: string): SignName | 'Unknown' {
  const map = extractPlanetMap(chartObj);
  const normPlanet = planetName.charAt(0).toUpperCase() + planetName.slice(1).toLowerCase();
  const pos = map[normPlanet] || map[planetName];
  if (!pos || !pos.sign) return 'Unknown';
  return (pos.sign as SignName) || 'Unknown';
}

/**
 * Count house distance from one sign to another (from Moon as reference).
 * Returns 1–12.
 */
export function countHouseDistance(startSign: SignName | string, targetSign: SignName | string): number {
  const startIdx = normalizeSignIndex(startSign);
  const targetIdx = normalizeSignIndex(targetSign);
  if (startIdx === -1 || targetIdx === -1) return -1;
  return ((targetIdx - startIdx) + 12) % 12 || 12; // Return 1–12, not 0–11
}

// ═══════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY: Aliases for the old names in GroundTruthBlockGenerator
// ═══════════════════════════════════════════════════════════════════

export interface InterLordAsymmetry {
  p1PositionFromP2: number;
  p2PositionFromP1: number;
  p1Role: string;
  p2Role: string;
  directionalMeaning: string;
  teluguDirectionalMeaning: string;
}

export interface InterLordPairResult {
  planet1: string;
  sign1: string;
  house1?: number | string;
  planet2: string;
  sign2: string;
  house2?: number | string;
  separation: number;
  relationType: RelationType;
  conflictType: ConflictType;
  description: string;
  teluguDescription: string;
  count1To2?: number;
  count2To1?: number;
  asymmetry?: InterLordAsymmetry;
}

export function checkSignRelation(
  sign1: string,
  sign2: string
): 'Dwidwadasha' | 'Shadashtaka' | null {
  const idx1 = normalizeSignIndex(sign1);
  const idx2 = normalizeSignIndex(sign2);
  if (idx1 === -1 || idx2 === -1) return null;
  const sep = calculateSeparation(idx1, idx2);
  const relType = getRelationType(sep);
  if (relType === 'Dwidwadasha' || relType === 'Shadashtaka') {
    return relType;
  }
  return null;
}

export function evaluateInterLordPair(
  planet1: string,
  sign1: string,
  planet2: string,
  sign2: string,
  house1?: number | string,
  house2?: number | string
): InterLordPairResult | null {
  const idx1 = normalizeSignIndex(sign1);
  const idx2 = normalizeSignIndex(sign2);
  if (idx1 === -1 || idx2 === -1) return null;

  const separation = calculateSeparation(idx1, idx2);
  const count1To2 = ((idx2 - idx1 + 12) % 12) + 1;
  const count2To1 = ((idx1 - idx2 + 12) % 12) + 1;
  const relationType = getRelationType(separation);
  const conflictType = getConflictType(relationType);

  const normSign1 = getSignName(idx1);
  const normSign2 = getSignName(idx2);

  const asymmetry: InterLordAsymmetry = {
    p1PositionFromP2: count2To1,
    p2PositionFromP1: count1To2,
    p1Role: `House ${count2To1} position`,
    p2Role: `House ${count1To2} position`,
    directionalMeaning: `${planet1} is in house ${count2To1} from ${planet2}, while ${planet2} is in house ${count1To2} from ${planet1}.`,
    teluguDirectionalMeaning: `${planet1} ${planet2} నుండి ${count2To1}వ స్థానంలో, ${planet2} ${planet1} నుండి ${count1To2}వ స్థానంలో ఉంది.`,
  };

  return {
    planet1,
    sign1: normSign1 as SignName,
    house1,
    planet2,
    sign2: normSign2 as SignName,
    house2,
    separation,
    count1To2,
    count2To1,
    relationType,
    conflictType,
    asymmetry,
    description: getRelationDescription(relationType),
    teluguDescription: getTeluguRelationDescription(relationType),
  };
}

// ═══════════════════════════════════════════════════════════════════
// 4. SINGLE PAIR EVALUATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Evaluate one dasha pair (e.g., MD-AD) in one chart layer (D-1, D-9, Transit).
 */
export function evaluateDashaPair(
  pair: DashaPairType,
  chart: ChartLayer,
  planet1: PlanetName,
  sign1: SignName | string,
  planet2: PlanetName,
  sign2: SignName | string,
  house1?: number | string,
  house2?: number | string
): DashaPairEvaluation | null {
  const idx1 = normalizeSignIndex(sign1);
  const idx2 = normalizeSignIndex(sign2);

  if (idx1 === -1 || idx2 === -1) return null;

  const separation = calculateSeparation(idx1, idx2);
  const relationType = getRelationType(separation);
  const conflictType = getConflictType(relationType);

  const normSign1 = getSignName(idx1);
  const normSign2 = getSignName(idx2);

  return {
    pair,
    chart,
    planet1,
    sign1: normSign1 as SignName,
    house1,
    planet2,
    sign2: normSign2 as SignName,
    house2,
    separation,
    relationType,
    conflictType,
    description: getRelationDescription(relationType),
    teluguDescription: getTeluguRelationDescription(relationType),
  };
}

// ═══════════════════════════════════════════════════════════════════
// 5. MULTI-LAYER EVALUATION FOR ONE DASHA PAIR
// ═══════════════════════════════════════════════════════════════════

/**
 * Evaluate one dasha pair (e.g., MD-AD) across D-1, D-9, and Transit.
 * Returns a summary with conflict detection and risk level assessment.
 */
export function evaluateDashaPairAcrossLayers(
  pair: DashaPairType,
  planet1: PlanetName,
  planet2: PlanetName,
  d1Chart: any,
  d9Chart: any,
  moonSign: SignName | string,
  transitData?: any
): DashaPairConflictSummary {
  const evaluations: DashaPairEvaluation[] = [];
  const conflictLayers: ChartLayer[] = [];

  // ─── D-1 (Natal) ───
  const d1Sign1 = getPlanetSign(d1Chart, planet1);
  const d1Sign2 = getPlanetSign(d1Chart, planet2);
  if (d1Sign1 !== 'Unknown' && d1Sign2 !== 'Unknown') {
    const pairEval = evaluateDashaPair(pair, 'D-1', planet1, d1Sign1, planet2, d1Sign2);
    if (pairEval) {
      evaluations.push(pairEval);
      if (pairEval.conflictType) conflictLayers.push('D-1');
    }
  }

  // ─── D-9 (Navamsha) ───
  if (d9Chart) {
    const d9Sign1 = getPlanetSign(d9Chart, planet1);
    const d9Sign2 = getPlanetSign(d9Chart, planet2);
    if (d9Sign1 !== 'Unknown' && d9Sign2 !== 'Unknown') {
      const pairEval = evaluateDashaPair(pair, 'D-9', planet1, d9Sign1, planet2, d9Sign2);
      if (pairEval) {
        evaluations.push(pairEval);
        if (pairEval.conflictType) conflictLayers.push('D-9');
      }
    }
  }

  // ─── Transit (Gochara from Moon) ───
  let effectiveTransit = transitData;
  if (!effectiveTransit && moonSign) {
    try {
      effectiveTransit = computeLiveTransitSnapshot(moonSign);
    } catch {
      // Transit computation fallback
    }
  }

  if (effectiveTransit) {
    const tSign1 = getPlanetSign(effectiveTransit, planet1);
    const tSign2 = getPlanetSign(effectiveTransit, planet2);
    if (tSign1 !== 'Unknown' && tSign2 !== 'Unknown') {
      const h1 = countHouseDistance(moonSign, tSign1);
      const h2 = countHouseDistance(moonSign, tSign2);
      const pairEval = evaluateDashaPair(pair, 'Transit', planet1, tSign1, planet2, tSign2, h1, h2);
      if (pairEval) {
        evaluations.push(pairEval);
        if (pairEval.conflictType) conflictLayers.push('Transit');
      }
    }
  }

  // ─── Synthesis ───
  const hasConflict = conflictLayers.length > 0;
  let riskLevel: 'None' | 'Moderate' | 'High' | 'Severe' = 'None';

  if (hasConflict) {
    const hasShadashtaka = evaluations.some(e => e.conflictType === 'Shadashtaka');
    const hasTransitConflict = conflictLayers.includes('Transit');

    if (hasShadashtaka && hasTransitConflict) {
      riskLevel = 'Severe';
    } else if (hasShadashtaka) {
      riskLevel = 'High';
    } else {
      riskLevel = 'Moderate'; // Dwidwadasha only
    }
  }

  const summary = synthesizeSummary(pair, evaluations, conflictLayers);
  const telugusiSummary = synthesizeTeluguSummary(pair, evaluations, conflictLayers);

  return {
    pair,
    evaluations,
    hasConflict,
    conflictLayers,
    riskLevel,
    summary,
    telugusiSummary,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 6. SYNTHESIS & REPORTING
// ═══════════════════════════════════════════════════════════════════

function synthesizeSummary(
  pair: DashaPairType,
  evaluations: DashaPairEvaluation[],
  conflictLayers: ChartLayer[]
): string {
  if (conflictLayers.length === 0) {
    return `✓ ${pair}: No Dwidwadasha or Shadashtaka conflicts detected. Dasha lords operating in mutual harmony.`;
  }

  const conflicts = evaluations.filter(e => e.conflictType);
  const lines = [`⚠️ ${pair} conflicts detected in ${conflictLayers.join(', ')}:`];

  for (const c of conflicts) {
    lines.push(`  - ${c.chart} ${c.chart === 'Transit' ? '(REAL-TIME)' : '(structural)'}: ${c.planet1} (${c.sign1}) & ${c.planet2} (${c.sign2}) → ${c.description}`);
  }

  // Add timing advisory
  if (conflictLayers.includes('Transit')) {
    lines.push('  ⚠️⚠️ IMMEDIATE IMPACT: Operating dasha lords are currently in conflict in Gochara. Expect delays, resistance, or unexpected expenditure during this period.');
  } else if (conflictLayers.includes('D-1')) {
    lines.push('  - Natal framework carries inherent tension. Conscious effort and expense management recommended.');
  }

  if (conflictLayers.includes('D-9')) {
    lines.push('  - Subtle karmic friction (D-9). Results may require perseverance or second-order adjustment.');
  }

  return lines.join('\n');
}

function synthesizeTeluguSummary(
  pair: DashaPairType,
  evaluations: DashaPairEvaluation[],
  conflictLayers: ChartLayer[]
): string {
  if (conflictLayers.length === 0) {
    return `✓ ${pair}: ద్విర్ద్వాదశ లేదా షడాష్టక విరోధాలు లేవు. దశా అధిపతులు సమన్వయంలో పనిచేస్తున్నారు.`;
  }

  const conflicts = evaluations.filter(e => e.conflictType);
  const lines = [`⚠️ ${pair} ${conflictLayers.join(', ')}లో విరోధాలు:`];

  for (const c of conflicts) {
    lines.push(`  - ${c.chart}: ${c.planet1} (${c.sign1}) & ${c.planet2} (${c.sign2}) → ${c.teluguDescription}`);
  }

  if (conflictLayers.includes('Transit')) {
    lines.push('  ⚠️⚠️ ప్రస్తుత దశా అధిపతులు గోచర విరోధంలో ఉన్నారు. ఆలస్యం, ఖర్చులు, నిరీక్ష ఊహించండి.');
  } else if (conflictLayers.includes('D-1')) {
    lines.push('  - జన్మ ఫలానికి ఆయుస్సు చిందాలు ఉన్నాయి. సర్తుక ప్రయత్నం సిద్ధం చేయండి.');
  }

  if (conflictLayers.includes('D-9')) {
    lines.push('  - సూక్ష్మ కర్మ ఘర్షణ (D-9). ఫలితాలకు సహనశీలత అవసరమై ఉండవచ్చు.');
  }

  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════════════════
// 7. FULL REPORT: ALL DASHA PAIRS (MD-AD, AD-PD, MD-PD)
// ═══════════════════════════════════════════════════════════════════

export interface MahadashaAntardashaInput {
  mdLord: PlanetName;
  adLord: PlanetName;
  pdLord?: PlanetName;
  d1Chart: any;
  d9Chart?: any;
  moonSign: SignName | string;
  transitData?: any;
}

/**
 * Generate the complete Mahadasha-Antardasha relationship report.
 * Evaluates all applicable dasha pairs (MD-AD, and if PD provided: AD-PD, MD-PD)
 * across all three chart layers (D-1, D-9, Transit).
 */
export function generateMahadashaAntardashaReport(
  input: MahadashaAntardashaInput
): MahadashaAntardashaRelationshipReport {
  const { mdLord, adLord, pdLord, d1Chart, d9Chart, moonSign, transitData } = input;

  const pairSummaries: DashaPairConflictSummary[] = [];

  // ─── MD-AD ───
  const mdAdSummary = evaluateDashaPairAcrossLayers(
    'MD-AD',
    mdLord,
    adLord,
    d1Chart,
    d9Chart,
    moonSign,
    transitData
  );
  pairSummaries.push(mdAdSummary);

  // ─── AD-PD (if available) ───
  if (pdLord) {
    const adPdSummary = evaluateDashaPairAcrossLayers(
      'AD-PD',
      adLord,
      pdLord,
      d1Chart,
      d9Chart,
      moonSign,
      transitData
    );
    pairSummaries.push(adPdSummary);

    // ─── MD-PD ───
    const mdPdSummary = evaluateDashaPairAcrossLayers(
      'MD-PD',
      mdLord,
      pdLord,
      d1Chart,
      d9Chart,
      moonSign,
      transitData
    );
    pairSummaries.push(mdPdSummary);
  }

  // ─── Aggregate & Critical Alerts ───
  const hasAnyConflict = pairSummaries.some(s => s.hasConflict);
  const criticalAlert =
    pairSummaries.some(s => s.conflictLayers.includes('Transit') && s.evaluations.some(e => e.conflictType === 'Shadashtaka'))
      ? '⚠️⚠️ CRITICAL: Transit Shadashtaka detected. Immediate impact expected. Remedies & patience strongly advised.'
      : null;

  const recommendedActions = buildRecommendedActions(pairSummaries);
  const telugugRecommendedActions = buildTeluguRecommendedActions(pairSummaries);

  return {
    hasAnyConflict,
    pairSummaries,
    criticalAlert,
    recommendedActions,
    telugugRecommendedActions,
  };
}

function buildRecommendedActions(summaries: DashaPairConflictSummary[]): string[] {
  const actions: string[] = [];

  const hasTransitConflict = summaries.some(s => s.conflictLayers.includes('Transit'));
  const hasShadashtaka = summaries.some(s => s.evaluations.some(e => e.conflictType === 'Shadashtaka'));

  if (hasTransitConflict && hasShadashtaka) {
    actions.push('1. Perform immediate remedies: Saturn propitiation, Hanuman puja (if Mars-involved), or suitable Navagraha mantra recitation.');
    actions.push('2. Avoid major commitments or large financial decisions during this transit period.');
    actions.push('3. Consult a senior Vedic astrologer for personalized remedial measures.');
  } else if (hasShadashtaka) {
    actions.push('1. Monitor health and finances closely during this sub-period.');
    actions.push('2. Regular yoga, meditation, or mantra recitation can mitigate subtle karmic friction.');
  } else {
    actions.push('1. Manage expenses proactively; avoid unnecessary expenditure.');
    actions.push('2. Exercise caution in financial/contractual matters.');
  }

  actions.push('4. Revisit chart after this dasha completes for long-term assessment.');

  return actions;
}

function buildTeluguRecommendedActions(summaries: DashaPairConflictSummary[]): string[] {
  const actions: string[] = [];

  const hasTransitConflict = summaries.some(s => s.conflictLayers.includes('Transit'));
  const hasShadashtaka = summaries.some(s => s.evaluations.some(e => e.conflictType === 'Shadashtaka'));

  if (hasTransitConflict && hasShadashtaka) {
    actions.push('1. తక్షణ ఉపాయం: సుఖ్రుద్ర కల్ప, హనుమాన్ పూజ, నవగ్రహ మంత్ర జపం చేయండి.');
    actions.push('2. ఈ గోచర కాలంలో గొప్ప నిర్ణయాలు చేయవద్దు.');
    actions.push('3. విజ్ఞానవంత జ్యోతిషి సలహా చేయండి.');
  } else if (hasShadashtaka) {
    actions.push('1. ఆరోగ్య, ఆర్థిక విషయాలలో సూక్ష్మంగా కన్నీసి ఉంచండి.');
    actions.push('2. సాధన, ధ్యానం చేయండి కర్మ ఘర్షణ తగ్గించడానికి.');
  } else {
    actions.push('1. ఖర్చులపై సూక్ష్ముగా కన్నీసి ఉంచండి.');
    actions.push('2. ఆర్థిక, చట్ట విషయాలలో జాగ్రత్త వహించండి.');
  }

  actions.push('4. ఈ దశ సరిసంతూచుకుని చార్ట సమీక్ష చేయండి.');

  return actions;
}

// ═══════════════════════════════════════════════════════════════════
// 8. EXPORT UTILITIES FOR TEXT FORMATTING
// ═══════════════════════════════════════════════════════════════════

/**
 * Format the full report as a markdown/text section for use in
 * GroundTruthBlockGenerator or AI system prompt.
 */
export function formatMahadashaAntardashaReportAsText(report: MahadashaAntardashaRelationshipReport): string {
  const lines = [
    '═══════════════════════════════════════════════════════════════',
    'MAHADASHA-ANTARDASHA RELATIONSHIP ANALYSIS',
    'Dwidwadasha (2-12) & Shadashtaka (6-8) Checks',
    '═══════════════════════════════════════════════════════════════',
    '',
  ];

  if (!report.hasAnyConflict) {
    lines.push('✓ NO CONFLICTS: All dasha lord pairs operating in mutual harmony.');
    lines.push('✓ No Dwidwadasha (2-12) or Shadashtaka (6-8) relationships detected.');
  } else {
    lines.push('⚠️ CONFLICTS DETECTED:');
    lines.push('');

    for (const pairSummary of report.pairSummaries) {
      lines.push(`${pairSummary.pair} — Risk: ${pairSummary.riskLevel}`);
      lines.push(pairSummary.summary);
      lines.push('');
    }
  }

  if (report.criticalAlert) {
    lines.push('');
    lines.push('CRITICAL ALERT:');
    lines.push(report.criticalAlert);
  }

  if (report.recommendedActions.length > 0) {
    lines.push('');
    lines.push('RECOMMENDED ACTIONS:');
    for (const action of report.recommendedActions) {
      lines.push(action);
    }
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════════');

  return lines.join('\n');
}
