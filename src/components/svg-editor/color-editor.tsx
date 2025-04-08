"use client";

import { useState, useCallback, useEffect } from "react";
import { SvgRenderer } from "./svg-renderer";
import type { SvgData, ColorData } from "./types";
import { ColorPicker } from "./color-picker";
import GroutThicknessColor from "./grout-thickness-color";

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
  const [svgColors, setSvgColors] = useState<string[]>([])

   // Extract all unique colors from the SVG on component mount
   useEffect(() => {
    // Get all current colors from SVG paths (including modified ones)
    const allCurrentColors = svgArray
      .flatMap((svg) =>
        svg.paths.map((path) => {
          // Use the modified color if it exists, otherwise use the original
          return pathColors[path.id] || path.originalFill || path.fill
        }),
      )
      .filter(Boolean) as string[]

    // Remove duplicates
    const uniqueColors = [...new Set(allCurrentColors)]
    setSvgColors(uniqueColors)
  }, [svgArray, pathColors])

  // Update the display of colors when pathColors changes
  useEffect(() => {
    if (svgColors.length > 0 && Object.keys(pathColors).length > 0) {
      // Don't add new colors, just update the display of existing ones
      // This ensures we only show the original SVG colors (or their replacements)
      setSvgColors((prevColors) => {
        // Keep the same colors array, just force a re-render
        return [...prevColors]
      })
    }
  }, [pathColors, svgColors.length])

  const handlePathSelect = useCallback(
    (pathId: string) => {
      setSelectedPathId(pathId)

      // Highlight the selected path
      const path = svgArray.flatMap((svg) => svg.paths).find((p) => p.id === pathId)
      if (path) {
        // Add a subtle animation or effect when selecting a path
        const svgElement = document.getElementById(pathId)
        if (svgElement) {
          svgElement.classList.add("path-selected")
          setTimeout(() => {
            svgElement.classList.remove("path-selected")
          }, 300)
        }

        console.log(`Selected path: ${pathId} with color: ${pathColors[pathId] || path.fill}`)
      }
    },
    [svgArray, pathColors],
  )

  // const handleSave = () => {
  //   console.log("Saved Path Colors:", pathColors)
  //   console.log("SVG Data:", svgArray)
  // }

  const handleColorSelect = useCallback(
    (color: string) => {
      if (!selectedPathId) return

      // Extract the base identifier from the path ID
      const pathIdParts = selectedPathId.split("-")
      const baseIdentifier = pathIdParts[pathIdParts.length - 1]

      // Find all paths with matching identifiers across all SVGs
      const relatedPaths = svgArray.flatMap((svg) =>
        svg.paths
          .filter((path) => {
            const parts = path.id.split("-")
            const pathIdentifier = parts[parts.length - 1]
            return pathIdentifier === baseIdentifier
          })
          .map((path) => path.id),
      )

      // Update color for each related path
      relatedPaths.forEach((pathId) => {
        const newColor: ColorData = {
          id: `${pathId}-${color}`,
          color,
          name: `Color ${color}`,
        }

        setPathColors((prev) => ({
          ...prev,
          [pathId]: color,
        }))

        if (onColorSelect) {
          onColorSelect(pathId, newColor)
        }
      })
    },
    [selectedPathId, onColorSelect, svgArray],
  )

  // const handleRemoveColor = useCallback(
  //   (colorToRemove: string) => {
  //     const updatedPathColors = { ...pathColors }
  //     Object.keys(updatedPathColors).forEach((pathId) => {
  //       if (updatedPathColors[pathId] === colorToRemove) {
  //         delete updatedPathColors[pathId]
  //       }
  //     })

  //     setPathColors(updatedPathColors)
  //     setSelectedColors((prev) => prev.filter((c) => c.color !== colorToRemove))
  //   },
  //   [pathColors],
  // )

  const handleRotationChange = (index: number, newRotation: number) => {
    console.log(`[COLOR EDITOR] Rotating SVG ${index} to ${newRotation}°`);

    // Pass the rotation to the parent via the onRotate function
    onRotate(tileId, index, newRotation);
  };

  const selectedPathColor = selectedPathId
    ? pathColors[selectedPathId] || svgArray.flatMap((svg) => svg.paths).find((p) => p.id === selectedPathId)?.fill
    : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
      {/* SVG Preview (Click to select a path) */}
      <div className="col-span-2 lg:col-span-2 md:h-[650px]">
        <div className="flex justify-center items-center">
          {svgArray.length === 0 ? (
            <div className="flex items-center justify-center bg-black/20 w-full md:h-[700px] lg:h-[450px]">
              <p className="text-sm font-medium text-gray-500">
                No SVG data available.
              </p>
            </div>
          ) : (
            <SvgRenderer
              svgArray={svgArray}
              selectedPathId={selectedPathId}
              pathColors={pathColors}
              onPathSelect={handlePathSelect}
              onRotate={handleRotationChange}
              rotations={rotations}
            />
          )}
        </div>
      </div>

      <div className="col-span-2 lg:col-span-3 mt-20  lg:mt-0">
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
                    (!pathColors[p.id] && (p.originalFill || p.fill) === color), // Then check original colors
                ),
              )

              const isUsedByPath = pathsWithColor.length > 0
              const isSelectedColor =
                selectedPathId &&
                (pathColors[selectedPathId] === color ||
                  (!pathColors[selectedPathId] &&
                    svgArray.flatMap((svg) => svg.paths).find((p) => p.id === selectedPathId)?.originalFill === color))

              return (
                <div
                  key={index}
                  className={`w-8 h-8 rounded border cursor-pointer transition-transform relative
                    hover:scale-110 ${isSelectedColor ? "ring-2 ring-black" : ""} 
                    ${isUsedByPath ? "border-primary" : "border-gray-200"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    // Find paths with this color and select the first one
                    if (pathsWithColor.length > 0) {
                      handlePathSelect(pathsWithColor[0].id)
                      // No color change here, just path selection
                    }
                  }}
                >
                  {/* Add indicator dot for selected color */}
                  {isSelectedColor && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-white"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Border Controls */}
        {/* <div className="space-y-2">
          <Button
            variant={showBorders ? "default" : "outline"}
            className="w-full"
            onClick={() => setShowBorders(!showBorders)}
          >
            {showBorders ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Remove Borders
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Borders
              </>
            )}
          </Button>
        </div> */}

        {/* Color Palette */}
        <div className="space-y-4 mt-[32px]">
          <div className="grid grid-cols-12 gap-1">
            {colorPalette.map((color, index) => (
              <button
                key={index}
                className={`w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8 rounded-sm border transition-transform hover:scale-110 ${selectedPathColor === color
                    ? "border-black ring-2 ring-black/20"
                    : "border-gray-200"
                  }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                disabled={!selectedPathId}
              />
            ))}
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

