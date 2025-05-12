/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import ActionsSubmissionButton from "./AuctionButton";
import { Submission } from "@/components/types/submissionAllDataType";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useSession } from "next-auth/react";
import moment from "moment";

export const AllSubmissionColumn: ColumnDef<Submission>[] = [
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
    header: "Product",
    cell: ({ row }) => {
      const svgBase64 = row.original.svg_base64;

      if (svgBase64) {
        try {
          const decodedSvg = decodeURIComponent(escape(atob(svgBase64)));
          return (
            <div
              className="w-[75px] h-[75px] flex items-center justify-center border border-gray-200 rounded"
              dangerouslySetInnerHTML={{ __html: decodedSvg }}
            />
          );
        } catch {
          return <span className="text-red-500">Invalid SVG</span>;
        }
      }

      return <span className="text-gray-400">No image</span>;
    },
  },
  {
    header: "Name",
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
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.email}
          </span>
        </div>
      );
    },
  },
  {
    header: "Phone Number",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.phone_number}
          </span>
        </div>
      );
    },
  },
  {
    header: "Quantity",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.quantity_needed}
          </span>
        </div>
      );
    },
  },
  {
    header: "Quantity Unit",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
          <span className="text-base font-normal text-black leading-[120%] text-center">
            {row.original.quantity_unit}
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
        row.original.status as "Published" | "draft"
      );
      const session = useSession();
      const token = (session?.data?.user as { token: string })?.token;

      const handleStatusChange = async (newStatus: "Published" | "draft") => {
        setStatus(newStatus); // Immediate UI update

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/status/${row.original.id}?_method=PUT`,
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
    header: "Added",
    cell: ({ row }) => {
      return (
        <div className="w-full flex justify-center items-center">
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
          <ActionsSubmissionButton row={row} />
        </div>
      );
    },
  },
];
