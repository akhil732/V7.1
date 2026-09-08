# Jyothishya Sanathanam — Quick Reference Card
## Vedic Consultation Framework v1.0

---

## 📁 Key File Locations

| File | Purpose | Key Function / Export |
|------|---------|-----------------------|
| `SYSTEM_PROMPT_VEDIC_CONSULTATION.md` | Core Parashari prompt | 5-Section Telugu Consultation Schema |
| `QueryProfile.ts` | Domain & House routing | `DOMAIN_HOUSE_MAPPING`, `PRELOADED_QUESTIONS` |
| `GroundTruthBlockGenerator.ts` | 7-section Ground Truth | `generateGroundTruthBlock()` |
| `VedicConsultationGuardrails.ts` | 4 Automated Guardrails | `runConsultationGuardrails()`, `validateConsultationOutput()` |
| `google-ai-studio-handler.ts` | Gemini streaming handler | `handleVedicConsultation()`, `POST` |
| `GOOGLE_AI_STUDIO_INTEGRATION_GUIDE.md` | Step-by-step guide | Instructions, API specs, examples |

---

## 🛡️ 4 Automated Guardrails

| Guardrail | Trigger & Scope | Mitigation & Enforcement |
|-----------|-----------------|--------------------------|
| **1. Post-Processing Validator** | Detects `%` confidence scores, false certainty ("definitely", "guaranteed"), defensive disclaimers ("consult an astrologer") | `validateConsultationOutput()` flags errors; `sanitizeConsultationText()` neutralizes phrasing |
| **2. RAG Citation Engine** | Detects ungrounded claims; verifies planet placements against Ground Truth | Requires `[లగ్న కుండలి]`, `[నవాంశ]` tags; cross-checks planet-sign placements |
| **3. Schema & Completeness** | Validates presence of all 5 sections, Section 5 sub-items (Answer, Timing, Remedies, Cautions), Telugu ratio | `validateConsultationSchema()` parses into typed `ConsultationParsedSections` |
| **4. Domain Hallucination Whitelist** | Detects ungrounded classical yogas (Parivartana, Kala Sarpa) or out-of-domain terms | `validateDomainYogasAndKarakas()` checks `ALLOWED_YOGAS_BY_DOMAIN` & chart mutual exchange |

---

## 🏛️ 5-Section Consultation Structure

Every response strictly delivers:

```
1. లగ్న కుండలి విశ్లేషణ (D-1 Natal Analysis)
   - 1A. లగ్నం & లగ్నాధిపతి (Ascendant & Lord)
   - 1B. ప్రశ్నకు సంబంధిత భావాలు (Relevant Houses & Lords)
   - 1C. కారక గ్రహ స్థితి (Karaka Status)
   - 1D. గ్రహ దృష్టి & యోగాలు (Aspects & Yogas)

2. నవాంశ నిర్ధారణ (D-9 Navamsha Confirmation)
   - 2A. విచారణ-సంబంధిత గ్రహాలు D-9లో
   - 2B. దశా అధిపతులు D-9లో
   - 2C. డెలివరీ మ్యాట్రిక్స్ (Promise vs. Confirmation)

3. దశా-అంతర్దశా విశ్లేషణ (Dasha Activation)
   - 3A. దశా-అంతర్దశా కాలం (Timeline)
   - 3B. MD/AD/PD D-1 విశ్లేషణ
   - 3C. MD/AD/PD D-9 విశ్లేషణ
   - 3D. అంతర్-అధిప సంబంధం (2/12 Dwidwadasha, 6/8 Shadashtaka)

4. గోచార విశ్లేషణ (Gochara from Janma Moon)
   - 4A. దశా అధిపతుల గోచారం
   - 4B. కారక గ్రహ గోచారం (Guru Bala, Saturn, Rahu-Ketu)
   - 4C. సాదేసాతి స్థితి (Sadesati phase)

5. ముగింపు & పరిహారాలు (Conclusion & Remedies)
   - 5A. త్రిస్తర సంశ్లేషణ (Direct Answer)
   - 5B. అనుకూల కాలం (Favorable Window)
   - 5C. నిర్దిష్ట పరిహారాలు (Specific Sattvic Remedies)
   - 5D. జాగ్రత్త సూచనలు (Cautions)
```

---

## 🗺️ Domain House Mapping (Quick Lookup)

| Domain | Primary Houses | Secondary Houses | Natural Karakas | Key Divisional Chart |
|--------|----------------|------------------|-----------------|----------------------|
| **CAREER** | 10 | 6, 7, 2, 11, 1 | Sun, Mercury, Saturn, Jupiter | D-9, D-10 |
| **MARRIAGE** | 7 | 2, 11, 8, 12, 4 | Venus, Jupiter | D-9 |
| **WEALTH** | 2, 11 | 5, 9, 1, 8, 12 | Jupiter, Mercury | D-9, D-2 |
| **HEALTH** | 6, 8 | 1, 12, 3 | Sun, Moon, Saturn, Mars | D-9, D-6, D-8 |
| **SPIRITUALITY** | 9, 12 | 5, 8, 4, 1 | Jupiter, Ketu, Saturn | D-9, D-20 |
| **EDUCATION** | 4, 5 | 9, 2, 1 | Mercury, Jupiter | D-9, D-24 |
| **CHILDREN** | 5 | 9, 2, 11 | Jupiter | D-9, D-7 |
| **FOREIGN_TRAVEL** | 12, 9 | 3, 7, 8, 4 | Rahu, Moon | D-9, D-4 |
| **FAMILY_RELATIONSHIPS** | 2, 4 | 3, 7, 9, 11 | Moon, Sun, Mars, Jupiter | D-9, D-12 |
| **LEGAL_LITIGATION** | 6, 8 | 7, 12, 10, 1 | Mars, Saturn, Rahu | D-9, D-6 |
| **LONGEVITY_AYUR** | 8 | 1, 3, 10, 12, 2, 7 | Saturn | D-9, D-8 |
| **GENERAL_PURPOSE** | 1, 5, 9, 10 | 2, 11, 4, 7 | Sun, Jupiter, Moon | D-9 |

