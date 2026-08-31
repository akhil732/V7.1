import React from 'react';
import { getPlanetAbbr, formatPlanetDisplay, getPlanetColor } from '../lib/planetAbbreviations';

export const SIGN_MAP: Record<string, { number: number; sanskrit: string }> = {
  "Aries": { number: 1, sanskrit: "Mesha" },
  "Taurus": { number: 2, sanskrit: "Vrishabha" },
  "Gemini": { number: 3, sanskrit: "Mithuna" },
  "Cancer": { number: 4, sanskrit: "Karka" },
  "Leo": { number: 5, sanskrit: "Simha" },
  "Virgo": { number: 6, sanskrit: "Kanya" },
  "Libra": { number: 7, sanskrit: "Tula" },
  "Scorpio": { number: 8, sanskrit: "Vrischika" },
  "Sagittarius": { number: 9, sanskrit: "Dhanus" },
  "Capricorn": { number: 10, sanskrit: "Makara" },
  "Aquarius": { number: 11, sanskrit: "Kumbha" },
  "Pisces": { number: 12, sanskrit: "Meena" }
};

export const PLANETS_SHORT: Record<string, string> = {
  "Ascendant": "L",
  "Lagna": "L",
  "Sun": "Su",
  "Moon": "Mo",
  "Mars": "Ma",
  "Mercury": "Me",
  "Jupiter": "Ju",
  "Venus": "Ve",
  "Saturn": "Sa",
  "Rahu": "Ra",
  "Ketu": "Ke"
};

const SOUTH_INDIAN_LAYOUTS: Record<number, { col: number; row: number; name: string; sanskrit: string; rashiLabel: { x: number; y: number }; center: { x: number; y: number } }> = {
  1: { col: 1, row: 0, name: "Aries", sanskrit: "Mesha", rashiLabel: { x: 110, y: 22 }, center: { x: 150, y: 60 } },
  2: { col: 2, row: 0, name: "Taurus", sanskrit: "Vrishabha", rashiLabel: { x: 210, y: 22 }, center: { x: 250, y: 60 } },
  3: { col: 3, row: 0, name: "Gemini", sanskrit: "Mithuna", rashiLabel: { x: 310, y: 22 }, center: { x: 350, y: 60 } },
  4: { col: 3, row: 1, name: "Cancer", sanskrit: "Karka", rashiLabel: { x: 310, y: 122 }, center: { x: 350, y: 160 } },
  5: { col: 3, row: 2, name: "Leo", sanskrit: "Simha", rashiLabel: { x: 310, y: 222 }, center: { x: 350, y: 260 } },
  6: { col: 3, row: 3, name: "Virgo", sanskrit: "Kanya", rashiLabel: { x: 310, y: 322 }, center: { x: 350, y: 360 } },
  7: { col: 2, row: 3, name: "Libra", sanskrit: "Tula", rashiLabel: { x: 210, y: 322 }, center: { x: 250, y: 360 } },
  8: { col: 1, row: 3, name: "Scorpio", sanskrit: "Vrischika", rashiLabel: { x: 110, y: 322 }, center: { x: 150, y: 360 } },
  9: { col: 0, row: 3, name: "Sagittarius", sanskrit: "Dhanus", rashiLabel: { x: 10, y: 322 }, center: { x: 50, y: 360 } },
  10: { col: 0, row: 2, name: "Capricorn", sanskrit: "Makara", rashiLabel: { x: 10, y: 222 }, center: { x: 50, y: 260 } },
  11: { col: 0, row: 1, name: "Aquarius", sanskrit: "Kumbha", rashiLabel: { x: 10, y: 122 }, center: { x: 50, y: 160 } },
  12: { col: 0, row: 0, name: "Pisces", sanskrit: "Meena", rashiLabel: { x: 10, y: 22 }, center: { x: 50, y: 60 } }
};

