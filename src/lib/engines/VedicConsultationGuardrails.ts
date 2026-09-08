/**
 * VedicConsultationGuardrails.ts
 *
 * Comprehensive Guardrail Engine for Jyothishya Sanathanam Vedic Consultations:
 * 1. Post-Processing Output Validator (confidence scores, false certainty, defensive disclaimers)
 * 2. Retrieval Augmented Generation (RAG) & Citation Verification (ground truth section cross-checks)
 * 3. Malformed Output Detection & Schema Validation (5 mandatory sections, Section 5 sub-items, Telugu language check)
 * 4. Domain-Specific Hallucination Detection & Whitelisting (allowed yogas, karakas, and houses per domain)
 */

import { DomainType, QueryProfile, DOMAIN_HOUSE_MAPPING } from '../../../QueryProfile';
import { HoroscopeData, GroundTruthBlock, PlanetPosition } from '../../../GroundTruthBlockGenerator';

// ============================================================================
// 1. POST-PROCESSING VALIDATOR INTERFACES & RULES
// ============================================================================

export interface PostProcessingValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  findings: {
    fabricatedConfidenceScores: string[];
    falseCertaintyPhrases: string[];
    defensiveDisclaimers: string[];
  };
}

// Patterns of fabricated confidence scores & ratings
const CONFIDENCE_SCORE_PATTERNS = [
  /\b\d{1,3}\s*%/g,                             // e.g. "95%", "78 %"
  /\b\d{1,2}(?:\.\d+)?\s*\/\s*10\b/g,          // e.g. "8/10", "6.5/10"
  /\b(score|rating|probability|confidence|accuracy|chance):\s*\d+/gi, // e.g. "score: 85"
  /(?:శాతం|స్కోర్|రేటింగ్|ఖచ్చితత్వ శాతం):\s*\d+/g,
];

// Patterns of false certainty language (Parashari astrology is probabilistic & karma-based)
const FALSE_CERTAINTY_PATTERNS = [
  /\bvery likely\b/gi,
  /\bdefinitely\b/gi,
  /\bcertainly\b/gi,
  /\bguaranteed\b/gi,
  /\b100% sure\b/gi,
  /\bundoubtedly\b/gi,
  /\binevitable\b/gi,
  /\babsolutely certain\b/gi,
  /\bwill surely happen\b/gi,
  /\bno doubt that\b/gi,
  // Telugu false certainty phrases
  /ఖచ్చితంగా జరుగుతుంది/g,
  /తప్పకుండా నెరవేరుతుంది/g,
  /ఎటువంటి సందేహం లేదు/g,
  /వంద శాతం నిశ్చయం/g,
  /ఖాయంగా ఫలితం/g,
];

// Patterns of defensive/disclaiming AI boilerplate that degrades consultation authority
const DEFENSIVE_DISCLAIMER_PATTERNS = [
  /\bconsult an astrologer\b/gi,
  /\bconsult a professional astrologer\b/gi,
  /\bprofessional astrologer\b/gi,
  /\bseek professional advice\b/gi,
  /\bconsult your local astrologer\b/gi,
  /\bfor entertainment purposes only\b/gi,
  /\bas an ai\b/gi,
  /\bi am an ai language model\b/gi,
  // Telugu defensive disclaimers
  /జ్యోతిష్కుడిని సంప్రదించండి/g,
  /నిపుణులైన జ్యోతిష్కుడిని అడగండి/g,
  /జ్యోతిష్యుడి సలహా తీసుకోండి/g,
  /నేను కేవలం ఏఐ/g,
];

/**
 * Validates consultation text for fabricated confidence scores, false certainty,
 * and generic defensive disclaimers.
 */
