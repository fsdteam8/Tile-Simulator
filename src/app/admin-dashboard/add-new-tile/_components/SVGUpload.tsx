"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { FileUploader } from "react-drag-drop-files"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SVGUploadProps {
  onUpload: (file: File | null, svgPath?: string) => void
  maxSizeKB: number
  initialImage?: string
  initialSvgBase64?: string
}

const SVGUpload = ({ onUpload, maxSizeKB, initialImage, initialSvgBase64 }: SVGUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null)
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  console.log(file)
  // Debug logs
  useEffect(() => {
    console.log("SVG Component Initialized with:", {
      initialImage: initialImage?.substring(0, 50),
      initialSvgBase64: initialSvgBase64?.substring(0, 50),
    })
  }, [initialImage, initialSvgBase64])

  // Process initialSvgBase64 if provided
  useEffect(() => {
    if (initialSvgBase64) {
      try {
        // Decode the base64 SVG
        const decodedSvg = decodeURIComponent(escape(atob(initialSvgBase64)))
        setSvgContent(decodedSvg)
      } catch (error) {
        console.error("Error decoding SVG base64:", error)
      }
    }
  }, [initialSvgBase64])

  // Process initialImage if it's an SVG URL
  useEffect(() => {
    if (initialImage && initialImage.toLowerCase().endsWith(".svg")) {
      fetch(initialImage)
        .then((response) => response.text())
        .then((svgText) => {
          setSvgContent(svgText)
        })
        .catch((error) => {
          console.error("Error fetching SVG:", error)
        })
    }
  }, [initialImage])

  const extractSVGPath = async (file: File): Promise<string> => {
    try {
      const svgText = await file.text()
      return svgText
    } catch (error) {
      console.error("Error extracting SVG path:", error)
      return ""
    }
  }

  const handleChange = useCallback(
    async (file: File) => {
      if (file.size > maxSizeKB * 1024) {
        alert(`File size should be less than ${maxSizeKB}KB`)
        return
      }

      try {
        const fileText = await file.text()
        // Basic SVG validation
        if (!fileText.includes("<svg") || !fileText.includes("</svg>")) {
          alert("Please upload a valid SVG file")
          return
        }

        // Extract SVG path and set content for direct rendering
        const svgPath = await extractSVGPath(file)
        setSvgContent(svgPath)
        setFile(file)
        onUpload(file, svgPath)

        // Create preview URL as fallback
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("Error processing SVG file:", error)
        alert("Error processing SVG file. Please try another file.")
      }
    },
    [maxSizeKB, onUpload],
  )

  const handleRemove = useCallback(() => {
    setFile(null)
    setPreviewUrl(null)
    setSvgContent(null)
    onUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onUpload])

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed border-[#B0B0B0] rounded-[8px] relative bg-gray-50">
        {svgContent ? (
          <>
          
            {/* Direct SVG rendering for better compatibility */}
            <div className="w-full h-[300px] flex items-center justify-center p-4">
          <div 
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-white hover:bg-gray-100"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : previewUrl ? (
          <>
            {/* Fallback to img tag instead of Next.js Image for better SVG support */}
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="SVG Preview"
              width={300}
              height={300}
              className="max-w-full h-[200px] border border-red-600 object-contain p-4"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-white hover:bg-gray-100"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <FileUploader handleChange={handleChange} name="file" types={["SVG"]} maxSize={maxSizeKB} minSize={0}>
            <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Drag and drop SVG here</p>
                <p className="text-sm text-gray-500">or</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="bg-primary text-white border-primary hover:bg-primary/10"
              >
                Add SVG
              </Button>
            </div>
          </FileUploader>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept=".svg"
        onChange={(e) => e.target.files?.[0] && handleChange(e.target.files[0])}
        className="hidden"
      />
    </div>
  )
}

export default SVGUpload
