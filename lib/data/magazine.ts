export interface MagazineArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  tag: string
}

export interface MagazineIssue {
  slug: string
  title: string
  issue: string
  year: number
  month: string
  coverColor: string
  coverAccent: string
  tagline: string
  description: string
  articles: MagazineArticle[]
  featured: boolean
  pageCount: number
}

export const magazines: MagazineIssue[] = [
  {
    slug: 'hangul-heritage-oct-2026',
    title: 'Hangul Heritage',
    issue: 'Vol. 4, Issue 2',
    year: 2026,
    month: 'October',
    coverColor: '#8B1E24',
    coverAccent: '#FAF3ED',
    tagline: 'The alphabet that changed a nation',
    description: 'Our Hangul Day special edition explores the history, design philosophy, and modern relevance of the Korean alphabet.',
    featured: true,
    pageCount: 28,
    articles: [
      {
        id: 'hangul-origin',
        title: 'The Science Behind Hangul',
        excerpt: 'Why linguists consider Hangul one of the most brilliantly engineered writing systems ever created.',
        tag: 'Language',
        author: 'Priya Sharma',
        content: `# The Science Behind Hangul\n\nIn 1446, King Sejong the Great of the Joseon Dynasty announced the creation of a new writing system called Hunminjeongeum — "the correct sounds for the instruction of the people." This would later become known as Hangul (한글).\n\n## A Script Designed, Not Evolved\n\nUnlike most writing systems which evolved organically over centuries, Hangul was deliberately designed with specific phonetic and geometric principles. Each consonant letter is shaped to mirror the position of the mouth and tongue when producing the corresponding sound.\n\nFor instance, the letter ㄱ (g/k) represents the back of the tongue touching the roof of the mouth. The letter ㅁ (m) is a square representing the closed lips. This systematic design means learners can intuit pronunciation from shape alone.\n\n## The Block Structure\n\nHangul's genius lies in its syllable blocks. Letters are combined into square clusters, always following the pattern: initial consonant + vowel + optional final consonant. This gives Korean text its distinctive visual rhythm — ordered, balanced, beautiful.\n\n## A Living Script\n\nToday, Hangul's design principles are studied by linguists worldwide. The system is so logical that Korea achieved near-100% literacy within decades of its adoption — an extraordinary achievement and a testament to Sejong's vision.\n\nLearning Hangul typically takes a dedicated student just a few hours. Many of our club members report reading Korean menus, signs and subtitles within their first week of learning.\n\n> "A wise man can acquaint himself with them before the morning is over; a stupid man can learn them in the space of ten days." — Hunminjeongeum, 1446`,
      },
      {
        id: 'calligraphy-art',
        title: 'Calligraphy as Meditation',
        excerpt: 'How traditional Korean ink calligraphy (seoye) connects modern students to ancient practice.',
        tag: 'Art & Culture',
        author: 'Ankita Borah',
        content: `# Calligraphy as Meditation\n\nThere is something deeply calming about putting brush to paper. In Korean tradition, seoye (서예) — the art of brush calligraphy — has been practiced for over a thousand years, and for good reason.\n\n## The Practice\n\nTraditional Korean calligraphy uses a horsehair brush, ink stone, ink stick, and hanji (Korean mulberry paper). The ink is prepared by grinding the ink stick against the stone with a small amount of water — a ritual in itself that slows the mind and prepares the spirit.\n\n## What We Learned at Our Workshop\n\nAt our Hangul Day workshop this year, 30 students tried calligraphy for the first time. Many described it as meditative. The slow, deliberate strokes force concentration. There is no rushing the brush.\n\nWe practised writing 사랑 (love), 평화 (peace), and our club name 디브루가르 한국 클럽. The results were pinned on the wall — no two interpretations the same.\n\n## Why It Matters\n\nIn a world of instant digital text, the act of writing by hand — especially in a foreign script — reconnects us to language as a physical, embodied act. Several students mentioned they remembered vocabulary better after writing it by hand.\n\nWe plan to host a calligraphy morning every semester. Watch this space.`,
      },
      {
        id: 'member-journey',
        title: 'From Zero to Conversational: Rohan\'s Story',
        excerpt: 'A second-year Commerce student shares how he went from knowing no Korean to watching dramas without subtitles.',
        tag: 'Member Story',
        author: 'Rohan Das',
        content: `# From Zero to Conversational: Rohan's Story\n\nI joined DKC in my first year mostly because a friend dragged me along to a Chuseok event. I ate tteok, played yutnori, and thought — that's it, this was fun. I had zero intention of learning Korean.\n\n## The Spark\n\nThen I watched Crash Landing on You on a boring Sunday. I was hooked. I started noticing words. 감사합니다 — I'd heard that at the event. 사랑해 — I knew that meant love. Before I realised it, I was cross-referencing subtitles.\n\n## The Club Changed Everything\n\nI signed up for the Language Bootcamp in October 2025. That one day changed my trajectory. By the end, I could read every Hangul character. Within a month, I could read menus. Within three months, I could follow simple dialogue.\n\n## Now\n\nI still miss plenty of nuance. But last week I watched an episode of Reply 1988 without subtitles for 20 minutes and understood most of it. That felt incredible.\n\nIf you're on the fence about joining DKC — just come to one event. You might surprise yourself.\n\n— Rohan Das, B.Com 2nd Year`,
      },
    ],
  },
  {
    slug: 'summer-of-culture-jun-2026',
    title: 'Summer of Culture',
    issue: 'Vol. 4, Issue 1',
    year: 2026,
    month: 'June',
    coverColor: '#F5B4A5',
    coverAccent: '#8B1E24',
    tagline: 'K-pop, cinema, food and the global Korean wave',
    description: 'A deep dive into Hallyu — the Korean cultural wave — and how it reached our campus in Dibrugarh.',
    featured: false,
    pageCount: 24,
    articles: [
      {
        id: 'hallyu-dibrugarh',
        title: 'How Hallyu Found Dibrugarh',
        excerpt: 'Tracing the journey of the Korean Wave from Seoul to the banks of the Brahmaputra.',
        tag: 'Culture',
        author: 'Meghna Gogoi',
        content: `# How Hallyu Found Dibrugarh\n\nThe Korean Wave — Hallyu (한류) — began with a TV drama in 1997 and has since become one of the most remarkable cultural export stories of the modern era. But how did it reach a university campus in Assam?\n\n## The Drama Pipeline\n\nIt started, as most things do, with recommendation. "My cousin told me to watch Boys Over Flowers," says Sneha, one of our founding members. "I cried for two days. Then I told everyone I knew."\n\nFrom drama to drama, friend to friend, Korean storytelling found its audience here through personal networks long before streaming platforms made it effortless.\n\n## The Music Dimension\n\nBTS changed the equation globally. Their music transcended language barriers through sheer sincerity and craft. Several of our members first heard Korean spoken through BTS songs and found themselves wanting to understand every word.\n\n## What It Means\n\nHallyu arriving in Dibrugarh isn't just a pop culture story — it's a story about how good art travels. It doesn't need advertising. It needs to move people.`,
      },
    ],
  },
  {
    slug: 'traditions-dec-2025',
    title: 'Traditions & Transitions',
    issue: 'Vol. 3, Issue 2',
    year: 2025,
    month: 'December',
    coverColor: '#2B2B2B',
    coverAccent: '#FAF3ED',
    tagline: 'Korean festivals, food and the art of celebration',
    description: 'Year-end reflections on a year of events, cultural discoveries, and community growth.',
    featured: false,
    pageCount: 32,
    articles: [
      {
        id: 'year-in-review-2025',
        title: '2025: A Year in Review',
        excerpt: 'From 60 members to 200+. A look back at everything DKC achieved in 2025.',
        tag: 'Club News',
        author: 'DKC Editorial Team',
        content: `# 2025: A Year in Review\n\n2025 was the year Dibrugarh Korean Club grew from a small group of enthusiasts to a recognised student organisation with over 200 active members.\n\n## Highlights\n\n**January** — Seollal New Year celebration drew 200+ attendees, our biggest event to date.\n\n**March** — We launched our first newsletter, reaching 150 subscribers in the first week.\n\n**June** — Summer of Culture magazine edition, featuring 8 student-written articles.\n\n**October** — Language Bootcamp: 60 participants, certificates issued, a 100% satisfaction rate in feedback forms.\n\n**December** — K-Culture Quiz Night with 120 participants across 18 teams.\n\n## What 2026 Holds\n\nWe have planned our most ambitious calendar yet — including a Korean Film Festival week, a language exchange programme with partner clubs in Delhi and Mumbai, and the launch of our first physical magazine print run.\n\nThank you to every member, volunteer, and supporter who made 2025 extraordinary.`,
      },
    ],
  },
  {
    slug: 'first-bloom-jun-2025',
    title: 'First Bloom',
    issue: 'Vol. 3, Issue 1',
    year: 2025,
    month: 'June',
    coverColor: '#FAF3ED',
    coverAccent: '#8B1E24',
    tagline: 'Our first full year — finding our voice',
    description: 'The origin story of Dibrugarh Korean Club, told by its founding members.',
    featured: false,
    pageCount: 20,
    articles: [],
  },
  {
    slug: 'beginnings-dec-2024',
    title: 'Beginnings',
    issue: 'Vol. 2, Issue 2',
    year: 2024,
    month: 'December',
    coverColor: '#1E5C8B',
    coverAccent: '#FAF3ED',
    tagline: 'Where it all started',
    description: 'The founding story and our first semester of activities.',
    featured: false,
    pageCount: 16,
    articles: [],
  },
]
