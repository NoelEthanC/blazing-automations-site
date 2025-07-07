import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ResourceDetailClient } from "@/components/resources/resource-detail-client"
import type { Metadata } from "next"

interface ResourceDetailPageProps {
  params: {
    slug: string
  }
}

async function getResource(slug: string) {
  const resource = await prisma.resource.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      downloads: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
  })

  return resource
}

export async function generateMetadata({ params }: ResourceDetailPageProps): Promise<Metadata> {
  const resource = await getResource(params.slug)

  if (!resource) {
    return {
      title: "Resource Not Found",
    }
  }

  return {
    title: `${resource.title} | Blazing Automations`,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      images: resource.thumbnail ? [resource.thumbnail] : [],
    },
  }
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const resource = await getResource(params.slug)

  if (!resource) {
    notFound()
  }

  return <ResourceDetailClient resource={resource} />
}
