"use client"

import { useState } from "react"
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import TilePagination from "@/components/ui/TilePagination"
import { createAllTilesCategoriesColumn } from "./AllTilesCategoriesColumn"
import { Category } from "@/components/types/all-tiles-categories"

interface TableContainerProps {
  data: Category[]
  columns: ColumnDef<Category>[]
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


interface AllTilesCategoriesCotainerProps {
  onEdit: (category: Category) => void
  data?: Category[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}

const AllTilesCategoriesCotainer = ({ onEdit, data, isLoading, isError, error }: AllTilesCategoriesCotainerProps) => {
  const [currentPage, setCurrentPage] = useState(1)



  const columns = createAllTilesCategoriesColumn({
    onEdit,
  })

  let content;
  if (isLoading) {
    content = <p className="text-center py-5">Loading...</p>
  } else if (isError) {
    content = <p>Error: {String(error)}</p>
  } else {
    content = <TableContainer data={data ?? []} columns={columns} />
  }

  console.log(data)

  return (
    <section className="w-full">
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto rounded-[24px] bg-white">
        {/* <TableContainer data={AllTilesCategoriesData} columns={columns} /> */}

        {content}
      </div>
      <div className="mt-[30px] w-full pb-[208px] flex justify-between">
        <p className="font-normal text-[16px] leading-[19.2px] text-[#444444]">Showing 1 to 25 in first entries</p>
        <div>
          <TilePagination currentPage={currentPage} totalPages={10} onPageChange={(page) => setCurrentPage(page)} />
        </div>
      </div>
    </section>
  )
}

export default AllTilesCategoriesCotainer

