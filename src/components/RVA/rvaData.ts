import {
  PanchangaItem,
  PlanetStrength,
  PlanetAnalysisRow,
  HouseAnalysisRow,
  TransitDataPoint,
  PlanetaryPositionRow,
  CuspRow,
  PlanetSignificator,
  HouseSignificator,
  DashaPeriod,
  AspectCell,
} from '../../types/rva';

export const PANCHANGA_DATA: PanchangaItem[] = [
  { icon: '🌙', label: 'Libra (Tula)', type: 'planet' },
  { icon: '🌌', label: 'Vishakha-3', type: 'nakshatra' },
  { icon: '☸', label: 'K.P - Pratipada', type: 'tithi' },
  { icon: '☯', label: 'Shobhana Yoga', type: 'yoga' },
  { icon: '⚖', label: 'Bava Karana', type: 'yoga' },
  { icon: '🌅', label: 'Sunrise: 06:05:12', type: 'time' },
  { icon: '🌇', label: 'Sunset: 17:38:40', type: 'time' },
  { icon: '🌔', label: 'Moonrise: 06:45:10', type: 'time' },
  { icon: '🌘', label: 'Moonset: 18:20:15', type: 'time' },
];

export const PLANET_STRENGTHS: PlanetStrength[] = [
  { code: 'Ju', name: 'Jupiter', symbol: '♃', score: 92, textColor: 'text-emerald-600', borderColor: 'border-emerald-400' },
  { code: 'Me', name: 'Mercury', symbol: '☿', score: 88, textColor: 'text-emerald-600', borderColor: 'border-emerald-400' },
  { code: 'Mo', name: 'Moon', symbol: '☽', score: 82, textColor: 'text-emerald-600', borderColor: 'border-emerald-400' },
  { code: 'Ma', name: 'Mars', symbol: '♂', score: 79, textColor: 'text-emerald-600', borderColor: 'border-emerald-400' },
  { code: 'Su', name: 'Sun', symbol: '☉', score: 75, textColor: 'text-emerald-600', borderColor: 'border-emerald-400' },
  { code: 'Ve', name: 'Venus', symbol: '♀', score: 72, textColor: 'text-emerald-600', borderColor: 'border-emerald-400' },
  { code: 'Ra', name: 'Rahu', symbol: '☊', score: 68, textColor: 'text-amber-600', borderColor: 'border-amber-400' },
  { code: 'Ke', name: 'Ketu', symbol: '☋', score: 65, textColor: 'text-amber-600', borderColor: 'border-amber-400' },
  { code: 'Sa', name: 'Saturn', symbol: '♄', score: 58, textColor: 'text-rose-600', borderColor: 'border-rose-400' },
];

export const PLANETS_ANALYSIS_DATA: PlanetAnalysisRow[] = [
  { planet: 'Su', light: 85, perf: 82, resource: 76, capacity: 75, slInf: 'Ju' },
  { planet: 'Mo', light: 90, perf: 85, resource: 80, capacity: 82, slInf: 'Ju' },
  { planet: 'Ma', light: 85, perf: 80, resource: 78, capacity: 79, slInf: 'Ke' },
  { planet: 'Me', light: 95, perf: 88, resource: 90, capacity: 88, slInf: 'Ju' },
  { planet: 'Ju', light: 92, perf: 92, resource: 94, capacity: 92, slInf: 'Ve' },
  { planet: 'Ve', light: 80, perf: 75, resource: 70, capacity: 72, slInf: 'Mo' },
  { planet: 'Sa*', light: 65, perf: 70, resource: 60, capacity: '58/142', slInf: 'Sa', isCustomCapacity: true },
  { planet: 'Ra*', light: 70, perf: 72, resource: 68, capacity: '68/132', slInf: 'Mo', isCustomCapacity: true },
  { planet: 'Ke*', light: 70, perf: 68, resource: 65, capacity: 65, slInf: 'Sa' },
];

