export interface AstroTerm {
  en: string;
  te: string;
  hi: string;
  category: 'ui' | 'planet' | 'sign' | 'house' | 'kuta' | 'dosha' | 'kp' | 'dasha' | 'general' | 'nakshatra' | 'yoga' | 'nav';
}

export const ASTROLOGICAL_TERMS_MAP: Record<string, AstroTerm> = {
  // ── APP / NAV ──────────────────────────────────────────────────────────────
  title:            { en: "Jyothishya Sanathanam", te: "జ్యోతిష్య సనాతనం",    hi: "ज्योतिष सनातनम",      category: "ui" },
  home:             { en: "Home",                 te: "హోమ్",                    hi: "होम",                 category: "ui" },
  kundali:          { en: "Kundali",              te: "కుండలి",                 hi: "कुंडली",              category: "ui" },
  chant:            { en: "Chant",                te: "మంత్రం",                 hi: "मंत्र",               category: "ui" },
  matching:         { en: "Matching",             te: "పొంతన",                  hi: "मिलान",               category: "ui" },
  login:            { en: "Login",                te: "లాగిన్",                 hi: "लॉगिन",               category: "ui" },
  profile:          { en: "Profile",              te: "ప్రొఫైల్",               hi: "प्रोफाइल",            category: "ui" },

  // ── PAGE TITLES ────────────────────────────────────────────────────────────
  birth_chart:      { en: "Birth Chart Report",   te: "జన్మ కుండలి నివేదిక",   hi: "जन्म कुंडली रिपोर्ट", category: "ui" },
  ai_consultation:  { en: "AI Consultation",      te: "ఏఐ జ్యోతిష్య సలహా",    hi: "एआई ज्योतिषीय सलाह",category: "ui" },
  marriage_match:   { en: "Marriage Matching",    te: "వివాహ పొంతన",           hi: "विवाह मिलान",         category: "ui" },
  kp_analysis:      { en: "KP Analysis & Significators", te: "కేపీ విశ్లేషణ & సూచికలు", hi: "केपी विश्लेषण", category: "ui" },
  panchangam:       { en: "Today's Panchangam",   te: "నేటి పంచాంగం",          hi: "आज का पंचांग",        category: "ui" },
  profile_management: { en: "Birth Profiles",     te: "జన్మ ప్రొఫైల్స్",       hi: "प्रोफाइल प्रबंधन",   category: "ui" },

  // ── HOME PAGE ─────────────────────────────────────────────────────────────
  view_full_panchangam: { en: "View Full Panchangam", te: "పూర్తి పంచాంగం చూడండి", hi: "पूर्ण पंचांग देखें", category: "ui" },
  new_kundali:      { en: "New Kundali",          te: "కొత్త కుండలి",           hi: "नई कुंडली",           category: "ui" },
  generate:         { en: "Generate",             te: "రూపొందించు",             hi: "बनाएं",               category: "ui" },
  my_kundalis:      { en: "My Kundalis",          te: "నా కుండలిలు",            hi: "मेरी कुंडलियां",      category: "ui" },
  saved_charts_library: { en: "Saved charts library", te: "సేవ్ చేసిన చార్ట్ల లైబ్రరీ", hi: "सहेजी गई चार्ट लाइब्रेरी", category: "ui" },
  new_match:        { en: "New Match",            te: "కొత్త పొంతన",            hi: "नया मिलान",           category: "ui" },
  compatibility_analysis: { en: "Compatibility analysis", te: "అనుకూలత విశ్లేషణ", hi: "अनुकूलता विश्लेषण", category: "ui" },
  close:            { en: "Close",                te: "మూసివేయి",               hi: "बंद करें",            category: "ui" },
  done:             { en: "Done",                 te: "అయింది",                  hi: "हो गया",              category: "ui" },
  no_transiting_planets: { en: "No transiting planets currently in this rashi.", te: "ప్రస్తుతం ఈ రాశిలో సంచరించే గ్రహాలు లేవు.", hi: "अभी इस राशि में कोई गोचर ग्रह नहीं हैं।", category: "ui" },
  transiting_grahas: { en: "Transiting Grahas:",  te: "సంచరించే గ్రహాలు:",      hi: "गोचर ग्रह:",          category: "ui" },

  // ── BIRTH CHART PAGE TABS ─────────────────────────────────────────────────
  overview:         { en: "Overview",             te: "అవలోకనం",               hi: "अवलोकन",              category: "ui" },
  planet_strength:  { en: "Planet Strength",      te: "గ్రహ బలం",              hi: "ग्रह बल",             category: "ui" },
  transit:          { en: "Transit",              te: "గోచారం",                 hi: "गोचर",                category: "ui" },
  vimsottara_dasha: { en: "Vimsottara Dasha",     te: "వింశోత్తరి దశ",         hi: "विंशोत्तरी दशा",     category: "ui" },
  life_partner:     { en: "Life Partner",         te: "జీవన సహచరి",            hi: "जीवन साथी",           category: "ui" },
  report:           { en: "Report",               te: "నివేదిక",               hi: "रिपोर्ट",             category: "ui" },
  ai:               { en: "AI",                   te: "ఏఐ",                    hi: "एआई",                 category: "ui" },
  // Overview tab
  executive_natal_coordinates: { en: "Executive Natal Coordinates", te: "జన్మ కుండలి సంక్షిప్త వివరాలు", hi: "जन्म कुंडली संक्षेप", category: "ui" },
  parashari_classical_core: { en: "Parashari Classical Core", te: "పారాశరి సాంప్రదాయ విశ్లేషణ", hi: "पाराशरी शास्त्रीय मूल", category: "ui" },
  ascendant_lagna:  { en: "Ascendant (Lagna)",    te: "లగ్నం",                 hi: "लग्न",                category: "ui" },
  moon_sign_rasi:   { en: "Moon Sign (Rasi)",     te: "చంద్ర రాశి",            hi: "चंद्र राशि",          category: "ui" },
  sun_sign_surya:   { en: "Sun Sign (Surya)",     te: "సూర్య రాశి",            hi: "सूर्य राशि",          category: "ui" },
  active_dasha:     { en: "Active Dasha",         te: "ప్రస్తుత దశ",           hi: "सक्रिय दशा",         category: "ui" },
  soul_identity:    { en: "Soul Identity",        te: "ఆత్మ స్వభావం",          hi: "आत्मिक पहचान",        category: "ui" },
  story_of_chart:   { en: "The Story of This Chart", te: "ఈ కుండలి కథ",       hi: "इस कुंडली की कहानी", category: "ui" },
  current_vimshottari_life_phase: { en: "Current Vimshottari Life Phase", te: "ప్రస్తుత వింశోత్తరి జీవన దశ", hi: "वर्तमान विंशोत्तरी जीवन चरण", category: "ui" },
  view_full_dasha:  { en: "View Full Dasha →",    te: "పూర్తి దశ చూడండి →",   hi: "पूर्ण दशा देखें →",  category: "ui" },
  triple_charts:    { en: "Triple Charts (D1 Rasi, Live Transit & D9 Navamsha)", te: "మూడు చార్ట్లు (D1 రాశి, గోచారం & D9 నవాంశ)", hi: "तीन चार्ट (D1 राशि, गोचर और D9 नवांश)", category: "ui" },
  loading_triple_charts: { en: "Loading Triple Charts...", te: "చార్ట్లు లోడవుతున్నాయి...", hi: "चार्ट लोड हो रहे हैं...", category: "ui" },
  // Error / loading states
  generation_failed: { en: "Generation Failed",  te: "రూపొందించడం విఫలమైంది",  hi: "निर्माण विफल",        category: "ui" },
  retry_calculation: { en: "Retry Calculation",  te: "మళ్లీ లెక్కించండి",     hi: "पुनः गणना करें",      category: "ui" },
  edit_details:     { en: "Edit Details",         te: "వివరాలు మార్చండి",      hi: "विवरण संपादित करें",  category: "ui" },
  go_back:          { en: "Go Back",              te: "వెనక్కి వెళ్ళండి",     hi: "वापस जाएं",           category: "ui" },
  generating_birth_chart: { en: "Generating Birth Chart...", te: "జన్మ కుండలి రూపొందిస్తోంది...", hi: "जन्म कुंडली बन रही है...", category: "ui" },
  calculating_divisional: { en: "Calculating precise Parashari divisional coordinates, Vimshottari dasha cycles, and planetary dignities.", te: "పారాశరి వర్గ కుండలి, వింశోత్తరి దశలు, గ్రహ బలాలు లెక్కిస్తోంది.", hi: "पाराशरी वर्ग कुंडली, विंशोत्तरी दशा और ग्रह बल की गणना हो रही है।", category: "ui" },
  no_active_chart:  { en: "No Active Chart Selected", te: "చార్ట్ ఏదీ ఎంచుకోబడలేదు", hi: "कोई चार्ट नहीं चुना गया", category: "ui" },
  select_or_create_profile: { en: "Please select or create a profile on the Home or Profile page to view the Birth Chart.", te: "జన్మ కుండలి చూడడానికి హోమ్ లేదా ప్రొఫైల్ పేజీలో ప్రొఫైల్ ఎంచుకోండి లేదా సృష్టించండి.", hi: "जन्म कुंडली देखने के लिए होम या प्रोफाइल पेज पर प्रोफाइल चुनें या बनाएं।", category: "ui" },
  native:           { en: "Native:",              te: "జాతకుడు:",              hi: "जातक:",               category: "ui" },
  born:             { en: "Born:",                te: "జన్మించిన:",            hi: "जन्म:",               category: "ui" },
  place_label:      { en: "Place:",               te: "స్థానం:",               hi: "स्थान:",              category: "ui" },

  // ── TABLE / GENERAL COLUMN HEADERS ─────────────────────────────────────────
  planet:           { en: "Planet",              te: "గ్రహం",                 hi: "ग्रह",                category: "general" },
  sign:             { en: "Sign",                te: "రాశి",                  hi: "राशि",                category: "general" },
  degree:           { en: "Degree",              te: "డిగ్రీ",                hi: "अंश",                 category: "general" },
  speed:            { en: "Speed",               te: "వేగం",                  hi: "गति",                 category: "general" },
  house:            { en: "House",               te: "గృహం",                  hi: "भाव",                 category: "general" },
  nakshatra:        { en: "Nakshatra",           te: "నక్షత్రం",              hi: "नक्षत्र",             category: "general" },
  lord:             { en: "Lord",                te: "అధిపతి",                hi: "स्वामी",              category: "general" },
  sub_lord:         { en: "Sub-Lord",            te: "ఉప-అధిపతి",             hi: "उप-स्वामी",           category: "kp" },
  pada:             { en: "Pada",                te: "పాదం",                  hi: "पाद",                 category: "general" },
  retrograde:       { en: "Retrograde",          te: "వక్రం",                 hi: "वक्री",               category: "general" },
  combust:          { en: "Combust",             te: "దగ్ధం",                 hi: "दग्ध",                category: "general" },
  dignity:          { en: "Dignity",             te: "బల స్థితి",             hi: "शक्ति स्थिति",        category: "general" },
  exalted:          { en: "Exalted",             te: "ఉచ్చం",                 hi: "उच्च",                category: "general" },
  own_sign:         { en: "Own Sign",            te: "స్వక్షేత్రం",           hi: "स्वराशि",             category: "general" },
  friendly:         { en: "Friendly",            te: "మిత్రక్షేత్రం",         hi: "मित्र राशि",          category: "general" },
  neutral:          { en: "Neutral",             te: "సమం",                   hi: "समभाव",               category: "general" },
  debilitated:      { en: "Debilitated",         te: "నీచం",                  hi: "नीच",                 category: "general" },
  enemy:            { en: "Enemy",               te: "శత్రుక్షేత్రం",         hi: "శత్రు రాశి",          category: "general" },
  ayanamsa:         { en: "Ayanamsa",            te: "అయనాంశ",               hi: "अयनांश",              category: "general" },
  julian_day:       { en: "Julian Day",          te: "జూలియన్ దినం",         hi: "जूलियन दिन",          category: "general" },
  unknown:          { en: "Unknown",             te: "తెలియదు",               hi: "अज्ञात",              category: "general" },
  n_a:              { en: "N/A",                 te: "వర్తించదు",             hi: "लागू नहीं",           category: "general" },

  // ── PLANETS ───────────────────────────────────────────────────────────────
  sun:              { en: "Sun",       te: "సూర్యుడు",    hi: "सूर्य",   category: "planet" },
  moon:             { en: "Moon",      te: "చంద్రుడు",   hi: "चंद्र",   category: "planet" },
  mars:             { en: "Mars",      te: "కుజుడు",      hi: "मंगल",    category: "planet" },
  mercury:          { en: "Mercury",   te: "బుధుడు",      hi: "बुध",     category: "planet" },
  jupiter:          { en: "Jupiter",   te: "గురుడు",      hi: "गुरु",    category: "planet" },
  venus:            { en: "Venus",     te: "శుక్రుడు",   hi: "शुक्र",   category: "planet" },
  saturn:           { en: "Saturn",    te: "శని",         hi: "शनి",     category: "planet" },
  rahu:             { en: "Rahu",      te: "రాహువు",      hi: "राहु",    category: "planet" },
  ketu:             { en: "Ketu",      te: "కేతువు",      hi: "केतु",    category: "planet" },
  ascendant:        { en: "Ascendant", te: "లగ్నం",       hi: "लग्न",    category: "planet" },

  // ── SIGNS / RASIS ─────────────────────────────────────────────────────────
  aries:            { en: "Aries",       te: "మేషం",       hi: "मेष",     category: "sign" },
  taurus:           { en: "Taurus",      te: "వృషభం",      hi: "वृषभ",    category: "sign" },
  gemini:           { en: "Gemini",      te: "మిథునం",     hi: "मिथुन",   category: "sign" },
  cancer:           { en: "Cancer",      te: "కర్కాటకం",   hi: "कर्क",    category: "sign" },
  leo:              { en: "Leo",         te: "సింహం",      hi: "सिंह",    category: "sign" },
  virgo:            { en: "Virgo",       te: "కన్య",       hi: "कन्या",   category: "sign" },
  libra:            { en: "Libra",       te: "తుల",        hi: "तुला",    category: "sign" },
  scorpio:          { en: "Scorpio",     te: "వృశ్చికం",   hi: "वृश्चिक", category: "sign" },
  sagittarius:      { en: "Sagittarius", te: "ధనుస్సు",   hi: "धनु",     category: "sign" },
  capricorn:        { en: "Capricorn",   te: "మకరం",       hi: "मकर",     category: "sign" },
  aquarius:         { en: "Aquarius",    te: "కుంభం",      hi: "कुंभ",    category: "sign" },
  pisces:           { en: "Pisces",      te: "మీనం",       hi: "मीन",     category: "sign" },

  // ── NAKSHATRAS ────────────────────────────────────────────────────────────
  ashwini:          { en: "Ashwini",        te: "అశ్విని",      hi: "अश्विनी",        category: "nakshatra" },
  bharani:          { en: "Bharani",        te: "భరణి",         hi: "भरणी",           category: "nakshatra" },
  krittika:         { en: "Krittika",       te: "కృత్తిక",      hi: "कृत्तिका",       category: "nakshatra" },
  rohini:           { en: "Rohini",         te: "రోహిణి",       hi: "रोहिणी",         category: "nakshatra" },
  mrigashira:       { en: "Mrigashira",     te: "మృగశిర",       hi: "मृगशिरा",        category: "nakshatra" },
  ardra:            { en: "Ardra",          te: "ఆరుద్ర",       hi: "आर्द्रा",        category: "nakshatra" },
  punarvasu:        { en: "Punarvasu",      te: "పునర్వసు",     hi: "पुनर्वसु",       category: "nakshatra" },
  pushya:           { en: "Pushya",         te: "పుష్యమి",      hi: "पुष्य",          category: "nakshatra" },
  ashlesha:         { en: "Ashlesha",       te: "ఆశ్లేష",       hi: "अश्लेषा",        category: "nakshatra" },
  magha:            { en: "Magha",          te: "మఖ",           hi: "मघा",            category: "nakshatra" },
  purva_phalguni:   { en: "Purva Phalguni", te: "పుబ్బ",        hi: "पूर्वाफाल्गुनी", category: "nakshatra" },
  uttara_phalguni:  { en: "Uttara Phalguni",te: "ఉత్తర",        hi: "उत्तराफाल्गुनी", category: "nakshatra" },
  hasta:            { en: "Hasta",          te: "హస్త",          hi: "हस्त",           category: "nakshatra" },
  chitra:           { en: "Chitra",         te: "చిత్త",         hi: "चित्रा",         category: "nakshatra" },
  swati:            { en: "Swati",          te: "స్వాతి",        hi: "स्वाती",         category: "nakshatra" },
  vishakha:         { en: "Vishakha",       te: "విశాఖ",         hi: "विशाखा",         category: "nakshatra" },
  anuradha:         { en: "Anuradha",       te: "అనూరాధ",       hi: "अनुराधा",        category: "nakshatra" },
  jyeshtha:         { en: "Jyeshtha",       te: "జ్యేష్ఠ",      hi: "ज्येष्ठा",       category: "nakshatra" },
  mula:             { en: "Mula",           te: "మూల",           hi: "मूल",            category: "nakshatra" },
  purva_ashadha:    { en: "Purva Ashadha",  te: "పూర్వాషాఢ",    hi: "पूर्वाषाढ़ा",   category: "nakshatra" },
  uttara_ashadha:   { en: "Uttara Ashadha", te: "ఉత్తరాషాఢ",   hi: "उत्तराषाढ़ा",   category: "nakshatra" },
  shravana:         { en: "Shravana",       te: "శ్రవణం",       hi: "श्रवण",          category: "nakshatra" },
  dhanishta:        { en: "Dhanishta",      te: "ధనిష్ఠ",       hi: "धनिष्ठा",        category: "nakshatra" },
  shatabhisha:      { en: "Shatabhisha",    te: "శతభిషం",      hi: "शतभिषा",         category: "nakshatra" },
  purva_bhadrapada: { en: "Purva Bhadrapada", te: "పూర్వాభాద్ర", hi: "पूर्वाभाद्रपद", category: "nakshatra" },
  uttara_bhadrapada:{ en: "Uttara Bhadrapada", te: "ఉత్తరాభాద్ర", hi: "उत्तराभाद्रपद", category: "nakshatra" },
  revati:           { en: "Revati",         te: "రేవతి",        hi: "रेवती",          category: "nakshatra" },

  // ── KUTAS (MARRIAGE MATCH) ────────────────────────────────────────────────
  varna_kuta:       { en: "Varna Kuta",    te: "వర్ణ కుట",    hi: "वर्ण कूट",    category: "kuta" },
  vashya_kuta:      { en: "Vashya Kuta",   te: "వశ్య కుట",    hi: "వశ్య कूट",    category: "kuta" },
  dina_kuta:        { en: "Dina Kuta",     te: "దిన కుట",     hi: "दिन कूट",     category: "kuta" },
  yoni_kuta:        { en: "Yoni Kuta",     te: "యోని కుట",    hi: "योनि कूट",    category: "kuta" },
  gana_kuta:        { en: "Gana Kuta",     te: "గణ కుట",      hi: "गण कूट",      category: "kuta" },
  bhakoot_kuta:     { en: "Bhakoot Kuta",  te: "భకూట కుట",   hi: "भकूट कूट",    category: "kuta" },
  rajju_kuta:       { en: "Rajju Kuta",    te: "రజ్జు కుట",   hi: "रज्जु कूट",   category: "kuta" },
  nakshatra_kuta:   { en: "Nakshatra Kuta",te: "నక్షత్ర కుట", hi: "नक्षत्र कूट",  category: "kuta" },

  // ── DOSHAS ────────────────────────────────────────────────────────────────
  manglik_dosha:    { en: "Manglik Dosha",     te: "కుజ దోషం",        hi: "मांगलिक दोष",    category: "dosha" },
  rajju_dosha:      { en: "Rajju Dosha",       te: "రజ్జు దోషం",      hi: "रज्जु दोष",      category: "dosha" },
  bhakoot_dosha:    { en: "Bhakoot Dosha",     te: "భకూట దోషం",      hi: "भकूट दोष",       category: "dosha" },
  kalasarpa_dosha:  { en: "Kala Sarpa Dosha",  te: "కాలసర్ప దోషం",   hi: "कालसर्प दोष",    category: "dosha" },
  no_dosha:         { en: "No Dosha",          te: "దోషం లేదు",       hi: "दोष नहीं",       category: "dosha" },
  dosha_present:    { en: "Dosha Present",     te: "దోషం ఉంది",       hi: "दोष मौजूद",      category: "dosha" },
  remedies:         { en: "Remedies",          te: "పరిహారాలు",       hi: "उपाय",            category: "dosha" },

  // ── DASHAS ────────────────────────────────────────────────────────────────
  mahadasha:        { en: "Mahadasha",       te: "మహాదశ",          hi: "महादशा",         category: "dasha" },
  antardasha:       { en: "Antardasha",      te: "అంతర్దశ",        hi: "अन्तर्दशा",       category: "dasha" },
  pratyantardasha:  { en: "Pratyantardasha", te: "ప్రత్యంతర్దశ",   hi: "प्रत्यन्तर्दशा",  category: "dasha" },
  completed:        { en: "Completed",       te: "పూర్తయింది",      hi: "पूर्ण",           category: "dasha" },
  remaining:        { en: "remaining",       te: "మిగిలి ఉంది",    hi: "शेष",             category: "dasha" },

  // ── KP & ADVANCED ─────────────────────────────────────────────────────────
  significator:     { en: "Significator",    te: "సూచిక (సిగ్నిఫికేటర్)", hi: "सूचक",    category: "kp" },
  cusp:             { en: "Cusp",            te: "కస్ప్ (భావ మధ్యం)",     hi: "भाव मध्य", category: "kp" },
  ruling_planets:   { en: "Ruling Planets",  te: "పరిపాలక గ్రహాలు",      hi: "शासी ग्रह", category: "kp" },

  // ── PLANET TABLE ──────────────────────────────────────────────────────────
  planetary_coordinates_insights: { en: "Planetary Coordinates & Insights", te: "గ్రహ స్థానాలు & వివరాలు", hi: "ग्रह निर्देशांक और जानकारी", category: "ui" },
  key_relationship_significators: { en: "Key relationship significators and precise celestial placements", te: "ముఖ్యమైన గ్రహ స్థానాలు మరియు సంబంధ సూచికలు", hi: "मुख्य संबंध सूचक और सटीक ग्रहीय स्थान", category: "ui" },
  insight_cards:    { en: "Insight Cards",   te: "వివరణ కార్డులు",       hi: "जानकारी कार्ड",    category: "ui" },
  detailed_table:   { en: "Detailed Table",  te: "విస్తృత పట్టిక",       hi: "विस्तृत तालिका",   category: "ui" },
  filter_planets:   { en: "Filter planets or signs...", te: "గ్రహాలు లేదా రాశులు వెతకండి...", hi: "ग्रह या राशि खोजें...", category: "ui" },
  graha_planet:     { en: "Graha (Planet)",  te: "గ్రహం",                hi: "ग्रह",              category: "ui" },
  sign_and_degrees: { en: "Sign & Degrees",  te: "రాశి & డిగ్రీలు",     hi: "राशि और अंश",      category: "ui" },
  nakshatra_pada:   { en: "Nakshatra & Pada",te: "నక్షత్రం & పాదం",     hi: "नक्षत्र और पाद",   category: "ui" },
  nakshatra_lord:   { en: "Nakshatra Lord",  te: "నక్షత్ర అధిపతి",      hi: "नक्षत्र स्वामी",   category: "ui" },
  marital_impact:   { en: "Marital Impact:", te: "వివాహ ప్రభావం:",      hi: "वैवाहिक प्रभाव:",  category: "ui" },
  placement:        { en: "Placement:",      te: "స్థానం:",               hi: "स्थान:",            category: "ui" },

  // ── PANCHANGAM VIEW ────────────────────────────────────────────────────────
  panchangam_vedic_calendar: { en: "Panchangam (Vedic Calendar Details)", te: "పంచాంగం (వైదిక దినదర్శిని వివరాలు)", hi: "पंचांग (वैदिक कैलेंडर विवरण)", category: "ui" },
  tithi:            { en: "Tithi",           te: "తిథి",                  hi: "तिथि",              category: "ui" },
  janma_rasi:       { en: "Janma Rasi",      te: "జన్మ రాశి",             hi: "जन्म राशि",         category: "ui" },
  nakshatram:       { en: "Nakshatram",      te: "నక్షత్రం",              hi: "नक्षत्र",           category: "ui" },
  nitya_yoga:       { en: "Nitya Yoga",      te: "నిత్య యోగం",           hi: "नित्य योग",         category: "ui" },
  karana:           { en: "Karana",          te: "కరణం",                  hi: "करण",               category: "ui" },
  sun_rise:         { en: "Sun Rise",        te: "సూర్యోదయం",            hi: "सूर्योदय",          category: "ui" },
  sun_set:          { en: "Sun Set",         te: "సూర్యాస్తమయం",          hi: "सूर्यास्त",         category: "ui" },
  local_astro_details: { en: "Local Astro Details", te: "స్థానిక జ్యోతిష్య వివరాలు", hi: "स्थानीय ज्योतिष विवरण", category: "ui" },
  vaara:            { en: "Vaara",           te: "వారం",                  hi: "वार",               category: "ui" },
  yoga:             { en: "Yoga",            te: "యోగం",                  hi: "योग",               category: "ui" },
  rahu_kalam:       { en: "Rahu Kalam",      te: "రాహు కాలం",             hi: "राहु काल",          category: "ui" },
  paksha:           { en: "Paksha",          te: "పక్షం",                 hi: "पक्ष",              category: "ui" },
  shukla_paksha:    { en: "Shukla Paksha",   te: "శుక్ల పక్షం",          hi: "शुक्ल पक्ष",        category: "ui" },
  krishna_paksha:   { en: "Krishna Paksha",  te: "కృష్ణ పక్షం",          hi: "कृष्ण पक्ष",        category: "ui" },

  // ── TRANSIT TAB ─────────────────────────────────────────────────────────────
  gochara_transit_coordinates: { en: "Gochara (Transit) Coordinates & Natal Impact", te: "గోచారం (సంచారం) స్థానాలు & జన్మ కుండలి ప్రభావం", hi: "गोचर निर्देशांक और जन्म कुंडली प्रभाव", category: "ui" },
  real_time_transits: { en: "Real-time planetary transits calculated relative to your Natal Lagna and Janma Rasi", te: "మీ లగ్నం మరియు జన్మ రాశి ఆధారంగా ప్రస్తుత గ్రహ సంచారం", hi: "आपके लग्न और जन्म राशि के अनुसार वर्तमान ग्रह गोचर", category: "ui" },
  saturn_transit:   { en: "Saturn Transit (Shani Gochara)", te: "శని సంచారం (శని గోచారం)", hi: "शनि गोचर (शनि गोचर)", category: "ui" },
  sade_sati_active: { en: "Sade Sati Active", te: "ఏలినాటి శని సక్రియంగా ఉంది", hi: "साढ़े साती सक्रिय", category: "ui" },
  jupiter_transit:  { en: "Jupiter Transit (Guru Gochara)", te: "గురుడు సంచారం (గురు గోచారం)", hi: "गुरु गोचर", category: "ui" },
  auspicious:       { en: "Auspicious",      te: "శుభకరం",               hi: "शुभ",               category: "ui" },
  from_lagna:       { en: "from Lagna",      te: "లగ్నం నుండి",           hi: "लग्न से",           category: "ui" },
  from_moon:        { en: "from Moon",       te: "చంద్రుని నుండి",        hi: "चंद्र से",          category: "ui" },
  live_gochara_transit: { en: "Live Gochara Transit Chart", te: "ప్రత్యక్ష గోచారం చార్ట్", hi: "लाइव गोचर चार्ट", category: "ui" },

  // ── VIMSHOTTARI DASHA TAB ─────────────────────────────────────────────────
  vimshottari_dasha_timeline: { en: "Vimshottari Dasha Timeline", te: "వింశోత్తరి దశ కాలక్రమం", hi: "विंशोत्तरी दशा समयावधि", category: "ui" },
  dasha_moon_desc: { en: "Vedic planetary progression cycles calculated based on Moon's nakshatra position.", te: "చంద్రుని నక్షత్ర స్థానం ఆధారంగా లెక్కించబడిన వైదిక గ్రహ కాలచక్రం.", hi: "चंद्रमा की नक्षत्र स्थिति के आधार पर गणना की गई वैदिक ग्रह चक्र प्रगति।", category: "ui" },
  expand_all:       { en: "Expand All",      te: "అన్నీ విస్తరించు",     hi: "सभी विस्तृत करें",  category: "ui" },
  collapse_all:     { en: "Collapse All",    te: "అన్నీ కుదించు",        hi: "सभी संकुचित करें",  category: "ui" },
  all_dashas:       { en: "All Dashas",      te: "అన్ని దశలు",           hi: "सभी दशाएं",         category: "ui" },
  current_active:   { en: "Current Active",  te: "ప్రస్తుత దశ",          hi: "केवल सक्रिय",       category: "ui" },
  now:              { en: "Now",             te: "ప్రస్తుతం",             hi: "सक्रिय",            category: "ui" },
  planet_cycle:     { en: "Planet Cycle",    te: "గ్రహ కాలం",             hi: "ग्रह चक्र",         category: "ui" },
  auspicious_interval: { en: "Auspicious Interval", te: "శుభ కాలవ్యవధి", hi: "शुभ समयांतराल",     category: "ui" },
  duration:         { en: "Duration",        te: "వ్యవధి",               hi: "अवधि",              category: "ui" },
  jump_to_current:  { en: "Jump to Current Period", te: "ప్రస్తుత దశకు వెళ్ళు", hi: "वर्तमान काल पर जाएं", category: "ui" },

  // ── DIVISIONAL CHART ──────────────────────────────────────────────────────
  todays_chart:     { en: "TODAY'S CHART",       te: "నేటి కుండలి",         hi: "आज की कुंडली",      category: "ui" },
  birth_natal_chart: { en: "BIRTH NATAL CHART",  te: "జన్మ కుండలి",         hi: "जन्म कुंडली",       category: "ui" },
  date_label:       { en: "Date",                te: "తేదీ",                 hi: "दिनांक",            category: "ui" },
  time_label:       { en: "Time",                te: "సమయం",                 hi: "समय",               category: "ui" },
  location_label:   { en: "Location",            te: "స్థానం",               hi: "स्थान",             category: "ui" },
  selected_lagna:   { en: "Selected Lagna Sign", te: "ఎంచుకున్న లగ్న రాశి", hi: "चयनित लग्न राशि",  category: "ui" },
  legend_numbers:   { en: "Numbers (1–12):",     te: "సంఖ్యలు (1–12):",     hi: "संख्याएँ (1–12):",  category: "ui" },
  legend_zodiac:    { en: "Zodiac signs (1=Aries ... 12=Meena)", te: "రాశులు (1=మేషం ... 12=మీనం)", hi: "राशि (1=मेष ... 12=मीन)", category: "ui" },
  lagna_label:      { en: "Lagna (L)",           te: "లగ్నం (L)",            hi: "लग्न (L)",          category: "ui" },
  retro_label:      { en: "Retrograde (RX)",     te: "వక్ర గ్రహం (RX)",     hi: "वक्री ग्रह (RX)",   category: "ui" },
  missing_chart:    { en: "Divisional Chart Missing", te: "వర్గ కుండలి లేదు", hi: "विभागीय कुंडली अनुपलब्ध", category: "ui" },
  missing_chart_desc: { en: "The requested varga chart is not present in the API response data.", te: "అడిగిన వర్గ కుండలి వివరాలు లభించలేదు.", hi: "अनुरोधित वर्ग कुंडली एपीआई प्रतिक्रिया में मौजूद नहीं है।", category: "ui" },
  south_indian:     { en: "SOUTH INDIAN",        te: "దక్షిణ భారత పద్ధతి",  hi: "दक्षिण भारतीय",     category: "ui" },
  east_indian:      { en: "EAST INDIAN",         te: "తూర్పు భారత పద్ధతి",  hi: "पूर्वी भारतीय",     category: "ui" },
  north_indian:     { en: "NORTH INDIAN",        te: "ఉత్తర భారత పద్ధతి",   hi: "उत्तर भारतीय",      category: "ui" },
  d1_rasi:          { en: "D-1 RASI",             te: "D-1 రాశి",             hi: "D-1 राशि",          category: "ui" },
  d9_navamsa:       { en: "D-9 NAVAMSA",          te: "D-9 నవాంశ",           hi: "D-9 नवांश",         category: "ui" },
  rasi_chart:       { en: "RASI CHART",           te: "రాశి చక్రం",          hi: "राशि चार्ट",        category: "ui" },
  navamsa:          { en: "NAVAMSA",              te: "నవాంశ",               hi: "नवांश",             category: "ui" },

  // ── PROFILE PAGE ──────────────────────────────────────────────────────────
  sign_out:         { en: "Sign Out",            te: "సైన్ అవుట్",           hi: "साइन आउट",          category: "ui" },
  google_sign_in:   { en: "Google Sign In",      te: "Google లాగిన్",         hi: "Google साइन इन",    category: "ui" },
  google_drive_sync: { en: "Google Drive Cloud Sync", te: "గూగుల్ డ్రైవ్ క్లౌడ్ సమకాలీకరణ", hi: "गूगल ड्राइव क्लाउड सिंक", category: "ui" },
  sync_profiles:    { en: "Sync Profiles",       te: "ప్రొఫైల్స్ సమకాలీకరించు", hi: "प्रोफाइल सिंक करें", category: "ui" },
  syncing:          { en: "Syncing...",           te: "సమకాలీకరిస్తోంది...",  hi: "सिंक हो रहा है...",  category: "ui" },
  saved_birth_charts: { en: "Saved Birth Charts", te: "సేవ్ చేసిన జన్మ కుండలిలు", hi: "सहेजी गई जन्म कुंडलियां", category: "ui" },
  manage_view_edit: { en: "Manage, view, edit, or delete saved chart profiles", te: "సేవ్ చేసిన ప్రొఫైల్స్ నిర్వహించు, చూడు, సవరించు లేదా తొలగించు", hi: "सहेजे गए प्रोफाइल प्रबंधित करें, देखें, संपादित करें या हटाएं", category: "ui" },
  create_new_chart: { en: "+ Create New Chart",  te: "+ కొత్త కుండలి సృష్టించు", hi: "+ नई कुंडली बनाएं", category: "ui" },
  search_by_name:   { en: "Search by name or place...", te: "పేరు లేదా స్థానంతో వెతకండి...", hi: "नाम या स्थान से खोजें...", category: "ui" },
  no_charts_match:  { en: "No saved birth charts match your query.", te: "మీ శోధనకు సరిపోయే సేవ్ చేసిన కుండలిలు లేవు.", hi: "आपकी खोज से मेल खाने वाली कोई कुंडली नहीं।", category: "ui" },
  app_preferences:  { en: "App Preferences",     te: "యాప్ ప్రాధాన్యతలు",   hi: "ऐप प्राथमिकताएं",   category: "ui" },
  default_language: { en: "Default Language",    te: "డిఫాల్ట్ భాష",         hi: "डिफ़ॉल्ट भाषा",      category: "ui" },
  default_chart_style: { en: "Default Chart Style", te: "డిఫాల్ట్ చార్ట్ శైలి", hi: "डिफ़ॉल्ट चार्ट शैली", category: "ui" },
  ayanamsha_calculation: { en: "Ayanamsha Calculation", te: "అయనాంశ గణన",    hi: "अयनांश गणना",       category: "ui" },
  data_management:  { en: "Data Management & Privacy", te: "డేటా నిర్వహణ & గోప్యత", hi: "डेटा प्रबंधन और गोपनीयता", category: "ui" },
  export_all_data:  { en: "Export All My Data (JSON)", te: "నా డేటా ఎగుమతించు (JSON)", hi: "मेरा सारा डेटा निर्यात करें (JSON)", category: "ui" },
  privacy_policy:   { en: "Privacy Policy",      te: "గోప్యతా విధానం",       hi: "गोपनीयता नीति",     category: "ui" },
  reset_clear_data: { en: "Reset / Clear Local Data", te: "రీసెట్ / లోకల్ డేటా క్లియర్ చేయి", hi: "रीसेट / स्थानीय डेटा साफ़ करें", category: "ui" },
  active:           { en: "Active",               te: "సక్రియం",              hi: "सक्रिय",             category: "ui" },
  view:             { en: "View",                 te: "చూడు",                  hi: "देखें",              category: "ui" },

  // ── BOTTOM NAV ─────────────────────────────────────────────────────────────
  nav_home:         { en: "Home",                 te: "హోమ్",                  hi: "होम",                category: "ui" },
  nav_kundali:      { en: "Kundali",              te: "కుండలి",               hi: "कुंडली",             category: "ui" },
  nav_chant:        { en: "Chant",                te: "మంత్రం",               hi: "मंत्र",              category: "ui" },
  nav_matching:     { en: "Matching",             te: "పొంతన",                hi: "मिलान",              category: "ui" },

  // ── GLOBAL HEADER ─────────────────────────────────────────────────────────
  header_login:     { en: "Login",                te: "లాగిన్",               hi: "लॉगिन",              category: "ui" },

  // ── MARRIAGE MATCH ────────────────────────────────────────────────────────
  compatibility_check: { en: "Compatibility Check", te: "వివాహ పొంతన విశ్లేషణ", hi: "विवाह अनुकूलता मिलान", category: "ui" },
  boy_details:      { en: "Boy's Details",        te: "వరుడి వివరాలు",        hi: "वर का विवरण",        category: "ui" },
  girl_details:     { en: "Girl's Details",       te: "వధువు వివరాలు",        hi: "वधू का विवरण",       category: "ui" },
  check_compatibility: { en: "Check Compatibility", te: "వివాహ అనుకూలతను తనిఖీ చేయండి", hi: "अनुकूलता की जांच करें", category: "ui" },
  calculating_alignment: { en: "Calculating Astrological Alignment...", te: "జాతక పొంతన తనిఖీ చేస్తున్నాము...", hi: "ज्योतिषीय संरेखण की गणना हो रही है...", category: "ui" },
  saved_profiles_label: { en: "Saved Profiles",   te: "సేవ్ చేసిన ప్రొఫైల్స్", hi: "सहेजे गए प्रोफाइल", category: "ui" },
  set_as_boy:       { en: "Set as Boy",           te: "వరుడిగా ఎంచుకోండి",   hi: "वर के रूप में चुनें", category: "ui" },
  set_as_girl:      { en: "Set as Girl",          te: "వధువుగా ఎంచుకోండి",   hi: "वधू के रूप में चुनें", category: "ui" },
  birth_charts_d1:  { en: "Birth Charts (D-1)",   te: "జాతక చక్రాలు (D-1)",  hi: "जन्म कुंडली (D-1)",  category: "ui" },
  ashta_kuta_breakdown: { en: "Ashta Kuta Breakdown", te: "అష్టకూట విశ్లేషణ", hi: "अष्टकूट ब्रेकडाउन", category: "ui" },
  doshas_remedies:  { en: "Doshas & Remedies",    te: "దోషాలు & పరిహారాలు",  hi: "दोष और उपाय",        category: "ui" },

  // ── PLANETARY STRENGTH ───────────────────────────────────────────────────
  planetary_strength_profile: { en: "Planetary Strength Profile", te: "గ్రహ బల ప్రొఫైల్", hi: "ग्रह बल प्रोफाइल", category: "ui" },
  functional_role:  { en: "Functional Role",      te: "క్రియాత్మక పాత్ర",    hi: "कार्यात्मक भूमिका", category: "ui" },
  functional_benefic: { en: "Functional Benefic", te: "శుభ కారకం",           hi: "कार्यात्मक शुभ",    category: "ui" },
  functional_malefic: { en: "Functional Malefic", te: "అశుభ కారకం",          hi: "कार्यात्मक क्रूर",  category: "ui" },
  houses_ruled:     { en: "Houses Ruled",         te: "అధిపత్య భావాలు",      hi: "शासित भाव",         category: "ui" },

  // ── BIRTH FORM ─────────────────────────────────────────────────────────────
  enter_birth_details: { en: "Enter birth details for precise calculation.", te: "ఖచ్చితమైన లెక్కింపు కోసం జన్మ వివరాలు నమోదు చేయండి.", hi: "सटीक गणना के लिए जन्म विवरण दर्ज करें।", category: "ui" },
  name:             { en: "Name",                 te: "పేరు",                  hi: "नाम",               category: "ui" },
  gender:           { en: "Gender",               te: "లింగం",                 hi: "लिंग",              category: "ui" },
  male:             { en: "Male",                 te: "పురుష",                  hi: "पुरुष",             category: "ui" },
  female:           { en: "Female",               te: "స్త్రీ",                hi: "महिला",             category: "ui" },
  birth_date:       { en: "Birth Date",           te: "జన్మ తేదీ",             hi: "जन्म तिथि",         category: "ui" },
  birth_time:       { en: "Birth Time",           te: "జన్మ సమయం",            hi: "जन्म समय",          category: "ui" },
  birth_place:      { en: "Birth Place",          te: "జన్మ స్థలం",           hi: "जन्म स्थान",        category: "ui" },

  // ── PANCHANGAM PAGE EXTRA ─────────────────────────────────────────────────
  todays_panchangam: { en: "Today's Panchangam",  te: "నేటి పంచాంగం",         hi: "आज का पंचांग",      category: "ui" },
  live_sky_positions: { en: "Live Sky Positions", te: "ప్రత్యక్ష ఆకాశ స్థానాలు", hi: "लाइव आकाश स्थिति", category: "ui" },
  current_sky:      { en: "Current Sky",          te: "ప్రస్తుత ఆకాశం",       hi: "वर्तमान आकाश",      category: "ui" },
  sunrise_sunset:   { en: "Sunrise / Sunset",     te: "సూర్యోదయం / సూర్యాస్తమయం", hi: "सूर्योदय / सूर्यास्त", category: "ui" },

  // ── AI TAB ─────────────────────────────────────────────────────────────────
  ai_vedic_consultation: { en: "AI Vedic Consultation", te: "ఏఐ వైదిక జ్యోతిష్య సలహా", hi: "एआई वैदिक ज्योतिषीय सलाह", category: "ui" },
  ask_question:     { en: "Ask a question...",    te: "ప్రశ్న అడగండి...",     hi: "प्रश्न पूछें...",   category: "ui" },
  send:             { en: "Send",                 te: "పంపు",                  hi: "भेजें",             category: "ui" },
};

