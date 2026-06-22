export type GoodiesCategory = 'all' | 'stationery' | 'apparel' | 'accessories' | 'collectibles'

export interface Goodie {
  id: string
  name: string
  koreanName: string
  category: GoodiesCategory
  price: string
  description: string
  availability: 'available' | 'limited' | 'sold-out'
  color: string
  icon: string
  tags: string[]
}

export const goodies: Goodie[] = [
  {
    id: 'tote-bag',
    name: 'DKC Canvas Tote Bag',
    koreanName: '에코백',
    category: 'accessories',
    price: '₹299',
    description: 'Heavy-duty canvas tote with the DKC logo and "한국어" in maroon ink. Fits textbooks, water bottles and your snack haul.',
    availability: 'available',
    color: '#FAF3ED',
    icon: '가방',
    tags: ['Bestseller', 'Eco-friendly'],
  },
  {
    id: 'enamel-pin',
    name: 'Cherry Blossom Enamel Pin',
    koreanName: '벚꽃 핀',
    category: 'accessories',
    price: '₹149',
    description: 'A soft-enamel pin in the shape of a cherry blossom with a maroon center dot. Perfect for bags, jackets and lanyards.',
    availability: 'limited',
    color: '#F5B4A5',
    icon: '꽃',
    tags: ['Limited Edition'],
  },
  {
    id: 'notebook',
    name: 'Hangul Practice Notebook',
    koreanName: '한글 연습 노트',
    category: 'stationery',
    price: '₹199',
    description: 'A5 notebook with Hangul practice grid pages, romanisation guide on the inside cover, and a motivational Korean quote on each chapter divider.',
    availability: 'available',
    color: '#E8DCCF',
    icon: '노트',
    tags: ['Learning Essential'],
  },
  {
    id: 'tshirt',
    name: 'DKC Cream T-Shirt',
    koreanName: '동아리 티셔츠',
    category: 'apparel',
    price: '₹499',
    description: 'Heavyweight 100% cotton tee in warm cream with a small DKC emblem on the chest and "Dibrugarh Korean Club" on the back.',
    availability: 'available',
    color: '#FAF6F0',
    icon: '옷',
    tags: ['Member Exclusive'],
  },
  {
    id: 'bookmark',
    name: 'Korean Proverb Bookmark Set',
    koreanName: '속담 책갈피',
    category: 'stationery',
    price: '₹99',
    description: 'Set of 6 illustrated bookmarks, each featuring a Korean proverb in Hangul, romanisation, and English translation. Printed on thick card.',
    availability: 'available',
    color: '#FAF3ED',
    icon: '책갈피',
    tags: ['Set of 6'],
  },
  {
    id: 'sticker-pack',
    name: 'DKC Sticker Pack',
    koreanName: '스티커 팩',
    category: 'collectibles',
    price: '₹79',
    description: 'Pack of 8 vinyl stickers: DKC logo, Hangul characters, cherry blossom, hanok pavilion, Korean lantern and more.',
    availability: 'available',
    color: '#FAF3ED',
    icon: '스티커',
    tags: ['Pack of 8'],
  },
  {
    id: 'hoodie',
    name: 'DKC Club Hoodie',
    koreanName: '동아리 후드',
    category: 'apparel',
    price: '₹899',
    description: 'Our most popular item. Maroon fleece hoodie with embroidered DKC crest on the chest. Available in S, M, L, XL.',
    availability: 'limited',
    color: '#8B1E24',
    icon: '후드',
    tags: ['Most Popular', 'Limited Stock'],
  },
  {
    id: 'keychain',
    name: 'Hanok Keychain',
    koreanName: '한옥 열쇠고리',
    category: 'collectibles',
    price: '₹129',
    description: 'Laser-cut wood keychain in the shape of a traditional hanok pavilion. Each one is hand-finished with maroon paint detail.',
    availability: 'sold-out',
    color: '#D4A574',
    icon: '열쇠',
    tags: ['Handmade', 'Sold Out'],
  },
]
