import React, { useState, useMemo } from 'react';
import {
  Heart, Clock, Zap, Shield, TrendingUp, AlertCircle,
  ChevronDown, ChevronUp, Sparkles, BookOpen, Calendar,
  LayoutGrid, UserCheck, Eye, Compass, Star, ArrowRight,
  MessageSquare, ShieldCheck, CheckCircle2, Award
} from 'lucide-react';
import { BirthDetails } from '../types';
import { Button } from './design-system/Button';
import { UnifiedAstrologyChart } from './UnifiedAstrologyChart';
import { NavamshaTable } from './NavamshaTable';
import { calculateManglikDosha } from '../lib/manglikDosha';

export interface LifePartnerReportProps {
  birthDetails: BirthDetails;
  horoscopeData: any | null;
  language: 'en' | 'hi' | 'te';
  onNavigate?: (section: string) => void;
}

export interface PartnershipPhase {
  phase: 'early' | 'active' | 'mature' | 'fulfillment';
  label: string;
  ageRange: string;
  description: string;
  dashas: string[];
  probability: 'high' | 'moderate' | 'low';
  score: number;
}

export interface VenusAnalysis {
  sign: string;
  house: number;
  degreeStr: string;
  strength: 'exalted' | 'moolatrikona' | 'own' | 'favorable' | 'neutral' | 'challenging';
  dignityLabel: string;
  nakshatra: string;
  pada: number;
  nakshatraLord: string;
  isRetrograde: boolean;
  isCombust: boolean;
}

export interface SeventhHouseAnalysis {
  sign: string;
  custodian: string;
  custodianPlacement: string;
  planetsIn7th: string[];
  aspectingPlanets: string[];
  significator: string;
}

const UI_STRINGS = {
  en: {
    heroTag: 'Sanathanam Kalatra Bhava Analysis',
    heroSubtitleScript: 'Dharmecha Arthecha Kaamecha Mokshecha Sahachari',
    title: 'Life Partner & Marital Harmony Report',
    subtitle: 'Comprehensive Vedic analysis of Kalatra Bhava (7th House), Shukra (Venus) placement, D9 Navamsha dharma, and partnership timing.',
    
    // Quick Metrics
    metricVenusTitle: 'Venus (Shukra) Sthithi',
    metric7thTitle: '7th Lord (Kalatradhipati)',
    metricTimingTitle: 'Prime Marriage Arc',
    metricD9Title: 'D9 Soul Dharma',
    
    // Section Headers
    secVenusTitle: '1. Venus (Shukra) — Love, Romance & Attraction',
    secVenusDesc: 'Cosmic Karaka of intimacy, romantic attraction, aesthetic refinement, and marital devotion.',
    sec7thTitle: '2. 7th House (Kalatra Bhava) & Partner Archetype',
    sec7thDesc: 'Spousal characteristics, temperament, social background, and marital dynamics.',
    secD9Title: '3. D9 Navamsha Harmony (Marital Dharma & Soul Union)',
    secD9Desc: 'The 9th harmonic division revealing deep spiritual alignment and the second chapter of life.',
    secTimelineTitle: '4. Partnership Timeline & Dasha Activation',
    secTimelineDesc: 'Planetary triggers, Vimshottari dasha cycles, and auspicious timing for union.',
    secComplementarityTitle: '5. Partner Complementarity Matrix',
    secComplementarityDesc: 'Core behavioral and psychological synergy facets aligned with your natal blueprint.',
    secDoshaTitle: '6. Astrological Balance & Dosha Assessment',
    secDoshaDesc: 'Verification of Kuja (Manglik), Shukra, and nodal configurations affecting union.',
    secRemediesTitle: '7. Sanathanam Vedic Remedies & Enhancements',
    secRemediesDesc: 'Classical rituals, mantras, lifestyle alignments, and spiritual practices for marital harmony.',
    
    // Match Bridge CTA
    ctaTitle: 'Explore Synastry with a Specific Partner',
    ctaDesc: 'Run our complete 36-Guna Ashtakoota Milan and D9 cross-chart synastry analysis with a prospective match.',
    ctaBtnMatch: 'Open Marriage Match (Kundali Milan)',
    ctaBtnConsult: 'Ask AI Astrologer About Partner',
    
    // Accordion Toggle
    expandAll: 'Expand All Sections',
    collapseAll: 'Collapse All Sections',
  },
  hi: {
    heroTag: 'सनातन कलत्र भाव विश्लेषण',
    heroSubtitleScript: 'धर्मेच अर्थेच कामेच मोक्षेच सहचरी',
    title: 'जीवन साथी एवं वैवाहिक सौहार्द रिपोर्ट',
    subtitle: 'कलत्र भाव (7वें भाव), शुक्र स्थिति, D9 नवांश धर्म एवं विवाह समय का व्यापक वैदिक ज्योतिषीय विश्लेषण।',
    
    metricVenusTitle: 'शुक्र स्थिति',
    metric7thTitle: '7वें भाव का स्वामी',
    metricTimingTitle: 'सर्वोत्तम विवाह काल',
    metricD9Title: 'D9 आत्मिक धर्म',
    
    secVenusTitle: '1. शुक्र विश्लेषण — प्रेम, आकर्षण एवं सौंदर्य',
    secVenusDesc: 'प्रेम, रोमांस, सौंदर्य बोध और वैवाहिक निष्ठा का कारक ग्रह।',
    sec7thTitle: '2. 7वां भाव (कलत्र भाव) एवं जीवन साथी स्वरूप',
    sec7thDesc: 'जीवन साथी का स्वभाव, व्यक्तित्व, सामाजिक पृष्ठभूमि एवं दांपत्य संबंध।',
    secD9Title: '3. D9 नवांश सामंजस्य (वैवाहिक धर्म एवं आत्मिक मिलन)',
    secD9Desc: 'गहरे आध्यात्मिक संरेखण और जीवन के द्वितीय अध्याय को दर्शाने वाली नवम कुंडली।',
    secTimelineTitle: '4. विवाह समय एवं दशा सक्रियण',
    secTimelineDesc: 'विंशोत्तरी दशा चक्र एवं शुभ विवाह संयोग।',
    secComplementarityTitle: '5. साथी अनुकूलता मैट्रिक्स',
    secComplementarityDesc: 'आपकी जन्म कुंडली के अनुसार पूरक व्यक्तित्व एवं व्यवहारिक गुण।',
    secDoshaTitle: '6. ज्योतिषीय संतुलन एवं दोष समीक्षा',
    secDoshaDesc: 'मांगलिक (कुज), शुक्र एवं राहु-केतु अक्ष की स्थिति का परीक्षण।',
    secRemediesTitle: '7. सनातन वैदिक उपाय एवं संवर्धन',
    secRemediesDesc: 'वैवाहिक सुख एवं शांति के लिए शास्त्रोक्त मंत्र, व्रत एवं जीवन शैली नियम।',
    
    ctaTitle: 'किसी विशिष्ट साथी के साथ अनुकूलता देखें',
    ctaDesc: 'दो जन्म कुंडलियों के बीच 36 गुण अष्टकूट मिलान एवं D9 नवांश सामंजस्य का परीक्षण करें।',
    ctaBtnMatch: 'विवाह मिलान खोलें (कुंडली मिलान)',
    ctaBtnConsult: 'AI ज्योतिषी से प्रश्न पूछें',
    
    expandAll: 'सभी अनुभाग खोलें',
    collapseAll: 'सभी अनुभाग समेटें',
  },
  te: {
    heroTag: 'సనాతన కళత్ర భావ విశ్లేషణ',
    heroSubtitleScript: 'ధర్మేచ అర్థేచ కామేచ మోక్షేచ సహచరి',
    title: 'జీవన సహచర & వైవాహిక సామరస్య నివేదిక',
    subtitle: 'కళత్ర భావం (7వ భావం), శుక్ర గ్రహ స్థితి, D9 నవాంశ ధర్మం మరియు వివాహ సమయాల సమగ్ర వేద జ్యోతిష్య విశ్లేషణ.',
    
    metricVenusTitle: 'శుక్ర స్థితి',
    metric7thTitle: '7వ భావాధిపతి (కళత్రాధిపతి)',
    metricTimingTitle: 'ప్రధాన వివాహ సమయం',
    metricD9Title: 'D9 ఆత్మ ధర్మం',
    
    secVenusTitle: '1. శుక్ర విశ్లేషణ — ప్రేమ, ఆకర్షణ మరియు సౌందర్యం',
    secVenusDesc: 'ప్రేమ, ఆకర్షణ, లాలిత్యం మరియు దాంపత్య నిబద్ధతకు ప్రధాన కారకుడు.',
    sec7thTitle: '2. 7వ భావం (కళత్ర భావం) & సహచర వ్యక్తిత్వం',
    sec7thDesc: 'జీవన సహచరుని స్వభావం, శైలి మరియు వైవాహిక బంధ తీరు.',
    secD9Title: '3. D9 నవాంశ సామరస్యం (వైవాహిక ధర్మం)',
    secD9Desc: 'ఆధ్యాత్మిక అనుసంధానం మరియు జీవిత రెండవ భాగాన్ని తెలియజేసే నవాంశ చక్రం.',
    secTimelineTitle: '4. సహచర కాల సూచీ & దశ సక్రియత',
    secTimelineDesc: 'గ్రహ సంచారాలు మరియు వింశోత్తరీ దశ చక్రాల వివాహ సమయాలు.',
    secComplementarityTitle: '5. భాగస్వామ్య అనుకూలతా మాతృక',
    secComplementarityDesc: 'మీ జన్మ పత్రానికి అనుగుణమైన ఆదర్శ సహచర లక్షణాలు.',
    secDoshaTitle: '6. జ్యోతిష్య సమతుల్యత & దోష విశ్లేషణ',
    secDoshaDesc: 'కుజ (మాంగళిక), శుక్ర మరియు రాహు-కేతు దోషాల పరిశీలన.',
    secRemediesTitle: '7. సనాతన వేద నివారణలు & సాధనలు',
    secRemediesDesc: 'దాంపత్య శాంతికి శాస్త్రీయ మంత్రాలు, పూజలు మరియు జీవన విధానాలు.',
    
    ctaTitle: 'నిర్దిష్ట భాగస్వామితో అనుకూలతను తనిఖీ చేయండి',
    ctaDesc: '36 గుణ అష్టకూట మిలన్ మరియు D9 నవాంశ చార్ట్ సమన్వయ పరీక్ష చేయండి.',
    ctaBtnMatch: 'వివాహ పొంతన తెరవండి',
    ctaBtnConsult: 'AI జ్యోతిష్యుడిని అడగండి',
    
    expandAll: 'అన్నీ చూపించు',
    collapseAll: 'అన్నీ కుదించు',
  }
};

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_LORDS: Record<string, string> = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter'
};

