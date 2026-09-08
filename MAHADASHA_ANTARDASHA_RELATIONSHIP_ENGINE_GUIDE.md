# Mahadasha-Antardasha Relationship Engine Guide

## Overview

The **MahadashaAntardashaRelationshipEngine** (`src/lib/engines/MahadashaAntardashaRelationshipEngine.ts`) is a production-ready system for detecting **Dwidwadasha (2-12)** and **Shadashtaka (6-8)** relationships between Mahadasha (MD), Antardasha (AD), and Pratyantardasha (PD) lords across three chart layers:

1. **D-1 (Natal)** — structural, lifetime-level checks
2. **D-9 (Navamsha)** — dharmic/subtle/marriage-timing checks  
3. **Transit (Gochara from Moon)** — real-time activation checks

This engine is integrated into the **AI consultation framework** (`GroundTruthBlockGenerator.ts`, `useAdvancedAIChat.ts` hook, and `AdvancedAITab.tsx`). Every consultation output includes this relationship audit before generating AI advice.

---

## Core Concepts: The Six Rashi-Kuta Pairings

All two-planet (two-sign) relationships are classified by **sign-to-sign sequential distance**:

| Separation | Pairing | Classical Name | Meaning | AI-Tab Badge |
|:---:|:---:|:---|:---|:---|
| 0 | 1-1 | **Conjoined** | Co-present in same sign | ✓ (no icon) |
| 1, 11 | 2-12 | **Dwidwadasha** | Loss axis; expense, friction, obstruction | ⚠️ **Moderate** |
| 2, 10 | 3-11 | **Sahaja-Labha** | Growth axis; gains, enterprise | ✓ **Beneficial** |
| 3, 9 | 4-10 | **Kendra** | Dynamic effort; action required | ✓ **Favorable** |
| 4, 8 | 5-9 | **Trikona** | Auspicious flow; easy manifestation | ✓ **Highly Favorable** |
| 5, 7 | 6-8 | **Shadashtaka** | Conflict axis; acute tension, calamity, sudden change | ⚠️⚠️ **High/Severe** |
| 6 | 7-7 | **Samasaptaka** | Opposition; mutual awareness, balance needed | ⚠️ **Neutral** |

---

## How It Works: Three-Layer Analysis

### D-1 (Natal)
- Checks the **lifetime occupancy** of MD and AD lords in their natal signs.
- A natal Shadashtaka flags the entire sub-period as carrying dusthana tension.
- A natal Dwidwadasha suggests underlying expense or loss themes.
- **Result:** Structural indicator of how the dasha lords interact at their foundational level.

### D-9 (Navamsha)
- Checks the same MD-AD lord pair in their **Navamsha placements**.
- D-9 is the varga of **dharma (duty/subtle fate)** and **marriage**.
- A **6-8 in Navamsha in marriage context** = status change (can be marriage, breakup, or transformation), not necessarily calamity.
- D-9 is used only as **confirmation of strength**, never as a re-reading of the chart.
- **Result:** Subtle karmic/dharmic friction indicator.

### Transit (Gochara from Moon)
- Checks the **current transiting positions** of MD and AD lords in real time.
- Houses counted from native **Moon sign** (Chandra Rashi).
- Transit 6-8 or 2-12 between MD and AD lords = **immediate timing impediment**.
- Triple confirmation across all three layers elevates "possible" to "likely-to-manifest."
- **Result:** Real-time activation trigger.

---

## Output Format: AI Tab Integration

When you query the AI tab, the engine automatically:

1. **Generates the relationship report** using `generateMahadashaAntardashaReport()`.
2. **Formats it as markdown text** using `formatMahadashaAntardashaReportAsText()`.
3. **Injects it into the AI system prompt** so the Gemini model is aware of conflicts before generating advice.

### Example Output

```
═══════════════════════════════════════════════════════════════
MAHADASHA-ANTARDASHA RELATIONSHIP ANALYSIS
Dwidwadasha (2-12) & Shadashtaka (6-8) Checks
═══════════════════════════════════════════════════════════════

⚠️ CONFLICTS DETECTED:

MD-AD — Risk: Severe
⚠️⚠️ TRANSIT ALERT (MD-AD Shadashtaka): Mars in Leo (4H from Moon) vs Saturn in Aquarius (8H from Moon) — IMMEDIATE TIMING IMPEDIMENT

CRITICAL ALERT:
⚠️⚠️ CRITICAL: Transit Shadashtaka detected. Immediate impact expected. Remedies & patience strongly advised.

RECOMMENDED ACTIONS:
1. Perform immediate remedies: Saturn propitiation, Hanuman puja (if Mars-involved), or suitable Navagraha mantra recitation.
2. Avoid major commitments or large financial decisions during this transit period.
3. Consult a senior Vedic astrologer for personalized remedial measures.
4. Revisit chart after this dasha completes for long-term assessment.
```

---

## API: Key Functions

### High-Level (Exported for External Use)

#### `generateMahadashaAntardashaReport(input: MahadashaAntardashaInput): MahadashaAntardashaRelationshipReport`

Generates the complete multi-layer conflict report.

**Input:**
```typescript
interface MahadashaAntardashaInput {
  mdLord: PlanetName;        // e.g., 'Mercury', 'Venus'
  adLord: PlanetName;        // e.g., 'Mars'
  pdLord?: PlanetName;       // Optional; if provided, AD-PD & MD-PD pairs are also checked
  d1Chart: any;              // Natal chart object
  d9Chart?: any;             // Navamsha chart (optional)
  moonSign: SignName | string;  // Native Moon sign for Gochara house counting
  transitData?: any;         // Current transit positions (optional; will compute if not provided)
}
```

#### `formatMahadashaAntardashaReportAsText(report: MahadashaAntardashaRelationshipReport): string`

Converts the report object into a markdown/text string for display or prompt injection.

### Backward Compatibility

The old `checkSignRelation()` and `evaluateInterLordPair()` functions are **re-exported from the engine** for backward compatibility.
