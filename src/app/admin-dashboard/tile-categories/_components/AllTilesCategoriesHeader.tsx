"use client"
import { RiArrowRightSLine } from "react-icons/ri"
import { FaPlus } from "react-icons/fa6"
import Link from "next/link"
import { ListFilter, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AllTilesCategoriesHeaderProps {
  onAddNew: () => void
  search: string
  setSearch: (value: string) => void
}

const AllTilesCategoriesHeader = ({ onAddNew, search, setSearch }: AllTilesCategoriesHeaderProps) => {

  return (
    <div>
      <div className="flex items-center justify-between pb-[20px]">
        <div>
          <h2 className="text-2xl font-semibold leading-[120%] text-black">Tile Categories</h2>
          <div className="flex items-center gap-2 pt-2">
            <Link href="/admin-dashboard" className="text-base font-medium leading-[120%] text-secondary-200">
              Dashboard
            </Link>
            <span className="text-secondary-200 w-[18px] h-[18px]">
              {" "}
              <RiArrowRightSLine />{" "}
            </span>
            <Link 
              href="/admin-dashboard/tile-categories"
              className="text-base font-medium leading-[120%] text-secondary-300"
            >
              Tile Categories
            </Link>
          </div>
        </div>
        <div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 text-white bg-primary py-4 px-8 text-base font-medium leading-[120%] rounded-[8px]"
          >
            <FaPlus /> Add New Tile Categories
          </button>
        </div>
      </div>
      <div className="pb-10">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
            <Input
              type="search"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "pl-10",
                "border-secondary-300",
                "placeholder:text-sm placeholder:text-secondary-400 placeholder:leading-[120%] placeholder:font-normal",
                "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary-500 focus-visible:outline-none",
              )}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-white bg-primary py-[10px] px-4 text-sm font-medium leading-[120%] rounded-[8px]">
              {" "}
              <ListFilter className="w-4 h-4" /> Filters
            </button>
            <button className="flex items-center gap-2 text-secondary-500 border border-secondary-500 py-[10px] px-5 text-sm font-medium leading-[120%] rounded-[8px]">
              {" "}
              <Trash2 className="w-[18px] h-[18px] text-secondary-500" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllTilesCategoriesHeader

