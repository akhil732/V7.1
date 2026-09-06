/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERPLANETARY RELATION ENGINE
 * Dwirdwadasha (2–12) & Shadaṣṭaka (6–8) — Period Lord Checks
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * DOCTRINE (classical Vedic — Phaladeepika, BPHS):
 *
 * ┌─ THE CORE GEOMETRIC CONCEPT OF DWIRDWADASHA (2–12) ────────────────────────┐
 * │  When two planets or signs are in a Dwi-Dwadash relationship, they sit     │
 * │  exactly one sign apart from each other, creating a 30-degree angle.       │
 * │  • If you count from Planet A to Planet B, Planet B is in the 2nd house    │
 * │    (forward — accumulation, resources, material expression).               │
 * │  • If you count from Planet B to Planet A, Planet A is in the 12th house   │
 * │    (backward — expenditure, dissolution, loss, letting go).                │
 * │  Because one attempts to accumulate while the other dissolves or detaches, │
 * │  their energies work at cross-purposes. Period results are DELAYED or      │
 * │  incomplete.                                                               │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ THE CORE GEOMETRIC CONCEPT OF SHADAṢṬAKA (6–8) ───────────────────────────┐
 * │  A Shadashtak relationship occurs when two planets or signs are placed     │
 * │  at a quincunx or 150-degree angle from one another, which translates to a │
 * │  6th and 8th position placement:                                           │
 * │  • If you count from Entity A to Entity B, Entity B sits in the 6th house  │
 * │    relative to A (conflict, obstacles, debts, disease, competitive strife).│
 * │  • If you count from Entity B to Entity A, Entity A sits in the 8th house  │
 * │    relative to B (sudden crisis, transformation, chronic reversals).       │
 * │  ELEMENTAL & STRUCTURAL CLASH:                                             │
 * │  Because these two positions share absolutely no planetary elements        │
 * │  (fire, earth, air, or water) or structural modalities (cardinal, fixed,    │
 * │  or mutable), they struggle to find common ground, creating a severe clash │
 * │  of energies. This is the most severe positional obstruction in Jyotish.   │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * PARTICIPANTS: ONLY the active period lords — MD, AD, PD (Pratyantardasha).
 * No other natal or transit planets participate.
 *
 * TWO INDEPENDENT CHECKS:
 *   CHECK A (Natal):   Signs occupied by MD/AD/PD lords in the NATAL (D-1) chart.
 *   CHECK B (Transit): Signs occupied by MD/AD/PD lords in TODAY'S transit chart.
 *
 * NO CROSS-CHART COMPARISON. Natal stays natal. Transit stays transit.
 *
 * SEPARATION FORMULA:
 *   sep = ((indexB - indexA) + 12) % 12
 *   Dwirdwadasha : sep === 1 OR sep === 11 (30° angle, 2nd & 12th relative placement)
 *   Shadaṣṭaka   : sep === 5 OR sep === 7  (150° quincunx, 6th & 8th relative placement)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export type RelationType = 'DWIRDWADASHA' | 'SHADASHTAKA' | 'NONE';
export type Severity = 'SEVERE' | 'MODERATE' | 'NONE';

export type SignElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type SignModality = 'Cardinal' | 'Fixed' | 'Mutable'; // Char, Sthir, Dvisvabhav

// ─── Sign definitions & classical qualities ──────────────────────────────────

export const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export const SIGN_ELEMENTS: Record<string, SignElement> = {
  Aries: 'Fire',
  Taurus: 'Earth',
  Gemini: 'Air',
  Cancer: 'Water',
  Leo: 'Fire',
  Virgo: 'Earth',
  Libra: 'Air',
  Scorpio: 'Water',
  Sagittarius: 'Fire',
  Capricorn: 'Earth',
  Aquarius: 'Air',
  Pisces: 'Water'
};

export const SIGN_MODALITIES: Record<string, SignModality> = {
  Aries: 'Cardinal',
  Taurus: 'Fixed',
  Gemini: 'Mutable',
  Cancer: 'Cardinal',
  Leo: 'Fixed',
  Virgo: 'Mutable',
  Libra: 'Cardinal',
  Scorpio: 'Fixed',
  Sagittarius: 'Mutable',
  Capricorn: 'Cardinal',
  Aquarius: 'Fixed',
  Pisces: 'Mutable'
};

