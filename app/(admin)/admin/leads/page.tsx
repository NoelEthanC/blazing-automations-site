import { Suspense } from "react"
import { LeadsManagement } from "@/components/admin/leads-management"
import { Skeleton } from "@/components/ui/skeleton"

function LeadsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex justify-center">
          <Skeleton className="h-8 w-80" />
        </div>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
        <p className="text-gray-600 mt-2">View and manage users who have downloaded your resources</p>
      </div>

      <Suspense fallback={<LeadsLoadingSkeleton />}>
        <LeadsManagement />
      </Suspense>
    </div>
  )
}
