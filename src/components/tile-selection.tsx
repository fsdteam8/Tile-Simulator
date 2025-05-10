"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { TilesData } from "@/data/TilesData";
import type { Tile } from "./types/tiles";

interface TileSelectionProps {
  onTileSelect: (tile: Tile) => void;
  selectedTile: Tile | null;
  onRotate: (tileId: string, index: number, newRotation: number) => void;
  tileRotations?: Record<string, number[]>;
  pathColors?: Record<string, string>;
  selectedCategory?: string;
  searchQuery?: string;
}

export function TileSelection({
  onTileSelect,
  selectedTile,
  tileRotations = {},
  pathColors,
  selectedCategory,
  searchQuery,
}: TileSelectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const isMediumScreen = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const tilesPerRow = isSmallScreen ? 2 : isMediumScreen ? 4 : 9;
  const rowsPerPage = 2;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Fetch tiles from API or use mock data
  useEffect(() => {
    const fetchTiles = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles?paginate_count=${tilesPerRow * rowsPerPage}&page=${currentPage}`;

        if (selectedCategory && selectedCategory !== "all") {
          url += `&category_id=${selectedCategory}`;
        }

        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }

        if (process.env.NEXT_PUBLIC_BACKEND_URL) {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();

          if (data.success) {
            const transformedTiles = await Promise.all(
              data.data.data.map(async (apiTile: Tile) => {
                let svgContent: string[] = [];

                try {
                  if (apiTile.image_svg_text) {
                    const decodedSvg = decodeSvgFromBase64(apiTile.image_svg_text);
                    svgContent = apiTile.grid_category === "2x2"
                      ? [decodedSvg, decodedSvg, decodedSvg, decodedSvg]
                      : [decodedSvg];
                  } else if (apiTile.image) {
                    const svgUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${apiTile.image}`;
                    const svgResponse = await fetch(svgUrl);
                    if (!svgResponse.ok) throw new Error("Failed to fetch SVG");
                    const svgText = await svgResponse.text();
                    svgContent = apiTile.grid_category === "2x2"
                      ? [svgText, svgText, svgText, svgText]
                      : [svgText];
                  } else {
                    throw new Error("No SVG content available");
                  }
                } catch (error) {
                  console.error(`Error processing SVG for tile ${apiTile.id}:`, error);
                  const fallbackSvg = createFallbackSvg(apiTile.id.toString());
                  svgContent = apiTile.grid_category === "2x2"
                    ? [fallbackSvg, fallbackSvg, fallbackSvg, fallbackSvg]
                    : [fallbackSvg];
                }

                return {
                  id: Number(apiTile.id),
                  name: apiTile.name,
                  description: apiTile.description || "",
                  collection: apiTile.categories[0]?.name || "Uncategorized",
                  svg: svgContent,
                  grid_category: apiTile.grid_category || "1x1",
                  status: apiTile.status || "",
                  created_at: apiTile.created_at || "",
                  updated_at: apiTile.updated_at || "",
                  categories: apiTile.categories || [],
                  colors: apiTile.colors || [],
                  image: apiTile.image || "",
                  image_svg_text: apiTile.image_svg_text || "",
                };
              })
            );

            setTiles(transformedTiles);
            setTotalPages(data.data.last_page);
          } else {
            throw new Error(data.message || "Failed to fetch tiles");
          }
        } else {
          // Fallback to mock data
          let filteredTiles = [...TilesData];

          if (selectedCategory && selectedCategory !== "all") {
            filteredTiles = filteredTiles.filter(
              (tile) => tile.collection.toLowerCase() === selectedCategory.toLowerCase()
            );
          }

          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredTiles = filteredTiles.filter(
              (tile) => tile.name.toLowerCase().includes(query) ||
                tile.collection.toLowerCase().includes(query)
            );
          }

          const transformedTiles = filteredTiles.map((tile) => ({
            id: parseInt(tile.id, 10),
            name: tile.name,
            description: "",
            grid_category: "1x1",
            image: "",
            status: "",
            created_at: "",
            updated_at: "",
            categories: [],
            colors: [],
            collection: tile.collection,
            svg: tile.svg,
            image_svg_text: btoa(tile.svg[0] || "<svg></svg>"),
          }));

          setTiles(transformedTiles);
          setTotalPages(Math.ceil(filteredTiles.length / (tilesPerRow * rowsPerPage)));
        }
      } catch (err) {
        console.error("Error fetching tiles:", err);
        setError(err instanceof Error ? err.message : "Failed to load tiles");
        // Fallback to empty array to prevent crashes
        setTiles([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTiles();
  }, [currentPage, selectedCategory, searchQuery, tilesPerRow, rowsPerPage]);

  const handleTileSelect = (tile: Tile) => {
    onTileSelect(tile);
  };

  const applyColorsToSvg = (svgString: string, colors: Record<string, string>) => {
    if (!svgString || typeof svgString !== "string") {
      return createFallbackSvg("error");
    }

    if (!colors || Object.keys(colors).length === 0) return svgString;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, "image/svg+xml");
      const parserError = doc.querySelector("parsererror");
      if (parserError) return svgString;

      const paths = doc.querySelectorAll("path");
      let modified = false;

      paths.forEach((path) => {
        const pathId = path.id || path.getAttribute("d")?.substring(0, 20);
        Object.keys(colors).forEach((colorPathId) => {
          if (pathId && (colorPathId.includes(pathId) || pathId.includes(colorPathId))) {
            path.setAttribute("fill", colors[colorPathId]);
            modified = true;
          }
        });
      });

      if (modified) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(doc);
      }
      return svgString;
    } catch (error) {
      console.error("Error applying colors to SVG:", error);
      return svgString;
    }
  };

  const decodeSvgFromBase64 = (base64String: string): string => {
    if (!base64String) return createFallbackSvg("empty");

    try {
      const decodedString = atob(base64String);
      return decodeURIComponent(
        Array.from(decodedString)
          .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } catch (error) {
      console.error("Error decoding SVG:", error);
      return createFallbackSvg("decode-error");
    }
  };

  const createFallbackSvg = (id: string) => {
    return `<svg id="tile-${id}-error" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" fill="red" font-size="10">
        SVG Error
      </text>
    </svg>`;
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const visibleTiles = tiles.slice(0, tilesPerRow * rowsPerPage);

  const getRowTiles = (rowIndex: number) => {
    const startIdx = rowIndex * tilesPerRow;
    return visibleTiles.slice(startIdx, startIdx + tilesPerRow);
  };

  const renderSkeletons = () => {
    return Array.from({ length: tilesPerRow * rowsPerPage }).map((_, index) => (
      <div key={`skeleton-${index}`} className="flex flex-col items-center border border-[#595959]/40">
        <Skeleton className="w-full aspect-square" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>
    ));
  };

  return (
    <div className="p-4 space-y-4">
      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          Error: {error}
        </div>
      )}

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
            <button
              disabled
              className="bg-white border border-black rounded-full shadow-md p-1 opacity-50 cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="container px-2 md:px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 md:gap-3 mb-4">
                {renderSkeletons().slice(0, tilesPerRow)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 md:gap-3">
                {renderSkeletons().slice(tilesPerRow)}
              </div>
            </div>

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

            <div className="container px-2 md:px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 md:gap-3 mb-4">
                {getRowTiles(0).map((tile) => {
                  const tileIdStr = String(tile.id);
                  return (
                    <div key={tileIdStr} className={cn("flex flex-col items-center border border-[#595959]/40", selectedTile?.id === tile.id ? "scale-[0.98] ring-2 ring-[#595959]" : "",
                    )}>
                      <button
                        onClick={() => handleTileSelect(tile)}
                        className={cn(
                          "relative w-full aspect-square overflow-hidden transition-all bg-white",
                          selectedTile?.id === tile.id ? "scale-[0.98] " : "",
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
                            let rotation = 0;
                            if (tile.grid_category === "2x2") {
                              const defaultRotation = [0, 90, 270, 180][index] || 0;
                              rotation = tileRotations[tileIdStr]?.[index] ?? defaultRotation;
                            }

                            return (
                              <div key={`${tileIdStr}-${index}`} className={cn(
                                "flex items-center justify-center",
                                tile.grid_category === "2x2" ? "w-full h-full" : "w-full h-[110px]",
                              )}>
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
                            );
                          })}
                        </div>
                      </button>
                      <p className="text-[12px] font-normal border-t border-[#595959]/40 text-center truncate mt-1 w-full px-1">{tile.name}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2 md:gap-3">
                {getRowTiles(1).map((tile) => {
                  const tileIdStr = `second-${tile.id}`;
                  return (
                    <div key={tileIdStr} className={cn("flex flex-col items-center border border-[#595959]/40", selectedTile?.id === tile.id ? "scale-[0.98] ring-2 ring-[#595959]" : "",
                    )}>
                      <button
                        onClick={() => handleTileSelect(tile)}
                        className={cn(
                          "relative w-full aspect-square overflow-hidden transition-all bg-white",
                          selectedTile?.id === tile.id ? "scale-[0.98] " : "",
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
                            let rotation = 0;
                            if (tile.grid_category === "2x2") {
                              const defaultRotation = [0, 90, 270, 180][index] || 0;
                              rotation = tileRotations[tileIdStr]?.[index] ?? defaultRotation;
                            }

                            return (
                              <div key={`${tileIdStr}-${index}`} className={cn(
                                "flex items-center justify-center",
                                tile.grid_category === "2x2" ? "w-full h-full" : "w-full h-[110px]",
                              )}>
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
                            );
                          })}
                        </div>
                      </button>
                      <p className="text-xs font-medium border-t border-[#595959]/40 text-center truncate mt-1 w-full p-1">{tile.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>

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
        </div>
      )}
    </div>
  );
}