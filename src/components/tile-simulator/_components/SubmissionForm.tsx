"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha";
import type { SvgData } from "@/components/svg-editor/types"

interface SubmissionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tileData?: {
    svgData: SvgData[] | null
    pathColors: Record<string, string>
    showBorders: boolean
    rotations: number[]
    groutColor: string
    groutThickness: string
    gridSize: string
    environment: string
    selectedTile?: {
      name: string
      grid_category?: string
    }
  }
  uniqueColors?: string[]
  svgString?: string
}

export function SubmissionForm({ open, onOpenChange, tileData, svgString }: SubmissionFormProps) {
  const [captchaVerified, setCaptchaVerified] = useState(false)
  console.log(captchaVerified)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    referredBy: "",
    quantityNeeded: "",
    quantityUnit: "Sqft.",
    otherSpecify: "",
    message: "",
    groutColor: tileData?.groutColor || "",
    groutThickness: tileData?.groutThickness || "",
    rotations: tileData?.rotations || [],
    gridCategory: tileData?.selectedTile?.grid_category || "",
    tileName: tileData?.selectedTile?.name || "",
    svgBase64: "", // Added svgBase64 field
  })

  // Convert SVG string to base64 when component mounts or svgString changes
  useEffect(() => {
    if (svgString) {
      try {
        // Convert SVG string to base64
        const base64Svg = btoa(unescape(encodeURIComponent(svgString)))
        setFormData((prev) => ({
          ...prev,
          svgBase64: base64Svg,
        }))
      } catch (error) {
        console.error("Error converting SVG to base64:", error)
      }
    }
  }, [svgString])


  function onChange(value: string | null) {
    setCaptchaVerified(!!value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, quantityUnit: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Prepare the data to be sent to the API
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phoneNumber,
        referred_by: formData.referredBy,
        quantity_needed: formData.quantityNeeded,
        quantity_unit: formData.quantityUnit,
        other_specify: formData.otherSpecify,
        message: formData.message,
        grout_color: formData.groutColor,
        grout_thickness: formData.groutThickness,
        rotations: formData.rotations,
        grid_category: formData.gridCategory,
        tile_name: formData.tileName,
        svg_base64: formData.svgBase64,
      }

      console.log("Submitting data:", submissionData)

      const response = await fetch("https://tilecustomizer.scaleupdevagency.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // const result = await response.json()

      // Close the modal after successful submission
      onOpenChange(false)
      alert("Your submission has been received successfully!")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your form. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="">
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2 text-base font-medium text-[#CE3837] leading-[120%]"
          >
            <ChevronLeft className="text-[#CE3837]" /> Back
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name:</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="rounded-md leading-none focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-non"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-md leading-none focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number:</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="rounded-md leading-none focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referredBy">Referred By:</Label>
            <Input
              id="referredBy"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              className="rounded-md leading-none focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantityNeeded">Quantity Needed:</Label>
            <div className="flex gap-2">
              <Input
                id="quantityNeeded"
                name="quantityNeeded"
                value={formData.quantityNeeded}
                onChange={handleChange}
                className="rounded-md focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none leading-none flex-1"
              />
              <Select value={formData.quantityUnit} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[120px] focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sqft.">Sqft.</SelectItem>
                  <SelectItem value="Boxes">Boxes</SelectItem>
                  <SelectItem value="Pieces">Pieces</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherSpecify">If Other, Please Specify:</Label>
            <Input
              id="otherSpecify"
              name="otherSpecify"
              value={formData.otherSpecify}
              onChange={handleChange}
              className="rounded-md focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none leading-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message:</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="rounded-md focus:ring-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none min-h-[100px]"
            />
          </div>

          <div className="">
            <ReCAPTCHA sitekey="6Ldxr0crAAAAALy5kiCpNAHSxZD00ZObEPP9Nnzl" onChange={onChange} />
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-base font-medium leading-[120%] text-white px-16 py-4 rounded-[8px]"
              // disabled={!captchaVerified}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