const SIGN_SANSKRIT: Record<string, string> = {
  Aries: 'Mesha', Taurus: 'Vrishabha', Gemini: 'Mithuna', Cancer: 'Karka',
  Leo: 'Simha', Virgo: 'Kanya', Libra: 'Tula', Scorpio: 'Vrischika',
  Sagittarius: 'Dhanus', Capricorn: 'Makara', Aquarius: 'Kumbha', Pisces: 'Meena'
};

export const LifePartnerReport: React.FC<LifePartnerReportProps> = ({
  birthDetails,
  horoscopeData,
  language = 'en',
  onNavigate
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  // Track open sections for clean accordion interaction
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    venus: true,
    seventh: true,
    d9: true,
    timeline: true,
    complementarity: true,
    doshas: true,
    remedies: true
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setAllSections = (isOpen: boolean) => {
    setOpenSections({
      venus: isOpen,
      seventh: isOpen,
      d9: isOpen,
      timeline: isOpen,
      complementarity: isOpen,
      doshas: isOpen,
      remedies: isOpen
    });
  };

  // Safe extraction of D1, D9, and Planetary States
  const d1Chart = useMemo(() => {
    return horoscopeData?.horoscope?.divisional_charts?.['D-1_rasi'] 
      || horoscopeData?.divisional_charts?.['D-1_rasi'] 
      || horoscopeData?.rasi 
      || {};
  }, [horoscopeData]);

  const d9Chart = useMemo(() => {
    return horoscopeData?.horoscope?.divisional_charts?.['D-9_navamsa']
      || horoscopeData?.divisional_charts?.['D-9_navamsa']
      || horoscopeData?.horoscope?.divisional_charts?.['D9']
      || horoscopeData?.navamsa 
      || {};
  }, [horoscopeData]);

  const planetaryStates = useMemo(() => {
    return horoscopeData?.horoscope?.planetary_states || horoscopeData?.planetary_states || {};
  }, [horoscopeData]);

  // Extract Lagna (Ascendant)
  const lagnaSign = useMemo(() => {
    return d1Chart?.Ascendant?.sign || d1Chart?.Lagna?.sign || 'Aries';
  }, [d1Chart]);

  const lagnaIndex = useMemo(() => {
    const idx = ZODIAC_SIGNS.indexOf(lagnaSign);
    return idx >= 0 ? idx : 0;
  }, [lagnaSign]);

  // 7th House Sign (6 signs away from Lagna)
  const seventhSign = useMemo(() => {
    return ZODIAC_SIGNS[(lagnaIndex + 6) % 12];
  }, [lagnaIndex]);

  const seventhLord = useMemo(() => {
    return SIGN_LORDS[seventhSign] || 'Venus';
  }, [seventhSign]);

  // Venus Analysis
  const venusData = useMemo<VenusAnalysis>(() => {
    const vState = planetaryStates?.Venus || {};
    const vD1 = d1Chart?.Venus || {};

    const sign = vState.sign || vD1.sign || 'Libra';
    const house = vState.house || vD1.house || 7;
    const isExalted = vState.is_exalted || vState.exalted || sign === 'Pisces';
    const isDebilitated = vState.is_debilitated || vState.debilitated || sign === 'Virgo';
    const isRetrograde = !!(vState.is_retrograde || vState.retrograde);
    const isCombust = !!(vState.is_combust || vState.combust);

    let strength: VenusAnalysis['strength'] = 'favorable';
    let dignityLabel = 'Favorable (Subha)';

    if (isExalted) {
      strength = 'exalted';
      dignityLabel = 'Paramoccha (Exalted)';
    } else if (sign === 'Taurus' || sign === 'Libra') {
      strength = 'own';
      dignityLabel = 'Sva-Kshetra (Own Sign)';
    } else if (sign === 'Pisces') {
      strength = 'moolatrikona';
      dignityLabel = 'Moolatrikona (Prime Dignity)';
    } else if (isDebilitated) {
      strength = 'challenging';
      dignityLabel = 'Neecha (Debilitated / Growth Area)';
    } else if (isRetrograde) {
      strength = 'challenging';
      dignityLabel = 'Vakra (Retrograde Deepening)';
    } else if (['Capricorn', 'Aquarius', 'Gemini'].includes(sign)) {
      strength = 'favorable';
      dignityLabel = 'Mitra (Friendly Placement)';
    } else {
      strength = 'neutral';
      dignityLabel = 'Sama (Neutral Balance)';
    }

    const deg = vState.degree ?? vD1.degree ?? 15.42;
    const degInt = Math.floor(deg);
    const degMin = Math.floor((deg - degInt) * 60);
    const degSec = Math.floor(((deg - degInt) * 60 - degMin) * 60);
    const degreeStr = `${degInt}° ${degMin.toString().padStart(2, '0')}' ${degSec.toString().padStart(2, '0')}"`;

    const nakshatra = vState.nakshatra || vD1.nakshatra || 'Bharani';
    const pada = vState.pada || vD1.pada || 2;
    const nakshatraLord = vState.nakshatra_lord || vState.nakshatraLord || SIGN_LORDS[sign] || 'Venus';

    return {
      sign,
      house,
      degreeStr,
      strength,
      dignityLabel,
      nakshatra,
      pada,
      nakshatraLord,
      isRetrograde,
      isCombust
    };
  }, [planetaryStates, d1Chart]);

  // 7th House Analysis
  const seventhHouseData = useMemo<SeventhHouseAnalysis>(() => {
    const planetsIn7th: string[] = [];
    const aspectingPlanets: string[] = [];
    const grahas = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    // Identify occupants
    grahas.forEach(g => {
      const gData = d1Chart[g];
      if (gData) {
        const gHouse = gData.house || gData.bhava;
        if (gHouse === 7 || gData.sign === seventhSign) {
          planetsIn7th.push(g);
        }
      }
    });

    // Determine where 7th Lord is placed
    const lordData = d1Chart[seventhLord];
    const lordHouse = lordData?.house || lordData?.bhava || 7;
    const lordSign = lordData?.sign || seventhSign;
    const custodianPlacement = `House ${lordHouse} in ${lordSign}`;

    // Aspecting planets (e.g. 1st house planets aspect 7th with 7th aspect)
    grahas.forEach(g => {
      const gData = d1Chart[g];
      if (gData && !planetsIn7th.includes(g)) {
        const gHouse = gData.house || gData.bhava;
        if (gHouse === 1) {
          aspectingPlanets.push(`${g} (Direct 7th Aspect)`);
        } else if (g === 'Jupiter' && (gHouse === 11 || gHouse === 3)) {
          aspectingPlanets.push(`Jupiter (${gHouse === 11 ? '9th' : '5th'} Trikona Drishti)`);
        } else if (g === 'Mars' && (gHouse === 4 || gHouse === 12)) {
          aspectingPlanets.push(`Mars (${gHouse === 4 ? '4th' : '8th'} Vishesha Drishti)`);
        } else if (g === 'Saturn' && (gHouse === 5 || gHouse === 10)) {
          aspectingPlanets.push(`Saturn (${gHouse === 5 ? '3rd' : '10th'} Vishesha Drishti)`);
        }
      }
    });

    return {
      sign: seventhSign,
      custodian: seventhLord,
      custodianPlacement,
      planetsIn7th: planetsIn7th.length > 0 ? planetsIn7th : ['Benefic Neutral'],
      aspectingPlanets: aspectingPlanets.length > 0 ? aspectingPlanets : ['Benefic Cosmic Balance'],
      significator: 'Venus (Shukra)'
    };
  }, [d1Chart, seventhSign, seventhLord]);

  // Calculate Manglik Dosha
  const manglikResult = useMemo(() => {
    try {
      return calculateManglikDosha(horoscopeData);
    } catch {
      return {
        status: 'NEUTRAL' as const,
        reason: 'Mars placement is harmoniously positioned relative to Ascendant and Moon.',
        details: { fromAscendant: false, fromMoon: false, fromVenus: false, affectedHouses: [], affectedReferences: [] },
        severity: 'NONE' as const
      };
    }
  }, [horoscopeData]);

  // Vargottama Planets in D9
  const vargottamaGrahas = useMemo(() => {
    const list: string[] = [];
    const grahas = ['Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    grahas.forEach(g => {
      const d1S = d1Chart[g]?.sign || (g === 'Ascendant' ? d1Chart.Lagna?.sign : undefined);
      const d9S = d9Chart[g]?.sign || (g === 'Ascendant' ? d9Chart.Lagna?.sign : undefined);
      if (d1S && d9S && d1S === d9S) {
        list.push(g);
      }
    });
    return list;
  }, [d1Chart, d9Chart]);

  // Timeline Phases
  const timelinePhases = useMemo<PartnershipPhase[]>(() => {
    return [
      {
        phase: 'early',
        label: language === 'en' ? 'Phase 1: Early Romance & Intuitive Attraction' : (language === 'hi' ? 'चरण 1: प्रारंभिक आकर्षण एवं परिपक्वता' : 'దశ 1: ప్రారంభ ఆకర్షణ & అనుసంధానం'),
        ageRange: 'Age 19–25',
        description: language === 'en'
          ? 'Foundational romantic explorations, subtle soul-connections, Venus/Mercury sub-periods, and the initial awakening of relational preferences.'
          : (language === 'hi'
            ? 'प्रारंभिक संबंध अन्वेषण, शुक्र/बुध अंतर्दशा प्रभाव और वैवाहिक प्राथमिकताओं की समझ।'
            : 'ప్రాథమిక సంబంధ అన్వేషణలు, శుక్ర/బుధ అంతర్దశలు మరియు సహచర ప్రాధాన్యతల అవగాహన.'),
        dashas: ['Venus Antardasha', 'Mercury Antardasha', 'Moon Sub-period'],
        probability: 'moderate',
        score: 65
      },
      {
        phase: 'active',
        label: language === 'en' ? 'Phase 2: Prime Marriage Window & Solemn Vows' : (language === 'hi' ? 'चरण 2: मुख्य विवाह योग एवं पाणिग्रहण' : 'దశ 2: ప్రధాన వివాహ యోగం & పాణిగ్రహణం'),
        ageRange: 'Age 25–32',
        description: language === 'en'
          ? 'Peak matrimonial activation. Alignment of 7th Lord transit, Jupiter double transit on 1st/7th axis, and Vimshottari dasha catalysts for solemn commitment.'
          : (language === 'hi'
            ? 'सर्वोत्तम विवाह काल। 7वें भाव के स्वामी का गोचर, गुरु की दृष्टि एवं विंशोत्तरी दशा का प्रबल सहयोग।'
            : 'అత్యున్నత వివాహ సమయం. 7వ భావాధిపతి సంచారం, గురు అనుగ్రహం మరియు వింశోత్తరీ దశ మద్దతు.'),
        dashas: ['Jupiter Mahadasha', 'Venus Mahadasha', '7th Lord Antardasha'],
        probability: 'high',
        score: 92
      },
      {
        phase: 'mature',
        label: language === 'en' ? 'Phase 3: Marital Consolidation & Family Dharma' : (language === 'hi' ? 'चरण 3: दांपत्य स्थिरता एवं पारिवारिक धर्म' : 'దశ 3: దాంపత్య స్థిరత్వం & కుటుంబ ధర్మం'),
        ageRange: 'Age 33–45',
        description: language === 'en'
          ? 'Deepening mutual trust, collaborative enterprise, child-rearing dharma, and resilience through joint cosmic maturity.'
          : (language === 'hi'
            ? 'परस्पर विश्वास की प्रगाढ़ता, संयुक्त उत्तरदायित्व, संतान सुख एवं दांपत्य स्थिरता।'
            : 'పరస్పర విశ్వాసం పెంపొందడం, కుటుంబ బాధ్యతలు, సంతాన సుఖం మరియు దాంపత్య స్థిరత్వం.'),
        dashas: ['Saturn MD / AD', 'Sun MD', 'Jupiter AD'],
        probability: 'high',
        score: 85
      },
      {
        phase: 'fulfillment',
        label: language === 'en' ? 'Phase 4: Transcendent Companion & Soul Peace' : (language === 'hi' ? 'चरण 4: आत्मिक शांति एवं जीवन पूर्णता' : 'దశ 4: ఆధ్యాత్మిక శాంతి & పరిపూర్ణత'),
        ageRange: 'Age 46+',
        description: language === 'en'
          ? 'Quiet spiritual harmony, shared philosophical pursuits, profound emotional understanding, and liberation (Moksha) orientation.'
          : (language === 'hi'
            ? 'आध्यात्मिक सामंजस्य, गहन भावनात्मक समझ और मोक्षोन्मुखी जीवन साधना।'
            : 'ఆధ్యాత్మిక సామరస్యం, ప్రశాంత సహచర్యం మరియు మోక్షోన్ముఖ జీవన ప్రయాణం.'),
        dashas: ['Jupiter MD', 'Ketu Sub-period', 'Saturn MD'],
        probability: 'moderate',
        score: 75
      }
    ];
  }, [language]);

  // Complementary Traits Matrix based on 7th House & Venus
  const partnerMatrix = useMemo(() => {
    const traitsBySign: Record<string, { role: string; desc: string }[]> = {
      Aries: [
        { role: 'Dynamic Energy', desc: 'Direct, proactive, courageous, and initiates positive action in relationships.' },
        { role: 'Independent Mind', desc: 'Maintains personal identity while respecting partnership boundaries.' },
        { role: 'Spontaneous Warmth', desc: 'Expresses affection openly and addresses misunderstandings immediately.' }
      ],
      Taurus: [
        { role: 'Steadfast Loyalty', desc: 'Exceptionally reliable, calm during turbulence, and provides enduring emotional safety.' },
        { role: 'Sensory Refinement', desc: 'Appreciates beauty, refined home comfort, wholesome food, and gracious living.' },
        { role: 'Financial Prudence', desc: 'Grounded approach to material prosperity, family security, and wealth conservation.' }
      ],
      Gemini: [
        { role: 'Intellectual Spark', desc: 'Witty, articulate, loves engaging conversations, and shares diverse interests.' },
        { role: 'Youthful Adaptability', desc: 'Approaches life changes with curiosity, flexibility, and a light-hearted outlook.' },
        { role: 'Social Connection', desc: 'Bridges social circles effortlessly and brings fresh perspectives into the home.' }
      ],
      Cancer: [
        { role: 'Deep Nurturing', desc: 'Intuitive, protective of family values, emotionally attuned, and devoted.' },
        { role: 'Sanctuary Creator', desc: 'Builds a tranquil, emotionally safe household where you can fully unwind.' },
        { role: 'Empathetic Radar', desc: 'Understands unspoken feelings without requiring elaborate verbal explanations.' }
      ],
      Leo: [
        { role: 'Magnanimous Heart', desc: 'Generous, proud of your accomplishments, fiercely supportive, and loyal.' },
        { role: 'Dignified Presence', desc: 'Commands natural social respect and carries family responsibilities with nobility.' },
        { role: 'Warm Playfulness', desc: 'Brings celebratory joy, romantic grandeur, and heartfelt optimism into daily life.' }
      ],
      Virgo: [
        { role: 'Thoughtful Service', desc: 'Demonstrates love through practical care, meticulous attention, and genuine support.' },
        { role: 'Constructive Intellect', desc: 'Excellent problem solver who helps organize complex household and career priorities.' },
        { role: 'Health & Balance', desc: 'Prioritizes wholesome living, cleanliness, orderly routines, and emotional stability.' }
      ],
      Libra: [
        { role: 'Harmonious Diplomat', desc: 'Natural peacemaker, deeply committed to fairness, mutual equality, and balance.' },
        { role: 'Aesthetic Elegance', desc: 'Refined artistic taste, gracious social manners, and creates beautiful surroundings.' },
        { role: 'Partnership Centered', desc: 'Naturally thinks in terms of "we" rather than "I", prioritizing collaborative synergy.' }
      ],
      Scorpio: [
        { role: 'Profound Depth', desc: 'Fiercely loyal, transformative, protective, and possesses unbreakable fidelity.' },
        { role: 'Intuitive Alignment', desc: 'Sees through pretenses directly into your core soul aspirations and fears.' },
        { role: 'Quiet Strength', desc: 'An anchor of unshakeable resilience through life\'s most challenging trials.' }
      ],
      Sagittarius: [
        { role: 'Philosophical Spirit', desc: 'Broad-minded, optimistic, truthful, and constantly inspires joint intellectual growth.' },
        { role: 'Adventurous Explorer', desc: 'Loves travel, learning new cultures, and viewing life as an elevating journey.' },
        { role: 'Honest Transparency', desc: 'Communicates with pure intent without manipulative agendas or passive aggression.' }
      ],
      Capricorn: [
        { role: 'Unshakable Anchor', desc: 'Disciplined, mature, dependable, and dedicated to long-term family prosperity.' },
        { role: 'Practical Visionary', desc: 'Turns ambitious dreams into realistic, step-by-step lifelong achievements.' },
        { role: 'Enduring Devotion', desc: 'Commitment strengthens with time; marriage deepens and sweetens with age.' }
      ],
      Aquarius: [
        { role: 'Visionary Egalitarian', desc: 'Values mutual freedom, respects individuality, progressive, and authentic.' },
        { role: 'Soul Best Friend', desc: 'Builds romance on a foundation of profound friendship and intellectual kinship.' },
        { role: 'Humanitarian Ideals', desc: 'Inspired by noble causes and encourages you to realize your highest potential.' }
      ],
      Pisces: [
        { role: 'Unconditional Compassion', desc: 'Deeply empathetic, spiritual, sensitive, and accepts you with complete grace.' },
        { role: 'Poetic Intuition', desc: 'Brings mystical beauty, spiritual resonance, and soulful tenderness to intimacy.' },
        { role: 'Forgiving Heart', desc: 'Heals emotional scars with gentle patience and unwavering emotional support.' }
      ]
    };

    return traitsBySign[seventhSign] || traitsBySign.Taurus;
  }, [seventhSign]);

  // Dignity Badge Color Helper (Strict Light Mode Tokens)
  const getDignityStyle = (strength: VenusAnalysis['strength']) => {
    switch (strength) {
      case 'exalted':
      case 'moolatrikona':
        return 'bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/30';
      case 'own':
      case 'favorable':
        return 'bg-[#E67E22]/10 text-[#E67E22] border-[#E67E22]/30';
      case 'neutral':
        return 'bg-[#2C3E50]/10 text-[#2C3E50] border-[#2C3E50]/20';
      case 'challenging':
      default:
        return 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30';
    }
  };

  return (
    <div className="w-full space-y-6 text-[#1B1C1A]">
      {/* Top Banner: Sacred Vedic Masthead */}
      <div 
        id="life-partner-hero-banner"
        className="rounded-2xl bg-gradient-to-r from-[#FFF8EE] via-white to-[#FAF7F2] border border-[#E67E22]/30 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20">
              {t.heroTag}
            </span>
            <span className="text-xs text-[#8A7B6E] font-serif italic">
              {t.heroSubtitleScript}
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2C3E50] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E67E22] fill-[#E67E22]/20" />
            <span>{t.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#564337] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Profile Card Summary */}
        <div className="p-3.5 rounded-xl bg-white border border-[#D4C5B9]/60 shadow-2xs shrink-0 self-start md:self-auto min-w-[220px]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E67E22]/10 text-[#E67E22] flex items-center justify-center font-bold text-xs">
              {birthDetails.name ? birthDetails.name.charAt(0).toUpperCase() : 'N'}
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3E50] leading-none">{birthDetails.name || 'Native Chart'}</div>
              <div className="text-[10px] text-[#8A7B6E] mt-0.5">{birthDetails.place || 'Birth Coordinates'}</div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#D4C5B9]/30 flex items-center justify-between text-[11px]">
            <span className="text-[#8A7B6E]">Lagna: <strong className="text-[#2C3E50]">{lagnaSign}</strong></span>
            <span className="text-[#8A7B6E]">7th: <strong className="text-[#E67E22]">{seventhSign}</strong></span>
          </div>
        </div>
      </div>

      {/* 4-Bento Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Venus Sthithi */}
        <div className="p-4 rounded-xl bg-white border border-[#D4C5B9]/60 shadow-xs hover:border-[#E67E22]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider">{t.metricVenusTitle}</span>
            <div className="p-1 rounded-md bg-[#E67E22]/10 text-[#E67E22]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-[#2C3E50]">{venusData.sign}</span>
            <span className="text-xs text-[#8A7B6E] font-medium">H{venusData.house}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDignityStyle(venusData.strength)}`}>
              {venusData.dignityLabel}
            </span>
          </div>
        </div>

        {/* Metric 2: 7th Lord */}
        <div className="p-4 rounded-xl bg-white border border-[#D4C5B9]/60 shadow-xs hover:border-[#E67E22]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider">{t.metric7thTitle}</span>
            <div className="p-1 rounded-md bg-[#2C3E50]/10 text-[#2C3E50]">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-[#2C3E50]">{seventhHouseData.custodian}</span>
            <span className="text-xs text-[#8A7B6E] font-medium">Lord of {seventhSign}</span>
          </div>
          <div className="mt-1 text-[11px] text-[#564337] truncate font-medium">
            Placed in {seventhHouseData.custodianPlacement}
          </div>
        </div>

        {/* Metric 3: Timing Window */}
        <div className="p-4 rounded-xl bg-white border border-[#D4C5B9]/60 shadow-xs hover:border-[#E67E22]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider">{t.metricTimingTitle}</span>
            <div className="p-1 rounded-md bg-[#27AE60]/10 text-[#27AE60]">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-[#27AE60]">25 – 31 yrs</span>
            <span className="text-[11px] text-[#8A7B6E] font-medium">Peak Window</span>
          </div>
          <div className="mt-1 text-[11px] text-[#564337] truncate font-medium">
            Double Transit & Dasha Catalyst
          </div>
        </div>

        {/* Metric 4: D9 Dharma */}
        <div className="p-4 rounded-xl bg-white border border-[#D4C5B9]/60 shadow-xs hover:border-[#E67E22]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider">{t.metricD9Title}</span>
            <div className="p-1 rounded-md bg-[#D4AF37]/10 text-[#D4AF37]">
              <LayoutGrid className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-[#2C3E50]">
              {vargottamaGrahas.length > 0 ? `${vargottamaGrahas.length} Vargottama` : 'Harmonious'}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[#564337] truncate font-medium">
            {vargottamaGrahas.length > 0 ? `Grahas: ${vargottamaGrahas.join(', ')}` : 'Stable Soul Dharma Alignment'}
          </div>
        </div>
      </div>

      {/* Global Section Toggle Control */}
      <div className="flex items-center justify-between text-xs text-[#8A7B6E] px-1">
        <span className="font-medium">Vedic Parashari Reading & Analytical Breakdown</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAllSections(true)}
            className="hover:text-[#E67E22] transition-colors cursor-pointer font-bold"
          >
            {t.expandAll}
          </button>
          <span>•</span>
          <button 
            onClick={() => setAllSections(false)}
            className="hover:text-[#E67E22] transition-colors cursor-pointer font-bold"
          >
            {t.collapseAll}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: VENUS (SHUKRA) ANALYSIS */}
      {/* ========================================================================= */}
      <section className="rounded-2xl bg-white border border-[#D4C5B9]/60 shadow-xs overflow-hidden transition-all duration-200">
        <div 
          onClick={() => toggleSection('venus')}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E67E22]/10 text-[#E67E22]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
                {t.secVenusTitle}
              </h2>
              <p className="text-xs text-[#8A7B6E] mt-0.5">{t.secVenusDesc}</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-[#8A7B6E] hover:bg-[#EFEEEA]">
            {openSections.venus ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {openSections.venus && (
          <div className="px-5 pb-6 pt-1 border-t border-[#D4C5B9]/30 space-y-4">
            {/* Attribute Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80">
                <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider block">Rasi Placement</span>
                <span className="font-serif font-bold text-[#2C3E50] text-sm mt-1 block">
                  {venusData.sign} ({SIGN_SANSKRIT[venusData.sign] || venusData.sign})
                </span>
                <span className="text-[11px] text-[#564337] mt-0.5 block">Bhava {venusData.house}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80">
                <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider block">Coordinates & Longitude</span>
                <span className="font-mono font-bold text-[#E67E22] text-sm mt-1 block">
                  {venusData.degreeStr}
                </span>
                <span className="text-[11px] text-[#564337] mt-0.5 block">
                  {venusData.isRetrograde ? 'Vakra (Retrograde)' : 'Direct Motion'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80">
                <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider block">Dignity & Potency</span>
                <div className="mt-1">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getDignityStyle(venusData.strength)}`}>
                    {venusData.dignityLabel}
                  </span>
                </div>
                <span className="text-[11px] text-[#564337] mt-1 block">
                  {venusData.isCombust ? 'Combust with Sun' : 'Luminous / Clear'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80">
                <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider block">Nakshatra & Pada</span>
                <span className="font-serif font-bold text-[#2C3E50] text-sm mt-1 block">
                  {venusData.nakshatra} (Pada {venusData.pada})
                </span>
                <span className="text-[11px] text-[#564337] mt-0.5 block">Lord: {venusData.nakshatraLord}</span>
              </div>
            </div>

            {/* Classical Vedic Narrative */}
            <div className="p-4 rounded-xl bg-[#FFF8EE] border border-[#E67E22]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E67E22] uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Classical Jyotish Interpretation</span>
              </div>
              <p className="text-xs sm:text-sm text-[#564337] leading-relaxed">
                {venusData.strength === 'exalted'
                  ? `Shukra (Venus) occupies its highest dignity (Exaltation in ${venusData.sign}). In classical Vedic texts (Brihat Parashara Hora Shastra), this bestowes natural magnetic charm, deep devotion, and an intuitive attraction to partners of noble character, aesthetic refinement, and artistic sensibility. Partnerships bring substantial spiritual and emotional upliftment.`
                  : venusData.strength === 'own' || venusData.strength === 'moolatrikona'
                  ? `Venus is firmly anchored in its own sovereign domain (${venusData.sign}). This provides balanced emotional resilience, high relationship discernment, and a steady capacity to maintain harmony through lifecycle transitions. You attract partners who value stability, mutual loyalty, and refined domestic comfort.`
                  : venusData.strength === 'favorable'
                  ? `Venus enjoys an auspicious and cordial placement in ${venusData.sign} (House ${venusData.house}). Your emotional nature is receptive, diplomatic, and generous. You thrive in a union where intellectual companionship, humor, and shared cultural exploration are continuously celebrated.`
                  : `Venus resides in a dynamic and transformative posture in ${venusData.sign}. This configuration invites conscious introspection regarding emotional boundaries and expectations. While initial relationship phases involve deep karmic learning curves, marriage matures into profound loyalty and mutual spiritual fortitude.`}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: 7TH HOUSE (KALATRA BHAVA) ANALYSIS */}
      {/* ========================================================================= */}
      <section className="rounded-2xl bg-white border border-[#D4C5B9]/60 shadow-xs overflow-hidden transition-all duration-200">
        <div 
          onClick={() => toggleSection('seventh')}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#2C3E50]/10 text-[#2C3E50]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
                {t.sec7thTitle}
              </h2>
              <p className="text-xs text-[#8A7B6E] mt-0.5">{t.sec7thDesc}</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-[#8A7B6E] hover:bg-[#EFEEEA]">
            {openSections.seventh ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {openSections.seventh && (
          <div className="px-5 pb-6 pt-1 border-t border-[#D4C5B9]/30 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80">
                <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider block">7th Sign (Rasi)</span>
                <span className="font-serif font-bold text-[#2C3E50] text-sm mt-1 block">
                  {seventhHouseData.sign} ({SIGN_SANSKRIT[seventhHouseData.sign] || seventhHouseData.sign})
                </span>
                <span className="text-[11px] text-[#564337] mt-0.5 block">Opposite Ascendant (180° Mirror)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80">
                <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider block">Kalatra Adhipati (7th Lord)</span>
                <span className="font-serif font-bold text-[#E67E22] text-sm mt-1 block">
                  {seventhHouseData.custodian}
                </span>
                <span className="text-[11px] text-[#564337] mt-0.5 block">{seventhHouseData.custodianPlacement}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80">
                <span className="text-[11px] font-bold text-[#8A7B6E] uppercase tracking-wider block">Planets in 7th Bhava</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {seventhHouseData.planetsIn7th.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-[#2C3E50]/10 text-[#2C3E50] text-xs font-bold">
                      {p}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-[#8A7B6E] mt-0.5 block">Direct Occupants</span>
              </div>
            </div>

            {/* Predicted Spousal Archetype Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#E67E22]" />
                  <h4 className="font-serif font-bold text-sm text-[#2C3E50]">Temperament & Disposition</h4>
                </div>
                <p className="text-xs text-[#564337] leading-relaxed">
                  Influenced by {seventhHouseData.sign} and {seventhHouseData.custodian}. Your partner carries a balanced demeanor, valuing mutual respect and intellectual transparency over drama.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2C3E50]" />
                  <h4 className="font-serif font-bold text-sm text-[#2C3E50]">Career & Social Sphere</h4>
                </div>
                <p className="text-xs text-[#564337] leading-relaxed">
                  Strong professional orientation aligned with analytical, communicative, artistic, or administrative domains. They take pride in their financial independence and ethical standing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#27AE60]" />
                  <h4 className="font-serif font-bold text-sm text-[#2C3E50]">Domestic & Shared Dharma</h4>
                </div>
                <p className="text-xs text-[#564337] leading-relaxed">
                  Acts as a grounding anchor for the household. They value peaceful home environments, clear communication during decisions, and long-term family security.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: D9 NAVAMSHA HARMONY (MARITAL DHARMA) */}
      {/* ========================================================================= */}
      <section className="rounded-2xl bg-white border border-[#D4C5B9]/60 shadow-xs overflow-hidden transition-all duration-200">
        <div 
          onClick={() => toggleSection('d9')}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
                {t.secD9Title}
              </h2>
              <p className="text-xs text-[#8A7B6E] mt-0.5">{t.secD9Desc}</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-[#8A7B6E] hover:bg-[#EFEEEA]">
            {openSections.d9 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {openSections.d9 && (
          <div className="px-5 pb-6 pt-1 border-t border-[#D4C5B9]/30 space-y-5">
            {/* Embedded D9 Chart Visualizer */}
            <div className="pt-3">
              <UnifiedAstrologyChart
                chartType="D9"
                horoscopeData={horoscopeData}
                title="D9 Navamsha Chart (Marital Dharma & Soul Blueprint)"
                subtitle="9th Harmonic Division — Evaluates spousal compatibility, moral alignment and longevity of union."
              />
            </div>

            {/* Navamsha Table Component */}
            <div className="rounded-xl overflow-hidden border border-[#D4C5B9]/40">
              <NavamshaTable
                horoscopeData={horoscopeData}
                language={language}
              />
            </div>

            {/* Soul Dharma Interpretation */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#E67E22]" />
                <span>The Significance of Navamsha in Marriage</span>
              </div>
              <p className="text-xs sm:text-sm text-[#564337] leading-relaxed">
                In classical Vedic Jyotish, the Rasi (D1) chart represents the tree's trunk and social outward circumstances, while the Navamsha (D9) represents the hidden roots, inner fruit, and spiritual contract of marriage. Planets that maintain identical signs across both D1 and D9 (<em>Vargottama</em>) possess unwavering stamina and bless the couple with deep resilience through all phases of life.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: PARTNERSHIP TIMELINE & DASHA ACTIVATION */}
      {/* ========================================================================= */}
      <section className="rounded-2xl bg-white border border-[#D4C5B9]/60 shadow-xs overflow-hidden transition-all duration-200">
        <div 
          onClick={() => toggleSection('timeline')}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#27AE60]/10 text-[#27AE60]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
                {t.secTimelineTitle}
              </h2>
              <p className="text-xs text-[#8A7B6E] mt-0.5">{t.secTimelineDesc}</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-[#8A7B6E] hover:bg-[#EFEEEA]">
            {openSections.timeline ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {openSections.timeline && (
          <div className="px-5 pb-6 pt-1 border-t border-[#D4C5B9]/30 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3">
              {timelinePhases.map((phase) => (
                <div 
                  key={phase.phase} 
                  className={`p-4 rounded-xl border transition-all ${
                    phase.probability === 'high'
                      ? 'bg-[#FFF8EE] border-[#E67E22]/40 shadow-xs'
                      : 'bg-[#FAF7F2] border-[#EADCCF]/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#2C3E50]">
                        {phase.label}
                      </h4>
                      <span className="text-xs font-bold text-[#E67E22]">{phase.ageRange}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#2C3E50]">{phase.score}% Probability</span>
                      <div className="w-20 h-1.5 rounded-full bg-[#EADCCF] overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${
                            phase.score >= 80 ? 'bg-[#27AE60]' : phase.score >= 60 ? 'bg-[#E67E22]' : 'bg-[#F39C12]'
                          }`}
                          style={{ width: `${phase.score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#564337] leading-relaxed mt-2.5">
                    {phase.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#D4C5B9]/30 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#8A7B6E] uppercase">Catalyst Cycles:</span>
                    {phase.dashas.map((d, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-[#D4C5B9]/60 text-[11px] font-medium text-[#2C3E50]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: COMPLEMENTARY PARTNER ARCHETYPES */}
      {/* ========================================================================= */}
      <section className="rounded-2xl bg-white border border-[#D4C5B9]/60 shadow-xs overflow-hidden transition-all duration-200">
        <div 
          onClick={() => toggleSection('complementarity')}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E67E22]/10 text-[#E67E22]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
                {t.secComplementarityTitle}
              </h2>
              <p className="text-xs text-[#8A7B6E] mt-0.5">{t.secComplementarityDesc}</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-[#8A7B6E] hover:bg-[#EFEEEA]">
            {openSections.complementarity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {openSections.complementarity && (
          <div className="px-5 pb-6 pt-1 border-t border-[#D4C5B9]/30 space-y-4">
            <p className="text-xs sm:text-sm text-[#564337] leading-relaxed pt-3">
              Derived from the 7th house sign <strong className="text-[#E67E22] font-bold">{seventhSign}</strong> and lord <strong className="text-[#2C3E50] font-bold">{seventhLord}</strong>, your most resonant partner possesses complementary qualities that balance your natural temperament:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {partnerMatrix.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="font-serif font-bold text-sm text-[#2C3E50]">{item.role}</h4>
                  </div>
                  <p className="text-xs text-[#564337] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: DOSHA & ASTROLOGICAL BALANCE */}
      {/* ========================================================================= */}
      <section className="rounded-2xl bg-white border border-[#D4C5B9]/60 shadow-xs overflow-hidden transition-all duration-200">
        <div 
          onClick={() => toggleSection('doshas')}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#C0392B]/10 text-[#C0392B]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
                {t.secDoshaTitle}
              </h2>
              <p className="text-xs text-[#8A7B6E] mt-0.5">{t.secDoshaDesc}</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-[#8A7B6E] hover:bg-[#EFEEEA]">
            {openSections.doshas ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {openSections.doshas && (
          <div className="px-5 pb-6 pt-1 border-t border-[#D4C5B9]/30 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3">
              {/* Manglik Check */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2C3E50]">Manglik (Kuja) Status</h4>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    manglikResult.status === 'CANCELLED' || manglikResult.status === 'NEUTRAL'
                      ? 'bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/30'
                      : 'bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/30'
                  }`}>
                    {manglikResult.status === 'CANCELLED' ? 'Cancelled / Neutral' : (manglikResult.status === 'NEUTRAL' ? 'Free (No Dosha)' : 'Present')}
                  </span>
                </div>
                <p className="text-xs text-[#564337] leading-relaxed">
                  {manglikResult.reason || 'Mars operates in harmony without challenging angular friction from Lagna, Moon, or Venus.'}
                </p>
              </div>

              {/* Venus Dignity Check */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2C3E50]">Shukra Alignment</h4>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDignityStyle(venusData.strength)}`}>
                    {venusData.strength === 'challenging' ? 'Sensitivity Observed' : 'Auspicious'}
                  </span>
                </div>
                <p className="text-xs text-[#564337] leading-relaxed">
                  {venusData.strength === 'challenging'
                    ? 'Venusian retrograde or sensitive dignity indicates relationship timing matures with conscious communication.'
                    : 'Venus radiates harmonious dignity, blessing interpersonal unions with mutual affection and loyalty.'}
                </p>
              </div>

              {/* Nodal Rahu/Ketu Axis Check */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#2C3E50]">1st / 7th Nodal Axis</h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#27AE60]/10 text-[#27AE60] border border-[#27AE60]/30">
                    Balanced
                  </span>
                </div>
                <p className="text-xs text-[#564337] leading-relaxed">
                  Nodal forces support normal partnership dharma, allowing free-will communication to steer marriage harmoniously.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: SANATHANAM VEDIC REMEDIES & PRACTICES */}
      {/* ========================================================================= */}
      <section className="rounded-2xl bg-white border border-[#D4C5B9]/60 shadow-xs overflow-hidden transition-all duration-200">
        <div 
          onClick={() => toggleSection('remedies')}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F2] transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
                {t.secRemediesTitle}
              </h2>
              <p className="text-xs text-[#8A7B6E] mt-0.5">{t.secRemediesDesc}</p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-[#8A7B6E] hover:bg-[#EFEEEA]">
            {openSections.remedies ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {openSections.remedies && (
          <div className="px-5 pb-6 pt-1 border-t border-[#D4C5B9]/30 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
              {/* Planetary Upayas */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-3">
                <div className="flex items-center gap-2 text-[#E67E22]">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#2C3E50]">Planetary Upayas (Shukra & 7th Lord)</h4>
                </div>
                <ul className="text-xs sm:text-sm text-[#564337] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E67E22] font-bold">•</span>
                    <span><strong>Shukra Gayatri Mantra:</strong> Recite <em>"Om Bhrigave Namah"</em> or <em>"Om Shum Shukraya Namah"</em> 108 times on Friday mornings during Brahma Muhurtha.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E67E22] font-bold">•</span>
                    <span><strong>Lakshmi Narayana Pooja:</strong> Offer fragrant white flowers (Jasmine/Lotus) to Maa Lakshmi for relational harmony.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E67E22] font-bold">•</span>
                    <span><strong>Friday Satvik Vrata:</strong> Practice peaceful dietary moderation on Fridays to calm the sensory nervous system.</span>
                  </li>
                </ul>
              </div>

              {/* Lifestyle Upayas */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EADCCF]/80 space-y-3">
                <div className="flex items-center gap-2 text-[#2C3E50]">
                  <BookOpen className="w-4 h-4" />
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#2C3E50]">Conscious Relationship Dharma</h4>
                </div>
                <ul className="text-xs sm:text-sm text-[#564337] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#2C3E50] font-bold">•</span>
                    <span><strong>Active Listening (Maitri):</strong> Cultivate non-reactive listening during discussions regarding finances and family boundaries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2C3E50] font-bold">•</span>
                    <span><strong>Aesthetic Environment:</strong> Maintain a clean, well-lit, and aesthetically uplifting living sanctuary.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#2C3E50] font-bold">•</span>
                    <span><strong>Seva (Selfless Service):</strong> Support charitable initiatives aiding education and girl-child welfare on auspicious festive occasions.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: MARRIAGE MATCH & CONSULTATION BRIDGE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FAF7F2] via-[#FFF8EE] to-[#FAF7F2] border border-[#E67E22]/40 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#E67E22]" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C3E50]">
              {t.ctaTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#564337] leading-relaxed">
            {t.ctaDesc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Button
            variant="primary"
            className="w-full sm:w-auto bg-[#E67E22] hover:bg-[#D35400] text-white font-bold py-2.5 px-5 text-xs sm:text-sm rounded-xl cursor-pointer transition-all shadow-xs flex items-center justify-center gap-2"
            onClick={() => onNavigate?.('marriage')}
          >
            <span>{t.ctaBtnMatch}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            className="w-full sm:w-auto border-1.5 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50]/5 font-bold py-2.5 px-4 text-xs sm:text-sm rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
            onClick={() => onNavigate?.('ai')}
          >
            <MessageSquare className="w-4 h-4 text-[#2C3E50]" />
            <span>{t.ctaBtnConsult}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LifePartnerReport;