/**
 * useUIStrings — thin wrapper around useLanguage()
 *
 * Returns `{ t, language, setLanguage }` where `t(key)` looks up ASTROLOGICAL_TERMS_MAP
 * and `language` is the raw language string for logic branches.
 *
 * Centralises the `import { useLanguage }` call so components stay lean.
 */
import { useLanguage } from '../../context/LanguageContext';

export function useUIStrings() {
  const { language, setLanguage, t } = useLanguage();
  return { t, language, setLanguage };
}

// ─── Per-component string bags ───────────────────────────────────────────────
// These are plain object maps keyed by language — zero hook overhead —
// imported directly into components that can't use hooks (e.g. SVG renderers).

export type Lang = 'en' | 'hi' | 'te';

// BottomNav labels
export const BOTTOM_NAV_LABELS: Record<Lang, Record<string, string>> = {
  en: { home: 'Home', kundali: 'Kundali', chant: 'Chant', matching: 'Matching' },
  te: { home: 'హోమ్', kundali: 'కుండలి', chant: 'మంత్రం', matching: 'పొంతన' },
  hi: { home: 'होम', kundali: 'कुंडली', chant: 'मंत्र', matching: 'मिलान' },
};

// PanchangamView item labels
export const PANCHANGAM_LABELS: Record<Lang, {
  tithi: string; janma_rasi: string; nakshatram: string; nitya_yoga: string;
  karana: string; sun_rise: string; sun_set: string; header: string; local: string;
}> = {
  en: { tithi: 'Tithi', janma_rasi: 'Janma Rasi', nakshatram: 'Nakshatram', nitya_yoga: 'Nitya Yoga', karana: 'Karana', sun_rise: 'Sun Rise', sun_set: 'Sun Set', header: 'Panchangam (Vedic Calendar Details)', local: 'Local Astro Details' },
  te: { tithi: 'తిథి', janma_rasi: 'జన్మ రాశి', nakshatram: 'నక్షత్రం', nitya_yoga: 'నిత్య యోగం', karana: 'కరణం', sun_rise: 'సూర్యోదయం', sun_set: 'సూర్యాస్తమయం', header: 'పంచాంగం (వైదిక దినదర్శిని వివరాలు)', local: 'స్థానిక జ్యోతిష్య వివరాలు' },
  hi: { tithi: 'तिथि', janma_rasi: 'जन्म राशि', nakshatram: 'नक्षत्र', nitya_yoga: 'नित्य योग', karana: 'करण', sun_rise: 'सूर्योदय', sun_set: 'सूर्यास्त', header: 'पंचांग (वैदिक कैलेंडर विवरण)', local: 'स्थानीय ज्योतिष विवरण' },
};

