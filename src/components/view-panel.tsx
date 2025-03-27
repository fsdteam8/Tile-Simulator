"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { SvgData } from "@/components/svg-editor/types"

interface Props {
  currentSvg: SvgData[] | null
  pathColors?: Record<string, string>
  showBorders?: boolean
  rotations?: number[]
}

export default function ViewPanel({
  currentSvg,
  pathColors = {},
  showBorders = false,
  rotations = [0, 0, 0, 0],
}: Props) {
  const [gridSize, setGridSize] = useState<"8x8" | "12x12">("8x8")
  const [environment, setEnvironment] = useState<"residential" | "commercial">("residential")
  const [groutColor, setGroutColor] = useState<"white" | "gray" | "black">("white")
  const [groutThickness, setGroutThickness] = useState<"none" | "thin" | "thick">("thin")

  // Calculate grid dimensions based on selected size
  const gridDimensions = gridSize === "8x8" ? 8 : 12

  // Add a function to create a rotation indicator for each SVG in the view panel
  useEffect(() => {
    if (!currentSvg || !currentSvg.length) return

    console.log("[VIEW PANEL] Rotations:", rotations)

    // Update grid when SVG or settings change
    const container = document.getElementById("tile-grid")
    if (!container) return

    // Clear existing grid
    container.innerHTML = ""

    // Determine if we should use a 2x2 pattern (for 4 SVGs)
    const useQuadPattern = currentSvg.length === 4

    // Create grid cells
    for (let i = 0; i < gridDimensions; i++) {
      for (let j = 0; j < gridDimensions; j++) {
        const cell = document.createElement("div")
        cell.className = `tile-cell ${groutThickness} ${groutColor}-grout`

        if (useQuadPattern) {
          // Create a 2x2 grid inside each cell for 4 SVGs
          const innerGrid = document.createElement("div")
          innerGrid.className = "grid grid-cols-2 w-full h-full gap-[1px]"

          // Add 4 SVGs in a 2x2 pattern
          for (let k = 0; k < 4; k++) {
            const svgIndex = k
            const svg = currentSvg[svgIndex]
            const rotation = rotations[svgIndex]

            const innerCell = document.createElement("div")
            innerCell.className = "relative w-full h-full"

            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            svgElement.setAttribute("viewBox", svg.viewBox || "0 0 100 100")
            svgElement.style.transform = `rotate(${rotation}deg)`
            svgElement.setAttribute("data-rotation", rotation.toString())

            // Add paths
            svg.paths.forEach((path) => {
              const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
              pathElement.setAttribute("d", path.d)
              pathElement.setAttribute("fill", pathColors[path.id] || path.fill || "#000000")
              if (showBorders) {
                pathElement.setAttribute("stroke", "#000000")
                pathElement.setAttribute("stroke-width", "1")
              }
              svgElement.appendChild(pathElement)
            })

            innerCell.appendChild(svgElement)
            innerGrid.appendChild(innerCell)
          }

          cell.appendChild(innerGrid)
        } else {
          // Original single SVG per cell logic
          const svgIndex = (i * gridDimensions + j) % currentSvg.length
          const svg = currentSvg[svgIndex]
          const rotation = rotations[svgIndex]

          // Create a wrapper div for the SVG
          const wrapper = document.createElement("div")
          wrapper.className = "relative w-full h-full"

          const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
          svgElement.setAttribute("viewBox", svg.viewBox || "0 0 100 100")
          svgElement.style.transform = `rotate(${rotation}deg)`
          svgElement.setAttribute("data-rotation", rotation.toString())

          // Add paths
          svg.paths.forEach((path) => {
            const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
            pathElement.setAttribute("d", path.d)
            pathElement.setAttribute("fill", pathColors[path.id] || path.fill || "#000000")
            if (showBorders) {
              pathElement.setAttribute("stroke", "#000000")
              pathElement.setAttribute("stroke-width", "1")
            }
            svgElement.appendChild(pathElement)
          })

          wrapper.appendChild(svgElement)
          cell.appendChild(wrapper)
        }

        container.appendChild(cell)
      }
    }
  }, [currentSvg, pathColors, showBorders, rotations, gridSize, groutColor, groutThickness, gridDimensions])

  return (
    <div className="p-4 space-y-6">
      {/* Grid Size Controls */}
      <div className="flex gap-2">
        <Button variant={gridSize === "8x8" ? "default" : "outline"} onClick={() => setGridSize("8x8")}>
          8x8
        </Button>
        <Button variant={gridSize === "12x12" ? "default" : "outline"} onClick={() => setGridSize("12x12")}>
          12x12
        </Button>
      </div>

      {/* Tile Grid */}
      <div className="w-full h-[500px]">
        <div
          id="tile-grid"
          className={`grid gap-[2px] bg-${groutColor}`}
          style={{
            gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
          }}
        />
      </div>

      {/* Environment Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">CHOOSE ENVIRONMENT:</h3>
        <div className="flex gap-4">
          <Button
            variant={environment === "residential" ? "default" : "outline"}
            onClick={() => setEnvironment("residential")}
          >
            Residential
          </Button>
          <Button
            variant={environment === "commercial" ? "default" : "outline"}
            onClick={() => setEnvironment("commercial")}
          >
            Commercial
          </Button>
        </div>
      </div>

      {/* Grout Controls */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">GROUT COLOR:</h3>
        <div className="flex gap-2">
          {["white", "gray", "black"].map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${groutColor === color ? "border-primary" : "border-transparent"
                }`}
              style={{ backgroundColor: color }}
              onClick={() => setGroutColor(color as "white" | "gray" | "black")}
            />
          ))}
        </div>

        <h3 className="text-sm font-medium">GROUT THICKNESS:</h3>
        <div className="flex gap-2">
          {["none", "thin", "thick"].map((thickness) => (
            <Button
              key={thickness}
              variant={groutThickness === thickness ? "default" : "outline"}
              onClick={() => setGroutThickness(thickness as "none" | "thin" | "thick")}
            >
              {thickness.charAt(0).toUpperCase() + thickness.slice(1)}
            </Button>
          ))}
        </div>
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
        .none { gap: 0; }
        .thin { gap: 2px; }
        .thick { gap: 4px; }
        .white-grout { background-color: white; }
        .gray-grout { background-color: #666; }
        .black-grout { background-color: black; }
      `}</style>
    </div>
  )
}

