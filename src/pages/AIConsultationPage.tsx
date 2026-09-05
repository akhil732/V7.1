import React from 'react';
import { AdvancedAITab } from '../components/AdvancedAITab';
import { BirthDetails } from '../types';
import { SavedPerson } from '../types/marriageMatch';
import { useLanguage } from '../context/LanguageContext';

interface AIConsultationPageProps {
  activeProfile: SavedPerson | null;
  horoscopeReport: any;
  language?: 'en' | 'hi' | 'te';
  savedProfiles?: SavedPerson[];
  onSelectProfile?: (profile: SavedPerson) => void;
}

export const AIConsultationPage: React.FC<AIConsultationPageProps> = ({
  activeProfile,
  horoscopeReport,
  language,
  savedProfiles = [],
  onSelectProfile,
}) => {
  const { language: ctxLanguage } = useLanguage();
  const activeLang = language || ctxLanguage || 'en';

  const birthDetails: BirthDetails = activeProfile ? {
    name: activeProfile.name,
    gender: activeProfile.gender || 'Male',
    date: activeProfile.date,
    time: activeProfile.time,
    approximateTime: false,
    place: activeProfile.place,
    latitude: activeProfile.latitude || 17.17,
    longitude: activeProfile.longitude || 82.0611,
    timezone: activeProfile.timezone || 5.5,
  } : {
    name: "Akhil",
    gender: "Male",
    date: "1996-11-11",
    time: "13:50:00",
    approximateTime: false,
    place: "Jaggampeta",
    latitude: 17.17,
    longitude: 82.0611,
    timezone: 5.5,
  };

  return (
    <div className="w-full pb-20">
      <AdvancedAITab
        birthDetails={birthDetails}
        horoscopeData={horoscopeReport}
        language={activeLang}
        profiles={savedProfiles}
        onSelectProfile={onSelectProfile}
      />
    </div>
  );
};
