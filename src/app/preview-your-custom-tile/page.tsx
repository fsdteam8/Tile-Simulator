"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Clock4, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import type { PathData, SvgData } from "@/components/svg-editor/types"
import { PiShareFatBold } from "react-icons/pi"
import { SubmissionForm } from "@/components/tile-simulator/_components/SubmissionForm"
import type { Tile } from "@/components/types/tiles"
import { toast } from "react-toastify"

interface TileData {
  svgData: SvgData[]
  rotations: number[]
  groutThickness: string
  groutColor: string
  pathColors: Record<string, string>
  showBorders: boolean
  selectedTile: Tile
}

export default function PreviewYourCustomTile() {
  const [tileData, setTileData] = useState<{
    svgData: SvgData[] | null
    pathColors: Record<string, string>
    showBorders: boolean
    rotations: number[]
    groutColor: string
    groutThickness: string
    gridSize: string
    environment: string
    selectedTile: Tile
  } | null>(null)

  const [email, setEmail] = useState("")
  const tileGridRef = useRef<HTMLDivElement>(null)
  const patternGridRef = useRef<HTMLDivElement>(null)
  const environmentPreviewRef = useRef<HTMLDivElement>(null)
  const [svgString, setSvgString] = useState("")
  const [cloudinaryLink, setCloudinaryLink] = useState("")

  console.log("dfvrresgavrrg", cloudinaryLink)

  const [openFormModal, setOpenFormModal] = useState(false)

  // Separate loading states for different actions
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [tileTransform, setTileTransform] = useState({
    marginTop: isSmallScreen ? "18px" : "0px",
    transform: isSmallScreen ? "rotateX(0deg)" : "rotateX(0deg)",
    height: "0%",
  })

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 300)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const savedData = localStorage.getItem("tilePreviewData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setTileData(parsedData)

        setTimeout(() => {
          if (parsedData.svgData) {
            renderTileGrid(tileGridRef.current, 1, 1, parsedData)
            renderTileGrid(patternGridRef.current, 30, 8, parsedData)
            if (parsedData.environment !== "none") {
              renderTileGrid(environmentPreviewRef.current, 32, 16, parsedData)
            }
          }
        }, 100)
      } catch (error) {
        console.error("Error parsing saved tile data:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (tileData?.environment && tileData.environment !== "none") {
      setTileTransform({
        marginTop: isSmallScreen ? "18px" : "0px",
        transform: isSmallScreen ? "rotateX(65deg)" : "rotateX(71deg)",
        height: "70%",
      })
    }
  }, [tileData?.environment, isSmallScreen])

  const renderTileGrid = (container: HTMLDivElement | null, rows: number, cols: number, data: TileData) => {
    if (!container || !data.svgData || !data.svgData.length) return

    container.innerHTML = ""

    function style(i: number, j: number, tileName?: string) {
      if (tileName === "Rectangle2x8") {
        return {
          marginLeft: i % 2 !== 0 ? "37px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-2px" : "-7px",
        }
      } else if (tileName === "Rectangle4x8") {
        return {
          marginLeft: i % 2 !== 0 ? "37px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-2px" : "-7px",
        }
      } else if (tileName === "Tiffany") {
        return {
          marginLeft: i % 2 !== 0 ? "35.5px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-32px" : "-7px",
        }
      } else if (tileName === "Fiori") {
        return {
          marginLeft: i % 2 !== 0 ? "56px" : "20px",
          marginTop: i >= 1 && i <= 100 ? "-20.5px" : "-7px",
        }
      } else if (tileName === "Gio") {
        return {
          marginLeft: i % 2 !== 0 ? "36px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-30x" : "-7px",
          transform: "rotate(30deg)",
        }
      } else if (tileName === "Indie") {
        return {
          marginLeft: i % 2 !== 0 ? "36px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-35px" : "-7px",
          transform: i % 2 !== 0 ? "rotate(180deg)" : "rotate(0deg)",
        }
      } else if (tileName === "Triangle") {
        return {
          marginLeft: i % 2 !== 0 ? "38px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-35.5px" : "-7px",
          transform: i % 2 !== 0 ? "rotate(180deg)" : "rotate(0deg)",
        }
      } else if (tileName === "Lola") {
        return {
          marginLeft: i % 2 !== 0 ? "38px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-36px" : "-12px",
        }
      } else {
        return {
          marginLeft: i % 2 !== 0 ? "38px" : "0px",
          marginTop: i >= 1 && i <= 100 ? "-35px" : "-7px",
        }
      }
    }

    const useQuadPattern = data.svgData.length === 4

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement("div")
        cell.className = `tile-cell ${data.groutThickness} ${data.groutColor}-grout`

        if (useQuadPattern) {
          const innerGrid = document.createElement("div")
          innerGrid.className = "grid grid-cols-2 w-full h-full gap-[1px]"

          for (let k = 0; k < 4; k++) {
            const svgIndex = k
            const svg = data.svgData[svgIndex]
            const rotation = data.rotations[svgIndex] || 0

            const innerCell = document.createElement("div")
            innerCell.className = "relative w-full h-full"

            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            svgElement.setAttribute("viewBox", svg.viewBox || "0 0 100 100")
            svgElement.style.transform = `rotate(${rotation}deg)`

            svg.paths.forEach((path: PathData) => {
              const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
              pathElement.setAttribute("d", path.d)

              const color = data.pathColors[path.id] || path.fill || "#000000"

              if (color && color.startsWith("image:")) {
                const imagePath = color.replace("image:", "")
                const patternId = `pattern-${path.id}-${i}-${j}-${k}`

                const patternDef = document.createElementNS("http://www.w3.org/2000/svg", "pattern")
                patternDef.setAttribute("id", patternId)
                patternDef.setAttribute("patternUnits", "userSpaceOnUse")
                patternDef.setAttribute("width", "100%")
                patternDef.setAttribute("height", "100%")

                const imageEl = document.createElementNS("http://www.w3.org/2000/svg", "image")
                imageEl.setAttribute("href", `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`)
                imageEl.setAttribute("x", "0")
                imageEl.setAttribute("y", "0")
                imageEl.setAttribute("width", "100%")
                imageEl.setAttribute("height", "100%")
                imageEl.setAttribute("preserveAspectRatio", "xMidYMid slice")

                patternDef.appendChild(imageEl)

                const defs =
                  svgElement.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs")
                if (!svgElement.querySelector("defs")) {
                  svgElement.appendChild(defs)
                }
                defs.appendChild(patternDef)

                pathElement.setAttribute("fill", `url(#${patternId})`)
              } else {
                pathElement.setAttribute("fill", color)
              }

              if (data.showBorders) {
                pathElement.setAttribute("stroke", "#000000")
                pathElement.setAttribute("stroke-width", "1")
              }
              svgElement.appendChild(pathElement)
            })

            innerCell.appendChild(svgElement)
            innerGrid.appendChild(innerCell)
          }

          cell.appendChild(innerGrid)
        } else {
          const svgIndex = (i * cols + j) % data.svgData.length
          const svg = data.svgData[svgIndex]
          const rotation = data.rotations[svgIndex] || 0

          const wrapper = document.createElement("div")
          wrapper.className = "relative w-full h-full"

          const tileName = data?.selectedTile?.name
          Object.assign(wrapper.style, style(i, j, tileName))

          const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
          svgElement.setAttribute("viewBox", svg.viewBox || "0 0 100 100")
          svgElement.style.transform = `rotate(${rotation}deg)`
          svgElement.style.padding = `1px`

          svg.paths.forEach((path: PathData) => {
            const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
            pathElement.setAttribute("d", path.d)

            const color = data.pathColors[path.id] || path.fill || "#000000"

            if (color && color.startsWith("image:")) {
              const imagePath = color.replace("image:", "")
              const patternId = `pattern-${path.id}-${i}-${j}`

              const patternDef = document.createElementNS("http://www.w3.org/2000/svg", "pattern")
              patternDef.setAttribute("id", patternId)
              patternDef.setAttribute("patternUnits", "userSpaceOnUse")
              patternDef.setAttribute("width", "100%")
              patternDef.setAttribute("height", "100%")

              const imageEl = document.createElementNS("http://www.w3.org/2000/svg", "image")
              imageEl.setAttribute("href", `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`)
              imageEl.setAttribute("x", "0")
              imageEl.setAttribute("y", "0")
              imageEl.setAttribute("width", "100%")
              imageEl.setAttribute("height", "100%")
              imageEl.setAttribute("preserveAspectRatio", "xMidYMid slice")

              patternDef.appendChild(imageEl)

              const defs =
                svgElement.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs")
              if (!svgElement.querySelector("defs")) {
                svgElement.appendChild(defs)
              }
              defs.appendChild(patternDef)

              pathElement.setAttribute("fill", `url(#${patternId})`)
            } else {
              pathElement.setAttribute("fill", color)
            }

            if (data.showBorders) {
              pathElement.setAttribute("stroke", "#000000")
              pathElement.setAttribute("stroke-width", "1")
            }
            svgElement.appendChild(pathElement)
          })

          wrapper.appendChild(svgElement)
          cell.appendChild(wrapper)
        }

        container.appendChild(cell)
      }
    }
  }

  const generateSvgString = () => {
    if (!tileData || !tileData.svgData || !tileData.svgData.length) return ""

    const svg = tileData.svgData[0]
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${
      svg.viewBox || "0 0 100 100"
    }" width="500" height="500">`

    svgString += "<defs>"

    const addedPatterns = new Set()

    svg.paths.forEach((path) => {
      const color = tileData.pathColors[path.id] || path.fill || "#000000"

      if (color && color.startsWith("image:")) {
        const imagePath = color.replace("image:", "")
        const patternId = `pattern-${path.id}`

        if (!addedPatterns.has(patternId)) {
          const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`

          svgString += `
            <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="100%" height="100%">
              <image xlink:href="${imageUrl}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          `
          addedPatterns.add(patternId)
        }
      }
    })

    svgString += "</defs>"

    svg.paths.forEach((path) => {
      const color = tileData.pathColors[path.id] || path.fill || "#000000"
      let fillAttribute

      if (color && color.startsWith("image:")) {
        const patternId = `pattern-${path.id}`
        fillAttribute = `url(#${patternId})`
      } else {
        fillAttribute = color
      }

      svgString += `<path d="${path.d}" fill="${fillAttribute}" ${
        tileData.showBorders ? 'stroke="#000000" strokeWidth="1"' : ""
      }/>`
    })

    svgString += "</svg>"
    return svgString
  }

  const handleDownloadSVG = async () => {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      if (!tileData || !tileData.svgData || !tileData.svgData.length) {
        throw new Error("No tile data available")
      }

      // Add processing delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const isQuadPattern = tileData.svgData.length === 4
      const gridCategory = isQuadPattern ? "2x2" : "1x1"

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Tile Design - ${tileData?.selectedTile?.name || "Untitled"}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }
        .tile-info {
            margin-bottom: 20px;
            text-align: center;
        }
        .svg-container {
            width: ${isQuadPattern ? "500px" : "250px"};
            height: ${isQuadPattern ? "500px" : "250px"};
            border: 1px solid #ddd;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .tile-grid {
            display: grid;
            grid-template-columns: ${isQuadPattern ? "repeat(2, 1fr)" : "1fr"};
            gap: ${tileData.groutThickness === "none" ? "0px" : tileData.groutThickness === "thin" ? "1px" : "2px"};
            background-color: ${getGroutColor(tileData.groutColor)};
            width: 100%;
            height: 100%;
        }
        .tile-cell {
            position: relative;
            background-color: white;
        }
        svg {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div class="tile-info">
        <h1>${tileData?.selectedTile?.name || "Custom Tile"}</h1>
        <p>Layout: ${gridCategory} | Grout: ${tileData.groutColor} (${tileData.groutThickness})</p>
    </div>
    
    <div class="svg-container">
        <div class="tile-grid">
            ${generateTileGridHTML()}
        </div>
    </div>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `${tileData?.selectedTile?.name || "custom-tile"}-design.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Design downloaded successfully!")
    } catch (error) {
      console.error("Error downloading:", error)
      toast.error("Failed to download. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const generateTileGridHTML = () => {
    if (!tileData || !tileData.svgData) return ""

    const isQuadPattern = tileData.svgData.length === 4

    if (isQuadPattern) {
      return tileData.svgData
        .map((svg, index) => {
          const rotation = tileData.rotations[index] || 0
          return `
        <div class="tile-cell">
          ${generateSingleSVG(svg, rotation)}
        </div>
      `
        })
        .join("")
    }
    const rotation = tileData.rotations[0] || 0
    return `
    <div class="tile-cell">
      ${generateSingleSVG(tileData.svgData[0], rotation)}
    </div>
  `
  }

  const generateSingleSVG = (svg: SvgData, rotation: number) => {
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink" 
     viewBox="${svg.viewBox || "0 0 100 100"}"
     style="transform: rotate(${rotation}deg)">`

    svgString += "<defs>"
    const addedPatterns = new Set()

    svg.paths.forEach((path) => {
      const color = tileData?.pathColors[path.id] || path.fill || "#000000"
      if (color && color.startsWith("image:")) {
        const patternId = `pattern-${path.id}`
        if (!addedPatterns.has(patternId)) {
          const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${color.replace("image:", "")}`
          svgString += `
          <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="100%" height="100%">
            <image xlink:href="${imageUrl}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </pattern>`
          addedPatterns.add(patternId)
        }
      }
    })
    svgString += "</defs>"

    svg.paths.forEach((path) => {
      const color = tileData?.pathColors[path.id] || path.fill || "#000000"
      const fillAttribute = color.startsWith("image:") ? `url(#pattern-${path.id})` : color

      svgString += `<path d="${path.d}" fill="${fillAttribute}"`
      if (tileData?.showBorders) {
        svgString += ' stroke="#000000" strokeWidth="1"'
      }
      svgString += "/>"
    })

    svgString += "</svg>"
    return svgString
  }

  const getGroutColor = (colorName: string) => {
    const colors: Record<string, string> = {
      orange: "orange",
      green: "green",
      turquoise: "turquoise",
      blue: "blue",
      white: "white",
      gray: "#808080",
      black: "#000000",
    }
    return colors[colorName] || "#808080"
  }

  const handleShare = async () => {
    if (isSharing) return

    setIsSharing(true)

    try {
      if (!tileData || !tileData.svgData || !tileData.svgData.length) {
        throw new Error("No tile data available")
      }

      // Add processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const isQuadPattern = tileData.svgData.length === 4
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Tile Design - ${tileData?.selectedTile?.name || "Untitled"}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }
        .tile-info {
            margin-bottom: 20px;
            text-align: center;
        }
        .svg-container {
            width: ${isQuadPattern ? "500px" : "250px"};
            height: ${isQuadPattern ? "500px" : "250px"};
            border: 1px solid #ddd;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .tile-grid {
            display: grid;
            grid-template-columns: ${isQuadPattern ? "repeat(2, 1fr)" : "1fr"};
            gap: ${tileData.groutThickness === "none" ? "0px" : tileData.groutThickness === "thin" ? "1px" : "2px"};
            background-color: ${getGroutColor(tileData.groutColor)};
            width: 100%;
            height: 100%;
        }
        .tile-cell {
            position: relative;
            background-color: white;
        }
        svg {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    
    <div class="svg-container">
        <div class="tile-grid">
            ${generateTileGridHTML()}
        </div>
    </div>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: "text/html" })
      const htmlFile = new File([blob], `${tileData?.selectedTile?.name || "custom-tile"}-design.html`, {
        type: "text/html",
      })

      const cloudinaryUrl = await uploadHtmlToCloudinary(htmlFile)
      setCloudinaryLink(cloudinaryUrl)

      if (navigator.share) {
        await navigator.share({
          title: "My Custom Tile Design",
          text: "Check out my custom cement tile design!",
          url: cloudinaryUrl,
        })
      } else {
        await navigator.clipboard.writeText(cloudinaryUrl)
        toast.success("Design link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing design:", error)
      toast.error("Failed to share design. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  const uploadHtmlToCloudinary = async (file: File) => {
    try {
      const res = await fetch("/api/resp", {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to get upload credentials")

      const { signature, timestamp, apiKey, cloudName } = await res.json()

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey)
      formData.append("timestamp", timestamp)
      formData.append("signature", signature)
      formData.append("resource_type", "raw")
      formData.append("folder", "tile_designs")

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) throw new Error("Cloudinary upload failed")

      const result = await uploadRes.json()
      return result.secure_url
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      throw error
    }
  }

  const handleSaveEmail = async () => {
    if (isSendingEmail) return

    try {
      if (!email) {
        toast.error("Please enter your email address")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast.error("Invalid email format")
        return
      }

      setIsSendingEmail(true)

      // Add processing delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      if (!tileData || !tileData.svgData || !tileData.svgData.length) {
        throw new Error("No tile data available")
      }

      const isQuadPattern = tileData.svgData.length === 4
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Tile Design - ${tileData?.selectedTile?.name || "Untitled"}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }
        .tile-info {
            margin-bottom: 20px;
            text-align: center;
        }
        .svg-container {
            width: ${isQuadPattern ? "500px" : "250px"};
            height: ${isQuadPattern ? "500px" : "250px"};
            border: 1px solid #ddd;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .tile-grid {
            display: grid;
            grid-template-columns: ${isQuadPattern ? "repeat(2, 1fr)" : "1fr"};
            gap: ${tileData.groutThickness === "none" ? "0px" : tileData.groutThickness === "thin" ? "1px" : "2px"};
            background-color: ${getGroutColor(tileData.groutColor)};
            width: 100%;
            height: 100%;
        }
        .tile-cell {
            position: relative;
            background-color: white;
        }
        svg {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div class="svg-container">
        <div class="tile-grid">
            ${generateTileGridHTML()}
        </div>
    </div>
</body>
</html>`

      const blob = new Blob([htmlContent], { type: "text/html" })
      const htmlFile = new File([blob], `${tileData?.selectedTile?.name || "custom-tile"}-design.html`, {
        type: "text/html",
      })

      const cloudinaryUrl = await uploadHtmlToCloudinary(htmlFile)
      setCloudinaryLink(cloudinaryUrl)

      console.log("Email:", email)
      console.log("File URL:", cloudinaryUrl)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-cloud-mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          file_url: cloudinaryUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send email")
      }

      const result = await response.json()
      console.log("Email sent successfully:", result)
      toast.success("Design link sent to email!")

      setEmail("")
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Failed to send email")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleOpenFormModal = () => {
    const generatedSvgString = generateSvgString()
    if (generatedSvgString) {
      setSvgString(generatedSvgString)
    }

    if (tileData && tileData.svgData && tileData.svgData.length > 0) {
      const svg = tileData.svgData[0]

      const svgString = generateSvgString()

      if (svg.image_svg_text) {
        try {
          const decodedSvg = atob(svg.image_svg_text)
          console.log("Decoded SVG:", decodedSvg)
        } catch (error) {
          console.error("Error decoding SVG:", error)
        }
      }

      console.log("Tile Data Structure:", {
        id: svg.id || Math.floor(Math.random() * 1000),
        name: svg.name || "Custom Tile",
        description: svg.description || "Custom tile design",
        grid_category: tileData.svgData.length === 4 ? "2x2" : "1x1",
        image: null,
        image_svg_text: svg.image_svg_text || btoa(svgString),
        status: "custom",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: [
          {
            id: 3,
            name: "Pattern",
            description: "Pattern Pattern Pattern",
            status: "default",
            pivot: {
              tile_id: svg.id || Math.floor(Math.random() * 1000),
              category_id: 3,
              priority: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        ],
        colors: Object.entries(tileData.pathColors).map(([color], index) => ({
          id: index + 1,
          name: typeof color === "string" && !color.startsWith("image:") ? color : `Color ${index + 1}`,
          value: typeof color === "string" && !color.startsWith("image:") ? color : null,
          image: typeof color === "string" && color.startsWith("image:") ? color.replace("image:", "") : null,
        })),
      })
    }

    setOpenFormModal(true)
  }

  const getUniqueColors = () => {
    if (!tileData || !tileData.svgData) return []

    const colors = new Set<string>()
    const imageColors = new Set<string>()

    if (tileData.pathColors) {
      Object.values(tileData.pathColors).forEach((color) => {
        if (typeof color === "string") {
          if (color.startsWith("image:")) {
            imageColors.add(color)
          } else {
            colors.add(color)
          }
        }
      })
    }

    if (tileData.svgData) {
      tileData.svgData.forEach((svg) => {
        svg.paths.forEach((path) => {
          if (path.fill) {
            if (path.fill.startsWith("image:")) {
              imageColors.add(path.fill)
            } else {
              colors.add(path.fill)
            }
          }
        })
      })
    }

    return [...Array.from(colors), ...Array.from(imageColors)]
  }

  const uniqueColors = getUniqueColors()

  if (!tileData) {
    return <div className="p-8 text-center">Loading preview data...</div>
  }

  return (
    <div className="container mx-auto pt-6 px-4">
      <div className="md:flex lg:flex justify-between items-center mb-6 space-y-4 lg:space-y-0">
        <div className="flex justify-center lg:justify-start">
          <Link href="/" className="border border-primary text-primary leading-[120%] py-2 lg:py-4 px-12 rounded-[4px]">
            Go Back
          </Link>
        </div>

        <h1 className="text-[18px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px] font-normal text-center text-[#595959]">
          Preview Your Custom Tile
        </h1>
        <div className="flex items-center justify-center gap-[20px] 2xl:gap-[24px]">
          <button
            type="button"
            className="flex flex-col justify-center items-center gap-2 text-base font-medium text-black leading-[120%] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <>
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <PiShareFatBold className="w-6 h-6" />
                Share
              </>
            )}
          </button>
          <button
            className="flex flex-col items-center justify-center gap-[8px] text-base font-medium text-black leading-[120%] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDownloadSVG}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-6 w-6" />
                Download
              </>
            )}
          </button>
        </div>
      </div>

      <div className="shadow-[0px_0px_8px_0px_rgba(0,0,0,0.16)] rounded-[8px] p-2 ">
        <div className="flex items-center justify-between shadow-[0px_0px_8px_0px_rgba(0,0,0,0.16)] rounded-[8px] p-4 mb-6">
          <div>
            <h2 className="text-xl font-medium leading-[120%] text-black mb-2">
              Tile Name : {tileData?.selectedTile?.name}
            </h2>
            <div className="w-full flex items-center gap-3">
              <h3 className="text-xl font-medium leading-[120%] text-black">Colors:</h3>
              {uniqueColors.length > 0 ? (
                <div defaultValue={uniqueColors[0]} className="flex gap-4 flex-wrap">
                  {uniqueColors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Label htmlFor={`color-${index}`} className="flex items-center text-[#595959]">
                        {color.startsWith("image:") ? (
                          <>
                            <span className="w-4 h-4 rounded-full mr-2 bg-gray-200 overflow-hidden">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${color.replace("image:", "")}`}
                                alt="Pattern"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </span>
                            {`Pattern ${index + 1}`}
                          </>
                        ) : (
                          <>
                            <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                            {color.toUpperCase()}
                          </>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No colors available</p>
              )}
            </div>
          </div>
          <div>
            <Image src="/assets/lili_tile_logo.png" alt="Logo" width={48} height={48} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-2">
          <div className="border rounded-lg overflow-hidden ">
            <div
              ref={tileGridRef}
              className={`grid !w-auto lg:!h-[560px] items-center justify-center  ${tileData.groutColor}-grout`}
              style={{
                gridTemplateColumns: `repeat(1, 1fr)`,
                gap: tileData.groutThickness === "none" ? "0px" : tileData.groutThickness === "thin" ? "1px" : "2px",
                width: isSmallScreen ? "100%" : "562px",
                height: isSmallScreen ? "`100%" : "362px",
              }}
            />
          </div>

          <div className="overflow-hidden">
            <div
              ref={patternGridRef}
              className={`grid  ${tileData.groutColor}-grout !h-[380px] lg:!h-[580px]  !w-[620px]`}
              style={{
                gridTemplateColumns: `repeat(8, 1fr)`,
                gap: tileData.groutThickness === "none" ? "0px" : tileData.groutThickness === "thin" ? "1px" : "2px",
                width: isSmallScreen ? "100%" : "562px",
                marginTop: "-30px",
                marginLeft: "-35px",
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="w-full">
            <div className="border rounded-lg">
              {tileData.environment !== "none" ? (
                <div className="relative aspect-video">
                  {tileData.environment !== "none" ? (
                    <div className="relative aspect-video overflow-hidden">
                      <div
                        className={`absolute ${tileData.groutColor}-grout z-0 parrr`}
                        style={{
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          gridTemplateColumns: `repeat(${16}, 1fr)`,
                        }}
                      >
                        <div
                          ref={environmentPreviewRef}
                          className={`grid gap-[${
                            tileData.groutThickness === "none"
                              ? "0"
                              : tileData.groutThickness === "thin"
                                ? "1px"
                                : "2px"
                          }] bg-${tileData.groutColor}`}
                          style={{
                            gridTemplateColumns: `repeat(${
                              tileData?.selectedTile?.name === "Rectangle2x8" ? 8 : 16
                            }, 1fr)`,
                            width: "1150px",
                            marginLeft: "-50px",
                            height: tileTransform.height,
                            marginTop: tileTransform.marginTop,
                            transform: tileTransform.transform,
                          }}
                        ></div>
                      </div>
                      <Image
                        src={`/assets/${tileData.environment}.webp`}
                        alt="Environment Preview"
                        fill
                        className="object-cover z-10"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">No environment selected</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No environment selected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xl lg:text-[22px] 2xl:text-[24px] leading-[120%] font-medium text-black">
          Thank you for choosing to create a one-of-a-kind (1) custom cement tile!
        </p>
      </div>

      <div className="pt-6">
        <h2 className="text-[24px] font-medium  text-center mb-6">Custom Design Process</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/a-creative-designs3.png"
                alt="Color chips"
                width={168}
                height={140}
                className="h-[140px] w-[168px]"
              />
            </div>
            <p className="text-xl lg:text-[22px] 2xl:text-[24px] font-medium text-black leading-[120%]">
              Color chips sent to <br className="hidden md:block" /> you
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/a-creative-designs2.png"
                alt="Factory sample"
                width={140}
                height={140}
                className="h-[140px] w-[140px]"
              />
            </div>
            <p className="text-xl lg:text-[22px] 2xl:text-[24px] font-medium text-black leading-[120%]">
              Factory sample photo $15
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/a-creative-designs1.png"
                alt="Physical sample"
                width={183}
                height={140}
                className="h-[140px] w-[183px]"
              />
            </div>
            <p className="text-xl lg:text-[22px] 2xl:text-[24px] font-medium text-black leading-[120%]">
              Physical sample 4 pieces $400
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2 ">
              <Image
                src="/a-creative-designs.png"
                alt="Order"
                width={143}
                height={140}
                className="h-[140px] w-[143px]"
              />
            </div>
            <p className="text-xl lg:text-[22px] 2xl:text-[24px] font-medium text-black leading-[120%]">
              Order starts at only 10 boxes
            </p>
          </div>
        </div>
      </div>

      <div className="border-b-2 border-black pt-6" />

      <div className="mt-6 ">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-center gap-2">
            <Clock4 />
            <p className="text-lg xl:text-xl text-black leading-[120%] font-normal">Next day</p>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Clock4 />
            <p className="text-lg xl:text-xl text-black leading-[120%] font-normal">1 week</p>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Clock4 />
            <p className="text-lg xl:text-xl text-black leading-[120%] font-normal">3 weeks</p>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Clock4 />
            <p className="text-lg xl:text-xl text-black leading-[120%] font-normal">12-14 weeks</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="space-y-2 md:space-y-[10px]">
          <h1 className="text-sm sm:text-base font-medium text-black leading-[120%]">Send yourself a copy</h1>
          <div className="flex gap-4 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 sm:py-2 2xl:py-3 outline-none border border-[#5A5A5A] rounded-md placeholder:text-[#737373] placeholder:text-sm sm:placeholder:text-base placeholder:font-medium placeholder:leading-[120%]"
              disabled={isSendingEmail}
            />
            <Button
              className={`text-sm sm:text-base font-medium leading-[120%] rounded-[8px] text-white py-3 sm:py-[26px] px-6 sm:px-[46px] w-full sm:w-auto text-center flex items-center justify-center ${
                isSendingEmail ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={handleSaveEmail}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-[45px] md:pb-[60px] lg:pb-[85px] xl:pb-[100px]  2xl:pb-[115px] pt-[26px] md:pt-[32px] lg:pt-[40px] xl:pt-[48px] 2xl:pt-[56px] text-center">
        <Button
          className="px-8 w-full lg:w-[418px] h-[51px] text-[16px] font-medium leading-[120%] text-white"
          onClick={handleOpenFormModal}
        >
          Order a Sample
        </Button>
      </div>

      {openFormModal && (
        <SubmissionForm
          open={openFormModal}
          onOpenChange={setOpenFormModal}
          tileData={tileData}
          uniqueColors={uniqueColors}
          svgString={svgString}
        />
      )}

      <style jsx>{`
        .tile-cell {
          aspect-ratio: 1;
          position: relative;
        }
        .tile-cell svg {
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
        }
        .none {
          gap: 0;
        }
        .thin {
          gap: 1px;
        }
        .thick {
          gap: 2px;
        }
        .orange-grout {
          background-color: orange;
        }
        .green-grout {
          background-color: green;
        }
        .turquoise-grout {
          background-color: turquoise;
        }
        .blue-grout {
          background-color: blue;
        }
        .white-grout {
          background-color: white;
        }
      `}</style>
    </div>
  )
}
