"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Skeleton } from "@/components/ui/skeleton"
import type { Tile } from "./types/tiles"

interface TileSelectionProps {
  onTileSelect: (tile: Tile) => void
  selectedTile: Tile | null
  onRotate: (tileId: string, index: number, newRotation: number) => void
  tileRotations?: Record<string, number[]>
  pathColors?: Record<string, string>
  selectedCategory?: string
  searchQuery?: string
  autoSelectFirst?: boolean
}

export function TileSelection({
  onTileSelect,
  selectedTile,
  tileRotations = {},
  pathColors,
  selectedCategory,
  searchQuery,
  autoSelectFirst = true,
}: TileSelectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasAutoSelected, setHasAutoSelected] = useState(false)
  const firstTileRef = useRef<HTMLButtonElement>(null)

  const isSmallScreen = useMediaQuery("(max-width: 767px)")
  const isMediumScreen = useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
  const tilesPerRow = isSmallScreen ? 2 : isMediumScreen ? 4 : 9
  const rowsPerPage = 2

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
    setError(null)
  }, [selectedCategory, searchQuery])

  // Fetch tiles from API or use mock data
  useEffect(() => {
    const fetchTiles = async () => {
      setLoading(true)
      setError(null)

      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles?paginate_count=1000`

        if (selectedCategory && selectedCategory !== "all") {
          url += `&category_id=${selectedCategory}`
        }

        if (searchQuery?.trim()) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`
        }

        if (process.env.NEXT_PUBLIC_BACKEND_URL) {
          const response = await fetch(url)

          if (!response.ok) {
            throw new Error(`Failed to fetch tiles: ${response.status}`)
          }

          const data = await response.json()

          if (data.success && data.data?.data) {
            const transformedTiles = await Promise.all(
              data.data.data.map(async (apiTile: Tile) => {
                let svgContent: string[] = []

                try {
                  if (apiTile.image_svg_text) {
                    const decodedSvg = decodeSvgFromBase64(apiTile.image_svg_text)
                    svgContent =
                      apiTile.grid_category === "2x2" ? [decodedSvg, decodedSvg, decodedSvg, decodedSvg] : [decodedSvg]
                  } else if (apiTile.image) {
                    const svgUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${apiTile.image}`
                    const svgResponse = await fetch(svgUrl)
                    if (!svgResponse.ok) throw new Error("Failed to fetch SVG")
                    const svgText = await svgResponse.text()
                    svgContent = apiTile.grid_category === "2x2" ? [svgText, svgText, svgText, svgText] : [svgText]
                  } else {
                    throw new Error("No SVG content available")
                  }
                } catch (error) {
                  console.error(`Error processing SVG for tile ${apiTile.id}:`, error)
                  const fallbackSvg = createFallbackSvg(apiTile.id.toString())
                  svgContent =
                    apiTile.grid_category === "2x2"
                      ? [fallbackSvg, fallbackSvg, fallbackSvg, fallbackSvg]
                      : [fallbackSvg]
                }

                return {
                  id: Number(apiTile.id),
                  name: apiTile.name || "Unnamed Tile",
                  description: apiTile.description || "",
                  collection: apiTile.categories?.[0]?.name || "Uncategorized",
                  svg: svgContent,
                  grid_category: apiTile.grid_category || "1x1",
                  status: apiTile.status || "",
                  created_at: apiTile.created_at || "",
                  updated_at: apiTile.updated_at || "",
                  categories: apiTile.categories || [],
                  colors: apiTile.colors || [],
                  image: apiTile.image || "",
                  image_svg_text: apiTile.image_svg_text || "",
                }
              }),
            )

            setTiles(transformedTiles)
            setTotalPages(calculateTotalPages(transformedTiles))
          } else {
            throw new Error(data.message || "No tiles found")
          }
        } else {
          // No backend URL configured
          throw new Error("Backend URL not configured")
        }
      } catch (err) {
        console.error("Error fetching tiles:", err)
        setError(err instanceof Error ? err.message : "Failed to load tiles")
        setTiles([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }

    fetchTiles()
  }, [selectedCategory, searchQuery, tilesPerRow, rowsPerPage])

  // Auto-select first tile when tiles are loaded
  useEffect(() => {
    if (autoSelectFirst && !loading && tiles.length > 0 && !selectedTile && !hasAutoSelected) {
      onTileSelect(tiles[0])
      setHasAutoSelected(true)

      if (firstTileRef.current) {
        firstTileRef.current.focus()
      }
    }
  }, [autoSelectFirst, loading, tiles, selectedTile, hasAutoSelected, onTileSelect])

  // Reset auto-selection state when filters change
  useEffect(() => {
    setHasAutoSelected(false)
  }, [selectedCategory, searchQuery])

  const handleTileSelect = useCallback(
    (tile: Tile) => {
      if (tile && selectedTile?.id !== tile.id) {
        onTileSelect(tile)
      }
    },
    [selectedTile?.id, onTileSelect],
  )

  const applyColorsToSvg = useCallback((svgString: string, colors: Record<string, string>) => {
    if (!svgString || typeof svgString !== "string") {
      return createFallbackSvg("error")
    }

    if (!colors || Object.keys(colors).length === 0) return svgString

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgString, "image/svg+xml")
      const parserError = doc.querySelector("parsererror")
      if (parserError) return svgString

      const paths = doc.querySelectorAll("path")
      let modified = false

      paths.forEach((path) => {
        const pathId = path.id || path.getAttribute("d")?.substring(0, 20)
        Object.keys(colors).forEach((colorPathId) => {
          if (pathId && (colorPathId.includes(pathId) || pathId.includes(colorPathId))) {
            path.setAttribute("fill", colors[colorPathId])
            modified = true
          }
        })
      })

      if (modified) {
        const serializer = new XMLSerializer()
        return serializer.serializeToString(doc)
      }
      return svgString
    } catch (error) {
      console.error("Error applying colors to SVG:", error)
      return svgString
    }
  }, [])

  const decodeSvgFromBase64 = (base64String: string): string => {
    if (!base64String) return createFallbackSvg("empty")

    try {
      const decodedString = atob(base64String)
      return decodeURIComponent(
        Array.from(decodedString)
          .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
    } catch (error) {
      console.error("Error decoding SVG:", error)
      return createFallbackSvg("decode-error")
    }
  }

  const createFallbackSvg = (id: string) => {
    return `<svg id="tile-${id}-error" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" textAnchor="middle" fill="#666" fontSize="10">
        Tile Error
      </text>
    </svg>`
  }

  const calculateTotalPages = (allTiles: Tile[]) => {
    return Math.ceil(allTiles.length / (tilesPerRow * rowsPerPage))
  }

  const goToNextPage = () => {
    if (currentPage < totalPages && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentPage(currentPage + 1)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1 && !isTransitioning) {
      setIsTransitioning(true)
      setCurrentPage(currentPage - 1)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }

  const getVisibleTiles = () => {
    const startIdx = (currentPage - 1) * (tilesPerRow * rowsPerPage)
    const endIdx = startIdx + tilesPerRow * rowsPerPage
    return tiles.slice(startIdx, endIdx)
  }

  const getRowTiles = (rowIndex: number) => {
    const visibleTiles = getVisibleTiles()
    const startIdx = rowIndex * tilesPerRow
    return visibleTiles.slice(startIdx, startIdx + tilesPerRow)
  }

  const renderSkeletons = () => {
    return Array.from({ length: tilesPerRow * rowsPerPage }).map((_, index) => (
      <div key={`skeleton-${index}`} className="flex flex-col items-center border border-[#595959]/40">
        <Skeleton className="w-full aspect-square" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>
    ))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load tiles</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 md:space-y-4">
      {loading ? (
        <div className="relative">
          <div className="flex items-center justify-between w-full mb-4 absolute top-[42%] left-0">
            <button
              disabled
              className="bg-white border border-black rounded-full shadow-md p-1 md:p-2 opacity-50 cursor-not-allowed flex-shrink-0 z-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <button
              disabled
              className="bg-white border border-black rounded-full shadow-md p-1 md:p-2 opacity-50 cursor-not-allowed flex-shrink-0 z-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          <div className="container px-10 md:px-10 lg:px-4 flex-grow overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-1 md:gap-2 lg:gap-3 mb-2 md:mb-4">
              {renderSkeletons().slice(0, tilesPerRow)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-1 md:gap-2 lg:gap-3">
              {renderSkeletons().slice(tilesPerRow)}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between w-full mb-4 absolute top-[42%] left-0">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1 || isTransitioning}
              className={cn(
                "bg-white border border-black rounded-full shadow-md p-1 md:p-2 hover:bg-gray-100 active:scale-95 flex-shrink-0 z-10 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center",
                (currentPage === 1 || isTransitioning) && "opacity-50 cursor-not-allowed active:scale-100",
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || isTransitioning}
              className={cn(
                "bg-white border border-black rounded-full shadow-md p-1 md:p-2 hover:bg-gray-100 active:scale-95 flex-shrink-0 z-10 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center",
                (currentPage === totalPages || isTransitioning) && "opacity-50 cursor-not-allowed active:scale-100",
              )}
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          <div className="container px-10 md:px-10 lg:px-4 flex-grow overflow-hidden">
            {/* First Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-1 md:gap-2 lg:gap-3 mb-2 md:mb-4">
              {getRowTiles(0).map((tile, index) => {
                const tileIdStr = String(tile.id)
                return (
                  <div
                    key={tileIdStr}
                    className={cn(
                      "flex flex-col items-center border border-[#595959]/40 transition-all duration-200",
                      selectedTile?.id === tile.id ? "scale-[0.98] ring-2 ring-[#595959]" : "hover:shadow-md",
                    )}
                  >
                    <button
                      ref={index === 0 ? firstTileRef : undefined}
                      onClick={() => handleTileSelect(tile)}
                      className={cn(
                        "relative w-full aspect-square overflow-hidden transition-all bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        selectedTile?.id === tile.id ? "scale-[0.98]" : "hover:scale-[1.02]",
                      )}
                      aria-label={`Select ${tile.name} tile`}
                    >
                      <div
                        className="grid gap-[1px]"
                        style={{
                          gridTemplateColumns: `repeat(${tile.grid_category === "2x2" ? 2 : 1}, 1fr)`,
                          gridTemplateRows: `repeat(${tile.grid_category === "2x2" ? 2 : 1}, 1fr)`,
                        }}
                      >
                        {tile.svg.map((svgString: string, svgIndex: number) => {
                          let rotation = 0
                          if (tile.grid_category === "2x2") {
                            const defaultRotation = [0, 90, 270, 180][svgIndex] || 0
                            rotation = tileRotations[tileIdStr]?.[svgIndex] ?? defaultRotation
                          }

                          return (
                            <div
                              key={`${tileIdStr}-${svgIndex}`}
                              className={cn(
                                "flex items-center justify-center",
                                tile.grid_category === "2x2" ? "w-full h-full" : "w-full h-[110px]",
                              )}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: applyColorsToSvg(svgString, pathColors || {}),
                                }}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  transform: tile.grid_category === "2x2" ? `rotate(${rotation}deg)` : "none",
                                  transition: "transform 0.3s ease-in-out",
                                }}
                                className="svg-container w-full h-full flex items-center justify-center"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </button>
                    <p className="text-xs font-medium border-t border-[#595959]/40 text-center truncate mt-1 w-full px-1 py-0.5">
                      {tile.name}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-1 md:gap-2 lg:gap-3">
              {getRowTiles(1).map((tile) => {
                const tileIdStr = `second-${tile.id}`
                return (
                  <div
                    key={tileIdStr}
                    className={cn(
                      "flex flex-col items-center border border-[#595959]/40 transition-all duration-200",
                      selectedTile?.id === tile.id ? "scale-[0.98] ring-2 ring-[#595959]" : "hover:shadow-md",
                    )}
                  >
                    <button
                      onClick={() => handleTileSelect(tile)}
                      className={cn(
                        "relative w-full aspect-square overflow-hidden transition-all bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        selectedTile?.id === tile.id ? "scale-[0.98]" : "hover:scale-[1.02]",
                      )}
                      aria-label={`Select ${tile.name} tile`}
                    >
                      <div
                        className="grid gap-[1px]"
                        style={{
                          gridTemplateColumns: `repeat(${tile.grid_category === "2x2" ? 2 : 1}, 1fr)`,
                          gridTemplateRows: `repeat(${tile.grid_category === "2x2" ? 2 : 1}, 1fr)`,
                        }}
                      >
                        {tile.svg.map((svgString: string, svgIndex: number) => {
                          let rotation = 0
                          if (tile.grid_category === "2x2") {
                            const defaultRotation = [0, 90, 270, 180][svgIndex] || 0
                            rotation = tileRotations[tileIdStr]?.[svgIndex] ?? defaultRotation
                          }

                          return (
                            <div
                              key={`${tileIdStr}-${svgIndex}`}
                              className={cn(
                                "flex items-center justify-center",
                                tile.grid_category === "2x2" ? "w-full h-full" : "w-full h-[110px]",
                              )}
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: applyColorsToSvg(svgString, pathColors || {}),
                                }}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  transform: tile.grid_category === "2x2" ? `rotate(${rotation}deg)` : "none",
                                  transition: "transform 0.3s ease-in-out",
                                }}
                                className="svg-container w-full h-full flex items-center justify-center"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </button>
                    <p className="text-xs font-medium border-t border-[#595959]/40 text-center truncate mt-1 w-full px-1 py-0.5">
                      {tile.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pagination Info */}
          {totalPages > 1 && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages} ({tiles.length} tiles total)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
