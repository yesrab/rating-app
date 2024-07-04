import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminStoreTable from "./AdminStoreTable";
import AdminUserTable from "./AdminUserTable";

const UserDetails = ({ loginState }) => {
  const [userCount, setUserCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const COUNT_URL = "/api/v1/account/count";
    const controller = new AbortController();
    const getCounts = async () => {
      const countRequest = new Request(COUNT_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
        signal: controller.signal,
      });
      try {
        const response = await fetch(countRequest);
        const data = await response.json();
        if (data.status == "success") {
          setUserCount(data.userCount);
          setRatingCount(data.ratingsCount);
          setStoreCount(data.storeCount);
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          toast.error(e.message);
        }
      }
    };
    if (loginState.persona == "admin") {
      getCounts();
    }
    return () => {
      controller.abort();
    };
  }, [loginState]);
  return (
    <div className='flex m-2'>
      <div className='my-2'>
        <div className='flex gap-3'>
          <div className='bg-[#f4f0ef] rounded-md p-3'>
            <h3>Total Users</h3>
            {userCount}
          </div>
          <div className='bg-[#f4f0ef] rounded-md p-3'>
            <h3>Total Stores</h3>
            {storeCount}
          </div>
          <div className='bg-[#f4f0ef] rounded-md p-3'>
            <h3>Total Ratings</h3>
            {ratingCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
