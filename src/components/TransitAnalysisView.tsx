import React from 'react';
import { Compass, Clock, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { PlanetKey } from '../lib/engines/LiveTransitEngine';
import { useLanguage } from '../context/LanguageContext';
import { 
  TRANSIT_LABELS, 
  Lang, 
  translateSign, 
  translatePlanet, 
  translateTransitSaturnDesc, 
  translateTransitJupiterDesc 
} from '../lib/i18n/astrologicalTerms';

interface TransitAnalysisViewProps {
  transitSnapshot: any;
  todayGochara?: any;
  horoscopeData: any;
  language?: 'en' | 'hi' | 'te';
}

const SIGN_INDEX_MAP: Record<string, number> = {
  "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4,
  "Leo": 5, "Virgo": 6, "Libra": 7, "Scorpio": 8,
  "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
};

export const TransitAnalysisView: React.FC<TransitAnalysisViewProps> = ({
  transitSnapshot,
  todayGochara,
  horoscopeData,
  language = 'en'
}) => {
  const { language: ctxLanguage } = useLanguage();
  const activeLang = ((language || ctxLanguage) as Lang) || 'en';
  const labels = TRANSIT_LABELS[activeLang] || TRANSIT_LABELS.en;

  // Extract Natal Lagna and Moon
  const natalD1 = horoscopeData?.horoscope?.divisional_charts?.["D-1_rasi"] || horoscopeData?.rasi || {};
  const natalLagnaSign = natalD1?.Ascendant?.sign || natalD1?.Lagna?.sign || 'Aries';
  const natalMoonSign = natalD1?.Moon?.sign || 'Cancer';

  const lagnaIdx = SIGN_INDEX_MAP[natalLagnaSign] || 1;
  const moonIdx = SIGN_INDEX_MAP[natalMoonSign] || 4;

  const positions = transitSnapshot?.positions || {};
  const planetKeys: PlanetKey[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  // Sade Sati check: Saturn in (Moon - 1), Moon, or (Moon + 1)
  const saturnSign = positions.Saturn?.sign || 'Aquarius';
  const saturnIdx = SIGN_INDEX_MAP[saturnSign] || 11;
  const diffSaturnMoon = ((saturnIdx - moonIdx + 12) % 12);
  const isSadeSati = diffSaturnMoon === 11 || diffSaturnMoon === 0 || diffSaturnMoon === 1;
  const sadeSatiPhase = diffSaturnMoon === 11 ? 'Rising (12th from Moon)' : diffSaturnMoon === 0 ? 'Peak (1st from Moon)' : diffSaturnMoon === 1 ? 'Setting (2nd from Moon)' : 'Inactive';

  // Jupiter 9th/5th/1st/11th/2nd/7th transit check
  const jupiterSign = positions.Jupiter?.sign || 'Taurus';
  const jupiterIdx = SIGN_INDEX_MAP[jupiterSign] || 2;
  const jupiterHouseFromMoon = ((jupiterIdx - moonIdx + 12) % 12) + 1;
  const isJupiterAuspicious = [2, 5, 7, 9, 11].includes(jupiterHouseFromMoon);

  return (
    <div className="bg-white rounded-2xl border border-[#D4C5B9]/50 shadow-[0px_2px_12px_rgba(44,62,80,0.06)] overflow-hidden p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4C5B9]/30 pb-4">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50] flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#E67E22]" />
            <span>{labels.title}</span>
          </h3>
          <p className="text-xs text-[#8A7B6E] mt-0.5 font-medium">
            {labels.subtitle(natalLagnaSign, natalMoonSign)}
          </p>
        </div>
      </div>

      {/* Transit Key Callouts (Sade Sati & Guru Gochara) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Sade Sati Card */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          isSadeSati ? 'bg-[#FFF8EE] border-[#E67E22]/40' : 'bg-[#FDFBF7] border-[#D4C5B9]/40'
        }`}>
          <div className="p-2 rounded-lg bg-[#E67E22]/10 text-[#E67E22] shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2C3E50]">{labels.saturnTransit}</span>
              {isSadeSati && (
                <span className="bg-[#BA1A1A]/10 text-[#BA1A1A] border border-[#BA1A1A]/20 px-2 py-0.2 rounded-full text-[9px] font-bold uppercase">
                  {labels.sadeSatiActive}
                </span>
              )}
            </div>
            <p className="text-xs text-[#564337] mt-1 leading-relaxed">
              {translateTransitSaturnDesc(
                saturnSign,
                ((saturnIdx - lagnaIdx + 12) % 12) + 1,
                ((saturnIdx - moonIdx + 12) % 12) + 1,
                isSadeSati,
                sadeSatiPhase,
                activeLang
              )}
            </p>
          </div>
        </div>

        {/* Jupiter Gochara Card */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          isJupiterAuspicious ? 'bg-[#F4F9F4] border-[#2E7D32]/30' : 'bg-[#FDFBF7] border-[#D4C5B9]/40'
        }`}>
          <div className="p-2 rounded-lg bg-[#2E7D32]/10 text-[#2E7D32] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2C3E50]">{labels.jupiterTransit}</span>
              {isJupiterAuspicious && (
                <span className="bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20 px-2 py-0.2 rounded-full text-[9px] font-bold uppercase">
                  {labels.auspicious}
                </span>
              )}
            </div>
            <p className="text-xs text-[#564337] mt-1 leading-relaxed">
              {translateTransitJupiterDesc(
                jupiterSign,
                jupiterHouseFromMoon,
                isJupiterAuspicious,
                activeLang
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Transit Table */}
      <div className="overflow-x-auto rounded-xl border border-[#D4C5B9]/40">
        <table className="w-full text-left text-xs text-[#2C3E50]">
          <thead className="bg-[#FDFBF7] text-[10px] uppercase font-mono font-bold text-[#8A7B6E]">
            <tr>
              <th className="py-3 px-4 border-b border-[#D4C5B9]/30">{labels.graha}</th>
              <th className="py-3 px-4 border-b border-[#D4C5B9]/30">{labels.currentSignDeg}</th>
              <th className="py-3 px-4 border-b border-[#D4C5B9]/30">{labels.status}</th>
              <th className="py-3 px-4 border-b border-[#D4C5B9]/30">{labels.fromLagna}</th>
              <th className="py-3 px-4 border-b border-[#D4C5B9]/30">{labels.fromMoon}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4C5B9]/20 bg-white">
            {planetKeys.map((pKey, idx) => {
              const pos = positions[pKey];
              const signName = pos?.sign || 'Aries';
              const signNum = SIGN_INDEX_MAP[signName] || 1;
              const houseFromLagna = ((signNum - lagnaIdx + 12) % 12) + 1;
              const houseFromMoon = ((signNum - moonIdx + 12) % 12) + 1;
              const deg = pos?.siderealLongitude ? (pos.siderealLongitude % 30).toFixed(2) : '0.00';
              const isRetro = pos?.isRetrograde;
              const translatedPlanetName = translatePlanet(pKey, activeLang);
              const translatedSignName = translateSign(signName, activeLang);

              return (
                <tr key={pKey} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-[#FDFBF7]/50'}>
                  <td className="py-3 px-4 font-bold text-[#2C3E50] whitespace-nowrap">
                    {translatedPlanetName}
                  </td>
                  <td className="py-3 px-4 font-serif font-semibold text-[#E67E22] whitespace-nowrap">
                    {deg}° ({translatedSignName})
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {isRetro ? (
                      <span className="bg-[#BA1A1A]/10 text-[#BA1A1A] border border-[#BA1A1A]/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                        {labels.retrograde}
                      </span>
                    ) : (
                      <span className="text-[#2E7D32] text-[11px] font-semibold">{labels.direct}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#2C3E50] whitespace-nowrap">
                    {labels.house(houseFromLagna)}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#2C3E50] whitespace-nowrap">
                    {labels.house(houseFromMoon)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
