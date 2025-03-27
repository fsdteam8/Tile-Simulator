"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/category_select";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/components/types/all-tiles-categories";

const TileSimulatorHeader = () => {
  const [search, setSearch] = useState("");

  console.log(search);
  const handleClear = () => {
    setSearch("");
  };

  const { data } = useQuery<ApiResponse>({
    queryKey: ["all-tiles-categories"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`).then(
        (res) => res.json()
      ),
  });

  console.log(data);
  const filterData = data?.data.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.name,
  }));
  console.log(filterData);

  return (
    <div className="w-full flex itmes-center gap-5">
      {/* searching  */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
          size={18}
        />
        <Input
          type="search"
          placeholder="Search for products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "pl-10 pr-10 py-[25px]", // Added pr-10 to make room for the clear icon
            "border-primary",
            "placeholder:text-sm placeholder:text-primary placeholder:leading-[120%] placeholder:font-normal",
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:outline-none"
          )}
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {/* categories  */}
      <div>
        <Select>
          <SelectTrigger className="w-[268px] h-[52px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {filterData?.map((item) => (
              <SelectItem key={item.id} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* add border  */}
      <div>
        <button className="flex items-center gap-[14px] text-base font-medium leading-[120%] text-primary border border-primary rounded-[8px] py-4 px-[70px]">
          <FaPlus className="text-primary" /> Add Border
        </button>
      </div>
    </div>
  );
};

export default TileSimulatorHeader;