export function validateConsultationOutput(response: string): PostProcessingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const fabricatedConfidenceScores: string[] = [];
  const falseCertaintyPhrases: string[] = [];
  const defensiveDisclaimers: string[] = [];

  // 1. Check for fabricated confidence scores
  for (const pattern of CONFIDENCE_SCORE_PATTERNS) {
    const matches = response.match(pattern);
    if (matches) {
      for (const m of matches) {
        fabricatedConfidenceScores.push(m.trim());
      }
    }
  }
  if (fabricatedConfidenceScores.length > 0) {
    errors.push(
      `Fabricated confidence score detected: [${fabricatedConfidenceScores.join(', ')}]. Parashari astrology strictly prohibits numeric percentage or rating outputs.`
    );
  }

  // 2. Check for false certainty language
  for (const pattern of FALSE_CERTAINTY_PATTERNS) {
    const matches = response.match(pattern);
    if (matches) {
      for (const m of matches) {
        falseCertaintyPhrases.push(m.trim());
      }
    }
  }
  if (falseCertaintyPhrases.length > 0) {
    errors.push(
      `False certainty language detected: [${falseCertaintyPhrases.join(', ')}]. Predictions must use nuanced, condition-based Parashari language.`
    );
  }

  // 3. Check for defensive boilerplate disclaimers
  for (const pattern of DEFENSIVE_DISCLAIMER_PATTERNS) {
    const matches = response.match(pattern);
    if (matches) {
      for (const m of matches) {
        defensiveDisclaimers.push(m.trim());
      }
    }
  }
  if (defensiveDisclaimers.length > 0) {
    errors.push(
      `Defensive disclaimer detected: [${defensiveDisclaimers.join(', ')}]. The consultation must speak with Parashari scholarship rather than AI disclaimer language.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    findings: {
      fabricatedConfidenceScores,
      falseCertaintyPhrases,
      defensiveDisclaimers,
    },
  };
}

/**
 * Sanitizes consultation text by neutralizing false certainty and stripping disclaimers.
 */
export function sanitizeConsultationText(response: string): string {
  let cleaned = response;

  // Neutralize false certainty in English
  cleaned = cleaned.replace(/\bvery likely\b/gi, 'has strong potential to');
  cleaned = cleaned.replace(/\bdefinitely\b/gi, 'is traditionally indicated to');
  cleaned = cleaned.replace(/\bcertainly\b/gi, 'is favorably indicated to');
  cleaned = cleaned.replace(/\bguaranteed\b/gi, 'highly favored');
  cleaned = cleaned.replace(/\bundoubtedly\b/gi, 'prominently');

  // Neutralize false certainty in Telugu
  cleaned = cleaned.replace(/ఖచ్చితంగా జరుగుతుంది/g, 'సంభవించే సంభావ్యత ఎక్కువగా ఉంది');
  cleaned = cleaned.replace(/తప్పకుండా నెరవేరుతుంది/g, 'అనుకూలత బలంగా కనిపిస్తోంది');
  cleaned = cleaned.replace(/ఎటువంటి సందేహం లేదు/g, 'శాస్త్రరీత్యా స్పష్టమైన అనుకూలత ఉంది');

  // Strip defensive disclaimers
  cleaned = cleaned.replace(/\b(?:Please\s+)?consult\s+(?:a\s+)?(?:professional\s+)?astrologer[^\n.]*[.]?/gi, '');
  cleaned = cleaned.replace(/జ్యోతిష్కుడిని\s+సంప్రదించండి[^\n.]*[.]?/g, '');
  cleaned = cleaned.replace(/జ్యోతిష్యుడి\s+సలహా\s+తీసుకోండి[^\n.]*[.]?/g, '');

  // Convert fabricated percentages to qualitative Parashari terms
  cleaned = cleaned.replace(/\b(?:is\s+)?\d{1,3}\s*%\s*(?:supportive|favorable|positive)\b/gi, 'is strongly supportive');
  cleaned = cleaned.replace(/\b\d{1,3}\s*%\s*(?:chance|probability)\b/gi, 'significant potential');
  cleaned = cleaned.replace(/\b\d{1,3}\s*%/g, '');
  cleaned = cleaned.replace(/\b\d{1,2}(?:\.\d+)?\s*\/\s*10\b/g, '');
  cleaned = cleaned.replace(/\b(score|rating|confidence):\s*\d+/gi, '');

  return cleaned.trim();
}

// ============================================================================
// 2. RAG CITATION & GROUNDING VALIDATION
// ============================================================================

export interface CitationValidationResult {
  valid: boolean;
  citationCount: number;
  citations: string[];
  errors: string[];
  warnings: string[];
  verifiedPlacements: string[];
  hallucinatedPlacements: string[];
}

// Allowed RAG citation bracket patterns
const CITATION_BRACKET_REGEX = /\[(?:విభాగం\s*\d|Section\s*\d|లగ్న\s*కుండలి|నవాంశ|దశా|గోచారం|D-1|D-9|MD|AD|Transit|Janma\s*Rasi)[^\]]*\]/gi;

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం'
];

const SIGN_MAP_EN_TE: Record<string, string> = {
  'aries': 'మేషం', 'taurus': 'వృషభం', 'gemini': 'మిథునం', 'cancer': 'కర్కాటకం',
  'leo': 'సింహం', 'virgo': 'కన్య', 'libra': 'తుల', 'scorpio': 'వృశ్చికం',
  'sagittarius': 'ధనుస్సు', 'capricorn': 'మకరం', 'aquarius': 'కుంభం', 'pisces': 'మీనం',
};

const PLANET_MAP_TE: Record<string, string> = {
  'sun': 'రవి', 'moon': 'చంద్రుడు', 'mars': 'కుజుడు', 'mercury': 'బుధుడు',
  'jupiter': 'గురుడు', 'venus': 'శుక్రుడు', 'saturn': 'శని', 'rahu': 'రాహువు', 'ketu': 'కేతువు'
};

/**
 * Validates RAG citations and cross-references planetary assertions against Ground Truth.
 */
export function validateCitationsAndGrounding(
  response: string,
  groundTruth?: GroundTruthBlock,
  horoscopeData?: HoroscopeData
): CitationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const citations: string[] = [];

  // 1. Extract RAG citations
  const matches = response.match(CITATION_BRACKET_REGEX);
  if (matches) {
    for (const m of matches) {
      citations.push(m);
    }
  }

  // Citation threshold: At least 2 citations recommended to anchor claims
  if (citations.length < 2) {
    warnings.push(
      `Low citation density: Found ${citations.length} Ground Truth citations. RAG claims should cite source sections (e.g., [లగ్న కుండలి], [నవాంశ], [దశా], [గోచారం]).`
    );
  }

  // 2. Fact cross-reference against HoroscopeData (if provided)
  const verifiedPlacements: string[] = [];
  const hallucinatedPlacements: string[] = [];

  if (horoscopeData?.chart?.planets) {
    const planets = horoscopeData.chart.planets;

    for (const [planetKey, rawPlanetData] of Object.entries(planets)) {
      const planetData = rawPlanetData as PlanetPosition;
      if (!planetData?.sign) continue;
      const trueSignEn = planetData.sign.toLowerCase();
      const trueSignTe = SIGN_MAP_EN_TE[trueSignEn] || '';
      const planetTe = PLANET_MAP_TE[planetKey.toLowerCase()] || planetKey;

      // Check if text mentions this planet in an incorrect sign
      for (const [otherSignEn, otherSignTe] of Object.entries(SIGN_MAP_EN_TE)) {
        if (otherSignEn === trueSignEn) continue;

        // Pattern: "Venus in Aries" when Venus is actually in Scorpio
        const wrongPlacementEnRegex = new RegExp(`\\b${planetKey}\\s+(?:in|placed in|occupies)\\s+${otherSignEn}\\b`, 'i');
        const wrongPlacementTeRegex = new RegExp(`${planetTe}[^.\\n]{0,30}${otherSignTe}\\s*రాశిలో`, 'i');

        if (wrongPlacementEnRegex.test(response) || wrongPlacementTeRegex.test(response)) {
          const detail = `${planetKey} claimed in ${otherSignEn}/${otherSignTe}, but Ground Truth is ${planetData.sign}`;
          hallucinatedPlacements.push(detail);
          errors.push(`Factual Hallucination: ${detail}`);
        }
      }

      // Check if text correctly mentions true sign
      const truePlacementEnRegex = new RegExp(`\\b${planetKey}\\s+(?:in|placed in|occupies)\\s+${trueSignEn}\\b`, 'i');
      const truePlacementTeRegex = new RegExp(`${planetTe}[^.\\n]{0,30}${trueSignTe}`, 'i');
      if (truePlacementEnRegex.test(response) || truePlacementTeRegex.test(response)) {
        verifiedPlacements.push(`${planetKey} in ${planetData.sign}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    citationCount: citations.length,
    citations,
    errors,
    warnings,
    verifiedPlacements,
    hallucinatedPlacements,
  };
}

