import React, { useContext } from "react";
import { redirect } from "react-router-dom";
import { LoginContext } from "../../context/loginContext";
import DashboardHeader from "../../components/DashboardHeader";
export const loader = ({ loginState, request, params }) => {
  console.log("dasboard loader");
  if (!loginState.login) {
    console.log("please login");
    return redirect("/login");
  }
  return null;
};
const DashBoard = () => {
  const { loginState, dispatch } = useContext(LoginContext);
  return (
    <div className='font-cinacav min-h-screen bg-[#b4b2b0] p-3'>
      <DashboardHeader />
      <main className='p-2'>
        <div className='flex gap-3 justify-between items-center flex-wrap'>
          <span>
            <h1 className='text-2xl'>Hello {loginState.name}!</h1>
            <p>User type : {loginState.persona}</p>
          </span>
          <span className='flex flex-wrap gap-2'>
            <button className='bg-[#2d2d2d] text-white px-3 rounded-md'>Add user +</button>
            <button className='bg-[#2d2d2d] text-white px-3 rounded-md'>Add store +</button>
          </span>
        </div>
      </main>
    </div>
  );
};

export default DashBoard;
