"use client"

import { useState } from "react"
import AllTilesCategoriesHeader from "./_components/AllTilesCategoriesHeader"
import AllTilesCategoriesCotainer from "./_components/AllTilesCategoriesCotainer"
import AddTileEditAndAddCategories from "./_components/AllTilesEdit-addCategories"
import type {  AllTilesCategoriesResponse, AllTilesCategory } from "./_components/AllTilesCategoriesData"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

const TileCategories = () => {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<AllTilesCategory | null>(null)

  const handleAddNew = () => {
    setSelectedCategory(null)
    setIsAddingOrEditing(true)
  }

  const handleEdit = (category: AllTilesCategory) => {
    setSelectedCategory(category)
    setIsAddingOrEditing(true)
  }

  const handleCancel = () => {
    setIsAddingOrEditing(false)
    setSelectedCategory(null)
  }


  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  console.log(token)

  const { data, isLoading, isError, error } = useQuery<AllTilesCategoriesResponse>({
    queryKey: ['allTilesCategories'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch tile colors")
      return res.json()
    },
  });

  console.log(data);

  return (
    <div>
      {!isAddingOrEditing && <AllTilesCategoriesHeader onAddNew={handleAddNew} />}

      {isAddingOrEditing ? (
        <AddTileEditAndAddCategories category={selectedCategory} onCancel={handleCancel} />
      ) : (
        <AllTilesCategoriesCotainer
          onEdit={handleEdit}
          data={data?.data}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      )}
    </div>
  )
}

export default TileCategories

