"use client"

import type { AllTilesColorDataType } from "../AllTilesColorData"
import { ColorForm } from "./color-form"

interface AddEditColorProps {
  color: AllTilesColorDataType | null
  onCancel: () => void
  onSave: (color: AllTilesColorDataType) => void
}

export default function AddEditColor({ color, onCancel, onSave }: AddEditColorProps) {
  return <ColorForm color={color} onCancel={onCancel} onSave={onSave} />
}

