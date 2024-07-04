import React, { useContext, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRevalidator } from "react-router-dom";
import { LoginContext } from "../context/loginContext";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter the store name")
    .min(8, "Name must be at least 8 characters")
    .max(60, "Name must be at most 60 characters"),
  email: yup
    .string()
    .required("Please enter the store email address")
    .email("Please enter a valid email address"),
  address: yup
    .string()
    .required("Please enter the store address")
    .max(400, "Address must be at most 400 characters"),
  owner: yup.string().required("Please select an owner"),
});

const AddStore = ({ toggleModal }) => {
  const { loginState, dispatch } = useContext(LoginContext);
  const revalidator = useRevalidator();
  const [owners, setOwners] = useState([]);
  useEffect(() => {
    const REMOTE_URL = "/api/v1/account/user/owner";
    const controller = new AbortController();
    const getOwners = async () => {
      const ownerRequest = new Request(REMOTE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loginState.token}`,
        },
        signal: controller.signal,
      });
      try {
        const response = await fetch(ownerRequest);
        const data = await response.json();
        console.log(data.data);
        if (data.status === "success") {
          setOwners(data?.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getOwners();

    return () => {
      controller.abort("cleanup");
    };
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  async function handleFormSubmtion(data) {
    console.log(data);
    const REMOTE_URL = "/api/v1/store/create";
    const addStoreRequest = new Request(REMOTE_URL, {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginState.token}`,
      },
    });
    try {
      const response = await fetch(addStoreRequest);
      const data = await response.json();
      if (data.status === "success") {
        toast.success(`${data.name ? data.name : "store"} added!`);
        toggleModal();
        revalidator.revalidate();
      }
      if (data.status === "error") {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='bg-[#e7e3e2] p-2 w-[50vw] rounded-md border-tgOrange border-2 font-cinacav'>
      <span className='flex items-center justify-between gap-3'>
        <h3 className='text-2xl mr-2'>Add a new Store</h3>
        <button
          onClick={toggleModal}
          className='hover:bg-red-600 p-1 hover:text-white duration-200 rounded-full aspect-square font-sans'
        >
          X
        </button>
      </span>
      <form onSubmit={handleSubmit(handleFormSubmtion)} method='post'>
        <label name='name' className='flex flex-col'>
          Store Name
          <input
            htmlFor='name'
            className='text-black my-1 p-2 rounded-md'
            placeholder='seven 11'
            type='text'
            {...register("name")}
          />
          <pre className={`text-red-600 text-sm ${errors.name ? null : "invisible"}`}>
            {errors.name?.message}!
          </pre>
        </label>
        <label name='email' className='flex flex-col'>
          Store Email id
          <input
            htmlFor='email'
            className='text-black my-1 p-2 rounded-md'
            placeholder='seven@eleven.com'
            type='text'
            {...register("email")}
          />
          <pre className={`text-red-600 text-sm ${errors.email ? null : "invisible"}`}>
            {errors.email?.message}!
          </pre>
        </label>
        <label name='owner' className='flex flex-col'>
          select Owner
          <select {...register("owner")} name='owner' className='my-2 rounded-md p-2' id='owner'>
            <option value='' disabled selected>
              Select Owner
            </option>
            {owners.length
              ? owners?.map((owner) => {
                  return (
                    <option key={owner._id} value={owner._id}>
                      {owner.name}
                    </option>
                  );
                })
              : null}
          </select>
          <pre className={`text-red-600 text-sm ${errors.owner ? null : "invisible"}`}>
            {errors.owner?.message}!
          </pre>
        </label>
        <label name='address' className='flex flex-col'>
          Store Address
          <textarea
            htmlFor='address'
            rows='3'
            className='text-black mt-1 p-2 rounded-md resize-none'
            placeholder='abc St. 123 lane'
            type='address'
            {...register("address")}
          />
          <pre className={`text-red-600 text-sm ${errors.address ? null : "invisible"}`}>
            {errors.address?.message}!
          </pre>
        </label>
        <span className='flex justify-between my-2'>
          <button
            className='border-2 border-red-700 hover:bg-red-700 px-2 rounded-md hover:font-semibold hover:text-white duration-200'
            onClick={toggleModal}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='border-2 border-[#797977] my-2  rounded-md hover:bg-white hover:font-semibold hover:text-black px-3 duration-100 ease-in'
          >
            Add Store
          </button>
        </span>
      </form>
    </div>
  );
};

export default AddStore;
