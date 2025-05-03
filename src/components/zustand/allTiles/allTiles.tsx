import { create } from "zustand";

interface SearchTile {
  search: string;
  setSearch: (value: string) => void;
}

export const useSearchTile = create<SearchTile>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
}));
