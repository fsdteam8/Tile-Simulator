
"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ColorFormModal } from "./Add-Edit-colorForm/color-form"
import { RiArrowRightSLine } from "react-icons/ri"
import { FaPlus } from "react-icons/fa6"
import { ListFilter, Search, Trash2 } from "lucide-react"

interface ColorData {
  id?: number
  name?: string
  code?: string | null
  image?: string | null
  status?: string
}

interface TileColorsHeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

export function TileColorsHeader({ search, setSearch }: TileColorsHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState<ColorData | null>(null)

  console.log(currentColor)

  const handleAddNew = () => {
    setCurrentColor(null)
    setIsModalOpen(true)
  }

  return (
    <div>
      <AllTilesColorHeader 
        onAddNew={handleAddNew} 
        search={search} 
        setSearch={setSearch} 
      />
      
      <ColorFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}

interface AllTilesColorHeaderProps {
  onAddNew: () => void;
  search: string;
  setSearch: (value: string) => void;
}

const AllTilesColorHeader = ({ onAddNew, search, setSearch }: AllTilesColorHeaderProps) => {
  return (
    <div>
      <div className="flex items-center justify-between pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-black leading-[120%]">
            Tile Colors
          </h2>
          <div className="flex items-center gap-2 pt-2">
            <Link href="/admin-dashboard" className="text-base font-medium text-secondary-200 leading-[120%]">
              Dashboard
            </Link>
            <span className="text-secondary-200 w-4 h-4">
              <RiArrowRightSLine />
            </span>
            <Link href="/admin-dashboard/tile-color" className="text-base font-medium text-secondary-300 leading-[120%]">
              Tile Colors
            </Link>
          </div>
        </div>
        <div>
          <Button onClick={onAddNew} className="flex items-center gap-2 text-white bg-primary py-4 px-8 text-base font-medium rounded-lg">
            <FaPlus /> Add New Tile Color
          </Button>
        </div>
      </div>

      <div className="pb-10">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <Input
              type="search"
              placeholder="Search color..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "pl-10 border-secondary-300",
                "placeholder:text-sm placeholder:text-secondary-400",
                "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary-500 focus-visible:outline-none"
              )}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button className="flex items-center gap-2 text-white bg-primary py-2.5 px-4 text-sm font-medium rounded-lg">
              <ListFilter className="w-4 h-4" /> Filters
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-secondary-500 border border-secondary-500 py-2.5 px-5 text-sm font-medium rounded-lg">
              <Trash2 className="w-[18px] h-[18px] text-secondary-500" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}