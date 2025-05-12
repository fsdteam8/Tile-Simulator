/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import ActionsButton from "./ActionsButton";
import moment from "moment";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Category } from "@/components/types/all-tiles-categories";

interface ColumnProps {
  onEdit: (category: Category) => void;
}

export const createAllTilesCategoriesColumn = ({
  onEdit,
}: ColumnProps): ColumnDef<Category>[] => [
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
    header: "Categories Name",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.name}
          </span>
        </div>
      );
    },
  },
  {
    header: "Count",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.tiles_count}
          </span>
        </div>
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [status, setStatus] = useState<"Published" | "draft">(
        row.original.status
      );
      const session = useSession();
      const token = (session?.data?.user as { token: string })?.token;
      console.log(token);

      const handleStatusChange = async (newStatus: "Published" | "draft") => {
        setStatus(newStatus); // Immediate UI update

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/status/${row.original.id}?_method=PUT`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
              <button className="px-2 py-1 text-base font-normal rounded-[30px] leading-[120%] bg-[#EBEBEB] text-black flex items-center gap-1">
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
                onClick={() => handleStatusChange("draft")}
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
    header: "Date",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {moment(row.original.created_at).format("D MMM, YYYY")}
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
          <ActionsButton row={row} onEdit={onEdit} />
        </div>
      );
    },
  },
];
