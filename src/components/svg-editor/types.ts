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
}

export interface ColorData {
  id: string
  color: string
  name: string
}

