// ─── Chapter Content Data ─────────────────────────────────────────────────────

export interface VowelItem {
  korean: string
  romanization: string
  sound: string
  assamese?: string
}

export interface ConsonantItem {
  korean: string
  romanization: string
  sound: string
  tense?: boolean
}

export interface WordItem {
  korean: string
  romanization: string
  english: string
  assamese?: string
}

export interface ConversationLine {
  speaker: 'A' | 'B'
  korean: string
  english: string
  assamese?: string
}

export interface NumberItem {
  korean: string
  romanization: string
  value: number
  assamese?: string
}

export interface OccupationItem {
  korean: string
  romanization: string
  english: string
  assamese?: string
}

export interface CountryItem {
  korean: string
  romanization: string
  english: string
  assamese?: string
  flag: string
}

export interface Chapter {
  slug: string
  number: number
  title: string
  titleKo: string
  description: string
  accent: string
  tint: string
  border: string
  icon: string
}

// ─── Chapter Index ────────────────────────────────────────────────────────────

export const CHAPTERS: Chapter[] = [
  {
    slug: 'vowels',
    number: 1,
    title: 'Vowels',
    titleKo: '모음',
    description: 'Learn all basic and compound Korean vowels with pronunciation.',
    accent: '#8B1E24',
    tint: '#FEF3F0',
    border: '#F5CECA',
    icon: '아',
  },
  {
    slug: 'consonants',
    number: 2,
    title: 'Consonants',
    titleKo: '자음',
    description: 'Basic consonants and tense (double) consonants with pronunciation.',
    accent: '#2D5F7A',
    tint: '#EBF3F8',
    border: '#B5D4E8',
    icon: 'ㄱ',
  },
  {
    slug: 'making-simple-words',
    number: 3,
    title: 'Making Simple Words',
    titleKo: '간단한 단어 만들기',
    description: 'Combine vowels and consonants into real everyday Korean words.',
    accent: '#3B6B3A',
    tint: '#EEF5EE',
    border: '#BDD4BD',
    icon: '📝',
  },
  {
    slug: 'sino-korean-numbers',
    number: 4,
    title: 'Sino-Korean Numbers',
    titleKo: '한자 숫자',
    description: 'Count in Sino-Korean — used for dates, money, floors, and phone numbers.',
    accent: '#6B5C3E',
    tint: '#F4F0E8',
    border: '#DDD4BE',
    icon: '🔢',
  },
  {
    slug: 'introducing-yourself',
    number: 5,
    title: 'Introducing Yourself',
    titleKo: '자기소개',
    description: 'Say your name, country, and occupation — a complete self-introduction.',
    accent: '#6B3A7A',
    tint: '#F5EEF8',
    border: '#D4B5E8',
    icon: '👋',
  },
  {
    slug: 'native-korean-numbers',
    number: 6,
    title: 'Native Korean Numbers',
    titleKo: '순우리말 숫자',
    description: 'The native counting system for age, hours, and objects.',
    accent: '#8B6B1A',
    tint: '#FBF5E6',
    border: '#DDD4A0',
    icon: '🔢',
  },
]

// ─── Chapter 1: Vowels ────────────────────────────────────────────────────────

export const BASIC_VOWELS: VowelItem[] = [
  { korean: '아', romanization: 'a',   sound: '"ah"',         assamese: 'অ' },
  { korean: '야', romanization: 'ya',  sound: '"ya"',         assamese: 'য়া' },
  { korean: '어', romanization: 'eo',  sound: '"uh"',         assamese: 'এ' },
  { korean: '여', romanization: 'yeo', sound: '"yuh"',        assamese: 'য়ে' },
  { korean: '오', romanization: 'o',   sound: '"oh"',         assamese: 'অ' },
  { korean: '요', romanization: 'yo',  sound: '"yo"',         assamese: 'য়' },
  { korean: '우', romanization: 'u',   sound: '"oo"',         assamese: 'উ' },
  { korean: '유', romanization: 'yu',  sound: '"you"',        assamese: 'য়ু' },
  { korean: '으', romanization: 'eu',  sound: '"uh" (lips flat)' },
  { korean: '이', romanization: 'i',   sound: '"ee"',         assamese: 'ই' },
]

