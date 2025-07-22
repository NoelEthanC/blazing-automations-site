import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ResourcesLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-36">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-96 mx-auto mb-4 bg-gray-800" />
          <Skeleton className="h-6 w-2/3 mx-auto bg-gray-800" />
        </div>

        {/* Resources Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Skeleton className="w-full h-48 rounded-lg mb-4 bg-gray-800" />
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-6 w-20 bg-gray-800" />
                  <Skeleton className="h-6 w-16 bg-gray-800" />
                </div>
                <Skeleton className="h-6 w-3/4 bg-gray-800" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-2/3 mb-4 bg-gray-800" />

                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-4 w-24 bg-gray-800" />
                  <Skeleton className="h-4 w-20 bg-gray-800" />
                </div>

                <Skeleton className="h-10 w-full bg-gray-800" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
