
"use client";
import { CategoriesApiResponse } from "@/components/types/all-tiles-categories";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/category_select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { SearchIcon, X } from "lucide-react"
import { useState, useEffect } from "react"
import { FaPlus } from "react-icons/fa6"

interface TileSimulatorHeaderProps {
  onCategoryChange: (categoryId: string) => void
  onSearchChange: (query: string) => void
  selectedCategory: string
  searchQuery: string
  onAddBorder?: () => void
}

const TileSimulatorHeader = ({
  onCategoryChange,
  onSearchChange,
  selectedCategory,
  searchQuery,
  onAddBorder,
}: TileSimulatorHeaderProps) => {
  const [search, setSearch] = useState(searchQuery)

 const { data, isLoading } = useQuery<CategoriesApiResponse>({
    queryKey: ["all-tiles-categories"],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`).then((res) => res.json()),
  })

  const filterData =
    data?.data?.data?.map((item: { id: number; name: string }) => ({
      id: item.id,
      name: item.name,
      value: item.name,
    })) || []

  // Update parent component when search changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, onSearchChange])

  const handleClear = () => {
    setSearch("")
    onSearchChange("")
  }

  return (
    <div className="w-full space-y-2 md:space-y-0 lg:space-y-0 md:flex lg:flex items-center gap-5">
      {/* searching  */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={18} />
        <Input
          type="search"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "pl-10 pr-10 2xl:h-[52px] w-[243px]", // Added pr-10 to make room for the clear icon
            "border-primary",
            "placeholder:text-sm placeholder:text-[#F0C1C1] placeholder:leading-[120%] placeholder:font-normal",
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:outline-none",
          )}
        />

        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {/* categories  */}
      <div>
        <Select value={selectedCategory} onValueChange={(v) => onCategoryChange(v)}>
          <SelectTrigger className="w-full md:w-[268px] xl:h-[44px] 2xl:h-[52px] py-2 xl:py-[10px] 2xl:py-4 px-[12px] xl:px-[16px] 2xl:px-[20px] font-medium">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {isLoading ? (
              <SelectItem value="loading" disabled>
                Loading categories...
              </SelectItem>
            ) : (
              filterData?.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* add border  */}
      <div>
        <button
          className="flex w-full p-4 items-center gap-[14px] text-base font-medium leading-[120%] text-primary border border-primary rounded-[8px] py-2 xl:py-[10px] 2xl:h-[52px] px-[30px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px]"
          onClick={onAddBorder}
        >
          <FaPlus className="text-primary" /> Add Border
        </button>
      </div>
    </div>
  )
}

export default TileSimulatorHeader
