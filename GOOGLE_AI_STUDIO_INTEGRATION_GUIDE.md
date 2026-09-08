# Google AI Studio Integration Guide
## Jyothishya Sanathanam — Vedic Consultation Engine v1.0

---

## Overview

This guide demonstrates how to set up and run the Vedic consultation system in Google AI Studio using Gemini API.

**Key components:**
1. System Prompt (`SYSTEM_PROMPT_VEDIC_CONSULTATION.md`)
2. Query Profile Routing (`QueryProfile.ts`)
3. Ground Truth Block Generator (`GroundTruthBlockGenerator.ts`)
4. API Handler (`google-ai-studio-handler.ts`)

---

## Quick Start (30 seconds)

### Option A: Copy-Paste into Google AI Studio Chat

1. Go to https://aistudio.google.com/
2. Create a new chat session
3. **Paste the system prompt** into the system instructions (`SYSTEM_PROMPT_VEDIC_CONSULTATION.md`)
4. **Paste the ground truth block** as your first message (`GroundTruthBlock.fullBlock`)
5. **Ask your query** (free text or preloaded question like `[PRELOADED: q2]`)
6. Click "Send" → Gemini streams the full 5-section Parashari consultation in Telugu.

---

## Step-by-Step: Copy-Paste Method

### Step 1: Prepare System Prompt
Open `SYSTEM_PROMPT_VEDIC_CONSULTATION.md` and copy the entire file content.

### Step 2: Prepare Ground Truth Block
Generate the ground truth block using `GroundTruthBlockGenerator.ts`:

```typescript
import { generateGroundTruthBlock } from './GroundTruthBlockGenerator';
import { DOMAIN_HOUSE_MAPPING } from './QueryProfile';

const queryProfile = DOMAIN_HOUSE_MAPPING['MARRIAGE'];
const groundTruth = await generateGroundTruthBlock(horoscopeData, queryProfile);

console.log(groundTruth.fullBlock);
```

### Step 3: Open Google AI Studio
- Navigate to https://aistudio.google.com/
- Click "New chat"

### Step 4: Set System Instructions
1. In the system instructions panel, paste the entire content of `SYSTEM_PROMPT_VEDIC_CONSULTATION.md`.
2. Save instructions.

### Step 5: Paste Ground Truth Block
In the chat input area, paste the ground truth block starting with:
```
═══════════════════════════════════════════════════════════════
NATAL CHART — SOURCE OF TRUTH (IMMUTABLE REFERENCE DATA)
═══════════════════════════════════════════════════════════════
```
Send this message.

### Step 6: Ask Your Query
Send your question in the next message:
```
Love Marriage or Arranged? Does my chart indicate a love 
marriage or arranged marriage based on 5th, 7th houses and Venus?
```
or specify a preloaded ID:
```
[PRELOADED: q2]
```

### Step 7: Receive 5-Section Consultation
Gemini delivers the consultation structured as:
1. లగ్న కుండలి విశ్లేషణ (D-1 Analysis)
2. నవాంశ నిర్ధారణ (D-9 Navamsha Confirmation)
3. దశా-అంతర్దశా విశ్లేషణ (Dasha Activation & Inter-Lord Relationship)
4. గోచార విశ్లేషణ (Gochara from Janma Moon, Sadesati)
5. ముగింపు & పరిహారాలు (Direct Answer, Timing, Sattvic Remedies)

---

## Programmatic Integration (Node.js / TypeScript)

### Install Gemini SDK
```bash
npm install @google/generative-ai
```

### Server Endpoint Integration
In `server.ts`:
```typescript
import { POST as vedicConsultationHandler } from './google-ai-studio-handler';

app.post('/api/vedic/consultation', vedicConsultationHandler);
```

### Use the Handler Directly
```typescript
import { handleVedicConsultation } from './google-ai-studio-handler';

const { stream, queryProfile, groundTruth } = await handleVedicConsultation(
  'Love Marriage or Arranged?',
  horoscopeData,
  null
);

for await (const chunk of stream) {
  console.log(chunk.text());
}
```

---

## API Payload Structure