// HomePageV1 strings
export const HOME_LABELS: Record<Lang, {
  viewFullPanchangam: string; newKundali: string; subtitle: string; generate: string;
  myKundalis: string; savedCharts: string; newMatch: string; compatibilityAnalysis: string;
  todaysPanchangam: string; close: string; tithi: string; nakshatra: string; vaara: string;
  yogaKarana: string; sunrise: string; rahuKalam: string; transitingGrahas: string;
  noPlanets: string; done: string;
}> = {
  en: {
    viewFullPanchangam: 'View Full Panchangam', newKundali: 'New Kundali',
    subtitle: 'Enter birth details for precise calculation.', generate: 'Generate',
    myKundalis: 'My Kundalis', savedCharts: 'Saved charts library',
    newMatch: 'New Match', compatibilityAnalysis: 'Compatibility analysis',
    todaysPanchangam: "Today's Panchangam", close: 'Close',
    tithi: 'Tithi', nakshatra: 'Nakshatra', vaara: 'Vaara',
    yogaKarana: 'Yoga / Karana', sunrise: 'Sunrise / Sunset', rahuKalam: 'Rahu Kalam',
    transitingGrahas: 'Transiting Grahas:', noPlanets: 'No transiting planets currently in this rashi.',
    done: 'Done',
  },
  te: {
    viewFullPanchangam: 'పూర్తి పంచాంగం చూడండి', newKundali: 'కొత్త కుండలి',
    subtitle: 'ఖచ్చితమైన లెక్కింపు కోసం జన్మ వివరాలు నమోదు చేయండి.', generate: 'రూపొందించు',
    myKundalis: 'నా కుండలిలు', savedCharts: 'సేవ్ చేసిన చార్ట్ల లైబ్రరీ',
    newMatch: 'కొత్త పొంతన', compatibilityAnalysis: 'అనుకూలత విశ్లేషణ',
    todaysPanchangam: 'నేటి పంచాంగం', close: 'మూసివేయి',
    tithi: 'తిథి', nakshatra: 'నక్షత్రం', vaara: 'వారం',
    yogaKarana: 'యోగం / కరణం', sunrise: 'సూర్యోదయం / సూర్యాస్తమయం', rahuKalam: 'రాహు కాలం',
    transitingGrahas: 'సంచరించే గ్రహాలు:', noPlanets: 'ప్రస్తుతం ఈ రాశిలో సంచరించే గ్రహాలు లేవు.',
    done: 'అయింది',
  },
  hi: {
    viewFullPanchangam: 'पूर्ण पंचांग देखें', newKundali: 'नई कुंडली',
    subtitle: 'सटीक गणना के लिए जन्म विवरण दर्ज करें।', generate: 'बनाएं',
    myKundalis: 'मेरी कुंडलियां', savedCharts: 'सहेजी गई चार्ट लाइब्रेरी',
    newMatch: 'नया मिलान', compatibilityAnalysis: 'अनुकूलता विश्लेषण',
    todaysPanchangam: 'आज का पंचांग', close: 'बंद करें',
    tithi: 'तिथि', nakshatra: 'नक्षत्र', vaara: 'वार',
    yogaKarana: 'योग / करण', sunrise: 'सूर्योदय / सूर्यास्त', rahuKalam: 'राहु काल',
    transitingGrahas: 'गोचर ग्रह:', noPlanets: 'अभी इस राशि में कोई गोचर ग्रह नहीं हैं।',
    done: 'हो गया',
  },
};

// BirthChartPage tab labels
export const BIRTH_CHART_TAB_LABELS: Record<Lang, {
  overview: string; planetStrength: string; transit: string;
  dasha: string; partner: string; report: string; ai: string;
  generatingChart: string; noActiveChart: string; native: string; born: string; place: string;
  generationFailed: string; retryCalc: string; editDetails: string; goBack: string;
  selectOrCreate: string; tripleCharts: string; loadingTriple: string;
  storyOfChart: string; currentPhase: string; viewFullDasha: string;
  execNatal: string; parashari: string; ascendantLagna: string;
  moonSignRasi: string; sunSignSurya: string; activeDasha: string; soulIdentity: string;
  lordLabel: string; padaLabel: string; mahadasha: string; antardasha: string;
  pratyantardasha: string; remaining: string; ends: string;
}> = {
  en: {
    overview: 'Overview', planetStrength: 'Planet Strength', transit: 'Transit',
    dasha: 'Vimsottara Dasha', partner: 'Life Partner', report: 'Report', ai: 'AI',
    generatingChart: 'Generating Birth Chart...', noActiveChart: 'No Active Chart Selected',
    native: 'Native:', born: 'Born:', place: 'Place:',
    generationFailed: 'Generation Failed', retryCalc: 'Retry Calculation',
    editDetails: 'Edit Details', goBack: 'Go Back',
    selectOrCreate: 'Please select or create a profile on the Home or Profile page to view the Birth Chart.',
    tripleCharts: 'Triple Charts (D1 Rasi, Live Transit & D9 Navamsha)',
    loadingTriple: 'Loading Triple Charts...',
    storyOfChart: 'The Story of This Chart', currentPhase: 'Current Vimshottari Life Phase',
    viewFullDasha: 'View Full Dasha →', execNatal: 'Executive Natal Coordinates',
    parashari: 'Parashari Classical Core', ascendantLagna: 'Ascendant (Lagna)',
    moonSignRasi: 'Moon Sign (Rasi)', sunSignSurya: 'Sun Sign (Surya)',
    activeDasha: 'Active Dasha', soulIdentity: 'Soul Identity',
    lordLabel: 'Lord:', padaLabel: 'Pada', mahadasha: 'Mahadasha',
    antardasha: 'Antardasha', pratyantardasha: 'Pratyantardasha',
    remaining: 'remaining', ends: 'Ends',
  },
  te: {
    overview: 'అవలోకనం', planetStrength: 'గ్రహ బలం', transit: 'గోచారం',
    dasha: 'వింశోత్తరి దశ', partner: 'జీవన సహచరి', report: 'నివేదిక', ai: 'ఏఐ',
    generatingChart: 'జన్మ కుండలి రూపొందిస్తోంది...', noActiveChart: 'చార్ట్ ఏదీ ఎంచుకోబడలేదు',
    native: 'జాతకుడు:', born: 'జన్మించిన:', place: 'స్థానం:',
    generationFailed: 'రూపొందించడం విఫలమైంది', retryCalc: 'మళ్లీ లెక్కించండి',
    editDetails: 'వివరాలు మార్చండి', goBack: 'వెనక్కి వెళ్ళండి',
    selectOrCreate: 'జన్మ కుండలి చూడడానికి హోమ్ లేదా ప్రొఫైల్ పేజీలో ప్రొఫైల్ ఎంచుకోండి లేదా సృష్టించండి.',
    tripleCharts: 'మూడు చార్ట్లు (D1 రాశి, గోచారం & D9 నవాంశ)',
    loadingTriple: 'చార్ట్లు లోడవుతున్నాయి...',
    storyOfChart: 'ఈ కుండలి కథ', currentPhase: 'ప్రస్తుత వింశోత్తరి జీవన దశ',
    viewFullDasha: 'పూర్తి దశ చూడండి →', execNatal: 'జన్మ కుండలి సంక్షిప్త వివరాలు',
    parashari: 'పారాశరి సాంప్రదాయ విశ్లేషణ', ascendantLagna: 'లగ్నం',
    moonSignRasi: 'చంద్ర రాశి', sunSignSurya: 'సూర్య రాశి',
    activeDasha: 'ప్రస్తుత దశ', soulIdentity: 'ఆత్మ స్వభావం',
    lordLabel: 'అధిపతి:', padaLabel: 'పాదం', mahadasha: 'మహాదశ',
    antardasha: 'అంతర్దశ', pratyantardasha: 'ప్రత్యంతర్దశ',
    remaining: 'మిగిలి ఉంది', ends: 'ముగింపు',
  },
  hi: {
    overview: 'अवलोकन', planetStrength: 'ग्रह बल', transit: 'गोचर',
    dasha: 'विंशोत्तरी दशा', partner: 'जीवन साथी', report: 'रिपोर्ट', ai: 'एआई',
    generatingChart: 'जन्म कुंडली बन रही है...', noActiveChart: 'कोई चार्ट नहीं चुना गया',
    native: 'जातक:', born: 'जन्म:', place: 'स्थान:',
    generationFailed: 'निर्माण विफल', retryCalc: 'पुनः गणना करें',
    editDetails: 'विवरण संपादित करें', goBack: 'वापस जाएं',
    selectOrCreate: 'जन्म कुंडली देखने के लिए होम या प्रोफाइल पेज पर प्रोफाइल चुनें या बनाएं।',
    tripleCharts: 'तीन चार्ट (D1 राशि, गोचर और D9 नवांश)',
    loadingTriple: 'चार्ट लोड हो रहे हैं...',
    storyOfChart: 'इस कुंडली की कहानी', currentPhase: 'वर्तमान विंशोत्तरी जीवन चरण',
    viewFullDasha: 'पूर्ण दशा देखें →', execNatal: 'जन्म कुंडली संक्षेप',
    parashari: 'पाराशरी शास्त्रीय मूल', ascendantLagna: 'लग्न',
    moonSignRasi: 'चंद्र राशि', sunSignSurya: 'सूर्य राशि',
    activeDasha: 'सक्रिय दशा', soulIdentity: 'आत्मिक पहचान',
    lordLabel: 'स्वामी:', padaLabel: 'पाद', mahadasha: 'महादशा',
    antardasha: 'अंतर्दशा', pratyantardasha: 'प्रत्यंतर्दशा',
    remaining: 'शेष', ends: 'समाप्ति',
  },
};

