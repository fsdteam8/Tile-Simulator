export type Submission = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  message: string;
  tile_name: string;
  quantity_unit: string;
  quantity_needed: number;
  status: string;
  referred_by: string;
  other_specify: string;
  grout_color: string;
  grout_thickness: string;
  grid_category: string;
  rotations: string; // This is a stringified array: "[0,90,180,270]"
  svg_base64: string;
  created_at: string;
  updated_at: string;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type SubmissionApiResponse = {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Submission[];
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
