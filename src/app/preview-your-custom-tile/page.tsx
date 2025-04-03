"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Clock4, Download, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import type { PathData, SvgData } from "@/components/svg-editor/types"


interface TileData {
  svgData: SvgData[];
  rotations: number[]; // Rotations for each SVG in the grid
  groutThickness: string; // Class for grout thickness, e.g., 'grout-thick'
  groutColor: string; // Class for grout color, e.g., 'gray'
  pathColors: Record<string, string>; // Path color mapping by path ID
  showBorders: boolean; // Whether to show borders on paths
}

export default function PreviewYourCustomTile() {
  const [tileData, setTileData] = useState<{
    svgData: SvgData[] | null
    pathColors: Record<string, string>
    showBorders: boolean
    rotations: number[]
    groutColor: string
    groutThickness: string
    gridSize: string
    environment: string
  } | null>(null)

  const [email, setEmail] = useState("")
  const tileGridRef = useRef<HTMLDivElement>(null)
  const patternGridRef = useRef<HTMLDivElement>(null)
  const environmentPreviewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem("tilePreviewData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setTileData(parsedData)

        // Render the grids after data is loaded
        setTimeout(() => {
          if (parsedData.svgData) {
            renderTileGrid(tileGridRef.current, 1, 1, parsedData)
            renderTileGrid(patternGridRef.current, 8, 8, parsedData)

            if (parsedData.environment !== "none") {
              renderTileGrid(environmentPreviewRef.current, 16, 16, parsedData)
            }
          }
        }, 100)
      } catch (error) {
        console.error("Error parsing saved tile data:", error)
      }
    }
  }, [])

  const renderTileGrid = (container: HTMLDivElement | null, rows: number, cols: number, data: TileData) => {
    console.log(data)
    if (!container || !data.svgData || !data.svgData.length) return



    // Clear existing content
    container.innerHTML = ""

    const useQuadPattern = data.svgData.length === 4

    // Create grid cells
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement("div")
        cell.className = `tile-cell ${data.groutThickness} ${data.groutColor}-grout`

        if (useQuadPattern) {
          // Create a 2x2 grid inside each cell for 4 SVGs
          const innerGrid = document.createElement("div")
          innerGrid.className = "grid grid-cols-2 w-full h-full gap-[1px]"

          // Add 4 SVGs in a 2x2 pattern
          for (let k = 0; k < 4; k++) {
            const svgIndex = k
            const svg = data.svgData[svgIndex]
            const rotation = data.rotations[svgIndex] || 0

            const innerCell = document.createElement("div")
            innerCell.className = "relative w-full h-full"

            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            svgElement.setAttribute("viewBox", svg.viewBox || "0 0 100 100")
            svgElement.style.transform = `rotate(${rotation}deg)`

            // Add paths
            svg.paths.forEach((path: PathData) => {
              const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
              pathElement.setAttribute("d", path.d)
              pathElement.setAttribute("fill", data.pathColors[path.id] || path.fill || "#000000")
              if (data.showBorders) {
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
          const svgIndex = (i * cols + j) % data.svgData.length
          const svg = data.svgData[svgIndex]
          const rotation = data.rotations[svgIndex] || 0

          // Create a wrapper div for the SVG
          const wrapper = document.createElement("div")
          wrapper.className = "relative w-full h-full"

          const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
          svgElement.setAttribute("viewBox", svg.viewBox || "0 0 100 100")
          svgElement.style.transform = `rotate(${rotation}deg)`

          // Add paths
          svg.paths.forEach((path: PathData) => {
            const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
            pathElement.setAttribute("d", path.d)
            pathElement.setAttribute("fill", data.pathColors[path.id] || path.fill || "#000000")
            if (data.showBorders) {
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
  }

  // Generate SVG string for download
  const generateSvgString = () => {
    if (!tileData || !tileData.svgData || !tileData.svgData.length) return ""

    const svg = tileData.svgData[0]
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${svg.viewBox || "0 0 100 100"}">`

    svg.paths.forEach((path) => {
      const fill = tileData.pathColors[path.id] || path.fill || "#000000"
      svgString += `<path d="${path.d}" fill="${fill}" ${tileData.showBorders ? 'stroke="#000000" strokeWidth="1"' : ""}/>`
    })

    svgString += "</svg>"
    return svgString
  }

  const handleDownloadSVG = () => {
    const svgString = generateSvgString()
    if (!svgString) return

    const blob = new Blob([svgString], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "custom-tile.svg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }


  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator
        .share({
          title: "My Custom Tile Design",
          text: "Check out my custom cement tile design!",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err))
    }
  }

  const handleSaveEmail = () => {
    alert(`Design saved to email: ${email}`)
    setEmail("")
  }

  const handleCreateSample = () => {
    alert("Sample creation process would start here")
  }

  // Extract color information for display
  const getUniqueColors = () => {
    if (!tileData || !tileData.svgData) return []

    console.log(tileData.environment)

    const colors = new Set<string>()

    if (tileData.pathColors) {
      Object.values(tileData.pathColors).forEach((color) => {
        if (typeof color === "string") colors.add(color)
      })
    }

    if (tileData.svgData) {
      tileData.svgData.forEach((svg) => {
        svg.paths.forEach((path) => {
          if (path.fill) colors.add(path.fill)
        })
      })
    }

    return Array.from(colors)
  }

  const uniqueColors = getUniqueColors()

  if (!tileData) {
    return <div className="p-8 text-center">Loading preview data...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <button className="bg-white text-base font-medium leading-[120%] text-primary border border-primary px-8 py-2 rounded">
          <Link href="/">
            GO BACK
          </Link>
        </button>
        <h1 className="text-[32px] font-normal text-center text-[#595959]">Preview Your Custom Tile</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadSVG}>
            <Download className="mr-2 h-4 w-4" />
            Download SVG
          </Button>
        </div>
      </div>

      <div className="shadow-[0px_0px_8px_0px_rgba(0,0,0,0.16)] rounded-[8px] p-2">
        <div className="flex items-center justify-between shadow-[0px_0px_8px_0px_rgba(0,0,0,0.16)] rounded-[8px] p-4 mb-6" >
          <div>
            <h2 className="text-lg font-medium mb-2">Pattern: rabbits</h2>
            <div className="">
              <h3 className="text-md font-medium mb-2">Colors:</h3>
              {uniqueColors.length > 0 ? (
                <div defaultValue={uniqueColors[0]} className="flex gap-4 flex-wrap">
                  {uniqueColors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {/* <RadioGroupItem value={color} id={`color-${index}`} /> */}
                      <Label htmlFor={`color-${index}`} className="flex items-center">
                        <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                        {color.toUpperCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No colors available</p>
              )}
            </div>
          </div>
          <div>
            <Image src="/boxLogo.png" alt="Logo" width={48} height={48} />
          </div>
          {/* <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Grout:</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Color: {tileData.groutColor}</span>
            <span className="text-sm">Thickness: {tileData.groutThickness}</span>
          </div>
        </div> */}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg overflow-hidden w-[550px] h-[550px]">
            <div
              ref={tileGridRef}
              className={`grid aspect-square ${tileData.groutColor}-grout`}
              style={{
                gridTemplateColumns: `repeat(1, 1fr)`,
                gap: tileData.groutThickness === "none" ? "0px" : tileData.groutThickness === "thin" ? "1px" : "2px",
                width: "562px",

              }}
            />
          </div>
          <div className="border rounded-lg overflow-hidden w-[550px] h-[550px]">
            <div
              ref={patternGridRef}
              className={`grid aspect-square ${tileData.groutColor}-grout`}
              style={{
                gridTemplateColumns: `repeat(8, 1fr)`,
                gap: tileData.groutThickness === "none" ? "0px" : tileData.groutThickness === "thin" ? "1px" : "2px",
              }}
            />
          </div>
        </div>

        <div className="mt-8">

          <div className="w-full ">
            <div className="border rounded-lg overflow-hidden">
              {tileData.environment !== "none" ? (
                <div className="relative aspect-video">
                  <div
                    ref={environmentPreviewRef}
                    className={`absolute inset-0 ${tileData.groutColor}-grout z-0`}
                    style={{
                      gridTemplateColumns: `repeat(16, 1fr)`,
                      gap:
                        tileData.groutThickness === "none" ? "0px" : tileData.groutThickness === "thin" ? "1px" : "2px",
                      display: "grid",
                    }}
                  />
                  <Image
                    src={`/assets/${tileData.environment}.svg`}
                    alt="Environment Preview"
                    fill
                    className="object-cover z-10"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No environment selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[24px] font-medium mb-4">Thank you for choosing to create a one-of-a-kind (1) custom cement tile!</p>
      </div>

      <div className="mt-6">
        <h2 className="text-[24px] font-medium  text-center mb-4">Custom Design Process</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/a-creative-designs.png"
                alt="Color chips"
                width={50}
                height={50}
                className="h-12 w-12"
              />
            </div>
            <p className="text-xs">Color chips sent to you</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/a-creative-designs1.png"
                alt="Factory sample"
                width={50}
                height={50}
                className="h-12 w-12"
              />
            </div>
            <p className="text-xs">Factory sample photo $95</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/a-creative-designs2.png"
                alt="Physical sample"
                width={50}
                height={50}
                className="h-12 w-12"
              />
            </div>
            <p className="text-xs">Physical sample 4 pieces $400</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Image src="/a-creative-designs3.png" alt="Order" width={50} height={50} className="h-12 w-12" />
            </div>
            <p className="text-xs">Order starts at only 10 boxes</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-center gap-4">
            <Clock4 />
            <p className="text-xl font-normal">Next day</p>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Clock4 />
            <p className="text-xl font-normal">1 week</p>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Clock4 />
            <p className="text-xl font-normal">3 weeks</p>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Clock4 />
            <p className="text-xl font-normal">12-14 weeks</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="space-y-4">
          <h1>Send yourself a copy</h1>
          <div className="flex items-center border rounded-md overflow-hidden">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 outline-none"
            />
            <Button className="rounded-none" onClick={handleSaveEmail}>
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className="my-20 text-center">
        <Button className="px-8 w-[418px] h-[51px] text-[16px]" onClick={handleCreateSample}>
          Order a Sample
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
        .white-grout { background-color: white; }
      `}</style>
    </div>
  )
}

