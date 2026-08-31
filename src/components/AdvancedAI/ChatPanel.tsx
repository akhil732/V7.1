import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Mic,
  MicOff,
  Send,
  Square,
  RefreshCw,
  HelpCircle,
  FileText,
  Sliders,
  Menu,
  ChevronRight,
  ShieldCheck,
  Lightbulb,
  AlertCircle,
  Search,
  MessageSquare,
  Globe,
  Briefcase,
  Heart,
  TrendingUp,
  Clock,
  Users,
  Plane,
  Crown,
  Home,
  HeartHandshake,
  Zap,
  Brain,
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { StickyGroundTruthBadge } from './StickyGroundTruthBadge';
import { VedicGroundTruths, ConsultationPersona } from '../../lib/services/EnhancedGeminiConsultationService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    queryDomain?: string;
    persona?: ConsultationPersona;
    confidence?: number;
    kpGroundTruths?: VedicGroundTruths;
  };
}

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  streamingText?: string;
  bufferedStreamingText?: string;
  activeLens: ConsultationPersona;
  onSetLens: (persona: ConsultationPersona) => void;
  onSubmitQuery: (query: string) => void;
  onStopGenerating: () => void;
  error?: string | null;
  suggestedQueries: string[];
  followUpChips: string[];
  onToggleFacts: () => void;
  showFacts: boolean;
  onOpenInspector: () => void;
  onToggleMobileSidebar: () => void;
  kpGroundTruths: VedicGroundTruths;
  language?: 'en' | 'hi' | 'te';
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  streamingText,
  bufferedStreamingText,
  activeLens,
  onSetLens,
  onSubmitQuery,
  onStopGenerating,
  error,
  suggestedQueries,
  followUpChips,
  onToggleFacts,
  showFacts,
  onOpenInspector,
  onToggleMobileSidebar,
  kpGroundTruths,
  language = 'en'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message or streaming text
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, streamingText, isLoading]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 180);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  const handleFormSubmit = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    onSubmitQuery(text);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Web Speech API Voice Recognition setup
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser window. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Lens names map
  const lensNames: Record<ConsultationPersona, string> = {
    classical_parashari: 'Vedic Parashari Focus',
    vedic_divisional: 'Divisional Charts & Yogas',
    vedic_remedial: 'Vedic Remedies & Upaya',
    kp_stellar: 'KP Stellar Astrology',
    quick: 'QUICK Astro Engine (Telugu)'
  };

  const cycleLens = () => {
    if (activeLens === 'classical_parashari') onSetLens('vedic_divisional');
    else if (activeLens === 'vedic_divisional') onSetLens('vedic_remedial');
    else onSetLens('classical_parashari');
  };

  // 15 Preloaded Consultations
  const categorizedQueries = [
    {
      num: 1,
      category: 'Job or Business?',
      icon: <Briefcase className="w-3.5 h-3.5 text-sky-400" />,
      query: 'Job or Business? Which is more favorable and prosperous for my career based on my 10th, 6th, and 7th houses?'
    },
    {
      num: 2,
      category: 'Love Marriage or Arranged?',
      icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
      query: 'Love Marriage or Arranged? Does my chart indicate a love marriage or arranged marriage based on 5th, 7th houses and Venus?'
    },
    {
      num: 3,
      category: 'Why Do People Misunderstand You?',
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" />,
      query: 'Why Do People Misunderstand You? What astrological placements, Moon aspects, or 1st/8th house influences cause misunderstandings?'
    },
    {
      num: 4,
      category: 'Late Marriage Checker',
      icon: <Clock className="w-3.5 h-3.5 text-orange-400" />,
      query: 'Late Marriage Checker: Is there any planetary delay in my marriage timing based on Saturn, 7th cusp sub-lord, or Rahu/Ketu?'
    },
    {
      num: 5,
      category: 'How Will Your Married Life Be?',
      icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
      query: 'How Will Your Married Life Be? What does my 7th house, Navamsha (D-9), and Venus indicate about marital happiness and spouse nature?'
    },
    {
      num: 6,
      category: 'Will You Work with Your Partner?',
      icon: <Users className="w-3.5 h-3.5 text-indigo-400" />,
      query: 'Will You Professionally Work with Your Partner? Do my 7th and 10th houses support professional partnership or business with my spouse?'
    },
    {
      num: 7,
      category: 'Foreign Settlement?',
      icon: <Plane className="w-3.5 h-3.5 text-teal-400" />,
      query: 'Foreign Settlement? Does my chart promise travel abroad, higher education overseas, or permanent foreign settlement (3rd, 9th, 12th houses)?'
    },
    {
      num: 8,
      category: 'Do You Have Neech Bhang Raj Yoga?',
      icon: <Crown className="w-3.5 h-3.5 text-yellow-400" />,
      query: 'Do You Have Neech Bhang Raj Yoga? Are there any debilitated planets whose debility is cancelled into a powerful Neech Bhang Raj Yoga?'
    },
    {
      num: 9,
      category: 'Will You Get Along With In-Laws?',
      icon: <Home className="w-3.5 h-3.5 text-emerald-400" />,
      query: 'Will You Get Along With Your In-Laws? What do my 8th house and planetary placements indicate about my relationship with in-laws?'
    },
    {
      num: 10,
      category: 'Partner Along With Parents?',
      icon: <HeartHandshake className="w-3.5 h-3.5 text-violet-400" />,
      query: 'Will Your Partner Get Along With Your Parents? How will the harmony and relationship be between my spouse and my parents (4th/9th houses)?'
    },
    {
      num: 11,
      category: 'Will Your Raj Yogas Activate?',
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      query: 'Will Your Raj Yogas Actually Activate? Which Raj Yogas exist in my chart, and in which Dasha-Antardasha periods will they trigger success?'
    },
    {
      num: 12,
      category: 'Overthinking Checker',
      icon: <Brain className="w-3.5 h-3.5 text-cyan-400" />,
      query: 'Overthinking Checker: Does my Moon, Mercury, 5th house, or Rahu placement create mental restlessness, anxiety, or overthinking?'
    },
    {
      num: 13,
      category: 'Vedic Sun Sign',
      icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
      query: 'Vedic Sun Sign: What is my Vedic Sun Sign (Surya Rasi) and house placement, and what does it reveal about my soul purpose, vitality, and authority?'
    },
    {
      num: 14,
      category: 'Vedic Moon Sign',
      icon: <Moon className="w-3.5 h-3.5 text-blue-400" />,
      query: 'Vedic Moon Sign: What is my Vedic Moon Sign (Chandra Rasi) and Nakshatra, and what does it reveal about my mind, emotions, and temperament?'
    },
    {
      num: 15,
      category: 'Ascendant (Lagna)',
      icon: <Compass className="w-3.5 h-3.5 text-emerald-500" />,
      query: 'Ascendant (Lagna): What is my Ascendant (Lagna) sign and its lord, and what does it signify for my physical constitution, personality, and life path?'
    }
  ];

  return (
    <div className="ai-chat-panel" role="main" aria-label="AI Consultation Chat Interface">
      {/* Chat Header */}
      <div className="ai-chat-header">
        <div className="chat-title-group">
          <div className="flex items-center gap-2">
            <button
              className="menu-toggle focus-ring"
              onClick={onToggleMobileSidebar}
              title="Toggle Navigation Sidebar"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="chat-title">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>KP Stellar AI Assistant</span>
            </h1>
          </div>
          <p className="chat-subtitle">⚡ Gemini 3.6 Flash • Deterministic Gatekeepers</p>
        </div>

        <div className="chat-header-actions">
          <div className="lens-indicator flex items-center gap-1.5">
            <span className="hidden lg:inline text-[11px] text-[#94A3B8]">Lens:</span>
            <span className="active-lens px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-xs font-mono font-bold">
              {lensNames[activeLens]}
            </span>
            <button
              className="lens-override-btn hover:text-amber-300 text-xs font-mono text-amber-400 underline cursor-pointer focus-ring"
              onClick={cycleLens}
              title="Switch Astrological Lens"
              aria-label="Switch Lens"
            >
              Switch Lens ↺
            </button>
          </div>

          <button
            className="header-icon-btn focus-ring"
            title="Toggle Astrological Facts"
            onClick={onToggleFacts}
            aria-label="Toggle Astrological Facts"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono hidden sm:inline">{showFacts ? 'Hide Facts' : 'Facts'}</span>
          </button>

          <button
            className="header-icon-btn focus-ring"
            title="Open Ground Truth Inspector"
            onClick={onOpenInspector}
            aria-label="Open Ground Truth Inspector"
          >
            <Sliders className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-mono hidden sm:inline">Inspector</span>
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="ai-chat-window" id="ai-chat-window" ref={scrollContainerRef} aria-live="polite">
        {/* Sticky Ground Truth Summary Badge */}
        <StickyGroundTruthBadge
          groundTruths={kpGroundTruths}
          onOpenInspector={onOpenInspector}
          language={language}
        />

        {messages.length === 0 ? (
          /* Empty State / Onboarding */
          <div className="chat-empty-state" id="chat-empty-state">
            <div className="empty-content max-w-xl mx-auto text-center space-y-4 py-4">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-serif font-bold text-[#F8FAFC]">
                Welcome to KP Stellar AI Consultation
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Ask about your Dasha timing, marriage, career moves, or financial prosperity.
                Every response is verified against deterministic KP Cusp Sub-Lord Gatekeeper rules.
              </p>

              {/* Categorized Quick Queries */}
              <div className="pt-2 text-left space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block text-center">
                  Select a topic to start your consultation ↓
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categorizedQueries.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSubmitQuery(item.query)}
                      className="p-3.5 rounded-ds-xl bg-ds-surface border border-ds-outline hover:border-ds-primary/60 text-xs text-ds-on-surface hover:text-ds-primary transition-all cursor-pointer text-left leading-relaxed flex flex-col gap-1.5 group focus-ring"
                    >
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 group-hover:text-amber-300">
                        {item.icon}
                        <span>{item.category}</span>
                      </div>
                      <span className="text-[#CBD5E1] text-xs line-clamp-2">{item.query}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages List */
          <div className="chat-messages" id="chat-messages">
            {messages.map((msg, idx) => (
              <article
                key={msg.id || idx}
                className={`message-wrapper ${
                  msg.role === 'user' ? 'user-message-wrapper' : 'ai-message-wrapper'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="message-avatar">🤖</div>
                )}

                <div
                  className={`message-bubble ${
                    msg.role === 'user' ? 'user-bubble' : 'ai-bubble'
                  }`}
                >
                  <div className="message-text">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-base font-serif font-bold text-amber-400 mt-3 mb-1.5">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-sm font-serif font-bold text-amber-400 mt-3 mb-1.5">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-xs font-serif font-bold text-amber-300 mt-2 mb-1">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-xs sm:text-sm text-[#F1F5F9] my-1.5 leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="my-2 space-y-1 list-disc pl-5 text-xs sm:text-sm">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="text-xs sm:text-sm text-[#F1F5F9] my-0.5">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold text-amber-300">{children}</strong>
                          )
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>

                  {/* Assistant Message Actions & Scaffolding */}
                  {msg.role === 'assistant' && (
                    <div className="pt-3 border-t border-[#334155]/60 mt-3 space-y-2">
                      {/* Response Metadata */}
                      <div className="message-metadata flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#94A3B8]">
                        <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          {lensNames[msg.metadata?.persona || activeLens]}
                        </span>
                        {msg.metadata?.confidence && (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            {msg.metadata.confidence}% Confidence
                          </span>
                        )}
                        {msg.metadata?.queryDomain && (
                          <span className="bg-sky-500/10 text-sky-300 border border-sky-500/20 px-1.5 py-0.5 rounded">
                            Domain: {msg.metadata.queryDomain}
                          </span>
                        )}
                      </div>

                      {/* Response Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={onOpenInspector}
                          className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#334155] hover:border-teal-500/50 text-[11px] font-mono text-teal-300 flex items-center gap-1 cursor-pointer focus-ring"
                          aria-label="Inspect Ground Truth for this answer"
                        >
                          <Search className="w-3 h-3 text-teal-400" />
                          <span>Inspect Ground Truth</span>
                        </button>

                        <button
                          onClick={() => onSubmitQuery(`Provide more details regarding: ${msg.content.slice(0, 50)}...`)}
                          className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#334155] hover:border-amber-500/50 text-[11px] font-mono text-amber-300 flex items-center gap-1 cursor-pointer focus-ring"
                          aria-label="Ask follow up question"
                        >
                          <MessageSquare className="w-3 h-3 text-amber-400" />
                          <span>Ask Follow-up</span>
                        </button>

                        <button
                          onClick={() => onSubmitQuery("How do current planetary transits (Gochara) modify this timing?")}
                          className="px-2.5 py-1 rounded bg-[#0F172A] border border-[#334155] hover:border-sky-500/50 text-[11px] font-mono text-sky-300 flex items-center gap-1 cursor-pointer focus-ring"
                          aria-label="Check Gochara transits"
                        >
                          <Globe className="w-3 h-3 text-sky-400" />
                          <span>Gochara Transits</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="message-timestamp text-[10px] text-[#64748B] mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {msg.role === 'assistant' && (
                  <button
                    className="message-copy-btn p-1.5 rounded bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:text-white focus-ring"
                    title="Copy message"
                    aria-label="Copy message text"
                    onClick={() => handleCopy(msg.content, idx)}
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </article>
            ))}

            {/* Live Streaming Buffer Preview */}
            {(streamingText || bufferedStreamingText) && (
              <div className="message-wrapper ai-message-wrapper">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble ai-bubble border-sky-500/50">
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#334155] text-sky-400 text-xs font-mono font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Streaming Response...</span>
                  </div>
                  <div className="message-text">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="text-xs sm:text-sm text-[#F1F5F9] my-1 leading-relaxed">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-amber-300">{children}</strong>
                        )
                      }}
                    >
                      {bufferedStreamingText || streamingText}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Skeleton Loading State with Multi-step Progress */}
            {isLoading && !streamingText && !bufferedStreamingText && (
              <div className="message-wrapper ai-message-wrapper">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble ai-bubble p-4 space-y-2 border border-amber-500/30 bg-[#0F172A]/90">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Analyzing Chart via Gemini 3.6 Flash...</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono text-[#94A3B8] pl-6 border-l-2 border-amber-500/30">
                    <div className="text-teal-300 font-semibold">1. Computing KP Placidus Cuspal Sub-Lords ✓</div>
                    <div className="text-amber-300 font-semibold animate-pulse">2. Evaluating Active Dasha-Bhukti Gatekeeper Rules...</div>
                    <div className="text-[#64748B]">3. Synthesizing Astrological Recommendations...</div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Notification Banner */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-mono flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Consultation notice: {error}</span>
                </div>
                <button
                  onClick={() => onSubmitQuery("Retry last question")}
                  className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 rounded text-[11px] font-mono cursor-pointer focus-ring"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Follow-up Query Chips */}
            {messages.length > 0 && !isLoading && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Suggested Follow-up Questions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {followUpChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSubmitQuery(chip)}
                      className="px-3 py-1.5 rounded-lg bg-[#1A2332] border border-[#334155] hover:border-amber-500/60 text-xs text-[#D1D5DB] hover:text-amber-300 transition-all cursor-pointer text-left flex items-center gap-1.5 focus-ring"
                      aria-label={`Ask follow up: ${chip}`}
                    >
                      <span className="text-amber-400 font-bold text-[10px]">↳</span>
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Input Area */}
      <div className="ai-chat-input-area">
        <form
          className="ai-chat-form"
          id="ai-chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }}
        >
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              className="ai-chat-textarea focus-ring"
              id="ai-chat-input"
              placeholder="Type your astrological query... (e.g. When will I get a career promotion?)"
              rows={2}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              aria-label="Astrological Query Input"
            />
          </div>

          {/* Input Footer */}
          <div className="input-footer flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-2">
            <span className="char-count text-[11px] text-[#64748B] text-center sm:text-left">
              {inputValue.length} characters • Cmd/Ctrl+Enter to send
            </span>

            {isLoading ? (
              <button
                type="button"
                className="submit-button loading w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white cursor-pointer py-2.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 focus-ring"
                onClick={onStopGenerating}
                aria-label="Stop Generating"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                className="submit-button w-full sm:w-auto bg-ds-primary hover:bg-ds-primary/90 text-ds-surface font-extrabold py-2.5 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 focus-ring"
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Submit Query"
              >
                <Send className="w-4 h-4" />
                <span>Ask Question</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
