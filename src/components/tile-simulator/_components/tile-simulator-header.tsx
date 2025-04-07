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
import { APIResponse } from "@/components/types/all-tiles-categories";

const TileSimulatorHeader = () => {
  const [search, setSearch] = useState("");

  console.log(search);
  const handleClear = () => {
    setSearch("");
  };

  const { data } = useQuery<APIResponse>({
    queryKey: ["all-tiles-categories"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`).then(
        (res) => res.json()
      ),
  });

  console.log(data?.data.data);
  const filterData =
    data?.data?.data?.map((item: { id: number; name: string }) => ({
      id: item.id,
      name: item.name,
      value: item.name,
    })) || [];

  console.log(filterData);

  return (
    <div className="w-full space-y-2 md:space-y-0 lg:space-y-0 md:flex lg:flex itmes-center gap-5">
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
          <SelectTrigger className="md:w-[220px] lg:w-[268px] h-[54px]">
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
        <button className="flex w-full p-4 items-center gap-[14px] text-base font-medium leading-[120%] text-primary border border-primary rounded-[8px] lg:py-4 md:px-[50px] lg:px-[70px] ">
          <FaPlus className="text-primary" /> Add Border
        </button>
      </div>
    </div>
  );
};

export default TileSimulatorHeader;