export const SIGN_TE: Record<string, string> = {
  Aries: 'మేషం', Taurus: 'వృషభం', Gemini: 'మిథునం', Cancer: 'కర్కాటకం',
  Leo: 'సింహం', Virgo: 'కన్య', Libra: 'తుల', Scorpio: 'వృశ్చికం',
  Sagittarius: 'ధనుస్సు', Capricorn: 'మకరం', Aquarius: 'కుంభం', Pisces: 'మీనం'
};

export const PLANET_TE: Record<string, string> = {
  Sun: 'సూర్యుడు', Moon: 'చంద్రుడు', Mars: 'కుజుడు', Mercury: 'బుధుడు',
  Jupiter: 'గురుడు', Venus: 'శుక్రుడు', Saturn: 'శని',
  Rahu: 'రాహువు', Ketu: 'కేతువు'
};

export const ELEMENT_TE: Record<SignElement, string> = {
  Fire: 'అగ్ని తత్త్వం (Fire)',
  Earth: 'భూ తత్త్వం (Earth)',
  Air: 'వాయు తత్త్వం (Air)',
  Water: 'జల తత్త్వం (Water)'
};

export const MODALITY_TE: Record<SignModality, string> = {
  Cardinal: 'చర రాశి (Cardinal)',
  Fixed: 'స్థిర రాశి (Fixed)',
  Mutable: 'ద్విస్వభావ రాశి (Mutable)'
};

function signIdx(sign: string): number {
  const i = SIGN_NAMES.indexOf(sign as any);
  return i >= 0 ? i : 0;
}

/** Forward gap from signA to signB (0–11). */
export function forwardSep(signA: string, signB: string): number {
  return ((signIdx(signB) - signIdx(signA)) + 12) % 12;
}

// ─── Geometric Details Interface ──────────────────────────────────────────────

export interface GeometricDetails {
  angleDegrees: number; // 30 or 150
  angleName: string;   // e.g. '30° (Semi-Sextile / Adjacent)' | '150° (Quincunx)'
  fromAtoB: { house: number; roleDescription: string };
  fromBtoA: { house: number; roleDescription: string };
  elementA: SignElement;
  modalityA: SignModality;
  elementB: SignElement;
  modalityB: SignModality;
  sharedElement: boolean;
  sharedModality: boolean;
  elementClashSummary: string;
  elementClashSummaryTe: string;
}