// Header strings
export const HEADER_LABELS: Record<Lang, {
  title: string; login: string; profile: string; backToHome: string;
}> = {
  en: { title: "Jyothishya Sanathanam", login: "Login", profile: "Profile", backToHome: "Return to Home" },
  te: { title: "జ్యోతిష్య సనాతనం", login: "లాగిన్", profile: "ప్రొఫైల్", backToHome: "హోమ్‌కు తిరిగి వెళ్లండి" },
  hi: { title: "ज्योतिष सनातनम", login: "लॉगिन", profile: "प्रोफाइल", backToHome: "होम पर वापस जाएं" },
};

// PlanetTable strings
export const PLANET_TABLE_LABELS: Record<Lang, {
  title: string; subtitle: string; insightCards: string; detailedTable: string;
  filter: string; filterPlaceholder: string; grahaCol: string; grahaPlanet: string;
  signDegrees: string; nakshatraPada: string; nakshatraLord: string; maritalImpact: string;
  placement: string; nakshatra: string; retrograde: string; ayanamsa: string; julianDay: string;
}> = {
  en: {
    title: 'Planetary Coordinates & Insights',
    subtitle: 'Key relationship significators and precise celestial placements',
    insightCards: 'Insight Cards',
    detailedTable: 'Detailed Table',
    filter: 'Filter planets or signs...',
    filterPlaceholder: 'Filter planets or signs...',
    grahaCol: 'Graha (Planet)',
    grahaPlanet: 'Graha (Planet)',
    signDegrees: 'Sign & Degrees',
    nakshatraPada: 'Nakshatra & Pada',
    nakshatraLord: 'Nakshatra Lord',
    maritalImpact: 'Marital Impact:',
    placement: 'Placement:',
    nakshatra: 'Nakshatra:',
    retrograde: 'Retrograde (Rx)',
    ayanamsa: 'Ayanamsa',
    julianDay: 'Julian Day',
  },
  te: {
    title: 'గ్రహ స్థానాలు & వివరాలు',
    subtitle: 'ముఖ్యమైన గ్రహ స్థానాలు మరియు సంబంధ సూచికలు',
    insightCards: 'వివరణ కార్డులు',
    detailedTable: 'విస్తృత పట్టిక',
    filter: 'గ్రహాలు లేదా రాశులు వెతకండి...',
    filterPlaceholder: 'గ్రహాలు లేదా రాశులు వెతకండి...',
    grahaCol: 'గ్రహం',
    grahaPlanet: 'గ్రహం',
    signDegrees: 'రాశి & డిగ్రీలు',
    nakshatraPada: 'నక్షత్రం & పాదం',
    nakshatraLord: 'నక్షత్ర అధిపతి',
    maritalImpact: 'వివాహ ప్రభావం:',
    placement: 'స్థానం:',
    nakshatra: 'నక్షత్రం:',
    retrograde: 'వక్ర గ్రహం (Rx)',
    ayanamsa: 'అయనాంశ',
    julianDay: 'జూలియన్ దినం',
  },
  hi: {
    title: 'ग्रह निर्देशांक और जानकारी',
    subtitle: 'मुख्य संबंध सूचक और सटीक ग्रहीय स्थान',
    insightCards: 'जानकारी कार्ड',
    detailedTable: 'विस्तृत तालिका',
    filter: 'ग्रह या राशि खोजें...',
    filterPlaceholder: 'ग्रह या राशि खोजें...',
    grahaCol: 'ग्रह',
    grahaPlanet: 'ग्रह',
    signDegrees: 'राशि और अंश',
    nakshatraPada: 'नक्षत्र और पाद',
    nakshatraLord: 'नक्षत्र स्वामी',
    maritalImpact: 'वैवाहिक प्रभाव:',
    placement: 'स्थान:',
    nakshatra: 'नक्षत्र:',
    retrograde: 'वक्री ग्रह (Rx)',
    ayanamsa: 'अयनांश',
    julianDay: 'जूलियन दिन',
  },
};

// TransitAnalysisView strings
export const TRANSIT_LABELS: Record<Lang, {
  title: string;
  subtitle: (lagna: string, rasi: string) => string;
  saturnTransit: string;
  sadeSatiActive: string;
  jupiterTransit: string;
  auspicious: string;
  graha: string;
  currentSignDeg: string;
  status: string;
  fromLagna: string;
  fromMoon: string;
  retrograde: string;
  direct: string;
  house: (h: number) => string;
}> = {
  en: {
    title: 'Gochara (Transit) Coordinates & Natal Impact',
    subtitle: (lagna, rasi) => `Real-time planetary transits calculated relative to your Natal Lagna (${lagna}) and Janma Rasi (${rasi})`,
    saturnTransit: 'Saturn Transit (Shani Gochara)',
    sadeSatiActive: 'Sade Sati Active',
    jupiterTransit: 'Jupiter Transit (Guru Gochara)',
    auspicious: 'Auspicious',
    graha: 'Graha',
    currentSignDeg: 'Current Sign & Degrees',
    status: 'Status',
    fromLagna: 'From Natal Lagna',
    fromMoon: 'From Janma Moon',
    retrograde: 'Retrograde (Rx)',
    direct: 'Direct',
    house: (h) => `House ${h}`,
  },
  te: {
    title: 'గోచారం (సంచారం) స్థానాలు & జన్మ కుండలి ప్రభావం',
    subtitle: (lagna, rasi) => `మీ లగ్నం (${lagna}) మరియు జన్మ రాశి (${rasi}) ఆధారంగా ప్రస్తుత గ్రహ సంచారం`,
    saturnTransit: 'శని సంచారం (శని గోచారం)',
    sadeSatiActive: 'ఏలినాటి శని సక్రియంగా ఉంది',
    jupiterTransit: 'గురుడు సంచారం (గురు గోచారం)',
    auspicious: 'శుభకరం',
    graha: 'గ్రహం',
    currentSignDeg: 'ప్రస్తుత రాశి & డిగ్రీలు',
    status: 'స్థితి',
    fromLagna: 'లగ్నం నుండి',
    fromMoon: 'చంద్రుని నుండి',
    retrograde: 'వక్ర గ్రహం (Rx)',
    direct: 'మార్గి',
    house: (h) => `${h}వ స్థానం`,
  },
  hi: {
    title: 'गोचर निर्देशांक और जन्म कुंडली प्रभाव',
    subtitle: (lagna, rasi) => `आपके लग्न (${lagna}) और जन्म राशि (${rasi}) के अनुसार वर्तमान ग्रह गोचर`,
    saturnTransit: 'शनि गोचर (शनि गोचर)',
    sadeSatiActive: 'साढ़े साती सक्रिय',
    jupiterTransit: 'गुरु गोचर',
    auspicious: 'शुभ',
    graha: 'ग्रह',
    currentSignDeg: 'वर्तमान राशि और अंश',
    status: 'स्थिति',
    fromLagna: 'लग्न से',
    fromMoon: 'चंद्र से',
    retrograde: 'वक्री ग्रह (Rx)',
    direct: 'मार्गी',
    house: (h) => `${h}वां भाव`,
  },
};

// Marriage Match strings
export const MARRIAGE_MATCH_LABELS: Record<Lang, {
  title: string; subtitle: string; tabBoy: string; tabGirl: string;
  checkBtn: string; checking: string; boyDetails: string; girlDetails: string;
  retry: string; errorTitle: string; boyChartTitle: string; girlChartTitle: string;
  editForms: string; tabRules: string; tabCharts: string; tabKuta: string;
  tabDoshas: string; savedProfiles: string; searchPlaceholder: string;
  setAsBoy: string; setAsGirl: string; activeLabel: string;
  noMaleProfiles: string; noFemaleProfiles: string;
  maleListSubtitle: string; femaleListSubtitle: string;
  boyFilled: string; girlFilled: string; fillNextGirl: string; readyToMatch: string;
}> = {
  en: {
    title: "Compatibility Check",
    subtitle: "Enter details below or select from your saved Kundalis to perform a comprehensive Ashtakoota and Dasakoota matching analysis.",
    tabBoy: "Boy's Details",
    tabGirl: "Girl's Details",
    checkBtn: "Check Compatibility",
    checking: "Calculating Astrological Alignment...",
    boyDetails: "Groom's Profile",
    girlDetails: "Bride's Profile",
    retry: "Retry Calculation",
    errorTitle: "Calculation Notice",
    boyChartTitle: "Groom's Lagna Chart (D-1)",
    girlChartTitle: "Bride's Lagna Chart (D-1)",
    editForms: "Modify Input Data",
    tabRules: "Compatibility Rules",
    tabCharts: "Birth Charts (D-1)",
    tabKuta: "Ashta Kuta Breakdown",
    tabDoshas: "Doshas & Remedies",
    savedProfiles: "Saved Profiles",
    searchPlaceholder: "Search saved profiles...",
    setAsBoy: "Set as Boy",
    setAsGirl: "Set as Girl",
    activeLabel: "Active",
    noMaleProfiles: "No saved male profiles found.",
    noFemaleProfiles: "No saved female profiles found.",
    maleListSubtitle: "Saved Male Kundalis",
    femaleListSubtitle: "Saved Female Kundalis",
    boyFilled: "Boy profile set",
    girlFilled: "Girl profile set",
    fillNextGirl: "Next: Enter Girl's Details →",
    readyToMatch: "Both profiles are ready for compatibility analysis"
  },
  hi: {
    title: "विवाह अनुकूलता मिलान",
    subtitle: "अष्टकूट और दशाकूट मिलान विश्लेषण के लिए विवरण दर्ज करें या सहेजी गई कुंडलियों में से चुनें।",
    tabBoy: "वर का विवरण",
    tabGirl: "वधू का विवरण",
    checkBtn: "अनुकूलता की जांच करें",
    checking: "ज्योतिषीय संरेखण की गणना हो रही है...",
    boyDetails: "वर प्रोफ़ाइल",
    girlDetails: "वधू प्रोफ़ाइल",
    retry: "पुनः प्रयास करें",
    errorTitle: "गणना सूचना",
    boyChartTitle: "वर लग्न कुंडली (D-1)",
    girlChartTitle: "वधू लग्न कुंडली (D-1)",
    editForms: "विवरण संपादित करें",
    tabRules: "अनुकूलता नियम",
    tabCharts: "जन्म कुंडली (D-1)",
    tabKuta: "अष्टकूट ब्रेकडाउन",
    tabDoshas: "दोष और उपचार",
    savedProfiles: "सहेजे गए प्रोफाइल",
    searchPlaceholder: "प्रोफ़ाइल खोजें...",
    setAsBoy: "वर के रूप में चुनें",
    setAsGirl: "वधू के रूप में चुनें",
    activeLabel: "सक्रिय",
    noMaleProfiles: "कोई सहेजी गई पुरुष प्रोफाइल नहीं मिली।",
    noFemaleProfiles: "कोई सहेजी गई महिला प्रोफाइल नहीं मिली।",
    maleListSubtitle: "सहेजी गई पुरुष कुंडलियां",
    femaleListSubtitle: "सहेजी गई महिला कुंडलियां",
    boyFilled: "वर प्रोफ़ाइल सेट है",
    girlFilled: "वधू प्रोफ़ाइल सेट है",
    fillNextGirl: "आगे: वधू का विवरण दर्ज करें →",
    readyToMatch: "दोनों प्रोफाइल मिलान के लिए तैयार हैं"
  },
  te: {
    title: "వివాహ పొంతన విశ్లేషణ",
    subtitle: "అష్టకూట మరియు దశకూట జాతక పొంతన విశ్లేషణ కోసం వివరాలు నమోదు చేయండి లేదా సేవ్ చేసిన ప్రొఫైల్స్ నుండి ఎంచుకోండి.",
    tabBoy: "వరుడి వివరాలు",
    tabGirl: "వధువు వివరాలు",
    checkBtn: "వివాహ అనుకూలతను తనిఖీ చేయండి",
    checking: "జాతక పొంతన తనిఖీ చేస్తున్నాము...",
    boyDetails: "వరుడి ప్రొఫైల్",
    girlDetails: "వధువు ప్రొఫైల్",
    retry: "మళ్లీ ప్రయత్నించండి",
    errorTitle: "లోపం సమాచారం",
    boyChartTitle: "వరుడి లగ్న కుండలి (D-1)",
    girlChartTitle: "వధువు లగ్న కుండలి (D-1)",
    editForms: "వివరాలను సవరించండి",
    tabRules: "అనుకూలత సూత్రాలు",
    tabCharts: "జాతక చక్రాలు (D-1)",
    tabKuta: "అష్టకూట విశ్లేషణ",
    tabDoshas: "దోషాలు & పరిహారాలు",
    savedProfiles: "సేవ్ చేసిన ప్రొఫైల్స్",
    searchPlaceholder: "ప్రొఫైల్స్ వెతకండి...",
    setAsBoy: "వరుడిగా ఎంచుకోండి",
    setAsGirl: "వధువుగా ఎంచుకోండి",
    activeLabel: "ఎంచుకోబడింది",
    noMaleProfiles: "సేవ్ చేసిన పురుషుల ప్రొఫైల్స్ లేవు.",
    noFemaleProfiles: "సేవ్ చేసిన మహిళల ప్రొఫైల్స్ లేవు.",
    maleListSubtitle: "సేవ్ చేసిన పురుషుల జాతకాలు",
    femaleListSubtitle: "సేవ్ చేసిన మహిళల జాతకాలు",
    boyFilled: "వరుడి వివరాలు పూర్తయ్యాయి",
    girlFilled: "వధువు వివరాలు పూర్తయ్యాయి",
    fillNextGirl: "తరువాత: వధువు వివరాలు నమోదు చేయండి →",
    readyToMatch: "రెండు ప్రొఫైల్స్ పొంతన విశ్లేషణకు సిద్ధంగా ఉన్నాయి"
  }
};

