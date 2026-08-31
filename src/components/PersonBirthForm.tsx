import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, X, RefreshCw, AlertCircle, UserPlus, Check, SlidersHorizontal, ArrowRight, ArrowLeft } from 'lucide-react';
import { PersonFormData } from '../types/marriageMatch';
import { getSavedPersonsByGender, addSavedPerson } from '../lib/savedPersons';
import { ProfileStorageService } from '../lib/profileStorageService';
import { LocationSuggestion } from '../types';
import { TimeWheelPicker } from './WheelPicker';
import { normalizeTimeFormat } from '../lib/jhoraAPI';

interface PersonBirthFormProps {
  gender: 'Male' | 'Female';
  onUpdate: (formData: PersonFormData) => void;
  isLoading: boolean;
  language?: 'en' | 'hi' | 'te';
  value?: PersonFormData;
  embedded?: boolean;
}

const labels = {
  en: {
    maleTitle: "Groom's Details",
    femaleTitle: "Bride's Details",
    fullName: "Full Name",
    namePlaceholder: "Enter full name",
    genderLabel: "Gender",
    dob: "Date of Birth",
    tob: "Time of Birth",
    pob: "Place of Birth (City)",
    pobPlaceholder: "Search city (e.g. Hyderabad, New Delhi)",
    coordsTz: "Coordinates & Timezone (Auto-detected)",
    coordsSub: "Auto-detected from place search. Edit only if needed.",
    lat: "Latitude",
    lng: "Longitude",
    utcOffset: "UTC Offset (Hours)",
    selectSaved: "Load Profile",
    noSaved: "No saved profiles found for this gender",
    errLat: "Latitude must be between -90 and 90° (e.g., 17.38)",
    errLng: "Longitude must be between -180 and 180° (e.g., 78.48)",
    errTz: "Timezone offset must be between -12 and 14",
    male: "Male",
    female: "Female",
    savingOption: "Save Profile",
    savedSuccess: "Profile saved!",
    required: "* Required",
    noMatchingPlaces: "No matching places found. Enter location coordinates manually below.",
    connectionFailed: "Connection failed. Please enter coordinates manually below.",
    next: "Next",
    back: "Back",
    step1: "Step 1: Name & Time",
    step2: "Step 2: Place & Coords"
  },
  hi: {
    maleTitle: "वर का विवरण",
    femaleTitle: "वधू का विवरण",
    fullName: "पूरा नाम",
    namePlaceholder: "पूरा नाम दर्ज करें",
    genderLabel: "लिंग",
    dob: "जन्म तिथि",
    tob: "जन्म का समय",
    pob: "जन्म स्थान (शहर)",
    pobPlaceholder: "शहर खोजें (उदा. हैदराबाद, नई दिल्ली)",
    coordsTz: "उन्नत निर्देशांक और समयक्षेत्र",
    coordsSub: "स्थान खोज से स्वतः पता लगाया गया।",
    lat: "अक्षांश",
    lng: "रेखांश",
    utcOffset: "यूटीसी ऑफसेट",
    selectSaved: "सहेजे गए प्रोफाइल",
    noSaved: "कोई सहेजी गई प्रोफाइल नहीं मिली",
    errLat: "अक्षांश -90 और 90 के बीच होना चाहिए",
    errLng: "रेखांश -180 और 180 के बीच होना चाहिए",
    errTz: "समयक्षेत्र -12 और 14 के बीच होना चाहिए",
    male: "पुरुष",
    female: "महिला",
    savingOption: "प्रोफ़ाइल सहेजें",
    savedSuccess: "प्रोफ़ाइल सहेजी गई!",
    required: "* आवश्यक",
    noMatchingPlaces: "कोई मिलान स्थान नहीं मिला।",
    connectionFailed: "कनेक्शन विफल रहा।",
    next: "आगे",
    back: "पीछे",
    step1: "चरण 1: नाम और समय",
    step2: "चरण 2: स्थान और निर्देशांक"
  },
  te: {
    maleTitle: "వరుడి వివరాలు",
    femaleTitle: "వధువు వివరాలు",
    fullName: "పూర్తి పేరు",
    namePlaceholder: "పూర్తి పేరు నమోదు చేయండి",
    genderLabel: "లింగం",
    dob: "పుట్టిన తేదీ",
    tob: "పుట్టిన సమయం",
    pob: "పుట్టిన స్థలం (నగరం)",
    pobPlaceholder: "నగరం వెతకండి (ఉదా. హైదరాబాద్)",
    coordsTz: "అక్షాంశ రేఖాంశాలు",
    coordsSub: "స్వయంచాలకంగా తీసుకోబడింది.",
    lat: "అక్షాంశం",
    lng: "రేఖాంశం",
    utcOffset: "టైమ్ జోన్",
    selectSaved: "సేవ్ చేసిన ప్రొఫైల్స్",
    noSaved: "ఈ లింగం ప్రొఫైల్‌లు లేవు",
    errLat: "అక్షాంశం -90 నుండి 90 మధ్య ఉండాలి",
    errLng: "రేఖాంశం -180 నుండి 180 మధ్య ఉండాలి",
    errTz: "టైమ్ జోన్ -12 నుండి 14 మధ్య ఉండాలి",
    male: "పురుషుడు",
    female: "స్త్రీ",
    savingOption: "ప్రొఫైల్ సేవ్ చేయి",
    savedSuccess: "సేవ్ చేయబడింది!",
    required: "* తప్పనిసరి",
    noMatchingPlaces: "సరిపోలే స్థలాలు లేవు.",
    connectionFailed: "కనెక్షన్ విఫలమైంది.",
    next: "తరువాత",
    back: "వెనుకకు",
    step1: "దశ 1: పేరు & సమయం",
    step2: "దశ 2: స్థలం & వివరాలు"
  }
};

