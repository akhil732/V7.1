/**
 * google-ai-studio-handler.ts
 *
 * Full programmatic integration for Jyothishya Sanathanam Vedic Consultation Engine.
 * Connects QueryProfile routing, GroundTruthBlock assembly, and Gemini API streaming.
 */

import fs from 'fs';
import path from 'path';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import {
  QueryProfile,
  DOMAIN_HOUSE_MAPPING,
  PRELOADED_QUESTIONS,
  DomainType,
} from './QueryProfile';
import {
  generateGroundTruthBlock,
  HoroscopeData,
  GroundTruthBlock,
} from './GroundTruthBlockGenerator';
import {
  validateConsultationOutput,
  validateConsultationSchema,
  validateDomainYogasAndKarakas,
  validateCitationsAndGrounding,
  runConsultationGuardrails,
  sanitizeConsultationText,
  MasterGuardrailResult,
  PostProcessingValidationResult,
  SchemaValidationResult,
  DomainHallucinationValidationResult,
  CitationValidationResult,
} from './VedicConsultationGuardrails';

export {
  validateConsultationOutput,
  validateConsultationSchema,
  validateDomainYogasAndKarakas,
  validateCitationsAndGrounding,
  runConsultationGuardrails,
  sanitizeConsultationText,
};
export type {
  MasterGuardrailResult,
  PostProcessingValidationResult,
  SchemaValidationResult,
  DomainHallucinationValidationResult,
  CitationValidationResult,
};

const GOOGLE_AI_STUDIO_API_KEY =
  process.env.GOOGLE_AI_STUDIO_API_KEY ||
  process.env.GEMINI_API_KEY ||
  '';

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ||
  'gemini-2.5-flash';

// Load system prompt from file system or fallback
function loadSystemPrompt(): string {
  try {
    const candidates = [
      path.resolve(process.cwd(), 'SYSTEM_PROMPT_VEDIC_CONSULTATION.md'),
      path.resolve(process.cwd(), 'src/SYSTEM_PROMPT_VEDIC_CONSULTATION.md'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        return fs.readFileSync(c, 'utf-8');
      }
    }
  } catch (err) {
    console.warn('[google-ai-studio-handler] Warning reading system prompt file:', err);
  }
  return '# JYOTHISHYA SANATHANAM — VEDIC CONSULTATION SYSTEM PROMPT\nParashari Framework Consultation Engine.';
}

export const SYSTEM_PROMPT = loadSystemPrompt();

/**
 * Keyword-based classifier for fast, zero-latency domain routing.
 */
