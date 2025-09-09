"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const categories = [
  { value: "ALL", label: "All Articles" },
  { value: "TUTORIALS_GUIDES", label: "Tutorials & Guides" },
  { value: "CASE_STUDIES", label: "Case Studies" },
  { value: "SYSTEM_PROMPTS", label: "System Prompts" },
]

interface BlogFiltersProps {
  currentCategory?: string
  currentSearch?: string
}

export function BlogFilters({ currentCategory = "ALL", currentSearch = "" }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(currentSearch)

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "ALL") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    params.delete("page") // Reset to first page
    router.push(`/blog?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchValue.trim()) {
      params.set("search", searchValue.trim())
    } else {
      params.delete("search")
    }
    params.delete("page") // Reset to first page
    router.push(`/blog?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchValue("")
    router.push("/blog")
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Filters */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={currentCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.value)}
                className={
                  currentCategory === category.value
                    ? "bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="lg:w-80">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Search</h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button type="submit" size="sm" className="bg-[#3f79ff] hover:bg-[#3f79ff]/80">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Clear Filters */}
      {(currentCategory !== "ALL" || currentSearch) && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
