"use client"
import { useState, useCallback, useRef } from "react"
import { FileUploader } from "react-drag-drop-files"
import Image from "next/image"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
interface SVGUploadProps {
  onUpload: (file: File | null, svgPath?: string) => void
  maxSizeKB: number
  initialImage?: string
}
const SVGUpload = ({ onUpload, maxSizeKB, initialImage }: SVGUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  console.log(file)
  const extractSVGPath = async (file: File): Promise<string> => {
    try {
      const svgText = await file.text()
      // Log the full SVG content without truncation
      console.log("Full SVG Content (without truncation):")
      console.log(svgText)
      console.log("SVG Content Length:", svgText.length, "characters")
      // Return the full SVG content
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
        // Extract SVG path
        const svgPath = await extractSVGPath(file)
        setFile(file)
        onUpload(file, svgPath)
        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }catch {
        console.error("Error extracting SVG path")
        return ""
      }
    },
    [maxSizeKB, onUpload],
  )
  const handleRemove = useCallback(() => {
    setFile(null)
    setPreviewUrl(null)
    onUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onUpload])
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-[300px] border-2 border-dashed border-[#B0B0B0] rounded-[8px] relative bg-gray-50">
        {previewUrl ? (
          <>
            <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain p-4" />
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