"use client"

import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { createAllTilesColorColumn } from "./AllTilesColorColumn"
import { ColorApiResponse, ColorItem } from "./AllTilesColorData"

interface TableContainerProps {
  data: ColorItem[]
  columns: ColumnDef<ColorItem>[]
}

const TableContainer = ({ data, columns }: TableContainerProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <DataTable table={table} columns={columns} />
}

export interface AllTilesColorsCotainerProps {
  onEdit: (color: ColorItem) => void;
  onDelete: (colorId: number) => void;
  data: ColorItem[] | undefined;
  paginationData: ColorApiResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  isDeleting?: boolean;
}

const AllTilesColorsCotainer = ({
  onEdit,
  onDelete,
  data,
  isLoading,
  isError,
  error,
  isDeleting = false,
}: AllTilesColorsCotainerProps) => {



  const columns = createAllTilesColorColumn({
    onEdit,
    onDelete: (color: ColorItem) => {
      if (color.id) {
        onDelete(color.id)
      }
    },
  })

  let content
  if (isLoading || isDeleting) {
    content = <p className="text-center py-5">Loading...</p>
  } else if (isError) {
    content = <p className="text-center py-5 text-red-500">Error: {error?.message}</p>
  } else if (!data || data.length === 0) {
    content = <p className="text-center py-5">No colors found</p>
  } else {
    content = <TableContainer data={data} columns={columns} />
  }

  return (
    <section className="w-full">
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto rounded-[24px] bg-white">
        {content}
      </div>
      <div className="mt-[30px] w-full pb-[208px] flex justify-between">
        {/* <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
          Showing page {paginationData?.current_page} of {paginationData?.last_page}
        </p>
        <div>
          <TilePagination
            currentPage={currentPage}
            totalPages={paginationData?.last_page || 1}
            onPageChange={handlePageChange}
          />
        </div> */}
      </div>
    </section>
  )
}

export default AllTilesColorsCotainer