const NORTH_INDIAN_LAYOUTS: Record<number, { points: string; rashi: { x: number; y: number }; label: { x: number; y: number }; center: { x: number; y: number } }> = {
  1: { points: "200,0 100,100 200,200 300,100", rashi: { x: 200, y: 55 }, label: { x: 200, y: 22 }, center: { x: 200, y: 110 } },
  2: { points: "0,0 200,0 100,100", rashi: { x: 135, y: 40 }, label: { x: 65, y: 22 }, center: { x: 100, y: 55 } },
  3: { points: "0,0 0,200 100,100", rashi: { x: 40, y: 135 }, label: { x: 22, y: 65 }, center: { x: 55, y: 100 } },
  4: { points: "0,200 100,100 200,200 100,300", rashi: { x: 55, y: 200 }, label: { x: 22, y: 200 }, center: { x: 110, y: 200 } },
  5: { points: "0,400 0,200 100,300", rashi: { x: 40, y: 265 }, label: { x: 22, y: 335 }, center: { x: 55, y: 300 } },
  6: { points: "0,400 200,400 100,300", rashi: { x: 135, y: 360 }, label: { x: 65, y: 378 }, center: { x: 100, y: 345 } },
  7: { points: "200,400 100,300 200,200 300,300", rashi: { x: 200, y: 345 }, label: { x: 200, y: 378 }, center: { x: 200, y: 290 } },
  8: { points: "200,400 400,400 300,300", rashi: { x: 265, y: 360 }, label: { x: 335, y: 378 }, center: { x: 300, y: 345 } },
  9: { points: "400,200 400,400 300,300", rashi: { x: 360, y: 265 }, label: { x: 378, y: 335 }, center: { x: 345, y: 300 } },
  10: { points: "400,200 300,300 200,200 300,100", rashi: { x: 345, y: 200 }, label: { x: 378, y: 200 }, center: { x: 290, y: 200 } },
  11: { points: "400,0 400,200 300,100", rashi: { x: 360, y: 135 }, label: { x: 378, y: 65 }, center: { x: 345, y: 100 } },
  12: { points: "400,0 200,0 300,100", rashi: { x: 265, y: 40 }, label: { x: 335, y: 22 }, center: { x: 300, y: 55 } }
};

const EAST_INDIAN_LAYOUTS: Record<number, { type: 'triangle' | 'rect'; points?: string; x?: number; y?: number; width?: number; height?: number; name: string; sanskrit: string; label: { x: number; y: number }; center: { x: number; y: number }; }> = {
  1: { type: 'rect', x: 133.33, y: 0, width: 133.34, height: 133.33, name: "Aries", sanskrit: "Mesha", label: { x: 200, y: 22 }, center: { x: 200, y: 70 } },
  2: { type: 'triangle', points: "0,0 133.33,0 133.33,133.33", name: "Taurus", sanskrit: "Vrishabha", label: { x: 88, y: 22 }, center: { x: 88, y: 65 } },
  3: { type: 'triangle', points: "0,0 0,133.33 133.33,133.33", name: "Gemini", sanskrit: "Mithuna", label: { x: 35, y: 115 }, center: { x: 65, y: 88 } },
  4: { type: 'rect', x: 0, y: 133.33, width: 133.33, height: 133.34, name: "Cancer", sanskrit: "Karka", label: { x: 66.66, y: 155 }, center: { x: 66.66, y: 205 } },
  5: { type: 'triangle', points: "0,266.67 0,400 133.33,266.67", name: "Leo", sanskrit: "Simha", label: { x: 35, y: 285 }, center: { x: 65, y: 311 } },
  6: { type: 'triangle', points: "0,400 133.33,400 133.33,266.67", name: "Virgo", sanskrit: "Kanya", label: { x: 88, y: 378 }, center: { x: 88, y: 335 } },
  7: { type: 'rect', x: 133.33, y: 266.67, width: 133.34, height: 133.33, name: "Libra", sanskrit: "Tula", label: { x: 200, y: 378 }, center: { x: 200, y: 320 } },
  8: { type: 'triangle', points: "266.67,266.67 266.67,400 400,400", name: "Scorpio", sanskrit: "Vrischika", label: { x: 312, y: 378 }, center: { x: 312, y: 335 } },
  9: { type: 'triangle', points: "266.67,266.67 400,266.67 400,400", name: "Sagittarius", sanskrit: "Dhanus", label: { x: 365, y: 285 }, center: { x: 335, y: 311 } },
  10: { type: 'rect', x: 266.67, y: 133.33, width: 133.33, height: 133.34, name: "Capricorn", sanskrit: "Makara", label: { x: 333.33, y: 155 }, center: { x: 333.33, y: 205 } },
  11: { type: 'triangle', points: "266.67,133.33 400,0 400,133.33", name: "Aquarius", sanskrit: "Kumbha", label: { x: 365, y: 115 }, center: { x: 335, y: 88 } },
  12: { type: 'triangle', points: "266.67,0 266.67,133.33 400,0", name: "Pisces", sanskrit: "Meena", label: { x: 312, y: 22 }, center: { x: 312, y: 65 } }
};

