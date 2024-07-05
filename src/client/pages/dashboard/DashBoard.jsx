import React, { useContext, useState } from "react";
import { redirect } from "react-router-dom";
import { LoginContext } from "../../context/loginContext";
import DashboardHeader from "../../components/DashboardHeader";
import ModelWrapper from "../../components/ModalWrapper";
import AddUser from "../../components/AddUser";
import AddStore from "../../components/AddStore";
import UserDetails from "../../components/UserDetails";
import AdminStoreTable from "../../components/AdminStoreTable";
import AdminUserTable from "../../components/AdminUserTable";
import UserStoreTable from "../../components/UserStoreTable";

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
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const toggleUser = () => {
    setIsUserOpen(!isUserOpen);
  };
  const toggleStore = () => {
    setIsStoreOpen(!isStoreOpen);
  };

  return (
    <div className='font-cinacav min-h-screen bg-[#b4b2b0] p-3'>
      <DashboardHeader />
      <main className='p-2'>
        <div className='flex gap-3 justify-between items-center flex-wrap'>
          <span>
            <h1 className='text-2xl'>Hello {loginState.name}!</h1>
            <p>User type : {loginState.persona}</p>
          </span>
          {loginState.persona === "admin" ? (
            <span className='flex flex-wrap gap-2'>
              <button onClick={toggleUser} className='bg-[#2d2d2d] text-white px-3 rounded-md'>
                Add user +
              </button>
              <button onClick={toggleStore} className='bg-[#2d2d2d] text-white px-3 rounded-md'>
                Add store +
              </button>
            </span>
          ) : null}
        </div>
        <ModelWrapper toggleModal={toggleUser} open={isUserOpen}>
          <AddUser toggleModal={toggleUser} />
        </ModelWrapper>
        <ModelWrapper toggleModal={toggleStore} open={isStoreOpen}>
          <AddStore toggleModal={toggleStore} />
        </ModelWrapper>
        {loginState.persona === "admin" ? (
          <>
            <div>
              <UserDetails loginState={loginState} />
            </div>
            <div className='my-3'>
              <AdminUserTable loginState={loginState} />
            </div>
            <hr className='border border-tgOrange' />
            <div className='my-3'>
              <AdminStoreTable loginState={loginState} />
            </div>
          </>
        ) : null}
        {loginState.persona === "user" ? (
          <>
            <div className='my-3'>
              <UserStoreTable loginState={loginState} />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default DashBoard;