export const COMPOUND_VOWELS: VowelItem[] = [
  { korean: '애', romanization: 'ae',  sound: '"eh"' },
  { korean: '에', romanization: 'e',   sound: '"eh"' },
  { korean: '의', romanization: 'ui',  sound: '"eui" (unique)' },
  { korean: '와', romanization: 'wa',  sound: '"wa"',  assamese: 'ৱা' },
  { korean: '워', romanization: 'wo',  sound: '"wuh"' },
  { korean: '왜', romanization: 'wae', sound: '"weh"' },
  { korean: '웨', romanization: 'we',  sound: '"weh"' },
  { korean: '위', romanization: 'wi',  sound: '"wee"' },
  { korean: '외', romanization: 'oe',  sound: '"weh"' },
  { korean: '얘', romanization: 'yae', sound: '"yeh"' },
  { korean: '예', romanization: 'ye',  sound: '"yeh"' },
]

// ─── Chapter 2: Consonants ────────────────────────────────────────────────────

export const BASIC_CONSONANTS: ConsonantItem[] = [
  { korean: 'ㄱ', romanization: 'g / k',  sound: '"g" at start · "k" at end' },
  { korean: 'ㄴ', romanization: 'n',      sound: '"n"' },
  { korean: 'ㄷ', romanization: 'd / t',  sound: '"d" at start · "t" at end' },
  { korean: 'ㄹ', romanization: 'r / l',  sound: '"r" at start · "l" at end' },
  { korean: 'ㅁ', romanization: 'm',      sound: '"m"' },
  { korean: 'ㅂ', romanization: 'b / p',  sound: '"b" at start · "p" at end' },
  { korean: 'ㅅ', romanization: 's',      sound: '"s"' },
  { korean: 'ㅇ', romanization: '— / ng', sound: 'silent at start · "ng" at end' },
  { korean: 'ㅈ', romanization: 'j',      sound: '"j"' },
  { korean: 'ㅊ', romanization: 'ch',     sound: '"ch" (aspirated)' },
  { korean: 'ㅋ', romanization: 'k',      sound: '"k" (aspirated)' },
  { korean: 'ㅌ', romanization: 't',      sound: '"t" (aspirated)' },
  { korean: 'ㅍ', romanization: 'p',      sound: '"p" (aspirated)' },
  { korean: 'ㅎ', romanization: 'h',      sound: '"h"' },
]

export const TENSE_CONSONANTS: ConsonantItem[] = [
  { korean: 'ㄲ', romanization: 'kk', sound: 'tense "k" — like holding breath before "k"', tense: true },
  { korean: 'ㄸ', romanization: 'tt', sound: 'tense "t" — sharper, no aspiration',           tense: true },
  { korean: 'ㅃ', romanization: 'pp', sound: 'tense "p" — stronger push of lips',             tense: true },
  { korean: 'ㅆ', romanization: 'ss', sound: 'tense "s" — sharper than ㅅ',                  tense: true },
  { korean: 'ㅉ', romanization: 'jj', sound: 'tense "j" — sharper than ㅈ',                  tense: true },
]

// ─── Chapter 3: Making Simple Words ──────────────────────────────────────────

export const SYLLABLE_BLOCKS = [
  { consonant: 'ㅂ', vowel: '아', result: '바', romanization: 'ba' },
  { consonant: 'ㄱ', vowel: '이', result: '기', romanization: 'gi' },
  { consonant: 'ㅁ', vowel: '우', result: '무', romanization: 'mu' },
  { consonant: 'ㄴ', vowel: '아', result: '나', romanization: 'na' },
  { consonant: 'ㅅ', vowel: '오', result: '소', romanization: 'so' },
  { consonant: 'ㄷ', vowel: '어', result: '더', romanization: 'deo' },
]

