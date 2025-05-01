"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { ColumnDef } from "@tanstack/react-table"
import ActionsButton from "./ActionsButton"
import Image from "next/image"
import { Color } from "./AllTilesColorData"

interface ColumnProps {
  onEdit: (color: Color) => void
  onDelete: (color: Color) => void
}

export const createAllTilesColorColumn = ({ 
  onEdit, 
  onDelete 
}: ColumnProps): ColumnDef<Color>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || 
                (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Color Name",
    cell: ({ row }) => (
      <div className="flex justify-center items-center gap-[2px]">
        <span className="text-base font-normal text-black leading-[120%] text-center">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    id: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const isColor = row.original.code?.startsWith("#")
      const imageUrl = row.original.image 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${row.original.image}`
        : ''

      return (
        <div className="flex justify-center items-center">
          {isColor ? (
            <div
              className="w-12 h-12 rounded-md border border-gray-300"
              style={{ backgroundColor: row.original.code || "#ccc" }}
            />
          ) : (
            <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-300">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={row.original.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
            </div>
          )}
        </div>
      )
    },
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => {
      const isColor = row.original.code?.startsWith("#")
      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {isColor ? "Color" : "Image"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "updated_at",
    header: "Date",
    cell: ({ row }) => {
      const dateString = row.original.updated_at
      let formattedDate = "N/A"
      
      if (dateString) {
        try {
          const date = new Date(dateString)
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('en-US', {
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        } catch (e) {
          console.error("Error formatting date:", e)
        }
      }

      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {formattedDate}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsButton 
        color={row.original} 
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original)}
      />
    ),
  },
]