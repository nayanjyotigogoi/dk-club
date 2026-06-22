export type EventStatus = 'upcoming' | 'live' | 'completed'

export interface ClubEvent {
  slug: string
  title: string
  koreanTitle: string
  date: string
  dateISO: string
  time: string
  location: string
  category: string
  status: EventStatus
  description: string
  longDescription: string
  highlights: string[]
  image: string
  color: string
}

export const events: ClubEvent[] = [
  {
    slug: 'hangul-day-2026',
    title: 'Hangul Day Celebration',
    koreanTitle: '한글날 기념행사',
    date: '09 Oct, 2026',
    dateISO: '2026-10-09T10:00:00',
    time: '10:00 AM – 4:00 PM',
    location: 'DU Campus, Dibrugarh University',
    category: 'Cultural Celebration',
    status: 'upcoming',
    description: 'Celebrate the invention of the Korean alphabet with calligraphy, performances and traditional games.',
    longDescription: `Hangul Day (한글날) is one of Korea's most treasured national holidays, commemorating the proclamation of the Korean alphabet by King Sejong the Great in 1446. Join us for a full day of cultural immersion featuring live calligraphy workshops, traditional Korean games, language quiz competitions, and a showcase of student artwork inspired by Hangul.\n\nThe event will include a special talk on the linguistic brilliance behind Hangul's design — considered one of the most scientifically crafted writing systems in the world. Refreshments will be served throughout the day.`,
    highlights: ['Calligraphy workshop', 'Hangul quiz competition', 'Traditional Korean games', 'Cultural art showcase', 'Language learning stalls'],
    image: '',
    color: '#8B1E24',
  },
  {
    slug: 'korean-film-night-2026',
    title: 'Korean Film Night',
    koreanTitle: '한국 영화의 밤',
    date: '15 Aug, 2026',
    dateISO: '2026-08-15T18:30:00',
    time: '6:30 PM – 10:00 PM',
    location: 'Seminar Hall, Dibrugarh University',
    category: 'Film & Media',
    status: 'upcoming',
    description: 'A curated screening of award-winning Korean cinema followed by a group discussion.',
    longDescription: `Korean cinema has taken the world by storm — from Parasite's Oscar sweep to the global love for comfort dramas. This film night brings together students for a curated screening of a celebrated Korean film, followed by an open discussion on themes of culture, society, and storytelling.\n\nPrior to the screening, we will host a short talk on the history of Korean cinema and its evolution. Popcorn and Korean snacks will be available.`,
    highlights: ['Film screening', 'Director Q&A discussion', 'Korean snacks', 'Post-screening analysis'],
    image: '',
    color: '#5C3A6B',
  },
  {
    slug: 'chuseok-festival-2026',
    title: 'Chuseok Harvest Festival',
    koreanTitle: '추석 축제',
    date: '28 Sep, 2026',
    dateISO: '2026-09-28T11:00:00',
    time: '11:00 AM – 3:00 PM',
    location: 'Open Grounds, Dibrugarh University',
    category: 'Festival',
    status: 'upcoming',
    description: 'Experience Chuseok, the Korean harvest festival, with food, folk games and traditional performances.',
    longDescription: `Chuseok (추석) is the Korean equivalent of a harvest thanksgiving — a three-day festival where families come together to honour ancestors and share the bounty of the season. At Dibrugarh Korean Club, we bring this spirit to our campus with traditional food stations, folk games like yutnori and jegichagi, and hanbok photo opportunities.\n\nCome dressed in hanbok or traditional attire for a special gift. This is one of our biggest annual events and is open to all students and faculty.`,
    highlights: ['Traditional food stalls', 'Yutnori folk games', 'Hanbok dress-up photo zone', 'Ancestral tribute ceremony', 'Song & dance performance'],
    image: '',
    color: '#1E5C8B',
  },
  {
    slug: 'k-culture-quiz-2025',
    title: 'K-Culture Quiz Night',
    koreanTitle: 'K-문화 퀴즈 나이트',
    date: '12 Dec, 2025',
    dateISO: '2025-12-12T17:00:00',
    time: '5:00 PM – 8:00 PM',
    location: 'Lecture Hall 3, Dibrugarh University',
    category: 'Competition',
    status: 'completed',
    description: 'Test your knowledge of Korean pop culture, history and language in this exciting team quiz.',
    longDescription: `Teams of four competed across five rounds covering K-drama, K-pop, Korean history, language puzzles and food culture. The event attracted over 120 participants and had winners from 8 different departments.\n\nThis was the second edition of our annual quiz night, and the energy and knowledge on display was outstanding. Prizes included Korean stationery sets and a Dibrugarh Korean Club goodie bag.`,
    highlights: ['5 quiz rounds', '120+ participants', '18 competing teams', 'Korean prizes', 'Certificate of participation'],
    image: '',
    color: '#1E8B5C',
  },
  {
    slug: 'language-bootcamp-2025',
    title: 'Korean Language Bootcamp',
    koreanTitle: '한국어 집중 과정',
    date: '20 Oct, 2025',
    dateISO: '2025-10-20T09:00:00',
    time: '9:00 AM – 5:00 PM',
    location: 'Seminar Hall, Dibrugarh University',
    category: 'Workshop',
    status: 'completed',
    description: 'A one-day intensive Korean language bootcamp for absolute beginners and intermediates.',
    longDescription: `Our Language Bootcamp brought together 60 enthusiastic students for a structured day of Korean language learning. Sessions were divided into beginner and intermediate tracks covering Hangul reading, basic conversational phrases, and an introduction to grammar structures.\n\nParticipants left with a printed workbook, and many reported being able to read basic Korean by the end of the day. Certificates were issued to all participants.`,
    highlights: ['Hangul mastery session', 'Conversation practice pairs', 'Grammar introduction', 'Take-home workbook', 'Certificate of completion'],
    image: '',
    color: '#8B6B1E',
  },
  {
    slug: 'new-year-celebration-2025',
    title: '설날 New Year Celebration',
    koreanTitle: '설날 새해 행사',
    date: '29 Jan, 2025',
    dateISO: '2025-01-29T12:00:00',
    time: '12:00 PM – 5:00 PM',
    location: 'Student Union Hall, Dibrugarh University',
    category: 'Festival',
    status: 'completed',
    description: 'Ringing in the Korean Lunar New Year with traditional games, food and New Year blessings.',
    longDescription: `Seollal (설날) is the Korean Lunar New Year — the most significant holiday in the Korean calendar. Our celebration featured traditional sebae (New Year bow), tteokguk (rice cake soup) prepared by club members, and fortune-telling activities inspired by Korean tradition.\n\nOver 200 students attended this flagship event, which has become one of the most-anticipated annual gatherings on our campus calendar.`,
    highlights: ['Sebae ceremony', 'Traditional tteokguk', 'Fortune activity stalls', 'Group photo in hanbok', 'Yut nori tournament'],
    image: '',
    color: '#8B1E24',
  },
]
