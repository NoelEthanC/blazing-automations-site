import { ResourceForm } from "@/components/admin/resource-form"

export default function NewResourcePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Add New Resource</h1>
        <p className="text-gray-400">Create a new automation resource for your users.</p>
      </div>

      <ResourceForm />
    </div>
  )
}
