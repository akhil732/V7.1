/**
 * traditionalVedicCalculations.ts
 *
 * Classical Vedic Astrology utility calculations adhering strictly to
 * Parashari methodology:
 *   Natal Chart Analysis (from Ascendant/Lagna)
 *   → Dasha Activation (Vimshottari MD/AD/PD)
 *   → Transit Condition (Gochara from Natal Moon)
 *   → Final Verdict
 *
 * Strictly NO KP astrology, Cusp Sub Lords, Star Lords, or modern software scoring engines.
 */

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

export const SIGN_LORDS: Record<string, string> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter'
};

export const EXALTATION: Record<string, string> = {
  Sun: 'Aries',
  Moon: 'Taurus',
  Mars: 'Capricorn',
  Mercury: 'Virgo',
  Jupiter: 'Cancer',
  Venus: 'Pisces',
  Saturn: 'Libra',
  Rahu: 'Taurus',
  Ketu: 'Scorpio'
};

export const OWN_SIGNS: Record<string, string[]> = {
  Sun: ['Leo'],
  Moon: ['Cancer'],
  Mars: ['Aries', 'Scorpio'],
  Mercury: ['Gemini', 'Virgo'],
  Jupiter: ['Sagittarius', 'Pisces'],
  Venus: ['Taurus', 'Libra'],
  Saturn: ['Capricorn', 'Aquarius'],
  Rahu: ['Aquarius'],
  Ketu: ['Scorpio']
};

export const DEBILITATION: Record<string, string> = {
  Sun: 'Libra',
  Moon: 'Scorpio',
  Mars: 'Cancer',
  Mercury: 'Pisces',
  Jupiter: 'Capricorn',
  Venus: 'Virgo',
  Saturn: 'Aries',
  Rahu: 'Scorpio',
  Ketu: 'Taurus'
};

export const SIGN_START_DEGREES: Record<string, number> = {
  Aries: 0,
  Taurus: 30,
  Gemini: 60,
  Cancer: 90,
  Leo: 120,
  Virgo: 150,
  Libra: 180,
  Scorpio: 210,
  Sagittarius: 240,
  Capricorn: 270,
  Aquarius: 300,
  Pisces: 330
};

/**
 * Calculates house number (1-12) from Ascendant using Vedic Whole Sign system.
 */
export function getHouseFromAscendant(planetLongitude: number, ascendantLongitude: number): number {
  const pLon = (Number(planetLongitude) || 0);
  const aLon = (Number(ascendantLongitude) || 0);
  const pSignIdx = Math.floor((((pLon % 360) + 360) % 360) / 30);
  const aSignIdx = Math.floor((((aLon % 360) + 360) % 360) / 30);
  return ((pSignIdx - aSignIdx + 12) % 12) + 1;
}

/**
 * Calculates house number (1-12) from Natal Moon (for Gochara / Transits) using Vedic Whole Sign system.
 */
export function getHouseFromMoon(transitPlanetLongitude: number, natalMoonLongitude: number): number {
  const tLon = (Number(transitPlanetLongitude) || 0);
  const mLon = (Number(natalMoonLongitude) || 0);
  const tSignIdx = Math.floor((((tLon % 360) + 360) % 360) / 30);
  const mSignIdx = Math.floor((((mLon % 360) + 360) % 360) / 30);
  return ((tSignIdx - mSignIdx + 12) % 12) + 1;
}

/**
 * Returns the classical ruling planet of the sign in the given house.
 */
export function getHouseLord(houseNumber: number, signInHouse: string): string {
  return SIGN_LORDS[signInHouse] || 'Unknown';
}

export interface PlanetStrengthResult {
  dignity: 'Exalted' | 'Own Sign' | 'Debilitated' | 'Neutral';
  strength: number;
  description: string;
}

/**
 * Calculates the classical dignity and approximate strength percentage of a planet in a sign.
 */
export function getPlanetStrength(planet: string, sign: string): PlanetStrengthResult {
  let dignity: 'Exalted' | 'Own Sign' | 'Debilitated' | 'Neutral' = 'Neutral';
  let strength = 60;

  if (EXALTATION[planet] === sign) {
    dignity = 'Exalted';
    strength = 100;
  } else if (DEBILITATION[planet] === sign) {
    dignity = 'Debilitated';
    strength = 40;
  } else if (OWN_SIGNS[planet]?.includes(sign)) {
    dignity = 'Own Sign';
    strength = 85;
  }

  return {
    dignity,
    strength,
    description: `${planet} is ${dignity} in ${sign}`
  };
}

/**
 * Checks for Dwidwadasha relationship (2-12 house positions relative to each other).
 * MD and AD lords are in side-by-side / adjacent houses (difference of 1 or 11 across circular zodiac).
 */
