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

interface Category {
  name: string;
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
                {row?.original?.name}
              </div>
            </li>
            {/* <li className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-1">
                <strong className="text-lg font-medium text-black leading-[120%]">
                  Image:
                </strong>
              </div>
              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.image_svg_text ? (
                  (() => {
                    try {
                      const decodedSvg = decodeURIComponent(
                        escape(atob(row.original.image_svg_text))
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
            </li> */}
            <li className="grid grid-cols-1 md:grid-cols-3">
  <div className="md:col-span-1">
    <strong className="text-lg font-medium text-black leading-[120%]">
      Image:
    </strong>
  </div>
  <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
    {row?.original?.image_svg_text ? (
      (() => {
        try {
          const decodedSvg = decodeURIComponent(
            escape(atob(row.original.image_svg_text))
          );

          // Wrap decoded SVG in a scalable wrapper
          const wrappedSvg = decodedSvg.replace(
            /<svg([^>]*)>/,
            `<svg$1 style="width: 100%; height: 100%; object-fit: contain;" preserveAspectRatio="xMidYMid meet">`
          );

          return (
            <div className="flex flex-col gap-2">
              <div
                className="w-[200px] h-[200px] flex items-center justify-center border border-gray-200 rounded overflow-hidden bg-white"
                dangerouslySetInnerHTML={{ __html: wrappedSvg }}
              />

              <button
                onClick={() => {
                  const svgWindow = window.open("", "_blank");
                  if (svgWindow) {
                    svgWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>SVG Viewer</title>
                          <style>
                            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
                            .svg-container { max-width: 90vw; max-height: 90vh; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                            svg { width: 100%; height: 100%; object-fit: contain; }
                          </style>
                        </head>
                        <body>
                          <div class="svg-container">${decodedSvg}</div>
                        </body>
                      </html>
                    `);
                    svgWindow.document.close();
                  }
                }}
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                type="button"
              >
                View Full SVG
              </button>
            </div>
          );
        } catch (error) {
          console.error("SVG parsing error:", error);
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
                  Category:
                </strong>
              </div>

              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.categories.map(
                  (category: Category) => category?.name
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
                {moment(row?.original?.created_at).format("D MMM, YYYY")}
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
