import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import toast from "react-hot-toast";
const columns = [
  {
    accessorKey: "name",
    header: "Store Name",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "email",
    header: "Store Email",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "address",
    header: "Store Address",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "OverallRatings",
    header: "Overall Ratings",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "totalRatingsCount",
    header: "Number of Ratings",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "owner",
    header: "Store Owner",
    cell: (props) => <p>{props.getValue()}</p>,
  },
];
const AdminStoreTable = ({ loginState }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const adminTableUrl = "/api/v1/account/table";
    const controller = new AbortController();
    const adminTableRequest = new Request(adminTableUrl, {
      method: "Get",
      header: {
        Authorization: `Bearer ${loginState.token}`,
      },
      signal: controller.signal,
    });
    const getTable = async () => {
      try {
        const response = await fetch(adminTableRequest);
        const data = await response.json();
        console.log(data);
        if (data.status === "success") {
          setData(data.adminStore);
        }
      } catch (e) {
        toast.error(e.message);
      }
    };
    getTable();
  }, []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  // console.log(table.getHeaderGroups());
  return (
    <table className='w-full'>
      <tbody className='text-sm'>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className='border-collapse ' key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                onClick={
                  header.column.getCanSort() ? header.column.getToggleSortingHandler() : null
                }
                className='border p-2 text-sm cursor-pointer  bg-slate-400 text-white'
                key={header.id}
              >
                {header.column.columnDef.header}
                {header.column.getCanSort() &&
                  { asc: " ↑", desc: " ↓" }[header.column.getIsSorted()]}
              </th>
            ))}
          </tr>
        ))}
        {table.getRowModel().rows.map((row) => (
          <tr className='border' key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <th className='border p-2' key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminStoreTable;
