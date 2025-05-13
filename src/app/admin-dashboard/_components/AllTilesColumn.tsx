"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import AuctionButton from "./AuctionButton";
import { Tile } from "./AllTilesData";
import moment from "moment";
import StatusDropdown from "./StatusDropdown";

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
      const svgBase64 = row.original.image_svg_text;

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
    header: "Title",
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <span className="text-base font-normal text-black leading-[120%] text-center">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    header: "Category",
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <span className="text-base font-normal text-black leading-[120%] text-center">
          {row.original.categories.length > 0
            ? row.original.categories[0].name
            : "No Category"}
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <StatusDropdown
          tileId={row.original.id}
          initialStatus={row.original.status as "Published" | "draft"}
        />
      </div>
    ),
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
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <AuctionButton row={row} />
      </div>
    ),
  },
];
