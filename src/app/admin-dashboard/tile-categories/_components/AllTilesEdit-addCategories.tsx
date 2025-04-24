"use client"

import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { ChevronRight, ArrowLeft } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Category } from "@/components/types/all-tiles-categories"
// import { AllTilesCategory } from "./AllTilesCategoriesData"

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`

const formSchema = z.object({
  categoryName: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface AddTileEditCategoriesProps {
  category: Category | null
  onCancel: () => void
}

export default function AddTileEditAndAddCategories({ category, onCancel }: AddTileEditCategoriesProps) {
  const isEditing = !!category
  const queryClient = useQueryClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: category ? category.name : "",
      description: category ? category?.description || "" : "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = isEditing ? `${API_URL}/${category?.id}` : API_URL
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.categoryName,
          description: data.description || "",
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} category`)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTilesCategories"] })// Refresh category list
      onCancel()
    },
    onError: (error) => {
      console.error("Error saving category:", error)

    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold leading-tight">
            {isEditing ? "Edit Tile Category" : "Add Tile Category"}
          </h2>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin-dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/admin-dashboard/tile-categories" className="text-muted-foreground hover:text-foreground transition-colors">
              Tile Categories
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{isEditing ? "Edit Category" : "Add Category"}</span>
          </nav>
        </div>
        <Button size="icon" onClick={onCancel} className="h-11 w-20">
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Type category name here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type category description here..." className="min-h-[150px] resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : isEditing ? "Update" : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
