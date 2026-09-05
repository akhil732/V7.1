import React, { useState } from 'react';
import { 
  Music, 
  Volume2, 
  Loader, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  Info, 
  Sliders, 
  RefreshCw,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CHANT_LABELS, Lang } from '../lib/i18n/astrologicalTerms';

interface ChantPageProps {
  language?: 'en' | 'hi' | 'te';
  onBack?: () => void;
}

interface ShlokaSample {
  title: string;
  category: string;
  meter: string;
  meaning: string;
  text: string;
}

const METERS = [
  { id: 'AUTO', name: '✨ Auto-detect Chandas', syllables: 'Auto', desc: 'Analyzes syllable count and laghu/guru patterns automatically' },
  { id: 'anuṣṭubh', name: 'Anuṣṭubh (अनुष्टुभ्)', syllables: '8 syllables/pada (32 total)', desc: 'Standard 4-quarter Vedic & epic meter (Gita, Ramayana, Shlokas)' },
  { id: 'upajāti', name: 'Upajāti (उपजाति)', syllables: '11 syllables/pada', desc: 'Harmonious blend of Indravajrā and Upendravajrā' },
  { id: 'śārdūlavikrīḍita', name: 'Śārdūlavikrīḍita (शार्दूलविक्रीडित)', syllables: '19 syllables/pada', desc: 'Majestic tiger-play meter for royal hymns and stotrams' },
  { id: 'vasantatilakā', name: 'Vasantatilakā (वसन्ततिलका)', syllables: '14 syllables/pada', desc: 'Spring blossom meter with graceful flow' },
  { id: 'śikhariṇī', name: 'Śikhariṇī (शिखरिणी)', syllables: '17 syllables/pada', desc: 'Mountain peak meter, famous in Soundarya Lahari' },
  { id: 'bhujagabhaṅgimālikā', name: 'Bhujagabhaṅgimālikā (भुजगभङ्गिमालिका)', syllables: '12 syllables/pada', desc: 'Serpentine rhythmic wave meter' },
  { id: 'mālinī', name: 'Mālinī (मालिनी)', syllables: '15 syllables/pada', desc: 'Garland meter with gentle caesura at 8th syllable' },
  { id: 'mandākrāntā', name: 'Mandākrāntā (मन्दाक्रान्ता)', syllables: '17 syllables/pada', desc: 'Slowly advancing meter immortalized in Kalidasa’s Meghadūtam' },
  { id: 'indravajrā', name: 'Indravajrā (इन्द्रवज्रा)', syllables: '11 syllables/pada', desc: 'Indra’s thunderbolt meter starting with two heavy syllables' },
  { id: 'upendravajrā', name: 'Upendravajrā (उपेन्द्रवज्रा)', syllables: '11 syllables/pada', desc: 'Upendra meter starting with a light syllable' }
];

const SAMPLE_SHLOKAS: ShlokaSample[] = [
  {
    title: 'Ganesha Dhyānam',
    category: 'Invocations',
    meter: 'anuṣṭubh',
    meaning: 'O Lord with the curved trunk and immense aura like a million suns, please make all my endeavors free of obstacles forever.',
    text: 'वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'
  },
  {
    title: 'Guru Vandana',
    category: 'Invocations',
    meter: 'anuṣṭubh',
    meaning: 'The Guru is Brahma, the Guru is Vishnu, the Guru is Shiva. The Guru is indeed the Supreme Reality. Salutations to the revered Guru.',
    text: 'गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः ।\nगुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः ॥'
  },
  {
    title: 'Bhagavad Gītā 2.47',
    category: 'Gītā Wisdom',
    meter: 'anuṣṭubh',
    meaning: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Let not the fruits be your motive.',
    text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥'
  },
  {
    title: 'Sarasvatī Vandana',
    category: 'Learning',
    meter: 'anuṣṭubh',
    meaning: 'Salutations to Mother Sarasvati, the giver of boons and granter of desires. As I begin my studies, grant me perpetual mastery.',
    text: 'सरस्वति नमस्तुभ्यं वरदे कामरूपिणि ।\nविद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥'
  },
  {
    title: 'Mahā Mṛtyuñjaya Mantra',
    category: 'Healing & Protection',
    meter: 'anuṣṭubh',
    meaning: 'We worship the three-eyed one who is fragrant and nourishes all beings. May we be liberated from mortality into immortality.',
    text: 'त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्यschemaोर्मुक्षीय मामृतात् ॥'
  },
  {
    title: 'Bhagavad Gītā 11.33',
    category: 'Gītā Wisdom',
    meter: 'upajāti',
    meaning: 'Therefore arise, attain glory, conquer your foes, and enjoy a prosperous kingdom. By Me alone have these warriors already been slain; be merely an instrument, O Savyasachin.',
    text: 'तस्मात्त्वमुत्तिष्ठ यशो लभस्व जित्वा शत्रून् भुङ्क्ष्व राज्यं समृद्धम् ।\nमयैवैते निहताः पूर्वमेव निमित्तमात्रं भव सव्यसाचिन् ॥'
  },
  {
    title: 'Śānti Pāṭha',
    category: 'Universal Peace',
    meter: 'anuṣṭubh',
    meaning: 'May all sentient beings be happy; may all be free from illness; may all perceive what is auspicious; may none suffer pain.',
    text: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥'
  },
  {
    title: 'Gāyatrī Mantra',
    category: 'Vedic Rk',
    meter: 'gāyatrī',
    meaning: 'We meditate upon the supreme splendor of the Divine Solar Illuminator; may that light illuminate and inspire our intellect.',
    text: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥'
  }
];

