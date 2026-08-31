import React, { useState } from 'react';
import { KPChart } from '../../types/kp';
import { UnifiedAstrologyChart } from '../UnifiedAstrologyChart';

interface RVATripleChartsProps {
  kpChart?: KPChart;
  horoscopeData?: any;
  transitSnapshot?: any;
}

export const RVATripleCharts: React.FC<RVATripleChartsProps> = ({
  horoscopeData,
  transitSnapshot
}) => {
  const [activeChartFocus, setActiveChartFocus] = useState<'all' | 'd1' | 'transit' | 'd9'>('all');

  return (
    <div className="space-y-6">
      {/* Chart Focus Tabs */}
      <div className="bg-[#FAF7F2] p-2 rounded-2xl border border-[#D4C5B9]/40 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none w-full sm:w-auto">
          {[
            { key: 'all', label: 'All 3 Triple Charts (D1, Transit, D9)' },
            { key: 'd1', label: 'D1 Rasi' },
            { key: 'transit', label: 'Transit (Gochara)' },
            { key: 'd9', label: 'D9 Navamsha' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveChartFocus(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeChartFocus === tab.key
                  ? 'bg-[#E67E22] text-white shadow-xs'
                  : 'text-[#564337] hover:text-[#2C3E50] hover:bg-[#F5ECE1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className={`grid gap-6 ${
        activeChartFocus === 'all'
          ? 'grid-cols-1 lg:grid-cols-3'
          : 'grid-cols-1 max-w-3xl mx-auto'
      }`}>
        {/* 1. D1 Rasi Chart */}
        {(activeChartFocus === 'all' || activeChartFocus === 'd1') && (
          <div className="space-y-3">
            <UnifiedAstrologyChart
              chartType="D1"
              horoscopeData={horoscopeData}
              title="D1 Rasi Natal Chart"
              subtitle="Lagna Chart • Physical Incarnation & Lifelong Blueprint"
            />
          </div>
        )}

        {/* 2. Live Transit Chart */}
        {(activeChartFocus === 'all' || activeChartFocus === 'transit') && (
          <div className="space-y-3">
            <UnifiedAstrologyChart
              chartType="Transit"
              horoscopeData={horoscopeData}
              transitSnapshot={transitSnapshot}
              title="Live Gochara Transit Chart"
              subtitle="Real-Time Planetary Transits & Sky Position"
            />
          </div>
        )}

        {/* 3. D9 Navamsha Chart */}
        {(activeChartFocus === 'all' || activeChartFocus === 'd9') && (
          <div className="space-y-3">
            <UnifiedAstrologyChart
              chartType="D9"
              horoscopeData={horoscopeData}
              title="D9 Navamsha Chart"
              subtitle="9th Harmonic Division • Dharma, Inner Soul Strength & Marital Harmony"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RVATripleCharts;


