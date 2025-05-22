"use client";

import type { SvgData } from "@/components/svg-editor/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tile } from "./types/tiles";

interface Props {
  currentSvg: SvgData[] | null;
  pathColors?: Record<string, string>;
  showBorders?: boolean;
  rotations?: number[];
  groutThickness: string;
  setGroutThickness: (groutThickness: string) => void;
  setGroutColor: (groutColor: string) => void;
  groutColor: string;
  selectedTile?: Tile | null;
}

export default function ViewPanel({
  selectedTile,
  currentSvg,
  pathColors = {},
  showBorders = false,
  rotations = [0, 0, 0, 0],
  groutThickness,
  groutColor,
}: Props) {
  const [gridSize, setGridSize] = useState<"200x50">("200x50");
  console.log(setGridSize);
  const [environment, setEnvironment] = useState<
    | "environment1"
    | "environment2"
    | "environment3"
    | "environment4"
    | "environment5"
    | "environment6"
  >();

  const [isLoading, setIsLoading] = useState(false)
  const tileGridRef = useRef<HTMLDivElement>(null);
  const [showTilePreview, setShowTilePreview] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  console.log(setIsLoading);

  console.log(setShowTilePreview);
  const [tileTransform, setTileTransform] = useState({
    marginTop: isSmallScreen ? "18px" : "0px",
    transform: isSmallScreen ? "rotateX(0deg)" : "rotateX(0deg)",
    height: "70%",
  });



  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);




  const router = useRouter();

  const handleTileEnvironmentClose = () => {
    setEnvironment(undefined);
    setTileTransform({
      marginTop: isSmallScreen ? "0px" : "-30px",
      transform: isSmallScreen ? "rotateX(0deg)" : "rotateX(0deg)",
      height: "0%",
    });
  };

  const handleSaveAndShare = () => {
    // Prepare data to pass to the preview page
    const tileData = {
      svgData: currentSvg,
      pathColors,
      showBorders,
      rotations,
      groutColor,
      groutThickness,
      gridSize,
      environment: environment || "none",
      selectedTile
    };

    // Save to localStorage (as URL params would be too large)
    localStorage.setItem("tilePreviewData", JSON.stringify(tileData));

    // Navigate to the preview page
    router.push("/preview-your-custom-tile");
  };


  // Calculate grid dimensions based on selected size
  const gridDimensions = 75; 



  // Update grid when SVG or settings change
  useEffect(() => {
    if (!currentSvg || !currentSvg.length || !tileGridRef.current) return;


    // Clear existing grid
    const container = tileGridRef.current;
    container.innerHTML = "";

    // Define this function outside the loop or at the top of the useEffect
    function style(i: number, j: number, tileName?: string) {


      if (tileName === "Rectangle2x8") {
        // Special styling for Tiffany pattern
        return {
          marginLeft: i % 2 !== 0 ? "20px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-2px" : "-7px",
        };
      } else if (tileName === "Rectangle4x8") {
        return {
          marginLeft: i % 2 !== 0 ? "22px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-2px" : "-7px",
        };
      } else if (tileName === "Tiffany") {
        return {
          marginLeft: i % 2 !== 0 ? "19px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-18px" : "-7px",
        };
      } else if (tileName === "Fiori") {
        return {
          marginLeft: i % 2 !== 0 ? "18.4px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-12px" : "-7px",
        };
      } else if (tileName === "Gio") {
        return {
          marginLeft: i % 2 !== 0 ? "20.5px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-6px" : "-7px",
          transform: "rotate(30deg)",
        };
      } else if (tileName === "Indie") {
        return {
          marginLeft: i % 2 !== 0 ? "20px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-20.5px" : "-7px",
          transform: i % 2 !== 0 ? "rotate(180deg)" : "rotate(0deg)",
        };
      } else if (tileName === "Triangle") {
        return {
          marginLeft: i % 2 !== 0 ? "18.8px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-19px" : "-7px",
          transform: i % 2 !== 0 ? "rotate(180deg)" : "rotate(0deg)",
        };
      } else {
        return {
          marginLeft: i % 2 !== 0 ? "19px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-19.5px" : "-7px",
        };
      }



    }



    // Determine if we should use a 2x2 pattern (for 4 SVGs)
    const useQuadPattern = currentSvg.length === 4;

    // Create grid cells
    for (let i = 0; i < gridDimensions; i++) {
      for (let j = 0; j < gridDimensions; j++) {
        const cell = document.createElement("div");
        cell.className = `tile-cell ${groutThickness} ${groutColor}-grout`;

        if (useQuadPattern) {
          // Create a 2x2 grid inside each cell for 4 SVGs
          const innerGrid = document.createElement("div");
          innerGrid.className = "grid grid-cols-2 w-full h-full gap-[1px]";

          // Add 4 SVGs in a 2x2 pattern
          for (let k = 0; k < 4; k++) {
            const svgIndex = k;
            const svg = currentSvg[svgIndex];
            const rotation = rotations[svgIndex];

            const innerCell = document.createElement("div");
            innerCell.className = "relative w-full h-full";

            const svgElement = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            svgElement.setAttribute("viewBox", svg.viewBox || "0 0 100 100");
            svgElement.style.transform = `rotate(${rotation}deg)`;
            svgElement.setAttribute("data-rotation", rotation.toString());

            // Add paths
            svg.paths.forEach((path) => {
              const pathElement = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              pathElement.setAttribute("d", path.d);
              pathElement.setAttribute(
                "fill",
                pathColors[path.id] || path.fill || "#000000"
              );
              const color = pathColors[path.id] || path.fill || "#000000"

              if (color && color.startsWith("image:")) {
                // For image-based colors, create a pattern
                const imagePath = color.replace("image:", "")
                const patternId = `pattern-${path.id}-${i}-${j}`

                // Create pattern definition
                const patternDef = document.createElementNS("http://www.w3.org/2000/svg", "pattern")
                patternDef.setAttribute("id", patternId)
                patternDef.setAttribute("patternUnits", "userSpaceOnUse")
                patternDef.setAttribute("width", "100%")
                patternDef.setAttribute("height", "100%")

                // Create image element
                const imageEl = document.createElementNS("http://www.w3.org/2000/svg", "image")
                imageEl.setAttribute("href", `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`)
                imageEl.setAttribute("x", "0")
                imageEl.setAttribute("y", "0")
                imageEl.setAttribute("width", "100%")
                imageEl.setAttribute("height", "100%")
                imageEl.setAttribute("preserveAspectRatio", "xMidYMid slice")

                // Add image to pattern
                patternDef.appendChild(imageEl)

                // Add pattern to defs
                const defs =
                  svgElement.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs")
                if (!svgElement.querySelector("defs")) {
                  svgElement.appendChild(defs)
                }
                defs.appendChild(patternDef)

                // Set fill to use pattern
                pathElement.setAttribute("fill", `url(#${patternId})`)
              } else {
                // For solid colors
                pathElement.setAttribute("fill", color)
              }

              if (showBorders) {
                pathElement.setAttribute("stroke", "#000000");
                pathElement.setAttribute("stroke-width", "1");
              }
              svgElement.appendChild(pathElement);
            });

            innerCell.appendChild(svgElement);
            innerGrid.appendChild(innerCell);
          }

          cell.appendChild(innerGrid);
        } else {

          const svgIndex = (i * gridDimensions + j) % currentSvg.length;
          const svg = currentSvg[svgIndex];
          const rotation = rotations[svgIndex];

          // Create a wrapper div for the SVG
          const wrapper = document.createElement("div");
          wrapper.className = "relative w-full h-full";

          // Apply styled margins based on i and j
          // Then in your useEffect where you create the grid cells, modify the style application:
          Object.assign(wrapper.style, style(i, j, selectedTile?.name));

          const svgElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          svgElement.setAttribute("viewBox", svg.viewBox || "0 0 100 100");
          svgElement.style.transform = `rotate(${rotation}deg)`;

          svgElement.style.padding = `2px 1px`; // Add padding to all SVG elements
          svgElement.setAttribute("data-rotation", rotation.toString());

          // Add paths
          svg.paths.forEach((path) => {
            const pathElement = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            pathElement.setAttribute("d", path.d);




            const color = pathColors[path.id] || path.fill || "#000000"

            if (color && color.startsWith("image:")) {
              // For image-based colors, create a pattern
              const imagePath = color.replace("image:", "")
              const patternId = `pattern-${path.id}-${i}-${j}`

              // Create pattern definition
              const patternDef = document.createElementNS("http://www.w3.org/2000/svg", "pattern")
              patternDef.setAttribute("id", patternId)
              patternDef.setAttribute("patternUnits", "userSpaceOnUse")
              patternDef.setAttribute("width", "100%")
              patternDef.setAttribute("height", "100%")

              // Create image element
              const imageEl = document.createElementNS("http://www.w3.org/2000/svg", "image")
              imageEl.setAttribute("href", `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`)
              imageEl.setAttribute("x", "0")
              imageEl.setAttribute("y", "0")
              imageEl.setAttribute("width", "100%")
              imageEl.setAttribute("height", "100%")
              imageEl.setAttribute("preserveAspectRatio", "xMidYMid slice")

              // Add image to pattern
              patternDef.appendChild(imageEl)

              // Add pattern to defs
              const defs =
                svgElement.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs")
              if (!svgElement.querySelector("defs")) {
                svgElement.appendChild(defs)
              }
              defs.appendChild(patternDef)

              // Set fill to use pattern
              pathElement.setAttribute("fill", `url(#${patternId})`)
            } else {
              // For solid colors
              pathElement.setAttribute("fill", color)
            }


            if (showBorders) {
              pathElement.setAttribute("stroke", "#000000");
              pathElement.setAttribute("stroke-width", "1");
            }
            svgElement.appendChild(pathElement);
          });

          wrapper.appendChild(svgElement);
          cell.appendChild(wrapper);
        }

        container.appendChild(cell);
      }
    }
  }, [
    currentSvg,
    pathColors,
    showBorders,
    rotations,
    gridSize,
    groutColor,
    groutThickness,
    gridDimensions,
  ]);

  return (
    <div className="space-t-6 h-full ">
      <Tabs defaultValue="room-view" className="w-full">
        <TabsContent value="room-view">
          <div className="lg:flex gap-[78px] ">
            <div className="relative w-full h-[254px] md:h-[470px]  lg:h-[600px] rounded-lg border overflow-hidden  border-gray-200">
              {/* Tile Preview Area - Placed FIRST so it appears behind the image */}
              <div>
                {showTilePreview && (
                  <div
                    className={`absolute  ${groutColor}-grout z-0 parrr `}
                    style={{
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                      gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
                      padding: groutThickness === "none" ? "0px" : groutThickness === "thin" ? "1px" : "2px",
                    }}
                  >
                    <div
                      ref={tileGridRef}
                      className={`grid gap-[${groutThickness === "none"
                        ? "0"
                        : groutThickness === "thin"
                          ? "1px"
                          : "2px"
                        }]   bg-${groutColor}`}
                      style={{
                        gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
                        width: "2800px",
                        marginLeft: "-50px",
                        height: tileTransform.height,
                        marginTop: tileTransform.marginTop,
                        transform: tileTransform.transform,

                      }}
                    ></div>
                  </div>
                )}
              </div>
              {/* Environment Images - Placed AFTER tiles so they appear on top */}

              {environment === "environment1" && (
                <Image
                  src="/assets/environment1.webp"
                  alt="Bathroom"
                  fill
                  className=" object-cover z-10"
                  style={{ pointerEvents: "none" }}
                  priority
                />
              )}

              {environment === "environment2" && (
                <Image
                  src="/assets/environment2.webp"
                  alt="Bathroom"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                  priority
                />
              )}
              {environment === "environment3" && (
                <Image
                  src="/assets/environment3.webp"
                  alt="Bathroom"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                  priority
                />
              )}
              {environment === "environment4" && (
                <Image
                  src="/assets/environment4.webp"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                  priority
                />
              )}
              {environment === "environment5" && (
                <Image
                  src="/assets/environment5.webp"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                  priority
                />
              )}
              {environment === "environment6" && (
                <Image
                  src="/assets/environment6.png"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                  priority
                />
              )}

              {/* Toggle Button */}
              {environment && (
                <Button
                  className="absolute top-2 z-30 right-2 bg-white/80 hover:bg-white text-black text-xs py-1 px-2 h-auto"
                  onClick={handleTileEnvironmentClose}
                >
                  {showTilePreview ? "Hide Tiles" : "Show Tiles"}
                </Button>
              )}
            </div>
            <div className="space-y-4 mt-4 lg:mt-0">
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-1 gap-3">
                <Button
                  variant={
                    environment === "environment1" ? "default" : "outline"
                  }
                  onClick={() => {
                    setEnvironment("environment1");
                    setTileTransform({
                      marginTop: isSmallScreen ? "18px" : "0px",
                      transform: isSmallScreen
                        ? "rotateX(65deg)"
                        : "rotateX(71deg)",
                      height: "70%",
                    });
                  }}
                  className="h-[60px] w-[100px] md:w-[130px] lg:h-[90px] lg:w-[110px] py-1"
                >
                  <Image
                    src="/assets/env_kitchen_icon.png"
                    alt="Bedroom Hover Icon"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={
                    environment === "environment2" ? "default" : "outline"
                  }
                  onClick={() => {
                    setEnvironment("environment2");
                    setTileTransform({
                      marginTop: isSmallScreen ? "18px" : "0px",
                      transform: isSmallScreen
                        ? "rotateX(65deg)"
                        : "rotateX(71deg)",
                      height: "70%",
                    });
                  }}
                  className="h-[60px] w-[100px] md:w-[130px] lg:h-[90px] lg:w-[110px] py-1"
                >
                  <Image
                    src="/assets/env_bathroom_icon.png"
                    alt="bathroom"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={
                    environment === "environment3" ? "default" : "outline"
                  }
                  onClick={() => {
                    setEnvironment("environment3");
                    setTileTransform({
                      marginTop: isSmallScreen ? "18px" : "0px",
                      transform: isSmallScreen
                        ? "rotateX(65deg)"
                        : "rotateX(71deg)",
                      height: "70%",
                    });
                  }}
                  className="h-[60px] w-[100px] md:w-[130px] lg:h-[90px] lg:w-[110px] py-1"
                >
                  <Image
                    src="/assets/bathroom2.png"
                    alt="ketchen"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={
                    environment === "environment4" ? "default" : "outline"
                  }
                  onClick={() => {
                    setEnvironment("environment4");
                    setTileTransform({
                      marginTop: isSmallScreen ? "18px" : "0px",
                      transform: isSmallScreen
                        ? "rotateX(65deg)"
                        : "rotateX(71deg)",
                      height: "70%",
                    });
                  }}
                  className="h-[60px] w-[100px] md:w-[130px] lg:h-[90px] lg:w-[110px] py-1"
                >
                  <Image
                    src="/assets/env_living_room_icon.png"
                    alt="Commercial"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={
                    environment === "environment5" ? "default" : "outline"
                  }
                  onClick={() => {
                    setEnvironment("environment5");
                    setTileTransform({
                      marginTop: isSmallScreen ? "18px" : "0px",
                      transform: isSmallScreen
                        ? "rotateX(65deg)"
                        : "rotateX(71deg)",
                      height: "70%",
                    });
                  }}
                  className="h-[60px] w-[100px] md:w-[130px] lg:h-[90px] lg:w-[110px] py-1"
                >
                  <Image
                    src="/assets/waiting-room.svg"
                    alt="Commercial"
                    width={100}
                    height={100}
                    className="w-[120px] h-[80px] md:h-[60px]"
                  />
                </Button>
                <Button
                  variant={
                    environment === "environment6" ? "default" : "outline"
                  }
                  onClick={() => {
                    setEnvironment("environment6");
                    setTileTransform({
                      marginTop: isSmallScreen ? "18px" : "0px",
                      transform: isSmallScreen
                        ? "rotateX(65deg)"
                        : "rotateX(71deg)",
                      height: "70%",
                    });
                  }}
                  className="h-[60px] w-[100px] md:w-[130px] lg:h-[90px] lg:w-[110px] py-1"
                >
                  <Image
                    src="/assets/env_commercial_room_icon.png"
                    alt="Commercial"
                    width={100}
                    height={100}
                  />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grid-view" className="space-y-4">
          <div
            className={`grid gap-[${groutThickness === "none"
              ? "0"
              : groutThickness === "thin"
                ? "1px"
                : "2px"
              }] bg-${groutColor} aspect-square`}
            style={{
              gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
            }}
          >
            <div
              ref={tileGridRef}
              className={`grid gap-[${groutThickness === "none"
                ? "0"
                : groutThickness === "thin"
                  ? "1px"
                  : "2px"
                }] bg-${groutColor}`}
              style={{
                gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-[32px] md:pt-[38px] lg:pt-[44px] xl:pt-[50px] 2xl:pt-[56px] pb-[40px] mb:pb-[60px] lg:pb-[80px] xl:pb-[100px] 2xl:pb-[120px] flex items-center justify-center">
        <Button
          className="w-[288px] h-[51px] text-base font-medium leading-[120%] text-white"
          onClick={handleSaveAndShare}
          disabled={isLoading || !currentSvg || currentSvg.length === 0}
        >
          {isLoading ? "Saving..." : "Save & Share"}
        </Button>
      </div>

      <style jsx>{`
        .tile-cell {
          aspect-ratio: 1;
          position: relative;
        }
        .tile-cell svg {
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
        }
        .none {
          gap: 0;
        }
        .thin {
          gap: 1px;
        }
        .thick {
          gap: 2px;
        }
        .orange-grout {
          background-color: orange;
        }
        .green-grout {
          background-color: green;
        }
        .turquoise-grout {
          background-color: turquoise;
        }
        .blue-grout {
          background-color: blue;
        }
      `}</style>
    </div>
  );
}