export const HOUSE_ANALYSIS_DATA: HouseAnalysisRow[] = [
  { houseNum: 1, occupant: '—', lord: 'Sa*', karaka: 'Su', total: '78' },
  { houseNum: 2, occupant: 'Sa*, Ke*', lord: 'Ju', karaka: 'Ju', total: '74' },
  { houseNum: 3, occupant: '—', lord: 'Ma', karaka: 'Ma', total: '75' },
  { houseNum: 4, occupant: '—', lord: 'Ve', karaka: 'Mo', total: '76' },
  { houseNum: 5, occupant: '—', lord: 'Me', karaka: 'Ju', total: '82' },
  { houseNum: 6, occupant: '—', lord: 'Mo', karaka: 'Ma', total: '70' },
  { houseNum: 7, occupant: 'Ma', lord: 'Su', karaka: 'Ve', total: '84' },
  { houseNum: 8, occupant: 'Ve, Ra*', lord: 'Me', karaka: 'Sa', total: '68' },
  { houseNum: 9, occupant: 'Su, Mo', lord: 'Ve', karaka: 'Ju', total: '89' },
  { houseNum: 10, occupant: 'Me', lord: 'Ma', karaka: 'Su', total: '86' },
  { houseNum: 11, occupant: 'Ju', lord: 'Ju', karaka: 'Ju', total: '92' },
  { houseNum: 12, occupant: 'Ur, Ne', lord: 'Sa*', karaka: 'Sa', total: '65' },
];

export const TRANSIT_GRAPH_DATA: TransitDataPoint[] = [
  { date: '2026-01-01', strength: 29.5 },
  { date: '2026-02-01', strength: 26.5 },
  { date: '2026-03-01', strength: 28.0 },
  { date: '2026-04-01', strength: 29.0 },
  { date: '2026-05-01', strength: 28.2 },
  { date: '2026-06-01', strength: 32.0 },
  { date: '2026-07-01', strength: 29.0 },
  { date: '2026-08-01', strength: 25.5 },
  { date: '2026-09-01', strength: 24.0 },
  { date: '2026-10-01', strength: 30.5 },
  { date: '2026-11-01', strength: 28.0 },
  { date: '2026-12-01', strength: 29.0 },
  { date: '2027-01-01', strength: 31.0 },
];

export const PLANETARY_POSITIONS: PlanetaryPositionRow[] = [
  { planet: 'Su (Sun)', sign: 'Libra (Li)', longitude: '25:25:22', house: 9, nakshatra: 'Vishakha (2)', sl: 'Ve', nl: 'Ju', sub: 'Me', ss: 'Ra', sss: 'Ve' },
  { planet: 'Mo (Moon)', sign: 'Libra (Li)', longitude: '27:33:08', house: 9, nakshatra: 'Vishakha (3)', sl: 'Ve', nl: 'Ju', sub: 'Ve', ss: 'Mo', sss: 'Ju' },
  { planet: 'Ma (Mars)', sign: 'Leo (Le)', longitude: '12:43:56', house: 7, nakshatra: 'Magha (4)', sl: 'Su', nl: 'Ke', sub: 'Me', ss: 'Ve', sss: 'Sa' },
  { planet: 'Me (Mercury)', sign: 'Scorpio (Sc)', longitude: '00:58:53', house: 10, nakshatra: 'Vishakha (4)', sl: 'Ma', nl: 'Ju', sub: 'Ma', ss: 'Sa', sss: 'Me' },
  { planet: 'Ju (Jupiter)', sign: 'Sagittarius (Sg)', longitude: '20:46:56', house: 11, nakshatra: 'Purvashadha (3)', sl: 'Ju', nl: 'Ve', sub: 'Ju', ss: 'Ju', sss: 'Ve' },
  { planet: 'Ve (Venus)', sign: 'Virgo (Vi)', longitude: '21:48:15', house: 8, nakshatra: 'Hasta (4)', sl: 'Me', nl: 'Mo', sub: 'Ve', ss: 'Sa', sss: 'Ju' },
  { planet: 'Sa [R]', sign: 'Pisces (Pi)', longitude: '07:12:58', house: 2, nakshatra: 'Uttarabhadra (2)', sl: 'Ju', nl: 'Sa', sub: 'Me', ss: 'Ju', sss: 'Ve' },
  { planet: 'Ra [R]', sign: 'Virgo (Vi)', longitude: '11:55:14', house: 8, nakshatra: 'Hasta (1)', sl: 'Me', nl: 'Mo', sub: 'Ra', ss: 'Ve', sss: 'Sa' },
  { planet: 'Ke [R]', sign: 'Pisces (Pi)', longitude: '11:55:14', house: 2, nakshatra: 'Uttarabhadra (3)', sl: 'Ju', nl: 'Sa', sub: 'Mo', ss: 'Me', sss: 'Ra' },
];

