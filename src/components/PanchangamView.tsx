import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PANCHANGAM_LABELS, Lang } from '../lib/i18n/astrologicalTerms';

interface PanchangamViewProps {
  calendarInfo: any;
}

export const PanchangamView: React.FC<PanchangamViewProps> = ({ calendarInfo }) => {
  const { language } = useLanguage();
  const langKey = (language as Lang) || 'en';
  const labels = PANCHANGAM_LABELS[langKey] || PANCHANGAM_LABELS.en;

  if (!calendarInfo) return null;

  const items = [
    {
      label: labels.tithi,
      value: calendarInfo.Tithi || 'Not Found',
      icon: '🌙'
    },
    {
      label: labels.janma_rasi,
      value: calendarInfo.Raasi || 'Not Found',
      icon: '🦁'
    },
    {
      label: labels.nakshatram,
      value: calendarInfo.Nakshatram || 'Not Found',
      icon: '✨'
    },
    {
      label: labels.nitya_yoga,
      value: calendarInfo.Yoga || 'Not Found',
      icon: '🧘'
    },
    {
      label: labels.karana,
      value: calendarInfo.Karana || 'Not Found',
      icon: '🐚'
    },
    {
      label: labels.sun_rise,
      value: calendarInfo['Sun Rise'] || 'Not Found',
      icon: '🌅'
    },
    {
      label: labels.sun_set,
      value: calendarInfo['Sun Set'] || 'Not Found',
      icon: '🌇'
    }
  ];

  return (
    <div className="rounded-ds-xl border border-ds-secondary/15 bg-ds-surface p-5 lg:p-6 space-y-4 shadow-ds-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm">📅</span>
        <h3 className="text-xs uppercase tracking-[0.2em] text-ds-secondary font-bold">{labels.header}</h3>
      </div>

      {/* Grid of 5-7 equal-width columns, wrapping on smaller viewports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-ds-lg border border-ds-secondary/10 bg-ds-surface-container p-3 flex flex-col justify-between hover:border-ds-primary/25 transition-all group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-ds-on-surface-variant group-hover:text-ds-primary transition-colors">
                  {item.label}
                </span>
                <span className="text-xs">{item.icon}</span>
              </div>
              <p className="text-xs font-bold text-ds-primary leading-relaxed break-words font-sans">
                {item.value}
              </p>
            </div>
            <div className="mt-2 text-[9px] text-ds-on-surface-variant/60 font-mono font-bold">
              {labels.local}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
