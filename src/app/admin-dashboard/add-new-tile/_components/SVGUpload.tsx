"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, FileImage } from "lucide-react"

interface SVGUploadProps {
  onUpload: (data: string) => void
}

const SVGUpload = ({ onUpload }: SVGUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        if (file.size > 500000) { // Example limit of 500 KB
          alert("File size exceeds 500 KB. Please upload a smaller SVG file.");
          return;
        }
  
        setFileName(file.name)
        setUploadStatus("idle")
  
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            try {
              const svgData = event.target.result as string
  
              // Comprehensive SVG validation
              if (!svgData.includes("<svg") || !svgData.includes("</svg>")) {
                throw new Error("Not a valid SVG file")
              }
  
              setPreview(svgData)
              setUploadStatus("success")
  
              if (typeof onUpload === "function") {
                onUpload(svgData)
              } else {
                console.error("onUpload is not a function", onUpload)
                setUploadStatus("error")
              }
            } catch (error) {
              console.error("Error processing SVG:", error)
              setUploadStatus("error")
            }
          }
        }
  
        reader.onerror = () => {
          setUploadStatus("error")
        }
  
        reader.readAsText(file)
      }
    },
    [onUpload],
  )
  
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/svg+xml": [".svg"] },
    onDrop,
    maxFiles: 1,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    setFileName(null)
    setUploadStatus("idle")
    onUpload("")
  }

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : uploadStatus === "error"
            ? "border-red-500 bg-red-50"
            : uploadStatus === "success" && preview
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
      }`}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-xs mx-auto mb-4">
            {/* SVG Preview Container with fixed aspect ratio */}
            <div className="relative w-full pt-[100%] bg-white rounded-md shadow-sm overflow-hidden">
              {/* SVG Content positioned absolutely to fill container */}
              <div
                className="absolute inset-0 flex items-center justify-center p-4"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>

            {/* Status indicator */}
            <div className="absolute top-2 right-2">
              {uploadStatus === "success" ? (
                <div className="bg-green-500 text-white p-1 rounded-full">
                  {/* <Check size={16} /> */}
                </div>
              ) : uploadStatus === "error" ? (
                <div className="bg-red-500 text-white p-1 rounded-full">
                  <X size={16} />
                </div>
              ) : null}
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* File name */}
          {fileName && (
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <FileImage size={16} className="mr-2" />
              <span className="truncate max-w-[200px]">{fileName}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-4 ${isDragActive ? "bg-primary/10" : "bg-gray-100"}`}>
            <UploadCloud className={`h-10 w-10 ${isDragActive ? "text-primary" : "text-gray-500"}`} />
          </div>

          <h3 className="text-lg font-medium text-gray-700 mb-1">{isDragActive ? "Drop SVG here" : "Upload SVG"}</h3>

          <p className="text-sm text-gray-500 mb-4">Drag and drop your SVG file here, or click to browse</p>

          <button
            type="button"
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
          >
            Select SVG
          </button>

          <p className="text-xs text-gray-400 mt-4">Only SVG files are accepted</p>
        </div>
      )}
    </div>
  )
}

export default SVGUpload

