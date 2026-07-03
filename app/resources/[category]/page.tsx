// Server component — awaits params, passes category to client UI
import type { Metadata } from 'next'
import { ResourceCategory } from './resource-category'

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const title = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${title} Resources`,
    description: `Free ${title} Korean language learning resources curated by Dibrugarh Korean Club — guides, notes, TOPIK tips and more for learners in Assam, India.`,
    keywords: [`Korean ${title} resources`, 'Korean learning Assam', 'free Korean resources India', 'TOPIK study Assam', `Korean ${title} guide Dibrugarh`],
    alternates: { canonical: `https://dibrugarhkoreanclub.com/resources/${category}` },
    openGraph: {
      title: `${title} Resources | Dibrugarh Korean Club`,
      description: `Free ${title} resources for Korean language learners in Assam curated by Dibrugarh Korean Club.`,
      url: `https://dibrugarhkoreanclub.com/resources/${category}`,
    },
  }
}

export default async function ResourceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return <ResourceCategory category={category} />
}