export const SIMPLE_WORDS: WordItem[] = [
  { korean: '나',   romanization: 'na',    english: 'I / me',       assamese: 'মই' },
  { korean: '너',   romanization: 'neo',   english: 'you',          assamese: 'তুমি' },
  { korean: '우리', romanization: 'uri',   english: 'we / us',      assamese: 'আমি' },
  { korean: '물',   romanization: 'mul',   english: 'water',        assamese: 'পানী' },
  { korean: '밥',   romanization: 'bap',   english: 'rice / meal',  assamese: 'ভাত' },
  { korean: '책',   romanization: 'chaek', english: 'book',         assamese: 'কিতাপ' },
  { korean: '집',   romanization: 'jip',   english: 'house / home', assamese: 'ঘৰ' },
  { korean: '눈',   romanization: 'nun',   english: 'eye / snow',   assamese: 'চকু / বৰফ' },
  { korean: '손',   romanization: 'son',   english: 'hand',         assamese: 'হাত' },
  { korean: '발',   romanization: 'bal',   english: 'foot',         assamese: 'ভৰি' },
  { korean: '입',   romanization: 'ip',    english: 'mouth',        assamese: 'মুখ' },
  { korean: '귀',   romanization: 'gwi',   english: 'ear',          assamese: 'কান' },
]

export const CHAPTER3_CONVERSATION: ConversationLine[] = [
  { speaker: 'A', korean: '이게 뭐예요?',       english: 'What is this?',    assamese: 'এইটো কি?' },
  { speaker: 'B', korean: '이것은 책이에요.',    english: 'This is a book.',  assamese: 'এইটো এখন কিতাপ।' },
  { speaker: 'A', korean: '저것은요?',           english: 'And that?',        assamese: 'আৰু সেইটো?' },
  { speaker: 'B', korean: '저것은 물이에요.',    english: 'That is water.',   assamese: 'সেইটো পানী।' },
]

// ─── Chapter 4: Sino-Korean Numbers ──────────────────────────────────────────

export const SINO_NUMBERS: NumberItem[] = [
  { korean: '일', romanization: 'il',    value: 1,    assamese: 'এক' },
  { korean: '이', romanization: 'i',     value: 2,    assamese: 'দুই' },
  { korean: '삼', romanization: 'sam',   value: 3,    assamese: 'তিনি' },
  { korean: '사', romanization: 'sa',    value: 4,    assamese: 'চাৰি' },
  { korean: '오', romanization: 'o',     value: 5,    assamese: 'পাঁচ' },
  { korean: '육', romanization: 'yuk',   value: 6,    assamese: 'ছয়' },
  { korean: '칠', romanization: 'chil',  value: 7,    assamese: 'সাত' },
  { korean: '팔', romanization: 'pal',   value: 8,    assamese: 'আঠ' },
  { korean: '구', romanization: 'gu',    value: 9,    assamese: 'ন' },
  { korean: '십', romanization: 'sip',   value: 10,   assamese: 'দহ' },
  { korean: '백', romanization: 'baek',  value: 100,  assamese: 'এশ' },
  { korean: '천', romanization: 'cheon', value: 1000, assamese: 'এহাজাৰ' },
]

export const SINO_USE_CASES = [
  { icon: '📅', title: 'Dates',        korean: '오월 삼일',    romanization: 'o-wol sam-il',      english: 'May 3rd',       assamese: 'মে মাহৰ ৩ তাৰিখ' },
  { icon: '💰', title: 'Money',        korean: '오천 원',      romanization: 'o-cheon won',        english: '5,000 won',     assamese: '৫,০০০ ৱন' },
  { icon: '🏢', title: 'Floors',       korean: '삼층',         romanization: 'sam-cheung',         english: '3rd floor',     assamese: 'তৃতীয় মহলা' },
  { icon: '📞', title: 'Phone',        korean: '공일공',       romanization: 'gong-il-gong',       english: '010',           assamese: '০১০' },
  { icon: '⏱', title: 'Minutes',      korean: '삼십 분',      romanization: 'sam-sip bun',        english: '30 minutes',    assamese: '৩০ মিনিট' },
]

export const CHAPTER4_CONVERSATION: ConversationLine[] = [
  { speaker: 'A', korean: '이거 얼마예요?',       english: 'How much is this?',  assamese: 'এইটোৰ দাম কিমান?' },
  { speaker: 'B', korean: '오천 원이에요.',        english: 'It is 5,000 won.',   assamese: 'পাঁচ হাজাৰ ৱন।' },
  { speaker: 'A', korean: '오늘 몇 월 며칠이에요?', english: 'What is today\'s date?', assamese: 'আজি কেইতাৰিখ?' },
  { speaker: 'B', korean: '오월 이십일일이에요.',   english: 'It is May 21st.',    assamese: 'মে মাহৰ একৈছ তাৰিখ।' },
]

