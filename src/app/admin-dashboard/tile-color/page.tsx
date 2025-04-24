"use client";

import { useState } from "react";
import AllTilesColorHeader from "./_components/AllTilesColorHeader";
import AllTilesColorsCotainer from "./_components/AllTilesColorContainer";
import type { AllTilesColorDataType, Color } from "./_components/AllTilesColorData";
import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
import AddEditColor from "./_components/Add-Edit-colorForm/add-edit-colorForm";

const TileColors = () => {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [selectedColor, setSelectedColor] =
    useState<Color | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(setCurrentPage);

  // const session = useSession();
  // const token = (session?.data?.user as { token: string })?.token;

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
    const updatedColor = { ...color, image: color?.image ?? "" }; // Ensure `image` is always a string
    console.log(updatedColor);
  };

  const { data, isLoading, isError, error } = useQuery<AllTilesColorDataType>({
    queryKey: ["allTilesColor, currentPage"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors?page=${currentPage}`,{
        // headers : {
        //   Authorization: `Bearer ${token}`
        // }
      }).then((res) =>
        res.json()
      ),
  });

  console.log(data?.data)

  return (
    <div>
      {!isAddingOrEditing && <AllTilesColorHeader onAddNew={handleAddNew} />}

      {isAddingOrEditing ? (
        <AddEditColor
          color={selectedColor}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      ) : (
        <AllTilesColorsCotainer
          onEdit={handleEdit}
          data={data?.data}
          paginationData={data}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      )}
    </div>
  );
};

export default TileColors;
