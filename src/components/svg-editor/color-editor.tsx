"use client"

import { useCallback, useEffect, useState } from "react"
import { ColorPicker } from "./color-picker"
import type { ColorItem } from "./colortype"
import GroutThicknessColor from "./grout-thickness-color"
import { SvgRenderer } from "./svg-renderer"
import type { ColorData, SvgData } from "./types"

interface ColorEditorProps {
  svgArray: SvgData[]
  showBorders: boolean
  setShowBorders: (show: boolean) => void
  onColorSelect?: (pathId: string, color: ColorData) => void
  onRotate: (tileId: string, index: number, newRotation: number) => void
  tileId: string
  rotations?: number[]
  groutThickness: string
  setGroutThickness: (groutThickness: string) => void
  groutColor: string
  setGroutColor: (groutColor: string) => void
  svgLoading?: boolean
  svgProcessingComplete?: boolean
}

export default function ColorEditor({
  svgArray,
  onColorSelect,
  onRotate,
  tileId,
  rotations,
  groutThickness,
  setGroutThickness,
  groutColor,
  setGroutColor,
  svgLoading = false,
  svgProcessingComplete = false,
}: ColorEditorProps) {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null)
  const [pathColors, setPathColors] = useState<Record<string, string>>({})
  const [svgColors, setSvgColors] = useState<string[]>([])
  const [apiColors, setApiColors] = useState<ColorItem[]>([])
  const [loadingColors, setLoadingColors] = useState(true)
  const [showSvgAfterLoading, setShowSvgAfterLoading] = useState(false)
  const [svgRenderComplete, setSvgRenderComplete] = useState(false)

  console.log(loadingColors)
  console.log(svgRenderComplete)

  // Reset states when new tile is being loaded
  useEffect(() => {
    if (svgLoading) {
      setShowSvgAfterLoading(false)
      setSvgRenderComplete(false)
      setSelectedPathId(null)
    }
  }, [svgLoading])

  // Handle SVG render completion
  useEffect(() => {
    if (svgProcessingComplete && svgArray.length > 0) {
      // Add a small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        setSvgRenderComplete(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [svgProcessingComplete, svgArray.length])

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors?paginate_count=1000`)
        if (!response.ok) {
          throw new Error("Failed to fetch colors")
        }
        const data = await response.json()
        const publishedColors = data.data.data.filter((color: ColorItem) => color.status === "published")
        setApiColors(publishedColors)
      } catch (error) {
        console.error("Error fetching colors:", error)
      } finally {
        setLoadingColors(false)
      }
    }

    fetchColors()
  }, [])

  useEffect(() => {
    const allCurrentColors = svgArray
      .flatMap((svg) =>
        svg.paths.map((path) => {
          return pathColors[path.id] || path.originalFill || path.fill
        }),
      )
      .filter(Boolean) as string[]

    const uniqueColors = [...new Set(allCurrentColors)]
    setSvgColors(uniqueColors)
  }, [svgArray, pathColors])

  useEffect(() => {
    if (svgColors.length > 0 && Object.keys(pathColors).length > 0) {
      setSvgColors((prevColors) => {
        return [...prevColors]
      })
    }
  }, [pathColors, svgColors.length])

  const handlePathSelect = useCallback(
    (pathId: string) => {
      setSelectedPathId(pathId)

      const path = svgArray.flatMap((svg) => svg.paths).find((p) => p.id === pathId)
      if (path) {
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

  const handleColorSelect = useCallback(
    (color: string) => {
      if (!selectedPathId) return

      const pathIdParts = selectedPathId.split("-")
      const baseIdentifier = pathIdParts[pathIdParts.length - 1]

      const relatedPaths = svgArray.flatMap((svg) =>
        svg.paths
          .filter((path) => {
            const parts = path.id.split("-")
            const pathIdentifier = parts[parts.length - 1]
            return pathIdentifier === baseIdentifier
          })
          .map((path) => path.id),
      )

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

  const handleRotationChange = (index: number, newRotation: number) => {
    onRotate(tileId, index, newRotation)
  }

  const selectedPathColor = selectedPathId
    ? pathColors[selectedPathId] || svgArray.flatMap((svg) => svg.paths).find((p) => p.id === selectedPathId)?.fill
    : null

  const renderSvgContent = () => {
    if (svgLoading) {
      return (
        <div className="flex items-center justify-center bg-gray-100 w-full h-[300px] md:h-[500px] lg:h-[400px] relative">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-150" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-medium">Processing SVG data...</p>
              <p className="text-gray-500 text-sm mt-1">This may take a moment for complex tiles</p>
            </div>
          </div>
        </div>
      )
    }

    if (!showSvgAfterLoading) {
      return (
        <div className="w-full h-full">
          <SvgRenderer
            svgArray={svgArray}
            selectedPathId={selectedPathId}
            pathColors={pathColors}
            onPathSelect={handlePathSelect}
            onRotate={handleRotationChange}
            rotations={rotations}
          />
        </div>
      )
    }

  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-7 gap-[50px] md:gap-[80px] lg:gap-[100px]  xl:gap-[130px] ">
      <div className="col-span-2 lg:col-span-3">
        <h5 className="text-base fotn-normal leading-[120%] text-[#595959] text-center">
          Click on a section to change its color
        </h5>
        <h3 className="text-base font-medium text-black leading-[120%] text-center pt-[12px] lg:pt-[16px] xl:pt-[20px] 2xl:pt-[24px] pb-2 xl:pb-3 2xl:pb-4">
          Tile Preview
        </h3>
        <div className="w-full h-full flex justify-center items-start">{renderSvgContent()}</div>
      </div>

      <div className="col-span-2 lg:col-span-4">
        <div className="space-y-2">
          {svgArray.length !== 0 && <h3 className="text-sm font-medium">Colors Used:</h3>}
          <div className="flex flex-wrap gap-2">
            {svgColors.map((color, index) => {
              const pathsWithColor = svgArray.flatMap((svg) =>
                svg.paths.filter(
                  (p) => pathColors[p.id] === color || (!pathColors[p.id] && (p.originalFill || p.fill) === color),
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
                  className={`w-6 h-6 rounded border cursor-pointer transition-transform relative
                    hover:scale-110 ${isSelectedColor ? "ring-2 ring-black" : ""} 
                    ${isUsedByPath ? "border-${color}" : "border-gray-200"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (pathsWithColor.length > 0) {
                      handlePathSelect(pathsWithColor[0].id)
                    }
                  }}
                >
                  {isSelectedColor && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-white"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

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
                    const color = colorItem.code || (colorItem.image ? `image:${colorItem.image}` : null)
                    if (color) {
                      if (!selectedPathId && svgArray.length > 0) {
                        const firstPath = svgArray[0].paths[0]
                        if (firstPath) {
                          setSelectedPathId(firstPath.id)
                          const updatedPathColors = { ...pathColors }
                          const baseIdentifier = firstPath.id.split("-").pop()
                          svgArray.forEach((svg) => {
                            svg.paths.forEach((path) => {
                              if (path.id.split("-").pop() === baseIdentifier) {
                                updatedPathColors[path.id] = color
                              }
                            })
                          })
                          setPathColors(updatedPathColors)
                          if (onColorSelect) {
                            onColorSelect(firstPath.id, {
                              id: `${firstPath.id}-${color}`,
                              color,
                              name: color.startsWith("image:") ? "Texture" : `Color ${color}`,
                            })
                          }
                        }
                      } else if (selectedPathId) {
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
  )
}
