export type GalleryCategory = 'all' | 'events' | 'members' | 'culture' | 'campus'

export interface GalleryPhoto {
  id: string
  caption: string
  category: GalleryCategory
  event?: string
  year: number
  aspect: 'portrait' | 'landscape' | 'square'
  color: string
  icon: string
}

// Photos represented by colored placeholders with Korean characters
export const galleryPhotos: GalleryPhoto[] = [
  { id: 'g1',  caption: 'Hangul Day Calligraphy Workshop',  category: 'events',   event: 'Hangul Day 2025', year: 2025, aspect: 'landscape', color: '#FAF3ED', icon: '한' },
  { id: 'g2',  caption: 'Chuseok Festival Opening Ceremony', category: 'events',  event: 'Chuseok 2025',   year: 2025, aspect: 'portrait',  color: '#F5E6D8', icon: '추' },
  { id: 'g3',  caption: 'New Member Orientation',           category: 'members',  year: 2025, aspect: 'square',    color: '#E8DCCF', icon: '안' },
  { id: 'g4',  caption: 'Seollal Group Photo',              category: 'events',   event: 'Seollal 2025',   year: 2025, aspect: 'landscape', color: '#FAF3ED', icon: '설' },
  { id: 'g5',  caption: 'Korean Street Food Stall',         category: 'culture',  year: 2025, aspect: 'portrait',  color: '#F0DDD0', icon: '음' },
  { id: 'g6',  caption: 'Language Bootcamp Day',            category: 'events',   event: 'Bootcamp 2025',  year: 2025, aspect: 'square',    color: '#FAF3ED', icon: '글' },
  { id: 'g7',  caption: 'K-Pop Dance Workshop',             category: 'culture',  year: 2025, aspect: 'landscape', color: '#E8DCCF', icon: '춤' },
  { id: 'g8',  caption: 'Hanbok Day on Campus',             category: 'campus',   year: 2025, aspect: 'portrait',  color: '#F5E6D8', icon: '복' },
  { id: 'g9',  caption: 'Quiz Night Winners',               category: 'events',   event: 'Quiz Night 2025', year: 2025, aspect: 'square',    color: '#FAF3ED', icon: '우' },
  { id: 'g10', caption: 'Tteok Making Session',             category: 'culture',  year: 2025, aspect: 'portrait',  color: '#F0DDD0', icon: '떡' },
  { id: 'g11', caption: 'Club Founding Members 2024',       category: 'members',  year: 2024, aspect: 'landscape', color: '#E8DCCF', icon: '디' },
  { id: 'g12', caption: 'First Chuseok on Campus',          category: 'events',   event: 'Chuseok 2024',   year: 2024, aspect: 'square',    color: '#FAF3ED', icon: '첫' },
  { id: 'g13', caption: 'Korean Movie Night Setup',         category: 'events',   year: 2024, aspect: 'portrait',  color: '#F5E6D8', icon: '영' },
  { id: 'g14', caption: 'Magazine Launch Vol.1',            category: 'campus',   year: 2024, aspect: 'landscape', color: '#F0DDD0', icon: '책' },
  { id: 'g15', caption: 'Yutnori Game Tournament',          category: 'culture',  year: 2024, aspect: 'square',    color: '#FAF3ED', icon: '놀' },
  { id: 'g16', caption: 'Campus Cherry Blossom Walk',       category: 'campus',   year: 2026, aspect: 'landscape', color: '#FAF3ED', icon: '봄' },
  { id: 'g17', caption: 'New Members 2026 Intake',          category: 'members',  year: 2026, aspect: 'portrait',  color: '#E8DCCF', icon: '신' },
  { id: 'g18', caption: 'Korean Cooking Demo',              category: 'culture',  year: 2026, aspect: 'landscape', color: '#F5E6D8', icon: '요' },
]