const PersonBirthForm: React.FC<PersonBirthFormProps> = ({
  gender,
  onUpdate,
  isLoading,
  language = 'en',
  value,
  embedded = false,
}) => {
  const l = labels[language] || labels.en;

  // Progressive Step (1 or 2)
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields State
  const [name, setName] = useState(value?.name || '');
  const [date, setDate] = useState(value?.date || '');
  const [time, setTime] = useState(value?.time || '');
  const [place, setPlace] = useState(value?.place || '');
  const [latitude, setLatitude] = useState(value?.latitude ? value.latitude.toString() : '');
  const [longitude, setLongitude] = useState(value?.longitude ? value.longitude.toString() : '');
  const [timezone, setTimezone] = useState(value?.timezone ? value.timezone.toString() : '');

  // Sync when value prop changes externally (e.g. user selected from saved profiles)
  useEffect(() => {
    if (value) {
      setName(value.name || '');
      setDate(value.date || '');
      setTime(value.time || '');
      setPlace(value.place || '');
      setSearchQuery(value.place || '');
      if (value.latitude !== undefined && value.latitude !== null && value.latitude !== 0) {
        setLatitude(value.latitude.toString());
      }
      if (value.longitude !== undefined && value.longitude !== null && value.longitude !== 0) {
        setLongitude(value.longitude.toString());
      }
      if (value.timezone !== undefined && value.timezone !== null && value.timezone !== 0) {
        setTimezone(value.timezone.toString());
      }
    }
  }, [value?.name, value?.date, value?.time, value?.place, value?.latitude, value?.longitude, value?.timezone]);

  // UI State: Collapsible Advanced Coords
  const [showAdvancedCoords, setShowAdvancedCoords] = useState(false);

  // Autocomplete / Location Search State
  const [searchQuery, setSearchQuery] = useState(value?.place || '');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const selectedDisplayNameRef = useRef<string>(value?.place || '');

  // Saved Persons Combobox State
  const [savedPersons, setSavedPersons] = useState<any[]>([]);
  const [showSavedDropdown, setShowSavedDropdown] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Time Picker Popover State
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Refs
  const savedDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Subscribe to profile updates of this gender
  useEffect(() => {
    const unsubscribe = ProfileStorageService.subscribe((profiles) => {
      const list = profiles.filter((p) => p.gender === gender);
      setSavedPersons(list);
    });
    return unsubscribe;
  }, [gender]);

  // Click outside listener for all popovers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (savedDropdownRef.current && !savedDropdownRef.current.contains(event.target as Node)) {
        setShowSavedDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Location search autocomplete with debounce
  useEffect(() => {
    const trimmedQuery = (searchQuery || '').trim();
    if (!trimmedQuery || trimmedQuery.length < 3) {
      setSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    // Don't re-query if the user just selected this exact item
    if (selectedDisplayNameRef.current && trimmedQuery === selectedDisplayNameRef.current.trim()) {
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      setLocationError(null);
      try {
        const res = await fetch(`/api/jhora-proxy/location/autocomplete?q=${encodeURIComponent(trimmedQuery)}`);
        let data: any = null;
        if (res.ok) {
          data = await res.json();
        } else {
          const fbRes = await fetch(`https://jagannatha-hora-359167915530.europe-west1.run.app/location/autocomplete?q=${encodeURIComponent(trimmedQuery)}`);
          if (fbRes.ok) {
            data = await fbRes.json();
          }
        }

        const rawResults = data?.results || [];
        const normalized: LocationSuggestion[] = rawResults.map((r: any) => ({
          place: r.place || (r.name ? r.name.split(',')[0].trim() : '') || (r.displayName ? r.displayName.split(',')[0].trim() : '') || trimmedQuery,
          country: r.country || (r.name ? r.name.split(',').slice(-1)[0].trim() : '') || '',
          displayName: r.displayName || r.name || r.place || trimmedQuery,
          latitude: typeof r.latitude === 'number' ? r.latitude : parseFloat(r.latitude) || 0,
          longitude: typeof r.longitude === 'number' ? r.longitude : parseFloat(r.longitude) || 0,
          timezone: typeof r.timezone === 'number' ? r.timezone : parseFloat(r.timezone) || 5.5,
          state: r.state || '',
          elevation: r.elevation
        }));

        if (normalized.length > 0) {
          setSuggestions(normalized);
          setShowLocationDropdown(true);
        } else {
          setSuggestions([]);
          setLocationError(l.noMatchingPlaces);
          setShowLocationDropdown(true);
        }
      } catch (err) {
        console.warn(err);
        setLocationError(l.connectionFailed);
        setSuggestions([]);
        setShowLocationDropdown(true);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, l.noMatchingPlaces, l.connectionFailed]);

  // Handle select of location
  const handleSelectLocation = (item: LocationSuggestion) => {
    const chosenPlace = item.place || item.displayName?.split(',')[0]?.trim() || searchQuery;
    const chosenDisplayName = item.displayName || item.place || searchQuery;
    selectedDisplayNameRef.current = chosenDisplayName;
    setPlace(chosenPlace);
    setSearchQuery(chosenDisplayName);
    setLatitude(item.latitude != null ? item.latitude.toString() : '17.3850');
    setLongitude(item.longitude != null ? item.longitude.toString() : '78.4867');
    setTimezone(item.timezone != null ? item.timezone.toString() : '5.5');
    setSuggestions([]);
    setShowLocationDropdown(false);
    setLocationError(null);
  };

  // Profile Matching Check: see if current details are already saved
  useEffect(() => {
    const isProfileAlreadySaved = savedPersons.some(
      (p) => (p.name || '').trim().toLowerCase() === (name || '').trim().toLowerCase() && p.date === date && p.time === time
    );
    setIsSaved(isProfileAlreadySaved);
  }, [name, date, time, savedPersons]);

  // Trigger parent update
  useEffect(() => {
    const latVal = parseFloat(latitude);
    const lngVal = parseFloat(longitude);
    const tzVal = parseFloat(timezone);
    const effectivePlace = (place || searchQuery || '').trim();

    onUpdate({
      name: (name || '').trim(),
      gender,
      date,
      time: normalizeTimeFormat(time),
      place: effectivePlace,
      latitude: isNaN(latVal) ? 0 : latVal,
      longitude: isNaN(lngVal) ? 0 : lngVal,
      timezone: isNaN(tzVal) ? 0 : tzVal
    });
  }, [name, gender, date, time, place, searchQuery, latitude, longitude, timezone, onUpdate]);

  // Handle Saved Profile Auto-Fill
  const handleSelectSavedProfile = (profile: any) => {
    setName(profile.name || '');
    setDate(profile.date || '');
    setTime(normalizeTimeFormat(profile.time || ''));
    const profPlace = profile.place || '';
    setPlace(profPlace);
    setSearchQuery(profPlace);
    selectedDisplayNameRef.current = profPlace;
    setLatitude(profile.latitude !== undefined && profile.latitude !== null ? profile.latitude.toString() : '17.3850');
    setLongitude(profile.longitude !== undefined && profile.longitude !== null ? profile.longitude.toString() : '78.4867');
    setTimezone(profile.timezone !== undefined && profile.timezone !== null ? profile.timezone.toString() : '5.5');

    setShowSavedDropdown(false);
  };

  // Quick-save this person
  const handleQuickSave = () => {
    const latVal = parseFloat(latitude);
    const lngVal = parseFloat(longitude);
    const tzVal = parseFloat(timezone);

    if (!(name || '').trim() || !date || !time || !(place || '').trim() || isNaN(latVal) || isNaN(lngVal) || isNaN(tzVal)) {
      return;
    }

    addSavedPerson({
      name: (name || '').trim(),
      gender,
      date,
      time: normalizeTimeFormat(time),
      place,
      latitude: latVal,
      longitude: lngVal,
      timezone: tzVal
    });

    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Input Range Validations
  const latVal = parseFloat(latitude);
  const isLatInvalid = latitude !== '' && (isNaN(latVal) || latVal < -90 || latVal > 90);

  const lngVal = parseFloat(longitude);
  const isLngInvalid = longitude !== '' && (isNaN(lngVal) || lngVal < -180 || lngVal > 180);

  const tzVal = parseFloat(timezone);
  const isTzInvalid = timezone !== '' && (isNaN(tzVal) || tzVal < -12 || tzVal > 14);

  const isFormValid =
    name.trim() !== '' &&
    date !== '' &&
    time !== '' &&
    place.trim() !== '' &&
    !isLatInvalid && latitude !== '' &&
    !isLngInvalid && longitude !== '' &&
    !isTzInvalid && timezone !== '';

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className={embedded ? "w-full" : "bg-white rounded-2xl border border-[#D4C5B9]/40 p-5 shadow-[0px_4px_20px_rgba(26,35,126,0.04)] w-full"}>
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-[#D4C5B9]/30 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            gender === 'Male' ? 'bg-[#2C3E50]/10 text-[#2C3E50]' : 'bg-[#E67E22]/10 text-[#E67E22]'
          }`}>
            {gender === 'Male' ? '♂' : '♀'}
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#071E27] tracking-wide">
              {gender === 'Male' ? l.maleTitle : l.femaleTitle}
            </h3>
            <span className="text-[10px] text-[#767683]">Step {step} of 2</span>
          </div>
        </div>

        {/* Quick Saved Profile Selector (Only if not embedded or as handy fallback) */}
        <div className="relative" ref={savedDropdownRef}>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowSavedDropdown(!showSavedDropdown)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDFBF7] border border-[#D4C5B9]/50 text-xs font-semibold text-[#071E27] hover:border-[#E67E22] transition-colors cursor-pointer shadow-2xs"
          >
            <span>{l.selectSaved}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#E67E22]" />
          </button>

          {showSavedDropdown && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#D4C5B9]/40 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto animate-in fade-in">
              {savedPersons.length === 0 ? (
                <div className="px-4 py-3 text-xs text-[#767683] text-center italic">
                  {l.noSaved}
                </div>
              ) : (
                savedPersons.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleSelectSavedProfile(profile)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-[#F5ECE1] border-b border-[#D4C5B9]/20 last:border-0 transition-colors flex flex-col gap-0.5 cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-[#071E27]">{profile.name}</span>
                    <span className="text-[10px] text-[#767683]">
                      📅 {profile.date} • ⏰ {profile.time} • 📍 {profile.place}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* STEP 1: NAME, DATE & TIME */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-left duration-200">
            {/* Native's Name Input */}
            <div className="relative">
              <input
                id={`name-${gender}`}
                type="text"
                required
                disabled={isLoading}
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full pt-5 pb-1.5 px-3 bg-transparent border-0 border-b border-[#C6C5D4] text-base text-[#071E27] focus:outline-none focus:border-[#E67E22] transition-colors disabled:opacity-50"
              />
              <label
                htmlFor={`name-${gender}`}
                className="absolute left-3 top-4 text-sm text-[#767683] transition-all duration-200 pointer-events-none peer-focus:-top-0.5 peer-focus:text-[11px] peer-focus:text-[#E67E22] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[#E67E22] peer-[:not(:placeholder-shown)]:font-semibold"
              >
                {l.fullName}
              </label>
            </div>

            {/* Date & Time of Birth */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Date of Birth */}
              <div className="relative">
                <input
                  id={`dob-${gender}`}
                  type="date"
                  required
                  disabled={isLoading}
                  max={todayStr}
                  placeholder=" "
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="peer w-full pt-5 pb-1.5 px-3 bg-transparent border-0 border-b border-[#C6C5D4] text-sm sm:text-base text-[#071E27] font-mono focus:outline-none focus:border-[#E67E22] transition-colors disabled:opacity-50"
                />
                <label
                  htmlFor={`dob-${gender}`}
                  className="absolute left-3 top-4 text-sm text-[#767683] transition-all duration-200 pointer-events-none peer-focus:-top-0.5 peer-focus:text-[11px] peer-focus:text-[#E67E22] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[#E67E22] peer-[:not(:placeholder-shown)]:font-semibold"
                >
                  {l.dob}
                </label>
              </div>

              {/* Time of Birth */}
              <div className="relative" ref={timePickerRef}>
                <input
                  id={`tob-${gender}`}
                  type="time"
                  step="1"
                  required
                  disabled={isLoading}
                  placeholder=" "
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="peer w-full pt-5 pb-1.5 px-3 bg-transparent border-0 border-b border-[#C6C5D4] text-sm sm:text-base text-[#071E27] font-mono focus:outline-none focus:border-[#E67E22] transition-colors disabled:opacity-50"
                />
                <label
                  htmlFor={`tob-${gender}`}
                  className="absolute left-3 top-4 text-sm text-[#767683] transition-all duration-200 pointer-events-none peer-focus:-top-0.5 peer-focus:text-[11px] peer-focus:text-[#E67E22] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[#E67E22] peer-[:not(:placeholder-shown)]:font-semibold"
                >
                  {l.tob}
                </label>
              </div>
            </div>

            {/* Step 1 Next Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-[#E67E22] hover:bg-[#E67E22]/90 text-white px-6 py-2 rounded-full font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:shadow"
              >
                <span>{l.next}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PLACE OF BIRTH & COORDINATES */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
            {/* Place of Birth Lookup */}
            <div className="relative" ref={locationDropdownRef}>
              <input
                id={`pob-${gender}`}
                type="text"
                required
                disabled={isLoading}
                placeholder=" "
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setPlace(val);
                  if (selectedDisplayNameRef.current && val !== selectedDisplayNameRef.current) {
                    selectedDisplayNameRef.current = '';
                  }
                }}
                onFocus={() => {
                  if (suggestions.length > 0 || locationError) setShowLocationDropdown(true);
                }}
                className="peer w-full pt-5 pb-1.5 px-3 pr-8 bg-transparent border-0 border-b border-[#C6C5D4] text-base text-[#071E27] focus:outline-none focus:border-[#E67E22] transition-colors disabled:opacity-50"
              />
              <label
                htmlFor={`pob-${gender}`}
                className="absolute left-3 top-4 text-sm text-[#767683] transition-all duration-200 pointer-events-none peer-focus:-top-0.5 peer-focus:text-[11px] peer-focus:text-[#E67E22] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[#E67E22] peer-[:not(:placeholder-shown)]:font-semibold"
              >
                {l.pob}
              </label>
              <div className="absolute right-2 top-4 text-[#C6C5D4] pointer-events-none">
                {searching ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#E67E22]" />
                ) : (
                  <MapPin className="w-4 h-4 text-[#767683]" />
                )}
              </div>

              {showLocationDropdown && (searchQuery.length >= 3) && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#D4C5B9]/40 rounded-xl shadow-xl overflow-hidden z-50 max-h-52 overflow-y-auto animate-in fade-in">
                  {suggestions.map((item, idx) => (
                    <button
                      type="button"
                      key={`${item.displayName || item.place || 'loc'}-${idx}`}
                      onClick={() => handleSelectLocation(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#F5ECE1] border-b border-[#D4C5B9]/20 last:border-0 transition-colors flex flex-col cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-[#071E27]">{item.place || item.displayName}</span>
                      <span className="text-[10px] text-[#767683] mt-0.5">
                        📍 {item.displayName} (UTC {item.timezone >= 0 ? `+${item.timezone}` : item.timezone})
                      </span>
                    </button>
                  ))}
                  {locationError && (
                    <div className="p-3 text-xs text-[#767683] bg-[#FDFBF7] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#E67E22] shrink-0 mt-0.5" />
                      <span>{locationError}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Collapsible Coordinates & Timezone */}
            <div className="border border-[#D4C5B9]/30 rounded-xl overflow-hidden bg-[#FDFBF7]">
              <button
                type="button"
                onClick={() => setShowAdvancedCoords(!showAdvancedCoords)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-[#071E27] hover:text-[#E67E22] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E67E22]">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{l.coordsTz}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#767683] font-mono">
                    {latitude ? `${latitude}°, ${longitude}°` : 'Auto'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showAdvancedCoords ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showAdvancedCoords && (
                <div className="p-3.5 border-t border-[#D4C5B9]/20 space-y-3 bg-white">
                  <p className="text-[10px] text-[#767683]">{l.coordsSub}</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#767683] block mb-1">{l.lat}</label>
                      <input
                        type="text"
                        required
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#C6C5D4] rounded-lg px-2 py-1 text-xs text-[#071E27] font-mono focus:outline-none focus:border-[#E67E22]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#767683] block mb-1">{l.lng}</label>
                      <input
                        type="text"
                        required
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#C6C5D4] rounded-lg px-2 py-1 text-xs text-[#071E27] font-mono focus:outline-none focus:border-[#E67E22]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-[#767683] block mb-1">{l.utcOffset}</label>
                      <input
                        type="text"
                        required
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#C6C5D4] rounded-lg px-2 py-1 text-xs text-[#071E27] font-mono focus:outline-none focus:border-[#E67E22]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2 Back & Quick Save Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#E67E22] font-semibold text-xs hover:bg-[#F5ECE1] px-4 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{l.back}</span>
              </button>

              {isFormValid && !isSaved && (
                <button
                  type="button"
                  onClick={handleQuickSave}
                  className="text-xs text-[#E67E22] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{l.savingOption}</span>
                </button>
              )}
              {showSaveSuccess && (
                <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>{l.savedSuccess}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonBirthForm;