export function computeGeometry(
  lordA: string,
  signA: string,
  lordB: string,
  signB: string,
  relation: RelationType
): GeometricDetails | undefined {
  if (relation === 'NONE') return undefined;

  const sep = forwardSep(signA, signB);
  const elementA = SIGN_ELEMENTS[signA] || 'Fire';
  const modalityA = SIGN_MODALITIES[signA] || 'Cardinal';
  const elementB = SIGN_ELEMENTS[signB] || 'Fire';
  const modalityB = SIGN_MODALITIES[signB] || 'Cardinal';

  const sharedElement = elementA === elementB;
  const sharedModality = modalityA === modalityB;

  if (relation === 'DWIRDWADASHA') {
    const isBSecond = sep === 1;
    const houseFromAtoB = isBSecond ? 2 : 12;
    const houseFromBtoA = isBSecond ? 12 : 2;

    return {
      angleDegrees: 30,
      angleName: '30° (Adjacent / Dwi-Dwadash)',
      fromAtoB: {
        house: houseFromAtoB,
        roleDescription:
          houseFromAtoB === 2
            ? `${lordB} sits in 2nd house from ${lordA} (forward: accumulation, resources, wealth)`
            : `${lordB} sits in 12th house from ${lordA} (backward: expenditure, loss, dissolution)`
      },
      fromBtoA: {
        house: houseFromBtoA,
        roleDescription:
          houseFromBtoA === 2
            ? `${lordA} sits in 2nd house from ${lordB} (forward: accumulation, resources, wealth)`
            : `${lordA} sits in 12th house from ${lordB} (backward: expenditure, loss, dissolution)`
      },
      elementA,
      modalityA,
      elementB,
      modalityB,
      sharedElement,
      sharedModality,
      elementClashSummary:
        `Adjacent 30° placement: One planet operates in the 2nd house of accumulation/growth, while the other operates in the 12th house of expenditure/dissolution. Because one accumulates while the other dispenses, their energies operate at cross-purposes, delaying period fruition.`,
      elementClashSummaryTe:
        `30° ద్విద్వాదశ స్థితి: ఒక గ్రహం ధన/సంచయ భావం (2వ) వైపు, మరొకటి వ్యయ/మోక్ష/నష్ట భావం (12వ) వైపు లాగడం వల్ల పరస్పర సమన్వయం లోపించి, కాల ఫలితాలు గణనీయంగా ఆలస్యమవుతాయి.`
    };
  }

  if (relation === 'SHADASHTAKA') {
    const isBSixth = sep === 5;
    const houseFromAtoB = isBSixth ? 6 : 8;
    const houseFromBtoA = isBSixth ? 8 : 6;

    return {
      angleDegrees: 150,
      angleName: '150° (Quincunx / Shadaṣṭaka)',
      fromAtoB: {
        house: houseFromAtoB,
        roleDescription:
          houseFromAtoB === 6
            ? `${lordB} sits in 6th house from ${lordA} (conflict, obstacles, debts, disease, competitive strife)`
            : `${lordB} sits in 8th house from ${lordA} (sudden crisis, transformation, hidden vulnerability, reversals)`
      },
      fromBtoA: {
        house: houseFromBtoA,
        roleDescription:
          houseFromBtoA === 6
            ? `${lordA} sits in 6th house from ${lordB} (conflict, obstacles, debts, disease, competitive strife)`
            : `${lordA} sits in 8th house from ${lordB} (sudden crisis, transformation, hidden vulnerability, reversals)`
      },
      elementA,
      modalityA,
      elementB,
      modalityB,
      sharedElement: false,
      sharedModality: false,
      elementClashSummary:
        `Because these two positions share absolutely no planetary elements (fire, earth, air, or water) or structural modalities (cardinal, fixed, or mutable), they struggle to find common ground, creating a severe clash of energies.`,
      elementClashSummaryTe:
        `ఈ రెండు స్థానాలు పంచభూత తత్త్వాల్లో (అగ్ని, పృథ్వి, వాయు, జల) గానీ, స్వభావ రీత్యా (చర, స్థిర, ద్విస్వభావ) గానీ ఎటువంటి సారూప్యతను పంచుకోవు (zero shared elements or modalities). అందువల్ల ఈ గ్రహాల మధ్య ఎటువంటి పరస్పర అనుకూలత లేక తీవ్ర శక్తి ఘర్షణ (severe clash of energies) ఏర్పడుతుంది.`
    };
  }

  return undefined;
}

