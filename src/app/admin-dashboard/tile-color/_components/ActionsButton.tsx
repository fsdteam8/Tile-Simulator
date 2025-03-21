"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import type { AllTilesColorDataType } from "./AllTilesColorData"
import { DeleteConfirmationColorModal } from "./DeleteConfirmationModal"

interface ActionsButtonProps {
  row: {
    original: AllTilesColorDataType
  }
  onEdit: (color: AllTilesColorDataType) => void
  onDelete?: (color: AllTilesColorDataType) => void
}

function ActionsButton({ row, onEdit, onDelete }: ActionsButtonProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleEdit = () => {
    if (onEdit) {
      onEdit(row.original)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(row.original)
      console.log("Deleted item:", row.original.Name)
    }
    setShowDeleteModal(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  return (
    <div className="flex items-center justify-center gap-[10px]">
      <button onClick={handleEdit}>
        <FiEdit className="w-5 h-5" />
      </button>
      <button onClick={handleDeleteClick} className="hover:text-red-600">
        <Trash2 className="w-5 h-5" />
      </button>

      <DeleteConfirmationColorModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={row.original.Name}
      />
    </div>
  )
}

export default ActionsButton

