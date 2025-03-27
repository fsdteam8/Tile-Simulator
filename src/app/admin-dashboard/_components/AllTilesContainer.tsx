"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

const AllTilesContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <section className="w-full">
    <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto  rounded-[24px] bg-white">
    <TableContainer data={AllTilesData} columns={AllTilesColumn} />
    </div>
    <div className="mt-[30px]  w-full pb-[208px]  flex justify-between">
      <p className="font-normal text-base leading-[120%] text-secondary-100">
      Showing 1-10 from 100
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
  );
};

export default AllTilesContainer;
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { AllTilesColumn } from "./AllTilesColumn";
import { AllTilesData, AllTilesDataType } from "./AllTilesData";
import TilePagination from "@/components/ui/TilePagination";



const TableContainer = ({
  data,
  columns,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: ColumnDef<AllTilesDataType>[];
}) => {
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <DataTable table={table} columns={columns}/>
    </>
  );
};
