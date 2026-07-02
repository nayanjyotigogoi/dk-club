// Server component — awaits params, passes category to client UI
import { ResourceCategory } from './resource-category'

export default async function ResourceCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return <ResourceCategory category={category} />
}
