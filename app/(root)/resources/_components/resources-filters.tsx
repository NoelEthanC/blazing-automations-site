"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const categories = ["All", "TEMPLATE", "GUIDE", "TOOLS"];

export function ResourcesFilters({
  resourcesCount,
  category,
}: {
  category?: string;
  resourcesCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("pageNo", "1"); // reset page when filter changes

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-gray-400" />
        <span className="text-gray-400">Filter by:</span>

        {categories.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(cat)}
            className={
              category === cat
                ? "bg-[#3f79ff] hover:bg-[#3f79ff]/80"
                : "border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            }
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="text-sm text-gray-400">
        {resourcesCount} resource{resourcesCount !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}