const colorPalette = [
  "#f5f5f0",
  "#e6e6d8",
  "#d8d8c0",
  "#ccccb3",
  "#bfbfa8",
  "#b3b39e",
  "#a6a693",
  "#999989",
  "#8c8c7f",
  "#000000",
  "#595959",
  "#404040",
  "#262626",
  "#666666",
  "#808080",
  "#999999",
  "#d9e6f2",
  "#c6d9e6",
  "#b3ccd9",
  "#a0bfcc",
  "#8cb3bf",
  "#79a6b3",
  "#6699a6",
  "#538099",
  "#d9e6d9",
  "#c6d9c6",
  "#b3ccb3",
  "#a0bfa0",
  "#8cb38c",
  "#79a679",
  "#669966",
  "#538053",
  "#f2d9d9",
  "#e6c6c6",
  "#d9b3b3",
  "#cca0a0",
  "#bf8c8c",
  "#b37979",
  "#a66666",
  "#995353",
  "#f2e6d9",
  "#e6d9c6",
  "#d9ccb3",
  "#ccbfa0",
  "#bfb38c",
  "#b3a679",
  "#a69966",
  "#998c53",
  "#ff5733",
  "#33ff57",
  "#3357ff",
  "#ff33a1",
  "#a133ff",
  "#33ffa1",
  "#ffeb33",
  "#ff3362",
];
