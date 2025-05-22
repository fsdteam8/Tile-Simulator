"use client";

import { useEffect, useState } from "react";
import AllTilesCategoriesHeader from "./_components/AllTilesCategoriesHeader";
const AllTilesCategoriesCotainer = dynamic(
  () => import("./_components/AllTilesCategoriesCotainer"),
  {
    ssr: false,
  })
import AddTileEditAndAddCategories from "./_components/AllTilesEdit-addCategories";
import { useQuery } from "@tanstack/react-query";
import {
  CategoriesApiResponse,
  Category,
} from "@/components/types/all-tiles-categories";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchTile } from "@/components/zustand/allTiles/allTiles";
import dynamic from "next/dynamic";

const TileCategories = () => {
  const { search, setSearch } = useSearchTile();
  const [currectPage, setCurrentPage] = useState(1);
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

 

  const delay = 200;

  const debounceValue = useDebounce(search, delay);

  useEffect(() => {
    setCurrentPage(1);
  }, [debounceValue]);

  const { data, isLoading, isError, error } = useQuery<CategoriesApiResponse>({
    queryKey: ["allTilesCategories", debounceValue, currectPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?paginate_count=10&page=${currectPage}&search=${debounceValue}`
      ).then((res) => res.json()),
  });

  return (
    <div>
      {!isAddingOrEditing && (
        <AllTilesCategoriesHeader
          onAddNew={handleAddNew}
          search={search}
          setSearch={setSearch}
        />
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