const getSignAbbreviation = (signIndex: number) => {
  const abbreviations: Record<number, string> = {
    1: "Ari", 2: "Tau", 3: "Gem", 4: "Can", 5: "Leo", 6: "Vir",
    7: "Lib", 8: "Sco", 9: "Sag", 10: "Cap", 11: "Aqu", 12: "Pis"
  };
  return abbreviations[signIndex] || "";
};

const getPlanetOffsets = (count: number) => {
  if (count === 1) return [{ dx: 0, dy: 0 }];
  if (count === 2) return [{ dx: -15, dy: 0 }, { dx: 15, dy: 0 }];
  if (count === 3) return [{ dx: 0, dy: -12 }, { dx: -16, dy: 10 }, { dx: 16, dy: 10 }];
  if (count === 4) return [{ dx: -20, dy: -10 }, { dx: 20, dy: -10 }, { dx: -20, dy: 14 }, { dx: 20, dy: 14 }];
  if (count === 5) return [{ dx: -22, dy: -12 }, { dx: 22, dy: -12 }, { dx: 0, dy: 2 }, { dx: -22, dy: 18 }, { dx: 22, dy: 18 }];
  return [
    { dx: -22, dy: -16 }, { dx: 22, dy: -16 },
    { dx: -22, dy: 2 }, { dx: 22, dy: 2 },
    { dx: -22, dy: 20 }, { dx: 22, dy: 20 },
    { dx: 0, dy: -30 }
  ];
};

export interface LagnaChartCardProps {
  horoscope?: any;
  cardTitle: string;
  borderColor?: string;
  chartStyle: 'south-indian' | 'east-indian' | 'north-indian';
  onChartStyleChange: (style: 'south-indian' | 'east-indian' | 'north-indian') => void;
  chartKey?: string;
  chartDataOverride?: any;
  centerBadgeText?: string;
}

