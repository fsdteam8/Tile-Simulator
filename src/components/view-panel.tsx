"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { SvgData } from "@/components/svg-editor/types"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Props {
  currentSvg: SvgData[] | null
  pathColors?: Record<string, string>
  showBorders?: boolean
  rotations?: number[]
  groutThickness: string
  setGroutThickness: (groutThickness: string) => void
  setGroutColor: (groutColor: string) => void
  groutColor: string
}

export default function ViewPanel({
  currentSvg,
  pathColors = {},
  showBorders = false,
  rotations = [0, 0, 0, 0],
  groutThickness,
  setGroutThickness,
  setGroutColor,
  groutColor,
}: Props) {
  const [gridSize, setGridSize] = useState<"8x8" | "12x12">("8x8")
  const [environment, setEnvironment] = useState<
    "environment1" | "environment2" | "environment3" | "environment4" | "environment5" | "environment6"
  >()
  // const [groutColor, setGroutColor] = useState<"white" | "gray" | "black">("white")
  // const [groutThickness, setGroutThickness] = useState<"none" | "thin" | "thick">("thin")
  const tileGridRef = useRef<HTMLDivElement>(null)
  const [showTilePreview, setShowTilePreview] = useState(true)
  console.log(setShowTilePreview)
  console.log(setGridSize)

  const router = useRouter()

  const handleTileEnvironmentClose = () => {
    setEnvironment(undefined)
  }

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
    }

    // Save to localStorage (as URL params would be too large)
    localStorage.setItem("tilePreviewData", JSON.stringify(tileData))

    // Navigate to the preview page
    router.push("/preview-your-custom-tile")
  }

  console.log(handleSaveAndShare);

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
        <TabsContent value="room-view">
          <div className="flex gap-5">
            <div className="relative w-full h-[540px] aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
              {/* Tile Preview Area - Placed FIRST so it appears behind the image */}

              {currentSvg?.length === 0 ? (
                <div className="flex items-center justify-center bg-black/20 w-full h-full">
                  <h1 className="text-2xl">VIEW</h1>
                </div>
              ) : (
                <div>
                  {showTilePreview && (
                    <div
                      className={`absolute ${groutColor}-grout z-0`}
                      style={{
                        top: "0",
                        left: "0",
                        width: "800%",
                        height: "540px",
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
                </div>
              )}

              {/* Environment Images - Placed AFTER tiles so they appear on top */}
              {environment === "environment1" && (
                <Image
                  src="/assets/environment1.svg"
                  alt="Bedroom"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "environment2" && (
                <Image
                  src="/assets/environment2.svg"
                  alt="Bathroom"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "environment3" && (
                <Image
                  src="/assets/environment3.svg"
                  alt="Bathroom"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "environment4" && (
                <Image
                  src="/assets/environment4.svg"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "environment5" && (
                <Image
                  src="/assets/environment5.svg"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
                />
              )}
              {environment === "environment6" && (
                <Image
                  src="/assets/environment6.svg"
                  alt="Commercial"
                  fill
                  className="object-cover z-10"
                  style={{ pointerEvents: "none" }}
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={environment === "environment1" ? "default" : "outline"}
                  onClick={() => setEnvironment("environment1")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image src="/assets/env_kitchen_icon.png" alt="Bedroom Hover Icon" width={100} height={100} />
                </Button>
                <Button
                  variant={environment === "environment2" ? "default" : "outline"}
                  onClick={() => setEnvironment("environment2")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image src="/assets/env_bathroom_icon.png" alt="bathroom" width={100} height={100} />
                </Button>
                <Button
                  variant={environment === "environment3" ? "default" : "outline"}
                  onClick={() => setEnvironment("environment3")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image src="/assets/env_bathroom_icon.png" alt="ketchen" width={100} height={100} />
                </Button>
                <Button
                  variant={environment === "environment4" ? "default" : "outline"}
                  onClick={() => setEnvironment("environment4")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image src="/assets/env_living_room_icon.png" alt="Commercial" width={100} height={100} />
                </Button>
                <Button
                  variant={environment === "environment5" ? "default" : "outline"}
                  onClick={() => setEnvironment("environment5")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image src="/assets/env_commercial_room_icon.png" alt="Commercial" width={100} height={100} />
                </Button>
                <Button
                  variant={environment === "environment6" ? "default" : "outline"}
                  onClick={() => setEnvironment("environment6")}
                  className="h-[83px] w-[144px] py-1"
                >
                  <Image src="/assets/env_commercial_room_icon.png" alt="Commercial" width={100} height={100} />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grid-view" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      <div className="py-10 flex items-center justify-center">
        <Button className="w-[288px] h-[51px]" onClick={handleSaveAndShare}>
          Save & Share
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
        .none { gap: 0; }
        .thin { gap: 1px; }
        .thick { gap: 2px; }
        .orange-grout { background-color: orange; }
        .green-grout { background-color: green; }
        .turquoise-grout { background-color: turquoise; }
        .blue-grout { background-color: blue; }
      `}</style>
    </div>
  )
}

