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

export const createAllTilesColorColumn = ({ onEdit}: ColumnProps): ColumnDef<Color>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    header: "Color Name",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original?.name}</span>
        </div>
      )
    },
  },
  {
    header: "Preview",
    cell: ({ row }) => {
      const isColor = row.original.code?.startsWith("#")

      return (
        <div className="flex justify-center items-center">
          {isColor ? (
            <div
              className="w-12 h-12 rounded-md border border-gray-300"
              style={{ backgroundColor: row.original.code || "#ccc" }}
            />
          ) : (
            <div className="w-12 h-12 rounded-md overflow-hidden">
              <Image
                src={row.original.image ? `/${row.original.image}`: "/placeholder.svg"}
                alt={row.original.name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      )
    },
  },
  {
    header: "Type",
    cell: ({ row }) => {
      const isColor = row.original.image?.startsWith("#")
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
    header: "Date",
    cell: ({ row }) => {
      const dateString = row.original.updated_at;
      const date = new Date(dateString); // Parse the string into a Date object

      // Format the Date object
      const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit'
      });


      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">{formattedDate}</span>
        </div>
      )
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <ActionsButton row={row} onEdit={onEdit} />
        </div>
      )
    },
  },
]

