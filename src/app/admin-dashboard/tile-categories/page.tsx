"use client";

import { useState } from "react";
import AllTilesCategoriesHeader from "./_components/AllTilesCategoriesHeader";
import AllTilesCategoriesCotainer from "./_components/AllTilesCategoriesCotainer";
import AddTileEditAndAddCategories from "./_components/AllTilesEdit-addCategories";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CategoriesApiResponse, Category } from "@/components/types/all-tiles-categories";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchTile } from "@/components/zustand/allTiles/allTiles";

const TileCategories = () => {
  const [currectPage, setCurrentPage] = useState(1);
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { search, setSearch } = useSearchTile();

  console.log("setSearch", setSearch)

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

  const delay = 200;
  
    const debounceValue = useDebounce(search, delay);

  const { data, isLoading, isError, error } =
    useQuery<CategoriesApiResponse>({
      queryKey: ["allTilesCategories", search, currectPage ],
      queryFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?page=${currectPage}&search=${debounceValue}`).then(
          (res) => res.json()
        ),
    });

  console.log(data?.data?.data);

  return (
    <div>
      {!isAddingOrEditing && (
        <AllTilesCategoriesHeader  onAddNew={handleAddNew}  search={search} setSearch={setSearch} />
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
          currentPage={currectPage}
          setCurrentPage={setCurrentPage}
          paginationData={data}
        />
      )}
    </div>
  );
};

export default TileCategories;