// ============================================================================
// 3. SCHEMA & MALFORMED OUTPUT VALIDATOR
// ============================================================================

export interface ConsultationParsedSections {
  section1: { title: string; content: string; hasLagna: boolean; hasHouses: boolean; hasKaraka: boolean };
  section2: { title: string; content: string; hasD9Planets: boolean; hasPromiseMatrix: boolean };
  section3: { title: string; content: string; hasTimeline: boolean; hasInterLordRelation: boolean };
  section4: { title: string; content: string; hasMoonSign: boolean; hasTransits: boolean; hasSadesati: boolean };
  section5: {
    title: string;
    content: string;
    hasDirectAnswer: boolean;
    hasTimingWindow: boolean;
    hasRemedies: boolean;
    hasCautions: boolean;
    remedyCount: number;
    cautionCount: number;
  };
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  teluguRatio: number;
  parsedSections?: ConsultationParsedSections;
}

// Section Header Matchers
const SECTION_1_REGEX = /(?:SECTION\s*1|విభాగం\s*1|లగ్న\s*కుండలి\s*విశ్లేషణ|1\.\s*లగ్న\s*కుండలి)/i;
const SECTION_2_REGEX = /(?:SECTION\s*2|విభాగం\s*2|నవాంశ\s*నిర్ధారణ|2\.\s*నవాంశ\s*నిర్ధారణ)/i;
const SECTION_3_REGEX = /(?:SECTION\s*3|విభాగం\s*3|దశా-అంతర్దశా\s*విశ్లేషణ|3\.\s*దశా-అంతర్దశా)/i;
const SECTION_4_REGEX = /(?:SECTION\s*4|విభాగం\s*4|గోచార\s*విశ్లేషణ|4\.\s*గోచార\s*విశ్లేషణ)/i;
const SECTION_5_REGEX = /(?:SECTION\s*5|విభాగం\s*5|ముగింపు\s*&\s*పరిహారాలు|5\.\s*ముగింపు\s*&\s*పరిహారాలు)/i;