// ─── Chapter 5: Introducing Yourself ─────────────────────────────────────────

export const COUNTRIES: CountryItem[] = [
  { korean: '인도',    romanization: 'Indo',      english: 'India',   assamese: 'ভাৰত',    flag: '🇮🇳' },
  { korean: '한국',    romanization: 'Hanguk',    english: 'Korea',   assamese: 'কোৰিয়া',  flag: '🇰🇷' },
  { korean: '일본',    romanization: 'Ilbon',     english: 'Japan',   assamese: 'জাপান',    flag: '🇯🇵' },
  { korean: '중국',    romanization: 'Jungguk',   english: 'China',   assamese: 'চীন',      flag: '🇨🇳' },
  { korean: '미국',    romanization: 'Miguk',     english: 'USA',     assamese: 'আমেৰিকা',  flag: '🇺🇸' },
  { korean: '영국',    romanization: 'Yeongguk',  english: 'UK',      assamese: 'ব্ৰিটেইন',  flag: '🇬🇧' },
  { korean: '네팔',    romanization: 'Nepal',     english: 'Nepal',   assamese: 'নেপাল',    flag: '🇳🇵' },
  { korean: '프랑스',  romanization: 'Peurangseu',english: 'France',  assamese: 'ফ্ৰান্স',  flag: '🇫🇷' },
]

export const OCCUPATIONS: OccupationItem[] = [
  { korean: '학생',     romanization: 'haksaeng',     english: 'Student',       assamese: 'ছাত্ৰ/ছাত্ৰী' },
  { korean: '선생님',   romanization: 'seonsaengnim', english: 'Teacher',       assamese: 'শিক্ষক' },
  { korean: '의사',     romanization: 'uisa',         english: 'Doctor',        assamese: 'চিকিৎসক' },
  { korean: '간호사',   romanization: 'ganhosa',      english: 'Nurse',         assamese: 'নাৰ্ছ' },
  { korean: '엔지니어', romanization: 'enjinieo',     english: 'Engineer',      assamese: 'অভিযন্তা' },
  { korean: '요리사',   romanization: 'yolisa',       english: 'Chef / Cook',   assamese: 'ৰান্ধনি' },
  { korean: '음악가',   romanization: 'eumakga',      english: 'Musician',      assamese: 'সংগীতশিল্পী' },
  { korean: '회사원',   romanization: 'hoesawon',     english: 'Office worker', assamese: 'কৰ্মচাৰী' },
]

export const INTRO_PHRASES: WordItem[] = [
  { korean: '저는 ___입니다.',       romanization: 'Jeoneun ___ imnida.',   english: 'I am ___.', assamese: 'মই ___।' },
  { korean: '제 이름은 ___이에요.',   romanization: 'Je ireumeun ___ ieyo.', english: 'My name is ___.', assamese: 'মোৰ নাম ___।' },
  { korean: '___에서 왔어요.',        romanization: '___ eseo wasseoyo.',    english: 'I am from ___.', assamese: 'মই ___ ৰ পৰা আহিছোঁ।' },
  { korean: '저는 ___이에요.',        romanization: 'Jeoneun ___ ieyo.',     english: 'I am a ___.', assamese: 'মই এজন/এগৰাকী ___।' },
  { korean: '반갑습니다.',            romanization: 'Bangapseumnida.',       english: 'Nice to meet you.', assamese: 'আপোনাক লগ পাই ভাল লাগিল।' },
]

