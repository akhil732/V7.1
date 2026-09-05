import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Edit3, Compass, LayoutGrid, Shield, Sparkles, Clock, Calendar, 
  Layers, Printer, ArrowLeft, MessageSquare, BookOpen, Heart, Orbit
} from 'lucide-react';
import { SavedPerson } from '../types/marriageMatch';
import { BirthDetails } from '../types';
import { UnifiedAstrologyChart } from '../components/UnifiedAstrologyChart';
import { PlanetaryStrengthView } from '../components/PlanetaryStrengthView';
import { TransitAnalysisView } from '../components/TransitAnalysisView';
import { VimshottariDashaView } from '../components/VimshottariDashaView';
import { PanchangamView } from '../components/PanchangamView';
import { RVATripleCharts } from '../components/KP/RVATripleCharts';
import { AdvancedAITab } from '../components/AdvancedAITab';
import { FloatingAIChatWidget } from '../components/FloatingAIChatWidget';
import { SanathanamReportPage } from '../components/BirthChartReport/turia/SanathanamReportPage';
import { LifePartnerReport } from '../components/LifePartnerReport';
import { Button } from '../components/design-system/Button';
import { Card } from '../components/design-system/Card';
import { SaveToDriveButton } from '../components/SaveToDriveButton';
import { addSavedPerson } from '../lib/savedPersons';
import { ProfileStorageService } from '../lib/profileStorageService';
import { generateVedicBirthChartMarkdown } from '../lib/vedicMarkdownGenerator';
import { calculateActiveDasha } from '../lib/engines/DashaEngine';
import { generateSanathanamSnapshot } from '../lib/services/SanathanamReportService';
import { useKPChart } from '../hooks/useKPChart';
import { computeLiveTransitSnapshot } from '../lib/engines/LiveTransitEngine';
import { useLanguage } from '../context/LanguageContext';
import { 
  BIRTH_CHART_TAB_LABELS, 
  Lang, 
  translateSign, 
  translatePlanet, 
  translateLord, 
  translateNakshatra, 
  formatRemainingTimeInLanguage 
} from '../lib/i18n/astrologicalTerms';

export type BirthChartTab = 'overview' | 'd1' | 'transit' | 'dasha' | 'partner' | 'report' | 'ai';

interface BirthChartPageProps {
  horoscopeReport: any | null;
  activeProfile: SavedPerson | null;
  onEditProfile: () => void;
  language: 'en' | 'hi' | 'te';
  reportLoading?: boolean;
  reportError?: string | null;
  onSelectProfile: (profile: SavedPerson) => void;
  savedProfiles?: SavedPerson[];
  initialTab?: BirthChartTab;
  onNavigatePage?: (page: string) => void;
  onBack?: () => void;
  onRetry?: () => void;
}

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

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const formatRemainingTime = (endDate: Date): string => {
  try {
    const now = new Date();
    if (now >= endDate) return 'Completed';
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const remainingDaysAfterYears = diffDays % 365;
    const months = Math.floor(remainingDaysAfterYears / 30.4375);
    const days = Math.round(remainingDaysAfterYears % 30.4375);

    let text = "";
    if (years > 0) text += `${years}y `;
    if (months > 0) text += `${months}m `;
    if (days > 0 || text === "") text += `${days}d `;
    return `${text} remaining`;
  } catch (e) {
    return '—';
  }
};

export const extractSignFromData = (obj: any, defaultIndex: number = 0): string => {
  if (!obj) return ZODIAC_SIGNS[defaultIndex % 12];
  if (obj.sign && typeof obj.sign === 'string') return obj.sign;
  if (typeof obj.sign === 'number') return ZODIAC_SIGNS[obj.sign % 12];
  if (typeof obj.longitude === 'number') {
    const signIndex = Math.floor(obj.longitude / 30) % 12;
    return ZODIAC_SIGNS[signIndex];
  }
  return ZODIAC_SIGNS[defaultIndex % 12];
};

