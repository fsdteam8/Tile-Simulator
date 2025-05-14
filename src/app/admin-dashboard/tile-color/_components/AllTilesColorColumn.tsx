"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import ActionsButton from "./ActionsButton";
import Image from "next/image";
import { ColorItem } from "./AllTilesColorData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner"; // or your toast library
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import moment from "moment";

interface ColumnProps {
  onEdit?: (color: ColorItem) => void;
  onDelete: (color: ColorItem) => void;
}

// Create a separate component for the status dropdown
const StatusDropdown = ({ color }: { color: ColorItem }) => {
  const [status, setStatus] = useState(color.status);
  const session = useSession();
  const token = (session?.data?.user as { token?: string })?.token;
  const queryClient = useQueryClient();

  const handleStatusChange = async (newStatus: string) => {
    const originalStatus = status;
    setStatus(newStatus);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors/status/${color.id}?_method=PUT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus.toLowerCase() }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus(originalStatus);
        toast.error(data.message || "Failed to update status");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["allTilesColor"] });
      toast.success("Status updated successfully");
    } catch (error) {
      setStatus(originalStatus);
      console.error("Status update error:", error);
      toast.error("Network error - please try again");
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-2 py-1 text-base font-normal rounded-[30px] leading-[120%] bg-[#EBEBEB] text-black flex items-center gap-1 capitalize">
            {status.toLowerCase() === "draft" ? "Draft" : "Published"}
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
        <DropdownMenuContent className="bg-white shadow-md rounded-md p-1 min-w-[120px] z-50">
          <DropdownMenuItem
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm"
            onClick={() => handleStatusChange("Published")}
          >
            Published
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-sm"
            onClick={() => handleStatusChange("Draft")}
          >
            Draft
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};


export const createAllTilesColorColumn = ({
  onDelete,
}: ColumnProps): ColumnDef<ColorItem>[] => [
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
    id: "preview",
    header: "Title",
    cell: ({ row }) => {
      const isColor = row.original.code?.startsWith("#");
      const imageUrl = row.original.image
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${row.original.image}`
        : "";

      return (
        <div className="flex justify-center items-center">
          {isColor ? (
            <div
              className="w-12 h-12 rounded-md border border-gray-300"
              style={{ backgroundColor: row.original.code || "#ccc" }}
            />
          ) : (
            <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={row.original.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                    }
                  }}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex justify-center items-center gap-[2px]">
        <span className="text-base font-normal text-black leading-[120%] text-center">
          {row.original.name}
        </span>
      </div>
    ),
  },
  
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => {
      const isColor = row.original.code?.startsWith("#");
      return (
        <div className="flex justify-center items-center gap-[2px]">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {isColor ? "Color" : "Image"}
          </span>
        </div>
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => <StatusDropdown color={row.original} />,
  },
  {
    header: "Added",
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <span className="text-base font-normal text-black leading-[120%] text-center">
          {moment(row.original.created_at).format("D MMM, YYYY")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsButton
        color={row.original}
        onDelete={() => onDelete(row.original)}
      />
    ),
  },
];
