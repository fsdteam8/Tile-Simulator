"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuthToken from "@/hooks/useAuthToken";

type StatusDropdownProps = {
  tileId: number;
  initialStatus: "Published" | "draft";
};

const StatusDropdown = ({ tileId, initialStatus }: StatusDropdownProps) => {
  const [status, setStatus] = useState<"Published" | "draft">(initialStatus);
  const token = useAuthToken();

  const handleStatusChange = async (newStatus: "Published" | "draft") => {
    setStatus(newStatus); // Optimistic update

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles/status/${tileId}?_method=PUT`,
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
        toast.error(data.message || "Failed to update status");
        return;
      }

      toast.success(data.message || "Status updated successfully");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Network error");
    }
  };

  return (
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
        <DropdownMenuItem onClick={() => handleStatusChange("Published")}>
          Published
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("draft")}>
          Draft
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