### Request Payload (`POST /api/vedic/consultation`)
```json
{
  "userQuery": "Love Marriage or Arranged?",
  "horoscopeData": {
    "chart": {
      "lagna": "Aquarius",
      "lagnaLord": "Saturn",
      "planets": {
        "sun": { "sign": "Virgo", "house": 9, "longitude": 150.5 },
        "moon": { "sign": "Gemini", "house": 5, "longitude": 75.2 },
        "mars": { "sign": "Leo", "house": 7, "longitude": 125.0 },
        "mercury": { "sign": "Leo", "house": 7, "longitude": 135.0 },
        "jupiter": { "sign": "Sagittarius", "house": 11, "longitude": 250.0 },
        "venus": { "sign": "Scorpio", "house": 8, "longitude": 220.0 },
        "saturn": { "sign": "Pisces", "house": 2, "longitude": 340.0 },
        "rahu": { "sign": "Virgo", "house": 9, "longitude": 160.0 },
        "ketu": { "sign": "Pisces", "house": 3, "longitude": 340.0 }
      }
    },
    "divisionalCharts": {
      "D-9": {
        "lagna": "Sagittarius",
        "planets": {
          "venus": { "sign": "Taurus", "house": 3 },
          "mercury": { "sign": "Virgo", "house": 10 }
        }
      }
    },
    "dasha": {
      "mahadasha": { "lord": "Mercury", "startDate": "2022-03-17", "endDate": "2039-03-17" },
      "antardasha": { "lord": "Venus", "startDate": "2026-03-17", "endDate": "2029-01-15" }
    },
    "transitData": {
      "jupiter": { "sign": "Taurus" },
      "saturn": { "sign": "Aquarius" },
      "rahu": { "sign": "Pisces" },
      "ketu": { "sign": "Virgo" }
    }
  },
  "isPreloaded": null
}
```

### Response Stream (Server-Sent Events)
```
data: {"type":"QUERY_PROFILE","data":{"domain":"MARRIAGE","primaryHouses":[7],"secondaryHouses":[2,11,8,12,4]}}

data: {"type":"GROUND_TRUTH_READY","length":2450}

data: {"type":"CONTENT_CHUNK","data":"═══════════════════════════════════════════════════════════════\n1. లగ్న కుండలి విశ్లేషణ\n═══════════════════════════════════════════════════════════════\n\nలగ్నం & లగ్నాధిపతి:\nమీది లగ్నం: కుంభం..."}

data: {"type":"COMPLETE"}
```

---

## Example: Full Query-Response Flow

### Input
- **System Prompt:** Full `SYSTEM_PROMPT_VEDIC_CONSULTATION.md`
- **Ground Truth Block:**
```
═══════════════════════════════════════════════════════════════
QUERY CONTEXT
═══════════════════════════════════════════════════════════════
Domain: MARRIAGE
Primary Houses: 7
Secondary Houses: 2, 11
Naisargika Karakas: Venus, Jupiter
...
```
- **User Query:** "Love Marriage or Arranged? Does my chart indicate a love marriage or arranged marriage based on 5th, 7th houses and Venus?"

