import React, { useState } from 'react';
import { Music, Volume2, Loader } from 'lucide-react';

interface VagdenuWidgetProps {
  onNavigatePage?: (page: string) => void;
}

export const VagdenuWidget: React.FC<VagdenuWidgetProps> = ({ onNavigatePage }) => {
  const [verseText, setVerseText] = useState(
    'वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'
  );
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectedMeter, setDetectedMeter] = useState<string | null>(null);

  const handleQuickChant = async () => {
    if (!verseText.trim()) {
      setError('Please paste or type a Sanskrit verse');
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setDetectedMeter(null);

    try {
      const response = await fetch('/api/vagdhenu/chant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: verseText.trim(),
          meter: 'AUTO',
          seed: 60
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || 'Render failed');
      }

      const meterHeader = response.headers.get('x-detected-meter');
      if (meterHeader) {
        try {
          setDetectedMeter(decodeURIComponent(meterHeader));
        } catch {
          setDetectedMeter(meterHeader);
        }
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: any) {
      setError(err.message || 'Failed to synthesize chant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="vagdhenu-quick-widget" className="bg-gradient-to-br from-[#FFF9F2] via-[#FFF3E5] to-[#FDFBF7] border border-[#E67E22]/30 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#E67E22]/10 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#E67E22]/15 text-[#E67E22] flex items-center justify-center shadow-xs">
          <Music className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-base text-[#2C3E50]">
            Vedic Chant
          </h3>
        </div>
      </div>

      {/* Input textarea */}
      <div className="space-y-1.5">
        <textarea
          value={verseText}
          onChange={(e) => {
            setVerseText(e.target.value);
            if (error) setError(null);
          }}
          rows={2}
          placeholder="Paste Sanskrit shloka in Devanagari script..."
          className="w-full px-3 py-2.5 bg-white/90 border border-[#D4C5B9]/60 focus:border-[#E67E22] rounded-xl text-sm text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#E67E22]/20 transition-all font-sans leading-relaxed resize-none shadow-2xs placeholder:text-gray-400"
        />
      </div>

      {/* Detected meter chip */}
      {detectedMeter && (
        <div className="flex items-center gap-1.5 text-xs text-[#2C3E50] bg-white/90 border border-[#E67E22]/25 px-2.5 py-1.5 rounded-lg">
          <span className="text-[#E67E22] font-semibold">🪔 Chandas:</span>
          <span className="font-medium capitalize">{detectedMeter}</span>
        </div>
      )}

      {/* Audio player when ready */}
      {audioUrl && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white border border-[#E67E22]/30 rounded-xl p-2.5 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Volume2 className="w-4 h-4 text-[#E67E22] shrink-0" />
            <audio
              src={audioUrl}
              controls
              autoPlay
              className="w-full h-8 accent-[#E67E22]"
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleQuickChant}
          disabled={loading || !verseText.trim()}
          className="flex-1 py-2.5 px-4 bg-[#E67E22] hover:bg-[#D35400] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          {loading ? (
            <>
              <Loader className="w-3.5 h-3.5 animate-spin" />
              <span>Chanting Shloka...</span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5" />
              <span>🎧 Quick Chant</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onNavigatePage?.('chant')}
          className="py-2.5 px-3.5 bg-white hover:bg-[#F7F1E8] border border-[#E67E22]/30 text-[#E67E22] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
        >
          <span>Explore All Meters →</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50/80 border border-red-200 rounded-lg p-2 animate-in fade-in">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};
