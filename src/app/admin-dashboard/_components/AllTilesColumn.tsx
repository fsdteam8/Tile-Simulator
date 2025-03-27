"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { AllTilesDataType } from "./AllTilesData";
import AuctionButton from "./AuctionButton";



export const AllTilesColumn: ColumnDef<AllTilesDataType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    header: "Tiles",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <Image src={row.original.image} alt="tile image" width={75} height={75}/>
        </div>
      );
    },
  },
  {
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.title}</span>
        </div>
      );
    },
  },
  {
    header: "Category",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.category}</span>
        </div>
      );
    },
  },
  {
    header: "Added",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.added}</span>
        </div>
      );
    },
  },

  {
    header: "Actions",
    cell: ({row}) => {
      return (
        <div>
          <AuctionButton row={row}/>
        </div>
      );
    },
  }
];