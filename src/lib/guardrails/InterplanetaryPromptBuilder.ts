/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERPLANETARY RELATION PROMPT BUILDER
 * Constructs a guardrailed system prompt block that forbids rulership reasoning
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * CONTEXT:
 * The pre-computed InterplanetaryRelationEngine correctly identifies Dwirdwadasha
 * and Shadashtaka based on ACTUAL OCCUPIED SIGNS in the chart. However, the LLM
 * can hallucinate these relations by reasoning from sign RULERSHIP ("Mercury rules
 * Virgo, Venus rules Libra, Virgo–Libra are adjacent signs = 2–12 relation"),
 * which is invalid for occupied-sign analysis.
 *
 * This builder creates a system prompt block that:
 * 1. Injects the pre-computed ground truth.
 * 2. Explicitly forbids rulership/kalapurusha/natural-zodiac reasoning.
 * 3. Makes the constraint hard to ignore right at the point of use.
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
  impactEnglish: string;
  impactTelugu: string;
}

export interface PeriodRelationCheck {
  context: 'NATAL' | 'TRANSIT';
  pairs: PeriodLordPair[];
  afflictedPairs: PeriodLordPair[];
  worstSeverity: 'SEVERE' | 'MODERATE' | 'NONE';
}

export interface InterplanetaryRelationReport {
  natal: PeriodRelationCheck;
  transit: PeriodRelationCheck;
  promptBlock?: string;
}

/**
 * Build a guardrailed system prompt block for the Dwirdwadasha/Shadashtaka rules.
 *
 * @param ipRelations Pre-computed InterplanetaryRelationReport from the TypeScript engine
 * @returns A system prompt block string ready to inject into Gemini's system instruction
 */
