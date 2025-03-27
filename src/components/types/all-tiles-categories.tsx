export type Collection = {
  id: number;
  name: string;
  count: number;
  Description: string | null;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data: Collection[];
};
