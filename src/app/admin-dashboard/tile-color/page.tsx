"use client";

import { useState } from "react";
import AllTilesColorHeader from "./_components/AllTilesColorHeader";
import AllTilesColorsCotainer from "./_components/AllTilesColorContainer";
import type { AllTilesColorDataType, Color } from "./_components/AllTilesColorData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AddEditColor from "./_components/Add-Edit-colorForm/add-edit-colorForm";
import { useSession } from "next-auth/react";

const TileColors = () => {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const session = useSession();
  const token = (session?.data?.user as { token?: string })?.token;
  console.log("Token:", token);

  const handleAddNew = () => {
    setSelectedColor(null);
    setIsAddingOrEditing(true);
  };

  const handleEdit = (color: Color) => {
    setSelectedColor(color);
    setIsAddingOrEditing(true);
  };

  const handleCancel = () => {
    setIsAddingOrEditing(false);
    setSelectedColor(null);
  };

  const handleSave = (color: Color) => {
    setIsAddingOrEditing(false);
    setSelectedColor(null);
    const updatedColor = { ...color, image: color?.image ?? "" };
    console.log(updatedColor);
  };

  const deleteColorMutation = useMutation({
    mutationFn: (colorId: number) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors/${colorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: () => {
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['allTilesColor', currentPage] });
    },
  });

  const handleDelete = async (colorId: number) => {
    if (window.confirm('Are you sure you want to delete this color?')) {
      try {
        await deleteColorMutation.mutateAsync(colorId);
      } catch (error) {
        console.error('Error deleting color:', error);
      }
    }
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<AllTilesColorDataType>({
    queryKey: ["allTilesColor", currentPage],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  if (!token) {
    return <div className="p-4 text-red-600">Unauthorized. Please log in to continue.</div>;
  }

  return (
    <div>
      {!isAddingOrEditing && <AllTilesColorHeader onAddNew={handleAddNew} />}

      {isAddingOrEditing ? (
        <AddEditColor color={selectedColor} onCancel={handleCancel} onSave={handleSave} />
      ) : (
        <>
          {isError && (
            <div className="p-4 text-red-500">
              Error fetching colors: {(error as Error)?.message}
            </div>
          )}
          <AllTilesColorsCotainer
            onEdit={handleEdit}
            onDelete={handleDelete}
            data={data?.data}
            paginationData={data}
            isLoading={isLoading}
            isError={isError}
            error={error}
            setCurrentPage={setCurrentPage}
            isDeleting={deleteColorMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default TileColors;