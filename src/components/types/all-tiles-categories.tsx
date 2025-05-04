
// export type Category = {
//   id: number;
//   name: string;
//   status: string;
//   tiles_count: number;
//   description: string | null;
//   created_at: string | null;
//   updated_at: string;
// };

// export type PaginationLink = {
//   url: string | null;
//   label: string;
//   active: boolean;
// };

// export type APIResponse = {
//   data: {
//     current_page: number;
//     data: Category[];
//     first_page_url: string;
//     from: number;
//     last_page: number;
//     last_page_url: string;
//     links: PaginationLink[];
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
// };


export interface Category {
  id: number;
  name: string;
  description: string;
  status: 'Published' | 'draft';
  created_at: string;  
  updated_at: string;
  tiles_count: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface CategoriesResponseData {
  current_page: number;
  data: Category[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  total_pages: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CategoriesApiResponse {
  success: boolean;
  data: CategoriesResponseData;
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
}