export function matchKeywords(userQuery: string): { domain: DomainType; confidence: number } {
  const q = userQuery.toLowerCase();

  const domainKeywords: Record<DomainType, string[]> = {
    CAREER: ['career', 'job', 'business', 'promotion', 'work', 'profession', 'hike', 'boss', '10th', 'transfer', 'employment'],
    MARRIAGE: ['marriage', 'married', 'love marriage', 'arranged', 'spouse', 'husband', 'wife', 'kalatra', 'partner', 'late marriage', 'delay marriage'],
    WEALTH: ['wealth', 'rich', 'money', 'finance', 'financial', 'dhana', 'property', 'assets', 'income', 'gain', 'vehicle'],
    HEALTH: ['health', 'disease', 'illness', 'mental peace', 'anxiety', 'hospital', 'surgery', 'stress', 'depression'],
    SPIRITUALITY: ['spiritual', 'moksha', 'meditation', 'guru', 'pooja', 'sadhana', 'enlightenment', 'dharma', 'temple'],
    EDUCATION: ['education', 'study', 'studies', 'exam', 'degree', 'college', 'school', 'university', 'learning'],
    CHILDREN: ['child', 'children', 'progeny', 'pregnancy', 'baby', 'son', 'daughter', 'santana', 'putra'],
    FOREIGN_TRAVEL: ['foreign', 'abroad', 'overseas', 'visa', 'relocation', 'travel', 'settlement abroad', 'immigration'],
    FAMILY_RELATIONSHIPS: ['family', 'mother', 'father', 'brother', 'sister', 'parents', 'misunderstand', 'relatives'],
    LEGAL_LITIGATION: ['legal', 'court', 'case', 'lawsuit', 'dispute', 'litigation', 'police', 'jail', 'enemy'],
    LONGEVITY_AYUR: ['longevity', 'ayur', 'lifespan', 'death', 'maraka', 'accidents', 'critical health'],
    GENERAL_PURPOSE: ['raja yoga', 'yogas', 'horoscope', 'future', 'prediction', 'overview', 'general', 'kundali'],
  };

  let bestDomain: DomainType = 'GENERAL_PURPOSE';
  let maxMatches = 0;

  for (const [domain, keywords] of Object.entries(domainKeywords) as [DomainType, string[]][]) {
    let matches = 0;
    for (const kw of keywords) {
      if (q.includes(kw)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestDomain = domain;
    }
  }

  const confidence = maxMatches >= 2 ? 0.95 : maxMatches === 1 ? 0.85 : 0.4;
  return { domain: bestDomain, confidence };
}

/**
 * Fallback semantic classifier via Gemini when keyword confidence is below threshold.
 */
export async function semanticQueryClassification(userQuery: string): Promise<DomainType> {
  if (!GOOGLE_AI_STUDIO_API_KEY) {
    return 'GENERAL_PURPOSE';
  }
  try {
    const ai = new GoogleGenerativeAI(GOOGLE_AI_STUDIO_API_KEY);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Classify this Vedic astrology query into ONE of these exact categories:
CAREER, MARRIAGE, WEALTH, HEALTH, SPIRITUALITY, EDUCATION, CHILDREN, FOREIGN_TRAVEL, FAMILY_RELATIONSHIPS, LEGAL_LITIGATION, LONGEVITY_AYUR, GENERAL_PURPOSE.

Query: "${userQuery}"

Return ONLY the single category name, nothing else.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toUpperCase() as DomainType;
    if (DOMAIN_HOUSE_MAPPING[text]) {
      return text;
    }
  } catch (err) {
    console.error('Semantic classification error:', err);
  }
  return 'GENERAL_PURPOSE';
}

/**
 * Creates or retrieves the QueryProfile for a given domain.
 */
export function createQueryProfile(domain: DomainType): QueryProfile {
  return DOMAIN_HOUSE_MAPPING[domain] || DOMAIN_HOUSE_MAPPING.GENERAL_PURPOSE;
}

/**
 * Resolves user query to a QueryProfile.
 */
export async function recognizeQueryIntent(
  userQuery: string,
  isPreloaded?: string | null
): Promise<QueryProfile> {
  // 1. Check if preloaded ID provided
  if (isPreloaded && PRELOADED_QUESTIONS[isPreloaded]) {
    const p = PRELOADED_QUESTIONS[isPreloaded];
    return createQueryProfile(p.domain);
  }

  // 2. Keyword matching
  const kw = matchKeywords(userQuery);
  if (kw.confidence >= 0.85) {
    return createQueryProfile(kw.domain);
  }

  // 3. Fallback semantic classification
  const semDomain = await semanticQueryClassification(userQuery);
  return createQueryProfile(semDomain);
}

/**
 * Builds the final user prompt injecting the ground truth block and query.
 */
export function buildFullPrompt(userQuery: string, groundTruthBlock: GroundTruthBlock): string {
  return [
    groundTruthBlock.fullBlock,
    '',
    '═══════════════════════════════════════════════════════════════',
    'USER CONSULTATION QUERY',
    '═══════════════════════════════════════════════════════════════',
    userQuery,
    '',
    'Please provide the 5-section Parashari consultation in Telugu strictly adhering to the ground truth data above.',
  ].join('\n');
}

/**
 * Streams the response from Gemini using the specified system prompt and full prompt.
 */
export async function streamGeminiResponse(fullPrompt: string, systemPromptText: string) {
  if (!GOOGLE_AI_STUDIO_API_KEY) {
    throw new Error('GEMINI_API_KEY or GOOGLE_AI_STUDIO_API_KEY is not configured in the environment.');
  }

  const ai = new GoogleGenerativeAI(GOOGLE_AI_STUDIO_API_KEY);
  const model = ai.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPromptText,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const result = await model.generateContentStream(fullPrompt);
  return result.stream;
}

/**
 * Main consultation entry point: orchestrates QueryProfile, GroundTruthBlock, and Gemini Streaming.
 */
export async function handleVedicConsultation(
  userQuery: string,
  horoscopeData: HoroscopeData,
  isPreloaded?: string | null
) {
  // 1. Resolve Query Intent
  const queryProfile = await recognizeQueryIntent(userQuery, isPreloaded);

  // 2. Generate Ground Truth Block
  const groundTruth = await generateGroundTruthBlock(horoscopeData, queryProfile);

  // 3. Assemble Full Prompt
  const actualQuery = isPreloaded && PRELOADED_QUESTIONS[isPreloaded]
    ? PRELOADED_QUESTIONS[isPreloaded].query
    : userQuery;

  const fullPrompt = buildFullPrompt(actualQuery, groundTruth);

  // 4. Stream Gemini Response
  const stream = await streamGeminiResponse(fullPrompt, SYSTEM_PROMPT);

  return {
    stream,
    queryProfile,
    groundTruth,
    fullPrompt,
  };
}

/**
 * HTTP / Express POST Route Handler for Server-Sent Events (SSE).
 */
export async function POST(req: any, res: any) {
  try {
    const { userQuery = '', horoscopeData = {}, isPreloaded = null } = req.body || {};

    if (!userQuery && !isPreloaded) {
      return res.status(400).json({ error: 'Either userQuery or isPreloaded must be provided.' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const { stream, queryProfile, groundTruth } = await handleVedicConsultation(
      userQuery,
      horoscopeData,
      isPreloaded
    );

    // Send metadata chunk
    res.write(`data: ${JSON.stringify({ type: 'QUERY_PROFILE', data: queryProfile })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'GROUND_TRUTH_READY', length: groundTruth.fullBlock.length })}\n\n`);

    // Stream text chunks and accumulate for guardrail verification
    let fullResponse = '';
    for await (const chunk of stream) {
      const text = chunk.text();
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ type: 'CONTENT_CHUNK', data: text })}\n\n`);
      }
    }

    // Run comprehensive guardrails
    const guardrailResult = runConsultationGuardrails(
      fullResponse,
      queryProfile.domain,
      horoscopeData,
      groundTruth
    );

    res.write(`data: ${JSON.stringify({ type: 'GUARDRAIL_VALIDATION', data: guardrailResult })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'COMPLETE' })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error in /api/vedic/consultation:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error?.message || 'Vedic consultation stream failed.' });
    }
    res.write(`data: ${JSON.stringify({ type: 'ERROR', error: error?.message || 'Stream failed' })}\n\n`);
    res.end();
  }
}

