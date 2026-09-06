import React from 'react';
import { PLANETARY_POSITIONS, CUSPS_DATA } from './rvaData';
import { calculateKPSubLord, formatDegrees } from '../../lib/kp/subLordMapper';
import { calculatePlacidusCusps } from '../../lib/kp/placidusCalculator';

interface RVAPositionsAndCuspsProps {
  horoscopeReport?: any;
  activeProfile?: any;
}

const PLANET_SHORT_MAP: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke'
};

const SIGN_ABBR_MAP: Record<string, string> = {
  Aries: 'Ar', Taurus: 'Ta', Gemini: 'Ge', Cancer: 'Cn', Leo: 'Le', Virgo: 'Vi',
  Libra: 'Li', Scorpio: 'Sc', Sagittarius: 'Sg', Capricorn: 'Cp', Aquarius: 'Aq', Pisces: 'Pi'
};

const getShortPlanet = (name: string): string => PLANET_SHORT_MAP[name] || name.substring(0, 2);

export const RVAPositionsAndCusps: React.FC<RVAPositionsAndCuspsProps> = ({
  horoscopeReport,
  activeProfile,
}) => {
  let planetsData = PLANETARY_POSITIONS;
  let cuspsData = CUSPS_DATA;

  if (horoscopeReport) {
    const signMap: Record<string, number> = {
      Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5,
      Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11
    };

    // Correct Sidereal baseline for Akhil (Aquarius Lagna 21°28'05")
    let planetLongitudes: Record<string, number> = {
      Sun: 180 + 25.4228,       // Libra 25°25'22"
      Moon: 180 + 27.5522,      // Libra 27°33'08"
      Mars: 120 + 12.7322,      // Leo 12°43'56"
      Mercury: 210 + 0.9814,    // Scorpio 00°58'53"
      Jupiter: 240 + 20.7822,   // Sagittarius 20°46'56"
      Venus: 150 + 21.8042,     // Virgo 21°48'15"
      Saturn: 330 + 7.2161,     // Pisces 07°12'58"
      Rahu: 150 + 11.9206,      // Virgo 11°55'14"
      Ketu: 330 + 11.9206,      // Pisces 11°55'14"
      Uranus: 270 + 7.3647,     // Capricorn 07°21'53"
      Neptune: 270 + 1.4617,    // Capricorn 01°27'42"
      Pluto: 210 + 8.5853,      // Scorpio 08°35'07"
      Lagna: 300 + 21.4681      // Aquarius 21°28'05"
    };

    const d1 = horoscopeReport?.horoscope?.divisional_charts?.['D-1_rasi'];
    if (d1) {
      Object.keys(d1).forEach((key) => {
        const item = d1[key];
        if (item && item.sign && typeof item.longitude === 'number') {
          const sIdx = signMap[item.sign] ?? 0;
          const absDeg = ((sIdx * 30 + item.longitude) % 360 + 360) % 360;
          const stdKey = key === 'Ascendant' ? 'Lagna' : key;
          planetLongitudes[stdKey] = absDeg;
        }
      });
    }

    // Compute planets
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const ascSign = d1?.Ascendant?.sign || d1?.Lagna?.sign || 'Aquarius';
    const ascIdx = signMap[ascSign] ?? 10;

    planetsData = planetNames.map((pName) => {
      const deg = planetLongitudes[pName] ?? 180;
      const subLordChain = calculateKPSubLord(deg);
      
      const pSignIdx = signMap[subLordChain.sign] ?? 0;
      const houseIndex = ((pSignIdx - ascIdx + 12) % 12) + 1;

      const signAbbr = SIGN_ABBR_MAP[subLordChain.sign] || subLordChain.sign.substring(0, 2);

      return {
        planet: `${getShortPlanet(pName)} (${pName})`,
        sign: `${subLordChain.sign} (${signAbbr})`,
        longitude: formatDegrees(deg),
        house: houseIndex,
        nakshatra: `${subLordChain.starLord} (Sub)`,
        sl: getShortPlanet(subLordChain.signLord),
        nl: getShortPlanet(subLordChain.starLord),
        sub: getShortPlanet(subLordChain.subLord),
        ss: getShortPlanet(subLordChain.subSubLord),
        sss: getShortPlanet(subLordChain.subSubLord)
      };
    });

    // Compute cusps
    const ascDegree = planetLongitudes.Lagna ?? 321.468;
    const latitude = activeProfile?.latitude ?? 17.17;
    const date = activeProfile?.date ?? '1996-11-11';
    const time = activeProfile?.time ?? '13:50:00';
    const rawHouses = calculatePlacidusCusps(ascDegree, latitude, date, time);

    cuspsData = rawHouses.map((house) => {
      const subLordChain = calculateKPSubLord(house.cuspDegree);
      const romanNumerals = ['I (Lagna)', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
      const cuspName = `Cusp ${romanNumerals[house.number - 1]}`;

      return {
        house: cuspName,
        sign: house.sign,
        longitude: house.formattedDegree,
        nakshatra: `${house.starLord} (Sub)`,
        sl: getShortPlanet(house.signLord),
        nl: getShortPlanet(house.starLord),
        sub: getShortPlanet(house.subLord),
        ss: getShortPlanet(house.subSubLord || 'Saturn'),
        sss: getShortPlanet(house.subSubLord || 'Saturn')
      };
    });
  }

  return (
    <div className="bg-ds-surface border-b border-ds-secondary/15 p-4 sm:p-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Left Table: Planetary Positions */}
        <div className="border border-ds-secondary/15 rounded-2xl p-4 bg-ds-surface shadow-xs space-y-3 overflow-x-auto">
          <div className="flex items-center justify-between border-b border-ds-secondary/10 pb-2">
            <h3 className="font-serif font-bold text-ds-secondary text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ds-primary" />
              <span>Planetary Positions & KP Sub-Lords</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-ds-primary/10 text-ds-primary px-2 py-0.5 rounded-full">
              9 Grahas
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-ds-secondary/10">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-ds-surface-container border-b border-ds-secondary/15 text-ds-on-surface-variant font-bold text-[10px]">
                  <th className="py-2 px-2">Planet</th>
                  <th className="py-2 px-2">Sign</th>
                  <th className="py-2 px-2">Longitude</th>
                  <th className="py-2 px-2 text-center">H#</th>
                  <th className="py-2 px-2">Nakshatra</th>
                  <th className="py-2 px-2">SL</th>
                  <th className="py-2 px-2">NL</th>
                  <th className="py-2 px-2 font-bold text-ds-primary">Sub</th>
                  <th className="py-2 px-2">SS</th>
                  <th className="py-2 px-2">SSS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ds-secondary/10 font-mono text-[11px]">
                {planetsData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-ds-surface-container/50 transition-colors">
                    <td className="py-1.5 px-2 font-serif font-bold text-ds-secondary">{row.planet}</td>
                    <td className="py-1.5 px-2 font-sans font-medium text-ds-on-surface">{row.sign}</td>
                    <td className="py-1.5 px-2 text-ds-on-surface-variant">{row.longitude}</td>
                    <td className="py-1.5 px-2 text-center font-bold text-ds-secondary">{row.house}</td>
                    <td className="py-1.5 px-2 font-sans text-ds-on-surface">{row.nakshatra}</td>
                    <td className="py-1.5 px-2 font-bold text-ds-secondary">{row.sl}</td>
                    <td className="py-1.5 px-2 text-ds-on-surface-variant">{row.nl}</td>
                    <td className="py-1.5 px-2 font-bold text-ds-primary">{row.sub}</td>
                    <td className="py-1.5 px-2 text-ds-on-surface-variant">{row.ss}</td>
                    <td className="py-1.5 px-2 text-ds-on-surface-variant">{row.sss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Table: House Cusps */}
        <div className="border border-ds-secondary/15 rounded-2xl p-4 bg-ds-surface shadow-xs space-y-3 overflow-x-auto">
          <div className="flex items-center justify-between border-b border-ds-secondary/10 pb-2">
            <h3 className="font-serif font-bold text-ds-secondary text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ds-tertiary" />
              <span>House Cusps (Placidus KP System)</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-ds-tertiary/20 text-ds-secondary px-2 py-0.5 rounded-full">
              Cusps I — XII
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-ds-secondary/10">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-ds-surface-container border-b border-ds-secondary/15 text-ds-on-surface-variant font-bold text-[10px]">
                  <th className="py-2 px-2">Cusp</th>
                  <th className="py-2 px-2">Rasi Sign</th>
                  <th className="py-2 px-2">Degree</th>
                  <th className="py-2 px-2">Nakshatra</th>
                  <th className="py-2 px-2">SL</th>
                  <th className="py-2 px-2">NL</th>
                  <th className="py-2 px-2 font-bold text-ds-primary">Sub</th>
                  <th className="py-2 px-2">SS</th>
                  <th className="py-2 px-2">SSS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ds-secondary/10 font-mono text-[11px]">
                {cuspsData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-ds-surface-container/50 transition-colors">
                    <td className="py-1.5 px-2 font-serif font-bold text-ds-secondary">{row.house}</td>
                    <td className="py-1.5 px-2 font-sans font-medium text-ds-on-surface">{row.sign}</td>
                    <td className="py-1.5 px-2 text-ds-on-surface-variant">{row.longitude}</td>
                    <td className="py-1.5 px-2 font-sans text-ds-on-surface">{row.nakshatra}</td>
                    <td className="py-1.5 px-2 font-bold text-ds-secondary">{row.sl}</td>
                    <td className="py-1.5 px-2 text-ds-on-surface-variant">{row.nl}</td>
                    <td className="py-1.5 px-2 font-bold text-ds-primary">{row.sub}</td>
                    <td className="py-1.5 px-2 text-ds-on-surface-variant">{row.ss}</td>
                    <td className="py-1.5 px-2 text-ds-on-surface-variant">{row.sss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
