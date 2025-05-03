// types/colors.ts
export type ColorItem = {
  id: number;
  name: string;
  code: string | null;
  image: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type ColorApiResponse = {
  data: {
    current_page: number;
    data: ColorItem[];
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
  message: string;
  success: boolean;
};