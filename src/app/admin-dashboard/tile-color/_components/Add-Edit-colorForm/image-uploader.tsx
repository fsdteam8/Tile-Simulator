"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"
import { generateFullUrl } from "@/lib/generateFullUrl"

interface ImageUploaderProps {
  selectedImage: string | null
  onImageChange: (image: string | null) => void
  previousImage: string | null
}

export function ImageUploader({ selectedImage, onImageChange, previousImage }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(selectedImage)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Just use the filename instead of the full image data
      const filename = file.name
      console.log("Selected image filename:", filename)

      // Create a temporary preview URL for the UI
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      // Send only the filename to the parent component
      onImageChange(filename)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      // Just use the filename instead of the full image data
      const filename = file.name
      console.log("Selected image filename (drop):", filename)

      // Create a temporary preview URL for the UI
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      // Send only the filename to the parent component
      onImageChange(filename)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  // Function to determine if a string is a URL or base64 image
  const isImageUrl = (str: string): boolean => {
    return str.startsWith("http") || str.startsWith("data:image/") || str.startsWith("blob:")
  }

  // Function to get display URL for preview
  const getDisplayUrl = (image: string | null): string => {
    if (!image) return "/placeholder.svg"

    // If it's already a URL or base64, use it for preview
    if (isImageUrl(image)) {
      return image
    }

    // If it's just a filename and we have a preview URL, use the preview
    if (previewUrl && isImageUrl(previewUrl)) {
      return previewUrl
    }

    // Otherwise, it's probably a filename from the server, so generate a full URL
    return generateFullUrl(image) || "/placeholder.svg"
  }

  return (
    <div>
      <div
        className="border-2 border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center h-[150px] cursor-pointer"
        onClick={handleImageClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedImage ? (
          <div className="flex flex-col items-center gap-2">
            <Image
              src={getDisplayUrl(selectedImage) || "/placeholder.svg"}
              alt="Selected"
              width={100}
              height={100}
              className="object-contain"
            />
            <span className="text-xs text-gray-500">{isImageUrl(selectedImage) ? "Preview" : selectedImage}</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <ImageIcon className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-gray-500 text-sm text-center">Drag and drop image here, or click to add image</p>
          </>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      </div>

      {/* Previous image preview */}
      {previousImage && (
        <div className="flex items-center gap-2 mt-4">
          <div className="w-12 h-12 border border-gray-300 rounded-md overflow-hidden">
            <Image
              src={getDisplayUrl(previousImage) || "/placeholder.svg"}
              alt="Previous"
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-xs text-gray-500">{isImageUrl(previousImage) ? "Previous image" : previousImage}</span>
        </div>
      )}
    </div>
  )
}