// Profile Page strings
export const PROFILE_LABELS: Record<Lang, {
  title: string;
  userAccount: string;
  offlineMode: string;
  signOut: string;
  googleSignIn: string;
  cloudSyncTitle: string;
  cloudSyncDesc: string;
  syncVedicMd: string;
  syncProfiles: string;
  syncing: string;
  connectedUpToDate: (count: number) => string;
  connectedLocal: (count: number) => string;
  savedBirthProfiles: string;
  savedProfilesSubtitle: string;
  newProfile: string;
  searchPlaceholder: string;
  all: string;
  male: string;
  female: string;
  noProfilesFound: string;
  view: string;
  edit: string;
  delete: string;
  appPreferences: string;
  defaultLanguage: string;
  defaultChartStyle: string;
  exportBackup: string;
  resetData: string;
}> = {
  en: {
    title: "Profile Management",
    userAccount: "User Account",
    offlineMode: "Local Offline Mode (Google Login Available)",
    signOut: "Sign Out",
    googleSignIn: "Google Sign In",
    cloudSyncTitle: "Google Drive Cloud Sync",
    cloudSyncDesc: "Centralized sync status for all saved birth charts & reports",
    syncVedicMd: "Sync Vedic Charts (.md)",
    syncProfiles: "Sync Profiles",
    syncing: "Syncing...",
    connectedUpToDate: (count) => `Connected & Up to Date (${count} Charts Synced)`,
    connectedLocal: (count) => `Connected to Google Drive · ${count} Charts Available`,
    savedBirthProfiles: "Saved Birth Profiles",
    savedProfilesSubtitle: "Centralized local & cloud profiles for all modules",
    newProfile: "New Profile",
    searchPlaceholder: "Search profiles by name or place...",
    all: "All",
    male: "Male",
    female: "Female",
    noProfilesFound: "No profiles found matching your search.",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    appPreferences: "App Preferences",
    defaultLanguage: "Default Language",
    defaultChartStyle: "Default Chart Style",
    exportBackup: "Export All Profiles (JSON)",
    resetData: "Clear All Local Data & Reset",
  },
  te: {
    title: "ప్రొఫైల్ నిర్వహణ",
    userAccount: "యూజర్ ఖాతా",
    offlineMode: "లోకల్ మోడ్ (గూగుల్ లాగిన్ అందుబాటులో ఉంది)",
    signOut: "లాగ్ అవుట్",
    googleSignIn: "గూగుల్ లాగిన్",
    cloudSyncTitle: "గూగుల్ డ్రైవ్ క్లౌడ్ సింక్",
    cloudSyncDesc: "అన్ని జాతక కుండలులు మరియు నివేదికల కేంద్రీకృత సింక్ స్థితి",
    syncVedicMd: "వేద చార్ట్లు సింక్ చేయండి (.md)",
    syncProfiles: "ప్రొఫైల్స్ సింక్",
    syncing: "సింక్ అవుతోంది...",
    connectedUpToDate: (count) => `కనెక్ట్ అయింది & అప్‌డేట్ చేయబడింది (${count} చార్ట్లు సింక్ చేయబడ్డాయి)`,
    connectedLocal: (count) => `గూగుల్ డ్రైవ్‌కు కనెక్ట్ అయింది · ${count} చార్ట్లు అందుబాటులో ఉన్నాయి`,
    savedBirthProfiles: "సేవ్ చేసిన జన్మ ప్రొఫైల్స్",
    savedProfilesSubtitle: "అన్ని విభాగాల కోసం కేంద్రీకృత ప్రొఫైల్స్",
    newProfile: "కొత్త ప్రొఫైల్",
    searchPlaceholder: "పేరు లేదా స్థానం ద్వారా వెతకండి...",
    all: "అన్నీ",
    male: "పురుషుడు",
    female: "మహిళ",
    noProfilesFound: "మీ వెతుకులాటకు సరిపోలే ప్రొఫైల్స్ ఏవీ కనుగొనబడలేదు.",
    view: "చూడండి",
    edit: "సవరించు",
    delete: "తొలగించు",
    appPreferences: "యాప్ సెట్టింగ్స్",
    defaultLanguage: "డిఫాల్ట్ భాష",
    defaultChartStyle: "డిఫాల్ట్ చార్ట్ శైలి",
    exportBackup: "ప్రొఫైల్స్ బ్యాకప్ తీసుకోండి (JSON)",
    resetData: "డేటా మొత్తం రీసెట్ చేయండి",
  },
  hi: {
    title: "प्रोफ़ाइल प्रबंधन",
    userAccount: "उपयोगकर्ता खाता",
    offlineMode: "स्थानीय ऑफ़लाइन मोड (गूगल लॉगिन उपलब्ध)",
    signOut: "साइन आउट",
    googleSignIn: "गूगल साइन इन",
    cloudSyncTitle: "गूगल ड्राइव क्लाउड सिंक",
    cloudSyncDesc: "सभी सहेजी गई जन्म कुंडलियों और रिपोर्टों की स्थिति",
    syncVedicMd: "वैदिक चार्ट सिंक करें (.md)",
    syncProfiles: "प्रोफ़ाइल सिंक करें",
    syncing: "सिंक हो रहा है...",
    connectedUpToDate: (count) => `कनेक्टेड और अद्यतित (${count} चार्ट सिंक)`,
    connectedLocal: (count) => `गूगल ड्राइव से जुड़ा · ${count} चार्ट उपलब्ध`,
    savedBirthProfiles: "सहेजे गए जन्म प्रोफाइल",
    savedProfilesSubtitle: "सभी मॉड्यूल के लिए केंद्रीकृत प्रोफाइल",
    newProfile: "नई प्रोफ़ाइल",
    searchPlaceholder: "नाम या स्थान से खोजें...",
    all: "सभी",
    male: "पुरुष",
    female: "महिला",
    noProfilesFound: "कोई प्रोफ़ाइल नहीं मिली।",
    view: "देखें",
    edit: "संपादित करें",
    delete: "हटाएं",
    appPreferences: "ऐप प्राथमिकताएं",
    defaultLanguage: "डिफ़ॉल्ट भाषा",
    defaultChartStyle: "डिफ़ॉल्ट चार्ट शैली",
    exportBackup: "सभी प्रोफाइल बैकअप लें (JSON)",
    resetData: "सभी डेटा साफ़ करें और रीसेट करें",
  },
};

// Kundali Page strings
export const KUNDALI_LABELS: Record<Lang, {
  newKundali: string;
  enterBirthDetails: string;
  generate: string;
  savedProfiles: string;
  profileSingular: string;
  profilePlural: string;
  active: string;
  viewChart: string;
  deleteProfile: string;
  noSavedKundalis: string;
  unknownPlace: string;
}> = {
  en: {
    newKundali: "New Kundali",
    enterBirthDetails: "Enter birth details for precise calculation.",
    generate: "Generate",
    savedProfiles: "Saved Profiles",
    profileSingular: "Profile",
    profilePlural: "Profiles",
    active: "Active",
    viewChart: "View Chart",
    deleteProfile: "Delete Profile",
    noSavedKundalis: "No saved Kundalis yet. Fill in the form above to generate your first chart.",
    unknownPlace: "Unknown",
  },
  te: {
    newKundali: "కొత్త కుండలి",
    enterBirthDetails: "ఖచ్చితమైన గణనల కోసం పుట్టిన వివరాలు నమోదు చేయండి.",
    generate: "రూపొందించు",
    savedProfiles: "సేవ్ చేసిన ప్రొఫైల్స్",
    profileSingular: "ప్రొఫైల్",
    profilePlural: "ప్రొఫైల్స్",
    active: "ఎంచుకోబడింది",
    viewChart: "చార్ట్ చూడండి",
    deleteProfile: "ప్రొఫైల్ తొలగించు",
    noSavedKundalis: "ఇంకా సేవ్ చేసిన కుండలిలు లేవు. పై ఫారమ్‌ను పూరించి మీ మొదటి చార్ట్‌ను రూపొందించండి.",
    unknownPlace: "తెలియదు",
  },
  hi: {
    newKundali: "नई कुंडली",
    enterBirthDetails: "सटीक गणना के लिए जन्म विवरण दर्ज करें।",
    generate: "बनाएं",
    savedProfiles: "सहेजे गए प्रोफाइल",
    profileSingular: "प्रोफ़ाइल",
    profilePlural: "प्रोफाइल",
    active: "सक्रिय",
    viewChart: "चार्ट देखें",
    deleteProfile: "प्रोफ़ाइल हटाएं",
    noSavedKundalis: "अभी तक कोई सहेजी गई कुंडली नहीं है। पहला चार्ट बनाने के लिए ऊपर दिए गए फॉर्म को भरें।",
    unknownPlace: "अज्ञात",
  },
};

// Chant strings
export const CHANT_LABELS: Record<Lang, {
  title: string;
  subtitle: string;
  sanskritVerse: string;
  linesLimit: string;
  copy: string;
  copied: string;
  clear: string;
  versePlaceholder: string;
  advancedSettings: string;
  show: string;
  hide: string;
  meterChandas: string;
  acousticSeed: string;
  generateChant: string;
  generating: string;
  synthesizing: string;
  chantIt: string;
  synthesisNotice: string;
  chantRenderedSuccess: string;
  highFidelityMaster: string;
  downloadWav: string;
  rerender: string;
  presetShlokas: string;
  classicalVerses: string;
  emptyError: string;
  playAudio: string;
  downloadAudio: string;
  selectMeter: string;
  sampleVerses: string;
}> = {
  en: {
    title: "Vedic Chant Studio",
    subtitle: "Sacred Sanskrit recitation synthesized with classical Vedic prosody",
    sanskritVerse: "Sanskrit Verse (Devanagari)",
    linesLimit: "(1–4 lines)",
    copy: "Copy",
    copied: "Copied",
    clear: "Clear",
    versePlaceholder: "Paste your Sanskrit shloka in Devanagari script...\ne.g.\nयदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
    advancedSettings: "Advanced Settings",
    show: "Show",
    hide: "Hide",
    meterChandas: "Meter (Chandas)",
    acousticSeed: "Acoustic Seed",
    generateChant: "Generate Sacred Recitation",
    generating: "Synthesizing Audio...",
    synthesizing: "Synthesizing Chant...",
    chantIt: "🎧 Chant It (Render Audio)",
    synthesisNotice: "Synthesis Notice:",
    chantRenderedSuccess: "Chant Rendered Successfully",
    highFidelityMaster: "24kHz High-Fidelity Master",
    downloadWav: "Download WAV File",
    rerender: "Re-render",
    presetShlokas: "📜 Preset Shlokas",
    classicalVerses: "Classical verses",
    emptyError: "Please paste or enter a Sanskrit shloka in Devanagari.",
    playAudio: "Play Audio",
    downloadAudio: "Download WAV",
    selectMeter: "Select Chandas (Meter)",
    sampleVerses: "Sample Sacred Verses",
  },
  te: {
    title: "వేద మంత్ర పఠన కేంద్రం",
    subtitle: "శాస్త్రీయ ఛందస్సుతో కూడిన పవిత్ర సంస్కృత శ్లోక పఠనం",
    sanskritVerse: "సంస్కృత శ్లోకం (దేవనాగరి)",
    linesLimit: "(1–4 పంక్తులు)",
    copy: "కాపీ",
    copied: "కాపీ చేయబడింది",
    clear: "తుడిచివేయి",
    versePlaceholder: "మీ సంస్కృత శ్లోకాన్ని దేవనాగరి లిపిలో నమోదు చేయండి...\nఉదా:\nयदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
    advancedSettings: "అధునాతన సెట్టింగులు",
    show: "చూపించు",
    hide: "దాచు",
    meterChandas: "ఛందస్సు (Chandas)",
    acousticSeed: "ధ్వని బీజం (Seed)",
    generateChant: "పఠనాన్ని రూపొందించండి",
    generating: "ఆడియో తయారవుతోంది...",
    synthesizing: "శ్లోకం శ్రావ్యంగా రూపొందుతోంది...",
    chantIt: "🎧 పఠించండి (ఆడియో సృష్టించు)",
    synthesisNotice: "పఠన సూచన:",
    chantRenderedSuccess: "శ్లోకం విజయవంతంగా రూపొందింది",
    highFidelityMaster: "24kHz హై-ఫిడిలిటీ మాస్టర్",
    downloadWav: "WAV ఫైల్ డౌన్‌లోడ్ చేయండి",
    rerender: "మళ్ళీ రూపొందించు",
    presetShlokas: "📜 సిద్ధంగా ఉన్న శ్లోకాలు",
    classicalVerses: "ప్రాచీన శ్లోకాలు",
    emptyError: "దయచేసి దేవనాగరి లిపిలో సంస్కృత శ్లోకాన్ని నమోదు చేయండి.",
    playAudio: "ఆడియో ప్లే చేయండి",
    downloadAudio: "WAV డౌన్‌లోడ్ చేయండి",
    selectMeter: "ఛందస్సును ఎంచుకోండి",
    sampleVerses: "పవిత్ర శ్లోకాల నమూనాలు",
  },
  hi: {
    title: "वैदिक मंत्र पाठ स्टूडियो",
    subtitle: "शास्त्रीय छंद और वैदिक स्वर के साथ पवित्र संस्कृत पाठ",
    sanskritVerse: "संस्कृत श्लोक (देवनागरी)",
    linesLimit: "(1–4 पंक्तियाँ)",
    copy: "कॉपी",
    copied: "कॉपी किया",
    clear: "हटाएं",
    versePlaceholder: "देवनागरी लिपि में अपना संस्कृत श्लोक पेस्ट या टाइप करें...\nउदा:\nयदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
    advancedSettings: "उन्नत सेटिंग्स",
    show: "दिखाएं",
    hide: "छिपाएं",
    meterChandas: "छंद (Chandas)",
    acousticSeed: "ध्वनि बीज (Seed)",
    generateChant: "पवित्र पाठ उत्पन्न करें",
    generating: "ऑडियो तैयार हो रहा है...",
    synthesizing: "मंत्र का उच्चारण तैयार हो रहा है...",
    chantIt: "🎧 पाठ करें (ऑडियो बनाएं)",
    synthesisNotice: "उच्चारण सूचना:",
    chantRenderedSuccess: "पाठ सफलतापूर्वक तैयार हुआ",
    highFidelityMaster: "24kHz उच्च-गुणवत्ता मास्टर",
    downloadWav: "WAV फ़ाइल डाउनलोड करें",
    rerender: "पुनः उत्पन्न करें",
    presetShlokas: "📜 प्रसिद्ध श्लोक",
    classicalVerses: "शास्त्रीय श्लोक",
    emptyError: "कृपया देवनागरी में संस्कृत श्लोक दर्ज करें।",
    playAudio: "ऑडियो सुनें",
    downloadAudio: "WAV डाउनलोड करें",
    selectMeter: "छंद चुनें",
    sampleVerses: "पवित्र श्लोक उदाहरण",
  },
};

// Login strings
export const LOGIN_LABELS: Record<Lang, {
  tagline: string;
  title: string;
  subtitle: string;
  signedInSuccess: string;
  goToHome: string;
  signOut: string;
  description: string;
  secureSync: string;
  kutaMatching: string;
  back: string;
}> = {
  en: {
    tagline: "Vedic Astrology Engine",
    title: "JYOTHISHYA SANATHANAM",
    subtitle: "Marriage Compatibility & Horoscope Matching",
    signedInSuccess: "Signed In Successfully",
    goToHome: "Go to Home Dashboard",
    signOut: "Sign Out",
    description: "Sign in with your Google account to save birth profiles, calculate Ashta Kuta compatibility, and sync reports securely.",
    secureSync: "Secure Cloud Sync",
    kutaMatching: "36 Kuta Matching",
    back: "Back",
  },
  te: {
    tagline: "వేద జ్యోతిష్య వ్యవస్థ",
    title: "జ్యోతిష్య సనాతనం",
    subtitle: "వివాహ పొంతన & జాతక విశ్లేషణ",
    signedInSuccess: "విజయవంతంగా లాగిన్ అయ్యారు",
    goToHome: "హోమ్ డ్యాష్‌బోర్డ్‌కు వెళ్లండి",
    signOut: "లాగ్ అవుట్",
    description: "జన్మ ప్రొఫైల్స్ సేవ్ చేయడానికి, అష్టకూట పొంతన లెక్కించడానికి మరియు రిపోర్ట్‌లను క్లౌడ్‌లో సురక్షితంగా ఉంచడానికి గూగుల్ ఖాతాతో లాగిన్ అవ్వండి.",
    secureSync: "సురక్షిత క్లౌడ్ సింక్",
    kutaMatching: "36 కూట పొంతన",
    back: "వెనుకకు",
  },
  hi: {
    tagline: "वैदिक ज्योतिष इंजन",
    title: "ज्योतिष सनातनम",
    subtitle: "विवाह अनुकूलता और कुंडली मिलान",
    signedInSuccess: "सफलतापूर्वक साइन इन हुआ",
    goToHome: "होम डैशबोर्ड पर जाएं",
    signOut: "साइन आउट",
    description: "जन्म प्रोफाइल सहेजने, अष्टकूट अनुकूलता की गणना करने और रिपोर्ट सुरक्षित रूप से सिंक करने के लिए अपने Google खाते से साइन इन करें।",
    secureSync: "सुरक्षित क्लाउड सिंक",
    kutaMatching: "36 कूट मिलान",
    back: "वापस",
  },
};

// ─── Chart & Panchangam Localization Collections ─────────────────────────────

export const PLANET_ABBREVIATIONS_I18N: Record<Lang, Record<string, string>> = {
  en: {
    Ascendant: 'Asc',
    Lagna: 'Asc',
    Sun: 'Su',
    Moon: 'Mo',
    Mars: 'Ma',
    Mercury: 'Me',
    Jupiter: 'Ju',
    Venus: 'Ve',
    Saturn: 'Sa',
    Rahu: 'Ra',
    Ketu: 'Ke',
  },
  te: {
    Ascendant: 'లగ్',
    Lagna: 'లగ్',
    Sun: 'రవి',
    Moon: 'చం',
    Mars: 'కు',
    Mercury: 'బు',
    Jupiter: 'గు',
    Venus: 'శు',
    Saturn: 'శని',
    Rahu: 'రా',
    Ketu: 'కే',
  },
  hi: {
    Ascendant: 'लग्न',
    Lagna: 'लग्न',
    Sun: 'सूर्य',
    Moon: 'चंद्र',
    Mars: 'मंगल',
    Mercury: 'बुध',
    Jupiter: 'गुरु',
    Venus: 'शुक्र',
    Saturn: 'शनि',
    Rahu: 'राहु',
    Ketu: 'केतु',
  },
};

export const SIGN_CODES_I18N: Record<Lang, Record<string, string>> = {
  en: {
    Aries: 'ARI',
    Taurus: 'TAU',
    Gemini: 'GEM',
    Cancer: 'CAN',
    Leo: 'LEO',
    Virgo: 'VIR',
    Libra: 'LIB',
    Scorpio: 'SCO',
    Sagittarius: 'SAG',
    Capricorn: 'CAP',
    Aquarius: 'AQU',
    Pisces: 'PIS',
  },
  te: {
    Aries: 'మేష',
    Taurus: 'వృష',
    Gemini: 'మిథు',
    Cancer: 'కర్క',
    Leo: 'సింహ',
    Virgo: 'కన్య',
    Libra: 'తుల',
    Scorpio: 'వృశ్చి',
    Sagittarius: 'ధను',
    Capricorn: 'మకర',
    Aquarius: 'కుంభ',
    Pisces: 'మీన',
  },
  hi: {
    Aries: 'मेष',
    Taurus: 'वृष',
    Gemini: 'मिथुन',
    Cancer: 'कर्क',
    Leo: 'सिंह',
    Virgo: 'कन्या',
    Libra: 'तुला',
    Scorpio: 'वृश्चिक',
    Sagittarius: 'धनु',
    Capricorn: 'मकर',
    Aquarius: 'कुंभ',
    Pisces: 'मीन',
  },
};

