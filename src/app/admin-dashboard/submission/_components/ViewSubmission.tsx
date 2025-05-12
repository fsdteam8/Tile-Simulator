import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import moment from "moment";

interface TileDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
}

const ViewSubmission = ({ open, onOpenChange, row }: TileDetailsProps) => {
  console.log({ row });
  return (
    <div className="p-10">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="px-20 py-10">
          <ul className="space-y-2">
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Name:
                </strong>
              </div>
              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.name}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Image:
                </strong>
              </div>
              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.svg_base64 ? (
                  (() => {
                    try {
                      const decodedSvg = decodeURIComponent(
                        escape(atob(row.original.svg_base64))
                      );
                      return (
                        <div
                          className="w-[75px] h-[75px] flex items-center justify-center border border-gray-200 rounded"
                          dangerouslySetInnerHTML={{ __html: decodedSvg }}
                        />
                      );
                    } catch {
                      return <span className="text-red-500">Invalid SVG</span>;
                    }
                  })()
                ) : row?.original?.image ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${row.original.image}`}
                    alt={row.original.name || "Tile image"}
                    width={75}
                    height={75}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-[75px] h-[75px] flex items-center justify-center border border-gray-200 rounded text-gray-400">
                    No image
                  </div>
                )}
              </div>
            </li>

            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Publish Date:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {moment(row.original.created_at).format("D MMM, YYYY")}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Email:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.email}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Phone Number:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.phone_number}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Message:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.message}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Tile Name:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.tile_name}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Quantity Unit:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.quantity_unit}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Quantity Needed:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.quantity_needed}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Status:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.status}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Referred By:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.referred_by}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Ohter Specify:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.other_specify}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Grout Color:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.grout_color}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Grout Thickness:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.grout_thickness}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Grid Category:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.grid_category}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Rotations:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.rotations}
              </div>
            </li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewSubmission;