export const CUSPS_DATA: CuspRow[] = [
  { house: 'Cusp I (Lagna)', sign: 'Aquarius', longitude: '21:28:05', nakshatra: 'Purvabhadra (1)', sl: 'Sa', nl: 'Ju', sub: 'Ju', ss: 'Sa', sss: 'Ve' },
  { house: 'Cusp II', sign: 'Pisces', longitude: '27:09:47', nakshatra: 'Revati (4)', sl: 'Ju', nl: 'Me', sub: 'Ju', ss: 'Me', sss: 'Ve' },
  { house: 'Cusp III', sign: 'Aries', longitude: '28:51:24', nakshatra: 'Krittika (1)', sl: 'Ma', nl: 'Su', sub: 'Ma', ss: 'Sa', sss: 'Ve' },
  { house: 'Cusp IV', sign: 'Taurus', longitude: '25:06:51', nakshatra: 'Mrigasira (1)', sl: 'Ve', nl: 'Ma', sub: 'Ra', ss: 'Me', sss: 'Sa' },
  { house: 'Cusp V', sign: 'Gemini', longitude: '19:42:04', nakshatra: 'Ardra (4)', sl: 'Me', nl: 'Ra', sub: 'Ma', ss: 'Ju', sss: 'Ve' },
  { house: 'Cusp VI', sign: 'Cancer', longitude: '16:53:15', nakshatra: 'Pushyami (4)', sl: 'Mo', nl: 'Sa', sub: 'Ju', ss: 'Sa', sss: 'Ve' },
  { house: 'Cusp VII', sign: 'Leo', longitude: '21:28:05', nakshatra: 'Purvaphalguni (3)', sl: 'Su', nl: 'Ve', sub: 'Ju', ss: 'Sa', sss: 'Ve' },
  { house: 'Cusp VIII', sign: 'Virgo', longitude: '27:09:47', nakshatra: 'Chitra (2)', sl: 'Me', nl: 'Ma', sub: 'Ju', ss: 'Me', sss: 'Ve' },
  { house: 'Cusp IX', sign: 'Libra', longitude: '28:51:24', nakshatra: 'Vishakha (3)', sl: 'Ve', nl: 'Ju', sub: 'Ve', ss: 'Mo', sss: 'Ju' },
  { house: 'Cusp X', sign: 'Scorpio', longitude: '25:06:51', nakshatra: 'Jyeshtha (3)', sl: 'Ma', nl: 'Me', sub: 'Ra', ss: 'Me', sss: 'Sa' },
  { house: 'Cusp XI', sign: 'Sagittarius', longitude: '19:42:04', nakshatra: 'Purvashadha (2)', sl: 'Ju', nl: 'Ve', sub: 'Ra', ss: 'Ju', sss: 'Ve' },
  { house: 'Cusp XII', sign: 'Capricorn', longitude: '16:53:15', nakshatra: 'Shravana (3)', sl: 'Sa', nl: 'Mo', sub: 'Sa', ss: 'Sa', sss: 'Ve' },
];