/**
 * Validates the response against the mandatory 5-section Parashari schema,
 * checks Section 5 sub-components (Answer, Timing, Remedies, Cautions),
 * and verifies Telugu language presence.
 */
export function validateConsultationSchema(response: string): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Verify presence of all 5 Sections
  const hasSec1 = SECTION_1_REGEX.test(response);
  const hasSec2 = SECTION_2_REGEX.test(response);
  const hasSec3 = SECTION_3_REGEX.test(response);
  const hasSec4 = SECTION_4_REGEX.test(response);
  const hasSec5 = SECTION_5_REGEX.test(response);

  if (!hasSec1) errors.push('Missing Section 1: Natal Analysis (లగ్న కుండలి విశ్లేషణ)');
  if (!hasSec2) errors.push('Missing Section 2: Navamsha Confirmation (నవాంశ నిర్ధారణ)');
  if (!hasSec3) errors.push('Missing Section 3: Dasha-Antardasha Activation (దశా-అంతర్దశా విశ్లేషణ)');
  if (!hasSec4) errors.push('Missing Section 4: Gochara / Transit (గోచార విశ్లేషణ)');
  if (!hasSec5) errors.push('Missing Section 5: Conclusion & Remedies (ముగింపు & పరిహారాలు)');

  // 2. Language check (Telugu character density)
  const teluguChars = (response.match(/[\u0C00-\u0C7F]/g) || []).length;
  const totalChars = response.replace(/\s+/g, '').length;
  const teluguRatio = totalChars > 0 ? teluguChars / totalChars : 0;

  if (teluguRatio < 0.20) {
    errors.push(
      `Wrong language or insufficient Telugu: Telugu characters make up only ${(teluguRatio * 100).toFixed(1)}% of response. Expected comprehensive Telugu consultation.`
    );
  } else if (teluguRatio < 0.35) {
    warnings.push(
      `Moderate Telugu ratio (${(teluguRatio * 100).toFixed(1)}%). Consider ensuring all explanations are in Telugu.`
    );
  }

  // 3. Section 5 Sub-components Verification
  let sec5Text = '';
  const sec5Match = response.search(SECTION_5_REGEX);
  if (sec5Match !== -1) {
    sec5Text = response.slice(sec5Match);
  }

  const hasDirectAnswer =
    /5A|త్రిస్తర\s*సంశ్లేషణ|తీర్పు|సంశ్లేషణ|Direct\s*Answer|సమాధానం/i.test(sec5Text);
  const hasTimingWindow =
    /5B|అనుకూల\s*కాలం|కాలం|సమయం|Timing\s*Window|కాలవ్యవధి/i.test(sec5Text);
  const hasRemedies =
    /5C|నిర్దిష్ట\s*పరిహారాలు|పరిహారాలు|Remedies|ఆరాధన|దానం/i.test(sec5Text);
  const hasCautions =
    /5D|జాగ్రత్త\s*సూచనలు|జాగ్రత్తలు|Cautions|హెచ్చరికలు/i.test(sec5Text);

  if (hasSec5) {
    if (!hasDirectAnswer) {
      warnings.push('Section 5 is missing explicit 5A Synthesis / Direct Answer (త్రిస్తర సంశ్లేషణ).');
    }
    if (!hasTimingWindow) {
      errors.push('Section 5 is missing 5B Timing Window (అనుకూల కాలం). Must provide clear timing.');
    }
    if (!hasRemedies) {
      errors.push('Section 5 is missing 5C Specific Remedies (నిర్దిష్ట పరిహారాలు). Must provide tailored remedies.');
    }
    if (!hasCautions) {
      errors.push('Section 5 is missing 5D Cautions (జాగ్రత్త సూచనలు). Must provide risk advisories.');
    }
  }

  // Parse sections into structured representation
  const parsedSections: ConsultationParsedSections = {
    section1: {
      title: 'లగ్న కుండలి విశ్లేషణ',
      content: extractSectionContent(response, SECTION_1_REGEX, SECTION_2_REGEX),
      hasLagna: /లగ్నం|లగ్నాధిపతి|Ascendant/i.test(response),
      hasHouses: /భావం|ఇల్లు|House|7వ|10వ|5వ|2వ/i.test(response),
      hasKaraka: /కారక|Karaka/i.test(response),
    },
    section2: {
      title: 'నవాంశ నిర్ధారణ (D-9)',
      content: extractSectionContent(response, SECTION_2_REGEX, SECTION_3_REGEX),
      hasD9Planets: /D-9|నవాంశ/i.test(response),
      hasPromiseMatrix: /పూర్ణ\s*ఫలం|నీచ\s*భంగం|భ్రష్ట|అధమ|నిర్ధారణ|Matrix/i.test(response),
    },
    section3: {
      title: 'దశా-అంతర్దశా విశ్లేషణ',
      content: extractSectionContent(response, SECTION_3_REGEX, SECTION_4_REGEX),
      hasTimeline: /మహాదశ|అంతర్దశ|MD|AD|కాలం|తేదీ/i.test(response),
      hasInterLordRelation: /షడాష్టక|ద్విర్ద్వాదశ|సమసప్తక|సంబంధం|Inter-Lord|2\/12|6\/8/i.test(response),
    },
    section4: {
      title: 'గోచార విశ్లేషణ',
      content: extractSectionContent(response, SECTION_4_REGEX, SECTION_5_REGEX),
      hasMoonSign: /చంద్ర\s*రాశి|జన్మ\s*రాశి|Moon\s*Sign/i.test(response),
      hasTransits: /గోచారం|గురుడు|శని|రాహువు/i.test(response),
      hasSadesati: /ఏలినాటి\s*శని|సాదేసాతి|Sadesati|కంఠక|అష్టమ/i.test(response),
    },
    section5: {
      title: 'ముగింపు & పరిహారాలు',
      content: sec5Text,
      hasDirectAnswer,
      hasTimingWindow,
      hasRemedies,
      hasCautions,
      remedyCount: (sec5Text.match(/(?:[1-3]\.|\*|-)\s*(?:దేవతా|జపం|దానం|వ్రతం|లక్ష్మీ|హనుమాన్|శివ|విష్ణు)/g) || []).length,
      cautionCount: (sec5Text.match(/(?:[1-2]\.|\*|-)\s*(?:జాగ్రత్త|నిర్ణయాలు|తొందరపాటు|ఆరోగ్యం)/g) || []).length,
    },
  };

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    teluguRatio,
    parsedSections,
  };
}

