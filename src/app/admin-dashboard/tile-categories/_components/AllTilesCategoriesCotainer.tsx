"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import TilePagination from "@/components/ui/TilePagination";
import { createAllTilesCategoriesColumn } from "./AllTilesCategoriesColumn";
import { CategoriesApiResponse, Category } from "@/components/types/all-tiles-categories";

interface TableContainerProps {
  data: Category[];
  columns: ColumnDef<Category>[];
}

const TableContainer = ({ data, columns }: TableContainerProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <DataTable table={table} columns={columns} />
    </>
  );
};

interface AllTilesCategoriesCotainerProps {
  onEdit: (category: Category) => void;
  data?: Category[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  paginationData?: CategoriesApiResponse;
}

const AllTilesCategoriesCotainer = ({
  onEdit,
  data,
  isLoading,
  isError,
  error,
  currentPage,
  setCurrentPage,
  paginationData,
}: AllTilesCategoriesCotainerProps) => {
  const columns = createAllTilesCategoriesColumn({
    onEdit,
  });

  let content;
  if (isLoading) {
    content = <p className="text-center py-5">Loading...</p>;
  } else if (isError) {
    content = <p>Error: {String(error)}</p>;
  } else {
    content = <TableContainer data={data ?? []} columns={columns} />;
  }

  return (
    <section className="w-full">
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto rounded-[24px] bg-white">
        {content}
      </div>
      {/* pagination  */}
      <div className="pb-[208px]">
        {paginationData && paginationData?.total_pages > 1 && (
          <div className="mt-[30px] w-full  flex justify-between">
            <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
              Showing {paginationData?.current_page} to {paginationData?.total_pages} in first entries
            </p>
            <div>
              <TilePagination
                currentPage={currentPage}
                totalPages={paginationData?.total_pages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllTilesCategoriesCotainer;
