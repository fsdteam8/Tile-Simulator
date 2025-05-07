export type TileCategory = {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  pivot: {
    tile_id: number;
    category_id: number;
    priority: number | null;
    created_at: string;
    updated_at: string;
  };
};

export type Color = {
  id: number;
  name: string;
  code: string | null;
  image: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
};
export type Tile = {
  id: number;
  name: string;
  description: string;
  grid_category: string;
  image: string;
  image_svg_text?: string; // Make it optional with the ? modifier
  status: string;
  created_at: string;
  updated_at: string;
  categories: TileCategory[];
  colors: Color[];
  svg: string[];
};

export type TilePaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type TileApiResponse = {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Tile[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: TilePaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
};
