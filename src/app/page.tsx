// "use client"

// import { useState } from "react"
// import { TileSelection } from "@/components/tile-selection"
// import { ColorEditor } from "@/components/svg-editor/color-editor"
// import { parseSvgString } from "@/components/svg-editor/svg-parser"
// import type { SvgData } from "@/components/svg-editor/types"
// import ViewPanel from "@/components/view-panel"

// interface Tile {
//   id: string
//   name: string
//   collection: string
//   svg: string[] // Array of SVG strings
// }

// export default function Page() {
//   const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
//   const [currentSvg, setCurrentSvg] = useState<SvgData[] | null>(null)
//   const [showBorders, setShowBorders] = useState<boolean>(false)
//   const [pathColors, setPathColors] = useState<Record<string, string>>({})
//   const [tileRotations, setTileRotations] = useState<Record<string, number[]>>({})

//   const handleTileSelect = (tile: Tile) => {
//     setSelectedTile(tile)

//     if (tile.svg.length > 0) {
//       const parsedSvgs = tile.svg.map((svgString, index) => parseSvgString(svgString, `${tile.id}-${index}`))
//       setCurrentSvg(parsedSvgs)

//       // Set the initial rotations immediately when a tile is selected
//       const initialRotations = tile.svg.map((_, index) => {
//         switch (index) {
//           case 0:
//             return 0 // First SVG: 0°
//           case 1:
//             return 90 // Second SVG: 90°
//           case 2:
//             return 270 // Third SVG: 270°
//           case 3:
//             return 180 // Fourth SVG: 180°
//           default:
//             return 0
//         }
//       })

//       // Always update the rotations state, even if this tile was previously selected
//       setTileRotations((prev) => ({
//         ...prev,
//         [tile.id]: initialRotations,
//       }))

//       console.log(`Applied initial rotations for ${tile.id}:`, initialRotations)
//     } else {
//       setCurrentSvg(null)
//     }
//   }

//   const handleColorSelect = (pathId: string, color: { id: string; color: string; name: string }) => {
//     setPathColors((prev) => ({
//       ...prev,
//       [pathId]: color.color,
//     }))
//   }

//   const handleRotation = (tileId: string, index: number, newRotation: number) => {
//     console.log(`[APP] Rotating tile ${tileId}, SVG ${index} to ${newRotation}°`)

//     setTileRotations((prev) => {
//       const currentRotations = [...(prev[tileId] || Array(selectedTile?.svg.length || 0).fill(0))]
//       currentRotations[index] = newRotation % 360

//       // Log the updated rotations
//       console.log(`[APP] Updated rotations for ${tileId}:`, currentRotations)

//       return {
//         ...prev,
//         [tileId]: currentRotations,
//       }
//     })
//   }

//   return (
//     <div className="flex flex-col h-screen bg-white">
//       <div className="flex-1 flex overflow-hidden">
//         <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full">
//           <div className="border-r border-gray-200 overflow-y-auto">
//             <TileSelection
//               onTileSelect={handleTileSelect}
//               selectedTile={selectedTile}
//               onRotate={handleRotation}
//               tileRotations={tileRotations}
//               pathColors={pathColors}
//             />
//           </div>

//           <div className="border-r border-gray-200 overflow-y-auto">
//             {currentSvg && currentSvg.length > 0 ? (
//               <ColorEditor
//                 svgArray={currentSvg}
//                 showBorders={showBorders}
//                 setShowBorders={setShowBorders}
//                 onColorSelect={handleColorSelect}
//                 onRotate={handleRotation}
//                 tileId={selectedTile?.id || ""}
//                 rotations={selectedTile ? tileRotations[selectedTile.id] : undefined}
//               />
//             ) : (
//               <div className="p-4 text-center text-gray-500">Select a tile to edit its colors</div>
//             )}
//           </div>

//           <div className="overflow-y-auto">
//             <ViewPanel
//               currentSvg={currentSvg}
//               pathColors={pathColors}
//               showBorders={showBorders}
//               rotations={selectedTile ? tileRotations[selectedTile.id] : undefined}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



import TileSimulator from '@/components/tile-simulator/page';
import React from 'react';

const Page = () => {
  return (
    <div>
      <TileSimulator/>
    </div>
  );
};

export default Page;