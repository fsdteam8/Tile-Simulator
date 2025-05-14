"use client";

import { useEffect, useState } from "react";
import AllTilesColorsCotainer from "./_components/AllTilesColorContainer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { TileColorsHeader } from "./_components/AllTilesColorHeader";
import { ColorApiResponse, ColorItem } from "./_components/AllTilesColorData";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchTile } from "@/components/zustand/allTiles/allTiles";

const TileColors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  // search color
  const { search, setSearch } = useSearchTile();

  const session = useSession();
  const token = (session?.data?.user as { token?: string })?.token;

  const deleteColorMutation = useMutation({
    mutationFn: (colorId: number) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors/${colorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["allTilesColor", currentPage],
      });
    },
  });

  const handleDelete = async (colorId: number) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        await deleteColorMutation.mutateAsync(colorId);
      } catch (error) {
        console.error("Error deleting color:", error);
      }
    }
  };

  const handleEdit = (color: ColorItem) => {
    // Implement your edit logic here
    // For example, you might want to open a modal with a form to edit the color
    console.log(color);
    // Or navigate to an edit page:
    // router.push(`/colors/edit/${color.id}`);
  };

  const delay = 200;

  const debounceValue = useDebounce(search, delay);

  useEffect(() => {
    setCurrentPage(1);
  }, [debounceValue]);

  const { data, isLoading, isError, error } = useQuery<ColorApiResponse>({
    queryKey: ["allTilesColor", debounceValue, currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors?query=${debounceValue}&paginate_count=10&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json()),
  });



  if (!token) {
    return (
      <div className="p-4 text-red-600">
        Unauthorized. Please log in to continue.
      </div>
    );
  }

  return (
    <div>
      <TileColorsHeader search={search} setSearch={setSearch} />
      <div>
        <AllTilesColorsCotainer
          onEdit={handleEdit}
          onDelete={handleDelete}
          data={data?.data?.data}
          paginationData={data}
          isLoading={isLoading}
          isError={isError}
          error={error}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isDeleting={deleteColorMutation.isPending}
        />
      </div>
    </div>
  );
};

export default TileColors;
