/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERPLANETARY RELATION CLAIM VALIDATOR
 * Post-generation guardrail to cross-check LLM claims against pre-computed truth
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 * After Gemini generates a response, this validator extracts any Dwirdwadasha or
 * Shadashtaka claims about period lords, then verifies them against the
 * pre-computed ground truth. If the LLM claims an affliction that wasn't
 * computed, this is flagged as a guardrail breach.
 *
 * DOES NOT edit the response text — reports the issue so the caller can decide:
 * - Block/flag the response
 * - Regenerate with stronger constraints
 * - Surface a warning banner
 * - Strip the offending sentence (requires regex)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface PeriodLordPair {
  lordA: string;
  signA: string;
  lordB: string;
  signB: string;
  label: string;
  relation: 'DWIRDWADASHA' | 'SHADASHTAKA' | 'NONE';
  severity: 'SEVERE' | 'MODERATE' | 'NONE';
}

export interface PeriodRelationCheck {
  context: 'NATAL' | 'TRANSIT';
  pairs: PeriodLordPair[];
  afflictedPairs: PeriodLordPair[];
}

export interface InterplanetaryRelationReport {
  natal: PeriodRelationCheck;
  transit: PeriodRelationCheck;
}

export interface ValidationResult {
  valid: boolean;
  breaches: GuardrailBreach[];
  claims: {
    dwirdwadasha: string[];
    shadashtaka: string[];
  };
  computedAfflictions: {
    dwirdwadasha: string[];
    shadashtaka: string[];
  };
}

export interface GuardrailBreach {
  type: 'DWIRDWADASHA' | 'SHADASHTAKA';
  context: string;
  reason: string;
  severity: 'CRITICAL' | 'WARNING';
}

/**
 * Regex patterns to detect Dwirdwadasha/Shadashtaka claims in natural language.
 * Covers English, Telugu, and variations.
 */
const DWIRDWADASHA_PATTERNS = [
  /dwirdwadasha/i,
  /dwi-?dwadash/i,
  /ద్విద్వాదశ/i,
  /dvi-?dvadash/i,
  /2\s*[-–]\s*12\s+(?:relation|placement|house|bhava|స్థితి|సంబంధ)/i,
  /2\s*[-–]\s*12/i,
  /adjacent\s+30[°º]\s+(?:relation|placement|separation)/i,
];

const SHADASHTAKA_PATTERNS = [
  /shadashtaka/i,
  /shada[sṣ]ṭaka/i,
  /షడష్టక/i,
  /6\s*[-–]\s*8\s+(?:relation|placement|house|bhava|స్థితి|సంబంధ)/i,
  /6\s*[-–]\s*8/i,
  /quincunx\s+150[°º]/i,
];

const PERIOD_LORD_KEYWORDS = [
  /mahadasha|MD|మహాదశ|महादशा/i,
  /antardasha|AD|అంతర్దశ|अंतर्दशा/i,
  /pratyantardasha|PD|ప్రత్యంతర్దశ|प्रत्यंतरदशा/i,
  /period\s*lord/i,
  /దశ|దశా|dasha/i,
  /గ్రహం|గ్రహాల|నాథు/i,
  /బుధుడు|శుక్రుడు|గురుడు|శని|రవి|చంద్రుడు|కుజుడు|రాహువు|కేతువు/i,
  /Mercury|Venus|Jupiter|Saturn|Sun|Moon|Mars|Rahu|Ketu/i,
];

/**
 * Negation patterns that indicate the relation is ABSENT, not present.
 * Explicit denials (e.g. "share no Dwirdwadasha relation", "ద్విద్వాదశ లేదు")
 * must NOT trigger false breach detections.
 */
const NEGATION_PATTERNS = [
  /\bno\s+(?:dwirdwadasha|shadashtaka|dwi-?dwadash|shada[sṣ]ṭaka)/i,
  /\bnot\s+(?:in\s+)?(?:a\s+)?(?:dwirdwadasha|shadashtaka)/i,
  /\bshare\s+no\s+(?:dwirdwadasha|shadashtaka)/i,
  /\bfree\s+from\s+(?:dwirdwadasha|shadashtaka)/i,
  /\bwithout\s+(?:any\s+)?(?:dwirdwadasha|shadashtaka)/i,
  /\bneither\s+(?:dwirdwadasha|shadashtaka)/i,
  /లేదు/i,
  /లేవు/i,
  /కాదు/i,
  /రహిత/i,
  /నహీం|नहीं/i,
];

/**
 * Extract all potential Dwirdwadasha/Shadashtaka claim sentences from the response.
 * Returns text chunks that mention these relations + period lord keywords without negation.
 */
function extractClaimSentences(text: string): {
  dwirdwadasha: string[];
  shadashtaka: string[];
} {
  const sentences = text.split(/[।॥\n.!?]/);
  const dwi: string[] = [];
  const sha: string[] = [];

  for (const sent of sentences) {
    const sentTrimmed = sent.trim();
    if (sentTrimmed.length < 10) continue;

    // Check if sentence mentions period lords
    const hasPeriodLord = PERIOD_LORD_KEYWORDS.some(p => p.test(sentTrimmed));
    if (!hasPeriodLord) continue;

    // Check if sentence is an explicit negation / denial
    const isNegation = NEGATION_PATTERNS.some(n => n.test(sentTrimmed));
    if (isNegation) continue;

    // Check if sentence mentions relation
    if (DWIRDWADASHA_PATTERNS.some(p => p.test(sentTrimmed))) {
      dwi.push(sentTrimmed);
    } else if (SHADASHTAKA_PATTERNS.some(p => p.test(sentTrimmed))) {
      sha.push(sentTrimmed);
    }
  }

  return { dwirdwadasha: dwi, shadashtaka: sha };
}