export function classify(signA: string, signB: string): { relation: RelationType; severity: Severity } {
  if (!signA || !signB || signA === signB) return { relation: 'NONE', severity: 'NONE' };
  const sep = forwardSep(signA, signB);
  if (sep === 1 || sep === 11) return { relation: 'DWIRDWADASHA', severity: 'MODERATE' };
  if (sep === 5 || sep === 7)  return { relation: 'SHADASHTAKA',  severity: 'SEVERE'   };
  return { relation: 'NONE', severity: 'NONE' };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PeriodLordPair {
  lordA: string;       // e.g. 'Sun'
  signA: string;       // sign occupied (natal or transit)
  lordB: string;       // e.g. 'Mercury'
  signB: string;
  label: string;       // e.g. 'MD–AD'
  relation: RelationType;
  severity: Severity;
  geometry?: GeometricDetails;
  impactEnglish: string;
  impactTelugu: string;
}

export interface PeriodRelationCheck {
  /** Chart context this check was run on */
  context: 'NATAL' | 'TRANSIT';
  /** All pairs checked (MD–AD, MD–PD, AD–PD) */
  pairs: PeriodLordPair[];
  /** Pairs that have an actual affliction (DWIRDWADASHA or SHADASHTAKA) */
  afflictedPairs: PeriodLordPair[];
  /** Highest severity found across all pairs */
  worstSeverity: Severity;
  /** Ready-to-inject prompt block */
  promptBlock: string;
}

export interface InterplanetaryRelationReport {
  /** CHECK A: natal D-1 signs of MD/AD/PD lords */
  natal: PeriodRelationCheck;
  /** CHECK B: today's transit signs of MD/AD/PD lords */
  transit: PeriodRelationCheck;
  /** Combined prompt block for both checks */
  promptBlock: string;
}

// ─── Narrative builders ───────────────────────────────────────────────────────

function narrative(
  lordA: string, signA: string,
  lordB: string, signB: string,
  label: string,
  relation: RelationType,
  context: 'NATAL' | 'TRANSIT',
  geometry?: GeometricDetails
): { en: string; te: string } {
  const ctxLabel = context === 'NATAL' ? 'natal chart' : 'transit chart';
  const ctxLabelTe = context === 'NATAL' ? 'జన్మ కుండలిలో' : 'గోచారంలో';

  const lordATe = PLANET_TE[lordA] || lordA;
  const lordBTe = PLANET_TE[lordB] || lordB;
  const signATe = SIGN_TE[signA] || signA;
  const signBTe = SIGN_TE[signB] || signB;

  if (relation === 'DWIRDWADASHA') {
    const fromA = geometry?.fromAtoB.house ?? 2;
    const fromB = geometry?.fromBtoA.house ?? 12;

    return {
      en: `${label} DWIRDWADASHA (2–12, 30° separation) in ${ctxLabel}: ${lordA} (${signA}) ↔ ${lordB} (${signB}) sit exactly one sign apart creating a 30-degree angle. From ${lordA} to ${lordB} is H${fromA} (forward); from ${lordB} to ${lordA} is H${fromB} (backward). One planet emphasizes resource accumulation (2nd house) while the other operates in expenditure/dissolution (12th house). Because of this structural divergence, ${label} period results will be DELAYED or incomplete.`,
      te: `${label} ద్విద్వాదశ (2-12, 30° కోణం) ${ctxLabelTe}: ${lordATe} (${signATe}) మరియు ${lordBTe} (${signBTe}) సరిగ్గా ఒక రాశి దూరంలో 30 డిగ్రీల కోణాన్ని ఏర్పరుస్తాయి. ${lordATe} నుండి ${lordBTe} H${fromA}లో (ముందుకు), మరియు ${lordBTe} నుండి ${lordATe} H${fromB}లో (వెనుకకు) ఉన్నారు. ఒకరు సంచయం (2వ), మరొకరు వ్యయం (12వ) వైపు లాగడం వల్ల పరస్పర సహకారం కొరవడి, ఈ కాలంలో ఫలితాలు ఆలస్యమవుతాయి.`
    };
  } else {
    const fromA = geometry?.fromAtoB.house ?? 6;
    const fromB = geometry?.fromBtoA.house ?? 8;
    const elemA = geometry?.elementA || 'Unknown';
    const modA = geometry?.modalityA || 'Unknown';
    const elemB = geometry?.elementB || 'Unknown';
    const modB = geometry?.modalityB || 'Unknown';

    return {
      en: `${label} SHADAṢṬAKA (6–8, 150° quincunx) in ${ctxLabel}: ${lordA} (${signA}) ↔ ${lordB} (${signB}) sit at a quincunx or 150-degree angle from one another, creating a 6th and 8th position placement (from ${lordA} to ${lordB}: H${fromA}; from ${lordB} to ${lordA}: H${fromB}). Elements & Modalities: ${signA} is ${elemA} (${modA}) vs ${signB} is ${elemB} (${modB}). Because these two positions share absolutely no planetary elements (fire, earth, air, or water) or structural modalities (cardinal, fixed, or mutable), they struggle to find common ground, creating a severe clash of energies. ${label} period may bring reversals, unexpected obstacles, or health challenges.`,
      te: `${label} షడష్టక (6-8, 150° quincunx) ${ctxLabelTe}: ${lordATe} (${signATe}) మరియు ${lordBTe} (${signBTe}) 150 డిగ్రీల కోణంలో 6వ మరియు 8వ స్థానాల్లో ఉన్నారు (${lordATe} నుండి ${lordBTe}: H${fromA}; ${lordBTe} నుండి ${lordATe}: H${fromB}). తత్త్వ-స్వభావాలు: ${signATe} (${elemA}, ${modA}) ↔ ${signBTe} (${elemB}, ${modB}). ఈ రెండు స్థానాలు పంచభూత తత్త్వాల్లో గానీ, స్వభావాల్లో గానీ ఎటువంటి సారూప్యతను పంచుకోవు (zero shared elements or modalities), ఫలితంగా తీవ్ర శక్తి ఘర్షణ (severe clash of energies) ఏర్పడుతుంది. ఈ కాలంలో ఆకస్మిక అడ్డంకులు, వ్యతిరేక ఫలితాలు, లేదా ఆరోగ్య సమస్యలు ఎదురయ్యే అవకాశం ఉంది.`
    };
  }
}

// ─── Core check function ──────────────────────────────────────────────────────

function checkPeriodLords(params: {
  context: 'NATAL' | 'TRANSIT';
  mdLord: string;
  mdSign: string;
  adLord: string;
  adSign: string;
  pdLord?: string;
  pdSign?: string;
}): PeriodRelationCheck {
  const { context, mdLord, mdSign, adLord, adSign, pdLord, pdSign } = params;

  const pairsToCheck: Array<{ lordA: string; signA: string; lordB: string; signB: string; label: string }> = [
    { lordA: mdLord, signA: mdSign, lordB: adLord, signB: adSign, label: 'MD–AD' }
  ];

  if (pdLord && pdSign) {
    pairsToCheck.push(
      { lordA: mdLord, signA: mdSign, lordB: pdLord,  signB: pdSign,  label: 'MD–PD' },
      { lordA: adLord, signA: adSign, lordB: pdLord,  signB: pdSign,  label: 'AD–PD' }
    );
  }

  const pairs: PeriodLordPair[] = pairsToCheck.map(({ lordA, signA, lordB, signB, label }) => {
    const { relation, severity } = classify(signA, signB);
    const geometry = computeGeometry(lordA, signA, lordB, signB, relation);

    let impactEnglish = `${label}: ${lordA}(${signA}) & ${lordB}(${signB}) — no inimical relation.`;
    let impactTelugu  = `${label}: ${PLANET_TE[lordA] || lordA}(${SIGN_TE[signA] || signA}) & ${PLANET_TE[lordB] || lordB}(${SIGN_TE[signB] || signB}) — ప్రతికూల సంబంధం లేదు.`;

    if (relation !== 'NONE') {
      const n = narrative(lordA, signA, lordB, signB, label, relation, context, geometry);
      impactEnglish = n.en;
      impactTelugu  = n.te;
    }

    return { lordA, signA, lordB, signB, label, relation, severity, geometry, impactEnglish, impactTelugu };
  });

  const afflictedPairs = pairs.filter(p => p.relation !== 'NONE');

  const worstSeverity: Severity =
    afflictedPairs.some(p => p.severity === 'SEVERE')   ? 'SEVERE'   :
    afflictedPairs.some(p => p.severity === 'MODERATE') ? 'MODERATE' :
    'NONE';

  const promptBlock = buildCheckBlock(context, pairs, afflictedPairs, worstSeverity);

  return { context, pairs, afflictedPairs, worstSeverity, promptBlock };
}

// ─── Prompt block builders ────────────────────────────────────────────────────

function buildCheckBlock(
  context: 'NATAL' | 'TRANSIT',
  pairs: PeriodLordPair[],
  afflicted: PeriodLordPair[],
  worstSeverity: Severity
): string {
  const header = context === 'NATAL'
    ? '── CHECK A: NATAL CHART — Period Lord Signs (D-1 occupied signs) ────────'
    : '── CHECK B: TRANSIT CHART — Period Lord Signs (today\'s Gochara positions) ──';

  const lines: string[] = [header];

  pairs.forEach(p => {
    const icon = p.severity === 'SEVERE' ? '🔴' : p.severity === 'MODERATE' ? '⚠' : '✓';
    const geomNote = p.geometry ? ` [${p.geometry.angleName}]` : '';
    lines.push(`  ${icon} ${p.label}: ${p.lordA}(${p.signA}) ↔ ${p.lordB}(${p.signB}) → ${p.relation === 'NONE' ? 'Neutral' : p.relation}${geomNote} [${p.severity}]`);
  });

  if (afflicted.length === 0) {
    lines.push(`  Result: No inimical relation between period lords in the ${context.toLowerCase()} chart.`);
    lines.push(`  ✓ ${context === 'NATAL' ? 'Natal' : 'Transit'} period lord configuration is cooperative — no positional obstruction.`);
  } else {
    lines.push('');
    lines.push('  DETAILS & GEOMETRIC ANALYSIS:');
    afflicted.forEach(p => {
      lines.push(`    • ${p.impactEnglish}`);
      if (p.geometry) {
        lines.push(`      - Relative Houses: ${p.geometry.fromAtoB.roleDescription}`);
        lines.push(`      - Relative Houses: ${p.geometry.fromBtoA.roleDescription}`);
        if (p.relation === 'SHADASHTAKA') {
          lines.push(`      - Clashing Archetype: ${p.geometry.elementClashSummary}`);
        }
      }
    });
    lines.push('');
    lines.push(`  INSTRUCTION TO AI: The above ${context === 'NATAL' ? 'natal' : 'transit'} period lord affliction(s) MUST be stated in the response.`);
    if (worstSeverity === 'SEVERE') {
      lines.push('  Severity is SEVERE (Shadashtaka / 150° quincunx): State that these two period lords share zero elements and zero modalities, resulting in an acute clash of energies, reversals, or health concerns. Recommend classical planetary remedies for the afflicted pair.');
    } else {
      lines.push('  Severity is MODERATE (Dwirdwadasha / 30° 2-12 placement): State that because one planet operates in the 2nd house of accumulation while the other sits in the 12th house of expenditure, results will be delayed or incomplete.');
    }
  }

  return lines.join('\n');
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function computeInterplanetaryRelations(params: {
  /** Active MD lord name */
  mdLord: string;
  /** Sign occupied by MD lord in NATAL chart (D-1) */
  mdNatalSign: string;
  /** Sign occupied by MD lord in TODAY'S transit */
  mdTransitSign: string;
  /** Active AD lord name */
  adLord: string;
  /** Sign occupied by AD lord in NATAL chart (D-1) */
  adNatalSign: string;
  /** Sign occupied by AD lord in TODAY'S transit */
  adTransitSign: string;
  /** Active PD lord name (optional) */
  pdLord?: string;
  /** Sign occupied by PD lord in NATAL chart (D-1) */
  pdNatalSign?: string;
  /** Sign occupied by PD lord in TODAY'S transit */
  pdTransitSign?: string;
}): InterplanetaryRelationReport {
  const {
    mdLord, mdNatalSign, mdTransitSign,
    adLord, adNatalSign, adTransitSign,
    pdLord, pdNatalSign, pdTransitSign
  } = params;

  // CHECK A: Natal D-1 occupied signs
  const natal = checkPeriodLords({
    context: 'NATAL',
    mdLord, mdSign: mdNatalSign,
    adLord, adSign: adNatalSign,
    pdLord, pdSign: pdNatalSign
  });

  // CHECK B: Today's transit occupied signs
  const transit = checkPeriodLords({
    context: 'TRANSIT',
    mdLord, mdSign: mdTransitSign,
    adLord, adSign: adTransitSign,
    pdLord, pdSign: pdTransitSign
  });

  // Combined block
  const combinedLines: string[] = [
    '═══════════════════════════════════════════════════════════════════',
    'PERIOD LORD RELATIONS — DWIRDWADASHA (2-12) & SHADAṢṬAKA (6-8)',
    'Participants: ONLY active MD / AD / PD lords. Two independent checks.',
    'No cross-chart comparison. Natal is natal. Transit is transit.',
    '═══════════════════════════════════════════════════════════════════',
    '',
    `Active period: ${mdLord} MD → ${adLord} AD${pdLord ? ` → ${pdLord} PD` : ''}`,
    '',
    natal.promptBlock,
    '',
    transit.promptBlock,
    ''
  ];

  // Compound effect note
  if (natal.afflictedPairs.length > 0 && transit.afflictedPairs.length > 0) {
    combinedLines.push('⚠⚠ COMPOUND AFFLICTION: Both natal AND transit period lord relations are inimical.');
    combinedLines.push('   This is a doubly weakened period. Results will be significantly obstructed.');
    combinedLines.push('   State this compound effect explicitly in the response and emphasize remedies.');
  } else if (natal.afflictedPairs.length > 0) {
    combinedLines.push('Note: Natal period lord affliction present. Transit is clear — some relief possible but natal obstruction persists throughout this Dasha period.');
  } else if (transit.afflictedPairs.length > 0) {
    combinedLines.push('Note: Transit period lord affliction present now. Natal configuration is clear — this is a temporary obstruction that will shift as planets move.');
  } else {
    combinedLines.push('✓ Period lord configuration is clean in both natal and transit charts. No Dwirdwadasha or Shadaṣṭaka obstruction on active period lords.');
  }

  return {
    natal,
    transit,
    promptBlock: combinedLines.join('\n')
  };
}

