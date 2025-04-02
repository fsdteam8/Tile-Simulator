"use client"

import { useState, useCallback, useEffect } from "react"
import { RotateCw } from "lucide-react"

interface PathData {
  id: string
  d: string
  fill?: string
  originalFill?: string
}

interface SvgData {
  id?: string
  width?: string
  height?: string
  viewBox?: string
  paths: PathData[]
}

interface SvgRendererProps {
  svgArray: SvgData[]
  selectedPathId: string | null
  pathColors: Record<string, string>
  onPathSelect: (pathId: string) => void
  onRotate: (index: number, newRotation: number) => void
  rotations?: number[] // Accept rotations from parent
}

export function SvgRenderer({
  svgArray,
  selectedPathId,
  pathColors,
  onPathSelect,
  onRotate,
  rotations: externalRotations,
}: SvgRendererProps) {
  // Use external rotations if provided, otherwise initialize with zeros
  const [internalRotations, setInternalRotations] = useState<number[]>(svgArray.map(() => 0))
  const [relatedPaths, setRelatedPaths] = useState<string[]>([])

  // Determine which rotations to use - external or internal
  const rotations = externalRotations || internalRotations

  useEffect(() => {
    console.log("SVG Array Length:", svgArray.length)
  }, [svgArray])

  // Update internal rotations if external rotations change
  useEffect(() => {
    if (externalRotations) {
      setInternalRotations(externalRotations)
    }
  }, [externalRotations])



  // Add a useEffect to log rotations when they change
  useEffect(() => {
    if (rotations) {
      console.log("Current rotations:", rotations)
    }
  }, [rotations])

  const findRelatedPaths = useCallback(
    (pathId: string) => {
      // Extract the base identifier from the path ID
      const pathIdParts = pathId.split("-")
      const baseIdentifier = pathIdParts[pathIdParts.length - 1] // Get the last part which is likely the common identifier

      // Find all paths with matching identifiers across all tiles
      const related = svgArray.flatMap((svg) =>
        svg.paths
          .filter((path) => {
            const parts = path.id.split("-")
            const pathIdentifier = parts[parts.length - 1]
            return pathIdentifier === baseIdentifier
          })
          .map((path) => path.id),
      )

      setRelatedPaths(related)
      console.log("Related paths:", related)
    },
    [svgArray], // Dependencies
  )

  // Now, `findRelatedPaths` is defined before being used
  useEffect(() => {
    if (selectedPathId) {
      findRelatedPaths(selectedPathId)
    } else {
      setRelatedPaths([])
    }
  }, [selectedPathId, findRelatedPaths]) // ✅ No more errors!



  const getPathColor = useCallback(
    (path: PathData) => pathColors[path.id] || path.originalFill || path.fill || "#000000",
    [pathColors],
  )

  const getPathStyle = useCallback(
    (pathId: string) => ({
      cursor: "pointer",
      stroke: selectedPathId === pathId || relatedPaths.includes(pathId) ? "#ffffff" : "none",
      strokeWidth: selectedPathId === pathId || relatedPaths.includes(pathId) ? 2 : 0,
      transition: "all 0.2s ease",
    }),
    [selectedPathId, relatedPaths],
  )

  const handleRotate = (index: number) => {
    const newRotation = (rotations[index] + 90) % 360

    // Update internal state immediately for a responsive feel
    setInternalRotations((prevRotations) => {
      const newRotations = [...prevRotations]
      newRotations[index] = newRotation
      return newRotations
    })

    // Notify parent component
    onRotate(index, newRotation)

    // Log for debugging
    console.log(`Rotated SVG at index ${index} to ${newRotation} degrees`)
  }

  const handlePathSelect = (pathId: string) => {
    // Extract the base identifier from the path ID
    const pathIdParts = pathId.split("-")
    const baseIdentifier = pathIdParts[pathIdParts.length - 1] // Get the last part which is likely the common identifier

    // Find all paths with matching identifiers across all tiles
    const related = svgArray.flatMap((svg) =>
      svg.paths
        .filter((path) => {
          const parts = path.id.split("-")
          const pathIdentifier = parts[parts.length - 1]
          return pathIdentifier === baseIdentifier
        })
        .map((path) => path.id),
    )

    // Select the first path to trigger the color picker
    if (related.length > 0) {
      onPathSelect(pathId)
      setRelatedPaths(related)
    } else {
      // Fallback to just selecting the clicked path
      onPathSelect(pathId)
      setRelatedPaths([pathId])
    }
  }

  // Ensure the rotation transform is applied with !important to override any other styles
  // const getRotationStyle = (index: number) => ({
  //   transform: `rotate(${rotations[index]}deg) !important`,
  //   transition: "transform 0.3s ease-in-out",
  // })

  return (
    <div>
      <div className="text-center mb-[16px]">
        <p className="text-[#595959] text-[16px] mb-[24px]">Click on a section to change its color</p>
        <h1 className="text-black text-[16px]">Tile Preview</h1>
      </div>
      <div className={`grid ${svgArray.length === 4 ? "grid-cols-2 w-[482px] h-[470px]" : "grid-cols-1 w-[482px] h-[470px]"} gap-1`}>
        {svgArray.map((svg, index) => (
          <div key={svg.id || `svg-${index}`} className="relative group">
            {/* Remove the rotation indicator */}

            {/* SVG Element */}
            <svg
              width={svg.width || "100px"}
              height={svg.height || "100px"}
              viewBox={svg.viewBox || "0 0 100 100"}
              className="border border-gray-300 rounded-lg shadow-md p-2 w-full h-full"
              style={{
                transform: `rotate(${rotations[index]}deg)`,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {/* Render paths */}
              {svg.paths && svg.paths.length > 0 ? (
                svg.paths.map((path) => (
                  <path
                    key={path.id}
                    id={path.id}
                    d={path.d}
                    fill={getPathColor(path)}
                    style={getPathStyle(path.id)}
                    onClick={() => handlePathSelect(path.id)}
                  />
                ))
              ) : (
                <text x="10" y="50" fill="white" className="text-xs">
                  No paths found
                </text>
              )}
            </svg>

            {/* Rotate Button */}
            <button
              onClick={() => handleRotate(index)}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-200"
              aria-label="Rotate SVG"
            >
              <RotateCw size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