export function isDwidwadasha(planet1House: number, planet2House: number): boolean {
  const step = (((planet2House - planet1House) % 12) + 12) % 12;
  return step === 1 || step === 11;
}

/**
 * Checks for Shashtashtaka (6-8) relationship.
 * MD and AD lords are placed 6 and 8 houses away from each other (difference of 5 or 7 across circular zodiac, i.e., +5/-5).
 */
export function isShashtashtaka(planet1House: number, planet2House: number): boolean {
  const step = (((planet2House - planet1House) % 12) + 12) % 12;
  return step === 5 || step === 7;
}

export interface SadeSatiResult {
  active: boolean;
  phase: string;
  description: string;
  saturnHouseFromMoon: number;
}

/**
 * Determines Sade Sati status of Saturn relative to Natal Moon.
 * Active when Saturn is in 12th, 1st (Moon sign), or 2nd from Natal Moon.
 */
export function getSadeSatiStatus(transitSaturnLongitude: number, natalMoonLongitude: number): SadeSatiResult {
  const saturnHouseFromMoon = getHouseFromMoon(transitSaturnLongitude, natalMoonLongitude);
  let active = false;
  let phase = 'Inactive';
  let description = 'Saturn is not in Sade Sati period.';

  if (saturnHouseFromMoon === 12) {
    active = true;
    phase = 'First Phase (12th from Moon)';
    description = 'Sade Sati First Phase: Saturn is 12th from Natal Moon. Period of preparation and loss.';
  } else if (saturnHouseFromMoon === 1) {
    active = true;
    phase = 'Second Phase (Moon Sign)';
    description = 'Sade Sati Peak Phase: Saturn is in Natal Moon Sign. Period of maximum intensity.';
  } else if (saturnHouseFromMoon === 2) {
    active = true;
    phase = 'Third Phase (2nd from Moon)';
    description = 'Sade Sati Third Phase: Saturn is 2nd from Natal Moon. Gradual recovery.';
  }

  return { active, phase, description, saturnHouseFromMoon };
}

/**
 * Returns descriptive narrative of Dasha relationship (Dwidwadasha, Shashtashtaka, or other classical pairings).
 */
export function getDashaRelationshipDescription(
  planet1: string,
  planet2: string,
  house1: number,
  house2: number
): { type: string; description: string } {
  const step = (((house2 - house1) % 12) + 12) % 12;

  if (step === 0) {
    return {
      type: 'Conjoined (1-1)',
      description: `${planet1} and ${planet2} are conjoined in House ${house1} (1-1 axis), combining their energies.`
    };
  }
  if (step === 1 || step === 11) {
    return {
      type: 'Dwidwadasha (2-12)',
      description: `${planet1} (House ${house1}) and ${planet2} (House ${house2}) are in side-by-side houses forming a 2-12 (Dwidwadasha) relationship. This indicates adjustments, structural transitions, or distance/expenditure.`
    };
  }
  if (step === 5 || step === 7) {
    return {
      type: 'Shadashtaka (6-8)',
      description: `${planet1} (House ${house1}) and ${planet2} (House ${house2}) are placed 6 and 8 houses away from each other (6-8 Shadashtaka). This indicates friction, transformation, or testing resolve.`
    };
  }
  if (step === 2 || step === 10) {
    return {
      type: 'Sahaja-Labha (3-11)',
      description: `${planet1} (House ${house1}) and ${planet2} (House ${house2}) form a 3-11 relationship, promoting mutual growth, initiatives, and gains.`
    };
  }
  if (step === 3 || step === 9) {
    return {
      type: 'Kendra (4-10)',
      description: `${planet1} (House ${house1}) and ${planet2} (House ${house2}) form a 4-10 Kendra relationship, driving action and professional momentum.`
    };
  }
  if (step === 4 || step === 8) {
    return {
      type: 'Trikona (5-9)',
      description: `${planet1} (House ${house1}) and ${planet2} (House ${house2}) form a 5-9 Trikona relationship, providing harmonious mutual support.`
    };
  }
  if (step === 6) {
    return {
      type: 'Sama Saptaka (7-7)',
      description: `${planet1} (House ${house1}) and ${planet2} (House ${house2}) are in direct 7th mutual aspect (Sama Saptaka), offering partnership awareness.`
    };
  }
  return {
    type: 'Neutral',
    description: `${planet1} and ${planet2} operate in neutral alignment.`
  };
}

/**
 * Returns friendship affinity of planet in sign.
 */
