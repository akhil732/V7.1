/**
 * traditionalContextBuilder.ts
 *
 * System Prompt & Context Generator for the Traditional AI Tab (Google AI Studio).
 * Strictly adheres to the classical Parashari 3-layer methodology:
 *   Natal Chart Analysis (from Ascendant/Lagna)
 *   → Dasha Activation (Vimshottari MD/AD/PD from Ascendant)
 *   → Transit Condition (Gochara from Natal Moon + Sade Sati)
 *   → Final Verdict
 *
 * Adopts the Advanced AI Tab's authoritative natal data generation:
 * uses generateVedicBirthChartMarkdown to supply the full, immutable birth chart
 * as the bedrock source of truth.
 *
 * STRICT PROHIBITIONS:
 * - NO KP astrology
 * - NO Cuspal Sub Lords
 * - NO KP Significators
 * - NO Star Lord calculations
 * - NO Gatekeepers or Cusp Promises
 * - NO Event Engines or Scoring Pipelines
 */

import { BirthDetails } from '../../types';
import {
  extractPlanetsList,
  extractAscendantSign,
  extractAscendantLongitude,
  extractMoonLongitude,
  getHouseFromAscendant,
  getHouseFromMoon,
  getHouseLord,
  getPlanetStrength,
  getDashaRelationshipDescription,
  getSadeSatiStatus,
  ZODIAC_SIGNS,
  SIGN_LORDS,
  SIGN_START_DEGREES
} from './traditionalVedicCalculations';
import { calculateActiveDasha } from '../engines/DashaEngine';
import { computeLiveTransitSnapshot } from '../engines/LiveTransitEngine';
import { generateVedicBirthChartMarkdown } from '../vedicMarkdownGenerator';