export const LagnaChartCard: React.FC<LagnaChartCardProps> = ({
  horoscope,
  cardTitle,
  chartStyle,
  onChartStyleChange,
  chartKey = 'D-1_rasi',
  chartDataOverride,
  centerBadgeText,
}) => {
  const chartData = chartDataOverride || 
    (chartKey === 'D-9_navamsa'
      ? (horoscope?.divisional_charts?.['D-9_navamsa'] || horoscope?.divisional_charts?.['D9'] || horoscope?.navamsa || horoscope?.d9)
      : (horoscope?.divisional_charts?.['D-1_rasi'] || horoscope?.divisional_charts?.['D1'] || horoscope?.rasi || horoscope?.d1 || horoscope));

  const retrogradePlanets: string[] = 
    horoscope?.retrograde_planets || 
    horoscope?.planetary_states?.retrograde_planets || 
    [];

  const rawAsc = chartData?.Ascendant || chartData?.Lagna || chartData?.ascendant || chartData?.lagna;
  const ascSignName = typeof rawAsc === 'string' ? rawAsc : (rawAsc?.sign || "Unknown");
  const ascSignIndex = SIGN_MAP[ascSignName]?.number || 1;

  // Process planets
  const planetsInSigns: Record<number, string[]> = {};
  for (let s = 1; s <= 12; s++) planetsInSigns[s] = [];

  if (ascSignIndex >= 1 && ascSignIndex <= 12) {
    planetsInSigns[ascSignIndex].push("L");
  }

  const grahas = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  if (chartData) {
    grahas.forEach(g => {
      const gData = chartData[g] || chartData[g.toLowerCase()];
      if (gData) {
        const signName = typeof gData === 'string' ? gData : gData.sign;
        const signNum = SIGN_MAP[signName]?.number || 1;
        planetsInSigns[signNum].push(PLANETS_SHORT[g] || g.substring(0, 2));
      }
    });
  }

  const renderPlanetChips = (planets: string[], cx: number, cy: number) => {
    const offsets = getPlanetOffsets(planets.length);
    return planets.map((p, idx) => {
      const isLagna = p === 'L' || p === 'Asc' || p === 'Lg';
      const isMercury = p === 'Me' || p === 'Mercury';
      const isRetro = !isLagna && !isMercury && retrogradePlanets.includes(
        p === 'Su' ? 'Sun' : p === 'Mo' ? 'Moon' : p === 'Ma' ? 'Mars' : p === 'Me' ? 'Mercury' : p === 'Ju' ? 'Jupiter' : p === 'Ve' ? 'Venus' : p === 'Sa' ? 'Saturn' : p === 'Ra' ? 'Rahu' : p === 'Ke' ? 'Ketu' : ''
      );
      const offset = offsets[idx] || { dx: 0, dy: 0 };
      const px = cx + offset.dx;
      const py = cy + offset.dy;
      const planetColor = getPlanetColor(p);
      const displayText = formatPlanetDisplay(p, isRetro);
      const chipWidth = isRetro ? 32 : 28;

      return (
        <g key={p + idx} transform={`translate(${px - (chipWidth / 2)}, ${py - 9})`}>
          <rect
            width={chipWidth}
            height="18"
            rx="4"
            ry="4"
            fill={isLagna ? "#E67E22" : isRetro ? "#FEF2F2" : "#FDFBF7"}
            stroke={isLagna ? "#B85D06" : isRetro ? "#EF4444" : "rgba(230, 126, 34, 0.3)"}
            strokeWidth={isLagna || isRetro ? "1.5" : "1"}
          />
          <text
            x={chipWidth / 2}
            y="13"
            textAnchor="middle"
            fill={isLagna ? "#FFFFFF" : isRetro ? "#DC2626" : planetColor}
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {displayText}
          </text>
        </g>
      );
    });
  };

  const displayBadge = centerBadgeText || (chartKey === 'D-9_navamsa' ? 'D-9' : 'D-1');

  const renderSouthIndianChart = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto max-w-[340px] aspect-square mx-auto bg-white select-none shadow-[inset_0px_0px_1px_rgba(230,126,34,0.1)] rounded-xl overflow-hidden border border-[#E67E22]/30">
      <rect x="100" y="100" width="200" height="200" fill="#FDFBF7" stroke="rgba(230, 126, 34, 0.25)" strokeWidth="1.5" />
      <text x="200" y="190" textAnchor="middle" fill="#E67E22" fontSize="16" fontWeight="700" letterSpacing="0.15em" fontFamily="serif">{displayBadge}</text>
      <text x="200" y="215" textAnchor="middle" fill="#8A7B6E" fontSize="11" fontWeight="600" fontFamily="sans-serif">Lagna: {ascSignName}</text>
      
      {Object.entries(SOUTH_INDIAN_LAYOUTS).map(([signStr, layout]) => {
        const signIndex = parseInt(signStr);
        const planets = planetsInSigns[signIndex] || [];
        const isLagnaSign = ascSignIndex === signIndex;
        const x = layout.col * 100;
        const y = layout.row * 100;

        return (
          <g key={signIndex} className="group">
            <rect x={x} y={y} width="100" height="100" fill={isLagnaSign ? "#FFF8EE" : "#FFFFFF"} stroke={isLagnaSign ? "#E67E22" : "rgba(230, 126, 34, 0.25)"} strokeWidth={isLagnaSign ? "1.5" : "1"} className="hover:fill-[#F7F1E8] transition-colors" />
            {isLagnaSign && <line x1={x} y1={y} x2={x + 30} y2={y + 30} stroke="#E67E22" strokeWidth="1.5" />}
            <text x={layout.rashiLabel.x} y={layout.rashiLabel.y} fill={isLagnaSign ? "#E67E22" : "#8A7B6E"} fontSize="10" fontWeight="700" fontFamily="sans-serif">{layout.sanskrit.substring(0, 3)} ({signIndex})</text>
            {renderPlanetChips(planets, layout.center.x, layout.center.y)}
          </g>
        );
      })}
    </svg>
  );

  const renderNorthIndianChart = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto max-w-[340px] aspect-square mx-auto bg-white select-none shadow-[inset_0px_0px_1px_rgba(230,126,34,0.1)] rounded-xl overflow-hidden border border-[#E67E22]/30">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
        const rashiNum = ((ascSignIndex - 1 + (houseNum - 1)) % 12) + 1;
        const planets = planetsInSigns[rashiNum] || [];
        const layout = NORTH_INDIAN_LAYOUTS[houseNum];
        if (!layout) return null;

        return (
          <g key={houseNum} className="group">
            <polygon points={layout.points} fill={houseNum === 1 ? "#FFF8EE" : "#FFFFFF"} stroke="rgba(230, 126, 34, 0.35)" strokeWidth="1.2" className="hover:fill-[#F7F1E8] transition-colors" />
            <text x={layout.label.x} y={layout.label.y} textAnchor="middle" fill="#8A7B6E" fontSize="9" fontWeight="600" fontFamily="sans-serif">H{houseNum}</text>
            <text x={layout.rashi.x} y={layout.rashi.y} textAnchor="middle" fill="#E67E22" fontSize="11" fontWeight="bold" fontFamily="sans-serif">{rashiNum}</text>
            {renderPlanetChips(planets, layout.center.x, layout.center.y)}
          </g>
        );
      })}
      <line x1="0" y1="0" x2="400" y2="400" stroke="rgba(230, 126, 34, 0.25)" strokeWidth="1.2" pointerEvents="none" />
      <line x1="400" y1="0" x2="0" y2="400" stroke="rgba(230, 126, 34, 0.25)" strokeWidth="1.2" pointerEvents="none" />
      <line x1="200" y1="0" x2="0" y2="200" stroke="rgba(230, 126, 34, 0.25)" strokeWidth="1.2" pointerEvents="none" />
      <line x1="0" y1="200" x2="200" y2="400" stroke="rgba(230, 126, 34, 0.25)" strokeWidth="1.2" pointerEvents="none" />
      <line x1="200" y1="400" x2="400" y2="200" stroke="rgba(230, 126, 34, 0.25)" strokeWidth="1.2" pointerEvents="none" />
      <line x1="400" y1="200" x2="200" y2="0" stroke="rgba(230, 126, 34, 0.25)" strokeWidth="1.2" pointerEvents="none" />
    </svg>
  );

  const renderEastIndianChart = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto max-w-[340px] aspect-square mx-auto bg-white select-none shadow-[inset_0px_0px_1px_rgba(230,126,34,0.1)] rounded-xl overflow-hidden border border-[#E67E22]/30">
      {Object.entries(EAST_INDIAN_LAYOUTS).map(([signStr, layout]) => {
        const signIndex = parseInt(signStr);
        const planets = planetsInSigns[signIndex] || [];
        const isLagnaSign = ascSignIndex === signIndex;
        const houseNum = ((signIndex - ascSignIndex + 12) % 12) + 1;

        return (
          <g key={signIndex} className="group">
            {layout.type === 'rect' ? (
              <rect x={layout.x} y={layout.y} width={layout.width} height={layout.height} fill={isLagnaSign ? "#FFF8EE" : "#FFFFFF"} stroke={isLagnaSign ? "#E67E22" : "rgba(230, 126, 34, 0.25)"} strokeWidth={isLagnaSign ? "1.5" : "1"} className="hover:fill-[#F7F1E8] transition-colors" />
            ) : (
              <polygon points={layout.points} fill={isLagnaSign ? "#FFF8EE" : "#FFFFFF"} stroke={isLagnaSign ? "#E67E22" : "rgba(230, 126, 34, 0.25)"} strokeWidth={isLagnaSign ? "1.5" : "1"} className="hover:fill-[#F7F1E8] transition-colors" />
            )}
            <text x={layout.label.x} y={layout.label.y} textAnchor="middle" fill={isLagnaSign ? "#E67E22" : "#8A7B6E"} fontSize="10" fontWeight="bold" fontFamily="sans-serif">{getSignAbbreviation(signIndex)} (H{houseNum})</text>
            {renderPlanetChips(planets, layout.center.x, layout.center.y)}
          </g>
        );
      })}
      <rect x="133.33" y="133.33" width="133.34" height="133.34" fill="#FDFBF7" stroke="rgba(230, 126, 34, 0.25)" strokeWidth="1.5" />
      <text x="200" y="190" textAnchor="middle" fill="#E67E22" fontSize="16" fontWeight="700" letterSpacing="0.15em" fontFamily="serif">{displayBadge}</text>
      <text x="200" y="215" textAnchor="middle" fill="#8A7B6E" fontSize="11" fontWeight="600" fontFamily="sans-serif">Lagna: {ascSignName}</text>
    </svg>
  );

  return (
    <div className="bg-white rounded-2xl border border-[#D4C5B9]/50 shadow-[0px_2px_12px_rgba(44,62,80,0.06)] overflow-hidden flex flex-col">
      <div className="px-4 sm:px-5 py-3.5 border-b border-[#D4C5B9]/30 flex flex-wrap justify-between items-center bg-[#FDFBF7] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E67E22]" />
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
            {cardTitle}
          </h3>
        </div>
        
        <div className="flex bg-[#F5ECE1] p-1 rounded-xl border border-[#D4C5B9]/40 text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => onChartStyleChange('south-indian')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              chartStyle === 'south-indian'
                ? 'bg-white text-[#E67E22] shadow-xs font-bold'
                : 'text-[#8A7B6E] hover:text-[#2C3E50]'
            }`}
          >
            South
          </button>
          <button
            type="button"
            onClick={() => onChartStyleChange('north-indian')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              chartStyle === 'north-indian'
                ? 'bg-white text-[#E67E22] shadow-xs font-bold'
                : 'text-[#8A7B6E] hover:text-[#2C3E50]'
            }`}
          >
            North
          </button>
          <button
            type="button"
            onClick={() => onChartStyleChange('east-indian')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              chartStyle === 'east-indian'
                ? 'bg-white text-[#E67E22] shadow-xs font-bold'
                : 'text-[#8A7B6E] hover:text-[#2C3E50]'
            }`}
          >
            East
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[#F7F1E8]/20 flex flex-col items-center justify-center min-h-[300px]">
        {chartData ? (
          chartStyle === 'south-indian' 
            ? renderSouthIndianChart() 
            : chartStyle === 'north-indian' 
              ? renderNorthIndianChart() 
              : renderEastIndianChart()
        ) : (
          <div className="text-[#8A7B6E] text-sm">Chart data unavailable</div>
        )}
      </div>
    </div>
  );
};

export default LagnaChartCard;

