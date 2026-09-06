import { useState, useRef, useCallback, useEffect } from 'react';
import {
  EnhancedGeminiConsultationService,
  ConversationMessage,
  ConsultationPersona
} from '../lib/services/EnhancedGeminiConsultationService';
import type { BirthDetails } from '../types';
import { generateVedicBirthChartMarkdown } from '../lib/vedicMarkdownGenerator';
import { computeLiveTransitSnapshot } from '../lib/engines/LiveTransitEngine';
import {
  VedicReasoningLayer,
  inferVedicDomain,
  buildVedicReasoningSection,
} from '../lib/engines/VedicReasoningLayer';
import { computeInterplanetaryRelations } from '../lib/engines/InterplanetaryRelationEngine';
import { calculateActiveDasha } from '../lib/engines/DashaEngine';
import { ASTROLOGICAL_TERMS_MAP } from '../lib/i18n/astrologicalTerms';
import { normalizeTeluguScript } from '../lib/i18n/scriptNormalizer';
import { buildGuardrailedIPBlock } from '../lib/guardrails/InterplanetaryPromptBuilder';
import { validateInterplanetaryClaims } from '../lib/guardrails/InterplanetaryClaimValidator';

interface UseAdvancedAIChatOptions {
  birthData: BirthDetails;
  horoscopeData?: any;
  userId?: string;
  language?: 'en' | 'hi' | 'te';
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: ConversationMessage[];
}

// ─── Build clean system prompt from MD source of truth ──────────────────────