function extractSectionContent(text: string, startRegex: RegExp, nextRegex: RegExp): string {
  const startIdx = text.search(startRegex);
  if (startIdx === -1) return '';
  const afterStart = text.slice(startIdx);
  const nextIdx = afterStart.search(nextRegex);
  if (nextIdx === -1) return afterStart.trim();
  return afterStart.slice(0, nextIdx).trim();
}

// ============================================================================
// 4. DOMAIN-SPECIFIC HALLUCINATION DETECTION & WHITELISTING
// ============================================================================

export const ALLOWED_YOGAS_BY_DOMAIN: Record<DomainType, string[]> = {
  MARRIAGE: [
    'Raja Yoga', 'Rajayoga', 'Neecha Bhanga', 'Neecha Bhanga Raja Yoga',
    'Kuja Dosha', 'Manglik', 'Shukra Balam', 'Guru Balam',
    'Upapada Lagna', 'Kalathra Karaka', 'Parivartana Yoga', 'Dhana Yoga',
    'Shubha Kartari', 'Prakriti Yoga', 'Sama Saptaka', 'Shadashtaka', 'Dwidwadasha'
  ],
  CAREER: [
    'Raja Yoga', 'Amala Yoga', 'Dhana Yoga', 'Karma Jeeva Yoga',
    'Pancha Mahapurusha', 'Bhadra Yoga', 'Ruchaka Yoga', 'Hamsa Yoga',
    'Malavya Yoga', 'Sasa Yoga', 'Viparita Raja Yoga', 'Neecha Bhanga',
    'Gajakesari Yoga', 'Budhaditya Yoga', 'Simhasana Yoga', 'Kahal Yoga',
    'Shadashtaka', 'Dwidwadasha'
  ],
  WEALTH: [
    'Dhana Yoga', 'Lakshmi Yoga', 'Chandra-Mangala Yoga', 'Vasumathi Yoga',
    'Kubera Yoga', 'Raja Yoga', 'Neecha Bhanga', 'Akhanda Samrajya Yoga',
    'Maha Bhagya Yoga', 'Budhaditya Yoga', 'Shadashtaka', 'Dwidwadasha'
  ],
  HEALTH: [
    'Arishta Yoga', 'Balarishta', 'Mrityunjaya', 'Neecha Bhanga',
    'Viparita Raja Yoga', 'Maraka', 'Roga Yoga', 'Kemadruma Yoga',
    'Shadashtaka', 'Dwidwadasha'
  ],
  SPIRITUALITY: [
    'Pravrajya Yoga', 'Sanyasa Yoga', 'Moksha Yoga', 'Pasha Yoga',
    'Hamsa Yoga', 'Brahma Yoga', 'Saraswati Yoga', 'Devata Yoga',
    'Dharma Karmadhipati Yoga'
  ],
  EDUCATION: [
    'Saraswati Yoga', 'Budhaditya Yoga', 'Bhadra Yoga', 'Vidya Yoga',
    'Brahma Yoga', 'Nipuna Yoga', 'Kalanidhi Yoga', 'Raja Yoga', 'Neecha Bhanga'
  ],
  CHILDREN: [
    'Putra Dosha', 'Santana Yoga', 'Purva Punya Yoga', 'Guru Mangala Yoga',
    'Neecha Bhanga', 'Bahusutha Yoga', 'Pitra Dosha'
  ],
  FOREIGN_TRAVEL: [
    'Jala Yoga', 'Pravasa Yoga', 'Videsha Gamana Yoga', '12H Lord Activation',
    'Viparita Raja Yoga', 'Chara Rasi Yoga'
  ],
  FAMILY_RELATIONSHIPS: [
    'Matru Dosha', 'Pitru Dosha', 'Bhratru Yoga', 'Kutumba Yoga',
    'Bandhu Pujya Yoga', 'Shubha Kartari', 'Bhatru Karaka'
  ],
  LEGAL_LITIGATION: [
    'Viparita Raja Yoga', 'Satru Hanta Yoga', 'Ruchaka Yoga', 'Sasa Yoga',
    'Arishta Yoga', 'Bandhana Yoga', 'Shadashtaka'
  ],
  LONGEVITY_AYUR: [
    'Ayur Yoga', 'Deerghayu Yoga', 'Madhyayu Yoga', 'Alpayu Yoga',
    'Maraka Yoga', 'Mrityu Yoga', 'Ashtama Shani', 'Gandanta'
  ],
  GENERAL_PURPOSE: [
    'Raja Yoga', 'Dhana Yoga', 'Gajakesari Yoga', 'Budhaditya Yoga',
    'Pancha Mahapurusha', 'Viparita Raja Yoga', 'Neecha Bhanga',
    'Kemadruma Yoga', 'Amala Yoga', 'Saraswati Yoga', 'Lakshmi Yoga',
    'Kuja Dosha', 'Shadashtaka', 'Dwidwadasha'
  ],
};

