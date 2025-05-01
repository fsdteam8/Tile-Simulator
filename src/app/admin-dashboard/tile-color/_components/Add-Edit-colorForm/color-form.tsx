"use client"

import { useState } from "react"
// import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Palette, ImageIcon, AlertCircle, CheckCircle, X } from "lucide-react"
import { FormHeader } from "./form-header"
import { ColorPicker } from "./color-picker"
import { ImageUploader } from "./image-uploader"
import { FormFooter } from "./form-footer"
import { Color } from "../AllTilesColorData"
import { useSession } from "next-auth/react"

interface ColorFormProps {
  color: Color | null
  onCancel: () => void
  onSave: (color: Color) => void
}

type SelectionMode = "color" | "image"
type MessageType = "success" | "error" | null

// For development/testing when API is not available
const MOCK_API_RESPONSE = false

export function ColorForm({ color, onCancel, onSave }: ColorFormProps) {
  console.log("color", color)
  const [title, setTitle] = useState(color?.name || "")
  const [selectedColor, setSelectedColor] = useState(color?.code || "")
  const [selectedImage, setSelectedImage] = useState<string | null>(color?.image || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<MessageType>(null)

  // Determine initial mode based on the color data
  const initialMode: SelectionMode = color?.code ? "color" : "image"
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(initialMode)

  const isEditing = !!color
  const session = useSession()
  const token = (session?.data?.user as { token: string })?.token

  const handleModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode)
    if (mode === "color") {
      setSelectedImage(null)
    } else {
      setSelectedColor("")
    }
  }

  const showMessage = (text: string, type: MessageType) => {
    setMessage(text)
    setMessageType(type)

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const handleSave = async () => {
    if (!title) {
      showMessage("Please enter a title for the color", "error")
      return
    }

    if (selectionMode === "color" && !selectedColor) {
      showMessage("Please select a color", "error")
      return
    }

    if (selectionMode === "image" && !selectedImage) {
      showMessage("Please select an image", "error")
      return
    }

    setIsSubmitting(true)

    try {
      const colorData: Partial<Color> = {
        name: title,
        code: selectionMode === "color" ? selectedColor : null,
        image: selectionMode === "image" ? selectedImage : null,
      }

      // Determine if we're updating or creating
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors/${color?.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors`

      // Use PUT method directly for updates
      const method = isEditing ? "PUT" : "POST"

      console.log(`${isEditing ? "Updating" : "Creating"} color with:`, {
        url,
        method,
        data: colorData,
      })

      // For development/testing when API is not available
      if (MOCK_API_RESPONSE) {
        console.log("Using mock API response")
        // Create a mock response
        
        const mockResponse: Color = {
          id: isEditing ? color?.id || "mock-id" : `mock-id-${Date.now()}`,
          name: title,
          code: selectionMode === "color" ? selectedColor : null,
          image: selectionMode === "image" ? selectedImage : null,
          created_at: isEditing ? color?.created_at || new Date().toISOString() : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log(`Color ${isEditing ? "updated" : "created"} successfully (MOCK):`, mockResponse)
        showMessage(`Color ${isEditing ? "updated" : "created"} successfully (MOCK)`, "success")

        onSave(mockResponse)
        setIsSubmitting(false)
        return
      }

      // Actual API call
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(colorData)
      })

      // Log the raw response for debugging
      const responseText = await response.text()
      console.log(
        `Raw API Response (${response.status}):`,
        responseText.substring(0, 500) + (responseText.length > 500 ? "..." : ""),
      )

      if (response.ok) {
        let data
        try {
          // Try to parse the response as JSON
          data = JSON.parse(responseText)
        } catch (e) {
          console.error("Error parsing JSON response:", e)
          showMessage("Server returned a success status but the response was not valid JSON", "error")

          // Create a fallback response object
          data = {
            id: isEditing ? color?.id || "fallback-id" : `fallback-id-${Date.now()}`,
            name: title,
            code: selectionMode === "color" ? selectedColor : null,
            image: selectionMode === "image" ? selectedImage : null,
            createdAt: isEditing ? color?.created_at || new Date().toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }

        console.log(`Color ${isEditing ? "updated" : "created"} successfully:`, data)
        showMessage(`Color ${isEditing ? "updated" : "created"} successfully`, "success")

        onSave(data)
      } else {
        console.error(`Error ${isEditing ? "updating" : "creating"} color (Status ${response.status}):`, responseText)

        showMessage(
          `Failed to ${isEditing ? "update" : "create"} color. Server returned status ${response.status}.`,
          "error",
        )

        // If we're in development, create a fallback response for testing
        if (process.env.NODE_ENV === "development") {
          console.log("Using fallback response for development")
          const fallbackData: Color = {
            id: isEditing ? color?.id || "fallback-id" : `fallback-id-${Date.now()}`,
            name: title,
            code: selectionMode === "color" ? selectedColor : null,
            image: selectionMode === "image" ? selectedImage : null,
            created_at: isEditing ? color?.created_at || new Date().toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          onSave(fallbackData)
        }
      }
    } catch (error) {
      console.error("Network error while saving color:", error)

      showMessage("Failed to connect to the server. Please check your connection and try again.", "error")

      // If we're in development, create a fallback response for testing
      if (process.env.NODE_ENV === "development") {
        console.log("Using fallback response for development after error")
        const fallbackData: Color = {
          id: isEditing ? color?.id || "fallback-id" : `fallback-id-${Date.now()}`,
          name: title,
          code: selectionMode === "color" ? selectedColor : null,
          image: selectionMode === "image" ? selectedImage : null,
          created_at: isEditing ? color?.created_at || new Date().toISOString() : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        onSave(fallbackData)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="">
      <FormHeader isEditing={isEditing} isSubmitting={isSubmitting} onSave={handleSave} />

      {message && (
        <div
          className={`mb-4 p-4 rounded-md flex items-start justify-between ${
            messageType === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {messageType === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <span>{message}</span>
          </div>
          <button
            onClick={() => {
              setMessage(null)
              setMessageType(null)
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-base font-medium mb-2 block">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Type Title color name here..."
              className={cn(
                "border-gray-300",
                "placeholder:text-sm placeholder:text-gray-400 placeholder:leading-[120%] placeholder:font-normal",
                "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-red-500 focus-visible:outline-none",
              )}
            />
          </div>

          <Tabs
            value={selectionMode}
            onValueChange={(value) => handleModeChange(value as SelectionMode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="color" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Select Color
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Select Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="color" className="mt-0">
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                previousColor={isEditing ? color?.code : null}
              />
            </TabsContent>

            <TabsContent value="image" className="mt-0">
              <ImageUploader
                selectedImage={selectedImage}
                onImageChange={setSelectedImage}
                previousImage={isEditing ? color?.image : null}
              />
            </TabsContent>
          </Tabs>

          <FormFooter onCancel={onCancel} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  )
}

