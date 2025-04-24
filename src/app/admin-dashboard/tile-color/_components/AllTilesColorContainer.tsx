"use client"

import { useState } from "react"
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import TilePagination from "@/components/ui/TilePagination"
import { createAllTilesColorColumn } from "./AllTilesColorColumn"
import { AllTilesColorDataType, Color } from "./AllTilesColorData"

interface TableContainerProps {
  data: Color[]
  columns: ColumnDef<Color>[]
}

const TableContainer = ({ data, columns }: TableContainerProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <DataTable table={table} columns={columns} />
    </>
  )
}


interface AllTilesColorsCotainerProps {
  onEdit: (color: Color) => void
  data: Color[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  paginationData? : AllTilesColorDataType
}

const AllTilesColorsCotainer = ({
  onEdit,
  data,
  isLoading,
  isError,
  error,
  paginationData,
}: AllTilesColorsCotainerProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  console.log("dad", paginationData)



  // Handle delete functionality
  const handleDelete = (category: Color) => {
    console.log(`Deleting category: ${category.name}`)
    // API call should be made here to delete from backend
  }


  const columns = createAllTilesColorColumn({
    onEdit,
    onDelete: handleDelete,
  })

  let content
  if (isLoading) {
    content = <p className="text-center py-5">Loading...</p>
  } else if (isError) {
    content = <p>Error: {String(error)}</p>
  } else {
    content = <TableContainer data={data ?? []} columns={columns} />
  }

  return (
    <section className="w-full">
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto rounded-[24px] bg-white">{content}</div>
      <div className="mt-[30px] w-full pb-[208px] flex justify-between">
        <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">
          Showing  entries {paginationData?.current_page}
        </p>
        <div>
          <TilePagination
            currentPage={currentPage} 
            totalPages={paginationData && paginationData.total ? paginationData.total / paginationData.per_page : 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </section>
  )
}

export default AllTilesColorsCotainer

