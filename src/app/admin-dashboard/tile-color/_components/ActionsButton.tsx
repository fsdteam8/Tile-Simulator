"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import { DeleteConfirmationColorModal } from "./DeleteConfirmationModal"
import { useSession } from "next-auth/react"
import { Color } from "./AllTilesColorData"

interface ActionsButtonProps {
  row: {
    original: Color
  }
  onEdit: (color: Color) => void
}

function ActionsButton({ row, onEdit }: ActionsButtonProps) {
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
  
      console.log("Delete Response Status:", response.status)
  
      if (!response.ok) {
        const errorMessage = await response.text() // Get error details
        throw new Error(`Failed to delete color: ${errorMessage}`)
      }
  
      // If response is 204 No Content, exit early
      if (response.status === 204) {
        console.log("Delete successful, no response body.")
        return
      }
  
      // Attempt to parse JSON only if content exists
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json()
        console.log("Delete Response Data:", responseData)
      }
    } catch (error) {
      console.error("Error in deleteColor:", error)
      throw error
    }
  }
  
  

  const mutation = useMutation({
    mutationFn: () => deleteColor(Number(row.original.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] }) // Refresh the color list
      setShowDeleteModal(false)
    },
    onError: (error) => {
      console.error("Error deleting color:", error)
    },
  })

  const handleEdit = () => {
    onEdit(row.original)
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await mutation.mutateAsync() // Wait for delete to complete
      console.log("Item deleted successfully")
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }
  

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  return (
    <div className="flex items-center justify-center gap-[10px]">
      <button onClick={handleEdit}>
        <FiEdit className="w-5 h-5" />
      </button>
      <button
        onClick={handleDeleteClick}
        className="hover:text-red-600"
        disabled={!token} // Disable if no token
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <DeleteConfirmationColorModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm} // Pass async function
        itemName={row.original.name}
      />
    </div>
  )
}

export default ActionsButton
