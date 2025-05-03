"use client"

import { Color } from "../AllTilesColorData"
import { ColorForm } from "./color-form"

interface AddEditColorProps {
  color: Color | null
  onCancel: () => void
  onSave: (color: Color) => void
}

export default function AddEditColor({ color, onCancel, onSave }: AddEditColorProps) {
  return <ColorForm color={color} onCancel={onCancel} onSave={onSave} />
}

