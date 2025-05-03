"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"



export function FormHeader() {
  return (
    <div className="flex items-center justify-between pb-[20px]">
      <div>
        <h2 className="text-2xl font-semibold leading-[120%] text-black">Tile Colors</h2>
        <div className="flex items-center gap-2 pt-2">
          <Link href="/admin-dashboard" className="text-base font-medium leading-[120%] text-gray-500">
            Dashboard
          </Link>
          <span className="text-gray-500">
            <ChevronRight className="w-4 h-4" />
          </span>
          <Link href="/admin-dashboard/tile-colors" className="text-base font-medium leading-[120%] text-gray-500">
            Tile Colors
          </Link>
          <span className="text-gray-500">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  )
}