export function buildGuardrailedIPBlock(
  ipRelations: InterplanetaryRelationReport
): string {
  const lines: string[] = [
    '',
    '═══════════════════════════════════════════════════════════════════',
    'PERIOD LORD RELATIONS — DWIRDWADASHA (2–12) & SHADASHTAKA (6–8)',
    '═══════════════════════════════════════════════════════════════════',
    '',
    '⚠ CRITICAL CONSTRAINT — ENFORCE STRICTLY:',
    '',
    'These Dwirdwadasha and Shadashtaka relations are determined by the ACTUAL OCCUPIED SIGNS',
    'of the period lords (MD, AD, PD) as they appear in THIS CHART.',
    '',
    'DO NOT reason about these relations from:',
    '  ❌ Sign RULERSHIP (e.g., "Mercury rules Virgo, Venus rules Libra, so they are adjacent")',
    '  ❌ Natural ZODIAC adjacency (Kalapurusha Chakra / natural zodiac positions)',
    '  ❌ Classical own-sign/moolatrikona doctrine',
    '  ❌ Any framework other than the ACTUAL OCCUPIED SIGNS listed below',
    '',
    'If a planet lord occupies a sign, use ONLY that occupied sign. Ignore rulerships.',
    'Example of INVALID reasoning:',
    '  "Mercury rules Virgo, Venus rules Libra. Virgo–Libra are adjacent = Dwirdwadasha"',
    '  This is WRONG. The chart shows Mercury in Scorpio, Venus in Virgo.',
    '  Scorpio–Virgo is NOT a 1-sign separation. The relation is 3–11 (Trisha-Ekadasha).',
    '',
    '═══════════════════════════════════════════════════════════════════',
    '',
  ];

  // Render both natal and transit checks
  lines.push('GROUND TRUTH — ACTUAL OCCUPIED SIGNS:');
  lines.push('');
  if (ipRelations?.natal) {
    renderCheckBlock(lines, ipRelations.natal);
  }
  lines.push('');
  if (ipRelations?.transit) {
    renderCheckBlock(lines, ipRelations.transit);
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════════════════════════');
  lines.push(
    'INSTRUCTION TO LANGUAGE MODEL:',
  );
  lines.push(
    '• If the above shows NO afflicted pairs, state there is NO Dwirdwadasha or Shadashtaka.',
  );
  lines.push(
    '• If the above shows afflicted pairs, cite ONLY the occupied signs and angles listed.',
  );
  lines.push(
    '• If a Dwirdwadasha or Shadashtaka claim cannot be traced to the above list, DELETE it.',
  );
  lines.push(
    '• This is a non-negotiable factual constraint, not a style preference.',
  );
  lines.push('═══════════════════════════════════════════════════════════════════');
  lines.push('');

  return lines.join('\n');
}

/**
 * Helper to render a single PeriodRelationCheck block (NATAL or TRANSIT).
 */
function renderCheckBlock(lines: string[], check: PeriodRelationCheck): void {
  const ctxLabel = check.context === 'NATAL' ? 'NATAL (D-1)' : 'TRANSIT (Gochara)';
  lines.push(`-- ${ctxLabel} PERIOD LORD CHART --`);
  lines.push('');

  (check.pairs || []).forEach((p) => {
    const icon =
      p.severity === 'SEVERE'
        ? '🔴'
        : p.severity === 'MODERATE'
          ? '⚠'
          : '✓';
    lines.push(
      `  ${icon} ${p.label}: ${p.lordA}(OCCUPIED: ${p.signA}) ↔ ${p.lordB}(OCCUPIED: ${p.signB})`
    );
    if (p.relation !== 'NONE') {
      lines.push(`     Relation: ${p.relation} [${p.severity}]`);
    } else {
      lines.push('     Relation: NONE (Neutral / Cooperative)');
    }
  });

  lines.push('');
  if (!check.afflictedPairs || check.afflictedPairs.length === 0) {
    lines.push(
      `✓ Result: NO Dwirdwadasha or Shadashtaka in this ${ctxLabel} chart.`
    );
    lines.push(
      `  If asked about period lord relations in ${ctxLabel}, state this explicitly.`
    );
  } else {
    lines.push(`⚠ Result: ${check.afflictedPairs.length} afflicted pair(s) in ${ctxLabel}:`);
    check.afflictedPairs.forEach((p) => {
      lines.push(`  • ${p.label}: ${p.relation} (${p.severity})`);
      lines.push(`    ✓ ${p.impactEnglish}`);
    });
  }
  lines.push('');
}

/**
 * Alternative: Build a JSON-structured version for passing to Google AI Studio
 * if your workflow prefers structured data over formatted text.
 */
export interface IPBlockJSON {
  metadata: {
    blockType: 'interplanetary_relation_guard';
    version: string;
    timestamp: string;
  };
  constraints: {
    forbidRulership: boolean;
    forbidNaturalZodiac: boolean;
    forbidOwnSignDoctrine: boolean;
    requireActualOccupiedSigns: boolean;
  };
  natalCheck: {
    context: 'NATAL';
    pairs: PeriodLordPair[];
    afflicted: PeriodLordPair[];
    summary: string;
  };
  transitCheck: {
    context: 'TRANSIT';
    pairs: PeriodLordPair[];
    afflicted: PeriodLordPair[];
    summary: string;
  };
  instructions: string[];
}

export function buildGuardrailedIPBlockJSON(
  ipRelations: InterplanetaryRelationReport
): IPBlockJSON {
  return {
    metadata: {
      blockType: 'interplanetary_relation_guard',
      version: '1.0',
      timestamp: new Date().toISOString(),
    },
    constraints: {
      forbidRulership: true,
      forbidNaturalZodiac: true,
      forbidOwnSignDoctrine: true,
      requireActualOccupiedSigns: true,
    },
    natalCheck: {
      context: 'NATAL',
      pairs: ipRelations?.natal?.pairs || [],
      afflicted: ipRelations?.natal?.afflictedPairs || [],
      summary:
        !ipRelations?.natal?.afflictedPairs || ipRelations.natal.afflictedPairs.length === 0
          ? 'No afflictions in natal period lord configuration.'
          : `${ipRelations.natal.afflictedPairs.length} affliction(s) in natal period lords.`,
    },
    transitCheck: {
      context: 'TRANSIT',
      pairs: ipRelations?.transit?.pairs || [],
      afflicted: ipRelations?.transit?.afflictedPairs || [],
      summary:
        !ipRelations?.transit?.afflictedPairs || ipRelations.transit.afflictedPairs.length === 0
          ? 'No afflictions in transit period lord configuration.'
          : `${ipRelations.transit.afflictedPairs.length} affliction(s) in transit period lords.`,
    },
    instructions: [
      'ONLY use ACTUAL OCCUPIED SIGNS to determine Dwirdwadasha/Shadashtaka relations.',
      'NEVER deduce these relations from sign rulership, natural zodiac, or own-sign doctrine.',
      'If no pair is afflicted, explicitly state there is NO such relation.',
      'If a claim cannot be traced to the afflicted pairs list above, delete it.',
      'This is a factual constraint, not a style preference — enforce strictly.',
    ],
  };
}