export const CHAPTER5_CONVERSATION: ConversationLine[] = [
  { speaker: 'A', korean: '안녕하세요! 저는 프리야입니다. 인도에서 왔어요.',           english: 'Hello! I am Priya. I am from India.',             assamese: 'নমস্কাৰ! মই প্ৰিয়া। মই ভাৰতৰ পৰা আহিছোঁ।' },
  { speaker: 'B', korean: '안녕하세요! 저는 민준이에요. 한국에서 왔어요. 반갑습니다!', english: 'Hello! I am Minjun. I am from Korea. Nice to meet you!', assamese: 'নমস্কাৰ! মই মিনজুন। মই কোৰিয়াৰ পৰা আহিছোঁ। আপোনাক লগ পাই ভাল লাগিল!' },
  { speaker: 'A', korean: '저도 반갑습니다! 무슨 일 하세요?',                           english: 'Nice to meet you too! What do you do?',           assamese: 'মোৰো ভাল লাগিল! আপুনি কি কাম কৰে?' },
  { speaker: 'B', korean: '저는 학생이에요. 프리야 씨는요?',                            english: 'I am a student. What about you, Priya?',          assamese: 'মই এজন ছাত্ৰ। আপুনি?'},
  { speaker: 'A', korean: '저는 선생님이에요.',                                          english: 'I am a teacher.',                                 assamese: 'মই এগৰাকী শিক্ষক।' },
]

// ─── Chapter 6: Native Korean Numbers ────────────────────────────────────────

export const NATIVE_NUMBERS: NumberItem[] = [
  { korean: '하나', romanization: 'hana',    value: 1,  assamese: 'এটা' },
  { korean: '둘',   romanization: 'dul',     value: 2,  assamese: 'দুটা' },
  { korean: '셋',   romanization: 'set',     value: 3,  assamese: 'তিনিটা' },
  { korean: '넷',   romanization: 'net',     value: 4,  assamese: 'চাৰিটা' },
  { korean: '다섯', romanization: 'daseot',  value: 5,  assamese: 'পাঁচটা' },
  { korean: '여섯', romanization: 'yeoseot', value: 6,  assamese: 'ছটা' },
  { korean: '일곱', romanization: 'ilgop',   value: 7,  assamese: 'সাতটা' },
  { korean: '여덟', romanization: 'yeodeol', value: 8,  assamese: 'আঠটা' },
  { korean: '아홉', romanization: 'ahop',    value: 9,  assamese: 'নটা' },
  { korean: '열',   romanization: 'yeol',    value: 10, assamese: 'দহটা' },
  { korean: '스물', romanization: 'seumul',  value: 20, assamese: 'বিশটা' },
  { korean: '서른', romanization: 'seoreun', value: 30, assamese: 'ত্ৰিশটা' },
]

export const NATIVE_USE_CASES = [
  { icon: '🎂', title: 'Age',            korean: '스물다섯 살', romanization: 'seumul-daseot sal', english: '25 years old',      assamese: 'পঁচিশ বছৰ' },
  { icon: '🕐', title: 'Hours',          korean: '두 시',       romanization: 'du si',             english: '2 o\'clock',        assamese: 'দুই বাজিছে' },
  { icon: '🍎', title: 'Counting',       korean: '사과 세 개',  romanization: 'sagwa se gae',      english: '3 apples',          assamese: 'তিনিটা আপেল' },
  { icon: '👥', title: 'People',         korean: '두 명',       romanization: 'du myeong',         english: '2 people',          assamese: 'দুজন মানুহ' },
  { icon: '🍶', title: 'Bottles / cups', korean: '물 한 병',    romanization: 'mul han byeong',    english: '1 bottle of water', assamese: 'এবটল পানী' },
]

export const CHAPTER6_CONVERSATION: ConversationLine[] = [
  { speaker: 'A', korean: '몇 살이에요?',              english: 'How old are you?',           assamese: 'আপোনাৰ বয়স কিমান?' },
  { speaker: 'B', korean: '저는 스물두 살이에요. 언니는요?', english: 'I am 22 years old. What about you?', assamese: 'মোৰ বয়স বাইশ বছৰ। আপোনাৰ?' },
  { speaker: 'A', korean: '저는 스물다섯 살이에요.',    english: 'I am 25 years old.',         assamese: 'মোৰ বয়স পঁচিশ বছৰ।' },
  { speaker: 'B', korean: '지금 몇 시예요?',            english: 'What time is it now?',       assamese: 'এতিয়া কেইটা বাজিছে?' },
  { speaker: 'A', korean: '지금 두 시 삼십 분이에요.',  english: 'It is 2:30 now.',            assamese: 'এতিয়া দুই বাজি ত্ৰিশ মিনিট।' },
]
