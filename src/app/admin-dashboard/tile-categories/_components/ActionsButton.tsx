"use client"

import { Trash2 } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import { DeleteConfirmationCategoriesModal } from "./DeleteConfirmationCategoriesModal"
import { useState } from "react"
import { Category } from "@/components/types/all-tiles-categories"
// import AllTilesCategory from "./AllTilesCategoriesData";

interface ActionsButtonProps {
  row: {
    original: Category
  }
  onEdit: (category: Category) => void
  onDelete?: (color: Category) => void
}

function ActionsButton({ row, onEdit, onDelete }: ActionsButtonProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)



  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(row.original)
      console.log("Deleted item:", row.original.name)
    }
    setShowDeleteModal(false)
  }
  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }
  return (
    <div className="flex items-center justify-center gap-[10px]">
      <button onClick={() => onEdit(row.original)}>
        <FiEdit className="w-5 h-5" />
      </button>
      <button onClick={handleDeleteClick} className="hover:text-red-600">
        <Trash2 className="w-5 h-5 " />
      </button>
      <DeleteConfirmationCategoriesModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={row.original.name}
      />
    </div>
  )
}

export default ActionsButton

