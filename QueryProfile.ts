/**
 * QueryProfile.ts
 *
 * Maps Vedic astrology query domains to their relevant houses, karakas,
 * and analysis parameters for the Parashari consultation framework.
 */

export type DomainType =
  | 'CAREER'
  | 'MARRIAGE'
  | 'WEALTH'
  | 'HEALTH'
  | 'SPIRITUALITY'
  | 'EDUCATION'
  | 'CHILDREN'
  | 'FOREIGN_TRAVEL'
  | 'FAMILY_RELATIONSHIPS'
  | 'LEGAL_LITIGATION'
  | 'LONGEVITY_AYUR'
  | 'GENERAL_PURPOSE';

export interface QueryProfile {
  domain: DomainType;
  primaryHouses: number[];
  secondaryHouses: number[];
  naisargikaKarakas: string[];
  charaKarakaRole?: string;
  divisionalCharts: string[];
  transitFocusPlanets: string[];
  keyYogas: string[];
  specialChecks: string[];
}

export const DOMAIN_HOUSE_MAPPING: Record<DomainType, QueryProfile> = {
  CAREER: {
    domain: 'CAREER',
    primaryHouses: [10],
    secondaryHouses: [6, 7, 2, 11, 1],
    naisargikaKarakas: ['Sun', 'Mercury', 'Saturn', 'Jupiter'],
    charaKarakaRole: 'Amatyakaraka (AmK)',
    divisionalCharts: ['D-9', 'D-10'],
    transitFocusPlanets: ['Saturn', 'Jupiter', 'Rahu'],
    keyYogas: ['Raja Yoga', 'Dharma-Karmadhipati Yoga', 'Pancha Mahapurusha', 'Amala Yoga'],
    specialChecks: ['10th lord in D-9 dignity', 'Dashamsha 10H', 'Sadesati career impact'],
  },
  MARRIAGE: {
    domain: 'MARRIAGE',
    primaryHouses: [7],
    secondaryHouses: [2, 11, 8, 12, 4],
    naisargikaKarakas: ['Venus', 'Jupiter'],
    charaKarakaRole: 'Darakaraka (DK)',
    divisionalCharts: ['D-9'],
    transitFocusPlanets: ['Jupiter', 'Venus', 'Saturn', 'Rahu'],
    keyYogas: ['Kuja Dosha', 'Kalathra Dosha', 'Parijata Yoga', 'Sama-Saptaka'],
    specialChecks: [
      'Venus dignity in D-1 and D-9',
      '7th lord in D-9',
      'Upapada Lagna (UL)',
      'D-9 7th house and its lord',
      'Guru Bala (Jupiter transit from Moon)',
    ],
  },
  WEALTH: {
    domain: 'WEALTH',
    primaryHouses: [2, 11],
    secondaryHouses: [5, 9, 1, 8, 12],
    naisargikaKarakas: ['Jupiter', 'Mercury'],
    charaKarakaRole: 'Putrakaraka (PK) / Bhratrikaraka (BK)',
    divisionalCharts: ['D-9', 'D-2'],
    transitFocusPlanets: ['Jupiter', 'Saturn'],
    keyYogas: ['Dhana Yoga', 'Lakshmi Yoga', 'Vasumathi Yoga', 'Daridra Yoga'],
    specialChecks: ['Indu Lagna', '2nd and 11th lord exchange', 'D-2 Hora distribution'],
  },
  HEALTH: {
    domain: 'HEALTH',
    primaryHouses: [6, 8],
    secondaryHouses: [1, 12, 3],
    naisargikaKarakas: ['Sun', 'Moon', 'Saturn', 'Mars'],
    divisionalCharts: ['D-9', 'D-6', 'D-8', 'D-30'],
    transitFocusPlanets: ['Saturn', 'Rahu', 'Ketu'],
    keyYogas: ['Roga Yogas', 'Arishta Yogas', 'Balarishta (if applicable)', 'Mrityu Bhaga'],
    specialChecks: [
      'Lagna Lord strength (vitality)',
      'Moon affliction by Saturn/Rahu',
      '6th lord placement and aspects',
      '8th lord placement (chronic vulnerability)',
      'Maraka lords (2nd and 7th) active in dasha',
    ],
  },
  SPIRITUALITY: {
    domain: 'SPIRITUALITY',
    primaryHouses: [9, 12],
    secondaryHouses: [5, 8, 4, 1],
    naisargikaKarakas: ['Jupiter', 'Ketu', 'Saturn'],
    charaKarakaRole: 'Atmakaraka (AK)',
    divisionalCharts: ['D-9', 'D-20'],
    transitFocusPlanets: ['Jupiter', 'Saturn', 'Ketu'],
    keyYogas: ['Pravrajya Yoga', 'Sanyasa Yoga', 'Moksha Yogas', 'Kedar Yoga'],
    specialChecks: [
      'Atmakaraka dignity and Navamsha sign (Karakamsha)',
      '12th house Ketu',
      '9th lord in Kendra/Trikona',
      'D-20 Vimsamsha disposition',
    ],
  },
  EDUCATION: {
    domain: 'EDUCATION',
    primaryHouses: [4, 5],
    secondaryHouses: [9, 2, 1],
    naisargikaKarakas: ['Mercury', 'Jupiter'],
    divisionalCharts: ['D-9', 'D-24'],
    transitFocusPlanets: ['Jupiter', 'Mercury'],
    keyYogas: ['Saraswati Yoga', 'Budhaditya Yoga', 'Kalanidhi Yoga'],
    specialChecks: [
      '4th house (formal schooling/graduation)',
      '5th house (intelligence, memory, discernment)',
      '9th house (higher degrees, research, philosophy)',
      'Mercury-Jupiter mutual relationship',
      'D-24 Chaturvimshamsha examination',
    ],
  },
  CHILDREN: {
    domain: 'CHILDREN',
    primaryHouses: [5],
    secondaryHouses: [9, 2, 11],
    naisargikaKarakas: ['Jupiter'],
    charaKarakaRole: 'Putrakaraka (PK)',
    divisionalCharts: ['D-9', 'D-7'],
    transitFocusPlanets: ['Jupiter', 'Saturn'],
    keyYogas: ['Putra Dosha', 'Santana Gopala Yoga', 'Bahuputra Yoga'],
    specialChecks: [
      '5th house occupants and aspects',
      '5th lord placement in D-1 and D-9',
      'Jupiter placement and dignity (Putrakaraka)',
      'Saptamsha (D-7) lagna and 5th house',
      'Beeja Sphuta (for men) / Kshetra Sphuta (for women)',
    ],
  },
  FOREIGN_TRAVEL: {
    domain: 'FOREIGN_TRAVEL',
    primaryHouses: [12, 9],
    secondaryHouses: [3, 7, 8, 4],
    naisargikaKarakas: ['Rahu', 'Moon'],
    divisionalCharts: ['D-9', 'D-4'],
    transitFocusPlanets: ['Rahu', 'Saturn', 'Jupiter'],
    keyYogas: ['Jala Yoga', 'Pravasa Yoga', '12th lord in Kendra/Trikona'],
    specialChecks: [
      '12th house (foreign land, settlement)',
      '9th house (long journeys, higher studies abroad)',
      '3rd house (short travel, visa/communication)',
      '4th house affliction (detachment from homeland)',
      'Movable signs (Chara Rasi: 1, 4, 7, 10) on 9H/12H',
      'Rahu connection to 9H/12H or Moon',
    ],
  },
  FAMILY_RELATIONSHIPS: {
    domain: 'FAMILY_RELATIONSHIPS',
    primaryHouses: [2, 4],
    secondaryHouses: [3, 7, 9, 11],
    naisargikaKarakas: ['Moon', 'Sun', 'Mars', 'Jupiter'],
    divisionalCharts: ['D-9', 'D-12'],
    transitFocusPlanets: ['Saturn', 'Jupiter', 'Rahu'],
    keyYogas: ['Matru Dosha', 'Pitri Dosha', 'Bhratri Dosha', 'Kutumba Saukhya Yoga'],
    specialChecks: [
      '2nd house (family harmony, speech)',
      '4th house (mother, domestic peace, home)',
      '3rd house and Mars (siblings)',
      '9th house and Sun (father)',
      'D-12 Dwadasamsha for parental analysis',
    ],
  },
  LEGAL_LITIGATION: {
    domain: 'LEGAL_LITIGATION',
    primaryHouses: [6, 8],
    secondaryHouses: [7, 12, 10, 1],
    naisargikaKarakas: ['Mars', 'Saturn', 'Rahu'],
    divisionalCharts: ['D-9', 'D-6'],
    transitFocusPlanets: ['Saturn', 'Mars', 'Rahu'],
    keyYogas: ['Shatru Jayam Yoga', 'Viparita Raja Yoga', 'Bandhana Yoga'],
    specialChecks: [
      '6th house (enemies, lawsuits, disputes)',
      '8th house (settlements, penalties, sudden verdicts)',
      '6th lord vs. Lagna lord strength (who wins the dispute)',
      '12th house (losses, incarceration, legal fees)',
      'Current dasha involvement with 6H/8H/12H lords',
    ],
  },
  LONGEVITY_AYUR: {
    domain: 'LONGEVITY_AYUR',
    primaryHouses: [8],
    secondaryHouses: [1, 3, 10, 12, 2, 7],
    naisargikaKarakas: ['Saturn'],
    divisionalCharts: ['D-9', 'D-8'],
    transitFocusPlanets: ['Saturn', 'Jupiter'],
    keyYogas: ['Alpayu / Madhyayu / Purnayu', 'Maraka Yogas', 'Mrityu Bhaga'],
    specialChecks: [
      '8th house and 8th lord (primary longevity)',
      '3rd house and 3rd lord (bhavat bhavam of 8H)',
      'Saturn (Ayushkaraka) dignity',
      'Lagna lord strength',
      'Maraka houses (2H, 7H) and lords',
      'Current dasha operating lords as potential marakas',
    ],
  },
  GENERAL_PURPOSE: {
    domain: 'GENERAL_PURPOSE',
    primaryHouses: [1, 5, 9, 10],
    secondaryHouses: [2, 11, 4, 7],
    naisargikaKarakas: ['Sun', 'Jupiter', 'Moon'],
    divisionalCharts: ['D-9'],
    transitFocusPlanets: ['Jupiter', 'Saturn', 'Rahu'],
    keyYogas: ['Raja Yoga', 'Dhana Yoga', 'Gajakesari Yoga', 'Budhaditya Yoga'],
    specialChecks: [
      'Lagna and Lagna lord overall strength',
      'Moon sign and Moon dispositor',
      'Current dasha lord operational role',
      'Sadesati status',
      'Major slow planet transits (Jupiter, Saturn)',
    ],
  },
};

