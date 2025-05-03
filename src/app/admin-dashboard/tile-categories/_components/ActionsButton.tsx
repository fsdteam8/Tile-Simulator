"use client";

import { Trash2 } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
import { Category } from "@/components/types/all-tiles-categories";
import DeleteModal from "@/components/shared/modal/DeleteConfirmationModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface ActionsButtonProps {
  row: {
    original: Category;
  };
  onEdit: (category: Category) => void;
  onDelete?: (color: Category) => void;
}

function ActionsButton({ row, onEdit }: ActionsButtonProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<number | string | null>(
    null
  );

  const queryClient = useQueryClient();

  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  console.log(token);

  console.log({ row });

  const { mutate } = useMutation({
    mutationKey: ["delete-category"],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: (id: number) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${row?.original?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            //  "Content-Type": "multipart/form-data",
          },
        }
      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Category deleted successfully");
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["allTilesCategories"] });
    },
  });

  const handleDeleteConfirm = () => {
    if (!selectedTileId) return;
    console.log("Deleting tile with ID:", selectedTileId);
    mutate(row?.original?.id);
  };
  return (
    <div className="flex items-center justify-center gap-[10px]">
      <button onClick={() => onEdit(row.original)}>
        <FiEdit className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          setDeleteModalOpen(true);
          setSelectedTileId(row?.original?.id);
        }}
        className="hover:text-red-600"
      >
        <Trash2 className="w-5 h-5 " />
      </button>
      {/* tile delete modal  */}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default ActionsButton;
