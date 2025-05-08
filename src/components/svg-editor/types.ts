export interface PathData {
  id: string
  d: string
  fill?: string
  originalFill?: string
}

export interface SvgData {
  id?: string
  name?: string
  width?: string
  height?: string
  viewBox?: string
  paths: PathData[]
  description?: string
  image_svg_text: string
}

export interface ColorData {
  id: string
  color: string
  name: string
}