export interface PreloadedQuestion {
  id: string;
  category: string;
  query: string;
  domain: DomainType;
}

export const PRELOADED_QUESTIONS: Record<string, PreloadedQuestion> = {
  q1: {
    id: 'q1',
    category: 'Career',
    query: 'Job or Business? Which is more favorable and prosperous for my career based on my 10th, 6th, and 7th houses?',
    domain: 'CAREER',
  },
  q2: {
    id: 'q2',
    category: 'Marriage',
    query: 'Love Marriage or Arranged? Does my chart indicate a love marriage or arranged marriage based on 5th, 7th houses and Venus?',
    domain: 'MARRIAGE',
  },
  q3: {
    id: 'q3',
    category: 'Mind',
    query: 'Why Do People Misunderstand You? What astrological placements, Moon aspects, or 1st/8th house influences cause misunderstandings?',
    domain: 'FAMILY_RELATIONSHIPS',
  },
  q4: {
    id: 'q4',
    category: 'Marriage',
    query: 'Late Marriage Checker: Is marriage delayed in my chart? When does the favorable window open based on dasha and transits?',
    domain: 'MARRIAGE',
  },
  q5: {
    id: 'q5',
    category: 'Career',
    query: 'Best Career Field: Which professional domain aligns best with my 10th house, Amatyakaraka, and planetary strengths?',
    domain: 'CAREER',
  },
  q6: {
    id: 'q6',
    category: 'Career',
    query: 'Promotion & Hike: When is my next career advancement or financial increment indicated by dasha and transits?',
    domain: 'CAREER',
  },
  q7: {
    id: 'q7',
    category: 'Wealth',
    query: 'Foreign Travel or Settlement: Does my chart promise overseas travel or settlement based on 9th, 12th houses, and Rahu?',
    domain: 'FOREIGN_TRAVEL',
  },
  q8: {
    id: 'q8',
    category: 'Wealth',
    query: 'Will I Be Rich? What is the wealth potential of my chart based on Dhana yogas, 2nd, 11th houses, and Jupiter?',
    domain: 'WEALTH',
  },
  q9: {
    id: 'q9',
    category: 'Yogas',
    query: 'Spiritual Inclination & Moksha: What spiritual yogas exist in my chart based on 9th, 12th houses, Ketu, and Atmakaraka?',
    domain: 'SPIRITUALITY',
  },
  q10: {
    id: 'q10',
    category: 'Mind',
    query: 'Mental Peace & Anxiety: What planetary factors affect my emotional well-being based on Moon, 4th house, and Mercury?',
    domain: 'HEALTH',
  },
  q11: {
    id: 'q11',
    category: 'Yogas',
    query: 'Raja Yogas in My Chart: Which major Raja Yogas are present and when will they activate during my lifetime?',
    domain: 'GENERAL_PURPOSE',
  },
  q12: {
    id: 'q12',
    category: 'Health',
    query: 'Health Vulnerabilities: Which health areas require vigilance based on 6th, 8th houses and afflicted planets?',
    domain: 'HEALTH',
  },
  q13: {
    id: 'q13',
    category: 'Children',
    query: 'Children & Progeny: What does my chart indicate regarding progeny timing and well-being based on 5th house and Jupiter?',
    domain: 'CHILDREN',
  },
  q14: {
    id: 'q14',
    category: 'Yogas',
    query: 'Property & Vehicle Purchase: When will I acquire real estate or vehicles based on 4th house and Venus/Mars?',
    domain: 'WEALTH',
  },
  q15: {
    id: 'q15',
    category: 'Yogas',
    query: 'Litigation & Dispute Resolution: What is the outcome of legal disputes or opposition based on 6th house and Shatru Jayam yogas?',
    domain: 'LEGAL_LITIGATION',
  },
};

export interface IQueryIntentRecognizer {
  recognize(userQuery: string, preloadedId?: string): QueryProfile;
}