// Known Classical Yogas Scanner
const CLASSICAL_YOGA_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: 'Parivartana Yoga', regex: /parivartana\s*yoga|పరివర్తన\s*యోగం/i },
  { name: 'Kala Sarpa Yoga', regex: /kala\s*sarpa|కాలసర్ప\s*దోషం|కాలసర్ప\s*యోగం/i },
  { name: 'Gajakesari Yoga', regex: /gajakesari|గజకేసరి\s*యోగం/i },
  { name: 'Budhaditya Yoga', regex: /budhaditya|బుధాదిత్య\s*యోగం/i },
  { name: 'Amala Yoga', regex: /amala\s*yoga|అమల\s*యోగం/i },
  { name: 'Pancha Mahapurusha', regex: /pancha\s*mahapurusha|పంచమహాపురుష|రుచక|భద్ర|హంస|మాళవ్య|శశ/i },
  { name: 'Viparita Raja Yoga', regex: /viparita\s*raja|విపరీత\s*రాజయోగం/i },
  { name: 'Neecha Bhanga', regex: /neecha\s*bhanga|నీచ\s*భంగ/i },
  { name: 'Chandra-Mangala Yoga', regex: /chandra\s*mangala|చంద్ర\s*మంగళ/i },
  { name: 'Kemadruma Yoga', regex: /kemadruma|కేమద్రుమ\s*యోగం/i },
  { name: 'Guru Chandal Yoga', regex: /guru\s*chandal|గురు\s*చండాల/i },
  { name: 'Kuja Dosha', regex: /kuja\s*dosha|కుజ\s*దోషం|మాంగళిక/i },
  { name: 'Sanyasa Yoga', regex: /sanyasa\s*yoga|సన్యాస\s*యోగం|ప్రవ్రాజ్య/i },
  { name: 'Lakshmi Yoga', regex: /lakshmi\s*yoga|లక్ష్మీ\s*యోగం/i },
];