### Sample Output
```
═══════════════════════════════════════════════════════════════
1. లగ్న కుండలి విశ్లేషణ
═══════════════════════════════════════════════════════════════

లగ్నం & లగ్నాధిపతి:
మీ లగ్నం కుంభం. లగ్నాధిపతి శని 2వ ఇంట (మీనం) స్వక్షేత్ర మిత్ర స్థానంలో ఉన్నారు. 
ఇది కుటుంబ బాధ్యతలు, సంప్రదాయం పట్ల సహజ గౌరవాన్ని సూచిస్తుంది.

ప్రశ్నకు సంబంధిత భావాలు:
7వ ఇల్లు (వివాహం): సింహం. భావాధిపతి సూర్యుడు 9వ ఇంటిలో నీచ స్థితిలో ఉన్నారు.
5వ ఇల్లు (ప్రేమ & పూర్వ పుణ్యం): మిథునం. భావాధిపతి బుధుడు 7వ ఇంట్లో సూర్యునితో కలిసి ఉన్నారు. 
ఇది పరిచయాలు మరియు వ్యక్తిగత ఆకర్షణలకు స్పష్టమైన అనుకూలతను చూపుతుంది.

కారక గ్రహ స్థితి:
వివాహ కారకుడైన శుక్రుడు 8వ ఇంటిలో వృశ్చికంలో ఉన్నారు.

═══════════════════════════════════════════════════════════════
2. నవాంశ నిర్ధారణ (D-9)
═══════════════════════════════════════════════════════════════

D-9 Lagna: ధనుస్సు.

విచారణ-సంబంధిత గ్రహాలు D-9లో:
శుక్రుడు:
  D-1: వృశ్చికం (8H)
  D-9: వృషభం (3H) | Dignity: Own (స్వగృహం)
  Vargottama: No

బుధుడు (MD Lord):
  D-1: సింహం (7H)
  D-9: కన్య (10H) | Dignity: Exalted (ఉచ్ఛ)

డెలివరీ మ్యాట్రిక్స్:
D-1లో 8వ ఇంటిలో ఉన్న శుక్రుడు D-9లో స్వక్షేత్రంలో ఉండటం ద్వారా వైవాహిక జీవితంలో ప్రారంభ ప్రతిబంధకాలు ఉన్నప్పటికీ దీర్ఘకాలిక స్థిరత్వం లభిస్తుందని ధ్రువీకరిస్తోంది.

═══════════════════════════════════════════════════════════════
3. దశా-అంతర్దశా విశ్లేషణ
═══════════════════════════════════════════════════════════════

ప్రస్తుత దశా కాలం: బుధ మహాదశ (2022-2039) లో శుక్ర అంతర్దశ (2026-2029).
- బుధుడు (MD Lord): 5వ భావాధిపతి, 7వ ఇంట్లో ఉన్నారు. వివాహ కార్యకారణాలను ప్రేరేపిస్తున్నారు.
- శుక్రుడు (AD Lord): నైసర్గిక కళత్రకారకుడు.
- అంతర్-అధిప సంబంధం: D-1లో బుధ-శుక్రుల మధ్య 2/12 (ద్విర్ద్వాదశ) అక్షం ఉంది. ఖర్చులు మరియు సర్దుబాట్ల అవసరాన్ని ఇది సూచిస్తోంది.

═══════════════════════════════════════════════════════════════
4. గోచార విశ్లేషణ
═══════════════════════════════════════════════════════════════

జన్మ రాశి: మిథునం.
- గురు గోచారం: వృషభంలో 12వ ఇంట గోచారం వల్ల గురుబలం మధ్యమంగా ఉంది.
- శని గోచారం: కుంభంలో 9వ ఇంట గోచారం. భాగ్య స్థాన సంచారం వల్ల బాధ్యతలు పెరుగుతాయి.
- సాదేసాతి స్థితి: ప్రస్తుతం జన్మ రాశి నుండి శని 9వ ఇంట ఉన్నందున ఏలినాటి శని క్రియాశీలంగా లేదు.

═══════════════════════════════════════════════════════════════
5. ముగింపు & పరిహారాలు
═══════════════════════════════════════════════════════════════

త్రిస్తర సంశ్లేషణ:
మీ జాతకంలో 5వ అధిపతి బుధుడు 7వ ఇంట్లో ఉండటం ప్రేమ వివాహ మొగ్గును బలంగా సూచిస్తుంది. అయితే 7వ అధిపతి 9వ ఇంట ఉండటం, లగ్నాధిపతి 2వ ఇంట ఉండటం కుటుంబ పెద్దల ఆశీస్సులు తప్పనిసరి అని స్పష్టం చేస్తున్నాయి.
**తీర్పు: ఇది ప్రేమ వివాహమే అయినప్పటికీ, పెద్దల సమ్మతితో కూడిన అర్ధ-ప్రేమ (Semi-Arranged) వివాహంగా రూపుదిద్దుకుంటుంది.**

అనుకూల కాలం:
బుధ మహాదశలో శుక్ర అంతర్దశ కాలం (2026 చివరి నుండి 2028 ప్రథమార్ధం) వివాహ ప్రయత్నాలకు అత్యంత అనుకూలం.

నిర్దిష్ట పరిహారాలు:
1. శుక్రుని అనుగ్రహం కోసం ప్రతి శుక్రవారం మహాలక్ష్మీ అష్టకం పఠించడం, తెల్లని పూలతో పూజించడం.
2. బుధుని బలం కోసం బుధవారం విష్ణు సహస్రనామ స్తోత్ర పారాయణ చేయడం.

జాగ్రత్త సూచనలు:
- శుక్రుడు 8వ ఇంట్లో ఉండటం వల్ల వివాహానికి ముందు జాతక పొంతన, కుజదోష విశ్లేషణ క్షుణ్ణంగా చేసుకోవడం అవసరం.
- తొందరపాటు భావోద్వేగ నిర్ణయాలు కాకుండా కుటుంబ సంప్రదింపులతో ముందుకు సాగడం శ్రేయస్కరం.
```

---

## Automated Guardrails & Post-Processing Validation

The framework implements 4 mandatory guardrails via `VedicConsultationGuardrails.ts` to prevent hallucinations and maintain Parashari integrity:

