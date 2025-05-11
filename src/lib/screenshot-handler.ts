"use client"

import html2canvas from "html2canvas"

/**
 * Takes a screenshot of the viewport area containing the specified element
 * @param elementId - The ID of the element to focus on (will capture its visible area)
 * @param fileName - The name of the file to save (without extension)
 * @returns Promise that resolves when the screenshot is taken and download is initiated
 */
export async function captureViewportScreenshot(elementId: string, fileName = "tile-screenshot"): Promise<boolean> {
  try {
    console.log(`Starting viewport screenshot for element: ${elementId}`)

    // Find the element to focus on
    const element = document.getElementById(elementId)

    if (!element) {
      console.error(`Element with ID "${elementId}" not found in the DOM`)
      return false
    }

    // Get the element's position relative to the viewport
    const rect = element.getBoundingClientRect()

    console.log(`Element position: top=${rect.top}, left=${rect.left}, width=${rect.width}, height=${rect.height}`)

    // If the element is not visible or has zero dimensions, capture the whole viewport
    if (
      rect.width === 0 ||
      rect.height === 0 ||
      rect.top < 0 ||
      rect.left < 0 ||
      rect.bottom > window.innerHeight ||
      rect.right > window.innerWidth
    ) {
      console.log("Element not fully visible in viewport, capturing entire visible area")
    }

    // Use html2canvas to capture the entire document body
    console.log("Initializing html2canvas for viewport capture...")
    const canvas = await html2canvas(document.body, {
      // Improve quality with these options
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      allowTaint: true, // Allow tainted canvas
      backgroundColor: null, // Transparent background
      logging: true, // Enable logging for debugging
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    })

    console.log(`Canvas created, dimensions: ${canvas.width}x${canvas.height}`)

    // Convert canvas to blob
    return new Promise((resolve) => {
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Failed to create blob from canvas")
            resolve(false)
            return
          }

          console.log(`Blob created, size: ${blob.size} bytes`)

          // Create a download link
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `${fileName}.png`

          // Trigger download
          document.body.appendChild(link)
          console.log("Download link created and appended to body")
          link.click()
          console.log("Download link clicked")

          // Clean up
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            console.log("Cleanup completed")
          }, 100)

          console.log(`Screenshot saved as ${fileName}.png`)
          resolve(true)
        }, "image/png")
      } catch (blobError) {
        console.error("Error creating blob:", blobError)
        resolve(false)
      }
    })
  } catch (error) {
    console.error("Error capturing viewport screenshot:", error)
    return false
  }
}

/**
 * Takes a screenshot of what's currently visible in the browser viewport
 * @param fileName - The name of the file to save (without extension)
 * @returns Promise that resolves when the screenshot is taken and download is initiated
 */
export async function captureVisibleArea(fileName = "viewport-screenshot"): Promise<boolean> {
  try {
    console.log("Starting visible area screenshot capture")

    // Use html2canvas to capture the visible area
    const canvas = await html2canvas(document.documentElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      allowTaint: true, // Allow tainted canvas
      backgroundColor: null, // Transparent background
      logging: true, // Enable logging for debugging
      width: window.innerWidth,
      height: window.innerHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      x: window.scrollX,
      y: window.scrollY,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    })

    console.log(`Canvas created, dimensions: ${canvas.width}x${canvas.height}`)

    // Convert canvas to blob
    return new Promise((resolve) => {
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Failed to create blob from canvas")
            resolve(false)
            return
          }

          // Create a download link
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `${fileName}.png`

          // Trigger download
          document.body.appendChild(link)
          link.click()

          // Clean upnpm 
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }, 100)

          console.log(`Viewport screenshot saved as ${fileName}.png`)
          resolve(true)
        }, "image/png")
      } catch (blobError) {
        console.error("Error creating blob:", blobError)
        resolve(false)
      }
    })
  } catch (error) {
    console.error("Error capturing visible area screenshot:", error)
    return false
  }
}
