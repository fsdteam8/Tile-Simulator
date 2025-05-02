"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface FormHeaderProps {
  isEditing: boolean
  isSubmitting: boolean
  onSave: () => void
}

export function FormHeader({ isEditing, isSubmitting, onSave }: FormHeaderProps) {
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
          <span className="text-base font-medium leading-[120%] text-gray-700">
            {isEditing ? "Edit Color" : "Add Color"}
          </span>
        </div>
      </div>
      <div>
        <Button
          onClick={onSave}
          className="bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Color" : "Publish Color"}
        </Button>
      </div>
    </div>
  )
}