export const SIGN_NAMES_I18N: Record<Lang, Record<string, string>> = {
  en: {
    Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer',
    Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio',
    Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces',
  },
  te: {
    Aries: 'మేషం', Taurus: 'వృషభం', Gemini: 'మిథునం', Cancer: 'కర్కాటకం',
    Leo: 'సింహం', Virgo: 'కన్య', Libra: 'తుల', Scorpio: 'వృశ్చికం',
    Sagittarius: 'ధనుస్సు', Capricorn: 'మకరం', Aquarius: 'కుంభం', Pisces: 'మీనం',
  },
  hi: {
    Aries: 'मेष', Taurus: 'वृषभ', Gemini: 'मिथुन', Cancer: 'कर्क',
    Leo: 'सिंह', Virgo: 'कन्या', Libra: 'तुला', Scorpio: 'वृश्चिक',
    Sagittarius: 'धनु', Capricorn: 'मकर', Aquarius: 'कुंभ', Pisces: 'मीन',
  },
};

export const PLANET_NAMES_I18N: Record<Lang, Record<string, string>> = {
  en: {
    Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury',
    Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu',
    Ascendant: 'Ascendant', Lagna: 'Lagna',
  },
  te: {
    Sun: 'సూర్యుడు', Moon: 'చంద్రుడు', Mars: 'కుజుడు', Mercury: 'బుధుడు',
    Jupiter: 'గురుడు', Venus: 'శుక్రుడు', Saturn: 'శని', Rahu: 'రాహువు', Ketu: 'కేతువు',
    Ascendant: 'లగ్నం', Lagna: 'లగ్నం',
  },
  hi: {
    Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
    Ascendant: 'लग्न', Lagna: 'लग्न',
  },
};

export const ELEMENT_NAMES_I18N: Record<Lang, Record<string, string>> = {
  en: { Fire: 'Fire', Earth: 'Earth', Air: 'Air', Water: 'Water' },
  te: { Fire: 'అగ్ని తత్త్వం', Earth: 'భూ తత్త్వం', Air: 'వాయు తత్త్వం', Water: 'జల తత్త్వం' },
  hi: { Fire: 'अग्नि तत्व', Earth: 'पृथ्वी तत्व', Air: 'वायु तत्व', Water: 'जल तत्व' },
};

export const CHART_LABELS: Record<Lang, {
  south: string;
  north: string;
  east: string;
  southIndian: string;
  northIndian: string;
  eastIndian: string;
  chartFormat: string;
  live: string;
  d1Title: string;
  d1Subtitle: string;
  transitTitle: string;
  transitSubtitle: string;
  d9Title: string;
  d9Subtitle: string;
  rasiD1: string;
  navamsaD9: string;
  gochara: string;
  lagnaPrefix: string;
  housePrefix: string;
  noPlanetsInSign: string;
  dismiss: string;
  rasiWord: string;
  allTriple: string;
  tabD1: string;
  tabTransit: string;
  tabD9: string;
}> = {
  en: {
    south: 'South',
    north: 'North',
    east: 'East',
    southIndian: 'South Indian',
    northIndian: 'North Indian',
    eastIndian: 'East Indian',
    chartFormat: 'Chart Format:',
    live: 'LIVE',
    d1Title: 'D1 Rasi Natal Chart',
    d1Subtitle: 'Lagna Chart • Physical Incarnation & Lifelong Blueprint',
    transitTitle: 'Live Gochara Transit Chart',
    transitSubtitle: 'Real-Time Planetary Transits • Current Sky Position',
    d9Title: 'D9 Navamsha Chart',
    d9Subtitle: '9th Harmonic Division • Dharma, Inner Soul Strength & Marital Harmony',
    rasiD1: 'RASI (D1)',
    navamsaD9: 'NAVAMSA (D9)',
    gochara: 'GOCHARA',
    lagnaPrefix: 'Lagna:',
    housePrefix: 'H',
    noPlanetsInSign: 'No planets in this sign',
    dismiss: 'Dismiss',
    rasiWord: 'Rasi',
    allTriple: 'All 3 Triple Charts (D1, Transit, D9)',
    tabD1: 'D1 Rasi',
    tabTransit: 'Transit (Gochara)',
    tabD9: 'D9 Navamsha',
  },
  te: {
    south: 'దక్షిణ',
    north: 'ఉత్తర',
    east: 'తూర్పు',
    southIndian: 'దక్షిణ భారత',
    northIndian: 'ఉత్తర భారత',
    eastIndian: 'తూర్పు భారత',
    chartFormat: 'చార్ట్ పద్ధతి:',
    live: 'ప్రత్యక్షం',
    d1Title: 'D1 రాశి జన్మ కుండలి',
    d1Subtitle: 'లగ్న కుండలి • శారీరక స్వరూపం & సమగ్ర జీవిత పథం',
    transitTitle: 'ప్రత్యక్ష గోచార కుండలి',
    transitSubtitle: 'ప్రస్తుత గ్రహ సంచారం • ఖగోళ ప్రత్యక్ష స్థితి',
    d9Title: 'D9 నవాంశ కుండలి',
    d9Subtitle: 'నవాంశ 9వ భాగం • ధర్మం, ఆత్మ బలం & దాంపత్య సామరస్యం',
    rasiD1: 'రాశి (D1)',
    navamsaD9: 'నవాంశ (D9)',
    gochara: 'గోచారం',
    lagnaPrefix: 'లగ్నం:',
    housePrefix: 'భావం ',
    noPlanetsInSign: 'ఈ రాశిలో గ్రహాలు లేవు',
    dismiss: 'తీసివేయి',
    rasiWord: 'రాశి',
    allTriple: '3 చార్ట్లు (D1, గోచారం, D9)',
    tabD1: 'D1 రాశి',
    tabTransit: 'గోచారం',
    tabD9: 'D9 నవాంశ',
  },
  hi: {
    south: 'दक्षिण',
    north: 'उत्तर',
    east: 'पूर्व',
    southIndian: 'दक्षिण भारतीय',
    northIndian: 'उत्तर भारतीय',
    eastIndian: 'पूर्वी भारतीय',
    chartFormat: 'चार्ट प्रारूप:',
    live: 'लाइव',
    d1Title: 'D1 राशि जन्म कुंडली',
    d1Subtitle: 'लग्न कुंडली • शारीरिक स्वरूप एवं समग्र जीवन पथ',
    transitTitle: 'लाइव गोचर कुंडली',
    transitSubtitle: 'वास्तविक समय ग्रह गोचर • वर्तमान आकाशीय स्थिति',
    d9Title: 'D9 नवांश कुंडली',
    d9Subtitle: 'नवांश 9वां विभाग • धर्म, आत्मिक बल एवं दांपत्य सामंजस्य',
    rasiD1: 'राशि (D1)',
    navamsaD9: 'नवांश (D9)',
    gochara: 'गोचर',
    lagnaPrefix: 'लग्न:',
    housePrefix: 'भाव ',
    noPlanetsInSign: 'इस राशि में कोई ग्रह नहीं हैं',
    dismiss: 'हटाएं',
    rasiWord: 'राशि',
    allTriple: 'तीनों चार्ट (D1, गोचर, D9)',
    tabD1: 'D1 राशि',
    tabTransit: 'गोचर',
    tabD9: 'D9 नवांश',
  },
};

export const PANCHANGAM_PAGE_STRINGS: Record<Lang, {
  headerTitle: string;
  liveBadge: string;
  todayBtn: string;
  prevDay: string;
  nextDay: string;
  almanacTitle: string;
  ayana: string;
  ritu: string;
  suryaRasi: string;
  chandraRasi: string;
  transitChartHeader: string;
  transitAyanamsha: string;
  transitForPrefix: string;
  sunSuffix: string;
  planetaryTransitsTitle: string;
  chandraPrefix: string;
  hMoonPrefix: string;
  supportive: string;
  challenging: string;
  neutral: string;
  limbsSectionTitle: string;
  tithiTitle: string;
  tithiDesc: string;
  pakshaLabel: string;
  vaaraTitle: string;
  vaaraDesc: string;
  solarDay: string;
  dayLordLabel: string;
  nakshatraTitle: string;
  nakshatraDesc: string;
  padaLabel: string;
  starLordLabel: string;
  yogaTitle: string;
  yogaDesc: string;
  categoryLabel: string;
  shubhaYoga: string;
  karanaTitle: string;
  karanaDesc: string;
  halfTithi: string;
  typeLabel: string;
  charaKarana: string;
  solarLunarTitle: string;
  solarLunarDesc: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  shubhaSamayamTitle: string;
  shubhaSamayamDesc: string;
  ashubhaSamayamTitle: string;
  ashubhaSamayamDesc: string;
  abhijitTitle: string;
  abhijitDesc: string;
  amritTitle: string;
  amritDesc: string;
  brahmaTitle: string;
  brahmaDesc: string;
  rahuTitle: string;
  rahuDesc: string;
  yamagandamTitle: string;
  yamagandamDesc: string;
  gulikaTitle: string;
  gulikaDesc: string;
  durmuhurthamTitle: string;
  durmuhurthamDesc: string;
  choghadiyaTitle: string;
  choghadiyaDesc: string;
  dayChoghadiya: string;
  nightChoghadiya: string;
  dinaHoraTitle: string;
  dinaHoraDesc: string;
  horaWord: string;
  auspicious: string;
  inauspicious: string;
  signLord: string;
  signElement: string;
  transitingInSign: string;
  noPlanetsInSign: string;
  degreeLabel: string;
  fromMoon: string;
  closeBtn: string;
}> = {
  en: {
    headerTitle: "Panchangam & Transit Chart",
    liveBadge: "Live Gochara",
    todayBtn: "Today",
    prevDay: "Prev Day",
    nextDay: "Next Day",
    almanacTitle: "Vedic Almanac • Daily Cosmic Energies",
    ayana: "Ayana",
    ritu: "Ritu",
    suryaRasi: "Surya Rasi",
    chandraRasi: "Chandra Rasi",
    transitChartHeader: "Gochara Chakra (Transit Chart)",
    transitAyanamsha: "Lahiri Ayanamsha • Ephemeris Ground Truth",
    transitForPrefix: "TRANSIT FOR",
    sunSuffix: "Sun",
    planetaryTransitsTitle: "Planetary Transit Positions",
    chandraPrefix: "Chandra:",
    hMoonPrefix: "H{n} Moon",
    supportive: "Supportive",
    challenging: "Challenging",
    neutral: "Neutral",
    limbsSectionTitle: "The Five Sacred Limbs (Pancha-Anga)",
    tithiTitle: "1. Tithi (Lunar Phase)",
    tithiDesc: "Lunar phase determining auspicious energy for rites and daily ceremonies.",
    pakshaLabel: "Paksha:",
    vaaraTitle: "2. Vaara (Solar Day)",
    vaaraDesc: "Governed by primary planetary energy.",
    solarDay: "Solar Day",
    dayLordLabel: "Day Lord:",
    nakshatraTitle: "3. Nakshatra (Lunar Mansion)",
    nakshatraDesc: "Lunar constellation steering emotional mind and subconscious instincts.",
    padaLabel: "Pada",
    starLordLabel: "Star Lord:",
    yogaTitle: "4. Yoga (Solar-Lunar Alignment)",
    yogaDesc: "Harmonious mathematical combination of solar and lunar longitudes.",
    categoryLabel: "Category:",
    shubhaYoga: "Auspicious (Shubha Yoga)",
    karanaTitle: "5. Karana (Half Lunar Phase)",
    karanaDesc: "Active division of lunar energy shaping the fruition of immediate deeds.",
    halfTithi: "Half-Tithi",
    typeLabel: "Type:",
    charaKarana: "Chara Karana",
    solarLunarTitle: "Solar & Lunar Timings",
    solarLunarDesc: "Precise astronomical dawn, dusk, moonrise, and moonset markers.",
    sunrise: "Sunrise",
    sunset: "Sunset",
    moonrise: "Moonrise",
    moonset: "Moonset",
    shubhaSamayamTitle: "Shubha Samayam (Auspicious Timings)",
    shubhaSamayamDesc: "Favorable celestial windows for starting ventures, travels, and pujas.",
    ashubhaSamayamTitle: "Ashubha Samayam (Inauspicious Timings)",
    ashubhaSamayamDesc: "Inauspicious intervals to be avoided for new beginnings and signatures.",
    abhijitTitle: "Abhijit Muhurtham",
    abhijitDesc: "Most auspicious midday window; eliminates all doshas.",
    amritTitle: "Amrit Kalam",
    amritDesc: "Nectar time for success in high-priority works.",
    brahmaTitle: "Brahma Muhurtham",
    brahmaDesc: "Pre-dawn window ideal for meditation and spiritual focus.",
    rahuTitle: "Rahu Kalam",
    rahuDesc: "Avoid purchasing new assets or starting contracts.",
    yamagandamTitle: "Yamagandam",
    yamagandamDesc: "Associated with loss of energy and unwarranted delays.",
    gulikaTitle: "Gulika Kalam",
    gulikaDesc: "Saturnian influence; repetition of initial results.",
    durmuhurthamTitle: "Durmuhurtham",
    durmuhurthamDesc: "Malefic time slot of the day.",
    choghadiyaTitle: "Choghadiya Muhurthas",
    choghadiyaDesc: "Traditional 8-part daytime and 8-part nighttime Vedic action guide.",
    dayChoghadiya: "Day Choghadiya (Sunrise to Sunset)",
    nightChoghadiya: "Night Choghadiya (Sunset to Sunrise)",
    dinaHoraTitle: "Dina Hora (24 Planetary Hours)",
    dinaHoraDesc: "Successive planetary rulers governing each hour of the solar day and night.",
    horaWord: "Hora",
    auspicious: "Auspicious",
    inauspicious: "Inauspicious",
    signLord: "Lord:",
    signElement: "Element:",
    transitingInSign: "Transiting Planets in this Sign:",
    noPlanetsInSign: "No planets currently transiting in this sign.",
    degreeLabel: "Degree:",
    fromMoon: "from Moon",
    closeBtn: "Close",
  },
  te: {
    headerTitle: "పంచాంగం & గోచార చక్రం",
    liveBadge: "ప్రత్యక్ష గోచారం",
    todayBtn: "నేడు",
    prevDay: "నిన్న",
    nextDay: "రేపు",
    almanacTitle: "వైదిక దిన పంచాంగ విశేషాలు",
    ayana: "ఆయనం",
    ritu: "ఋతువు",
    suryaRasi: "సూర్య రాశి",
    chandraRasi: "చంద్ర రాశి",
    transitChartHeader: "గోచార చక్రం (గ్రహ సంచార కుండలి)",
    transitAyanamsha: "లాహిరి అయనాంశ • ఖగోళ ప్రత్యక్ష గణన",
    transitForPrefix: "గోచారం:",
    sunSuffix: "రవి",
    planetaryTransitsTitle: "గ్రహ సంచార స్థానాలు",
    chandraPrefix: "చంద్రుడు:",
    hMoonPrefix: "చంద్రుని నుండి {n}వ భావం",
    supportive: "అనుకూలం",
    challenging: "ప్రతికూలం",
    neutral: "సమం",
    limbsSectionTitle: "పంచాంగ ప్రధానాంగాలు (పంచాంగం)",
    tithiTitle: "1. తిథి",
    tithiDesc: "పూజలు, శుభకార్యాల ఆరంభానికి అనుకూలమైన చంద్ర తిథి.",
    pakshaLabel: "పక్షం:",
    vaaraTitle: "2. వారం",
    vaaraDesc: "ఆధిపత్య గ్రహ శక్తులచే నడపబడే సౌర దినం.",
    solarDay: "సౌర దినం",
    dayLordLabel: "వారాధిపతి:",
    nakshatraTitle: "3. నక్షత్రం",
    nakshatraDesc: "మనస్సు మరియు అంతఃచేతనను నడిపించే చంద్ర నక్షత్రం.",
    padaLabel: "పాదం",
    starLordLabel: "నక్షత్రాధిపతి:",
    yogaTitle: "4. యోగం",
    yogaDesc: "సూర్య చంద్రుల రేఖాంశాల కలయికతో ఏర్పడే యోగం.",
    categoryLabel: "వర్గం:",
    shubhaYoga: "శుభ యోగం",
    karanaTitle: "5. కరణం",
    karanaDesc: "చేసే కార్యాల సత్వర ఫలితాలను నిర్దేశించే తిథి అర్ధభాగం.",
    halfTithi: "అర్ధ-తిథి",
    typeLabel: "రకం:",
    charaKarana: "చర కరణం",
    solarLunarTitle: "సూర్యోదయ & చంద్రాస్తమయ సమయాలు",
    solarLunarDesc: "ఖచ్చితమైన సూర్యోదయ, సూర్యాస్తమయ, చంద్రోదయ సమయాలు.",
    sunrise: "సూర్యోదయం",
    sunset: "సూర్యాస్తమయం",
    moonrise: "చంద్రోదయం",
    moonset: "చంద్రాస్తమయం",
    shubhaSamayamTitle: "శుభ సమయాలు (ముహూర్తాలు)",
    shubhaSamayamDesc: "నూతన ఆరంభాలు, ప్రయాణాలు, పూజలకు అత్యంత అనుకూల సమయాలు.",
    ashubhaSamayamTitle: "వర్జిత / అశుభ సమయాలు",
    ashubhaSamayamDesc: "నూతన ప్రారంభాలు, ఒప్పందాలకు విడిచిపెట్టవలసిన కాలాలు.",
    abhijitTitle: "అభిజిత్ ముహూర్తం",
    abhijitDesc: "సర్వదోష నివారిణి అయిన మధ్యాహ్న శుభ ముహూర్తం.",
    amritTitle: "అమృత కాలం",
    amritDesc: "ముఖ్యమైన పనులలో విజయాన్నిచ్చే అమృత సమయం.",
    brahmaTitle: "బ్రహ్మ ముహూర్తం",
    brahmaDesc: "ధ్యానం మరియు దైవ ప్రార్థనకు అనుకూలమైన తెల్లవారుజాము సమయం.",
    rahuTitle: "రాహు కాలం",
    rahuDesc: "నూతన వస్తువుల కొనుగోలు, ఒప్పందాలు చేయకూడదు.",
    yamagandamTitle: "యమగండం",
    yamagandamDesc: "ఆలస్యాలు మరియు ఆటంకాలు కలిగించే సమయం.",
    gulikaTitle: "గుళిక కాలం",
    gulikaDesc: "శని ప్రభావ కాలం; పనులు పునరావృతం అయ్యే అవకాశం.",
    durmuhurthamTitle: "దుర్ముహూర్తం",
    durmuhurthamDesc: "శుభకార్యాలకు విడిచిపెట్టవలసిన కాలం.",
    choghadiyaTitle: "చోఘడియా ముహూర్తాలు",
    choghadiyaDesc: "పగలు మరియు రాత్రికి సంబంధించిన సంప్రదాయ 8 విభాగాల కాలచక్రం.",
    dayChoghadiya: "పగటి చోఘడియా (సూర్యోదయం నుండి సూర్యాస్తమయం)",
    nightChoghadiya: "రాత్రి చోఘడియా (సూర్యాస్తమయం నుండి సూర్యోదయం)",
    dinaHoraTitle: "దిన గ్రహ హోరలు (24 గంటలు)",
    dinaHoraDesc: "ప్రతి గంటను పాలించే అధిపతి గ్రహాల కాలక్రమం.",
    horaWord: "హోర",
    auspicious: "శుభం",
    inauspicious: "అశుభం",
    signLord: "అధిపతి:",
    signElement: "తత్త్వం:",
    transitingInSign: "ఈ రాశిలో సంచరిస్తున్న గ్రహాలు:",
    noPlanetsInSign: "ప్రస్తుతం ఈ రాశిలో ఏ గ్రహాలూ సంచరించడం లేదు.",
    degreeLabel: "డిగ్రీలు:",
    fromMoon: "చంద్రుని నుండి",
    closeBtn: "మూసివేయి",
  },
  hi: {
    headerTitle: "पंचांग और गोचर चक्र",
    liveBadge: "लाइव गोचर",
    todayBtn: "आज",
    prevDay: "पिछला दिन",
    nextDay: "अगला दिन",
    almanacTitle: "दैनिक वैदिक पंचांग विवरण",
    ayana: "अयन",
    ritu: "ऋतु",
    suryaRasi: "सूर्य राशि",
    chandraRasi: "चंद्र राशि",
    transitChartHeader: "गोचर चक्र (पारगमन कुंडली)",
    transitAyanamsha: "लाहिरी अयनांश • खगोलीय प्रत्यक्ष गणना",
    transitForPrefix: "गोचर:",
    sunSuffix: "सूर्य",
    planetaryTransitsTitle: "ग्रह गोचर स्थिति",
    chandraPrefix: "चंद्र:",
    hMoonPrefix: "चंद्र से {n}वां भाव",
    supportive: "शुभ",
    challenging: "अशुभ",
    neutral: "सम",
    limbsSectionTitle: "पंचांग के पांच मुख्य अंग (पंचांग)",
    tithiTitle: "1. तिथि",
    tithiDesc: "पूजा और शुभ कार्यों के लिए शुभ चंद्र तिथि।",
    pakshaLabel: "पक्ष:",
    vaaraTitle: "2. वार (सौर दिवस)",
    vaaraDesc: "प्रमुख ग्रह ऊर्जा द्वारा शासित सौर दिवस।",
    solarDay: "सौर दिवस",
    dayLordLabel: "वाराधिपति:",
    nakshatraTitle: "3. नक्षत्र",
    nakshatraDesc: "मन और भावनाओं को दिशा देने वाला चंद्र नक्षत्र।",
    padaLabel: "पाद",
    starLordLabel: "नक्षत्राधिपति:",
    yogaTitle: "4. योग",
    yogaDesc: "सूर्य और चंद्रमा के देशांतर के योग से बनने वाला योग।",
    categoryLabel: "श्रेणी:",
    shubhaYoga: "शुभ योग",
    karanaTitle: "5. करण",
    karanaDesc: "कार्यों की सफलता निर्धारित करने वाला तिथि का आधा भाग।",
    halfTithi: "अर्ध-तिथि",
    typeLabel: "प्रकार:",
    charaKarana: "चर करण",
    solarLunarTitle: "सूर्योदय व सूर्यास्त समय",
    solarLunarDesc: "सटीक खगोलीय सूर्योदय, सूर्यास्त और चंद्रोदय समय।",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    moonrise: "चंद्रोदय",
    moonset: "चंद्रास्त",
    shubhaSamayamTitle: "शुभ मुहूर्त (शुभ समय)",
    shubhaSamayamDesc: "नए कार्यों, यात्रा और पूजा के लिए अत्यंत शुभ समय।",
    ashubhaSamayamTitle: "अशुभ समय (वर्ज्य काल)",
    ashubhaSamayamDesc: "नए आरंभ और समझौतों के लिए त्यागने योग्य समय।",
    abhijitTitle: "अभिजित मुहूर्त",
    abhijitDesc: "सभी दोषों को दूर करने वाला अत्यंत शुभ मध्याह्न मुहूर्त।",
    amritTitle: "अमृत काल",
    amritDesc: "महत्वपूर्ण कार्यों में सफलता देने वाला अमृत समय।",
    brahmaTitle: "ब्रह्म मुहूर्त",
    brahmaDesc: "ध्यान और ईश्वर आराधना के लिए उत्तम प्रातःकाल।",
    rahuTitle: "राहु काल",
    rahuDesc: "नई खरीदारी और अनुबंधों से बचें।",
    yamagandamTitle: "यमगंड",
    yamagandamDesc: "बाधाओं और देरी का कारण बनने वाला समय।",
    gulikaTitle: "गुलिक काल",
    gulikaDesc: "शनि का प्रभाव; कार्यों की पुनरावृत्ति का समय।",
    durmuhurthamTitle: "दुर्मुहूर्त",
    durmuhurthamDesc: "अशुभ समय, जिसमें शुभ कार्य न करें।",
    choghadiyaTitle: "चौघड़िया मुहूर्त",
    choghadiyaDesc: "दिन और रात के 8 भागों का पारंपरिक वैदिक मार्गदर्शक।",
    dayChoghadiya: "दिन का चौघड़िया (सूर्योदय से सूर्यास्त)",
    nightChoghadiya: "रात का चौघड़िया (सूर्यास्त से सूर्योदय)",
    dinaHoraTitle: "दैनिक ग्रह होरा (24 घंटे)",
    dinaHoraDesc: "प्रत्येक घंटे पर शासन करने वाले ग्रहों का कालक्रम।",
    horaWord: "होरा",
    auspicious: "शुभ",
    inauspicious: "अशुभ",
    signLord: "स्वामी:",
    signElement: "तत्व:",
    transitingInSign: "इस राशि में गोचर ग्रह:",
    noPlanetsInSign: "इस राशि में वर्तमान में कोई ग्रह गोचर नहीं कर रहा है।",
    degreeLabel: "अंश:",
    fromMoon: "चंद्र से",
    closeBtn: "बंद करें",
  },
};