export const PLANET_SIGNIFICATORS: PlanetSignificator[] = [
  { planet: 'Sun', a: '7', b: '8', c: '7, 10', d: '9' },
  { planet: 'Moon', a: '7', b: '4', c: '7, 10', d: '8' },
  { planet: 'Mars', a: '6', b: '6', c: '5, 12', d: '5, 12' },
  { planet: 'Mercury', a: '8', b: '7', c: '1, 4', d: '7, 10' },
  { planet: 'Jupiter', a: '4', b: '8', c: '2, 3', d: '1, 4' },
  { planet: 'Venus', a: '8', b: '9', c: '9', d: '6, 11' },
  { planet: 'Saturn', a: '7', b: '4', c: '7, 10', d: '2, 3' },
  { planet: 'Rahu', a: '6', b: '2', c: '5, 12', d: '—' },
  { planet: 'Ketu', a: '8', b: '8', c: '—', d: '—' },
];

export const HOUSE_SIGNIFICATORS: HouseSignificator[] = [
  { house: 'House I', planets1: '—', planets2: 'Mercury, Jupiter' },
  { house: 'House II', planets1: 'Rahu', planets2: 'Jupiter, Saturn' },
  { house: 'House III', planets1: '—', planets2: 'Jupiter, Saturn' },
  { house: 'House IV', planets1: 'Jupiter', planets2: 'Moon, Saturn, Mercury, Jupiter' },
  { house: 'House V', planets1: '—', planets2: 'Mars, Rahu' },
  { house: 'House VI', planets1: 'Mars, Rahu', planets2: 'Mars, Venus' },
  { house: 'House VII', planets1: 'Sun, Moon, Saturn', planets2: 'Mercury, Sun, Moon, Saturn' },
  { house: 'House VIII', planets1: 'Mercury, Venus, Ketu', planets2: 'Sun, Jupiter, Ketu, Moon' },
  { house: 'House IX', planets1: '—', planets2: 'Venus, Sun' },
  { house: 'House X', planets1: '—', planets2: 'Sun, Moon, Saturn, Mercury' },
  { house: 'House XI', planets1: 'Venus', planets2: 'Venus' },
  { house: 'House XII', planets1: '—', planets2: 'Mars, Rahu' },
];

export const VIMSHOTTARI_DASHA_PERIODS: DashaPeriod[] = [
  { planet: 'Mercury', startDate: '13-10-2013', endDate: '13-10-2030' },
  { planet: 'Ketu', startDate: '13-10-2030', endDate: '13-10-2037' },
  { planet: 'Venus', startDate: '13-10-2037', endDate: '13-10-2057' },
  { planet: 'Sun', startDate: '13-10-2057', endDate: '13-10-2063' },
  { planet: 'Moon', startDate: '13-10-2063', endDate: '13-10-2073' },
  { planet: 'Mars', startDate: '13-10-2073', endDate: '11-10-2080' },
  { planet: 'Rahu', startDate: '11-10-2080', endDate: '13-10-2098' },
  { planet: 'Jupiter', startDate: '13-10-2098', endDate: '14-10-2114' },
  { planet: 'Saturn', startDate: '14-10-2114', endDate: '14-10-2133' },
];

