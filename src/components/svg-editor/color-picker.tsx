"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  recentColors?: string[];
}

// Define named colors for the dropdown
const namedColors = [
  { name: "Green C", color: "#4CAF50" },
  { name: "Green B", color: "#8BC34A" },
  { name: "Red221", color: "#FF5252" },
  { name: "232b", color: "#232B2B" },
  { name: "Blue Sky", color: "#03A9F4" },
  { name: "Purple", color: "#9C27B0" },
  { name: "Orange", color: "#FF9800" },
  { name: "Yellow", color: "#FFEB3B" },
  { name: "232b", color: "#232B2B" },
  { name: "Blue Sky", color: "#03A9F4" },
  { name: "Purple", color: "#9C27B0" },
  { name: "Orange", color: "#FF9800" },
  { name: "Yellow", color: "#FFEB3B" },
];

export function ColorPicker({
  color,
  onChange,
  recentColors = [],
}: ColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hexValue, setHexValue] = useState(color || "#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [savedColors, setSavedColors] = useState<string[]>([]);

  const paletteRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedColorName, setSelectedColorName] = useState("Select Color");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close color picker and dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update the color picker when the color prop changes
  useEffect(() => {
    if (color && color !== hexValue) {
      setHexValue(color);
      const rgb = hexToRgb(color);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
      }

      // Find if the color matches any named color
      const matchedColor = namedColors.find(
        (c) => c.color.toLowerCase() === color.toLowerCase()
      );
      if (matchedColor) {
        setSelectedColorName(matchedColor.name);
      } else {
        setSelectedColorName(color);
      }
    }
  }, [color, hexValue]);

  // Update saved colors when recentColors changes
  useEffect(() => {
    if (recentColors && recentColors.length > 0) {
      // Filter out duplicates and keep only unique colors
      const uniqueColors = Array.from(new Set(recentColors));
      setSavedColors(uniqueColors.slice(0, 5)); // Keep only the 5 most recent colors
    }
  }, [recentColors]);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  // Handle palette click
  const handlePaletteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!paletteRef.current) return;

    const rect = paletteRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setSaturation(Math.round(x * 100));
    setLightness(Math.round((1 - y) * 100));

    updateColor(hue, Math.round(x * 100), Math.round((1 - y) * 100));
  };

  // Handle hue slider click
  const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newHue = Math.round(x * 360);

    setHue(newHue);
    updateColor(newHue, saturation, lightness);
  };

  // Handle saturation slider click
  const handleSaturationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!saturationRef.current) return;

    const rect = saturationRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newSaturation = Math.round(x * 100);

    setSaturation(newSaturation);
    updateColor(hue, newSaturation, lightness);
  };

  // Update the color based on HSL values
  const updateColor = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexValue(hex);
    setSelectedColorName(hex);
    onChange(hex);
  };

  // Handle named color selection
  const handleNamedColorSelect = (name: string, colorValue: string) => {
    setHexValue(colorValue);
    setSelectedColorName(name);
    onChange(colorValue);
    setShowDropdown(false);

    // Update HSL values based on the selected color
    const rgb = hexToRgb(colorValue);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
  };

  // Get the background gradient for the palette
  const getPaletteBackground = () => {
    return `linear-gradient(to top, #000, transparent), 
            linear-gradient(to right, #fff, transparent), 
            hsl(${hue}, 100%, 50%)`;
  };

  // Get RGB values
  const getRgbValues = () => {
    const rgb = hexToRgb(hexValue);
    return rgb ? [rgb.r, rgb.g, rgb.b] : [0, 0, 0];
  };

  const [r, g, b] = getRgbValues();

  return (
    <div className="w-full">
      {!showColorPicker ? (
        <div className="flex gap-8">
          {/* Pen tool button */}
          <div
            className="flex items-start gap-4 w-[200px] p-4 rounded-lg"
            style={{ boxShadow: "0px 0px 8px 0px #00000029" }}
          >
            <button
              className="w-7 h-7 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
              onClick={() => setShowColorPicker(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            </button>

            <div className="flex-1">
              {/* Hue slider */}
              <div
                className="w-full h-2 rounded-md cursor-pointer relative mb-2"
                style={{
                  background:
                    "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                }}
                onClick={handleHueClick}
              >
                <div
                  className="w-4 h-4 bg-white rounded-full absolute -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none border border-gray-300"
                  style={{ left: `${(hue / 360) * 100}%` }}
                />
              </div>

              {/* Saturation slider */}
              <div
                className="w-full h-2 rounded-md cursor-pointer relative bg-gradient-to-r from-gray-300 to-green-500"
                onClick={handleSaturationClick}
              >
                <div
                  className="w-4 h-4 bg-white rounded-full absolute -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none border border-gray-300"
                  style={{ left: `${saturation}%` }}
                />
              </div>
            </div>
          </div>

          {/* My Pantone Colors */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">My Pantone Colors</h3>
            <div className="flex gap-2">
              {[...new Set([...savedColors, ...recentColors])]
                .slice(0, 5)
                .map((savedColor, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-md border border-gray-300 ${
                      savedColor === hexValue ? "ring-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: savedColor }}
                    onClick={() => {
                      setHexValue(savedColor);
                      const rgb = hexToRgb(savedColor);
                      if (rgb) {
                        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                        setHue(hsl.h);
                        setSaturation(hsl.s);
                        setLightness(hsl.l);
                        onChange(savedColor);
                      }
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className=" bg-white overflow-hidden absolute z-50 shadow-lg rounded-lg border ">
          <div className="w-full flex items-center justify-end pr-2 pt-2">
            <X
              onClick={() => setShowColorPicker(false)}
              className="w-7 h-7 text-white bg-red-500 p-1 rounded cursor-pointer"
            />
          </div>
          {/* Color gradient square */}

          <div className="flex gap-2 p-2">

          <div className="p-2 rounded " style={{ boxShadow: "0px 0px 8px 0px #00000029" }}>
            <div
              ref={paletteRef}
              className="w-full h-64 cursor-crosshair relative"
              style={{ background: getPaletteBackground() }}
              onClick={handlePaletteClick}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                }}
              />
            </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  {/* Pen tool button */}
                  <button
                    className="w-10 h-10 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
                    onClick={() => setShowColorPicker(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                      <path d="M2 2l7.586 7.586"></path>
                      <circle cx="11" cy="11" r="2"></circle>
                    </svg>
                  </button>

                  <div className="flex-1">
                    {/* Hue slider */}
                    <div
                      ref={hueRef}
                      className="w-full h-4 rounded-md cursor-pointer relative mb-2"
                      style={{
                        background:
                          "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                      }}
                      onClick={handleHueClick}
                    >
                      <div
                        className="w-4 h-4 bg-white rounded-full absolute -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none border border-gray-300"
                        style={{ left: `${(hue / 360) * 100}%` }}
                      />
                    </div>

                    {/* Saturation slider */}
                    <div
                      ref={saturationRef}
                      className="w-full h-4 rounded-md cursor-pointer relative bg-gradient-to-r from-gray-300 to-green-500"
                      onClick={handleSaturationClick}
                    >
                      <div
                        className="w-4 h-4 bg-white rounded-full absolute -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none border border-gray-300"
                        style={{ left: `${saturation}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Color values */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">HEX</div>
                    <div className="font-mono text-sm">{hexValue}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">R</div>
                    <div className="font-mono text-sm">{r}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">G</div>
                    <div className="font-mono text-sm">{g}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">B</div>
                    <div className="font-mono text-sm">{b}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div ref={dropdownRef} className="relative w-[200px]">
                <button
                  className="flex items-center justify-between w-full px-4 py-2 text-left border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-sm border border-gray-300"
                      style={{ backgroundColor: hexValue }}
                    ></div>
                    <span className="text-[18px] font-medium">
                      {selectedColorName}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md max-h-[348px] shadow-lg overflow-auto">
                    {namedColors.map((namedColor, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 cursor-pointer"
                        onClick={() =>
                          handleNamedColorSelect(
                            namedColor.name,
                            namedColor.color
                          )
                        }
                      >
                        <div
                          className="w-4 h-4 rounded-sm border border-gray-300"
                          style={{ backgroundColor: namedColor.color }}
                        ></div>
                        <span className="text-[18px] font-medium">
                          {namedColor.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
      )}
    </div>
  );
}