// =============================================================================
// COMPREHENSIVE TRANSLATION UTILITY FUNCTIONS
// =============================================================================

export const MONTH_NAMES_I18N: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  te: ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
};

export const FULL_WEEKDAY_NAMES_I18N: Record<Lang, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  te: ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
};

export const NAKSHATRA_NAMES_LIST = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

export const NAKSHATRA_NAMES_I18N: Record<Lang, Record<string, string>> = {
  en: {
    Ashwini: "Ashwini", Bharani: "Bharani", Krittika: "Krittika", Rohini: "Rohini",
    Mrigashira: "Mrigashira", Ardra: "Ardra", Punarvasu: "Punarvasu", Pushya: "Pushya",
    Ashlesha: "Ashlesha", Magha: "Magha", "Purva Phalguni": "Purva Phalguni", "Uttara Phalguni": "Uttara Phalguni",
    Hasta: "Hasta", Chitra: "Chitra", Swati: "Swati", Vishakha: "Vishakha",
    Anuradha: "Anuradha", Jyeshtha: "Jyeshtha", Mula: "Mula", "Purva Ashadha": "Purva Ashadha",
    "Uttara Ashadha": "Uttara Ashadha", Shravana: "Shravana", Dhanishta: "Dhanishta",
    Shatabhisha: "Shatabhisha", "Purva Bhadrapada": "Purva Bhadrapada", "Uttara Bhadrapada": "Uttara Bhadrapada",
    Revati: "Revati"
  },
  te: {
    Ashwini: "అశ్విని", Bharani: "భరణి", Krittika: "కృత్తిక", Rohini: "రోహిణి",
    Mrigashira: "మృగశిర", Ardra: "ఆర్ద్ర", Punarvasu: "పునర్వసు", Pushya: "పుష్యమి",
    Ashlesha: "ఆశ్లేష", Magha: "మఖ", "Purva Phalguni": "పుబ్బ (పూర్వఫల్గుణి)", "Uttara Phalguni": "ఉత్తర (ఉత్తరఫల్గుణి)",
    Hasta: "హస్త", Chitra: "చిత్త", Swati: "స్వాతి", Vishakha: "విశాఖ",
    Anuradha: "అనూరాధ", Jyeshtha: "జ్యేష్ఠ", Mula: "మూల", "Purva Ashadha": "పూర్వాషాఢ",
    "Uttara Ashadha": "ఉత్తరాషాఢ", Shravana: "శ్రవణం", Dhanishta: "ధనిష్ఠ",
    Shatabhisha: "శతభిషం", "Purva Bhadrapada": "పూర్వాభాద్ర", "Uttara Bhadrapada": "ఉత్తరాభాద్ర",
    Revati: "రేవతి"
  },
  hi: {
    Ashwini: "अश्विनी", Bharani: "भरणी", Krittika: "कृत्तिका", Rohini: "रोहिणी",
    Mrigashira: "मृगशिरा", Ardra: "आर्द्रा", Punarvasu: "पुनर्वसु", Pushya: "पुष्य",
    Ashlesha: "अश्लेषा", Magha: "मघा", "Purva Phalguni": "पूर्वाफाल्गुनी", "Uttara Phalguni": "उत्तराफाल्गुनी",
    Hasta: "हस्त", Chitra: "चित्रा", Swati: "स्वाती", Vishakha: "विशाखा",
    Anuradha: "अनुराधा", Jyeshtha: "ज्येष्ठा", Mula: "मूल", "Purva Ashadha": "पूर्वाषाढ़ा",
    "Uttara Ashadha": "उत्तराषाढ़ा", Shravana: "श्रवण", Dhanishta: "धनिष्ठा",
    Shatabhisha: "शतभिषा", "Purva Bhadrapada": "पूर्वाभाद्रपद", "Uttara Bhadrapada": "उत्तराभाद्रपद",
    Revati: "रेवती"
  }
};

export const TITHI_NAMES_LIST = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shasthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Amavasya"
];

export const TITHI_NAMES_I18N: Record<Lang, Record<string, string>> = {
  en: {
    Pratipada: "Pratipada", Dwitiya: "Dwitiya", Tritiya: "Tritiya", Chaturthi: "Chaturthi", Panchami: "Panchami",
    Shasthi: "Shasthi", Saptami: "Saptami", Ashtami: "Ashtami", Navami: "Navami", Dashami: "Dashami",
    Ekadashi: "Ekadashi", Dwadashi: "Dwadashi", Trayodashi: "Trayodashi", Chaturdashi: "Chaturdashi",
    Purnima: "Purnima", Amavasya: "Amavasya"
  },
  te: {
    Pratipada: "పాడ్యమి", Dwitiya: "విదియ", Tritiya: "తదియ", Chaturthi: "చవితి", Panchami: "పంచమి",
    Shasthi: "షష్ఠి", Saptami: "సప్తమి", Ashtami: "అష్టమి", Navami: "నవమి", Dashami: "దశమి",
    Ekadashi: "ఏకాదశి", Dwadashi: "ద్వాదశి", Trayodashi: "త్రయోదశి", Chaturdashi: "చతుర్దశి",
    Purnima: "పౌర్ణమి (పూర్ణిమ)", Amavasya: "అమావాస్య"
  },
  hi: {
    Pratipada: "प्रतिपदा", Dwitiya: "द्वितीया", Tritiya: "तृतीया", Chaturthi: "चतुर्थी", Panchami: "पंचमी",
    Shasthi: "षष्ठी", Saptami: "सप्तमी", Ashtami: "अष्टमी", Navami: "नवमी", Dashami: "दशमी",
    Ekadashi: "एकादशी", Dwadashi: "द्वादशी", Trayodashi: "त्रयोदशी", Chaturdashi: "चतुर्दशी",
    Purnima: "पूर्णिमा", Amavasya: "अमावस्या"
  }
};

export const YOGA_NAMES_LIST = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti"
];

export const YOGA_NAMES_I18N: Record<Lang, Record<string, string>> = {
  en: {
    Vishkambha: "Vishkambha", Priti: "Priti", Ayushman: "Ayushman", Saubhagya: "Saubhagya",
    Shobhana: "Shobhana", Atiganda: "Atiganda", Sukarma: "Sukarma", Dhriti: "Dhriti",
    Shula: "Shula", Ganda: "Ganda", Vriddhi: "Vriddhi", Dhruva: "Dhruva",
    Vyaghata: "Vyaghata", Harshana: "Harshana", Vajra: "Vajra", Siddhi: "Siddhi",
    Vyatipata: "Vyatipata", Variyan: "Variyan", Parigha: "Parigha", Shiva: "Shiva",
    Siddha: "Siddha", Sadhya: "Sadhya", Shubha: "Shubha", Shukla: "Shukla",
    Brahma: "Brahma", Indra: "Indra", Vaidhriti: "Vaidhriti"
  },
  te: {
    Vishkambha: "విష్కంభం", Priti: "ప్రీతి", Ayushman: "ఆయుష్మాన్", Saubhagya: "సౌభాగ్యం",
    Shobhana: "శోభనం", Atiganda: "అతిగండం", Sukarma: "సుకర్మ", Dhriti: "ధృతి",
    Shula: "శూలం", Ganda: "గండం", Vriddhi: "వృద్ధి", Dhruva: "ధ్రువం",
    Vyaghata: "వ్యాఘాతం", Harshana: "హర్షణం", Vajra: "వజ్రం", Siddhi: "సిద్ధి",
    Vyatipata: "వ్యతీపాతం", Variyan: "వరియాన్", Parigha: "పరిఘం", Shiva: "శివం",
    Siddha: "సిద్ధం", Sadhya: "సాధ్యం", Shubha: "శుభం", Shukla: "శుక్లం",
    Brahma: "బ్రహ్మం", Indra: "ఇంద్రం", Vaidhriti: "వైధృతి"
  },
  hi: {
    Vishkambha: "विष्कुम्भ", Priti: "प्रीति", Ayushman: "आयुष्मान", Saubhagya: "सौभाग्य",
    Shobhana: "शोभन", Atiganda: "अतिगण्ड", Sukarma: "सुकर्मा", Dhriti: "धृति",
    Shula: "शूल", Ganda: "गण्ड", Vriddhi: "वृद्धि", Dhruva: "ध्रुव",
    Vyaghata: "व्याघात", Harshana: "हर्षण", Vajra: "वज्र", Siddhi: "सिद्धि",
    Vyatipata: "व्यतीपात", Variyan: "वरीयान", Parigha: "परिघ", Shiva: "शिव",
    Siddha: "सिद्ध", Sadhya: "साध्य", Shubha: "शुभ", Shukla: "शुक्ल",
    Brahma: "ब्रह्म", Indra: "इन्द्र", Vaidhriti: "वैधृति"
  }
};

export const KARANA_NAMES_LIST = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
  "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];

export const KARANA_NAMES_I18N: Record<Lang, Record<string, string>> = {
  en: {
    Bava: "Bava", Balava: "Balava", Kaulava: "Kaulava", Taitila: "Taitila",
    Gara: "Gara", Vanija: "Vanija", Vishti: "Vishti (Bhadra)",
    Shakuni: "Shakuni", Chatushpada: "Chatushpada", Naga: "Naga", Kimstughna: "Kimstughna"
  },
  te: {
    Bava: "బవ", Balava: "బాలవ", Kaulava: "కౌలవ", Taitila: "తైతుల",
    Gara: "గరజి", Vanija: "వణిజ", Vishti: "విష్టి (భద్ర)",
    Shakuni: "శకుని", Chatushpada: "చతుష్పాద", Naga: "నాగవ", Kimstughna: "కింస్తుఘ్న"
  },
  hi: {
    Bava: "बव", Balava: "बालव", Kaulava: "कौलव", Taitila: "तैतिल",
    Gara: "गर", Vanija: "वणिज", Vishti: "विष्टि (भद्रा)",
    Shakuni: "शकुनि", Chatushpada: "चतुष्पद", Naga: "नाग", Kimstughna: "किंस्तुघ्न"
  }
};

export function translateVaara(vaara: string | undefined | null, lang: Lang = 'en'): string {
  if (!vaara) return '';
  const clean = String(vaara).trim();
  const lower = clean.toLowerCase();

  const days: Record<string, number> = {
    sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tuesday: 2,
    wed: 3, wednesday: 3, thu: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6
  };

  for (const [k, idx] of Object.entries(days)) {
    if (lower.startsWith(k)) {
      if (lang === 'te') {
        const teVaaras = ["ఆదివారం (రవి)", "సోమవారం (చంద్ర)", "మంగళవారం (కుజ)", "బుధవారం (బుధ)", "గురువారం (గురు)", "శుక్రవారం (శుక్ర)", "శనివారం (శని)"];
        return teVaaras[idx];
      } else if (lang === 'hi') {
        const hiVaaras = ["रविवार (सूर्य)", "सोमवार (चंद्र)", "मंगलवार (मंगल)", "बुधवार (बुध)", "गुरुवार (गुरु)", "शुक्रवार (शुक्र)", "शनिवार (शनि)"];
        return hiVaaras[idx];
      }
      return FULL_WEEKDAY_NAMES_I18N.en[idx];
    }
  }
  return clean;
}

