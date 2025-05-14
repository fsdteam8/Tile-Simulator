"use client";

import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import TileDetails from "./TileDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteModal from "@/components/shared/modal/DeleteConfirmationModal";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuctionButton = ({ row }: any) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;


  const handleEditTiles = (id: number) => {
    router.push(`/admin-dashboard/edit-new-tile/${id}`);
  };

  // delete api
  const { mutate } = useMutation({
    mutationKey: ["delete-tile"],
    mutationFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles/${row?.original?.id}`,
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
      toast.success(data?.message || "Tile deleted successfully");
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["all tiles"] });
    },
  });

  const handleDeleteConfirm = () => {
    if (!selectedTileId) return;
    mutate(row?.original?.id);
  };

  return (
    <div>
      <div className="w-full flex justify-center items-center gap-[10px]">
        <button onClick={() => setIsOpen(true)}>
          <Eye className="w-5 h-5 cursor-pointer" />
        </button>
        <button onClick={() => handleEditTiles(row?.original?.id)}>
          <FiEdit className="w-5 h-5 cursor-pointer" />
        </button>
        <button
          onClick={() => {
            setSelectedTileId(row?.original?.id);
            setDeleteModalOpen(true);
          }}
        >
          <Trash2 className="w-5 h-5 hover:text-primary cursor-pointer" />
        </button>
      </div>

      {/* Tile Details data modal  */}
      {isOpen && (
        <TileDetails open={isOpen} onOpenChange={setIsOpen} row={row} />
      )}

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
};

export default AuctionButton;