export const ChantPage: React.FC<ChantPageProps> = ({ language, onBack }) => {
  const { language: ctxLanguage } = useLanguage();
  const activeLang = ((language || ctxLanguage) as Lang) || 'en';
  const l = CHANT_LABELS[activeLang] || CHANT_LABELS.en;

  const [verseText, setVerseText] = useState(
    'वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'
  );
  const [selectedMeter, setSelectedMeter] = useState('AUTO');
  const [seed, setSeed] = useState(60);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectedMeter, setDetectedMeter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [renderStep, setRenderStep] = useState<string>('');

  const categories = ['All', 'Invocations', 'Gītā Wisdom', 'Learning', 'Healing & Protection', 'Universal Peace'];

  const filteredSamples = activeCategory === 'All' 
    ? SAMPLE_SHLOKAS 
    : SAMPLE_SHLOKAS.filter(s => s.category === activeCategory);

  const handleChant = async () => {
    if (!verseText.trim()) {
      setError(l.emptyError);
      return;
    }

    const lines = verseText.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length > 4) {
      setError('Please provide a single shloka (up to 4 lines / padas).');
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setAudioBlob(null);
    setDetectedMeter(null);
    setRenderStep('Analyzing prosody and Chandas meter...');

    try {
      setTimeout(() => {
        setRenderStep('Synthesizing flow matching mel-spectrogram...');
      }, 1500);

      setTimeout(() => {
        setRenderStep('Generating 24kHz metered audio waveform...');
      }, 3000);

      const response = await fetch('/api/vagdhenu/chant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: verseText.trim(),
          meter: selectedMeter,
          seed: Number(seed) || 60
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || 'Chant synthesis failed.');
      }

      const detected = response.headers.get('x-detected-meter');
      if (detected) {
        try {
          setDetectedMeter(decodeURIComponent(detected));
        } catch {
          setDetectedMeter(detected);
        }
      } else if (selectedMeter !== 'AUTO') {
        setDetectedMeter(selectedMeter);
      }

      const blob = await response.blob();
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: any) {
      console.error('Vagdhenu chant synthesis error:', err);
      setError(err.message || 'Failed to render verse. Please try again.');
    } finally {
      setLoading(false);
      setRenderStep('');
    }
  };

  const handleDownload = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vagdhenu_chant_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(verseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto px-3 sm:px-4 pt-3 font-sans text-[#2C3E50]">
      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left / Top Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#D4C5B9]/50 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              
              {/* Text Input Header */}
              <div className="flex items-center justify-between">
                <label className="font-serif font-bold text-base text-[#2C3E50] flex items-center gap-2">
                  <span>{l.sanskritVerse}</span>
                  <span className="text-xs font-sans font-normal text-[#8A7B6E]">
                    {l.linesLimit}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="p-1 text-xs text-[#564337] hover:text-[#E67E22] flex items-center gap-1 rounded hover:bg-[#F5ECE1] transition-colors cursor-pointer"
                    title="Copy Verse"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? l.copied : l.copy}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerseText('')}
                    className="p-1 text-xs text-[#8A7B6E] hover:text-red-600 flex items-center gap-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    title="Clear Text"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{l.clear}</span>
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={verseText}
                  onChange={(e) => {
                    setVerseText(e.target.value);
                    if (error) setError(null);
                  }}
                  rows={4}
                  placeholder={l.versePlaceholder}
                  className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#D4C5B9]/80 focus:border-[#E67E22] rounded-xl text-base text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#E67E22]/20 transition-all font-sans leading-relaxed resize-y"
                />
                <div className="flex items-center justify-between text-[11px] text-[#8A7B6E] px-1 pt-1">
                  <span>{verseText.split('\n').filter(l => l.trim()).length} of 4 lines</span>
                  <span>{verseText.length} characters</span>
                </div>
              </div>

              {/* Advanced Settings Collapsible Dropdown Reveal */}
              <div className="pt-2 border-t border-[#D4C5B9]/30">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#564337] hover:text-[#E67E22] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#E67E22]" />
                    <span>{l.advancedSettings}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-normal text-[#8A7B6E]">
                    <span>{showAdvanced ? l.hide : l.show}</span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4 text-[#E67E22]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 mt-1 border-t border-[#D4C5B9]/20 animate-in fade-in duration-150">
                    {/* Meter Selection */}
                    <div>
                      <label className="block text-xs font-bold text-[#2C3E50] mb-1.5 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#E67E22]" />
                        <span>{l.meterChandas}</span>
                      </label>
                      <select
                        value={selectedMeter}
                        onChange={(e) => setSelectedMeter(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D4C5B9]/80 rounded-xl text-xs text-[#2C3E50] focus:outline-none focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/20 font-medium"
                      >
                        {METERS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[#8A7B6E] mt-1 line-clamp-1">
                        {METERS.find(m => m.id === selectedMeter)?.desc}
                      </p>
                    </div>

                    {/* Seed Control */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 text-[#E67E22]" />
                          <span>{l.acousticSeed}</span>
                        </label>
                        <span className="text-xs font-mono font-bold text-[#E67E22] bg-[#E67E22]/10 px-1.5 py-0.5 rounded">
                          {seed}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="5"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-[#D4C5B9]/40 rounded-lg appearance-none cursor-pointer accent-[#E67E22]"
                      />
                      <div className="flex justify-between text-[10px] text-[#8A7B6E] mt-1">
                        <span>0 (Default)</span>
                        <span>500</span>
                        <span>1000 (Randomized)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleChant}
                disabled={loading || !verseText.trim()}
                className="w-full py-3.5 bg-[#E67E22] hover:bg-[#D35400] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-sm"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>{renderStep || l.synthesizing}</span>
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4" />
                    <span>{l.chantIt}</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1 text-red-900 text-sm animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-red-700">
                  <span>❌ {l.synthesisNotice}</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">{error}</p>
              </div>
            )}

            {audioUrl && (
              <div className="bg-gradient-to-br from-[#FFF9F2] to-[#FFF3E5] border border-[#E67E22]/40 rounded-2xl p-5 space-y-4 shadow-sm animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#E67E22] text-white flex items-center justify-center shadow-xs">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#2C3E50]">
                        {l.chantRenderedSuccess}
                      </h3>
                      <p className="text-xs text-[#E67E22] font-medium">
                        {l.highFidelityMaster}
                      </p>
                    </div>
                  </div>

                  {detectedMeter && (
                    <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-[#E67E22]/30 text-[#2C3E50] rounded-full capitalize">
                      🪔 {detectedMeter}
                    </span>
                  )}
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#D4C5B9]/40 shadow-2xs">
                  <audio
                    src={audioUrl}
                    controls
                    autoPlay
                    className="w-full accent-[#E67E22]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 py-2.5 bg-[#2C3E50] hover:bg-[#1A252F] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{l.downloadWav}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleChant}
                    className="px-4 py-2.5 bg-white hover:bg-[#F5ECE1] border border-[#E67E22]/40 text-[#E67E22] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{l.rerender}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right / Bottom Sample Library (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#D4C5B9]/50 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#2C3E50] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#E67E22]" />
                  <span>{l.presetShlokas}</span>
                </h3>
                <span className="text-xs text-[#8A7B6E]">
                  {SAMPLE_SHLOKAS.length} {l.classicalVerses}
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#E67E22] text-white'
                        : 'bg-[#F5ECE1]/60 text-[#564337] hover:bg-[#F5ECE1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Samples List */}
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredSamples.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setVerseText(sample.text);
                      if (sample.meter && sample.meter !== 'gāyatrī') {
                        setSelectedMeter(sample.meter);
                      } else {
                        setSelectedMeter('AUTO');
                      }
                      setError(null);
                    }}
                    className="p-3 bg-[#FDFBF7] hover:bg-[#FFF5EB] border border-[#D4C5B9]/40 hover:border-[#E67E22]/50 rounded-xl transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-serif font-bold text-xs text-[#2C3E50] group-hover:text-[#E67E22] transition-colors">
                        {sample.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#8A7B6E] border border-[#D4C5B9]/30 capitalize">
                        {sample.meter}
                      </span>
                    </div>
                    <p className="text-xs text-[#2C3E50] font-sans font-medium line-clamp-2 leading-relaxed">
                      {sample.text.replace('\n', ' ')}
                    </p>
                    <p className="text-[10px] text-[#8A7B6E] italic mt-1 line-clamp-1">
                      {sample.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Insights Card */}
            <div className="bg-[#F8F9FA] border border-[#D4C5B9]/40 rounded-2xl p-4 space-y-2 text-xs text-[#564337]">
              <div className="flex items-center gap-1.5 font-bold text-[#2C3E50]">
                <Info className="w-4 h-4 text-[#E67E22]" />
                <span>Chandas Prosody Engine</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#564337]/90">
                Sanskrit prosody relies on <strong>Laghu (short)</strong> and <strong>Guru (long)</strong> syllable sequences grouped into 8 tri-syllabic gaṇas. 
                Vāgdhenu computes authentic swara cadences via Kannada-routed phoneme mapping to eliminate modern Hindi schwa-deletion.
              </p>
              <div className="pt-1 text-[10px] text-[#8A7B6E] border-t border-[#D4C5B9]/30 flex items-center justify-between">
                <span>IISc Bengaluru • Prof. Prathosh</span>
                <a 
                  href="https://github.com/prathoshap/vagdhenu" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#E67E22] hover:underline font-semibold"
                >
                  GitHub Repository ↗
                </a>
              </div>
            </div>

          </div>

        </div>
    </div>
  );
};
