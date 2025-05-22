"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TileSelection } from "@/components/tile-selection";
import { parseSvgString } from "@/components/svg-editor/svg-parser";
import type { SvgData } from "@/components/svg-editor/types";
import TileSimulator from "@/components/tile-simulator/page";
import type { Tile } from "@/components/types/tiles";
import Image from "next/image";
import dynamic from "next/dynamic";
const ViewPanel = dynamic(() => import("@/components/view-panel"), {
  ssr: false,
});
const ColorEditor = dynamic(() => import("@/components/svg-editor/color-editor"), {
  ssr: false,
});

export default function Tiles() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [currentSvg, setCurrentSvg] = useState<SvgData[] | null>(null);
  const [showBorders, setShowBorders] = useState<boolean>(false);
  const [pathColors, setPathColors] = useState<Record<string, string>>({});
  const [tileRotations, setTileRotations] = useState<Record<string, number[]>>({});
  const [groutColor, setGroutColor] = useState<"orange" | "green" | "turquoise" | "blue">("orange");
  const [groutThickness, setGroutThickness] = useState<"none" | "thin" | "thick">("thin");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Derived state based on selectedTile
  const currentTileRotations = selectedTile ? tileRotations[selectedTile.id] : undefined;
  const tileId = selectedTile?.id.toString() ?? "";

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoading(false);
          return 100;
        }
        return prev + (prev < 80 ? 10 : 2); // Slow down near completion
      });
    }, 150);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedTile) {
      setIsLoading(true);
      if (selectedTile.svg.length > 0) {
        const parsedSvgs = selectedTile.svg.map((svgString, index) =>
          parseSvgString(svgString, `${selectedTile.id}-${index}`)
        );
        setCurrentSvg(parsedSvgs);
        
        if (!tileRotations[selectedTile.id]) {
          const initialRotations = selectedTile.svg.map((_, index) => {
            switch (index) {
              case 0: return 0;
              case 1: return 90;
              case 2: return 270;
              case 3: return 180;
              default: return 0;
            }
          });
          setTileRotations(prev => ({
            ...prev,
            [selectedTile.id]: initialRotations,
          }));
        }
      } else {
        setCurrentSvg(null);
      }
      setIsLoading(false);
    } else {
      setCurrentSvg(null);
    }
  }, [selectedTile, tileRotations]);

  const setGroutColorWrapper = (color: string) => {
    if (["orange", "green", "turquoise", "blue"].includes(color)) {
      setGroutColor(color as "orange" | "green" | "turquoise" | "blue");
    }
  };

  const setGroutThicknessWrapper = (thickness: string) => {
    if (["none", "thin", "thick"].includes(thickness)) {
      setGroutThickness(thickness as "none" | "thin" | "thick");
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddBorder = () => {
    setShowBorders(!showBorders);
  };

  const handleTileSelect = (tile: Tile) => {
    if (selectedTile?.id === tile.id) return;
    setSelectedTile(tile);
  };

  const handleColorSelect = (
    pathId: string,
    color: { id: string; color: string; name: string }
  ) => {
    setPathColors(prev => ({
      ...prev,
      [pathId]: color.color,
    }));
  };

  const handleRotation = (
    tileId: string,
    index: number,
    newRotation: number
  ) => {
    setTileRotations(prev => {
      const currentRotations = [
        ...(prev[tileId] || Array(selectedTile?.svg.length || 0).fill(0)),
      ];
      currentRotations[index] = newRotation % 360;
      return {
        ...prev,
        [tileId]: currentRotations,
      };
    });
  };

  return (
    <div className="relative">
      {isLoading && (
        <>
          {/* Blurred background overlay */}
          <motion.div
            className="fixed inset-0 bg-black/10 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Loading content */}
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-32 h-32">
                <Image 
                  src="/assets/logo.png" // Replace with your logo path
                  alt="Loading"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                Loading Your Tiles
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-64"
            >
              <div className="h-2 bg-black rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-center text-gray-600 mt-2 text-sm">
                {progress}% loaded
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-xs text-gray-500 mt-4"
            >
              Preparing your design experience...
            </motion.p>
          </div>
        </>
      )}

      {!isLoading && (
        <>
          <TileSimulator
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onAddBorder={handleAddBorder}
          />

          <div className="max-w-[1235px] mx-auto">
            <TileSelection
              onTileSelect={handleTileSelect}
              selectedTile={selectedTile}
              onRotate={handleRotation}
              tileRotations={tileRotations}
              pathColors={pathColors}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </div>

          {selectedTile && currentSvg && (
            <>
              <div className="container py-[30px] md:py-[40px] lg:py-[50px] xl:py-[40px] 2xl:py-[100px]">
                <ColorEditor
                  svgArray={currentSvg}
                  showBorders={showBorders}
                  setShowBorders={setShowBorders}
                  onColorSelect={handleColorSelect}
                  onRotate={handleRotation}
                  tileId={tileId}
                  rotations={currentTileRotations}
                  groutThickness={groutThickness}
                  setGroutThickness={setGroutThicknessWrapper}
                  groutColor={groutColor}
                  setGroutColor={setGroutColorWrapper}
                />
              </div>

              <div className="container">
                <ViewPanel
                  currentSvg={currentSvg}
                  pathColors={pathColors}
                  showBorders={showBorders}
                  rotations={currentTileRotations}
                  selectedTile={selectedTile}
                  groutThickness={groutThickness}
                  setGroutThickness={setGroutThicknessWrapper}
                  groutColor={groutColor}
                  setGroutColor={setGroutColorWrapper}
                />
              </div>
            </>
          )}

          {!selectedTile && (
            <div className="flex items-center justify-center h-64">
              <p className="text-lg text-gray-500">
                Please select a tile to begin editing
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}