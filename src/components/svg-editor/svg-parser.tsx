import type { SvgData, PathData } from "./types"

/**
 * Parses an SVG string into an SvgData object
 * @param svgString The SVG string to parse
 * @param svgId Optional ID to assign to the parsed SVG
 * @returns An SvgData object containing the parsed SVG information
 */
export function parseSvgString(svgString: string, svgId: string): SvgData {
  try {
    // Ensure the SVG string is complete and valid
    if (!svgString || typeof svgString !== "string") {
      console.error("Invalid SVG string provided:", svgString)
      return createEmptySvgData(svgId)
    }

    // Check if the string actually contains an SVG
    if (!svgString.includes("<svg")) {
      console.error("String does not contain SVG markup:", svgString.substring(0, 100) + "...")
      return createEmptySvgData(svgId)
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(svgString, "image/svg+xml")

    // Check for parsing errors
    const parserError = doc.querySelector("parsererror")
    if (parserError) {
      console.error("SVG parsing error:", parserError.textContent)
      return createEmptySvgData(svgId)
    }

    const svgElement = doc.querySelector("svg")
    if (!svgElement) {
      console.error("No SVG element found in the provided string")
      return createEmptySvgData(svgId)
    }

    // Extract all paths
    const pathElements = svgElement.querySelectorAll("path")
    const paths: PathData[] = []

    // If no paths found, create a default rectangle path
    if (pathElements.length === 0) {
      paths.push({
        id: `${svgId}-default-path`,
        d: "M10,10 L90,10 L90,90 L10,90 Z", // Simple rectangle
        fill: "#cccccc",
        originalFill: "#cccccc",
      })
    } else {
      pathElements.forEach((pathElement, index) => {
        const d = pathElement.getAttribute("d")
        if (!d) return // Skip paths without d attribute

        // Get fill from various sources
        let fill = pathElement.getAttribute("fill") || "#000000"

        // Try to get fill from inline style
        if (pathElement.hasAttribute("style")) {
          const styleAttr = pathElement.getAttribute("style") || ""
          const fillMatch = styleAttr.match(/fill:\s*([^;]+)/)
          if (fillMatch && fillMatch[1]) {
            fill = fillMatch[1].trim()
          }
        }

        // Try to extract fill from class-based styles
        const className = pathElement.getAttribute("class")
        if (className) {
          const styleElements = doc.querySelectorAll("style")
          styleElements.forEach((styleEl) => {
            const styleText = styleEl.textContent || ""
            // Safely extract class-based fill
            try {
              const classRegex = new RegExp(`\\.${className.split(" ")[0]}\\s*{[^}]*fill:\\s*([^;\\s}]+)`, "i")
              const match = styleText.match(classRegex)
              if (match && match[1]) {
                fill = match[1]
              }
            } catch (e) {
              console.warn("Error parsing class styles:", e)
            }
          })
        }

        paths.push({
          id: pathElement.id || `path-${svgId}-${index}`,
          d,
          fill,
          originalFill: fill,
        })
      })
    }

    return {
      id: svgId,
      width: svgElement.getAttribute("width") || "100%",
      height: svgElement.getAttribute("height") || "100%",
      viewBox: svgElement.getAttribute("viewBox") || "0 0 100 100",
      paths,
    }
  } catch (error) {
    console.error("Error parsing SVG:", error)
    return createEmptySvgData(svgId)
  }
}

/**
 * Creates an empty SvgData object for fallback
 */
function createEmptySvgData(id: string): SvgData {
  return {
    id,
    width: "100%",
    height: "100%",
    viewBox: "0 0 100 100",
    paths: [
      {
        id: `${id}-error-rect`,
        d: "M10,10 L90,10 L90,90 L10,90 Z", // Simple rectangle
        fill: "#f0f0f0",
        originalFill: "#f0f0f0",
      },
      {
        id: `${id}-error-x1`,
        d: "M20,20 L80,80", // X mark (part 1)
        fill: "none",
        originalFill: "none",
      },
      {
        id: `${id}-error-x2`,
        d: "M80,20 L20,80", // X mark (part 2)
        fill: "none",
        originalFill: "none",
      },
    ],
  }
}

/**
 * Converts an SvgData object back to an SVG string
 * @param svgData The SvgData object to convert
 * @returns An SVG string representation of the SvgData
 */
export function svgDataToString(svgData: SvgData): string {
  const pathsString = svgData.paths
    .map((path) => `<path id="${path.id}" d="${path.d}" fill="${path.fill || path.originalFill || "#000000"}" />`)
    .join("")

  return `<svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="${svgData.viewBox || "0 0 100 100"}"
    width="${svgData.width || "100%"}"
    height="${svgData.height || "100%"}"
    id="${svgData.id}"
  >
    ${pathsString}
  </svg>`
}