/**
 * Main validation function.
 *
 * @param responseText The generated response from Gemini
 * @param ipRelations The pre-computed InterplanetaryRelationReport
 * @returns ValidationResult with all findings
 */
export function validateInterplanetaryClaims(
  responseText: string,
  ipRelations: InterplanetaryRelationReport
): ValidationResult {
  const breaches: GuardrailBreach[] = [];

  // Gather all afflicted labels from both natal and transit checks
  const dwirdwashakaAfflicted = new Set<string>();
  const shadashtakaAfflicted = new Set<string>();

  const checks = [ipRelations?.natal, ipRelations?.transit].filter(Boolean);
  for (const check of checks) {
    if (Array.isArray(check.afflictedPairs)) {
      for (const p of check.afflictedPairs) {
        if (p.relation === 'DWIRDWADASHA') {
          dwirdwashakaAfflicted.add(p.label);
        } else if (p.relation === 'SHADASHTAKA') {
          shadashtakaAfflicted.add(p.label);
        }
      }
    }
  }

  // Extract claims from response
  const claims = extractClaimSentences(responseText);

  // BREACH 1: Claims Dwirdwadasha when not computed
  if (claims.dwirdwadasha.length > 0 && dwirdwashakaAfflicted.size === 0) {
    breaches.push({
      type: 'DWIRDWADASHA',
      context: claims.dwirdwadasha[0].substring(0, 100),
      reason:
        'Response claims Dwirdwadasha (2–12, 30° separation) but no period lord pair was computed as afflicted by this relation. ' +
        'Likely caused by reasoning from sign RULERSHIP (e.g. "Mercury rules Virgo, Venus rules Libra, they are adjacent signs") ' +
        'instead of ACTUAL OCCUPIED SIGNS in the chart.',
      severity: 'CRITICAL',
    });
  }

  // BREACH 2: Claims Shadashtaka when not computed
  if (claims.shadashtaka.length > 0 && shadashtakaAfflicted.size === 0) {
    breaches.push({
      type: 'SHADASHTAKA',
      context: claims.shadashtaka[0].substring(0, 100),
      reason:
        'Response claims Shadashtaka (6–8, 150° quincunx) but no period lord pair was computed as afflicted by this relation. ' +
        'Likely caused by reasoning from sign RULERSHIP or NATURAL ZODIAC adjacency instead of this chart\'s ACTUAL PLACEMENTS.',
      severity: 'CRITICAL',
    });
  }

  const valid = breaches.length === 0;

  return {
    valid,
    breaches,
    claims,
    computedAfflictions: {
      dwirdwadasha: Array.from(dwirdwashakaAfflicted),
      shadashtaka: Array.from(shadashtakaAfflicted),
    },
  };
}

/**
 * Format validation result for logging / debugging.
 */
export function formatValidationReport(result: ValidationResult): string {
  const lines: string[] = [
    '═══════════════════════════════════════════════════════════════════',
    'INTERPLANETARY RELATION CLAIM VALIDATION REPORT',
    '═══════════════════════════════════════════════════════════════════',
  ];

  if (result.valid) {
    lines.push('✓ PASS: No guardrail breaches detected.');
  } else {
    lines.push(`✗ FAIL: ${result.breaches.length} guardrail breach(es) detected:`);
    lines.push('');
    result.breaches.forEach((b, i) => {
      lines.push(`  [${i + 1}] ${b.type} (${b.severity})`);
      lines.push(`      Context: "${b.context}..."`);
      lines.push(`      Reason: ${b.reason}`);
      lines.push('');
    });
  }

  lines.push('CLAIMS FOUND IN RESPONSE:');
  if (result.claims.dwirdwadasha.length > 0) {
    lines.push(`  • Dwirdwadasha (${result.claims.dwirdwadasha.length} mention(s))`);
  } else {
    lines.push('  • Dwirdwadasha: none');
  }
  if (result.claims.shadashtaka.length > 0) {
    lines.push(`  • Shadashtaka (${result.claims.shadashtaka.length} mention(s))`);
  } else {
    lines.push('  • Shadashtaka: none');
  }

  lines.push('');
  lines.push('COMPUTED AFFLICTIONS (GROUND TRUTH):');
  if (result.computedAfflictions.dwirdwadasha.length > 0) {
    lines.push(`  • Dwirdwadasha: ${result.computedAfflictions.dwirdwadasha.join(', ')}`);
  } else {
    lines.push('  • Dwirdwadasha: none');
  }
  if (result.computedAfflictions.shadashtaka.length > 0) {
    lines.push(`  • Shadashtaka: ${result.computedAfflictions.shadashtaka.join(', ')}`);
  } else {
    lines.push('  • Shadashtaka: none');
  }

  return lines.join('\n');
}
