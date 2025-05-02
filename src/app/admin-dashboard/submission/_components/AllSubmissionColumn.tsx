"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { AllSubmissionDataType } from "./AllSubmissionData";
import ActionsSubmissionButton from "./AuctionButton";



export const AllSubmissionColumn: ColumnDef<AllSubmissionDataType>[] = [
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
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.name}</span>
        </div>
      );
    },
  },
  {
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.email}</span>
        </div>
      );
    },
  },
  {
    header: "Phone",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.phone}</span>
        </div>
      );
    },
  },
  {
    header: "Quantity",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.quantity}</span>
        </div>
      );
    },
  },
  {
    header: "Quantity Unit",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">{row.original.quantityUnit}</span>
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
          <ActionsSubmissionButton row={row}/>
        </div>
      );
    },
  }
];