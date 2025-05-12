"use client";

import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Submission } from "@/components/types/submissionAllDataType";
import DeleteModal from "@/components/shared/modal/DeleteConfirmationModal";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ViewSubmission from "./ViewSubmission";

interface ActionsButtonProps {
  row: {
    original: Submission;
  };
  onDelete?: (color: Submission) => void;
}

function ActionsSubmissionButton({ row }: ActionsButtonProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);
  console.log(selectedTileId);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  // delete api
  const { mutate } = useMutation({
    mutationKey: ["delete-submission"],
    mutationFn: (id: number) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          //  "Content-Type": "multipart/form-data",
        },
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Submission deleted successfully");
      setShowDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["all-submission"] });
    },
  });

  const handleDeleteConfirm = () => {
    if (!selectedTileId) return;
    mutate(selectedTileId);
  };

  return (
    <div className="flex items-center justify-center gap-[10px]">
      <button
        onClick={() => {
          setIsOpen(true);
          setSelectedTileId(row.original.id);
        }}
      >
        <Eye className="w-6 h-6" />
      </button>
      <button
        onClick={() => {
          setSelectedTileId(row.original.id);
          setShowDeleteModal(true);
        }}
        className="hover:text-red-600"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      {/* submission delete modal  */}

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* submission details data modal  */}
      {
        isOpen && (
          <ViewSubmission open={isOpen} onOpenChange={setIsOpen} row={row}/>
        )
      }

    </div>
  );
}

export default ActionsSubmissionButton;
