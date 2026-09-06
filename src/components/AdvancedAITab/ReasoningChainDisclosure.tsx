import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  Calendar,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Compass,
  Layers
} from 'lucide-react';
import {
  VedicReasoningContext,
  VedicDomain
} from '../../lib/engines/VedicReasoningLayer';

export interface ReasoningChainDisclosureProps {
  context: VedicReasoningContext;
  messageId?: string;
  language?: 'en' | 'hi' | 'te';
  defaultExpanded?: boolean;
}

const DOMAIN_LABELS: Record<VedicDomain, { en: string; te: string; hi: string }> = {
  progeny: { en: 'Progeny & Family Lineage', te: 'సంతానం మరియు వంశాభివృద్ధి', hi: 'संतान एवं कुल वृद्धि' },
  marriage: { en: 'Marriage & Relationship', te: 'వివాహం మరియు దాంపత్యం', hi: 'विवाह एवं संबंध' },
  career: { en: 'Career & Profession', te: 'ఉద్యోగం మరియు వృత్తి', hi: 'करियर एवं व्यवसाय' },
  health: { en: 'Health & Vitality', te: 'ఆరోగ్యం మరియు శరీర బలం', hi: 'स्वास्थ्य एवं जीवन शक्ति' },
  finance: { en: 'Wealth & Finance', te: 'ఆర్థికం మరియు ధన సంపద', hi: 'वित्त एवं संपत्ति' },
  foreign_travel: { en: 'Foreign Travel & Relocation', te: 'విదేశీ యానం మరియు వలస', hi: 'विदेश यात्रा एवं प्रवास' },
  education: { en: 'Education & Learning', te: 'విద్యాభ్యాసం మరియు జ్ఞానం', hi: 'शिक्षा एवं विद्या' },
  property: { en: 'Property & Real Estate', te: 'ఆస్తి మరియు గృహ నిర్మాణం', hi: 'संपत्ति एवं गृह' },
  litigation: { en: 'Litigation & Legal Disputes', te: 'కోర్టు మరియు న్యాయ పోరాటం', hi: 'मुकदमेबाजी एवं विवाद' },
  spirituality: { en: 'Spirituality & Dharma', te: 'ఆధ్యాత్మికత మరియు ధర్మం', hi: 'अध्यात्म एवं धर्म' },
  general: { en: 'General Life Analysis', te: 'సమగ్ర జీవిత విశ్లేషణ', hi: 'सामान्य जीवन विश्लेषण' }
};

