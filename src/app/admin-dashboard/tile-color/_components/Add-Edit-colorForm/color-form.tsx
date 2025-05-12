"use client"

import React, { useState } from "react"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette, ImageIcon } from "lucide-react"
import { ColorPicker } from "./color-picker"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import axios from "axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface ColorFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ColorFormModal = ({ open, onOpenChange }: ColorFormModalProps) => {
  const router = useRouter()
  const session = useSession()
  const token = (session?.data?.user as { token: string })?.token

  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tabValue, setTabValue] = useState<"color" | "image">("color")

  // Clean up object URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Authentication required. Please log in.")
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("status", "draft")

    if (tabValue === "color" && selectedColor) {
      formData.append("code", selectedColor)
    } else if (tabValue === "image" && selectedImage) {
      formData.append("image", selectedImage)
    } else {
      toast.error("Please select either a color or an image")
      setIsLoading(false)
      return
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors`
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }

      const response = await axios.post(url, formData, { headers })

      if (response.data.success) {
        toast.success("Color created successfully")
        resetForm()
        onOpenChange(false)
        router.refresh()
      } else {
        throw new Error(response.data.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Error creating color:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while creating the color")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)

      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const resetForm = () => {
    setName("")
    setSelectedColor("")

    // Clean up the object URL to avoid memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setImagePreview(null)
    setSelectedImage(null)
    setTabValue("color")
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New Tile Color</DialogTitle>
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
                "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:outline-none",
              )}
              required
            />
          </div>

          <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as "color" | "image")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="color" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="color" className="mt-0">
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                previousColor={selectedColor || null}
              />
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} className="hidden" />

                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-48 overflow-hidden rounded-md">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Selected image preview"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setSelectedImage(null)
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview)
                          }
                          setImagePreview(null)
                        }}
                        className="text-sm"
                      >
                        Remove Image
                      </Button>
                      <label htmlFor="image-upload">
                        <Button variant="outline" type="button" className="ml-2 text-sm">
                          Change Image
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload an image</p>
                    <Button variant="outline" type="button">
                      Select Image
                    </Button>
                  </label>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              className="text-white"
              type="submit"
              disabled={isLoading || !token || (!selectedColor && !selectedImage)}
            >
              {isLoading ? "Creating..." : "Create Color"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
