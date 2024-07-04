import React, { useContext } from "react";
import { LoginContext } from "../context/loginContext";

const DashboardHeader = () => {
  const { loginState, dispatch } = useContext(LoginContext);
  return (
    <header className='flex justify-between p-2 bg-[#e7e3e2] rounded-md'>
      <h3 className='text-3xl justify-center'>Dashboard</h3>
      <nav className='flex'>
        <button
          onClick={() => {
            dispatch({ type: "LOGOUT" });
          }}
          className='bg-tgOrange text-white px-3 rounded-md'
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default DashboardHeader;