export function getSignAffinity(planet: string, sign: string): 'Friend' | 'Neutral' | 'Enemy' {
  const FRIENDLY_SIGNS: Record<string, string[]> = {
    Sun: ['Aries', 'Leo', 'Sagittarius'],
    Moon: ['Cancer', 'Taurus'],
    Mars: ['Aries', 'Scorpio', 'Capricorn'],
    Mercury: ['Gemini', 'Virgo'],
    Jupiter: ['Sagittarius', 'Pisces', 'Cancer'],
    Venus: ['Taurus', 'Libra', 'Pisces'],
    Saturn: ['Capricorn', 'Aquarius', 'Libra']
  };

  if (FRIENDLY_SIGNS[planet]?.includes(sign)) return 'Friend';
  return 'Neutral';
}

export interface ExtractedPlanet {
  name: string;
  longitude: number;
  sign: string;
  house: number;
  isRetrograde?: boolean;
}

/**
 * Extracts Ascendant Sign safely from horoscope data.
 */
export function extractAscendantSign(horoscopeData: any): string {
  if (!horoscopeData) return 'Aquarius';
  const d1 = horoscopeData?.horoscope?.divisional_charts?.['D-1_rasi'] ||
             horoscopeData?.horoscope?.planets ||
             horoscopeData?.rasi ||
             {};
  const asc = d1.Ascendant || d1.Lagna;
  if (asc?.sign && (ZODIAC_SIGNS as readonly string[]).includes(asc.sign)) return asc.sign;
  if (horoscopeData.lagna && (ZODIAC_SIGNS as readonly string[]).includes(horoscopeData.lagna)) return horoscopeData.lagna;
  if (typeof horoscopeData.ascendant === 'string' && (ZODIAC_SIGNS as readonly string[]).includes(horoscopeData.ascendant)) return horoscopeData.ascendant;
  if (typeof horoscopeData.ascendant === 'number') {
    const signIdx = Math.floor((((horoscopeData.ascendant % 360) + 360) % 360) / 30);
    return ZODIAC_SIGNS[signIdx] || 'Aquarius';
  }
  if (typeof horoscopeData.ascendantLongitude === 'number') {
    const signIdx = Math.floor((((horoscopeData.ascendantLongitude % 360) + 360) % 360) / 30);
    return ZODIAC_SIGNS[signIdx] || 'Aquarius';
  }
  if (Array.isArray(horoscopeData.houses) && typeof horoscopeData.houses[0]?.longitude === 'number') {
    const signIdx = Math.floor((((horoscopeData.houses[0].longitude % 360) + 360) % 360) / 30);
    return ZODIAC_SIGNS[signIdx] || 'Aquarius';
  }
  return 'Aquarius';
}

/**
 * Extracts Ascendant longitude from horoscope data.
 */
export function extractAscendantLongitude(horoscopeData: any): number {
  if (!horoscopeData) return 300;
  if (typeof horoscopeData.ascendant === 'number') return horoscopeData.ascendant;
  if (typeof horoscopeData.ascendantLongitude === 'number') return horoscopeData.ascendantLongitude;
  if (Array.isArray(horoscopeData.houses) && typeof horoscopeData.houses[0]?.longitude === 'number') {
    return horoscopeData.houses[0].longitude;
  }

  const d1 = horoscopeData?.horoscope?.divisional_charts?.['D-1_rasi'] || horoscopeData?.rasi || {};
  const asc = d1.Ascendant || d1.Lagna;
  if (asc) {
    if (typeof asc.longitude === 'number') {
      if (asc.longitude < 30 && asc.sign && SIGN_START_DEGREES[asc.sign] !== undefined) {
        return SIGN_START_DEGREES[asc.sign] + asc.longitude;
      }
      return asc.longitude;
    }
    if (asc.sign && SIGN_START_DEGREES[asc.sign] !== undefined) {
      return SIGN_START_DEGREES[asc.sign] + (asc.degree || 15);
    }
  }

  const ascSign = extractAscendantSign(horoscopeData);
  return (SIGN_START_DEGREES[ascSign] || 300) + 15;
}

/**
 * Extracts and normalizes planet list and positions from horoscope data.
 * Always computes house relative to Ascendant sign in Whole Sign system.
 */
