import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ResourceDetailClient } from "@/components/resources/resource-detail-client";
import type { Metadata } from "next";
import { getResourceBySlug } from "@/app/actions/resources";

interface ResourceDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ResourceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resourceData = await getResourceBySlug(slug);
  if (!resourceData || !resourceData.resource) {
    return {
      title: "Resource Not Found",
    };
  }

  const { resource } = resourceData;

  return {
    title: `${resource.title} | Blazing Automations`,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      images: resource.thumbnail ? [resource.thumbnail] : [],
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { slug } = await params;
  const resourceData = await getResourceBySlug(slug);

  if (!resourceData || !resourceData.resource) {
    notFound();
  }

  const { resource, relatedResources } = resourceData;

  return (
    <ResourceDetailClient
      resource={resource}
      relatedResources={relatedResources}
    />
  );
}