/**
 * Formats a Date object into localized Day & Date string (e.g. "గురువారం, సెప్టెంబర్ 3" for Telugu)
 */
export function formatDateAndDayInLanguage(date: Date, lang: Lang = 'en'): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const dayOfWeek = FULL_WEEKDAY_NAMES_I18N[lang]?.[d.getDay()] || FULL_WEEKDAY_NAMES_I18N.en[d.getDay()];
    const month = MONTH_NAMES_I18N[lang]?.[d.getMonth()] || MONTH_NAMES_I18N.en[d.getMonth()];
    const dateNum = d.getDate();
    
    if (lang === 'te') {
      return `${dayOfWeek}, ${month} ${dateNum}`;
    } else if (lang === 'hi') {
      return `${dayOfWeek}, ${month} ${dateNum}`;
    }
    return `${dayOfWeek}, ${month} ${dateNum}`;
  } catch (e) {
    return date.toDateString();
  }
}

/**
 * Translates a Zodiac Sign name (e.g. "Aquarius" -> "కుంభం" / "कुंभ")
 */
export function translateSign(sign: string | undefined | null, lang: Lang = 'en'): string {
  if (!sign) return '';
  const clean = String(sign).trim();
  const key = clean.toLowerCase();
  
  // Check exact map or standard signs
  for (const s of ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']) {
    if (s.toLowerCase() === key || clean.toLowerCase().startsWith(s.toLowerCase())) {
      return SIGN_NAMES_I18N[lang]?.[s] || s;
    }
  }
  
  if (lang === 'te') {
    const teMap: Record<string, string> = {
      aries: 'మేషం', taurus: 'వృషభం', gemini: 'మిథునం', cancer: 'కర్కాటకం',
      leo: 'సింహం', virgo: 'కన్య', libra: 'తుల', scorpio: 'వృశ్చికం',
      sagittarius: 'ధనుస్సు', capricorn: 'మకరం', aquarius: 'కుంభం', pisces: 'మీనం',
      mesha: 'మేషం', vrishabha: 'వృషభం', mithuna: 'మిథునం', karkataka: 'కర్కాటకం',
      simha: 'సింహం', kanya: 'కన్య', thula: 'తుల', tula: 'తుల', vrischika: 'వృశ్చికం',
      dhanu: 'ధనుస్సు', dhanus: 'ధనుస్సు', makara: 'మకరం', kumbha: 'కుంభం', meena: 'మీనం'
    };
    if (teMap[key]) return teMap[key];
  } else if (lang === 'hi') {
    const hiMap: Record<string, string> = {
      aries: 'मेष', taurus: 'वृषभ', gemini: 'मिथुन', cancer: 'कर्क',
      leo: 'सिंह', virgo: 'कन्या', libra: 'तुला', scorpio: 'वृश्चिक',
      sagittarius: 'धनु', capricorn: 'मकर', aquarius: 'कुंभ', pisces: 'मीन'
    };
    if (hiMap[key]) return hiMap[key];
  }
  return clean;
}

/**
 * Translates a Planet Name (e.g. "Saturn" -> "శని" / "शनि")
 */
export function translatePlanet(planet: string | undefined | null, lang: Lang = 'en'): string {
  if (!planet) return '';
  const clean = String(planet).trim();
  const key = clean.toLowerCase();

  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
    if (p.toLowerCase() === key || clean.toLowerCase().startsWith(p.toLowerCase())) {
      return PLANET_NAMES_I18N[lang]?.[p] || p;
    }
  }

  if (lang === 'te') {
    const pTe: Record<string, string> = {
      sun: 'సూర్యుడు', moon: 'చంద్రుడు', mars: 'కుజుడు', mercury: 'బుధుడు',
      jupiter: 'గురుడు', venus: 'శుక్రుడు', saturn: 'శని', rahu: 'రాహువు', ketu: 'కేతువు',
      ravi: 'సూర్యుడు', chandra: 'చంద్రుడు', kuja: 'కుజుడు', budha: 'బుధుడు',
      guru: 'గురుడు', sukra: 'శుక్రుడు', shukra: 'శుక్రుడు', shani: 'శని', sani: 'శని'
    };
    if (pTe[key]) return pTe[key];
  } else if (lang === 'hi') {
    const pHi: Record<string, string> = {
      sun: 'सूर्य', moon: 'चंद्र', mars: 'मंगल', mercury: 'बुध',
      jupiter: 'गुरु', venus: 'शुक्र', saturn: 'शनि', rahu: 'राहु', ketu: 'केतु'
    };
    if (pHi[key]) return pHi[key];
  }
  return clean;
}

/**
 * Translates a Lord name (e.g. "Lord: Saturn" -> "అధిపతి: శని")
 */
export function translateLord(lord: string | undefined | null, lang: Lang = 'en'): string {
  return translatePlanet(lord, lang);
}

/**
 * Translates a Nakshatra name, handling optional Pada notation
 * e.g. "Krittika Nakshatra" -> "కృత్తిక నక్షత్రం"
 * e.g. "Vishakha - Pada 3" -> "విశాఖ - పాదం 3"
 */
export function translateNakshatra(nakshatraStr: string | undefined | null, lang: Lang = 'en'): string {
  if (!nakshatraStr) return '';
  let str = String(nakshatraStr).trim();
  
  // Extract Pada if present (e.g. "Vishakha - Pada 3" or "Krittika (Pada 2)")
  const padaMatch = str.match(/[-–(,]?\s*(?:Pada|pada|Padam|పాద|पाद)\s*[:\-]?\s*([1-4])/i);
  let padaNum = '';
  if (padaMatch) {
    padaNum = padaMatch[1];
    str = str.replace(padaMatch[0], '').replace(/[()]/g, '').trim();
  }

  // Remove trailing "Nakshatra" or "నక్షత్రం" or "నక్షత్ర"
  const cleanBase = str.replace(/\b(?:nakshatra|nakshatram|naks)\b/gi, '').trim();
  const lowerBase = cleanBase.toLowerCase();

  let translatedBase = cleanBase;
  for (const nak of NAKSHATRA_NAMES_LIST) {
    if (nak.toLowerCase() === lowerBase || lowerBase.includes(nak.toLowerCase())) {
      translatedBase = NAKSHATRA_NAMES_I18N[lang]?.[nak] || nak;
      break;
    }
  }

  if (lang === 'te') {
    if (padaNum) {
      return `${translatedBase} - పాదం ${padaNum}`;
    }
    // If the original had "Nakshatra", append "నక్షత్రం"
    if (/nakshatra/i.test(String(nakshatraStr))) {
      return `${translatedBase} నక్షత్రం`;
    }
    return translatedBase;
  } else if (lang === 'hi') {
    if (padaNum) {
      return `${translatedBase} - पाद ${padaNum}`;
    }
    if (/nakshatra/i.test(String(nakshatraStr))) {
      return `${translatedBase} नक्षत्र`;
    }
    return translatedBase;
  }

  if (padaNum) {
    return `${translatedBase} - Pada ${padaNum}`;
  }
  return translatedBase;
}

/**
 * Translates Paksha (e.g. "Krishna Paksha" -> "కృష్ణ పక్షం")
 */
export function translatePaksha(paksha: string | undefined | null, lang: Lang = 'en'): string {
  if (!paksha) return '';
  const clean = String(paksha).trim().toLowerCase();
  if (clean.includes('krishna')) {
    if (lang === 'te') return 'కృష్ణ పక్షం';
    if (lang === 'hi') return 'कृष्ण पक्ष';
    return 'Krishna Paksha';
  }
  if (clean.includes('shukla')) {
    if (lang === 'te') return 'శుక్ల పక్షం';
    if (lang === 'hi') return 'शुक्ल पक्ष';
    return 'Shukla Paksha';
  }
  return paksha;
}

/**
 * Translates Tithi (e.g. "Saptami" -> "సప్తమి")
 */
export function translateTithi(tithi: string | undefined | null, lang: Lang = 'en'): string {
  if (!tithi) return '';
  const clean = String(tithi).trim();
  const lower = clean.toLowerCase();

  for (const t of TITHI_NAMES_LIST) {
    if (t.toLowerCase() === lower || lower.includes(t.toLowerCase())) {
      return TITHI_NAMES_I18N[lang]?.[t] || t;
    }
  }

  if (lang === 'te') {
    const teTithi: Record<string, string> = {
      pratipada: 'పాడ్యమి', padyami: 'పాడ్యమి', dwitiya: 'విదియ', vidiya: 'విదియ',
      tritiya: 'తదియ', tadiya: 'తదియ', chaturthi: 'చవితి', chavithi: 'చవితి',
      panchami: 'పంచమి', shasthi: 'షష్ఠి', sashti: 'షష్ఠి', saptami: 'సప్తమి',
      ashtami: 'అష్టమి', navami: 'నవమి', dashami: 'దశమి', ekadashi: 'ఏకాదశి',
      dwadashi: 'ద్వాదశి', trayodashi: 'త్రయోదశి', chaturdashi: 'చతుర్దశి',
      purnima: 'పూర్ణిమ', pournami: 'పౌర్ణమి', amavasya: 'అమావాస్య'
    };
    if (teTithi[lower]) return teTithi[lower];
  }
  return clean;
}

/**
 * Translates Yoga name (e.g. "Siddhi" -> "సిద్ధి")
 */
export function translateYoga(yoga: string | undefined | null, lang: Lang = 'en'): string {
  if (!yoga) return '';
  const clean = String(yoga).trim();
  const lower = clean.toLowerCase();
  for (const y of YOGA_NAMES_LIST) {
    if (y.toLowerCase() === lower || lower.includes(y.toLowerCase())) {
      return YOGA_NAMES_I18N[lang]?.[y] || y;
    }
  }
  return clean;
}

/**
 * Translates Karana name (e.g. "Bava" -> "బవ")
 */
export function translateKarana(karana: string | undefined | null, lang: Lang = 'en'): string {
  if (!karana) return '';
  const clean = String(karana).trim();
  const lower = clean.toLowerCase();
  for (const k of KARANA_NAMES_LIST) {
    if (k.toLowerCase() === lower || lower.includes(k.toLowerCase())) {
      return KARANA_NAMES_I18N[lang]?.[k] || k;
    }
  }
  return clean;
}

/**
 * Localized time-remaining formatter (e.g. "2y 4m 13d remaining" -> "2సం 4నె 13రో మిగిలి ఉంది")
 */
export function formatRemainingTimeInLanguage(endDate: Date, lang: Lang = 'en'): string {
  try {
    const now = new Date();
    if (now >= endDate) {
      return lang === 'te' ? 'పూర్తయింది' : lang === 'hi' ? 'पूर्ण' : 'Completed';
    }
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const remainingDaysAfterYears = diffDays % 365;
    const months = Math.floor(remainingDaysAfterYears / 30.4375);
    const days = Math.round(remainingDaysAfterYears % 30.4375);

    if (lang === 'te') {
      let text = "";
      if (years > 0) text += `${years}సం `;
      if (months > 0) text += `${months}నె `;
      if (days > 0 || text === "") text += `${days}రో `;
      return `${text}మిగిలి ఉంది`;
    } else if (lang === 'hi') {
      let text = "";
      if (years > 0) text += `${years}वर्ष `;
      if (months > 0) text += `${months}माह `;
      if (days > 0 || text === "") text += `${days}दिन `;
      return `${text}शेष`;
    }

    let text = "";
    if (years > 0) text += `${years}y `;
    if (months > 0) text += `${months}m `;
    if (days > 0 || text === "") text += `${days}d `;
    return `${text}remaining`;
  } catch (e) {
    return '—';
  }
}

/**
 * Localized Saturn Transit description generator
 */
export function translateTransitSaturnDesc(
  sign: string,
  hLagna: number,
  hMoon: number,
  isSadeSati: boolean,
  sadeSatiPhase: string,
  lang: Lang = 'en'
): string {
  const signTr = translateSign(sign, lang);
  
  if (lang === 'te') {
    if (isSadeSati) {
      const phaseTe = sadeSatiPhase === 'Rising' ? 'ప్రారంభ దశ' : sadeSatiPhase === 'Peak' ? 'మధ్య దశ (శిఖరం)' : 'చివరి దశ';
      return `శని ప్రస్తుతం ${signTr}లో (లగ్నం నుండి ${hLagna}వ స్థానం, చంద్రుని నుండి ${hMoon}వ స్థానం) సంచరిస్తున్నారు. జాతకుడికి ఏలినాటి శని (${phaseTe}) నడుస్తోంది. క్రమశిక్షణ, ఓర్పు పాటించండి.`;
    }
    return `శని ప్రస్తుతం ${signTr}లో (లగ్నం నుండి ${hLagna}వ స్థానం, చంద్రుని నుండి ${hMoon}వ స్థానం) సంచరిస్తున్నారు. ప్రస్తుతం ఏలినాటి శని ప్రభావం లేదు.`;
  } else if (lang === 'hi') {
    if (isSadeSati) {
      const phaseHi = sadeSatiPhase === 'Rising' ? 'आरंभिक चरण' : sadeSatiPhase === 'Peak' ? 'मध्य चरण (शिखर)' : 'अंतिम चरण';
      return `शनि वर्तमान में ${signTr} (लग्न से ${hLagna}वां, चंद्र से ${hMoon}वां) में गोचर कर रहे हैं। जातक पर साढ़े साती (${phaseHi}) चल रही है। संयम और अनुशासन बनाए रखें।`;
    }
    return `शनि वर्तमान में ${signTr} (लग्न से ${hLagna}वां, चंद्र से ${hMoon}वां) में गोचर कर रहे हैं। वर्तमान में साढ़े साती का प्रभाव नहीं है।`;
  }

  if (isSadeSati) {
    return `Saturn is currently transiting ${sign} (${hLagna}th from Lagna, ${hMoon}th from Moon). Native is experiencing Sade Sati (${sadeSatiPhase}). Cultivate discipline and patience.`;
  }
  return `Saturn is currently transiting ${sign} (${hLagna}th from Lagna, ${hMoon}th from Moon). No active Sade Sati pressure currently.`;
}

/**
 * Localized Jupiter Transit description generator
 */
export function translateTransitJupiterDesc(
  sign: string,
  hMoon: number,
  isAuspicious: boolean,
  lang: Lang = 'en'
): string {
  const signTr = translateSign(sign, lang);

  if (lang === 'te') {
    if (isAuspicious) {
      return `గురుడు ప్రస్తుతం ${signTr}లో (జన్మ చంద్రుని నుండి ${hMoon}వ స్థానం) ఉన్నారు. అనుకూల స్థానం; జ్ఞానం, అభివృద్ధి, మానసిక ప్రశాంతతను ప్రసాదిస్తుంది.`;
    }
    return `గురుడు ప్రస్తుతం ${signTr}లో (జన్మ చంద్రుని నుండి ${hMoon}వ స్థానం) ఉన్నారు. స్థిరమైన కర్తవ్యాలు, అంతర్గత సాధనపై దృష్టి పెట్టండి.`;
  } else if (lang === 'hi') {
    if (isAuspicious) {
      return `गुरु वर्तमान में ${signTr} (जन्म चंद्र से ${hMoon}वें भाव) में हैं। शुभ स्थिति; ज्ञान, उन्नति और मानसिक शांति प्रदान करती है।`;
    }
    return `गुरु वर्तमान में ${signTr} (जन्म चंद्र से ${hMoon}वें भाव) में हैं। अपने कर्तव्यों और आंतरिक अनुशासन पर ध्यान दें।`;
  }

  if (isAuspicious) {
    return `Jupiter is currently transiting ${sign} (${hMoon}th from Janma Moon). Auspicious placement supporting wisdom, growth, and clarity.`;
  }
  return `Jupiter is transiting ${sign} (${hMoon}th from Janma Moon). Maintain steady focus on duties and internal growth.`;
}

/**
 * General helper to translate freeform astrological strings in cards
 */
export function translateAstrologicalText(text: string | undefined | null, lang: Lang = 'en'): string {
  if (!text) return '';
  if (lang === 'en') return text;
  
  let result = String(text);
  
  // Replace signs
  for (const s of ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']) {
    const reg = new RegExp(`\\b${s}\\b`, 'gi');
    if (reg.test(result)) {
      result = result.replace(reg, SIGN_NAMES_I18N[lang]?.[s] || s);
    }
  }

  // Replace planets
  for (const p of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
    const reg = new RegExp(`\\b${p}\\b`, 'gi');
    if (reg.test(result)) {
      result = result.replace(reg, PLANET_NAMES_I18N[lang]?.[p] || p);
    }
  }

  // Replace paksha
  if (/krishna\s*paksha/i.test(result)) {
    result = result.replace(/krishna\s*paksha/gi, lang === 'te' ? 'కృష్ణ పక్షం' : 'कृष्ण पक्ष');
  }
  if (/shukla\s*paksha/i.test(result)) {
    result = result.replace(/shukla\s*paksha/gi, lang === 'te' ? 'శుక్ల పక్షం' : 'शुक्ल पक्ष');
  }

  // Replace tithis
  for (const t of TITHI_NAMES_LIST) {
    const reg = new RegExp(`\\b${t}\\b`, 'gi');
    if (reg.test(result)) {
      result = result.replace(reg, TITHI_NAMES_I18N[lang]?.[t] || t);
    }
  }

  // Replace nakshatras
  for (const n of NAKSHATRA_NAMES_LIST) {
    const reg = new RegExp(`\\b${n}\\b`, 'gi');
    if (reg.test(result)) {
      result = result.replace(reg, NAKSHATRA_NAMES_I18N[lang]?.[n] || n);
    }
  }

  // Replace Sade Sati
  if (/sade\s*sati/i.test(result)) {
    result = result.replace(/sade\s*sati/gi, lang === 'te' ? 'ఏలినాటి శని' : 'साढ़े साती');
  }

  return result;
}


