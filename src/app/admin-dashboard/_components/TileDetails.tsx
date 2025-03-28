import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

interface TileDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
}
const TileDetails = ({ open, onOpenChange, row }: TileDetailsProps) => {
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
                {row?.original?.title}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Image:
                </strong>
              </div>
              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                <Image
                  src={row?.original?.image}
                  alt={row?.original?.title}
                  width={75}
                  height={75}
                  className="rounded-md"
                />
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Category:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.category}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Publish Date:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.added}
              </div>
            </li>
            <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Description:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.description}
              </div>
            </li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TileDetails;
