"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Skeleton } from "@/components/ui/skeleton"
import { TilesData } from "@/data/TilesData"
import { Tile } from "./types/tiles"

interface TileSelectionProps {
  onTileSelect: (tile: Tile) => void
  selectedTile: Tile | null
  onRotate: (tileId: string, index: number, newRotation: number) => void
  tileRotations?: Record<string, number[]>
  pathColors?: Record<string, string>
  selectedCategory?: string | null
  searchQuery?: string
}

export function TileSelection({
  onTileSelect,
  selectedTile,
  tileRotations = {},
  pathColors,
  selectedCategory,
  searchQuery,
}: TileSelectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [loading, setLoading] = useState(true)

  // Media queries for responsive design
  const isSmallScreen = useMediaQuery("(max-width: 767px)")
  const isMediumScreen = useMediaQuery("(min-width: 768px) and (max-width: 1023px)")

  // Calculate tiles per row based on screen size
  const tilesPerRow = isSmallScreen ? 2 : isMediumScreen ? 4 : 9
  const rowsPerPage = 2 // Always 2 rows max

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  // Fetch tiles from API or use mock data
  useEffect(() => {
    const fetchTiles = async () => {
      setLoading(true)
      try {
        if (process.env.NEXT_PUBLIC_BACKEND_URL) {
          // Build the URL with all possible filters
          let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles?page=${currentPage}`

          // Add category filter if provided
          if (selectedCategory && selectedCategory !== "all") {
            url += `&category=${selectedCategory}`
          }

          // Add search query if provided
          if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`
          }

          const response = await fetch(url)
          const data = await response.json()

          if (data.success) {
            // Transform API tiles to our Tile format
            const transformedTiles = await Promise.all(
              data.data.data.map(async (apiTile: Tile) => {
                // For each tile, fetch the SVG content
                let svgContent: string[] = []

                try {
                  const svgUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${apiTile.image}`
                  console.log(`Fetching SVG from: ${svgUrl}`)

                  const svgResponse = await fetch(svgUrl)

                  if (!svgResponse.ok) {
                    throw new Error(`Failed to fetch SVG: ${svgResponse.status} ${svgResponse.statusText}`)
                  }

                  const svgText = await svgResponse.text()

                  // Check if we got valid SVG content
                  if (!svgText.includes("<svg") || svgText.trim() === "") {
                    throw new Error("Invalid SVG content received")
                  }

                  // For 2x2 grid category, we need to create 4 SVGs
                  if (apiTile.grid_category === "2x2") {
                    // Use the same SVG 4 times for 2x2 grid
                    svgContent = [svgText, svgText, svgText, svgText]
                  } else {
                    // For 1x1, just use the single SVG
                    svgContent = [svgText]
                  }
                } catch (error) {
                  console.error(`Error fetching SVG for tile ${apiTile.id}:`, error)

                  // Create a fallback SVG with error message
                  const fallbackSvg = `<svg id="tile-${apiTile.id}-error" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f0f0f0"/>
                    <text x="50%" y="50%" textAnchor="middle" fill="red" fontSize="10">
                      SVG Error
                    </text>
                  </svg>`

                  if (apiTile.grid_category === "2x2") {
                    svgContent = [fallbackSvg, fallbackSvg, fallbackSvg, fallbackSvg]
                  } else {
                    svgContent = [fallbackSvg]
                  }
                }

                return {
                  id: apiTile.id.toString(),
                  name: apiTile.name,
                  collection: apiTile.categories[0]?.name || "Uncategorized",
                  svg: svgContent,
                  grid_category: apiTile.grid_category,
                }
              }),
            )

            setTiles(transformedTiles)
            setTotalPages(data.data.last_page)
          }
        } else {
          // Use mock data if no backend URL is provided
          console.log("Using mock data")

          // Filter mock data based on category and search query
          let filteredTiles = [...TilesData]

          if (selectedCategory && selectedCategory !== "all") {
            filteredTiles = filteredTiles.filter(
              (tile) => tile.collection.toLowerCase() === selectedCategory.toLowerCase(),
            )
          }

          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filteredTiles = filteredTiles.filter(
              (tile) => tile.name.toLowerCase().includes(query) || tile.collection.toLowerCase().includes(query),
            )
          }

          // setTiles(filteredTiles)
          setTiles(filteredTiles.map((tile) => ({
            id: parseInt(tile.id, 10),
            name: tile.name,
            description: '', // You may need to provide a default value or fetch this from an API
            grid_category: '', // You may need to provide a default value or fetch this from an API
            image: '', // You may need to provide a default value or fetch this from an API
            status: '', // You may need to provide a default value or fetch this from an API
            created_at: '', // You may need to provide a default value or fetch this from an API
            updated_at: '', // You may need to provide a default value or fetch this from an API
            categories: [], // You may need to provide a default value or fetch this from an API
            colors: [], // You may need to provide a default value or fetch this from an API
            collection: tile.collection,
            svg: tile.svg,
          })));
          setTotalPages(Math.ceil(filteredTiles.length / (tilesPerRow * rowsPerPage)))
        }
      } catch (error) {
        console.error("Error fetching tiles:", error)

        // Fallback to mock data on error
        let filteredTiles = [...TilesData]

        if (selectedCategory && selectedCategory !== "all") {
          filteredTiles = filteredTiles.filter(
            (tile) => tile.collection.toLowerCase() === selectedCategory.toLowerCase(),
          )
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredTiles = filteredTiles.filter(
            (tile) => tile.name.toLowerCase().includes(query) || tile.collection.toLowerCase().includes(query),
          )
        }

        // setTiles(filteredTiles)
        setTiles(filteredTiles.map((tile) => ({
          id: parseInt(tile.id, 10),
          name: tile.name,
          description: '', // You may need to provide a default value or fetch this from an API
          grid_category: '', // You may need to provide a default value or fetch this from an API
          image: '', // You may need to provide a default value or fetch this from an API
          status: '', // You may need to provide a default value or fetch this from an API
          created_at: '', // You may need to provide a default value or fetch this from an API
          updated_at: '', // You may need to provide a default value or fetch this from an API
          categories: [], // You may need to provide a default value or fetch this from an API
          colors: [], // You may need to provide a default value or fetch this from an API
          collection: tile.collection,
          svg: tile.svg,
        })));
        setTotalPages(Math.ceil(filteredTiles.length / (tilesPerRow * rowsPerPage)))
      } finally {
        setLoading(false)
      }
    }

    fetchTiles()
  }, [currentPage, selectedCategory, searchQuery, tilesPerRow, rowsPerPage])

  const handleTileSelect = (tile: Tile) => {
    onTileSelect(tile)
  }

  // Helper function to apply colors to SVG string
  const applyColorsToSvg = (svgString: string, colors: Record<string, string>) => {
    if (!svgString || typeof svgString !== "string") {
      console.error("Invalid SVG string provided:", svgString)
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" textAnchor="middle" fill="red" fontSize="10">
          Invalid SVG
        </text>
      </svg>`
    }

    if (!colors || Object.keys(colors).length === 0) return svgString

    try {
      let modifiedSvg = svgString

      // Create a temporary DOM element to parse the SVG
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgString, "image/svg+xml")

      // Check for parsing errors
      const parserError = doc.querySelector("parsererror")
      if (parserError) {
        console.error("SVG parsing error:", parserError.textContent)
        return svgString
      }

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
    } catch (error) {
      console.error("Error applying colors to SVG:", error)
      return svgString
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Calculate visible tiles based on current page
  const startIdx = (currentPage - 1) * tilesPerRow * rowsPerPage
  const visibleTiles = tiles.slice(startIdx, startIdx + tilesPerRow * rowsPerPage)

  // Split tiles into rows based on responsive grid
  const getRowTiles = (rowIndex: number) => {
    const startIdx = rowIndex * tilesPerRow
    return visibleTiles.slice(startIdx, startIdx + tilesPerRow)
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: tilesPerRow * rowsPerPage }).map((_, index) => (
      <div key={`skeleton-${index}`} className="flex flex-col items-center border border-[#595959]/40">
        <Skeleton className="w-full aspect-square" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>
    ))
  }

  return (
    <div className="p-4 space-y-4">
      {/* No results message */}
      {!loading && tiles.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg font-medium text-gray-600">No tiles found</p>
          <p className="text-sm text-gray-500 mt-2">
            {searchQuery ? `No results for "${searchQuery}"` : "Try selecting a different category"}
          </p>
        </div>
      )}

      {loading ? (
        <div className="relative">
          <div className="flex items-center justify-between">
            {/* Left navigation arrow */}
            <button
              disabled
              className="bg-white border border-black rounded-full shadow-md p-1 opacity-50 cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Carousel container */}
            <div className="container px-2 md:px-4">
              {/* First row */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 md:gap-3 mb-4">
                {renderSkeletons().slice(0, tilesPerRow)}
              </div>

              {/* Second row */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 md:gap-3">
                {renderSkeletons().slice(tilesPerRow)}
              </div>
            </div>

            {/* Right navigation arrow */}
            <button
              disabled
              className="bg-white border border-black rounded-full shadow-md p-1 opacity-50 cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between">
            {/* Left navigation arrow */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={cn(
                "bg-white border border-black rounded-full shadow-md p-1 hover:bg-gray-100",
                currentPage === 1 && "opacity-50 cursor-not-allowed",
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Carousel container */}
            <div className="container px-2 md:px-4">
              {/* First row */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 md:gap-3 mb-4">
                {getRowTiles(0).map((tile) => (
                  <div key={tile.id} className="flex flex-col items-center border border-[#595959]/40">
                    <button
                      onClick={() => handleTileSelect(tile)}
                      className={cn(
                        "relative w-full aspect-square overflow-hidden transition-all bg-white",
                        selectedTile?.id === tile.id ? "scale-[0.98] ring-2 ring-primary" : "",
                      )}
                    >
                      <div
                        className="grid gap-[1px]"
                        style={{
                          gridTemplateColumns: `repeat(${tile.grid_category === "2x2" ? 2 : 1}, 1fr)`,
                          gridTemplateRows: `repeat(${tile.grid_category === "2x2" ? 2 : 1}, 1fr)`,
                        }}
                      >
                        {tile.svg.map((svgString: string, index: number) => {
                          // Only apply rotations for 2x2 grid category
                          let rotation: number = 0

                          if (tile.grid_category === "2x2") {
                            // Use the correct initial rotation pattern if not in tileRotations
                            const defaultRotation: number = (() => {
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

                            rotation = tileRotations[tile.id] ? tileRotations[tile.id][index] : defaultRotation
                          }
                          console.log("tiledata", tile)
                          return (
                            <div key={`${tile.id}-${index}`} className="flex items-center justify-center">
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
                                className="svg-container"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </button>


                    <p className="text-[12px] font-normal text-center truncate mt-1 w-full px-1">{tile.name}</p>
                  </div>
                ))}
              </div>

              {/* Second row */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 md:gap-3">
                {getRowTiles(1).map((tile) => (
                  <div key={`second-${tile.id}`} className="flex flex-col items-center border border-[#595959]/40">
                    <button
                      onClick={() => handleTileSelect(tile)}
                      className={cn(
                        "relative w-full aspect-square overflow-hidden transition-all bg-white",
                        selectedTile?.id === tile.id ? "scale-[0.98] ring-2 ring-primary" : "",
                      )}
                    >
                      <div
                        className="grid gap-[1px]"
                        style={{
                          gridTemplateColumns: `repeat(${tile.grid_category === "2x2" ? 2 : 1}, 1fr)`,
                          gridTemplateRows: `repeat(${tile.grid_category === "2x2" ? 2 : 1}, 1fr)`,
                        }}
                      >
                        {tile.svg.map((svgString: string, index: number) => {
                          // Only apply rotations for 2x2 grid category
                          let rotation: number = 0

                          if (tile.grid_category === "2x2") {
                            const defaultRotation: number = (() => {
                              switch (index) {
                                case 0:
                                  return 0
                                case 1:
                                  return 90
                                case 2:
                                  return 270
                                case 3:
                                  return 180
                                default:
                                  return 0
                              }
                            })()

                            rotation = tileRotations[tile.id] ? tileRotations[tile.id][index] : defaultRotation
                          }

                          return (
                            <div key={`second-${tile.id}-${index}`} className="flex items-center justify-center">
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
                                className="svg-container"
                              />



                            </div>
                          )
                        })}
                      </div>
                    </button>
                    <p className="text-xs font-medium text-center truncate mt-1 w-full px-1">{tile.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right navigation arrow */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={cn(
                "bg-white border border-black rounded-full shadow-md p-1 hover:bg-gray-100",
                currentPage === totalPages && "opacity-50 cursor-not-allowed",
              )}
              aria-label="Next page"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>



          {/* Pagination indicator */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