### 1. Post-Processing Validator (`validateConsultationOutput`)
- **Fabricated Confidence Scores:** Strictly rejects arbitrary numeric percentages (`95%`, `78% favorable`) or rating ratios (`8/10`).
- **False Certainty Language:** Rejects absolute assertions (`definitely`, `certainly`, `guaranteed`, `ఖచ్చితంగా జరుగుతుంది`). Predictions must be condition-based.
- **Defensive Disclaimers:** Eliminates defensive AI disclaimers (`consult an astrologer`, `జ్యోతిష్కుడిని సంప్రదించండి`) to preserve scholarly consultation authority.
- **Auto-Sanitizer:** `sanitizeConsultationText()` converts false certainty into nuanced Parashari phrasing and strips AI boilerplates.

### 2. Retrieval-Augmented Generation (RAG) & Citation Verification (`validateCitationsAndGrounding`)
- Mandates section citations in brackets: `[లగ్న కుండలి]`, `[నవాంశ నిర్ధారణ]`, `[దశా కాలం]`, `[గోచారం]`.
- Cross-references claimed planetary placements (sign and house) against the natal chart data in the Ground Truth Block.
- Flags `Factual Hallucination` if a planet's sign or house deviates from the immutable ground truth data.

### 3. Schema & Completeness Validator (`validateConsultationSchema`)
- Enforces the presence of all 5 mandatory sections.
- Verifies Section 5 sub-components:
  - 5A. Direct Answer / Synthesis (త్రిస్తర సంశ్లేషణ)
  - 5B. Timing Window (అనుకూల కాలం)
  - 5C. Specific Sattvic Remedies (నిర్దిష్ట పరిహారాలు)
  - 5D. Cautions & Risk Advisories (జాగ్రత్త సూచనలు)
- Checks language ratio to ensure consultation body is predominantly in Telugu script (`\u0C00-\u0C7F`).

### 4. Domain-Specific Hallucination Whitelist (`validateDomainYogasAndKarakas`)
- Whitelists permissible classical yogas per domain (`ALLOWED_YOGAS_BY_DOMAIN`).
- **Mutual Reception Verification:** Automatically verifies whether claimed *Parivartana Yogas* genuinely have mutual sign exchange in the chart data.
- **Planetary Pattern Verification:** Verifies *Kala Sarpa*, *Guru Chandal*, and *Kuja Dosha* claims against actual planetary positions.

```typescript
import { runConsultationGuardrails } from './VedicConsultationGuardrails';

const validation = runConsultationGuardrails(
  responseContent,
  queryProfile.domain,
  horoscopeData,
  groundTruthBlock
);

console.log(`Validation valid: ${validation.valid}, Compliance score: ${validation.score}/100`);
```

---

## Troubleshooting

- **Issue:** `Ground truth data is empty`  
  **Fix:** Check that horoscope data is loaded before generating block. `GroundTruthBlockGenerator.ts` provides default fallback positions when ephemeris is missing.
- **Issue:** `Query domain not recognized`  
  **Fix:** The keyword matcher has confidence scoring. If `<0.85`, it automatically falls back to Gemini semantic classification.
- **Issue:** `Sadesati not computed`  
  **Fix:** Ensure `transitData.Saturn.sign` is supplied. The engine counts distance from natal Moon sign.
- **Issue:** `Telugu text garbled`  
  **Fix:** UTF-8 encoding is enabled by default in all handler responses. Ensure font supports Telugu Unicode.
- **Issue:** `Guardrail error: Fabricated confidence score detected`  
  **Fix:** Gemini occasionally outputs percentages; `sanitizeConsultationText()` automatically strips these or converts them to qualitative Parashari dignities.

---

## Production Checklist

- [x] System prompt configured in Google AI Studio
- [x] Gemini API key configured in `.env` (`GEMINI_API_KEY`)
- [x] QueryProfile domain mapping verified
- [x] Ground truth block generation active
- [x] Sadesati phase calculation accurate from natal Moon
- [x] D-9 cross-reference logic active
- [x] Post-processing validator active (`validateConsultationOutput`)
- [x] RAG citation requirements & placement cross-checks active (`validateCitationsAndGrounding`)
- [x] 5-Section schema & Telugu language validator active (`validateConsultationSchema`)
- [x] Domain yoga whitelisting and mutual reception checks active (`validateDomainYogasAndKarakas`)
- [x] Server endpoint mounted at `/api/vedic/consultation`
- [x] Preloaded questions linked (q1-q15)
- [x] Clean error and timeout handling
- [x] Telugu rendering verified

---

**Last Updated:** September 2026  
**Framework Version:** 1.0 / v7.1 Engine with 4-Tier Guardrails  
**Status:** Production Ready
