"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

const AllSubmissionContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { search } = useSearchTile();

  const dealy = 500;
  const debounceValue = useDebounce(search, dealy);

  useEffect(() => {
    setCurrentPage(1);
  }, [debounceValue]);

  const { data } = useQuery<SubmissionApiResponse>({
    queryKey: ["all-submission", currentPage, debounceValue],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders?paginate_count=8&page=${currentPage}&query=${debounceValue}`
      ).then((res) => res.json()),
  });


  return (
    <div className="w-full">
      <div className="w-full shadow-[0px_0px_22px_8px_#C1C9E4] h-auto rounded-[24px] bg-white">
        <TableContainer
          data={data?.data?.data ?? []}
          columns={AllSubmissionColumn}
        />
      </div>
      {/* pagination  */}
      <div className="pb-[208px]">
        {data && data?.total_pages > 1 && (
          <div className="mt-[30px] w-full flex justify-between">
            <p className="font-normal text-base leading-[120%] text-secondary-100">
              Showing {data?.current_page} from {data?.total_pages}
            </p>
            <div>
              <TilePagination
                currentPage={currentPage}
                totalPages={data?.total_pages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSubmissionContainer;
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import TilePagination from "@/components/ui/TilePagination";
import { AllSubmissionColumn } from "./AllSubmissionColumn";
import { useQuery } from "@tanstack/react-query";
import {
  Submission,
  SubmissionApiResponse,
} from "@/components/types/submissionAllDataType";
import { useSearchTile } from "@/components/zustand/allTiles/allTiles";
import { useDebounce } from "@/hooks/useDebounce";

const TableContainer = ({
  data,
  columns,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: ColumnDef<Submission>[];
}) => {
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <DataTable table={table} columns={columns} />
    </>
  );
};
