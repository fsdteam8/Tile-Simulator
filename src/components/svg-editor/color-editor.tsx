"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ColorPicker } from "./color-picker";
import { ColorItem } from "./colortype";
import GroutThicknessColor from "./grout-thickness-color";
import { SvgRenderer } from "./svg-renderer";
import type { ColorData, SvgData } from "./types";

interface ColorEditorProps {
  svgArray: SvgData[]; // Expect an array of SvgData
  showBorders: boolean;
  setShowBorders: (show: boolean) => void;
  onColorSelect?: (pathId: string, color: ColorData) => void;
  onRotate: (tileId: string, index: number, newRotation: number) => void;
  tileId: string;
  rotations?: number[]; // Accept rotations from parent
  groutThickness: string;
  setGroutThickness: (groutThickness: string) => void;
  groutColor: string;
  setGroutColor: (groutColor: string) => void;
}

export function ColorEditor({
  svgArray,
  onColorSelect,
  onRotate,
  tileId,
  rotations,
  groutThickness,
  setGroutThickness,
  groutColor,
  setGroutColor,
}: ColorEditorProps) {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [pathColors, setPathColors] = useState<Record<string, string>>({});
  const [svgColors, setSvgColors] = useState<string[]>([]);
  const [apiColors, setApiColors] = useState<ColorItem[]>([]);
  const [loadingColors, setLoadingColors] = useState(true);

  console.log( loadingColors);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors?paginate_count=1000`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch colors");
        } 
        const data = await response.json();
        // Filter colors to only include published ones
        const publishedColors = data.data.data.filter(
          (color: ColorItem) => color.status === "published"
        );
        setApiColors(publishedColors);
      } catch (error) {
        console.error("Error fetching colors:", error);
      } finally {
        setLoadingColors(false);
      }
    };

    fetchColors();
  }, []);

  // Extract all unique colors from the SVG on component mount
  useEffect(() => {
    // Get all current colors from SVG paths (including modified ones)
    const allCurrentColors = svgArray
      .flatMap((svg) =>
        svg.paths.map((path) => {
          // Use the modified color if it exists, otherwise use the original
          return pathColors[path.id] || path.originalFill || path.fill;
        })
      )
      .filter(Boolean) as string[];

    // Remove duplicates
    const uniqueColors = [...new Set(allCurrentColors)];
    setSvgColors(uniqueColors);
  }, [svgArray, pathColors]);

  // Update the display of colors when pathColors changes
  useEffect(() => {
    if (svgColors.length > 0 && Object.keys(pathColors).length > 0) {
      // Don't add new colors, just update the display of existing ones
      // This ensures we only show the original SVG colors (or their replacements)
      setSvgColors((prevColors) => {
        // Keep the same colors array, just force a re-render
        return [...prevColors];
      });
    }
  }, [pathColors, svgColors.length]);

  const handlePathSelect = useCallback(
    (pathId: string) => {
      setSelectedPathId(pathId);

      // Highlight the selected path
      const path = svgArray
        .flatMap((svg) => svg.paths)
        .find((p) => p.id === pathId);
      if (path) {
        // Add a subtle animation or effect when selecting a path
        const svgElement = document.getElementById(pathId);
        if (svgElement) {
          svgElement.classList.add("path-selected");
          setTimeout(() => {
            svgElement.classList.remove("path-selected");
          }, 300);
        }

        console.log(
          `Selected path: ${pathId} with color: ${pathColors[pathId] || path.fill
          }`
        );
      }
    },
    [svgArray, pathColors]
  );


  const handleColorSelect = useCallback(
    (color: string) => {
      if (!selectedPathId) return;

      // Extract the base identifier from the path ID
      const pathIdParts = selectedPathId.split("-");
      const baseIdentifier = pathIdParts[pathIdParts.length - 1];

      // Find all paths with matching identifiers across all SVGs
      const relatedPaths = svgArray.flatMap((svg) =>
        svg.paths
          .filter((path) => {
            const parts = path.id.split("-");
            const pathIdentifier = parts[parts.length - 1];
            return pathIdentifier === baseIdentifier;
          })
          .map((path) => path.id)
      );

      // Update color for each related path
      relatedPaths.forEach((pathId) => {
        const newColor: ColorData = {
          id: `${pathId}-${color}`,
          color,
          name: `Color ${color}`,
        };

        console.log(`Setting color for path ${pathId} to ${color}`);

        setPathColors((prev) => ({
          ...prev,
          [pathId]: color,
        }));

        if (onColorSelect) {
          onColorSelect(pathId, newColor);
        }
      });
    },
    [selectedPathId, onColorSelect, svgArray]
  );


  const handleRotationChange = (index: number, newRotation: number) => {
    console.log(`[COLOR EDITOR] Rotating SVG ${index} to ${newRotation}°`);

    // Pass the rotation to the parent via the onRotate function
    onRotate(tileId, index, newRotation);
  };

  const selectedPathColor = selectedPathId
    ? pathColors[selectedPathId] ||
    svgArray.flatMap((svg) => svg.paths).find((p) => p.id === selectedPathId)
      ?.fill
    : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-7 gap-[50px] md:gap-[80px] lg:gap-[100px]  xl:gap-[130px] ">
      {/* SVG Preview (Click to select a path) */}
      <div className="col-span-2 lg:col-span-3">
        <h5 className="text-base fotn-normal leading-[120%] text-[#595959] text-center">
          Click on a section to change its color
        </h5>
        <h3 className="text-base font-medium text-black leading-[120%] text-center pt-[12px] lg:pt-[16px] xl:pt-[20px] 2xl:pt-[24px] pb-2 xl:pb-3 2xl:pb-4">
          Tile Preview
        </h3>
        <div className="w-full h-full flex justify-center items-start">
          {svgArray.length === 0 ? (
            <div className=" flex items-center justify-center bg-black/20 w-full h-[300px] md:h-[500px] lg:h-[400px] relative">
              <Image
                src="https://res.cloudinary.com/drdztqgcx/image/upload/v1746167200/image_2x_fb6njy.png"
                fill
                alt="empty tile"
              />
            </div>
          ) : (
            <div className="w-full h-full ">
              <SvgRenderer
                svgArray={svgArray}
                selectedPathId={selectedPathId}
                pathColors={pathColors}
                onPathSelect={handlePathSelect}
                onRotate={handleRotationChange}
                rotations={rotations}
              />
            </div>
          )}
        </div>
      </div>

      <div className="col-span-2 lg:col-span-4">
        {/* Colors List */}
        <div className="space-y-2">
          {svgArray.length !== 0 && (
            <h3 className="text-sm font-medium">Colors Used:</h3>
          )}
          <div className="flex flex-wrap gap-2">
            {svgColors.map((color, index) => {
              // Check if this color is currently used by any path
              const pathsWithColor = svgArray.flatMap((svg) =>
                svg.paths.filter(
                  (p) =>
                    pathColors[p.id] === color || // Check custom colors first
                    (!pathColors[p.id] && (p.originalFill || p.fill) === color) // Then check original colors
                )
              );

              const isUsedByPath = pathsWithColor.length > 0;
              const isSelectedColor =
                selectedPathId &&
                (pathColors[selectedPathId] === color ||
                  (!pathColors[selectedPathId] &&
                    svgArray
                      .flatMap((svg) => svg.paths)
                      .find((p) => p.id === selectedPathId)?.originalFill ===
                    color));

              return (
                <div
                  key={index}
                  className={`w-6 h-6 rounded border cursor-pointer transition-transform relative
                    hover:scale-110 ${isSelectedColor ? "ring-2 ring-black" : ""
                    } 
                    ${isUsedByPath ? "border-${color}" : "border-gray-200"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    // Find paths with this color and select the first one
                    if (pathsWithColor.length > 0) {
                      handlePathSelect(pathsWithColor[0].id);
                      // No color change here, just path selection
                    }
                  }}
                >
                  {/* Add indicator dot for selected color */}
                  {isSelectedColor && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-white"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-4 mt-[32px]">
          <div className="w-full flex">
            <div className="space-x-2">
              {apiColors?.map((colorItem, index) => (
                <button
                  key={index}
                  className={`w-5 md:w-6 h-5 md:h-6 rounded-sm transition-transform hover:scale-110 ${selectedPathColor === (colorItem.code || colorItem.image)
                      ? "border-black ring-2 ring-black/20"
                      : "border-gray-200"
                    }`}
                  style={{
                    backgroundColor: colorItem.code || "transparent",
                    backgroundImage: colorItem.image
                      ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/${colorItem.image})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => {
                    // For image-based colors, use a special prefix to distinguish them
                    const color = colorItem.code || (colorItem.image ? `image:${colorItem.image}` : null)
                    if (color) {
                      if (!selectedPathId && svgArray.length > 0) {
                        // If no path is selected, find the first available path
                        const firstPath = svgArray[0].paths[0]
                        if (firstPath) {
                          // First select the path and immediately apply the color
                          setSelectedPathId(firstPath.id)

                          // Create a new pathColors object with the updated color
                          const updatedPathColors = { ...pathColors }

                          // Apply to all related paths with the same base identifier
                          const baseIdentifier = firstPath.id.split("-").pop()
                          svgArray.forEach((svg) => {
                            svg.paths.forEach((path) => {
                              if (path.id.split("-").pop() === baseIdentifier) {
                                updatedPathColors[path.id] = color
                              }
                            })
                          })

                          // Update state with all changes at once
                          setPathColors(updatedPathColors)

                          // Also notify parent component
                          if (onColorSelect) {
                            onColorSelect(firstPath.id, {
                              id: `${firstPath.id}-${color}`,
                              color,
                              name: color.startsWith("image:") ? "Texture" : `Color ${color}`,
                            })
                          }
                        }
                      } else if (selectedPathId) {
                        // If a path is already selected, apply the color immediately
                        handleColorSelect(color)
                      }
                    }
                  }}
                  disabled={!selectedPathId}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Color Picker */}
        <div className="py-8">
          <ColorPicker
            color={selectedPathColor || "#000000"}
            onChange={(color) => selectedPathId && handleColorSelect(color)}
            recentColors={Object.values(pathColors).filter(Boolean)}
          />
        </div>
        <div>
          <GroutThicknessColor
            groutThickness={groutThickness}
            setGroutThickness={setGroutThickness}
            groutColor={groutColor}
            setGroutColor={setGroutColor}
          />
        </div>
      </div>
    </div>
  );
}
