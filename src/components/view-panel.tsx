"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { SvgData } from "@/components/svg-editor/types"
import Link from "next/link"
import Image from "next/image"

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
  const [environment, setEnvironment] = useState<"bedroom" | "bathroom" | "kitchen" | "commercial" | "kitchen2" | "bathroom2">("bedroom")
  const [groutColor, setGroutColor] = useState<"white" | "gray" | "black">("white")
  const [groutThickness, setGroutThickness] = useState<"none" | "thin" | "thick">("thin")
  const tileGridRef = useRef<HTMLDivElement>(null)
  const [showTilePreview, setShowTilePreview] = useState(true)

  console.log(setGroutColor, setGroutThickness)

  // Calculate grid dimensions based on selected size
  const gridDimensions = gridSize === "8x8" ? 8 : 12

  // Define the tile area for each environment
  // const tileAreas = {
  //   bedroom: { top: "60%", left: "10%", width: "40%", height: "40%" },
  //   bathroom: { top: "20%", left: "30%", width: "40%", height: "60%" },
  //   kitchen: { top: "70%", left: "20%", width: "60%", height: "30%" },
  //   commercial: { top: "70%", left: "30%", width: "40%", height: "30%" },
  // }

  // Update grid when SVG or settings change
  useEffect(() => {
    if (!currentSvg || !currentSvg.length || !tileGridRef.current) return

    console.log("[VIEW PANEL] Rotations:", rotations)

    // Clear existing grid
    const container = tileGridRef.current
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
    <div className="p-4 space-y-6 h-full">
      <Tabs defaultValue="room-view" className="w-full">

        <TabsContent value="room-view" >


          <div className="flex gap-5">
            <div className="relative w-full h-[500px] aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
              {/* Tile Preview Area - Placed FIRST so it appears behind the image */}
              {showTilePreview && (
                <div
                  className={`absolute ${groutColor}-grout z-0`}
                  style={{
                    top: "0",
                    left: "0",
                    width: "800%",
                    height: "400px",
                    display: "grid",
                    gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
                    gap: groutThickness === "none" ? "0px" : groutThickness === "thin" ? "1px" : "2px",
                  }}
                >
                  <div
                    ref={tileGridRef}
                    className={`grid gap-[${groutThickness === "none" ? "0" : groutThickness === "thin" ? "1px" : "2px"}]   bg-${groutColor}`}
                    style={{
                      gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              )}

              {/* Environment Images - Placed AFTER tiles so they appear on top */}
              {environment === "bedroom" && (
                <Image
                  src="/assets/environment1.svg"
                  alt="Bedroom"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "bathroom" && (
                <Image
                  src="/assets/environment2.svg"
                  alt="Bathroom"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "kitchen" && (
                <Image
                  src="/assets/environment3.svg"
                  alt="Kitchen"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "commercial" && (
                <Image
                  src="/assets/environment4.svg"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "kitchen2" && (
                <Image
                  src="/assets/environment5.svg"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "bathroom2" && (
                <Image
                  src="/assets/environment6.svg"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}

              {/* Toggle Button */}
              <Button
                className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-black text-xs py-1 px-2 h-auto"
                onClick={() => setShowTilePreview(!showTilePreview)}
              >
                {showTilePreview ? "Hide Tiles" : "Show Tiles"}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={environment === "bedroom" ? "default" : "outline"}
                  onClick={() => setEnvironment("bedroom")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image
                    src="/assets/env_bedroom_hover_icon-1.png"
                    alt="Bedroom Hover Icon"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={environment === "bathroom" ? "default" : "outline"}
                  onClick={() => setEnvironment("bathroom")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image
                    src="/assets/Frame-1597881812.png"
                    alt="bathroom"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={environment === "kitchen" ? "default" : "outline"}
                  onClick={() => setEnvironment("kitchen")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image
                    src="/assets/Frame-1597881813.png"
                    alt="ketchen"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={environment === "commercial" ? "default" : "outline"}
                  onClick={() => setEnvironment("commercial")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image
                    src="/assets/Frame-1597881814.png"
                    alt="Commercial"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={environment === "kitchen2" ? "default" : "outline"}
                  onClick={() => setEnvironment("kitchen2")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image
                    src="/assets/Frame-1597881815.png"
                    alt="Commercial"
                    width={100}
                    height={100}
                  />
                </Button>
                <Button
                  variant={environment === "bathroom2" ? "default" : "outline"}
                  onClick={() => setEnvironment("bathroom2")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image
                    src="/assets/Frame-1597881815.png"
                    alt="Commercial"
                    width={100}
                    height={100}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Grout Controls */}
          {/* <div className="space-y-4">
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
          </div> */}
        </TabsContent>

        <TabsContent value="grid-view" className="space-y-4">
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
          <div
            className={`grid gap-[${groutThickness === "none" ? "0" : groutThickness === "thin" ? "1px" : "2px"}] bg-${groutColor} aspect-square`}
            style={{
              gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
            }}
          >
            <div
              ref={tileGridRef}
              className={`grid gap-[${groutThickness === "none" ? "0" : groutThickness === "thin" ? "1px" : "2px"}] bg-${groutColor}`}
              style={{
                gridTemplateColumns: `repeat(${gridDimensions}, 1fr)`,
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          {/* Grout Controls */}
          {/* <div className="space-y-4">
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
          </div> */}
        </TabsContent>
      </Tabs>

      <div className="py-10 flex items-center justify-center">
        <Link href="/preview-your-custom-tile"><Button className="w-[288px] h-[51px]">Save & Share</Button></Link>
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
        .thin { gap: 1px; }
        .thick { gap: 2px; }
        .white-grout { background-color: white; }
        .gray-grout { background-color: #666; }
        .black-grout { background-color: black; }
      `}</style>
    </div>
  )
}

