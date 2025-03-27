"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { AllTilesData } from "../../_components/AllTilesData"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tile Name must be at least 4 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 10 characters.",
  }),
  gridSelection: z.string().min(2, {
    message: "Description must be at least 10 characters.",
  }),
})
type FormValues = z.infer<typeof formSchema>

const categoryData = [
  "Pattern Collection",
  "6x6 Collection",
  "Hexagon Collection",
  "Border Collection",
  "On-Demand Collection",
  "Elite Collection",
  "Mini Hexagon Collection",
  "4x4 Collection",
  "Scale",
  "Arabesque",
  "Lola",
  "Triangle",
  "Rectangle 4x8",
  "Rectangle 2x8",
]

const gridSelectionData = ["1x1", "2x2"]

const EditNewTile = () => {
  const { id } = useParams()
  //eslint-disable-next-line
  const [tileData, setTileData] = useState<any>(null)
  const [svgData, setSvgData] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch tile data
  useEffect(() => {
    const filterData = AllTilesData.filter((data) => data.id === Number(id))
    if (filterData.length > 0) {
      setTileData(filterData[0])
      // If the tile has SVG data, set it
      if (filterData[0].image) {
        setSvgData(filterData[0].image)
      }
    }
    setIsLoading(false)
  }, [id])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Set default values after data is loaded
    defaultValues: {
      name: "",
      description: "",
      category: "",
      gridSelection: "",
    },
  })

  console.log({ tileData })

  // Update form values when tileData changes
  useEffect(() => {
    if (tileData) {
      form.reset({
        name: tileData?.title || "",
        description: tileData?.description || "",
        category: tileData?.category || "",
        gridSelection: tileData?.gridSelection || "",
      })
    }
  }, [tileData, form])

  // 2. Define a submit handler.
  const onSubmit = (data: FormValues) => {
    const formData = {
      tileName: data.name,
      description: data.description,
      category: data.category,
      gridSelection: data.gridSelection,
      svg: svgData,
    }

    toast.success("Form submitted", {
      description: "Check console for form data",
    })
    console.log("Form data:", formData)
  }

  // const handleSvgChange = useCallback((newSvgData: string) => {
  //   setSvgData(newSvgData)
  // }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 border border-[#B0B0B0] rounded-[8px] p-6">
            <div className="md:grid-cols-1 ">
              <div className="pb-[14px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-secondary-200">Tile Name</FormLabel>
                      <FormControl>
                        <Input
                          className="h-[40px] placeholder:text-secondary-100 focus-visible:ring-0"
                          placeholder="Input The Tile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pb-[14px]">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-secondary-200">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-[156px] placeholder:text-secondary-100 focus-visible:ring-0"
                          placeholder="Type category description here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
                <div className="pb-[14px]">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-secondary-200">Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <SelectTrigger className="w-full h-[40px] border-secondary-100">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryData?.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pb-[14px]">
                  <FormField
                    control={form.control}
                    name="gridSelection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-secondary-200">Grid Selection</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <SelectTrigger className="w-full h-[40px] border-secondary-100">
                              <SelectValue placeholder="Select a grid" />
                            </SelectTrigger>
                            <SelectContent>
                              {gridSelectionData?.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="md:grid-cols-1">
              <FormLabel className="text-xl font-semibold text-[#1A1C21] leading-[120%]">Add Photo</FormLabel>
              <div className="pt-[14px]">
                {/* <AddPhotoSvgEditor onSvgChange={handleSvgChange} initialSvg={svgData} /> */}
              </div>
              {/* button  */}
              <div className="pt-10 w-full flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 text-white bg-primary py-3 px-8 text-base font-medium leading-[120%] rounded-[8px]"
                >
                  <Save /> Save tile
                </button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditNewTile

