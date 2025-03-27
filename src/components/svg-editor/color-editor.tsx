"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X } from "lucide-react"
import { SvgRenderer } from "./svg-renderer"
import type { SvgData, ColorData } from "./types"

interface ColorEditorProps {
  svgArray: SvgData[] // Expect an array of SvgData
  showBorders: boolean
  setShowBorders: (show: boolean) => void
  onColorSelect?: (pathId: string, color: ColorData) => void
  onRotate: (tileId: string, index: number, newRotation: number) => void
  tileId: string
  rotations?: number[] // Accept rotations from parent
}

export function ColorEditor({
  svgArray,
  showBorders,
  setShowBorders,
  onColorSelect,
  onRotate,
  tileId,
  rotations,
}: ColorEditorProps) {
  const [selectedColors, setSelectedColors] = useState<ColorData[]>([])
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null)
  const [pathColors, setPathColors] = useState<Record<string, string>>({})

  const handlePathSelect = useCallback(
    (pathId: string) => {
      setSelectedPathId(pathId)

      // Assign color from path fill or default to red if not available
      setPathColors((prev) => ({
        ...prev,
        [pathId]:
          prev[pathId] ||
          svgArray.find((svg) => svg.paths.find((p) => p.id === pathId))?.paths.find((p) => p.id === pathId)?.fill ||
          "red",
      }))
    },
    [svgArray],
  )

  const handleSave = () => {
    console.log("Saved Path Colors:", pathColors)
    console.log("SVG Data:", svgArray)
  }

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

      // Create a new color object for each related path
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

        if (!selectedColors.some((c) => c.color === color)) {
          setSelectedColors((prev) => [...prev, newColor])
        }

        if (onColorSelect) {
          onColorSelect(pathId, newColor)
        }
      })
    },
    [selectedPathId, onColorSelect, selectedColors, svgArray],
  )

  const handleRemoveColor = useCallback(
    (colorToRemove: string) => {
      const updatedPathColors = { ...pathColors }
      Object.keys(updatedPathColors).forEach((pathId) => {
        if (updatedPathColors[pathId] === colorToRemove) {
          delete updatedPathColors[pathId]
        }
      })

      setPathColors(updatedPathColors)
      setSelectedColors((prev) => prev.filter((c) => c.color !== colorToRemove))
    },
    [pathColors],
  )

  const handleRotationChange = (index: number, newRotation: number) => {
    console.log(`[COLOR EDITOR] Rotating SVG ${index} to ${newRotation}°`)

    // Pass the rotation to the parent via the onRotate function
    onRotate(tileId, index, newRotation)
  }

  const selectedPathColor = selectedPathId ? pathColors[selectedPathId] : null

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* SVG Preview (Click to select a path) */}
        <div className="border border-gray-200 rounded-md overflow-hidden flex justify-center items-center p-4">
          <SvgRenderer
            svgArray={svgArray}
            selectedPathId={selectedPathId}
            pathColors={pathColors}
            onPathSelect={handlePathSelect}
            onRotate={handleRotationChange}
            rotations={rotations}
          />
        </div>

        {/* Colors List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">ALL SVG COLORS:</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(
              new Set([...Object.values(pathColors), ...svgArray.flatMap((svg) => svg.paths.map((p) => p.fill))])
            ).map((color, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded border border-gray-200 cursor-pointer transition-transform 
                    hover:scale-110 ${selectedPathColor === color ? "ring-2 ring-black" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  if (selectedPathId && color !== undefined) {
                    handleColorSelect(color)
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Border Controls */}
        <div className="space-y-2">
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
        </div>

        {/* Selected Colors */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">COLORS USED:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(pathColors).map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded border border-gray-200 cursor-pointer relative group"
                style={{ backgroundColor: color }}
                onClick={() => handleRemoveColor(color)}
                title="Click to remove"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20">
                  <X className="h-4 w-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Select Color:</h3>
          <div className="grid grid-cols-8 gap-1">
            {colorPalette.map((color, index) => (
              <button
                key={index}
                className={`w-6 h-6 rounded-sm border transition-transform hover:scale-110 ${selectedPathColor === color ? "border-black ring-2 ring-black/20" : "border-gray-200"}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                disabled={!selectedPathId}
              />
            ))}
          </div>
        </div>

        <Button className="w-full" onClick={handleSave}>
          Save
        </Button>
      </div>
    </ScrollArea>
  )
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
]

