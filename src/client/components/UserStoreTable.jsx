import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import toast from "react-hot-toast";
import RatingSwitch from "./RatingSwitch";
const columns = [
  {
    accessorKey: "storename",
    header: "Store Name",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "storeaddress",
    header: "Store Address",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "overallRating",
    header: "Overall Rating",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "myrating",
    header: "My rating",
    enableSorting: false,
    cell: RatingSwitch,
  },
];
const UserStoreTable = ({ loginState }) => {
  const [data, setData] = useState([]);
  const getTable = async (adminTableRequest) => {
    try {
      const response = await fetch(adminTableRequest);
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        setData(data.userStores);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  useEffect(() => {
    const adminTableUrl = `/api/v1/account/ratingTable/${loginState.id}`;
    const controller = new AbortController();
    const adminTableRequest = new Request(adminTableUrl, {
      method: "Get",
      header: {
        Authorization: `Bearer ${loginState.token}`,
      },
      signal: controller.signal,
    });

    getTable(adminTableRequest);
  }, []);

  const updateData = async (rowIndex, columnId, val) => {
    setData((prev) =>
      prev.map((row, index) => (index === rowIndex ? { ...prev[rowIndex], [columnId]: val } : row)),
    );

    const storeId = data[rowIndex]._id;
    // console.log(data[rowIndex]);
    const updateUrl = `/api/v1/store/rate`;
    const updateRequest = new Request(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginState.token}`,
      },
      body: JSON.stringify({ userID: loginState.id, storeId, userRating: val }),
    });

    try {
      const response = await fetch(updateRequest);
      const result = await response.json();
      if (result.status !== "success") {
        throw new Error(result.message);
      }

      const adminTableUrl = `/api/v1/account/ratingTable/${loginState.id}`;

      const adminTableRequest = new Request(adminTableUrl, {
        method: "Get",
        header: {
          Authorization: `Bearer ${loginState.token}`,
        },
      });

      getTable(adminTableRequest);
      toast.success("Rating updated successfully!");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData,
    },
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

export default UserStoreTable;