export function buildCleanSystemPromptData(
  birthData: BirthDetails,
  horoscopeData: any,
  userQuery: string,
  language: 'en' | 'hi' | 'te'
): { systemPrompt: string; ipRelations: any } {
  const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';
  const now = new Date();

  // ── Extract D1 natal planet signs ──────────────────────────────────────
  const d1 = horoscopeData?.horoscope?.divisional_charts?.['D-1_rasi'] || horoscopeData?.rasi || {};
  const moonSign = d1.Moon?.sign || 'Aries';

  const allPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const natalSigns: Record<string, string> = {};
  for (const p of allPlanets) {
    if (d1[p]?.sign) natalSigns[p] = d1[p].sign;
  }

  // ── 1. Live transit snapshot (all 9 planets) ────────────────────────────
  const transitData = computeLiveTransitSnapshot(moonSign, now);
  const transitSigns: Record<string, string> = {};
  const transitHouseFromMoon: Record<string, number> = {};
  for (const p of allPlanets) {
    const pos = transitData.positions[p as any];
    if (pos) {
      transitSigns[p] = pos.sign;
      transitHouseFromMoon[p] = pos.houseFromMoon;
    }
  }

  // ── 2. Active Dasha lords ───────────────────────────────────────────────
  let mdPlanet = 'Jupiter';
  let mdSign = natalSigns['Jupiter'] || 'Cancer';
  let adPlanet = 'Saturn';
  let adSign = natalSigns['Saturn'] || 'Capricorn';
  let pdPlanet: string | undefined = undefined;
  let pdSign: string | undefined = undefined;

  try {
    const dashaData = calculateActiveDasha(horoscopeData, birthData.date, now);
    if (dashaData?.mahadasha?.lord) {
      mdPlanet = dashaData.mahadasha.lord;
      mdSign = natalSigns[mdPlanet] || mdSign;
    }
    if (dashaData?.antardasha?.lord) {
      adPlanet = dashaData.antardasha.lord;
      adSign = natalSigns[adPlanet] || adSign;
    }
    if (dashaData?.pratyantardasha?.lord) {
      pdPlanet = dashaData.pratyantardasha.lord;
      pdSign = natalSigns[pdPlanet] || undefined;
    }
  } catch {
    // use defaults
  }

  // ── 3. Interplanetary relations — period lords only (Dwirdwadasha + Shadaṣṭaka) ──
  const ipRelations = computeInterplanetaryRelations({
    mdLord: mdPlanet,
    mdNatalSign: mdSign,
    mdTransitSign: transitSigns[mdPlanet] || mdSign,
    adLord: adPlanet,
    adNatalSign: adSign,
    adTransitSign: transitSigns[adPlanet] || adSign,
    pdLord: pdPlanet,
    pdNatalSign: pdSign,
    pdTransitSign: pdPlanet ? transitSigns[pdPlanet] || pdSign : undefined
  });

  // Guardrailed pre-prompt block that explicitly forbids rulership/natural-zodiac reasoning
  const guardrailedIPBlock = buildGuardrailedIPBlock(ipRelations);

  // ── 4. Full natal chart markdown (source of truth) ─────────────────────
  const birthChartMd = generateVedicBirthChartMarkdown(birthData, horoscopeData, transitData);

  // ── 5. Vedic 3-layer reasoning (Natal → Dasha → Gochara) ───────────────
  const vedicDomain = inferVedicDomain(userQuery);
  const vedicCtx = VedicReasoningLayer.compute(birthData, horoscopeData, vedicDomain, userQuery, now);
  const vedicReasoningMd = buildVedicReasoningSection(vedicCtx, language);

  // ── 6. Terminology glossary ─────────────────────────────────────────────
  const glossary = Object.entries(ASTROLOGICAL_TERMS_MAP).reduce((acc, [, term]) => {
    acc[term.en] = normalizeTeluguScript(term[language]);
    return acc;
  }, {} as Record<string, string>);
  const glossaryBlock = JSON.stringify(glossary, null, 2);

  const systemPrompt = `\
═══════════════════════════════════════════════════════════════════
NATAL CHART — SOURCE OF TRUTH (IMMUTABLE)
═══════════════════════════════════════════════════════════════════

RULES:
• Every claim about a planet, house, dasha, dignity, or transit MUST be traceable to this data.
• If a value is absent, say "Not found in chart data" — never estimate or fabricate.
• Do NOT override these values with training-data assumptions.

${birthChartMd}

═══════════════════════════════════════════════════════════════════
THREE-LAYER VEDIC REASONING (PRE-COMPUTED GROUND TRUTH)
═══════════════════════════════════════════════════════════════════

${vedicReasoningMd}

${guardrailedIPBlock}

═══════════════════════════════════════════════════════════════════
RESPONSE INSTRUCTIONS
═══════════════════════════════════════════════════════════════════

You are an expert Vedic (Parashari) astrologer. Follow these rules:

1. LANGUAGE: Write your ENTIRE response in ${langName}. Use exact terminology below.
2. FRAMEWORK: Structure every answer around the three layers:
   • Layer 1 — నాటల్ ప్రామిస్ (Natal Promise): D-1 Rasi placements, house lords, dignities.
   • Layer 2 — దశ-అంతర్దశ (Dasha-Antardasha): Current MD/AD activation, house connection, and whether active MD/AD/PD lords are in Dwirdwadasha/Shadaṣṭaka relation. IMPORTANT: Do NOT check or compare between natal promise planets and Dasha-Antardasha planets in this section.
   • Layer 3 — గోచార (Transit) ప్రభావం: Live transits of ALL 9 planets from Moon sign. IMPORTANT: The MAIN planets to analyze in Gochara / Transit are those planets involved in BOTH Natal Promise and Dasha-Antardasha.
3. DWIRDWADASHA / SHADAṢṬAKA RULE: When either is present (pre-computed above), you MUST:
   a. State the relation explicitly and its impact.
   b. Qualify predictions — results will be delayed (2-12) or blocked/reversed (6-8).
   c. Compound the effect when BOTH natal Dasha pair AND transit are afflicted simultaneously.
   d. Suggest appropriate classical remedy (mantra, dana, ratna) for the afflicted planet pair.
4. GOCHARA — ALL 9 PLANETS: Do NOT limit transit analysis to Jupiter and Saturn. Cover all 9 grahas. Slow planets (Jupiter, Saturn, Rahu, Ketu) set the macro climate; fast planets (Sun, Moon, Mars, Mercury, Venus) act as triggers. When a fast planet transits into Dwirdwadasha or Shadaṣṭaka with a key natal planet during the current Dasha period, it triggers results (good or bad) of that Dasha.
5. NO KP: Do not use KP terminology (sub-lords, cusps, Placidus, significators L1-L4).
6. NO FABRICATION: If chart data is missing, say "Not found" — never invent positions.
7. QUALITATIVE ONLY: Express strength as Exalted / Own / Friendly / Neutral / Debilitated — no star ratings or percentages.
8. REMEDIES: Match remedies to afflicting planet pairs identified in the Interplanetary Relations block above.

ASTROLOGICAL TERMINOLOGY (use exact forms in ${langName}):
${glossaryBlock}
`;

  return { systemPrompt, ipRelations };
}