/**
 * Executes a full consultation with post-processing, schema, and guardrail validation.
 */
export async function executeVerifiedConsultation(
  userQuery: string,
  horoscopeData: HoroscopeData,
  isPreloaded?: string | null
): Promise<{
  rawResponse: string;
  sanitizedResponse: string;
  guardrailResult: MasterGuardrailResult;
  queryProfile: QueryProfile;
  groundTruth: GroundTruthBlock;
}> {
  const { stream, queryProfile, groundTruth } = await handleVedicConsultation(
    userQuery,
    horoscopeData,
    isPreloaded
  );

  let rawResponse = '';
  for await (const chunk of stream) {
    rawResponse += chunk.text();
  }

  const guardrailResult = runConsultationGuardrails(
    rawResponse,
    queryProfile.domain,
    horoscopeData,
    groundTruth
  );

  return {
    rawResponse,
    sanitizedResponse: guardrailResult.sanitizedResponse,
    guardrailResult,
    queryProfile,
    groundTruth,
  };
}

/**
 * Test utility for verifying the consultation pipeline offline.
 */
export async function testConsultationFlow(
  userQuery: string,
  horoscopeData: HoroscopeData,
  isPreloaded?: string | null
): Promise<{ fullResponse: string; guardrailResult: MasterGuardrailResult }> {
  const { stream, queryProfile, groundTruth } = await handleVedicConsultation(
    userQuery,
    horoscopeData,
    isPreloaded
  );

  console.log(`[TEST] Identified Domain: ${queryProfile.domain}`);
  console.log(`[TEST] Ground Truth Block Length: ${groundTruth.fullBlock.length} chars`);

  let fullResponse = '';
  for await (const chunk of stream) {
    fullResponse += chunk.text();
  }

  const guardrailResult = runConsultationGuardrails(
    fullResponse,
    queryProfile.domain,
    horoscopeData,
    groundTruth
  );

  console.log(`[TEST] Guardrail Status: valid=${guardrailResult.valid}, score=${guardrailResult.score}`);
  if (guardrailResult.errors.length > 0) {
    console.warn('[TEST] Guardrail Errors:', guardrailResult.errors);
  }
  if (guardrailResult.warnings.length > 0) {
    console.log('[TEST] Guardrail Warnings:', guardrailResult.warnings);
  }

  return { fullResponse, guardrailResult };
}