---

## ⚡ Preloaded Questions (q1 to q15)

- `q1`: Job or Business? (Career: 10H, 6H, 7H)
- `q2`: Love Marriage or Arranged? (Marriage: 5H, 7H, Venus)
- `q3`: Why Do People Misunderstand You? (Mind / Family: Moon, Lagna, 8H)
- `q4`: Late Marriage Checker (Marriage: Dasha, 7H, Saturn)
- `q5`: Best Career Field (Career: 10H, Amatyakaraka)
- `q6`: Promotion & Hike Timing (Career: 10H, 11H, Dasha)
- `q7`: Foreign Travel or Settlement (Foreign: 9H, 12H, Rahu)
- `q8`: Will I Be Rich? (Wealth: Dhana yogas, 2H, 11H, Jupiter)
- `q9`: Spiritual Inclination & Moksha (Spirituality: 9H, 12H, Ketu, AK)
- `q10`: Mental Peace & Anxiety (Mind / Health: Moon, 4H, Mercury)
- `q11`: Raja Yogas in My Chart (General: Kendra-Trikona yogas)
- `q12`: Health Vulnerabilities (Health: 6H, 8H)
- `q13`: Children & Progeny Timing (Children: 5H, Jupiter)
- `q14`: Property & Vehicle Purchase (Wealth / Family: 4H, Mars, Venus)
- `q15`: Litigation & Dispute Resolution (Litigation: 6H, Shatru Jayam)

---

## ⚠️ Dwidwadasha / Shadashtaka 9-Pair Audit Matrix (with Directional Asymmetry)

The consultation engine audits **all 3 pairs** (MD-AD, AD-PD, MD-PD) across **all 3 dimensions** (D-1 Natal, D-9 Navamsha, and Current Transit from Moon):

- **9-Pair Matrix:**
  1. **D-1:** MD-AD, AD-PD, MD-PD
  2. **D-9:** MD-AD, AD-PD, MD-PD
  3. **Transit:** MD-AD, AD-PD, MD-PD
- **Directional Counting Rule:**
  - Forward counts calculated Lord 1 → Lord 2 and Lord 2 → Lord 1.
  - Forward counts **2 and 12** → **Dwi-Dwadash (ద్విర్ద్వాదశ)**
  - Forward counts **6 and 8** → **Shadashtak (షడాష్టక)**
- **Directional Asymmetry Meaning:**
  - **Dwi-Dwadash (2/12):**
    - *Lord in 2nd position:* Demands capital, resource outflow, financial strain, family/maraka obligations.
    - *Lord in 12th position:* Experiences dissolution, loss, depletion of foundation, solitude, or fatigue.
  - **Shadashtak (6/8):**
    - *Lord in 6th position:* Drives active opposition, litigation, competition, disease, hard struggle.
    - *Lord in 8th position:* Experiences sudden shock, existential vulnerability, panic, unexpected transformation.
- **Critical Transit Override:** Transit conflicts take precedence in immediate timing. If operating dasha lords are in transit conflict, the current sub-period will face acute friction/delays regardless of natal promise.

---

## 🪐 Sadesati Phases (Saturn from Natal Moon)

- **12th from Moon:** Rising Phase (ప్రారంభ దశ)
- **1st from Moon:** Peak Phase / Janma Shani (జన్మ శని / శిఖర దశ)
- **2nd from Moon:** Setting Phase (ముగింపు దశ)
- **4th from Moon:** Ardhashtama / Kantaka Shani (కంఠక శని)
- **8th from Moon:** Ashtama Shani (అష్టమ శని)

---

## 🚫 Forbidden Patterns (Never Output)

1. No numeric confidence scores (e.g. "78% favorable", "8/10").
2. No false certainty language ("definitely", "certainly", "guaranteed", "ఖచ్చితంగా జరుగుతుంది").
3. No defensive disclaimers ("consult a professional astrologer", "as an AI", "జ్యోతిష్కుడిని సంప్రదించండి").
4. No ungrounded yogas (no inventing Parivartana, Kala Sarpa, etc., unless verified in chart data).
5. No Western astrology terms (Uranus, Neptune, Pluto, trine 120°, square 90°).
6. No data fabrication: if missing from Ground Truth Block, state "డేటా అందుబాటులో లేదు".
7. Never predict from D-1 alone without D-9 confirmation.
8. Never predict events from Gochara without Dasha-Antardasha support.
9. Never write the consultation body purely in English (Telugu is mandatory).
