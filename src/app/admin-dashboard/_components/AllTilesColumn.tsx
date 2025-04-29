"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import AuctionButton from "./AuctionButton";
import { Tile } from "./AllTilesData";
import moment from 'moment';


export const AllTilesColumn: ColumnDef<Tile>[] = [
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
      console.log(row.original.image);
      return (
        <div className="w-full flex justify-center items-center">
          <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${row.original.image}`}  alt="tile image" width={75} height={75}/>
        </div>
      );
    },
  },
  {
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.name}
          </span>
        </div>
      );
    },
  },
  {
    header: "Category",
    cell: ({ row }) => {
      console.log(row);
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.categories.length > 0
              ? row.original.categories[0].name
              : "No Category"}
          </span>
        </div>
      );
    },
  },
  {
    header: "Added",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {moment(row.original.created_at).format("DD-MM-YYYY")}
          </span>
        </div>
      );
    },
  },

  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <AuctionButton row={row} />
        </div>
      );
    },
  },
];
