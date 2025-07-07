import { notFound } from "next/navigation"
import { getResourceBySlug, getResources } from "@/app/actions/resources"
import { ResourceDetailClient } from "@/components/resources/resource-detail-client"

interface ResourceDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { slug } = await params
  const resource = await getResourceBySlug(slug)

  if (!resource) {
    notFound()
  }

  // Get related resources
  const { resources: relatedResources } = await getResources({
    category: resource.category,
    limit: 5,
  })

  // Filter out current resource
  const related = relatedResources.filter((r) => r.id !== resource.id).slice(0, 4)

  return <ResourceDetailClient resource={resource} relatedResources={related} />
}

export async function generateStaticParams() {
  const { resources } = await getResources({ limit: 100 })

  return resources.map((resource) => ({
    slug: resource.slug,
  }))
}
