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

  console.log("SVG kongkon:", pathColors)

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

  // Update related paths when selectedPathId changes
  // useEffect(() => {
  //   if (selectedPathId) {
  //     findRelatedPaths(selectedPathId)
  //   } else {
  //     setRelatedPaths([])
  //   }
  // }, [selectedPathId])

  // Add a useEffect to log rotations when they change
  useEffect(() => {
    if (rotations) {
      console.log("Current rotations:", rotations)
    }
  }, [rotations])

  // const findRelatedPaths = (pathId: string) => {
  //   // Extract the base identifier from the path ID
  //   const pathIdParts = pathId.split("-")
  //   const baseIdentifier = pathIdParts[pathIdParts.length - 1] // Get the last part which is likely the common identifier

  //   // Find all paths with matching identifiers across all tiles
  //   const related = svgArray.flatMap((svg) =>
  //     svg.paths
  //       .filter((path) => {
  //         const parts = path.id.split("-")
  //         const pathIdentifier = parts[parts.length - 1]
  //         return pathIdentifier === baseIdentifier
  //       })
  //       .map((path) => path.id),
  //   )

  //   setRelatedPaths(related)
  //   console.log("Related paths:", related)
  // }

  const getPathColor = useCallback(
    (path: PathData) => pathColors[path.id] || path.originalFill || path.fill || "#000000",
    [pathColors],
  )

  // Update the getPathStyle function to enhance hover and selection effects
  const getPathStyle = useCallback(
    (pathId: string) => {
      const isSelected = selectedPathId === pathId || relatedPaths.includes(pathId)

      return {
        cursor: "pointer",
        stroke: isSelected ? "#000000" : "none",
        strokeWidth: isSelected ? 2 : 0,
        filter: isSelected ? "brightness(1.2) drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))" : "none",
        transition: "all 0.2s ease",
      }
    },
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

  // Enhance the handlePathSelect function to provide better visual feedback
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

    // Add visual feedback for selection
    document.querySelectorAll(".path-element").forEach((el) => {
      el.classList.remove("path-highlight-select")
    })

    // Add highlight to the selected path and related paths
    setTimeout(() => {
      document.getElementById(pathId)?.classList.add("path-highlight-select")
      related.forEach((relatedId) => {
        if (relatedId !== pathId) {
          document.getElementById(relatedId)?.classList.add("path-highlight-related")
        }
      })
    }, 0)

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
    <div className={`grid ${svgArray.length === 4 ? "grid-cols-2" : "grid-cols-1"} gap-1`}>
      {svgArray.map((svg, index) => (
        <div key={svg.id || `svg-${index}`} className="relative group">
          {/* Remove the rotation indicator */}

          {/* SVG Element */}
          <svg
            width={svg.width || "100px"}
            height={svg.height || "100px"}
            viewBox={svg.viewBox || "0 0 100 100"}
            className="border border-gray-300 rounded-lg shadow-md p-2 w-full h-full svg-container"
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
                  className={`path-element ${selectedPathId === path.id || relatedPaths.includes(path.id) ? "path-selected" : ""}`}
                  data-path-id={path.id}
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

      {/* Update the style tag at the bottom */}
      <style jsx global>{`
        .path-element {
          transition: all 0.2s ease;
        }
        .path-element:hover {
          filter: brightness(1.1) drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3));
          stroke: #000000;
          stroke-width: 1px;
          z-index: 10;
        }
        .path-selected, .path-highlight-select {
          stroke: #000000;
          stroke-width: 2px;
          filter: brightness(1.2) drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.5));
          z-index: 20;
        }
        .path-highlight-related {
          stroke: #000000;
          stroke-width: 1px;
          filter: brightness(1.1) drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3));
          z-index: 15;
        }
      `}</style>
    </div>
  )
}
