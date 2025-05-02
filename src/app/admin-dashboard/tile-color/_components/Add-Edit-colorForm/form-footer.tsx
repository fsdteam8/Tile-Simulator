"use client"

import { Button } from "@/components/ui/button"

interface FormFooterProps {
  onCancel: () => void
  isSubmitting: boolean
}

export function FormFooter({ onCancel, isSubmitting }: FormFooterProps) {
  return (
    <div className="flex justify-end gap-4 mt-8">
      <Button
        variant="outline"
        onClick={onCancel}
        className="py-2 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
    </div>
  )
}

