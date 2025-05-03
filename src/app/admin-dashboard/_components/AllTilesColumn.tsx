"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import AuctionButton from "./AuctionButton";
import { Tile } from "./AllTilesData";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "react-toastify";

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
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${row.original.image}`}
            alt="tile image"
            width={75}
            height={75}
          />
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
    header: "Status",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [status, setStatus] = useState(row.original.status);

      const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus); // Immediate UI update

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles/status/${row.original.id}?_method=PUT`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: newStatus }),
            }
          );

          const data = await res.json();

          if (!res.ok || !data.success) {
            // Display error toast
            toast.error(data.message || "Something went wrong");
            return;
          }

          // Success toast
          toast.success(data.message || "Status updated successfully");
        } catch (error) {
          console.error("Status update error:", error);
          toast.error("Network or server error");
        }
      };

      return (
        <div className="w-full flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="px-2 py-1 text-base font-normal rounded-[30px] leading-[120%] bg-[#EBEBEB] text-black flex items-center gap-1"
              >
                {status}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="py-0 px-0"
                onClick={() => handleStatusChange("Published")}
              >
                Published
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-0 px-0"
                onClick={() => handleStatusChange("Draft")}
              >
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