function buildCleanSystemPrompt(
  birthData: BirthDetails,
  horoscopeData: any,
  userQuery: string,
  language: 'en' | 'hi' | 'te'
): string {
  return buildCleanSystemPromptData(birthData, horoscopeData, userQuery, language).systemPrompt;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAdvancedAIChat({ birthData, horoscopeData, userId, language = 'en' }: UseAdvancedAIChatOptions) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const activePersona: ConsultationPersona = 'quick';
  const [error, setError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const service = useRef(new EnhancedGeminiConsultationService()).current;

  const saveSessionsToStorage = (updatedSessions: ChatSession[]) => {
    try {
      localStorage.setItem(
        `advanced_ai_sessions_${birthData.name || 'native'}`,
        JSON.stringify(updatedSessions)
      );
    } catch (e) {
      console.warn('Failed to persist sessions:', e);
    }
  };

  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setStreamingText('');
  }, []);

  // Load saved sessions on mount / profile change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`advanced_ai_sessions_${birthData.name || 'native'}`);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatSession[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          const sorted = [...parsed].sort((a, b) => b.timestamp - a.timestamp);
          const active = sorted[0];
          setActiveSessionId(active.id);
          setMessages(active.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })));
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved sessions:', e);
    }

    const initialId = `s_${Date.now()}`;
    const initialSession: ChatSession = {
      id: initialId,
      title: 'కొత్త విశ్లేషణ',
      timestamp: Date.now(),
      messages: []
    };
    setSessions([initialSession]);
    setActiveSessionId(initialId);
    setMessages([]);
  }, [birthData.name]);

  // Sync active session when messages change
  useEffect(() => {
    if (!activeSessionId) return;
    setSessions(prevSessions => {
      const idx = prevSessions.findIndex(s => s.id === activeSessionId);
      if (idx === -1) return prevSessions;

      const current = prevSessions[idx];
      if (
        current.messages.length === messages.length &&
        JSON.stringify(current.messages.map(m => m.content)) ===
          JSON.stringify(messages.map(m => m.content))
      ) {
        return prevSessions;
      }

      let title = current.title;
      if (!title || title === 'కొత్త విశ్లేషణ') {
        const firstUser = messages.find(m => m.role === 'user');
        if (firstUser) {
          title = firstUser.content.slice(0, 30) + (firstUser.content.length > 30 ? '...' : '');
        }
      }

      const updated: ChatSession = { ...current, title, timestamp: Date.now(), messages };
      const next = [...prevSessions];
      next[idx] = updated;
      saveSessionsToStorage(next);
      return next;
    });
  }, [messages, activeSessionId, birthData.name]);

  const startNewSession = useCallback(() => {
    stopGenerating();
    const newId = `s_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'కొత్త విశ్లేషణ',
      timestamp: Date.now(),
      messages: []
    };
    setSessions(prev => {
      const next = [newSession, ...prev];
      saveSessionsToStorage(next);
      return next;
    });
    setActiveSessionId(newId);
    setMessages([]);
  }, [stopGenerating, birthData.name]);

  const loadSession = useCallback((sessionId: string) => {
    stopGenerating();
    const found = sessions.find(s => s.id === sessionId);
    if (found) {
      setActiveSessionId(sessionId);
      setMessages(found.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    }
  }, [sessions, stopGenerating]);

  const deleteSession = useCallback((sessionId: string) => {
    stopGenerating();
    setSessions(prev => {
      const next = prev.filter(s => s.id !== sessionId);
      if (activeSessionId === sessionId) {
        if (next.length > 0) {
          const sorted = [...next].sort((a, b) => b.timestamp - a.timestamp);
          setActiveSessionId(sorted[0].id);
          setMessages(sorted[0].messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })));
        } else {
          const newId = `s_${Date.now()}`;
          const newSession: ChatSession = {
            id: newId,
            title: 'కొత్త విశ్లేషణ',
            timestamp: Date.now(),
            messages: []
          };
          next.push(newSession);
          setActiveSessionId(newId);
          setMessages([]);
        }
      }
      saveSessionsToStorage(next);
      return next;
    });
  }, [activeSessionId, stopGenerating, birthData.name]);

  const clearAllSessions = useCallback(() => {
    stopGenerating();
    const newId = `s_${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'కొత్త విశ్లేషణ',
      timestamp: Date.now(),
      messages: []
    };
    const next = [newSession];
    setSessions(next);
    setActiveSessionId(newId);
    setMessages([]);
    saveSessionsToStorage(next);
  }, [stopGenerating, birthData.name]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendMessage = useCallback(async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: ConversationMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
      metadata: { persona: activePersona }
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setStreamingText('');
    setIsLoading(true);
    setError(null);

    let accumulated = '';

    try {
      // ── Build clean system prompt from MD source of truth ──
      const { systemPrompt, ipRelations } = buildCleanSystemPromptData(birthData, horoscopeData, text, language);

      const res = await fetch('/api/advanced-ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstructionOverride: systemPrompt,
          userQuery: text,
          conversationHistory: newHistory,
          persona: activePersona,
          language: language || 'en',
          ipRelations
        }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        throw new Error(`Server streaming failed with status ${res.status}`);
      }

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (!dataStr) continue;
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setStreamingText(accumulated);
                }
                if (parsed.error) throw new Error(parsed.error);
                if (parsed.done) break;
              } catch {
                // ignore malformed SSE chunks
              }
            }
          }
        }
      }

      // Fallback to non-streaming if stream returned empty
      if (!accumulated.trim()) {
        const fallbackRes = await service.generateConsultationResponse({
          birthData,
          horoscopeData,
          userQuery: text,
          conversationHistory: messages,
          persona: activePersona,
          userId,
          language: language || 'en'
        });
        accumulated = fallbackRes.content;
      }

      // ── Post-generation guardrail validation ──
      if (accumulated && ipRelations) {
        const validation = validateInterplanetaryClaims(accumulated, ipRelations);
        if (!validation.valid) {
          console.warn('[Guardrail] Claim breach detected in model response:', validation.breaches);
        }
      }

      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: accumulated,
        timestamp: new Date(),
        metadata: { persona: activePersona }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingText('');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        if (accumulated.trim()) {
          const partialMessage: ConversationMessage = {
            role: 'assistant',
            content: accumulated + '\n\n*(సంభాషణ నిలిపివేయబడింది)*',
            timestamp: new Date(),
            metadata: { persona: activePersona }
          };
          setMessages(prev => [...prev, partialMessage]);
        }
      } else {
        console.error('Chat stream error:', err);
        setError(err.message || 'Error generating consultation response');
        const fallbackMsg: ConversationMessage = {
          role: 'assistant',
          content: '### సమాచార గమనిక\n\nAI ప్రతిస్పందనను పూర్తి చేయలేకపోయాము. నెట్వర్క్ కనెక్షన్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
          timestamp: new Date(),
          metadata: { persona: activePersona }
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    } finally {
      setIsLoading(false);
      setStreamingText('');
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, activePersona, birthData, horoscopeData, userId, language, service]);

  const changePersona = useCallback((_newPersona: ConsultationPersona) => {
    // No-op: only 'quick' (Telugu AI) persona is active
  }, []);

  return {
    messages,
    isLoading,
    streamingText,
    activePersona,
    error,
    sessions,
    activeSessionId,
    changePersona,
    sendMessage,
    stopGenerating,
    startNewSession,
    loadSession,
    deleteSession,
    clearAllSessions
  };
}
