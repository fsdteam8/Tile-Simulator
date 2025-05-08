import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Decodes a base64 encoded SVG string
 * @param svgBase64 Base64 encoded SVG string
 * @returns Decoded SVG string or null if invalid
 */
export function decodeSvgFromBase64(svgBase64: string): string | null {
  if (!svgBase64) return null

  try {
    return decodeURIComponent(escape(atob(svgBase64)))
  } catch (error) {
    console.error("Error decoding SVG:", error)
    return null
  }
}

/**
 * Encodes an SVG string to base64
 * @param svgString Raw SVG string
 * @returns Base64 encoded SVG string
 */
export function encodeSvgToBase64(svgString: string): string {
  if (!svgString) return ""

  try {
    return btoa(unescape(encodeURIComponent(svgString)))
  } catch (error) {
    console.error("Error encoding SVG:", error)
    return ""
  }
}