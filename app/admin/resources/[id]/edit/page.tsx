import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ResourceForm } from "@/components/admin/resource-form"

interface EditResourcePageProps {
  params: {
    id: string
  }
}

async function getResource(id: string) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return resource
  } catch (error) {
    console.error("Failed to fetch resource:", error)
    return null
  }
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const resource = await getResource(params.id)

  if (!resource) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Resource</h1>
        <p className="text-gray-400">Update your automation resource.</p>
      </div>

      <ResourceForm resource={resource} isEditing={true} />
    </div>
  )
}