export const ReasoningChainDisclosure: React.FC<ReasoningChainDisclosureProps> = ({
  context,
  messageId = 'reasoning_ctx',
  language = 'te',
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const {
    domain,
    natalPromise,
    dashaActivation,
    transitConfirmation,
    historicalEventWindows,
    futureTimingWindows,
    overallSignal,
    keyInsight,
    missingDataItems
  } = context;

  const domainLabel = DOMAIN_LABELS[domain]?.[language] || DOMAIN_LABELS[domain]?.en || domain;

  // Signal color formatting
  const getSignalBadge = (sig: typeof overallSignal) => {
    switch (sig) {
      case 'VERY_FAVORABLE':
      case 'FAVORABLE':
        return {
          label: language === 'te' ? 'అనుకూల సమయం' : language === 'hi' ? 'अनुकूल समय' : 'Favorable Signal',
          color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        };
      case 'MIXED_DELAY':
        return {
          label: language === 'te' ? 'ఆలస్యం · సాధన అవసరం' : language === 'hi' ? 'विलंब · प्रयास आवश्यक' : 'Mixed / Delayed',
          color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
          icon: <Clock className="w-3 h-3 text-amber-400" />
        };
      case 'CRITICAL_CAUTION':
      case 'CHALLENGING':
      default:
        return {
          label: language === 'te' ? 'జాగ్రత్త · పరీక్షా కాలం' : language === 'hi' ? 'सतर्कता · परीक्षण काल' : 'Challenging / Caution',
          color: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
          icon: <AlertTriangle className="w-3 h-3 text-rose-400" />
        };
    }
  };

  const getVerdictStyle = (v: string) => {
    switch (v.toLowerCase()) {
      case 'strong':
      case 'supportive':
      case 'confirming':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
      case 'moderate':
      case 'delayed':
      case 'neutral':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/50';
      case 'obstructed':
      case 'challenging':
      case 'critical':
      case 'contradicting':
      default:
        return 'text-rose-400 bg-rose-950/40 border-rose-800/50';
    }
  };

  const badge = getSignalBadge(overallSignal);

  return (
    <div
      id={`disclosure_${messageId}`}
      className="reasoning-disclosure-wrapper my-3 rounded-xl border border-slate-700/70 bg-slate-900/90 shadow-md overflow-hidden text-xs"
    >
      {/* ─── Toggle Header Bar ─── */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-800/60 hover:bg-slate-800/90 transition-colors border-b border-slate-700/50 text-left cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold tracking-wide uppercase text-[10px]">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'te'
                ? 'వేద జ్యోతిష సూత్రాల ఆధారాలు'
                : language === 'hi'
                ? 'वैदिक ज्योतिष तीन-स्तरीय विश्लेषण'
                : 'Vedic Three-Layer Framework'}
            </span>
          </div>

          <span className="text-slate-500 font-mono text-[10px]">•</span>

          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-800 text-slate-300 border border-slate-700/70">
            {domainLabel}
          </span>

          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium shrink-0 ml-2">
          <span>{isExpanded ? (language === 'te' ? 'దాచు' : 'Collapse') : (language === 'te' ? 'వివరాలు చూడండి' : 'Inspect Logic')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* ─── Collapsible Body ─── */}
      {isExpanded && (
        <div className="p-3.5 space-y-3.5 bg-slate-900/95 text-slate-300">
          {/* Core Key Insight Callout */}
          <div className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                {language === 'te' ? 'ప్రధాన అంతర్దృష్టి (Key Insight)' : 'Core Planetary Finding'}
              </span>
              <p className="text-slate-200 text-[11.5px] leading-relaxed font-normal">{keyInsight}</p>
            </div>
          </div>

          {/* Missing Data Warning if applicable */}
          {missingDataItems.length > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 flex items-center gap-2 text-amber-300 text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {language === 'te'
                  ? `గమనిక: ${missingDataItems.join(', ')} అందుబాటులో లేదు. ఫలితాలలో జాగ్రత్త అవసరం.`
                  : `Note: ${missingDataItems.join(', ')} unavailable in chart data; divisional predictions are approximate.`}
              </span>
            </div>
          )}

          {/* ─── THREE LAYERS GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* Layer 1: Natal Promise */}
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/40">
                  <span className="text-[10.5px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-700/60 text-slate-300 flex items-center justify-center text-[9px] font-mono">1</span>
                    {language === 'te' ? 'జన్మ ప్రాప్తం' : 'Natal Promise'}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase border ${getVerdictStyle(
                      natalPromise.verdict
                    )}`}
                  >
                    {natalPromise.verdict}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{language === 'te' ? 'కారక గ్రహం' : 'Dominant Planet'}:</span>
                    <strong className="text-slate-200">{natalPromise.dominantPlanet}</strong>
                  </div>

                  {natalPromise.blockingPlanet && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{language === 'te' ? 'అవరోధ గ్రహం' : 'Afflicting Lord'}:</span>
                      <strong className="text-rose-300">{natalPromise.blockingPlanet}</strong>
                    </div>
                  )}

                  {natalPromise.trikaAfflictions.length > 0 ? (
                    <div className="pt-1 text-[10.5px] text-amber-300/90 leading-snug">
                      ⚠ {natalPromise.trikaAfflictions[0].theme}
                    </div>
                  ) : (
                    <div className="pt-1 text-[10.5px] text-emerald-400/90">
                      ✓ {language === 'te' ? 'త్రిక స్థాన పీడలు లేవు' : 'No direct Trika obstruction.'}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/30 text-[10px] text-slate-400">
                {language === 'te' ? 'విశ్వసనీయత' : 'Confidence'}: <strong className="text-slate-200">{natalPromise.confidenceScore}%</strong>
              </div>
            </div>

            {/* Layer 2: Dasha Activation */}
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/40">
                  <span className="text-[10.5px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-700/60 text-slate-300 flex items-center justify-center text-[9px] font-mono">2</span>
                    {language === 'te' ? 'దశా ప్రభావం' : 'Dasha Activation'}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase border ${getVerdictStyle(
                      dashaActivation.verdict
                    )}`}
                  >
                    {dashaActivation.verdict}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{language === 'te' ? 'మహాదశ' : 'Mahadasha'}:</span>
                    <strong className="text-amber-300">
                      {dashaActivation.mahadasha.planet} (H{dashaActivation.mahadasha.natalHouse})
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>{language === 'te' ? 'అంతర్దశ' : 'Antardasha'}:</span>
                    <strong className="text-amber-300">
                      {dashaActivation.antardasha.planet} (H{dashaActivation.antardasha.natalHouse})
                    </strong>
                  </div>

                  {dashaActivation.doubleTrikaFlag ? (
                    <div className="pt-1 text-[10.5px] text-rose-400 font-semibold leading-snug">
                      ⚠ {language === 'te' ? 'ద్విగుణ త్రిక సక్రియం (Double Trika testing phase)' : 'Double Trika period active'}
                    </div>
                  ) : (
                    <div className="pt-1 text-[10.5px] text-slate-300/80 leading-snug">
                      {dashaActivation.isDomainLordActive
                        ? (language === 'te' ? 'భావ అధిపతి కాలం నడుస్తోంది' : 'Domain ruler activated.')
                        : (language === 'te' ? 'సాధారణ గ్రహ దశ' : 'Standard cycle.')}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/30 text-[10px] text-slate-400 truncate">
                MD/AD: {dashaActivation.mahadasha.planet}–{dashaActivation.antardasha.planet}
              </div>
            </div>

            {/* Layer 3: Transit Confirmation */}
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/40">
                  <span className="text-[10.5px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-700/60 text-slate-300 flex items-center justify-center text-[9px] font-mono">3</span>
                    {language === 'te' ? 'గోచార ధృవీకరణ' : 'Sky Transit'}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase border ${getVerdictStyle(
                      transitConfirmation.verdict
                    )}`}
                  >
                    {transitConfirmation.verdict}
                  </span>
                </div>

                <div className="mt-2 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{language === 'te' ? 'గురు గోచారం' : 'Jupiter Transit'}:</span>
                    <span className="text-slate-200 font-medium">
                      {transitConfirmation.jupiterTransit.currentSign} ({transitConfirmation.jupiterTransit.classification})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>{language === 'te' ? 'శని గోచారం' : 'Saturn Transit'}:</span>
                    <span className="text-slate-200 font-medium">
                      {transitConfirmation.saturnTransit.currentSign} ({transitConfirmation.saturnTransit.classification})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>{language === 'te' ? 'రాహు గోచారం' : 'Rahu Transit'}:</span>
                    <span className="text-slate-200 font-medium">
                      {transitConfirmation.rahuTransit.currentSign}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/30 text-[10px] text-slate-400">
                {language === 'te' ? 'గోచార సంయోగం' : 'Transit Sync'}: <strong className="text-slate-200">{transitConfirmation.verdict}</strong>
              </div>
            </div>
          </div>

          {/* ─── CLIENT HISTORICAL VALIDATION QUESTIONS ─── */}
          {historicalEventWindows.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/40 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {language === 'te'
                    ? 'జాతక ఖచ్చితత్వ నిర్ధారణ (గత సంఘటనల సరిపోల్పు)'
                    : language === 'hi'
                    ? 'जन्म कुंडली सटीकता सत्यापन (अतीत की घटनाएं)'
                    : 'Client Historical Event Validation (Chart Accuracy Test)'}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                {language === 'te'
                  ? 'ఈ క్రింది గత సంఘటనలు మీ జీవితంలో సరిపోలితే, గ్రహ స్థితి ఖచ్చితంగా పని చేస్తుందని స్పష్టమవుతుంది:'
                  : 'If these predicted past period events match the actual life timeline, forward predictions have high confidence:'}
              </p>

              <div className="space-y-1.5 mt-2">
                {historicalEventWindows.map((win, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-800/60 border border-slate-700/50 flex items-start gap-2 text-[11px]"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-800/50 text-sky-400 font-mono text-[9.5px] shrink-0 mt-0.5">
                      {win.periodLabel}
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {language === 'te' ? win.validationQuestionTelugu : language === 'hi' ? win.validationQuestionHindi : win.validationQuestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── FUTURE TIMING WINDOWS ─── */}
          {futureTimingWindows.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/40 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {language === 'te'
                    ? 'భవిష్యత్ కాల వ్యవధులు మరియు అనుకూలతలు'
                    : language === 'hi'
                    ? 'भविष्य की समय सीमाएं एवं अनुकूलता'
                    : 'Future Timing Windows (Ranked by Favorability)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {futureTimingWindows.map((fw, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 space-y-1.5 flex flex-col justify-between text-[11px]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{fw.periodLabel}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 font-bold text-[9.5px]">
                          {fw.favorabilityScore}/10 {language === 'te' ? 'అనుకూలత' : 'Score'}
                        </span>
                      </div>

                      <p className="text-slate-300 mt-1.5 text-[11px] leading-relaxed">
                        {language === 'te' ? fw.actionTelugu : language === 'hi' ? fw.actionHindi : fw.action}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/40 text-[10px] text-slate-400 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{fw.transitAlignment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