export const ASPECT_CELLS_DATA: AspectCell[] = [
  { rowPlanet: 'Su', colPlanet: 'Mo', label: 'SSqu (S)', angle: "1° 42'", type: 'hard' },
  { rowPlanet: 'Su', colPlanet: 'Ma', label: 'SSqu (S)', angle: "1° 14'", type: 'hard' },
  { rowPlanet: 'Su', colPlanet: 'Me', label: 'Vigi (S)', angle: "1° 14'", type: 'soft' },
  { rowPlanet: 'Su', colPlanet: 'Ju', label: 'Conj (S)', angle: "4° 21'", type: 'hard' },
  { rowPlanet: 'Su', colPlanet: 'Ve', label: 'SSqu (E)', angle: "0° 31'", type: 'hard' },
  { rowPlanet: 'Su', colPlanet: 'Sa', label: 'Trin (A)', angle: "0° 31'", type: 'soft' },
  { rowPlanet: 'Su', colPlanet: 'Ra', label: 'Vigi (E)', angle: "0° 41'", type: 'soft' },
  
  { rowPlanet: 'Mo', colPlanet: 'Ma', label: 'Sext (S)', angle: "4° 32'", type: 'soft' },
  { rowPlanet: 'Mo', colPlanet: 'Me', label: 'Squ (S)', angle: "1° 50'", type: 'soft' },
  { rowPlanet: 'Mo', colPlanet: 'Ju', label: 'Trid (S)', angle: "1° 08'", type: 'soft' },
  { rowPlanet: 'Mo', colPlanet: 'Ve', label: 'Conj (S)', angle: "6° 10'", type: 'hard' },
  { rowPlanet: 'Mo', colPlanet: 'Sa', label: 'SSqu (E)', angle: "0° 44'", type: 'hard' },

  { rowPlanet: 'Ma', colPlanet: 'Me', label: 'Squ (A)', angle: "2° 13'", type: 'hard' },
  { rowPlanet: 'Ma', colPlanet: 'Ju', label: 'Deg5 (A)', angle: "1° 18'", type: 'soft' },
  { rowPlanet: 'Ma', colPlanet: 'Ve', label: 'Trin (A)', angle: "5° 23'", type: 'soft' },
  { rowPlanet: 'Ma', colPlanet: 'Sa', label: 'Sext (A)', angle: "1° 55'", type: 'soft' },

  { rowPlanet: 'Me', colPlanet: 'Ju', label: 'Sext (A)', angle: "4° 45'", type: 'soft' },
  { rowPlanet: 'Me', colPlanet: 'Ve', label: 'Biqu (A)', angle: "1° 55'", type: 'soft' },

  { rowPlanet: 'Ju', colPlanet: 'Ve', label: 'Trin (A)', angle: "6° 58'", type: 'soft' },
  { rowPlanet: 'Ju', colPlanet: 'Sa', label: 'Biqu (A)', angle: "1° 55'", type: 'soft' },
  { rowPlanet: 'Ju', colPlanet: 'Ra', label: 'Deci (A)', angle: "1° 55'", type: 'soft' },

  { rowPlanet: 'Ve', colPlanet: 'Sa', label: 'Trin (A)', angle: "6° 38'", type: 'soft' },
  { rowPlanet: 'Ve', colPlanet: 'Ra', label: 'SSqu (S)', angle: "1° 05'", type: 'hard' },
  { rowPlanet: 'Ve', colPlanet: 'Ke', label: 'Sessq (S)', angle: "1° 05'", type: 'hard' },

  { rowPlanet: 'Sa', colPlanet: 'Ra', label: 'SSqu (S)', angle: "1° 05'", type: 'hard' },
  { rowPlanet: 'Sa', colPlanet: 'Ke', label: 'Sessq (S)', angle: "1° 05'", type: 'hard' },
  { rowPlanet: 'Sa', colPlanet: 'Ur', label: 'Sext (S)', angle: "2° 36'", type: 'soft' },
  { rowPlanet: 'Sa', colPlanet: 'Ne', label: 'Trin (S)', angle: "7° 31'", type: 'soft' },

  { rowPlanet: 'Ra', colPlanet: 'Ke', label: 'Oppo (E)', angle: "0° 00'", type: 'hard' },
  { rowPlanet: 'Ra', colPlanet: 'Ur', label: 'Squ (S)', angle: "0° 00'", type: 'hard' },

  { rowPlanet: 'Ke', colPlanet: 'Ur', label: 'Squ (S)', angle: "4° 21'", type: 'hard' },
  { rowPlanet: 'Ke', colPlanet: 'Ne', label: 'Sext (S)', angle: "2° 36'", type: 'soft' },
  { rowPlanet: 'Ke', colPlanet: 'Pl', label: 'Trin (S)', angle: "7° 31'", type: 'soft' },
];
