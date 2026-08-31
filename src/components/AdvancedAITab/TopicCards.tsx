import React, { useState } from 'react';
import {
  Briefcase,
  Heart,
  HelpCircle,
  Clock,
  Sparkles,
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
import { BirthDetails } from '../../types';

export interface TopicTemplate {
  id: string;
  num: number;
  lucideIcon: React.ReactNode;
  title: string;
  subtitle: string;
  category: 'Career' | 'Marriage' | 'Yogas' | 'Mind' | 'Vedic';
  query: string;
}

export const DEFAULT_TOPICS: TopicTemplate[] = [
  {
    id: 'job-or-business',
    num: 1,
    lucideIcon: <Briefcase className="w-4 h-4 text-sky-400" />,
    title: 'Job or Business?',
    subtitle: '10th, 6th & 7th House career path',
    category: 'Career',
    query: 'Job or Business? Which is more favorable and prosperous for my career based on my 10th, 6th, and 7th houses?'
  },
  {
    id: 'love-or-arranged-marriage',
    num: 2,
    lucideIcon: <Heart className="w-4 h-4 text-rose-400" />,
    title: 'Love Marriage or Arranged?',
    subtitle: '5th & 7th House, Venus & D9 promise',
    category: 'Marriage',
    query: 'Love Marriage or Arranged? Does my chart indicate a love marriage or arranged marriage based on 5th, 7th houses and Venus?'
  },
  {
    id: 'why-misunderstood',
    num: 3,
    lucideIcon: <HelpCircle className="w-4 h-4 text-amber-400" />,
    title: 'Why Do People Misunderstand You?',
    subtitle: 'Moon, Lagna & 8th House dynamics',
    category: 'Mind',
    query: 'Why Do People Misunderstand You? What astrological placements, Moon aspects, or 1st/8th house influences cause misunderstandings?'
  },
  {
    id: 'late-marriage-checker',
    num: 4,
    lucideIcon: <Clock className="w-4 h-4 text-orange-400" />,
    title: 'Late Marriage Checker',
    subtitle: 'Saturn delay & 7th cusp sub-lord timing',
    category: 'Marriage',
    query: 'Late Marriage Checker: Is there any planetary delay in my marriage timing based on Saturn, 7th cusp sub-lord, or Rahu/Ketu?'
  },
  {
    id: 'married-life-quality',
    num: 5,
    lucideIcon: <Sparkles className="w-4 h-4 text-pink-400" />,
    title: 'How Will Your Married Life Be?',
    subtitle: '7th House, Navamsha & marital harmony',
    category: 'Marriage',
    query: 'How Will Your Married Life Be? What does my 7th house, Navamsha (D-9), and Venus indicate about marital happiness and spouse nature?'
  },
  {
    id: 'work-with-partner',
    num: 6,
    lucideIcon: <Users className="w-4 h-4 text-indigo-400" />,
    title: 'Will You Work with Your Partner?',
    subtitle: '7th & 10th House business synergy',
    category: 'Career',
    query: 'Will You Professionally Work with Your Partner? Do my 7th and 10th houses support professional partnership or business with my spouse?'
  },
  {
    id: 'foreign-settlement',
    num: 7,
    lucideIcon: <Plane className="w-4 h-4 text-teal-400" />,
    title: 'Foreign Settlement?',
    subtitle: '3rd, 9th & 12th House relocation promise',
    category: 'Career',
    query: 'Foreign Settlement? Does my chart promise travel abroad, higher education overseas, or permanent foreign settlement (3rd, 9th, 12th houses)?'
  },
  {
    id: 'neech-bhang-raj-yoga',
    num: 8,
    lucideIcon: <Crown className="w-4 h-4 text-yellow-400" />,
    title: 'Do You Have Neech Bhang Raj Yoga?',
    subtitle: 'Debility cancellations & sudden elevation',
    category: 'Yogas',
    query: 'Do You Have Neech Bhang Raj Yoga? Are there any debilitated planets whose debility is cancelled into a powerful Neech Bhang Raj Yoga?'
  },
  {
    id: 'along-with-inlaws',
    num: 9,
    lucideIcon: <Home className="w-4 h-4 text-emerald-400" />,
    title: 'Will You Get Along With In-Laws?',
    subtitle: '8th House & in-law bonding analysis',
    category: 'Marriage',
    query: 'Will You Get Along With Your In-Laws? What do my 8th house and planetary placements indicate about my relationship with in-laws?'
  },
  {
    id: 'partner-with-parents',
    num: 10,
    lucideIcon: <HeartHandshake className="w-4 h-4 text-violet-400" />,
    title: 'Partner Along With Parents?',
    subtitle: '4th & 9th House harmony with family',
    category: 'Marriage',
    query: 'Will Your Partner Get Along With Your Parents? How will the harmony and relationship be between my spouse and my parents (4th/9th houses)?'
  },
  {
    id: 'raj-yogas-activate',
    num: 11,
    lucideIcon: <Zap className="w-4 h-4 text-amber-400" />,
    title: 'Will Your Raj Yogas Activate?',
    subtitle: 'Dasha activation windows & peak periods',
    category: 'Yogas',
    query: 'Will Your Raj Yogas Actually Activate? Which Raj Yogas exist in my chart, and in which Dasha-Antardasha periods will they trigger success?'
  },
  {
    id: 'overthinking-checker',
    num: 12,
    lucideIcon: <Brain className="w-4 h-4 text-cyan-400" />,
    title: 'Overthinking Checker',
    subtitle: 'Moon-Mercury-Rahu anxiety patterns',
    category: 'Mind',
    query: 'Overthinking Checker: Does my Moon, Mercury, 5th house, or Rahu placement create mental restlessness, anxiety, or overthinking?'
  },
  {
    id: 'vedic-sun-sign',
    num: 13,
    lucideIcon: <Sun className="w-4 h-4 text-amber-500" />,
    title: 'Vedic Sun Sign',
    subtitle: 'Surya Rasi, vitality & soul purpose',
    category: 'Vedic',
    query: 'Vedic Sun Sign: What is my Vedic Sun Sign (Surya Rasi) and house placement, and what does it reveal about my soul purpose, vitality, and authority?'
  },
  {
    id: 'vedic-moon-sign',
    num: 14,
    lucideIcon: <Moon className="w-4 h-4 text-blue-400" />,
    title: 'Vedic Moon Sign',
    subtitle: 'Chandra Rasi, Nakshatra & emotional mind',
    category: 'Vedic',
    query: 'Vedic Moon Sign: What is my Vedic Moon Sign (Chandra Rasi) and Nakshatra, and what does it reveal about my mind, emotions, and temperament?'
  },
  {
    id: 'ascendant-lagna',
    num: 15,
    lucideIcon: <Compass className="w-4 h-4 text-emerald-500" />,
    title: 'Ascendant (Lagna)',
    subtitle: 'Lagna sign, lord & primary life trajectory',
    category: 'Vedic',
    query: 'Ascendant (Lagna): What is my Ascendant (Lagna) sign and its lord, and what does it signify for my physical constitution, personality, and life path?'
  }
];

interface TopicCardsProps {
  onSelectTopic: (queryText: string) => void;
  summaryText?: string;
  birthDetails?: BirthDetails;
}

export const TopicCards: React.FC<TopicCardsProps> = ({ onSelectTopic, summaryText, birthDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const defaultSummaryText = "You are born with an Aquarius Ascendant ruled by Saturn, giving a resilient, structured life path. Your emotional mind is centered in Moon in Libra (Vishakha - Pada 3), while your core identity and soul purpose align with Sun in Libra. You are currently navigating the active period of Mercury Mahadasha — specifically the Venus Antardasha and Venus Pratyantardasha.";

  const profileText = birthDetails
    ? `${birthDetails.name}, ${birthDetails.date} at ${birthDetails.time}, ${birthDetails.place}`
    : "I. MEENAKSHI, 1949-08-08 at 11:00:00, Jaggampeta";

  const categories = [
    { id: 'All', label: 'All 15 Questions' },
    { id: 'Career', label: 'Career & Business' },
    { id: 'Marriage', label: 'Marriage & Family' },
    { id: 'Yogas', label: 'Raj Yogas' },
    { id: 'Mind', label: 'Mind & Personality' },
    { id: 'Vedic', label: 'Core Vedic' }
  ];

  const filteredTopics = selectedCategory === 'All'
    ? DEFAULT_TOPICS
    : DEFAULT_TOPICS.filter(t => t.category === selectedCategory);

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 px-2 sm:px-4 animate-fade-in space-y-3">
      <div className="text-center space-y-1.5">
        <div className="text-[11px] sm:text-xs font-bold font-mono text-ds-primary bg-ds-primary/10 border border-ds-primary/20 px-3 py-1 rounded-xl inline-block max-w-full truncate shadow-2xs">
          {profileText}
        </div>
        <p className="text-xs sm:text-sm text-ds-on-surface-variant leading-relaxed max-w-2xl mx-auto font-sans font-medium">
          {summaryText || defaultSummaryText}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-1.5 pt-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-ds-primary text-ds-on-primary shadow-xs'
                : 'bg-ds-surface border border-ds-secondary/15 text-ds-on-surface-variant hover:text-ds-secondary hover:border-ds-secondary/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 15 Question Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
        {filteredTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.query)}
            className="group p-3 bg-ds-surface border border-ds-secondary/15 hover:border-ds-primary/60 rounded-xl text-left transition-all duration-200 hover:-translate-y-0.5 shadow-xs hover:shadow-sm cursor-pointer flex flex-col justify-between space-y-2 min-h-[82px]"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-lg bg-ds-surface-container border border-ds-secondary/10 group-hover:border-ds-primary/20 transition-colors">
                {topic.lucideIcon}
              </div>
              <span className="text-[10px] font-bold text-ds-primary bg-ds-primary/10 px-1.5 py-0.5 rounded">
                #{topic.num}
              </span>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-bold text-ds-secondary group-hover:text-ds-primary transition-colors line-clamp-1">
                {topic.title}
              </h3>
              <p className="text-[10.5px] text-ds-on-surface-variant mt-0.5 line-clamp-1 font-medium">
                {topic.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
