"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
export function ResourcesHeader({ search }: { search: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`?${params.toString()}`);
    },
    300
  );

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Free Resources
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
        Download templates, guides, and tools to supercharge your business
        growth.
      </p>
      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for templates..."
          defaultValue={searchParams.get("search") || search}
          onChange={handleChange}
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
        />
      </div>
    </>
  );
}
