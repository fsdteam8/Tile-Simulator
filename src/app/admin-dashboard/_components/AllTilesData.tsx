// export interface TileAllResponse {
//   data: {
//     current_page: number;
//     data: Tile[];
//     first_page_url: string;
//     from: number;
//     last_page: number;
//     last_page_url: string;
//     links: {
//       url: string | null;
//       label: string;
//       active: boolean;
//     }[];
//     next_page_url: string | null;
//     path: string;
//     per_page: number;
//     prev_page_url: string | null;
//     to: number;
//     total: number;
//   };
//   current_page: number;
//   total_pages: number;
//   per_page: number;
//   total: number;
//   message: string;
// }

// export interface Tile {
//   id: number;
//   name: string;
//   description: string;
//   grid_category: string;
//   image: string;
//   status: string;
//   created_at: string;
//   updated_at: string;
//   categories: Category[];
// }

// export interface Category {
//   id: number;
//   name: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
//   pivot: {
//     tile_id: number;
//     category_id: number;
//     priority: null | number;
//     created_at: string;
//     updated_at: string;
//   };
// }



export type Tile = {
  id: number;
  name: string;
  description: string;
  grid_category: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
  categories: Category[];
  colors: Color[];
};

export type Category = {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Color = any[];

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type TileAllResponse = {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Tile[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
};

