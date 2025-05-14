"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SVGUpload from "./SVGUpload";
import axios from "axios";

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

const AddNewTile = () => {
  const [image, setImage] = useState<File | null>(null);
  const [svgPath, setSvgPath] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const router = useRouter();

  console.log(formError);

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
  const { data: categoriesData, error: categoriesError } = useQuery({
    queryKey: ["allTilesCategories"],
    queryFn: async () => {
      try {
        if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
          throw new Error("Backend URL is not defined");
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?paginate_count=1000`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        throw error;
      }
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["createTile"],
    mutationFn: async (formData: FormData) => {
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error("Backend URL is not defined");
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: unknown) {
        let message = "Server error";

        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || error.message || message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      if (!data?.success) {
        setFormError(data.message || "Something went wrong");
        toast.error(data.message || "Something went wrong");
        return;
      }
      form.reset();
      setImage(null);
      setSvgPath("");
      setFormError(null);
      router.push("/admin-dashboard");
      toast.success(data.message || "Tile created successfully");
    },
    onError: (error) => {
      setFormError(error.message || "Failed to submit form");
      toast.error(error.message || "Failed to submit form");
    },
  });

  const handleSvgChange = useCallback(
    (newSvgFile: File | null, newSvgPath?: string) => {
      setImage(newSvgFile);
      if (newSvgPath) {
        setSvgPath(newSvgPath);
      } else {
        setSvgPath("");
      }
      setFormError(null);
    },
    []
  );

  if (categoriesError) {
    toast.error("Failed to load categories");
  }

  const onSubmit = async (data: FormValues) => {
    setFormError(null);

    if (!image) {
      setFormError("Please upload an SVG file");
      return;
    }

    if (!svgPath) {
      setFormError("SVG content is missing");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("grid_category", data.grid_category);

    // Add categories
    data.categories.forEach((categoryName) => {
      const category = categoriesData?.data?.data?.find(
        (item: { name: string; id: number }) => item.name === categoryName
      );
      if (category) {
        formData.append("category_id[]", String(category.id));
      }
    });

    // Encode SVG path in Base64
    const svgPathEncoded = btoa(unescape(encodeURIComponent(svgPath)));
    formData.append("image_svg_text", svgPathEncoded);

    // Log FormData contents
    console.log("=== FORM DATA SUBMISSION ===");
    console.log("Form Values:", {
      name: data.name,
      description: data.description,
      categories: data.categories,
      grid_category: data.grid_category,
      svg_path: svgPathEncoded,
    });

    // Log all FormData entries
    console.log("=== FORM DATA ENTRIES ===");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    mutate(formData);
  };

  return (
    <div className="pb-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 border border-[#B0B0B0] rounded-[8px] p-6">
            <div className="md:grid-cols-1">
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
                Add SVG Image
              </h3>
              <div className="pt-[14px]">
                <SVGUpload onUpload={handleSvgChange} maxSizeKB={11500} />
              </div>
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

export default AddNewTile;