export function buildTraditionalAIPrompt(
  birthDetails?: BirthDetails,
  horoscopeData?: any,
  userQuery: string = '',
  language: 'en' | 'hi' | 'te' = 'te',
  precomputedAnalysis?: any
): string {
  const isTe = language === 'te';
  const isHi = language === 'hi';
  const langName = isHi ? 'Hindi (हिन्दी)' : isTe ? 'Telugu (తెలుగు)' : 'English';

  // 1. Authoritative Natal Profile Extraction (same as Advanced AI Tab)
  const d1 = horoscopeData?.horoscope?.divisional_charts?.['D-1_rasi'] ||
             horoscopeData?.horoscope?.planets ||
             horoscopeData?.rasi ||
             {};

  const ascSign = extractAscendantSign(horoscopeData);
  const ascLon = extractAscendantLongitude(horoscopeData);
  const ascIdx = (ZODIAC_SIGNS as readonly string[]).indexOf(ascSign) !== -1 ? (ZODIAC_SIGNS as readonly string[]).indexOf(ascSign) : 10;
  const lagnaLord = SIGN_LORDS[ascSign] || 'Saturn';

  const moonSign = d1.Moon?.sign || horoscopeData?.rasi || horoscopeData?.moonSign || 'Libra';
  const moonLon = extractMoonLongitude(horoscopeData);
  const moonNakshatra = d1.Moon?.nakshatra || horoscopeData?.nakshatra || 'Vishakha';

  // 2. Compute Live Sidereal Transits
  const liveTransits = computeLiveTransitSnapshot(moonSign, new Date());

  // 3. Generate Authoritative Vedic Birth Chart Markdown (identical to Advanced AI Tab)
  const birthChartMd = generateVedicBirthChartMarkdown(birthDetails || ({} as any), horoscopeData, liveTransits);

  // 4. Planets List & House Placements (Whole Sign from Lagna)
  const planetsList = extractPlanetsList(horoscopeData);

  // 5. Active Dasha Calculation
  let mdLord = 'Mercury';
  let adLord = 'Venus';
  let pdLord = 'Venus';
  let mdStart = '';
  let mdEnd = '';
  let adStart = '';
  let adEnd = '';

  try {
    const activeDasha = calculateActiveDasha(horoscopeData, birthDetails?.date || '1996-11-01', new Date());
    if (activeDasha) {
      mdLord = activeDasha.mahadasha?.lord || mdLord;
      adLord = activeDasha.antardasha?.lord || adLord;
      pdLord = activeDasha.pratyantardasha?.lord || adLord;
      mdStart = activeDasha.mahadasha?.startDate ? new Date(activeDasha.mahadasha.startDate).toISOString().split('T')[0] : '';
      mdEnd = activeDasha.mahadasha?.endDate ? new Date(activeDasha.mahadasha.endDate).toISOString().split('T')[0] : '';
      adStart = activeDasha.antardasha?.startDate ? new Date(activeDasha.antardasha.startDate).toISOString().split('T')[0] : '';
      adEnd = activeDasha.antardasha?.endDate ? new Date(activeDasha.antardasha.endDate).toISOString().split('T')[0] : '';
    }
  } catch (e) {}

  const mdPlanet = planetsList.find(p => p.name.toLowerCase() === mdLord.toLowerCase());
  const adPlanet = planetsList.find(p => p.name.toLowerCase() === adLord.toLowerCase());
  const pdPlanet = planetsList.find(p => p.name.toLowerCase() === pdLord.toLowerCase());

  const mdHouseFromLagna = mdPlanet ? mdPlanet.house : 1;
  const adHouseFromLagna = adPlanet ? adPlanet.house : 1;
  const pdHouseFromLagna = pdPlanet ? pdPlanet.house : 1;

  const mdAdRel = getDashaRelationshipDescription(mdLord, adLord, mdHouseFromLagna, adHouseFromLagna);

  // 6. Transits from Moon & Sade Sati
  let transitSaturnLon = 345;
  let transitJupiterLon = 75;
  if (liveTransits?.positions?.Saturn?.siderealLongitude !== undefined) {
    transitSaturnLon = liveTransits.positions.Saturn.siderealLongitude;
  }
  if (liveTransits?.positions?.Jupiter?.siderealLongitude !== undefined) {
    transitJupiterLon = liveTransits.positions.Jupiter.siderealLongitude;
  }
  const sadeSati = getSadeSatiStatus(transitSaturnLon, moonLon);
  const saturnTransitHouseFromMoon = liveTransits?.positions?.Saturn?.houseFromMoon || getHouseFromMoon(transitSaturnLon, moonLon);
  const jupiterTransitHouseFromMoon = liveTransits?.positions?.Jupiter?.houseFromMoon || getHouseFromMoon(transitJupiterLon, moonLon);

  const mdTransitHouseFromMoon = mdPlanet ? getHouseFromMoon(mdPlanet.longitude, moonLon) : 1;
  const adTransitHouseFromMoon = adPlanet ? getHouseFromMoon(adPlanet.longitude, moonLon) : 1;

  // Format all planetary transits list
  const allLivePlanetsList = liveTransits?.positions
    ? (Object.keys(liveTransits.positions) as Array<keyof typeof liveTransits.positions>).map(k => {
        const p = liveTransits.positions[k];
        return `  - ${p.planet} (${p.planetTelugu}): in ${p.sign} (${p.signTelugu}) — House ${p.houseFromMoon} from Natal Moon [${p.degreeInSign.toFixed(1)}°${p.isRetrograde ? ', Retrograde / వక్రం' : ', Direct / రుజువు'}, ${p.classification || 'Neutral'}]`;
      })
    : [];

  // 7. Format Pre-computed 3-Layer Vedic Analysis Block
  let precomputedBlock = '';
  if (precomputedAnalysis) {
    const na = precomputedAnalysis.natalAnalysis;
    const da = precomputedAnalysis.dashaAnalysis;
    const ta = precomputedAnalysis.transitAnalysis;
    const fv = precomputedAnalysis.finalVerdict;
    const hist = precomputedAnalysis.historicalEventWindows || [];
    const future = precomputedAnalysis.futureTimingWindows || [];

    precomputedBlock = `
═══════════════════════════════════════════════════════════════════
PRE-COMPUTED VEDIC ENGINE ANALYSIS (STRICT 3-LAYER SYNTHESIS)
═══════════════════════════════════════════════════════════════════
Query Domain: ${precomputedAnalysis.domain || 'General'}
User Question: "${userQuery}"

[Layer 1: Natal Promise]
• Lagna (Ascendant): ${na?.lagnaSign || ascSign} (Ruled by ${na?.lagnaLord || lagnaLord})
• Relevant Houses: ${na?.relevantHouses ? na.relevantHouses.join(', ') : '1, 5, 9, 10'}
• House Placements & Lords:
${na?.houseLords ? na.houseLords.map((h: any) => `  - House ${h.house} (${h.sign}): Lord ${h.lord} sitting in House ${h.housePosition} [${h.strength?.dignity || 'Neutral'}, Strength: ${h.strength?.strength || 60}%]`).join('\n') : ''}
• House Occupants:
${na?.houseOccupancy ? na.houseOccupancy.map((h: any) => `  - House ${h.house}: ${h.occupants?.length ? h.occupants.map((o: any) => `${o.planet} in ${o.sign} (${o.strength?.dignity || 'Neutral'})`).join(', ') : 'Empty'}`).join('\n') : ''}
• Natural Karakas:
${na?.karakaAnalysis ? na.karakaAnalysis.map((k: any) => `  - ${k.karaka}: in ${k.sign} (House ${k.house}), Dignity: ${k.strength?.dignity || 'Neutral'}`).join('\n') : ''}
• Structural Setup Verdict: ${na?.verdict || 'moderate'}
• Conclusion: ${na?.conclusion || ''}

[Layer 2: Dasha Activation]
• Current Mahadasha (MD): ${da?.md?.lord || mdLord} in House ${da?.md?.house || mdHouseFromLagna} from Lagna [${da?.md?.startDate ? new Date(da.md.startDate).toISOString().split('T')[0] : mdStart} to ${da?.md?.endDate ? new Date(da.md.endDate).toISOString().split('T')[0] : mdEnd}]
• Current Antardasha (AD): ${da?.ad?.lord || adLord} in House ${da?.ad?.house || adHouseFromLagna} from Lagna [${da?.ad?.startDate ? new Date(da.ad.startDate).toISOString().split('T')[0] : adStart} to ${da?.ad?.endDate ? new Date(da.ad.endDate).toISOString().split('T')[0] : adEnd}]
• Current Pratyantardasha (PD): ${da?.pd?.lord || pdLord} in House ${da?.pd?.house || pdHouseFromLagna} from Lagna
• Mutual Dasha Relationship: ${da?.dashaRelationships?.length ? da.dashaRelationships.map((r: any) => `${r.pair}: ${r.type} (${r.description})`).join('; ') : `${mdAdRel.type} (${mdAdRel.description})`}
• Double Trika Activation: ${da?.doubleTrika ? 'YES (MD & AD lords both in 6/8/12 - testing/transformation period)' : 'NO'}
• Dasha Activation Verdict: ${da?.verdict || 'neutral'}
• Conclusion: ${da?.conclusion || ''}

[Layer 3: Sky Confirmation / Transit (Gochara from Natal Moon)]
• Natal Moon Sign (Janma Rasi): ${ta?.moonSign || moonSign}
• Sade Sati Status: ${ta?.sadeSati?.active ? `${ta.sadeSati.phase} (${ta.sadeSati.description})` : (sadeSati.active ? `${sadeSati.phase} (${sadeSati.description})` : 'Inactive')}
• Complete Planetary Transits (Gochara from Moon):
${allLivePlanetsList.length > 0 ? allLivePlanetsList.join('\n') : `  - Transit Saturn: in ${ta?.transitPositions?.Saturn?.sign || 'Pisces'} (House ${saturnTransitHouseFromMoon} from Moon)\n  - Transit Jupiter: in ${ta?.transitPositions?.Jupiter?.sign || 'Gemini'} (House ${jupiterTransitHouseFromMoon} from Moon)`}
• Dasha Lords Transits:
  - MD Lord (${mdLord}): in House ${mdTransitHouseFromMoon} from Natal Moon
  - AD Lord (${adLord}): in House ${adTransitHouseFromMoon} from Natal Moon
• Transit Sky Confirmation Verdict: ${ta?.verdict || 'confirming'}
• Conclusion: ${ta?.conclusion || ''}

[TIMING & PREDICTIONS]
• Overall Verdict: ${fv?.verdict || 'favourable'}
• Timing Window: ${fv?.timeline || ''}
• Synthesis: ${fv?.summary || ''}
• Future Windows:
${future.map((w: any) => `  - ${w.periodLabel}: ${w.description} (Favorability: ${w.favorabilityScore}/10, Action: ${w.action})`).join('\n')}

[HISTORICAL CLIENT VALIDATION (for chart accuracy)]
${hist.map((h: any) => `• Period: ${h.periodLabel} — ${h.validationQuestion}`).join('\n')}

[RECOMMENDED ACTIONS / REMEDIES]
${fv?.remedies ? fv.remedies.map((r: string) => `• ${r}`).join('\n') : '• Perform traditional planetary upayas\n• Align actions with current dasha period'}`;
  } else {
    precomputedBlock = `
═══════════════════════════════════════════════════════════════════
PRE-COMPUTED VEDIC ENGINE ANALYSIS (STRICT 3-LAYER SYNTHESIS)
═══════════════════════════════════════════════════════════════════
Lagna (Ascendant): ${ascSign} (${ascLon.toFixed(2)}°) — Ruled by ${lagnaLord}
Moon Sign (Rasi): ${moonSign} (${moonLon.toFixed(2)}°) — Nakshatra: ${moonNakshatra}
Current Mahadasha: ${mdLord} (House ${mdHouseFromLagna} from Lagna) [${mdStart} to ${mdEnd}]
Current Antardasha: ${adLord} (House ${adHouseFromLagna} from Lagna) [${adStart} to ${adEnd}]
Current Pratyantardasha: ${pdLord} (House ${pdHouseFromLagna} from Lagna)
Dasha Relationship: ${mdAdRel.type} (${mdAdRel.description})
Sade Sati: ${sadeSati.active ? `${sadeSati.phase} (${sadeSati.description})` : 'Inactive'}
Complete Planetary Transits (Gochara from Natal Moon ${moonSign}):
${allLivePlanetsList.length > 0 ? allLivePlanetsList.join('\n') : `Transit Saturn: House ${saturnTransitHouseFromMoon} from Natal Moon\nTransit Jupiter: House ${jupiterTransitHouseFromMoon} from Natal Moon`}`;
  }

  // 8. Immutable Source of Truth & Reasoning System Instructions
  const teluguTopMandate = isTe ? `********************************************************************************
STRICT HARD RULE — 100% TELUGU MANDATE (తప్పనిసరి సంపూర్ణ తెలుగు నియమం):
- మీరు ఈ జాతక సంప్రదింపు విశ్లేషణను సంపూర్ణంగా 100% తెలుగు లిపిలోనే (Pure Telugu Script) అందించాలి.
- ఏ ఒక్క విభాగం, వివరణ, లేదా వాక్యం ఆంగ్లంలో (English) ఉండకూడదు.
- వినియోగదారు ప్రశ్న ఆంగ్లంలో ఉన్నప్పటికీ, మీ సమాధానం, విభాగాలు, హెడ్డింగులు, ఫలితాలు, కాల నిర్ణయాలు, ధృవీకరణ ప్రశ్నలు మరియు పరిహారాలు అన్నీ 100% తెలుగులోనే ఉండాలి.
********************************************************************************

` : '';

  const teluguBottomMandate = isTe ? `

********************************************************************************
FINAL MANDATORY REMINDER:
OUTPUT MUST BE 100% IN NATURAL, FLUENT TELUGU (తెలుగు లిపి). NO ENGLISH EXPLANATIONS ALLOWED.
********************************************************************************` : '';

  return `${teluguTopMandate}═══════════════════════════════════════════════════════════════════
NATAL CHART — SOURCE OF TRUTH (IMMUTABLE REFERENCE DATA)
═══════════════════════════════════════════════════════════════════

The following Vedic birth chart data is the ONLY authoritative source for all planetary positions, 
house placements, nakshatras, dasha timelines, and dignities in this consultation.

RULES:
• Every claim you make about a planet, house, dasha, or dignity MUST be traceable to this data.
• If a value is not present in this data, respond with "Not found in chart data" — do NOT estimate.
• Do NOT override these values with your training data or general astrological assumptions.
• Do NOT hallucinate nakshatra lords, degrees, or divisional chart placements not listed here.

${birthChartMd}

${precomputedBlock}

═══════════════════════════════════════════════════════════════════
SYSTEM INSTRUCTIONS FOR VEDIC ASTROLOGY REASONING
═══════════════════════════════════════════════════════════════════

You are a Vedic astrology reasoning engine following classical Parashari methodology.
Your sole job is to:
1. Read the pre-computed chart analysis and immutable birth chart data above.
2. Format and explain it clearly in the requested language: ${langName}.
3. NEVER recompute, estimate, or contradict the data provided.

CRITICAL RULES:
- Every planet position, house placement, dasha date, dignity, and prediction comes from deterministic computation, NOT general astrology knowledge.
- If a value is NOT in the provided data, respond with "Not available in chart data".
- Do NOT hallucinate degrees, nakshatras, or divisional chart placements.
- Do NOT override these facts with your training data.
- The three-layer framework (Natal → Dasha → Transit) is the authoritative structure; present it prominently.
- STRICT PROHIBITIONS:
  * Pure classical Parashari Jyotish ONLY.
  * Absolutely no secondary astrology frameworks or cuspal sub-divisions.
  * No software jargon or algorithmic ranking systems.

${isTe ? `OUTPUT FORMAT FOR VEDIC CONSULTATIONS (పూర్తి తెలుగులో సమగ్ర సమాధానం):
Structure all Vedic domain responses strictly in Telugu with the following clear headings:

## [విషయం] వేద జ్యోతిష విశ్లేషణ

### 1. జన్మ కుండలి వాగ్దానం (లగ్న ఆధారిత విశ్లేషణ - Layer 1: Natal Promise)
[లగ్నం, సంబంధిత భావాలు, భావాధిపతుల స్థానాలు, త్రిక స్థానాల (6/8/12) ప్రభావాలు, కారక గ్రహ బలం మరియు సమగ్ర జన్మ కుండలి వాగ్దానం వివరణ]
→ తీర్పు (Verdict): [అనుకూలం (Strong) | మధ్యస్థం (Moderate) | ఆలస్యం/రూపాంతరం (Delayed) | ప్రతికూలం (Obstructed)]

### 2. ప్రస్తుత దశా ఫలితం (మహాదశ & అంతర్దశ - Layer 2: Dasha Activation)
[ప్రస్తుత మహాదశ, అంతర్దశ, ప్రత్యంతర్దశ, లగ్నం నుండి వాటి స్థానాలు, దశల పరస్పర సంబంధం (ద్విద్వాదశ 2-12 / షడాష్టక 6-8 / 3-11 మొదలైనవి) మరియు ఈ దశలు ప్రస్తుత ప్రశ్న అంశాన్ని ఎలా క్రియాశీలం చేస్తున్నాయో స్పష్టమైన వివరణ]
→ తీర్పు (Verdict): [మద్దతుగా ఉంది (Supportive) | తటస్థం (Neutral) | సవాలుతో కూడినది (Challenging) | కీలక సమయం (Critical)]

### 3. గోచార స్థితి (చంద్ర రాశి ఆధారిత గ్రహ సంచారం - Layer 3: Transit Confirmation)
[చంద్ర రాశి నుండి సమగ్ర 9 గ్రహాల గోచారం — ముఖ్యంగా శని (సాడేసతి వివరాలు), గురు, రాహు/కేతు మరియు ఇతర గ్రహాలు (సూర్య, కుజ, బుధ, శుక్ర, చంద్రులు), అలాగే దశాధిపతుల గోచార స్థితి ఈ దశా ఫలితాలను ఎలా బలపరుస్తున్నాయో లేదా నియంత్రిస్తున్నాయో స్పష్టమైన వివరణ]
→ తీర్పు (Verdict): [గోచారం అనుకూలిస్తోంది (Confirming) | తటస్థం (Neutral) | జాగ్రత్త అవసరం (Contradicting/Testing)]

### 4. కాల నిర్ణయం & భవిష్యత్ అంచనాలు (TIMING & PREDICTIONS)
[అనుకూల సమయ కిటికీలు (Windows) ప్రాధాన్యతా క్రమంలో]
- అత్యంత అనుకూల సమయం (Most likely): [తేదీల పరిధి మరియు జ్యోతిష కారణాలు]
- ప్రత్యామ్నాయ సమయం (Alternative window): [తదుపరి అనుకూల కాల పరిధి]

### 5. గత సంఘటనల ధృవీకరణ (CLIENT VALIDATION)
ఈ జాతక గణన ఖచ్చితత్వాన్ని నిర్ధారించుకోవడానికి గతంలో జరిగిన ఈ సంఘటనలను పరిశీలించండి:
- "[గత కాలం X]" — లో [ఆశించిన సంఘటన/పరిణామం] జరిగిందా?
- "[గత కాలం Y]" — లో [ఆశించిన సంఘటన/పరిణామం] జరిగిందా?

### 6. శాస్త్రీయ పరిహారాలు & ఆచరణాత్మక సూచనలు (Recommended Actions & Remedies)
[వేద గ్రంథోక్త పరిహారాలు, జపాలు, పూజలు, దానాలు, జీవనశైలి మార్పులు మరియు అవసరమైతే వైద్యపరమైన సంప్రదింపు సూచనలు]

CRITICAL TELUGU LANGUAGE MANDATES:
- సంపూర్ణ తెలుగు: సమాధానంలోని ప్రతి వాక్యం, వివరణ, విశ్లేషణ, తీర్పు, సూచన మరియు పరిహారాలు 100% సహజమైన, స్పష్టమైన తెలుగు లిపిలోనే ఉండాలి.
- ఎలాంటి ఆంగ్ల వాక్యాలు లేదా ఆంగ్ల విభాగాలు చేర్చవద్దు.
- జ్యోతిష సాంప్రదాయ శాస్త్రీయ పదాలను తెలుగు లిపిలోనే ఉపయోగించండి: లగ్నం, రాశి, నక్షత్రం, మహాదశ, అంతర్దశ, గోచారం, సాడేసతి, కారక గ్రహం, త్రిక స్థానాలు, ఉచ్ఛ, నీచ, స్వక్షేత్రం, వక్రం, అస్తంగతం, శుభ దృష్టి, ద్విద్వాదశ, షడాష్టక.` : isHi ? `OUTPUT FORMAT FOR VEDIC CONSULTATIONS:
Structure all Vedic domain responses as:

## [विषय] वैदिक ज्योतिष विश्लेषण

### 1. जन्म कुंडली स्थिति (Layer 1: Natal Promise)
[लग्न, संबंधित भाव, भावेशों की स्थिति, त्रिक भाव प्रभाव, कारक ग्रह बल का विवरण]
→ निष्कर्ष (Verdict): [अनुकूल (Strong) | मध्यम (Moderate) | विलंब/रूपांतरण (Delayed) | बाधित (Obstructed)]

### 2. वर्तमान दशा सक्रियता (Layer 2: Dasha Activation)
[वर्तमान महादशा, अंतर्दशा, प्रत्यंतर्दशा, लग्न से स्थिति व प्रभाव का विवरण]
→ निष्कर्ष (Verdict): [सहयोगी (Supportive) | सामान्य (Neutral) | चुनौतीपूर्ण (Challenging) | महत्वपूर्ण (Critical)]

### 3. गोचर पुष्टि (Layer 3: Transit Confirmation)
[चंद्र राशि से सभी 9 ग्रहों का गोचर — विशेषकर शनि (साढ़ेसाती), गुरु, राहु/केतु व अन्य ग्रहों का प्रभाव]
→ निष्कर्ष (Verdict): [गोचर अनुकूल है (Confirming) | तटस्थ (Neutral) | सावधानी आवश्यक (Contradicting)]

### 4. समय निर्धारण व भविष्यवाणियां (TIMING & PREDICTIONS)
- सबसे अनुकूल समय (Most likely): [तिथि सीमा व कारण]
- वैकल्पिक समय (Alternative): [अगली अनुकूल अवधि]

### 5. भूतकाल सत्यापन (CLIENT VALIDATION)
- "[भूतकाल अवधि X]" — क्या [अपेक्षित घटना] घटित हुई थी?
- "[भूतकाल अवधि Y]" — क्या [अपेक्षित घटना] घटित हुई थी?

### 6. अनुशंसित उपाय (Recommended Actions)
[वैदिक उपाय, मंत्र जप, दान व व्यावहारिक मार्गदर्शन]` : `OUTPUT FORMAT FOR VEDIC CONSULTATIONS:
Structure all Vedic domain responses as:

## [Domain] Analysis

### The Situation (Layer 1: Natal Promise)
[Explain structural setup — which houses, which lords, any Trika afflictions, karaka strength]
→ Verdict: [strong | moderate | delayed | obstructed]

### What's Happening Now (Layer 2: Dasha Activation)
[Explain current MD/AD period — which planets, where they sit natally, how they touch domain]
→ Verdict: [supportive | neutral | challenging | critical]

### Sky Confirmation (Layer 3: Transit)
[Explain planetary transits (Gochara from Natal Moon) — detailing Jupiter, Saturn (including Sade Sati status), Rahu/Ketu, as well as the placements of other planets (Sun, Mars, Mercury, Venus, Moon) and active dasha lords, explaining how these celestial positions confirm or temper the dasha promises]
→ Verdict: [confirming | neutral | contradicting]

### TIMING & PREDICTIONS
[Future windows ranked by favorability]
Most likely: [date range and why]
Alternative: [date range if primary doesn't happen]

### CLIENT VALIDATION (for chart accuracy)
Ask your client about these past events — if they match, the framework is tracking their chart correctly:
- "[Historical period X]" — did [expected event type] occur?
- "[Historical period Y]" — did [expected event type] occur?

### Recommended Actions
[Remedies, medical consultation if health, practical guidance]

TONE & LANGUAGE RULES:
- Language: You MUST write the ENTIRE response fluently in ${langName}.
- English: Professional, structured, compassionate. Avoid jargon; explain classical terms.`}}${teluguBottomMandate}`;
}