export interface DomainHallucinationValidationResult {
  valid: boolean;
  domain: DomainType;
  errors: string[];
  warnings: string[];
  detectedYogas: string[];
  allowedYogas: string[];
  unauthorizedYogas: string[];
  unverifiedYogas: string[];
}

/**
 * Validates that mentioned yogas are allowed for the given domain and verifies
 * that complex yogas (like Parivartana, Kala Sarpa, etc.) are actually present
 * in the ground truth rather than invented by the LLM.
 */
export function validateDomainYogasAndKarakas(
  response: string,
  domain: DomainType,
  horoscopeData?: HoroscopeData,
  groundTruthBlock?: GroundTruthBlock
): DomainHallucinationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const allowedYogas = ALLOWED_YOGAS_BY_DOMAIN[domain] || ALLOWED_YOGAS_BY_DOMAIN.GENERAL_PURPOSE;
  const detectedYogas: string[] = [];
  const unauthorizedYogas: string[] = [];
  const unverifiedYogas: string[] = [];

  // 1. Detect classical yogas mentioned in response
  for (const { name, regex } of CLASSICAL_YOGA_PATTERNS) {
    if (regex.test(response)) {
      detectedYogas.push(name);

      // Check domain whitelist
      const isAllowedInDomain = allowedYogas.some(
        (ay) => ay.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(ay.toLowerCase())
      );

      if (!isAllowedInDomain) {
        unauthorizedYogas.push(name);
        warnings.push(
          `Out-of-domain Yoga mentioned: "${name}" is not standardly relevant to ${domain} consultation domain.`
        );
      }

      // Check ground truth presence / verification
      const isMentionedInGroundTruth = groundTruthBlock?.fullBlock
        ? regex.test(groundTruthBlock.fullBlock)
        : false;

      // Special verification for Parivartana Yoga (Mutual Reception)
      if (name === 'Parivartana Yoga') {
        const hasMutualExchange = checkParivartanaExchange(horoscopeData);
        if (!hasMutualExchange && !isMentionedInGroundTruth) {
          unverifiedYogas.push(name);
          errors.push(
            `Hallucinated Yoga: Response claims "${name}", but no mutual sign exchange exists in the natal chart data.`
          );
        }
      }

      // Special verification for Kala Sarpa Yoga
      if (name === 'Kala Sarpa Yoga') {
        const hasKalaSarpa = checkKalaSarpaFormation(horoscopeData);
        if (!hasKalaSarpa && !isMentionedInGroundTruth) {
          unverifiedYogas.push(name);
          errors.push(
            `Hallucinated Yoga: Response claims "${name}", but planetary longitudes do not form a Kala Sarpa pattern.`
          );
        }
      }

      // Special verification for Guru Chandal Yoga (Jupiter + Rahu conjunction)
      if (name === 'Guru Chandal Yoga') {
        const hasGuruChandal = checkGuruChandalFormation(horoscopeData);
        if (!hasGuruChandal && !isMentionedInGroundTruth) {
          unverifiedYogas.push(name);
          errors.push(
            `Hallucinated Yoga: Response claims "${name}", but Jupiter and Rahu are not conjunct in natal chart.`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    domain,
    errors,
    warnings,
    detectedYogas,
    allowedYogas,
    unauthorizedYogas,
    unverifiedYogas,
  };
}

// Helper: Check mutual sign exchange between two planets
function checkParivartanaExchange(horoscopeData?: HoroscopeData): boolean {
  if (!horoscopeData?.chart?.planets) return false;
  const signRulers: Record<string, string> = {
    aries: 'mars', taurus: 'venus', gemini: 'mercury', cancer: 'moon',
    leo: 'sun', virgo: 'mercury', libra: 'venus', scorpio: 'mars',
    sagittarius: 'jupiter', capricorn: 'saturn', aquarius: 'saturn', pisces: 'jupiter'
  };

  const planets = horoscopeData.chart.planets;
  const entries = Object.entries(planets);

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [p1Key, rawP1Data] = entries[i];
      const [p2Key, rawP2Data] = entries[j];
      const p1Data = rawP1Data as PlanetPosition;
      const p2Data = rawP2Data as PlanetPosition;
      if (!p1Data?.sign || !p2Data?.sign) continue;

      const p1SignOwner = signRulers[p1Data.sign.toLowerCase()];
      const p2SignOwner = signRulers[p2Data.sign.toLowerCase()];

      if (p1SignOwner === p2Key.toLowerCase() && p2SignOwner === p1Key.toLowerCase()) {
        return true;
      }
    }
  }
  return false;
}

// Helper: Check Kala Sarpa pattern
function checkKalaSarpaFormation(horoscopeData?: HoroscopeData): boolean {
  if (!horoscopeData?.chart?.planets) return false;
  const rahu = horoscopeData.chart.planets.rahu;
  const ketu = horoscopeData.chart.planets.ketu;
  if (!rahu?.longitude || !ketu?.longitude) return false;
  // If longitudes unavailable or incomplete, return false (cannot claim without data)
  return false;
}

// Helper: Check Guru Chandal (Jupiter + Rahu in same sign)
function checkGuruChandalFormation(horoscopeData?: HoroscopeData): boolean {
  if (!horoscopeData?.chart?.planets) return false;
  const jup = horoscopeData.chart.planets.jupiter;
  const rahu = horoscopeData.chart.planets.rahu;
  if (!jup?.sign || !rahu?.sign) return false;
  return jup.sign.toLowerCase() === rahu.sign.toLowerCase();
}

// ============================================================================
// 5. MASTER UNIFIED GUARDRAIL RUNNER
// ============================================================================

export interface MasterGuardrailResult {
  valid: boolean;
  score: number; // 0 to 100 compliance score
  errors: string[];
  warnings: string[];
  sanitizedResponse: string;
  postProcessing: PostProcessingValidationResult;
  citations: CitationValidationResult;
  schema: SchemaValidationResult;
  domainValidation: DomainHallucinationValidationResult;
}

/**
 * Runs all 4 guardrails in a single unified pipeline:
 * 1. Post-processing validation
 * 2. RAG citations and grounding
 * 3. Malformed output & schema validation
 * 4. Domain-specific yoga whitelisting and hallucination detection
 */
export function runConsultationGuardrails(
  response: string,
  domain: DomainType,
  horoscopeData?: HoroscopeData,
  groundTruthBlock?: GroundTruthBlock
): MasterGuardrailResult {
  // 1. Post-Processing
  const postProc = validateConsultationOutput(response);

  // 2. RAG Citations
  const citations = validateCitationsAndGrounding(response, groundTruthBlock, horoscopeData);

  // 3. Schema & Output completeness
  const schema = validateConsultationSchema(response);

  // 4. Domain & Yoga Whitelisting
  const domainVal = validateDomainYogasAndKarakas(response, domain, horoscopeData, groundTruthBlock);

  // Collect all errors & warnings
  const allErrors = [
    ...postProc.errors,
    ...citations.errors,
    ...schema.errors,
    ...domainVal.errors,
  ];

  const allWarnings = [
    ...postProc.warnings,
    ...citations.warnings,
    ...schema.warnings,
    ...domainVal.warnings,
  ];

  // Calculate Compliance Score (100 base, deductions for errors/warnings)
  let score = 100;
  score -= postProc.errors.length * 15;
  score -= citations.errors.length * 20;
  score -= schema.errors.length * 15;
  score -= domainVal.errors.length * 20;
  score -= allWarnings.length * 3;
  if (score < 0) score = 0;

  // Sanitize text as needed
  const sanitizedResponse = sanitizeConsultationText(response);

  return {
    valid: allErrors.length === 0,
    score,
    errors: allErrors,
    warnings: allWarnings,
    sanitizedResponse,
    postProcessing: postProc,
    citations,
    schema,
    domainValidation: domainVal,
  };
}
