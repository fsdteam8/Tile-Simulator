"use client";

import { useState } from "react";
import AllTilesCategoriesHeader from "./_components/AllTilesCategoriesHeader";
import AllTilesCategoriesCotainer from "./_components/AllTilesCategoriesCotainer";
import AddTileEditAndAddCategories from "./_components/AllTilesEdit-addCategories";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AllTilesCategoriesResponse } from "./_components/AllTilesCategoriesData";
import { Category } from "@/components/types/all-tiles-categories";

const TileCategories = () => {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsAddingOrEditing(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsAddingOrEditing(true);
  };

  const handleCancel = () => {
    setIsAddingOrEditing(false);
    setSelectedCategory(null);
  };

  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  console.log(token);

  const { data, isLoading, isError, error } =
    useQuery<AllTilesCategoriesResponse>({
      queryKey: ["allTilesCategories"],
      queryFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`).then(
          (res) => res.json()
        ),
    });

  console.log(data?.data?.data);

  return (
    <div>
      {!isAddingOrEditing && (
        <AllTilesCategoriesHeader onAddNew={handleAddNew} />
      )}

      {isAddingOrEditing ? (
        <AddTileEditAndAddCategories
          category={selectedCategory}
          onCancel={handleCancel}
        />
      ) : (
        <AllTilesCategoriesCotainer
          onEdit={handleEdit}
          data={data?.data?.data}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      )}
    </div>
  );
};

export default TileCategories;
