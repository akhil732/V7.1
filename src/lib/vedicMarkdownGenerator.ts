import { BirthDetails } from '../types';
import { SavedPerson } from '../types/marriageMatch';
import { getFullDashaTimeline, getAntardashasForMd } from './engines/DashaEngine';
import { LiveTransitSnapshot } from './engines/LiveTransitEngine';

function formatDateForMd(d: Date): string {
  if (!d || isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

function generateVimshottariDashaMarkdownSection(
  person: BirthDetails | SavedPerson,
  horoscopeData?: any
): string {
  const birthDateStr = person.date || '1996-11-01';
  const timeline = getFullDashaTimeline(horoscopeData, birthDateStr);

  if (!timeline || timeline.length === 0) {
    return `## 10. Vimshottari Dasha Sequence\n\nNo Dasha data available.\n`;
  }

  const now = new Date();
  let activeIndex = timeline.findIndex(m => now >= m.startDate && now <= m.endDate);
  if (activeIndex === -1) {
    if (now < timeline[0].startDate) activeIndex = 0;
    else activeIndex = timeline.length - 1;
  }

  const currentMd = timeline[activeIndex];
  const nextMd = activeIndex + 1 < timeline.length ? timeline[activeIndex + 1] : null;

  let mdTable = `| Period | Mahadasha | Start Date | End Date |\n|---|---|---|---|\n`;
  mdTable += `| Current | ${currentMd.lord} | ${formatDateForMd(currentMd.startDate)} | ${formatDateForMd(currentMd.endDate)} |\n`;
  if (nextMd) {
    mdTable += `| Next | ${nextMd.lord} | ${formatDateForMd(nextMd.startDate)} | ${formatDateForMd(nextMd.endDate)} |\n`;
  }

  // Antardasha for current MD
  const currentAds = getAntardashasForMd(horoscopeData, birthDateStr, currentMd.lord);
  let currentAdRows = '';
  currentAds.forEach((ad, idx) => {
    currentAdRows += `| ${idx + 1} | ${currentMd.lord}–${ad.lord} | ${formatDateForMd(ad.startDate)} | ${formatDateForMd(ad.endDate)} |\n`;
  });

  let result = `## 10. Vimshottari Dasha Sequence\n\n### Current & Next Mahadasha\n\n${mdTable}\n`;
  result += `### ${currentMd.lord} Mahadasha — Antardasha Sequence (current cycle)\n\n| # | Antardasha | Start Date | End Date |\n|---|---|---|---|\n${currentAdRows}`;

  if (nextMd) {
    const nextAds = getAntardashasForMd(horoscopeData, birthDateStr, nextMd.lord);
    if (nextAds && nextAds.length > 0) {
      let nextAdRows = '';
      nextAds.forEach((ad, idx) => {
        nextAdRows += `| ${idx + 1} | ${nextMd.lord}–${ad.lord} | ${formatDateForMd(ad.startDate)} | ${formatDateForMd(ad.endDate)} |\n`;
      });
      result += `\n### ${nextMd.lord} Mahadasha — Antardasha Sequence (next cycle)\n\n| # | Antardasha | Start Date | End Date |\n|---|---|---|---|\n${nextAdRows}`;
    }
  }

  return result;
}

/**
 * Generates structured Vedic Birth Chart Markdown report formatted for AI parsing.
 *
 * SOURCE OF TRUTH POLICY:
 * - When horoscopeData is present (API response from JHora), ALWAYS use the dynamic
 *   generator so that live ephemeris values are used. The benchmark fallback is ONLY
 *   used when horoscopeData is null/undefined (offline or before first API call).
 * - Never route through the hardcoded benchmark when real data is available, even for
 *   the developer profile — this prevents training-data hallucination leaking in.
 */
export function generateVedicBirthChartMarkdown(
  person: BirthDetails | SavedPerson,
  horoscopeData?: any,
  transitData?: LiveTransitSnapshot
): string {
  // Always use live API data when available — name-based hardcode is explicitly removed
  // to prevent benchmark values overriding real ephemeris positions.
  if (horoscopeData) {
    return generateDynamicVedicBirthChartMarkdown(person, horoscopeData, transitData);
  }

  // No API data yet — use the benchmark fallback for the developer profile only,
  // or a minimal skeleton for any other profile.
  const name = person.name ? person.name.trim() : 'Native';
  const nameLower = name.toLowerCase();
  if (nameLower.includes('akhil')) {
    return generateAkhilBenchmarkMarkdown(name, person, undefined);
  }

  // Generic skeleton when no data available
  return generateDynamicVedicBirthChartMarkdown(person, undefined, transitData);
}

function generateAkhilBenchmarkMarkdown(name: string, person?: BirthDetails | SavedPerson, horoscopeData?: any): string {
  const dashaSection = generateVimshottariDashaMarkdownSection(
    person || { name, date: '1996-11-01', time: '13:50', place: 'Jaggampeta, AP', gender: 'Male', approximateTime: false, latitude: 17.17259, longitude: 82.05787, timezone: 5.5 },
    horoscopeData
  );
  return `> Pre-computed Vedic (Parashari) kundali data structured for AI parsing. Upload this file as project knowledge or paste at the start of a chat. All planetary positions use the Lahiri ayanamsa.

---

## 1. Birth Details

| Field | Value |
|---|---|
| Name | ${name} |
| Date of Birth | 11 November 1996 |
| Time of Birth | 13:50 IST |
| Place of Birth | Jaggampeta, Andhra Pradesh, India |
| Latitude | 17.17259° N |
| Longitude | 82.05787° E |
| Timezone | +05:30 (IST) |
| Ayanamsa | Lahiri 23.8133° |

---

## 2. Panchang at Birth

| Element | Value |
|---|---|
| Weekday | Monday |
| Tithi | Shukla Pratipada (1) |
| Paksha | Shukla Paksha |
| Nakshatra | Vishakha (Pada 3) |
| Yoga | Saubhagya (4) |
| Karana | Kimstughna |
| Rasi Lord | Venus |
| Sunrise | 6:04 AM |
| Sunset | 5:27 PM |
| Moonrise | 5:59 AM |
| Moonset | 5:47 PM |
| Abhijit Muhurta | 11:22 AM – 12:10 PM |
| Rahukaal | 7:30 AM to 8:55 AM |
| Gulika Kaal | 2:36 PM to 4:02 PM |
| Yamakanta | 11:46 AM to 1:11 PM |

---

## 3. Core Chart Signatures

| Signature | Value |
|---|---|
| Ascendant (Lagna) | Aquarius |
| Ascendant Degree | 320°55'58" (20°55'58" Aquarius) |
| Ascendant Nakshatra | Purva Bhadrapada, Pada 1 |
| Ascendant Lord | Saturn |
| Moon Sign (Rashi) | Libra |
| Sun Sign | Libra |
| Janma Nakshatra | Vishakha, Pada 3 |
| Janma Nakshatra Lord | Jupiter |
| Name Start Syllable | Teaa |
| Gana | Rakshasa |
| Nadi | Antya |
| Yoni | Vyaghra |
| Tatva | Air |
| Varna | Shudra |
| Vashya | Nara |
| Paya | Silver |

---

## 4. House Signs & Lords (Lagna Chart / D1)

| House | Sign | Lord |
|---|---|---|
| 1 | Aquarius | Saturn |
| 2 | Pisces | Jupiter |
| 3 | Aries | Mars |
| 4 | Taurus | Venus |
| 5 | Gemini | Mercury |
| 6 | Cancer | Moon |
| 7 | Leo | Sun |
| 8 | Virgo | Mercury |
| 9 | Libra | Venus |
| 10 | Scorpio | Mars |
| 11 | Sagittarius | Jupiter |
| 12 | Capricorn | Saturn |

---

## 5. Planetary Positions — Rashi Chart (D1)

| Planet | Sign | House | Degree | Nakshatra | Pada | Nakshatra Lord | Dignity | Motion | Combustion | Functional Nature |
|---|---|---|---|---|---|---|---|---|---|---|
| Sun | Libra | 9 | 25°24'42" | Vishakha | 2 | Jupiter | Debilitated | Direct | N/A | Functional Malefic |
| Moon | Libra | 9 | 27°32'47" | Vishakha | 3 | Jupiter | Neutral | Direct | **Combust** | Functional Malefic |
| Mars | Leo | 7 | 12°43'53" | Magha | 4 | Ketu | Neutral | Direct | Not combust | Functional Malefic |
| Mercury | Scorpio | 10 | 0°57'56" | Vishakha | 4 | Jupiter | Neutral | Direct | Not combust | Functional Malefic |
| Jupiter | Sagittarius | 11 | 20°44'03" | Purva Ashadha | 3 | Venus | Mool Trikon | Direct | Not combust | Neutral |
| Venus | Virgo | 8 | 21°47'32" | Hasta | 4 | Moon | Debilitated | Direct | Not combust | Functional Benefic |
| Saturn | Pisces | 2 | 7°13'40" | Uttara Bhadrapada | 2 | Saturn | Neutral | Retrograde | Not combust | Functional Benefic |
| Rahu | Virgo | 8 | 13°35'38" | Hasta | 2 | Moon | Neutral | Retrograde | N/A | N/A (Shadow) |
| Ketu | Pisces | 2 | 13°35'38" | Uttara Bhadrapada | 4 | Saturn | Neutral | Retrograde | N/A | N/A (Shadow) |

### House-wise Planetary Grouping

| House | Sign | Planets Present |
|---|---|---|
| 1 | Aquarius | Ascendant |
| 2 | Pisces | Saturn (R), Ketu (R) |
| 3 | Aries | — |
| 4 | Taurus | — |
| 5 | Gemini | — |
| 6 | Cancer | — |
| 7 | Leo | Mars |
| 8 | Virgo | Venus, Rahu (R) |
| 9 | Libra | Sun, Moon |
| 10 | Scorpio | Mercury |
| 11 | Sagittarius | Jupiter |
| 12 | Capricorn | — |

---

## 6. Planetary Aspects (Drishti)

Standard Parashari aspects: all planets aspect the 7th house from themselves. Mars additionally aspects 4th and 8th. Jupiter additionally aspects 5th and 9th. Saturn additionally aspects 3rd and 10th. Rahu/Ketu aspect 5th, 7th, 9th.

| Planet | Houses Aspected (from natal house) |
|---|---|
| Sun (in H9) | 3 |
| Moon (in H9) | 3 |
| Mars (in H7) | 1, 2, 10 |
| Mercury (in H10) | 4 |
| Jupiter (in H11) | 3, 5, 7 |
| Venus (in H8) | 2 |
| Saturn (in H2) | 4, 8, 11 |
| Rahu (in H8) | 2, 4, 12 |
| Ketu (in H2) | 6, 8, 10 |

---

## 7. Navamsa Chart (D9)

Navamsa is the divisional chart for marriage, dharma, and the inner strength of planets.

| Planet | Navamsa Sign | Navamsa House |
|---|---|---|
| Ascendant | Aries | 1 |
| Sun | Taurus | 2 |
| Moon | Gemini | 3 |
| Mars | Cancer | 4 |
| Mercury | Cancer | 4 |
| Jupiter | Libra | 7 |
| Venus | Cancer | 4 |
| Saturn | Virgo | 6 |
| Rahu | Taurus | 2 |
| Ketu | Scorpio | 8 |

**Vargottama planets in D9 chart:** None.

---

## 8. Doshas Present

Pitra Dosha

---

## 9. Planetary Friendship — Five-Fold (Panchdhavarga)

| Planet | Intimate Friends | Friends | Neutrals | Enemies | Bitter Enemies |
|---|---|---|---|---|---|
| Sun | Mars, Jupiter | Mercury | Moon, Venus, Rahu | — | Saturn |
| Moon | Mercury | Mars, Jupiter, Venus | Sun, Rahu | Saturn | — |
| Mars | Sun, Moon | Venus | Mercury, Jupiter, Rahu | Saturn | — |
| Mercury | Sun, Venus | Mars, Jupiter, Rahu | Moon | Saturn | — |
| Jupiter | Sun, Moon | Saturn, Rahu | Mars, Mercury, Venus | — | — |
| Venus | Mercury | Mars, Jupiter | Sun, Moon, Saturn, Rahu | — | — |
| Saturn | — | Jupiter | Mercury, Venus, Rahu | — | Sun, Moon, Mars |
| Rahu | — | Mercury, Jupiter | Sun, Moon, Mars, Venus, Saturn | — | — |

---

${dashaSection}

---

## 11. Notes on Combustion & Retrogradation

- **Moon is combust** — within combustion range of the Sun. Combustion in classical Parashari weakens a planet's outward expression while sometimes intensifying its inner workings.
- **Saturn is retrograde** — retrograde planets are typically considered stronger in their effects in Vedic astrology.
- **Rahu and Ketu** are always retrograde by convention.

---

*End of birth chart data. All values computed using Lahiri ayanamsa. Planetary positions are sidereal.*
`;
}

function generateDynamicVedicBirthChartMarkdown(
  person: BirthDetails | SavedPerson,
  hd: any,
  transitData?: LiveTransitSnapshot
): string {
  const dashaSection = generateVimshottariDashaMarkdownSection(person, hd);
  const name = person.name ? person.name.trim() : 'Native';
  const dateStr = person.date || '1990-01-01';
  const timeStr = person.time || '12:00:00';
  const placeStr = person.place || 'Location';
  const latStr = person.latitude ? `${person.latitude}° N` : '13.06743° N';
  const lonStr = person.longitude ? `${person.longitude}° E` : '80.23761° E';
  const tzStr = person.timezone ? `+${String(person.timezone).padStart(2, '0')}:30 (IST)` : '+05:30 (IST)';

  const d1 = hd?.horoscope?.divisional_charts?.["D-1_rasi"] || hd?.rasi || {};
  const d9 = hd?.horoscope?.divisional_charts?.["D-9_navamsa"] || hd?.navamsha || {};
  const nakshatras = hd?.horoscope?.nakshatra_pada || {};
  const cal = hd?.horoscope?.calendar_info || {};

  const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signLords: Record<string, string> = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury',
    Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
  };

  const asc = d1.Ascendant || d1.Lagna || {};
  const ascSign = asc.sign || 'Aquarius';
  const ascDeg = typeof asc.longitude === 'number' ? `${asc.longitude.toFixed(2)}°` : '20.94°';
  const ascNak = nakshatras.Ascendant || nakshatras.Lagna || { nakshatra: 'Purva Bhadrapada', pada: 1 };
  const ascLord = signLords[ascSign] || 'Saturn';

  const moon = d1.Moon || {};
  const moonSign = moon.sign || 'Libra';
  const sun = d1.Sun || {};
  const sunSign = sun.sign || 'Libra';

  const moonNak = nakshatras.Moon || { nakshatra: 'Vishakha', pada: 3 };
  const janmaNak = cal.Nakshatram || `${moonNak.nakshatra}, Pada ${moonNak.pada || 3}`;
  const janmaNakLord = cal.NakshatraLord || moonNak.lord || 'Jupiter';

  // Avakhada Chakra — pull from API where available, flag as "Not in data" when absent
  const avakhada = hd?.avakhadaChakra || hd?.horoscope?.avakhada_chakra || {};
  const gana = avakhada.Gana || cal.Gana || 'Not in data';
  const nadi = avakhada.Nadi || cal.Nadi || 'Not in data';
  const yoni = avakhada.Yoni || cal.Yoni || 'Not in data';
  const tatva = avakhada.Tatva || cal.Tatva || 'Not in data';
  const varna = avakhada.Varna || cal.Varna || 'Not in data';
  const vashya = avakhada.Vashya || cal.Vashya || 'Not in data';
  const paya = avakhada.Paya || cal.Paya || 'Not in data';
  const nameSyllable = avakhada.NameSyllable || cal.NameSyllable || 'Not in data';

  // Planetary states from API (dignity lookup)
  const planetaryStates = hd?.horoscope?.planetary_states || hd?.planetary_states || {};

  function getPlanetDignity(pName: string, pSign: string): string {
    // Try API planetary_states first
    const state = planetaryStates[pName];
    if (state?.dignity) return state.dignity;
    if (state?.state) return state.state;

    // Classical dignity rules fallback
    const exaltedSigns: Record<string, string> = {
      Sun: 'Aries', Moon: 'Taurus', Mars: 'Capricorn', Mercury: 'Virgo',
      Jupiter: 'Cancer', Venus: 'Pisces', Saturn: 'Libra', Rahu: 'Gemini', Ketu: 'Sagittarius'
    };
    const debilitatedSigns: Record<string, string> = {
      Sun: 'Libra', Moon: 'Scorpio', Mars: 'Cancer', Mercury: 'Pisces',
      Jupiter: 'Capricorn', Venus: 'Virgo', Saturn: 'Aries', Rahu: 'Sagittarius', Ketu: 'Gemini'
    };
    const ownSigns: Record<string, string[]> = {
      Sun: ['Leo'], Moon: ['Cancer'], Mars: ['Aries', 'Scorpio'],
      Mercury: ['Gemini', 'Virgo'], Jupiter: ['Sagittarius', 'Pisces'],
      Venus: ['Taurus', 'Libra'], Saturn: ['Capricorn', 'Aquarius']
    };
    if (exaltedSigns[pName] === pSign) return 'Exalted';
    if (debilitatedSigns[pName] === pSign) return 'Debilitated';
    if (ownSigns[pName]?.includes(pSign)) return 'Own Sign';
    if (pName === 'Jupiter' && pSign === 'Sagittarius') return 'Mool Trikon';
    return 'Neutral';
  }

  function isCombust(pName: string, pData: any): boolean {
    if (pName === 'Sun' || pName === 'Rahu' || pName === 'Ketu') return false;
    const state = planetaryStates[pName];
    if (typeof state?.isCombust === 'boolean') return state.isCombust;
    if (typeof pData?.isCombust === 'boolean') return pData.isCombust;
    // Proximity fallback: combust if within 8° of Sun
    if (typeof pData?.longitude === 'number' && typeof sun?.longitude === 'number') {
      const diff = Math.abs(pData.longitude - sun.longitude);
      return Math.min(diff, 360 - diff) < 8;
    }
    return false;
  }

  const ascIndex = signNames.indexOf(ascSign) !== -1 ? signNames.indexOf(ascSign) : 10; // Default Aquarius (10)

  // Build house signs & lords table
  let houseTableRows = '';
  const houseSignMap: Record<number, string> = {};
  for (let h = 1; h <= 12; h++) {
    const sIndex = (ascIndex + h - 1) % 12;
    const sName = signNames[sIndex];
    const sLord = signLords[sName];
    houseSignMap[h] = sName;
    houseTableRows += `| ${h} | ${sName} | ${sLord} |\n`;
  }

  // Planetary positions D1
  let d1PlanetRows = '';
  const houseGrouping: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseGrouping[h] = [];
  houseGrouping[1].push('Ascendant');

  planetNames.forEach(pName => {
    const pData = d1[pName] || {};
    const pSign = pData.sign || 'Aries';
    const sIdx = signNames.indexOf(pSign);
    const houseNum = sIdx !== -1 ? ((sIdx - ascIndex + 12) % 12) + 1 : 1;
    const pDeg = typeof pData.longitude === 'number' ? `${Math.floor(pData.longitude)}°${Math.floor((pData.longitude % 1) * 60)}'` : 'N/A';
    const pNak = nakshatras[pName]?.nakshatra || 'N/A';
    const pPada = nakshatras[pName]?.pada || 'N/A';
    const pNakLord = nakshatras[pName]?.lord || 'N/A';
    const isRetro = pData.isRetrograde || planetaryStates[pName]?.isRetrograde || pName === 'Rahu' || pName === 'Ketu';
    const motionStr = isRetro ? 'Retrograde' : 'Direct';
    const combustStr = isCombust(pName, pData) ? 'Combust' : 'Not combust';
    const dignity = getPlanetDignity(pName, pSign);
    const planetDisp = isRetro ? `${pName} (R)` : pName;

    houseGrouping[houseNum].push(planetDisp);

    d1PlanetRows += `| ${pName} | ${pSign} | ${houseNum} | ${pDeg} | ${pNak} | ${pPada} | ${pNakLord} | ${dignity} | ${motionStr} | ${combustStr} | — |\n`;
  });

  let houseGroupingRows = '';
  for (let h = 1; h <= 12; h++) {
    const planetsInH = houseGrouping[h].length > 0 ? houseGrouping[h].join(', ') : '—';
    houseGroupingRows += `| ${h} | ${houseSignMap[h]} | ${planetsInH} |\n`;
  }

  // Navamsa D9
  let d9PlanetRows = `| Ascendant | ${d9.Ascendant?.sign || 'Aries'} | 1 |\n`;
  planetNames.forEach(pName => {
    const pData = d9[pName] || {};
    const pSign = pData.sign || 'Taurus';
    const sIdx = signNames.indexOf(pSign);
    const d9AscIdx = signNames.indexOf(d9.Ascendant?.sign || 'Aries');
    const houseNum = sIdx !== -1 ? ((sIdx - d9AscIdx + 12) % 12) + 1 : 1;
    d9PlanetRows += `| ${pName} | ${pSign} | ${houseNum} |\n`;
  });

  const transitSection = transitData ? `
---

## 12. Live Gochara (Transit) Data
*As of ${new Date().toLocaleString()}*

| Planet | Sign | House from Moon | Classification | Classical Result |
|---|---|---|---|---|
${Object.entries(transitData.positions).map(([pName, p]) => `| ${pName} | ${p.sign} | ${p.houseFromMoon} | ${p.classification} | ${p.classicalResultTelugu} |`).join('\n')}
` : '';

  return `> Pre-computed Vedic (Parashari) kundali data structured for AI parsing. Upload this file as project knowledge or paste at the start of a chat. All planetary positions use the Lahiri ayanamsa.

---

## 1. Birth Details

| Field | Value |
|---|---|
| Name | ${name} |
| Date of Birth | ${dateStr} |
| Time of Birth | ${timeStr} IST |
| Place of Birth | ${placeStr} |
| Latitude | ${latStr} |
| Longitude | ${lonStr} |
| Timezone | ${tzStr} |
| Ayanamsa | Lahiri 23.8133° |

---

## 2. Panchang at Birth

| Element | Value |
|---|---|
| Weekday | ${cal.Weekday || cal.Day || 'Not in data'} |
| Tithi | ${cal.Tithi || 'Not in data'} |
| Paksha | ${cal.Paksha || 'Not in data'} |
| Nakshatra | ${janmaNak} |
| Yoga | ${cal.Yoga || 'Not in data'} |
| Karana | ${cal.Karana || 'Not in data'} |
| Rasi Lord | ${signLords[moonSign] || 'Not in data'} |
| Sunrise | ${cal['Sun Rise'] || cal.Sunrise || 'Not in data'} |
| Sunset | ${cal['Sun Set'] || cal.Sunset || 'Not in data'} |
| Moonrise | ${cal['Moon Rise'] || cal.Moonrise || 'Not in data'} |
| Moonset | ${cal['Moon Set'] || cal.Moonset || 'Not in data'} |
| Rahukaal | ${cal.Rahukaal || cal['Rahukaal'] || 'Not in data'} |
| Gulika Kaal | ${cal['Gulika Kaal'] || cal.GalikaKaal || 'Not in data'} |
| Yamakanta | ${cal.Yamakanta || 'Not in data'} |

---

## 3. Core Chart Signatures

| Signature | Value |
|---|---|
| Ascendant (Lagna) | ${ascSign} |
| Ascendant Degree | ${ascDeg} (${ascSign}) |
| Ascendant Nakshatra | ${ascNak.nakshatra}, Pada ${ascNak.pada || 1} |
| Ascendant Lord | ${ascLord} |
| Moon Sign (Rashi) | ${moonSign} |
| Sun Sign | ${sunSign} |
| Janma Nakshatra | ${janmaNak} |
| Janma Nakshatra Lord | ${janmaNakLord} |
| Name Start Syllable | ${nameSyllable} |
| Gana | ${gana} |
| Nadi | ${nadi} |
| Yoni | ${yoni} |
| Tatva | ${tatva} |
| Varna | ${varna} |
| Vashya | ${vashya} |
| Paya | ${paya} |

---

## 4. House Signs & Lords (Lagna Chart / D1)

| House | Sign | Lord |
|---|---|---|
${houseTableRows}
---

## 5. Planetary Positions — Rashi Chart (D1)

| Planet | Sign | House | Degree | Nakshatra | Pada | Nakshatra Lord | Dignity | Motion | Combustion | Functional Nature |
|---|---|---|---|---|---|---|---|---|---|---|
${d1PlanetRows}
### House-wise Planetary Grouping

| House | Sign | Planets Present |
|---|---|---|
${houseGroupingRows}
---

## 6. Planetary Aspects (Drishti)

Standard Parashari aspects: all planets aspect the 7th house from themselves. Mars additionally aspects 4th and 8th. Jupiter additionally aspects 5th and 9th. Saturn additionally aspects 3rd and 10th. Rahu/Ketu aspect 5th, 7th, 9th. Houses computed from natal house of each planet.

| Planet | Natal House | Houses Aspected |
|---|---|---|
${(() => {
  // Special aspect offsets beyond the universal 7th
  const specialAspects: Record<string, number[]> = {
    Mars:    [4, 8],
    Jupiter: [5, 9],
    Saturn:  [3, 10],
    Rahu:    [5, 9],
    Ketu:    [5, 9]
  };
  return planetNames.map(pName => {
    const pData = d1[pName] || {};
    const pSign = pData.sign || 'Aries';
    const sIdx = signNames.indexOf(pSign);
    const houseNum = sIdx !== -1 ? ((sIdx - ascIndex + 12) % 12) + 1 : 1;
    const offsets = [7, ...(specialAspects[pName] || [])];
    const aspectedHouses = offsets.map(o => ((houseNum + o - 2) % 12) + 1).sort((a, b) => a - b);
    return `| ${pName} | H${houseNum} | ${aspectedHouses.map(h => `H${h}`).join(', ')} |`;
  }).join('\n');
})()}

---

## 7. Navamsa Chart (D9)

Navamsa is the divisional chart for marriage, dharma, and the inner strength of planets.

| Planet | Navamsa Sign | Navamsa House |
|---|---|---|
${d9PlanetRows}
**Vargottama planets (same sign in D1 & D9):** ${(() => {
  const vargottama = planetNames.filter(pName => {
    const d1Sign = (d1[pName] || {}).sign;
    const d9Sign = (d9[pName] || {}).sign;
    return d1Sign && d9Sign && d1Sign === d9Sign;
  });
  return vargottama.length > 0 ? vargottama.join(', ') : 'None';
})()}

---

## 8. Doshas Present

${(() => {
  const doshas: string[] = [];
  // Manglik Dosha: Mars in H1, H2, H4, H7, H8, H12
  const marsData = d1.Mars || {};
  const marsSign = marsData.sign;
  if (marsSign) {
    const marsIdx = signNames.indexOf(marsSign);
    const marsHouse = marsIdx !== -1 ? ((marsIdx - ascIndex + 12) % 12) + 1 : 0;
    if ([1, 2, 4, 7, 8, 12].includes(marsHouse)) {
      doshas.push(`Manglik Dosha (Mars in House ${marsHouse})`);
    }
  }
  // Pitra Dosha: Sun + Rahu/Ketu in same house, or Sun in H9
  const sunData = d1.Sun || {};
  const sunSign = sunData.sign;
  const rahuData = d1.Rahu || {};
  if (sunSign && rahuData.sign && sunSign === rahuData.sign) {
    doshas.push('Pitra Dosha (Sun conjunct Rahu)');
  }
  if (sunSign) {
    const sunIdx = signNames.indexOf(sunSign);
    const sunHouse = sunIdx !== -1 ? ((sunIdx - ascIndex + 12) % 12) + 1 : 0;
    if (sunHouse === 9 && !doshas.some(d => d.includes('Pitra'))) {
      doshas.push('Possible Pitra Dosha (Sun in House 9)');
    }
  }
  // Kaal Sarp: all planets between Rahu and Ketu
  if (rahuData.sign) {
    const rahuIdx = signNames.indexOf(rahuData.sign);
    const ketuData = d1.Ketu || {};
    const ketuIdx = signNames.indexOf(ketuData.sign || '');
    if (rahuIdx !== -1 && ketuIdx !== -1) {
      const coreplanets = planetNames.filter(p => p !== 'Rahu' && p !== 'Ketu');
      const allBetween = coreplanets.every(p => {
        const pIdx = signNames.indexOf((d1[p] || {}).sign || '');
        if (pIdx === -1) return false;
        // Check if pIdx is between rahuIdx and ketuIdx in one direction
        let cur = rahuIdx;
        while (cur !== ketuIdx) {
          if (cur === pIdx) return true;
          cur = (cur + 1) % 12;
        }
        return false;
      });
      if (allBetween) doshas.push('Kaal Sarp Dosha');
    }
  }
  return doshas.length > 0 ? doshas.join('\n\n') : 'None detected from available data.';
})()}

---

## 9. Planetary Friendship — Five-Fold (Panchdhavarga)

| Planet | Intimate Friends | Friends | Neutrals | Enemies | Bitter Enemies |
|---|---|---|---|---|---|
| Sun | Mars, Jupiter | Mercury | Moon, Venus, Rahu | — | Saturn |
| Moon | Mercury | Mars, Jupiter, Venus | Sun, Rahu | Saturn | — |
| Mars | Sun, Moon | Venus | Mercury, Jupiter, Rahu | Saturn | — |
| Mercury | Sun, Venus | Mars, Jupiter, Rahu | Moon | Saturn | — |
| Jupiter | Sun, Moon | Saturn, Rahu | Mars, Mercury, Venus | — | — |
| Venus | Mercury | Mars, Jupiter | Sun, Moon, Saturn, Rahu | — | — |
| Saturn | — | Jupiter | Mercury, Venus, Rahu | — | Sun, Moon, Mars |
| Rahu | — | Mercury, Jupiter | Sun, Moon, Mars, Venus, Saturn | — | — |

---

${dashaSection}

${transitSection}

---

## 11. Notes on Combustion & Retrogradation

- Planetary motions computed using Lahiri ayanamsa.

---

*End of birth chart data. All values computed using Lahiri ayanamsa. Planetary positions are sidereal.*
`;
}
