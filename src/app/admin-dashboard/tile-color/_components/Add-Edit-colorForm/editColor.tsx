"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette, ImageIcon } from "lucide-react"
import { ColorPicker } from "./color-picker"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import axios, { AxiosError } from "axios"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { ColorItem } from "../AllTilesColorData"
import { toast } from "react-toastify"

interface EditColorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  color: ColorItem | null
  onSuccess?: () => void
}

interface ApiErrorResponse {
  message?: string
  [key: string]: unknown
}

export const EditColorForm = ({
  open,
  onOpenChange,
  color,
  onSuccess,
}: EditColorFormProps) => {
  const router = useRouter()
  const session = useSession()
  const token = (session?.data?.user as { token: string })?.token

  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tabValue, setTabValue] = useState<"color" | "image">("color")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (color) {
      setName(color.name)
      setSelectedColor(color.code || "")
      setTabValue(color.code ? "color" : "image")
      
      // Set image preview based on the API response format
      if (color.image) {
        const imagePath = color.image.startsWith('uploads/') 
          ? color.image 
          : `uploads/${color.image}`
        setImagePreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${imagePath}`)
      }
    }
  }, [color])

  const handleClose = () => {
    onOpenChange(false)
    setName("")
    setSelectedColor("")
    setSelectedImage(null)
    // Revoke object URL if it exists
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setIsLoading(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // Validate file type and size (e.g., 5MB limit)
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file")
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      
      setSelectedImage(file)
      setSelectedColor("")
      
      // Create preview URL and revoke previous one if it exists
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!color?.id || !token) return

    // Validate form
    if (!name.trim()) {
      toast.error("Please enter a name")
      return
    }
    
    if (!selectedColor && !selectedImage && !color.image) {
      toast.error("Please select either a color or an image")
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append("_method", "PUT")
    formData.append("name", name.trim())
    
    if (selectedColor) {
      formData.append("code", selectedColor)
    }
    
    if (selectedImage) {
      formData.append("image", selectedImage)
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors/${color.id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Color updated successfully")
        onSuccess?.()
        handleClose()
        router.refresh()
      } else {
        toast.error(response.data.message || "Failed to update color")
      }
    } catch (error: unknown) {
      console.error("Error updating color:", error)
      let errorMessage = "Failed to update color"
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>
        errorMessage = axiosError.response?.data?.message || 
                       axiosError.message || 
                       "Failed to update color"
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Tile Color
          </DialogTitle>
        </DialogHeader>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title" className="text-base font-medium mb-2 block">
              Title
            </Label>
            <Input
              id="title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type color name here..."
              className={cn(
                "border-gray-300",
                "placeholder:text-sm placeholder:text-gray-400 placeholder:leading-[120%] placeholder:font-normal",
                "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:outline-none"
              )}
              required
              maxLength={100}
              disabled={isLoading}
            />
          </div>

          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value as "color" | "image")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="color" 
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Palette className="w-4 h-4" />
                Color
              </TabsTrigger>
              <TabsTrigger 
                value="image" 
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="color" className="mt-0">
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                previousColor={color?.code || null}
              />
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="image-upload"
                  className={cn(
                    "cursor-pointer flex flex-col items-center justify-center gap-2",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {selectedImage
                      ? selectedImage.name
                      : color?.image
                      ? "Current image is set (upload new to change)"
                      : "Click to upload an image"}
                  </p>
                  <Button variant="outline" type="button" disabled={isLoading}>
                    Select Image
                  </Button>
                </label>
                {(imagePreview || color?.image) && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Preview:</p>
                    <div className="relative w-full h-40">
                      <Image 
                        src={imagePreview || 
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
                              color?.image?.startsWith('uploads/') 
                                ? color.image 
                                : `uploads/${color?.image}`
                            }`}
                        alt={name || "Color preview"}
                        fill
                        className="object-contain"
                        unoptimized={imagePreview?.startsWith('blob:')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
            className="text-white bg-primary" 
              type="submit" 
              disabled={isLoading || !token || (!selectedColor && !selectedImage && !color?.image)}
            >
              {isLoading ? "Updating..." : "Update Color"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}