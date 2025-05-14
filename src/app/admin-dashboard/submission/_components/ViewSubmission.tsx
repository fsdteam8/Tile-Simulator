"use client";
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

                      // Create a container with proper styling
                      return (
                        <div className="flex flex-col gap-2">
                          <div
                            className="w-[200px] h-[200px] flex items-center justify-center border border-gray-200 rounded overflow-hidden bg-white"
                            dangerouslySetInnerHTML={{ __html: decodedSvg }}
                          />

                          {/* Add a button to view the SVG in full size */}
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
                  SVG use color:
                </strong>
              </div>
              <div className="md:col-span-2 text-base font-normal leading-[120%] text-secondary-300">
                {row?.original?.svg_base64 ? (
                  (() => {
                    try {
                      const decodedSvg = decodeURIComponent(
                        escape(atob(row.original.svg_base64))
                      );

                      // Extract color information from SVG
                      const colorMatches =
                        decodedSvg.match(
                          /fill="#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})"/g
                        ) || [];
                      const colors = [
                        ...new Set(
                          colorMatches
                            .map((match) => {
                              const colorMatch = match.match(
                                /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/
                              );
                              return colorMatch ? colorMatch[0] : null;
                            })
                            .filter(Boolean)
                        ),
                      ];

                      // Improved image URL extraction
                      const extractImageUrl = (svg: string) => {
                        // First try standard xlink:href
                        let imageMatch = svg.match(
                          /xlink:href=["']([^"']+)["']/i
                        );
                        if (imageMatch && imageMatch[1]) {
                          return decodeURIComponent(imageMatch[1]);
                        }

                        // Then try modern href (without xlink:)
                        imageMatch = svg.match(/href=["']([^"']+)["']/i);
                        if (imageMatch && imageMatch[1]) {
                          return decodeURIComponent(imageMatch[1]);
                        }

                        // Finally try camelCase version (xlinkHref)
                        imageMatch = svg.match(/xlinkHref=["']([^"']+)["']/i);
                        if (imageMatch && imageMatch[1]) {
                          return decodeURIComponent(imageMatch[1]);
                        }

                        return null;
                      };

                      const imageUrl = extractImageUrl(decodedSvg);
                      console.log("Extracted Image URL:", imageUrl);

                      return (
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            {colors.length > 0 ? (
                              colors.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color || "" }}
                                  title={color ?? undefined}
                                />
                              ))
                            ) : (
                              <span className="text-gray-500">
                                No colors detected
                              </span>
                            )}
                          </div>
                          <div>
                            {imageUrl ? (
                              <div className="flex flex-col gap-2">
                                <Image
                                  src={imageUrl}
                                  alt="Pattern image"
                                  width={50}
                                  height={50}
                                  className=" object-cover w-6 h-6 rounded-full border border-gray-300"
                                  unoptimized
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                            ) : (
                              <span className="text-gray-500">
                                No pattern image found
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.error("Error parsing SVG:", error);
                      return (
                        <span className="text-red-500">
                          Unable to parse SVG details
                        </span>
                      );
                    }
                  })()
                ) : (
                  <span className="text-gray-500">No SVG data available</span>
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
