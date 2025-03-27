"use client"

import { useState } from "react"
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import TilePagination from "@/components/ui/TilePagination"
import type { AllTilesColorDataType } from "./AllTilesColorData"
import { createAllTilesColorColumn } from "./AllTilesColorColumn"

interface TableContainerProps {
  data: AllTilesColorDataType[]
  columns: ColumnDef<AllTilesColorDataType>[]
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
  onEdit: (color: AllTilesColorDataType) => void
  data: AllTilesColorDataType[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}

const AllTilesColorsCotainer = ({
  onEdit,
  data,
  isLoading,
  isError,
  error,
}: AllTilesColorsCotainerProps) => {
  const [currentPage, setCurrentPage] = useState(1)



  // Handle delete functionality
  const handleDelete = (category: AllTilesColorDataType) => {
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
          Showing  entries
        </p>
        <div>
          <TilePagination
            currentPage={currentPage} 
            totalPages={10} 
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </section>
  )
}

export default AllTilesColorsCotainer

