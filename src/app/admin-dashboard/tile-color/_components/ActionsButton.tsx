"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import { DeleteConfirmationColorModal } from "./DeleteConfirmationModal"
import { useSession } from "next-auth/react"
import { Color } from "./AllTilesColorData"

interface ActionsButtonProps {
  color: Color
  onEdit: (color: Color) => void
  onDelete?: (colorId: number) => void
}

function ActionsButton({ color, onEdit, onDelete }: ActionsButtonProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const token = (session?.user as { token?: string })?.token

  const deleteColor = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/colors/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || `Failed to delete color: ${response.status}`
        )
      }

      return true
    } catch (error) {
      console.error("Error in deleteColor:", error)
      throw error
    }
  }

  const mutation = useMutation({
    mutationFn: () => deleteColor(Number(color.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTilesColor"] })
      setShowDeleteModal(false)
      onDelete?.(Number(color.id))
    },
    onError: (error: Error) => {
      console.error("Error deleting color:", error.message)
    },
  })

  // Move the null check after all hooks
  if (!color || typeof color.id === 'undefined') {
    return null
  }

  const handleEdit = () => {
    onEdit(color)
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await mutation.mutateAsync()
    } catch {
      // Error is already handled in mutation.onError
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  return (
    <div className="flex items-center justify-center gap-[10px]">
      <button
        onClick={handleEdit}
        className="text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Edit color"
      >
        <FiEdit className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleDeleteClick}
        className="text-gray-600 hover:text-red-600 transition-colors"
        disabled={!token || mutation.isPending}
        aria-label="Delete color"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <DeleteConfirmationColorModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={color.name}
      />
    </div>
  )
}

export default ActionsButton