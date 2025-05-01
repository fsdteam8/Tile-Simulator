"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Add the missing imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SVGUpload from "../add-new-tile/_components/SVGUpload";

interface TileResponse {
  data: Tile;
}

interface Tile {
  name: string;
  description: string;
  grid_category: string;
  categories: { name: string }[];
  image: string;
}

// Form Schema with zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tile Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  categories: z.array(z.string()).min(1, {
    message: "Select at least one category.",
  }),
  grid_category: z.string().min(2, {
    message: "Grid Selection must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const gridSelectionData = ["1x1", "2x2"];

const EditNewTile = ({ id }: { id: number | string }) => {
  const [image, setSvgData] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  console.log(token);

  const queryClient = useQueryClient();

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: [],
      grid_category: "",
    },
  });

  // Fetch categories from the API
  const { data: categoriesData, error } = useQuery({
    queryKey: ["allTilesCategories"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });

  const { data: tileSingleData } = useQuery<TileResponse>({
    queryKey: ["single-tile", id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles/${id}`
      );
      return response.json();
    },
  });

  //   console.log(tileSingleData?.data?.image);

  useEffect(() => {
    if (tileSingleData) {
      form.reset({
        name: tileSingleData?.data?.name,
        description: tileSingleData?.data?.description,
        grid_category: tileSingleData?.data?.grid_category,
        categories: tileSingleData?.data?.categories.map((c) => c?.name),
      });
    }
  }, [tileSingleData, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateTile", id],
    mutationFn: (formData: FormData) => {
      formData.append("_method", "PUT");

      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update tile");
        }
        return data;
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Tile updated successfully", {
        position: "top-right",
        richColors: true,
      });

      queryClient.invalidateQueries({ queryKey: ["all tiles"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update tile", {
        position: "top-right",
        richColors: true,
      });
    },
  });

  const handleSvgChange = useCallback((newSvgData: File | null) => {
    setSvgData(newSvgData);
  }, []);

  if (error) {
    toast.error("Failed to load categories", {
      description: error.message,
    });
  }

  const onSubmit = async (data: FormValues) => {
    // if (!image) {
    //   toast.error("Missing SVG", {
    //     description: "Please upload an SVG file",
    //   });
    //   return;
    // }

    // Find selected category IDs
    const selectedCategoryIds = data.categories
      .map((categoryName) => {
        const category = categoriesData?.data?.data?.find(
          (item: { name: string }) => item.name === categoryName
        );
        return category ? String(category.id) : null;
      })
      .filter(Boolean) as string[];

    if (selectedCategoryIds.length === 0) {
      toast.error("Invalid Categories", {
        description: "Please select at least one valid category",
      });
      return;
    }

    const formData: FormData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("grid_category", data.grid_category);
    selectedCategoryIds.forEach((id) => {
      formData.append("category_id[]", id.toString());
    });

    if (image) {
      formData.append("image", image);
    }

    mutate(formData);
  };

  return (
    <div className="pb-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 border border-[#B0B0B0] rounded-[8px] p-6">
            <div className="md:grid-cols-1 ">
              <div className="pb-[14px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-secondary-200">
                        Tile Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-[40px] placeholder:text-secondary-100 focus-visible:ring-0"
                          placeholder="Input The Tile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pb-[14px]">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-secondary-200">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-[156px] placeholder:text-secondary-100 focus-visible:ring-0"
                          placeholder="Type category description here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
                <div className="pb-[14px]">
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-base font-medium text-secondary-200">
                          Categories
                        </FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={cn(
                                  "w-full h-[40px] justify-between",
                                  !field.value.length && "text-muted-foreground"
                                )}
                              >
                                {field.value.length
                                  ? `${field.value.length} selected`
                                  : "Select categories"}
                                <div className="ml-2 flex gap-1 flex-wrap">
                                  {field.value.length > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="rounded-sm px-1 font-normal"
                                    >
                                      {field.value.length}
                                    </Badge>
                                  )}
                                </div>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandList>
                                <CommandEmpty>
                                  No categories found.
                                </CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {categoriesData?.data?.data?.map(
                                    (category: {
                                      id: number;
                                      name: string;
                                    }) => {
                                      const isSelected = field.value.includes(
                                        category.name
                                      );
                                      return (
                                        <CommandItem
                                          key={category.id}
                                          onSelect={() => {
                                            if (isSelected) {
                                              form.setValue(
                                                "categories",
                                                field.value.filter(
                                                  (value) =>
                                                    value !== category.name
                                                )
                                              );
                                            } else {
                                              form.setValue("categories", [
                                                ...field.value,
                                                category.name,
                                              ]);
                                            }
                                          }}
                                        >
                                          <div
                                            className={cn(
                                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                              isSelected
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                            )}
                                          >
                                            <Check className={cn("h-4 w-4")} />
                                          </div>
                                          <span>{category.name}</span>
                                        </CommandItem>
                                      );
                                    }
                                  )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pb-[14px]">
                  <FormField
                    control={form.control}
                    name="grid_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-secondary-200">
                          Grid Selection
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full h-[40px] focus-visible:outline-none focus-visible:ring-0">
                              <SelectValue placeholder="Select a grid" />
                            </SelectTrigger>
                            <SelectContent className="focus:outline-none focus:ring-0">
                              {gridSelectionData.map((item) => (
                                <SelectItem
                                  key={item}
                                  value={item}
                                  className="focus:outline-none focus:ring-0"
                                >
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="md:grid-cols-1">
              <h3 className="text-xl font-semibold text-[#1A1C21] leading-[120%] mb-[14px]">
                Add Photo
              </h3>
              <div className="pt-[14px]">
                <SVGUpload
                  onUpload={handleSvgChange}
                  maxSizeKB={11500}
                  initialImage={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${tileSingleData?.data?.image}`}
                />
              </div>

              {/* button  */}
              <div className="pt-10 w-full flex items-center justify-end">
                <Button
                  type="submit"
                  className="flex items-center gap-2 text-white bg-primary py-3 px-8 text-base font-medium leading-[120%] rounded-[8px]"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save /> Save tile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditNewTile;