export function extractPlanetsList(horoscopeData: any): ExtractedPlanet[] {
  if (!horoscopeData) return [];

  const ascSign = extractAscendantSign(horoscopeData);
  const ascIdx = (ZODIAC_SIGNS as readonly string[]).indexOf(ascSign);
  const effectiveAscIdx = ascIdx !== -1 ? ascIdx : 10; // Default Aquarius (10)

  const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const results: ExtractedPlanet[] = [];

  const d1 = horoscopeData?.horoscope?.divisional_charts?.['D-1_rasi'] ||
             horoscopeData?.horoscope?.planets ||
             horoscopeData?.rasi ||
             {};

  const planetsArr = Array.isArray(horoscopeData.planets) ? horoscopeData.planets : [];

  for (const pName of planetNames) {
    let pObj: any = d1[pName];
    if (!pObj && planetsArr.length > 0) {
      pObj = planetsArr.find((p: any) => (p.name || p.planet || '').toLowerCase() === pName.toLowerCase());
    }

    if (pObj && typeof pObj === 'object') {
      const sign = pObj.sign || 'Aries';
      const sIdx = (ZODIAC_SIGNS as readonly string[]).indexOf(sign);
      const houseNum = sIdx !== -1 ? ((sIdx - effectiveAscIdx + 12) % 12) + 1 : 1;

      let lon = typeof pObj.longitude === 'number' ? pObj.longitude : 0;
      if (lon < 30 && sign && SIGN_START_DEGREES[sign] !== undefined) {
        lon = SIGN_START_DEGREES[sign] + (pObj.degree || pObj.degreeInSign || lon || 15);
      } else if (!lon && sign) {
        lon = (SIGN_START_DEGREES[sign] || 0) + (pObj.degree || pObj.degreeInSign || 15);
      }

      results.push({
        name: pName,
        longitude: lon,
        sign,
        house: houseNum,
        isRetrograde: Boolean(pObj.isRetrograde || pObj.speed < 0 || pName === 'Rahu' || pName === 'Ketu')
      });
    }
  }

  // Fallback: if d1 didn't contain all planets, check if any other planets in array
  if (results.length === 0 && planetsArr.length > 0) {
    for (const p of planetsArr) {
      const name = p.name || p.planet || '';
      if (!name) continue;
      const sign = p.sign || 'Aries';
      const sIdx = (ZODIAC_SIGNS as readonly string[]).indexOf(sign);
      const houseNum = sIdx !== -1 ? ((sIdx - effectiveAscIdx + 12) % 12) + 1 : (p.house || 1);
      let lon = typeof p.longitude === 'number' ? p.longitude : 0;
      if (lon < 30 && sign && SIGN_START_DEGREES[sign] !== undefined) {
        lon = SIGN_START_DEGREES[sign] + (p.degreeInSign || p.degree || lon || 15);
      } else if (!lon && sign) {
        lon = (SIGN_START_DEGREES[sign] || 0) + (p.degreeInSign || p.degree || 15);
      }
      results.push({
        name,
        longitude: lon,
        sign,
        house: houseNum,
        isRetrograde: Boolean(p.isRetrograde || name === 'Rahu' || name === 'Ketu')
      });
    }
  }

  return results;
}

/**
 * Extracts Moon longitude from horoscope data.
 */
export function extractMoonLongitude(horoscopeData: any): number {
  if (!horoscopeData) return 205;
  const d1 = horoscopeData?.horoscope?.divisional_charts?.['D-1_rasi'] || horoscopeData?.rasi || {};
  const moon = d1.Moon || horoscopeData?.planets?.find((p: any) => (p.name || p.planet) === 'Moon');
  if (moon) {
    const sign = moon.sign || horoscopeData.rasi || 'Libra';
    const startDeg = SIGN_START_DEGREES[sign] || 180;
    if (typeof moon.longitude === 'number') {
      return moon.longitude > 30 ? moon.longitude : startDeg + moon.longitude;
    }
    return startDeg + (moon.degree || 15);
  }
  const sign = horoscopeData?.rasi || 'Libra';
  return (SIGN_START_DEGREES[sign] || 180) + 15;
}

export interface HouseOccupant {
  planet: string;
  sign: string;
  house: number;
  strength: PlanetStrengthResult;
}

/**
 * Calculates planets occupying a specific house (from Ascendant or from Moon).
 */
export function getHouseOccupancy(
  horoscopeData: any,
  houseNumber: number,
  fromAscendant: boolean = true,
  natalMoonLongitude: number | null = null
): HouseOccupant[] {
  const planets = extractPlanetsList(horoscopeData);
  const ascendantLongitude = extractAscendantLongitude(horoscopeData);
  const moonLon = natalMoonLongitude !== null ? natalMoonLongitude : extractMoonLongitude(horoscopeData);

  const occupants = planets.filter(p => {
    let house: number;
    if (fromAscendant) {
      house = getHouseFromAscendant(p.longitude, ascendantLongitude);
    } else {
      house = getHouseFromMoon(p.longitude, moonLon);
    }
    return house === houseNumber;
  });

  return occupants.map(p => ({
    planet: p.name,
    sign: p.sign,
    house: houseNumber,
    strength: getPlanetStrength(p.name, p.sign)
  }));
}