export const BirthChartPage: React.FC<BirthChartPageProps> = ({
  horoscopeReport,
  activeProfile,
  onEditProfile,
  language,
  reportLoading,
  reportError,
  onSelectProfile,
  savedProfiles = [],
  initialTab = 'overview',
  onNavigatePage,
  onBack,
  onRetry
}) => {
  const { language: ctxLanguage, t } = useLanguage();
  const activeLang = ((language || ctxLanguage) as Lang) || 'en';
  const labels = BIRTH_CHART_TAB_LABELS[activeLang] || BIRTH_CHART_TAB_LABELS.en;

  const [activeTab, setActiveTab] = useState<BirthChartTab>(initialTab);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [storyOfChart, setStoryOfChart] = useState<string>(
    'This kundali is shaped by a profound dialogue between structured ambition and emotional sensitivity. Your core task is navigating the balance between external accountability (your ascendant\'s demand for mastery) and an internal need for psychological safety. Fate has provided the landscape of high-stakes responsibilities; your effort is deciding to build deliberate systems rather than rushing into immediate gratification.'
  );

  // Keep live time updated for Transit
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Safe fallback values
  const name = activeProfile?.name || horoscopeReport?.birthData?.name || 'Native';
  const date = activeProfile?.date || horoscopeReport?.birthData?.date || '1996-11-11';
  const time = activeProfile?.time || horoscopeReport?.birthData?.time || '13:50:00';
  const place = activeProfile?.place || horoscopeReport?.birthData?.place || 'Jaggampeta';

  const birthDetails: BirthDetails = useMemo(() => {
    if (activeProfile) {
      return {
        name: activeProfile.name,
        gender: (activeProfile.gender === 'Female' ? 'Female' : 'Male') as ('Male' | 'Female'),
        date: activeProfile.date,
        time: activeProfile.time,
        approximateTime: false,
        place: activeProfile.place,
        latitude: activeProfile.latitude || 17.17,
        longitude: activeProfile.longitude || 82.06,
        timezone: activeProfile.timezone || 5.5
      };
    }
    return {
      name: horoscopeReport?.birthData?.name || 'Native',
      gender: (horoscopeReport?.birthData?.gender === 'Female' ? 'Female' : 'Male') as ('Male' | 'Female'),
      date: horoscopeReport?.birthData?.date || '1996-11-11',
      time: horoscopeReport?.birthData?.time || '13:50:00',
      approximateTime: false,
      place: horoscopeReport?.birthData?.place || 'Jaggampeta',
      latitude: horoscopeReport?.birthData?.latitude || 17.17,
      longitude: horoscopeReport?.birthData?.longitude || 82.06,
      timezone: horoscopeReport?.birthData?.timezone || 5.5
    };
  }, [
    activeProfile?.name,
    activeProfile?.gender,
    activeProfile?.date,
    activeProfile?.time,
    activeProfile?.place,
    activeProfile?.latitude,
    activeProfile?.longitude,
    activeProfile?.timezone,
    horoscopeReport?.birthData?.name,
    horoscopeReport?.birthData?.gender,
    horoscopeReport?.birthData?.date,
    horoscopeReport?.birthData?.time,
    horoscopeReport?.birthData?.place,
    horoscopeReport?.birthData?.latitude,
    horoscopeReport?.birthData?.longitude,
    horoscopeReport?.birthData?.timezone
  ]);

  const kpChart = useKPChart(birthDetails, horoscopeReport);

  const transitSnapshot = useMemo(() => {
    const moonSign = activeProfile?.place ? 'Aries' : 'Aries';
    return computeLiveTransitSnapshot(moonSign, currentDate);
  }, [currentDate, activeProfile]);

  useEffect(() => {
    let isMounted = true;
    async function loadStory() {
      if (!birthDetails || !horoscopeReport) return;
      try {
        const snap = await generateSanathanamSnapshot(birthDetails, horoscopeReport, language || 'en');
        if (isMounted && snap?.storyOfChart) {
          setStoryOfChart(snap.storyOfChart);
        }
      } catch (err) {
        console.warn('Could not load story of chart:', err);
      }
    }
    loadStory();
    return () => {
      isMounted = false;
    };
  }, [birthDetails, horoscopeReport, language]);

  if (reportError) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <h2 className="font-serif font-bold text-xl text-[#BA1A1A]">{labels.generationFailed}</h2>
        <p className="text-sm text-[#8A7B6E]">
          {reportError}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              {labels.retryCalc}
            </Button>
          )}
          <Button variant="primary" onClick={onEditProfile || onBack}>
            {onEditProfile ? labels.editDetails : labels.goBack}
          </Button>
        </div>
      </div>
    );
  }

  if (reportLoading) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="animate-spin w-16 h-16 rounded-2xl bg-[#FFDDB3] text-[#E67E22] flex items-center justify-center mx-auto text-2xl font-bold">
          🕉
        </div>
        <h2 className="font-serif font-bold text-xl text-[#2C3E50]">{labels.generatingChart}</h2>
        <p className="text-sm text-[#8A7B6E]">
          {t('calculating_divisional')}
        </p>
      </div>
    );
  }

  if (!horoscopeReport && !activeProfile) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FFDDB3] text-[#E67E22] flex items-center justify-center mx-auto text-2xl font-bold">
          🕉
        </div>
        <h2 className="font-serif font-bold text-xl text-[#2C3E50]">{labels.noActiveChart}</h2>
        <p className="text-sm text-[#8A7B6E]">
          {labels.selectOrCreate}
        </p>
      </div>
    );
  }

  // Extract Natal D1 and Dasha
  const divCharts = horoscopeReport?.horoscope?.divisional_charts || horoscopeReport?.divisional_charts || {};
  const d1 = divCharts['D-1_rasi'] || horoscopeReport?.rasi || horoscopeReport?.horoscope?.d1 || {};
  const cal = horoscopeReport?.horoscope?.calendar_info || horoscopeReport?.calendar_info || horoscopeReport?.panchangam || {};

  const lagnaObj = d1?.Ascendant || d1?.Lagna || {};
  const lagnaSign = lagnaObj.sign || extractSignFromData(lagnaObj) || 'Mesha (Aries)';
  const lagnaLord = lagnaSign !== 'Unknown' ? (SIGN_LORDS[lagnaSign] || 'Mars') : 'Mars';

  const moonObj = d1?.Moon || {};
  const moonSign = moonObj.sign || extractSignFromData(moonObj) || (cal.Raasi ? cal.Raasi.split(' ')[0] : 'Cancer');

  const sunObj = d1?.Sun || {};
  const sunSign = sunObj.sign || extractSignFromData(sunObj) || 'Libra';

  const moonNakObj = horoscopeReport?.horoscope?.nakshatra_pada?.Moon || horoscopeReport?.nakshatra_pada?.Moon || {};
  const rawNakName = moonNakObj.nakshatra || moonNakObj.nakshatra_name || '';
  const pada = moonNakObj.pada;
  const nakshatraText = rawNakName
    ? `${rawNakName}${pada ? ` - Pada ${pada}` : ''}`
    : (cal.Nakshatram ? cal.Nakshatram.split('  ')[0].split(' ')[0] : 'Pushya');

  const activeDasha = calculateActiveDasha(horoscopeReport, date, new Date());
  const activeMd = activeDasha?.mahadasha?.lord || 'Venus';
  const activeAd = activeDasha?.antardasha?.lord || 'Sun';
  const activePd = activeDasha?.pratyantardasha?.lord || 'Venus';

  // Translated entities for display
  const lagnaSignTr = translateSign(lagnaSign, activeLang);
  const lagnaLordTr = translateLord(lagnaLord, activeLang);
  const moonSignTr = translateSign(moonSign, activeLang);
  const nakshatraTextTr = translateNakshatra(nakshatraText, activeLang);
  const sunSignTr = translateSign(sunSign, activeLang);
  const activeMdTr = translatePlanet(activeMd, activeLang);
  const activeAdTr = translatePlanet(activeAd, activeLang);
  const activePdTr = translatePlanet(activePd, activeLang);

  // Avakhada Chakra Data
  const avakhada = horoscopeReport?.avakhadaChakra || {
    Varna: 'Kshatriya',
    Yoni: 'Gaja (Elephant)',
    Gana: 'Deva',
    Nadi: 'Madhya',
    SignLord: lagnaLord,
    Charan: pada ? String(pada) : '2',
    Lagna: lagnaSign,
    Rasi: moonSign,
    Nakshatra: rawNakName || 'Pushya'
  };

  const tabs: { key: BirthChartTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: labels.overview, icon: <Compass className="w-4 h-4" /> },
    { key: 'd1', label: labels.planetStrength, icon: <Shield className="w-4 h-4" /> },
    { key: 'transit', label: labels.transit, icon: <Orbit className="w-4 h-4" /> },
    { key: 'dasha', label: labels.dasha, icon: <Clock className="w-4 h-4" /> },
    { key: 'partner', label: labels.partner, icon: <Heart className="w-4 h-4" /> },
    { key: 'report', label: labels.report, icon: <BookOpen className="w-4 h-4" /> },
    { key: 'ai', label: labels.ai, icon: <MessageSquare className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C3E50] pb-24 font-sans selection:bg-[#FFDDB3] selection:text-[#684300]">
      {/* Top Action Bar & Native Header */}
      <div className="bg-[#FAF7F2] border-b border-[#D4C5B9]/40 py-2.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Native Name & Gender */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse shrink-0" />
            <span className="text-[#8A7B6E] font-medium text-xs">{labels.native}:</span>
            <strong className="font-serif text-[#2C3E50] font-bold text-sm sm:text-base">{name}</strong>
            <span className="text-[#8A7B6E] text-xs font-medium">({birthDetails.gender})</span>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<FileText className="w-3.5 h-3.5 text-ds-tertiary" />}
              onClick={() => {
                const mdContent = generateVedicBirthChartMarkdown(birthDetails, horoscopeReport);
                const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Vedic Birth Chart — ${birthDetails.name.trim()}.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              title="Download Vedic Birth Chart Markdown (.md) for AI parsing"
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
              title="Print Report"
            />
            <SaveToDriveButton
              birthDetails={birthDetails}
              horoscopeData={horoscopeReport}
              language={language}
              onSaveLocally={() => {
                addSavedPerson({
                  name: name,
                  date: date,
                  time: time,
                  place: place,
                  latitude: birthDetails.latitude,
                  longitude: birthDetails.longitude,
                  timezone: birthDetails.timezone,
                  gender: birthDetails.gender
                });
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={onEditProfile}
              title="Edit Details"
            />
          </div>
        </div>
      </div>

      {/* Selected Native Birth Metadata Bar */}
      <div className="bg-[#F7F1E8]/60 border-t border-[#D4C5B9]/40 py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-[#564337]">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-[#8A7B6E]">{labels.born}:</span>{' '}
              <strong className="font-mono font-bold text-[#2C3E50]">{date} @ {time}</strong>
            </div>
            <div>
              <span className="text-[#8A7B6E]">{labels.place}:</span>{' '}
              <strong className="font-semibold text-[#2C3E50]">{place}</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FFF8EE] border border-[#E67E22]/30 px-2.5 py-0.5 rounded-lg text-[#E67E22] font-bold">
            <Clock className="w-3 h-3 text-[#E67E22]" />
            <span>{activeMd} MD → {activeAd} AD</span>
          </div>
        </div>
      </div>

        {/* 2. THE 7-TAB NAVIGATION BAR */}
        <div className="bg-white border-t border-[#D4C5B9]/40 px-4 shadow-2xs">
          <div className="max-w-6xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#E67E22] text-white shadow-xs font-bold'
                      : 'text-[#564337] hover:text-[#2C3E50] hover:bg-[#F5ECE1]/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      {/* 3. MAIN TAB CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Executive Vector Summary Card */}
            <div className="bg-white rounded-2xl border border-[#D4C5B9]/50 shadow-[0px_2px_12px_rgba(44,62,80,0.06)] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4C5B9]/30 pb-3">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#E67E22]" />
                  <span>{labels.execNatal}</span>
                </h3>
                <span className="text-xs text-[#8A7B6E] font-mono font-bold">{labels.parashari}</span>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#D4C5B9]/40">
                  <span className="text-[11px] text-[#8A7B6E] font-bold uppercase tracking-wider block">{labels.ascendantLagna}</span>
                  <span className="font-serif font-bold text-sm text-[#E67E22] mt-1 block">{lagnaSignTr}</span>
                  <span className="text-[10px] text-[#564337] mt-0.5 block font-medium">{labels.lordLabel || 'Lord:'} {lagnaLordTr}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#D4C5B9]/40">
                  <span className="text-[11px] text-[#8A7B6E] font-bold uppercase tracking-wider block">{labels.moonSignRasi}</span>
                  <span className="font-serif font-bold text-sm text-[#2C3E50] mt-1 block">{moonSignTr}</span>
                  <span className="text-[10px] text-[#564337] mt-0.5 block font-medium">{nakshatraTextTr}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#D4C5B9]/40">
                  <span className="text-[11px] text-[#8A7B6E] font-bold uppercase tracking-wider block">{labels.sunSignSurya}</span>
                  <span className="font-serif font-bold text-sm text-[#E67E22] mt-1 block">{sunSignTr}</span>
                  <span className="text-[10px] text-[#564337] mt-0.5 block font-medium">{labels.soulIdentity}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#D4C5B9]/40">
                  <span className="text-[11px] text-[#8A7B6E] font-bold uppercase tracking-wider block">{labels.activeDasha}</span>
                  <span className="font-serif font-bold text-sm text-[#BA1A1A] mt-1 block">{activeMdTr} {labels.mahadasha || 'MD'}</span>
                  <span className="text-[10px] text-[#564337] mt-0.5 block font-medium">{activeAdTr} {labels.antardasha || 'AD'} • {activePdTr} {labels.pratyantardasha || 'PD'}</span>
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADCCF]/80 space-y-1.5 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E67E22] uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{labels.storyOfChart}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed font-serif italic">
                  "{storyOfChart}"
                </p>
              </div>
            </div>

            {/* Current Vimshottari Life Phase Card */}
            <div className="bg-white rounded-2xl border border-[#D4C5B9]/50 shadow-[0px_2px_12px_rgba(44,62,80,0.06)] p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-[#D4C5B9]/30 pb-3">
                <h3 className="font-serif font-bold text-base text-[#2C3E50] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E67E22]" />
                  <span>{labels.currentPhase}</span>
                </h3>
                <button
                  onClick={() => setActiveTab('dasha')}
                  className="text-xs font-bold text-[#E67E22] hover:underline cursor-pointer"
                >
                  {labels.viewFullDasha} →
                </button>
              </div>

              <div className="p-4 bg-[#FFF8EE] rounded-xl border border-[#E67E22]/30 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-semibold gap-2">
                  <span className="text-[#2C3E50] font-serif font-bold text-base">
                    {activeMdTr} {labels.mahadasha || 'Mahadasha'} → {activeAdTr} {labels.antardasha || 'Antardasha'} {activePd !== 'Unknown' ? `→ ${activePdTr} ${labels.pratyantardasha || 'Pratyantardasha'}` : ''}
                  </span>
                  <span className="text-[#E67E22] font-mono flex items-center gap-1.5 font-bold">
                    <span className="bg-white px-2 py-0.5 rounded-md border border-[#E67E22]/20">
                      {activeDasha?.antardasha?.endDate ? formatRemainingTimeInLanguage(new Date(activeDasha.antardasha.endDate), activeLang) : '—'}
                    </span>
                    <span className="text-[11px] text-[#8A7B6E]">
                      ({labels.ends || 'Ends'} {activeDasha?.antardasha?.endDate ? new Date(activeDasha.antardasha.endDate).toLocaleDateString(activeLang === 'te' ? 'te-IN' : activeLang === 'hi' ? 'hi-IN' : 'en-GB') : '—'})
                    </span>
                  </span>
                </div>

                <div className="w-full bg-[#E8DDD1] h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#E67E22] to-[#BA1A1A] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${activeDasha?.antardasha?.percentComplete ?? 45}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Birth Panchangam View */}
            <PanchangamView
              calendarInfo={horoscopeReport?.panchangam || horoscopeReport?.calendar_info}
            />

            {/* Natal Triple Charts */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[#D4C5B9]/30 pb-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50] flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-[#E67E22]" />
                  <span>{labels.tripleCharts}</span>
                </h3>
              </div>
              {kpChart ? (
                <RVATripleCharts
                  kpChart={kpChart}
                  horoscopeData={horoscopeReport}
                  transitSnapshot={transitSnapshot}
                  language={activeLang}
                />
              ) : (
                <div className="p-8 text-center text-sm text-[#8A7B6E] bg-white rounded-2xl border border-[#D4C5B9]/40">
                  {labels.loadingTriple}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PLANET STRENGTH */}
        {activeTab === 'd1' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Planetary Strength Profile Table */}
            <PlanetaryStrengthView
              horoscopeData={horoscopeReport}
              language={language}
            />
          </div>
        )}

        {/* TAB 3: TRANSIT (GOCHARA) */}
        {activeTab === 'transit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Transit Chart */}
            <UnifiedAstrologyChart
              chartType="Transit"
              horoscopeData={horoscopeReport}
              transitSnapshot={transitSnapshot}
              language={activeLang}
            />

            {/* Transit Analysis & Natal Impact Table */}
            <TransitAnalysisView
              transitSnapshot={transitSnapshot}
              horoscopeData={horoscopeReport}
              language={language}
            />
          </div>
        )}

        {/* TAB 5: VIMSOTTARA DASHA */}
        {activeTab === 'dasha' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <VimshottariDashaView
              horoscopeData={horoscopeReport}
              birthDateStr={date}
              language={language}
            />
          </div>
        )}

        {/* TAB 6: LIFE PARTNER REPORT */}
        {activeTab === 'partner' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <LifePartnerReport
              birthDetails={birthDetails}
              horoscopeData={horoscopeReport}
              language={language}
              onNavigate={(page) => {
                if (page === 'marriage' && onNavigatePage) {
                  onNavigatePage('marriage');
                }
              }}
            />
          </div>
        )}

        {/* TAB 7: REPORT (TURIA / SANATHANAM V6 READING) - Pre-loaded along with birth chart page */}
        <div className={activeTab === 'report' ? 'space-y-6 animate-in fade-in duration-200' : 'hidden'}>
          <SanathanamReportPage
            birthDetails={birthDetails}
            horoscopeData={horoscopeReport}
            onNavigateHome={() => setActiveTab('overview')}
            onNavigateOverview={() => setActiveTab('overview')}
          />
        </div>

        {/* TAB 8: AI (AI CONSULTATION) */}
        {activeTab === 'ai' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AdvancedAITab
              birthDetails={birthDetails}
              horoscopeData={horoscopeReport}
              language={language}
              profiles={savedProfiles}
              onSelectProfile={onSelectProfile}
            />
          </div>
        )}
      </main>

      <FloatingAIChatWidget
        birthDetails={birthDetails}
        horoscopeData={horoscopeReport}
        language={language}
        profiles={savedProfiles}
        onSelectProfile={onSelectProfile}
      />
    </div>
  );
};

export default BirthChartPage;
