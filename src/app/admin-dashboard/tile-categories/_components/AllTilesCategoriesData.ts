export type AllTilesCategory = {
  id: number;
  name: string;
  count: number;
  Description: string | null;
  updated_at: string;
};

export type AllTilesCategoriesResponse = {
  success: boolean;
  message: string;
  data: AllTilesCategory[];
};

