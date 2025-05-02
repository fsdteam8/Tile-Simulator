"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { AllSubmissionDataType } from "./AllSubmissionData"
import { DeleteConfirmationSubmissionModal } from "./DeleteConfirmationSubmissionModal"

interface ActionsButtonProps {
  row: {
    original: AllSubmissionDataType
  }
  onDelete?: (color: AllSubmissionDataType) => void
}

function ActionsSubmissionButton({ row, onDelete }: ActionsButtonProps) {
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
      <button onClick={handleDeleteClick} className="hover:text-red-600">
        <Trash2 className="w-5 h-5" />
      </button>

      <DeleteConfirmationSubmissionModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={row.original.name}
      />
    </div>
  )
}

export default ActionsSubmissionButton

