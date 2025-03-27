"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { TilesData } from "@/data/TilesData"

interface Tile {
  id: string
  name: string
  collection: string
  svg: string[] // Multiple SVG strings per tile
  preview?: string
}

interface TileSelectionProps {
  onTileSelect: (tile: Tile) => void
  selectedTile: Tile | null
  onRotate: (tileId: string, index: number, newRotation: number) => void
  tileRotations?: Record<string, number[]>
  pathColors?: Record<string, string>
}

export function TileSelection({
  onTileSelect,
  selectedTile,
  tileRotations = {},
  pathColors,
}: TileSelectionProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>("Geometric")

  const filteredTiles = TilesData.filter((tile) => tile.collection === selectedCollection)

  const handleTileSelect = (tile: Tile) => {
    onTileSelect(tile)
  }

  // Helper function to apply colors to SVG string
  const applyColorsToSvg = (svgString: string, colors: Record<string, string>) => {
    if (!colors || Object.keys(colors).length === 0) return svgString

    let modifiedSvg = svgString

    // Create a temporary DOM element to parse the SVG
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgString, "image/svg+xml")

    // Find all paths in the SVG
    const paths = doc.querySelectorAll("path")
    let modified = false

    paths.forEach((path) => {
      // Get the path ID or create one based on attributes
      const pathId = path.id || path.getAttribute("d")?.substring(0, 20)

      // Check if we have a color for this path
      Object.keys(colors).forEach((colorPathId) => {
        // Check if the colorPathId contains or matches part of our path's id or d attribute
        if (pathId !== undefined && (colorPathId.includes(pathId) || colorPathId.includes(pathId))) {
          path.setAttribute("fill", colors[colorPathId])
          modified = true
        }
      })
    })

    // If we modified any paths, serialize the SVG back to a string
    if (modified) {
      const serializer = new XMLSerializer()
      modifiedSvg = serializer.serializeToString(doc)
    }

    return modifiedSvg
  }

  useEffect(() => {
    console.log("Tile rotations updated:", tileRotations)
  }, [tileRotations])

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCollection("Geometric")}
            className={cn(
              "px-3 py-1 text-sm rounded-full transition-colors",
              selectedCollection === "Geometric"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80",
            )}
          >
            Geometric
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredTiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => handleTileSelect(tile)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all p-4 bg-white",
                selectedTile?.id === tile.id
                  ? "border-primary shadow-lg scale-[0.98]"
                  : "border-border hover:border-primary/50",
              )}
            >
              <div
                className="grid gap-[2px]"
                style={{
                  gridTemplateColumns: `repeat(${tile.svg.length === 4 ? 2 : 1}, 1fr)`,
                }}
              >
                {tile.svg.map((svgString, index) => {
                  // Use the correct initial rotation pattern if not in tileRotations
                  const defaultRotation = (() => {
                    switch (index) {
                      case 0:
                        return 0 // First SVG: 0°
                      case 1:
                        return 90 // Second SVG: 90°
                      case 2:
                        return 270 // Third SVG: 270°
                      case 3:
                        return 180 // Fourth SVG: 180°
                      default:
                        return 0
                    }
                  })()

                  const rotation = tileRotations[tile.id] ? tileRotations[tile.id][index] : defaultRotation

                  return (
                    <div
                      key={`${tile.id}-${index}`}
                      className="flex items-center justify-center border border-gray-300 rounded-lg shadow-md bg-white relative"
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: applyColorsToSvg(svgString, pathColors || {}),
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          transform: `rotate(${rotation}deg)`,
                          transition: "transform 0.3s ease-in-out",
                        }}
                        className="svg-container"
                      />
                    </div>
                  )
                })}
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2">
                <p className="text-sm font-medium text-center truncate">{tile.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

