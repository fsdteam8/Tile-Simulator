"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import { DeleteConfirmationColorModal } from "./DeleteConfirmationModal"
import { useSession } from "next-auth/react"
import { EditColorForm } from "./Add-Edit-colorForm/editColor"
import { ColorItem } from "./AllTilesColorData"

interface ActionsButtonProps {
  color: ColorItem
  onDelete?: (colorId: number) => void
}

function ActionsButton({ color, onDelete }: ActionsButtonProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
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

  const deleteMutation = useMutation({
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

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["allTilesColor"] })
    setShowEditModal(false)
  }

  const handleEditClick = () => {
    setShowEditModal(true)
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync()
    } catch {
      // Error is already handled in mutation.onError
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  // Move the null check after all hooks
  if (!color || typeof color.id === 'undefined') {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-[10px]">
      <button
        onClick={handleEditClick}
        className="text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Edit color"
        disabled={!token}
      >
        <FiEdit className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleDeleteClick}
        className="text-gray-600 hover:text-red-600 transition-colors"
        disabled={!token || deleteMutation.isPending}
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

      <EditColorForm
        open={showEditModal}
        onOpenChange={setShowEditModal}
        color={color}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}

export default ActionsButton