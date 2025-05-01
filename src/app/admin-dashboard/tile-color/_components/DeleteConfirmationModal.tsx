"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  itemName: string
  isDeleting?: boolean
  description?: string
}

export function DeleteConfirmationColorModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting: parentIsDeleting,
  description = "This action cannot be undone.",
}: DeleteConfirmationModalProps) {
  const [internalIsDeleting, setInternalIsDeleting] = useState(false)
  const isDeleting = parentIsDeleting ?? internalIsDeleting

  // Handle both controlled and uncontrolled modal states
  const [open, setOpen] = useState(isOpen)
  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleConfirm = async () => {
    try {
      if (parentIsDeleting === undefined) {
        setInternalIsDeleting(true)
      }
      
      await onConfirm()
      toast.success(`${itemName} deleted successfully`)
      handleClose()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      toast.error(`Failed to delete ${itemName}: ${errorMessage}`)
      console.error("Deletion error:", error)
    } finally {
      if (parentIsDeleting === undefined) {
        setInternalIsDeleting(false)
      }
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      setOpen(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle className="text-destructive">
              Confirm Deletion
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{itemName}</span>? {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}