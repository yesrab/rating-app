import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRevalidator } from "react-router-dom";
yup.addMethod(
  yup.Schema,
  "isPasswordStrong",
  function (options, errorMessage = "password must me stronger") {
    return this.test("test-is-password-strong", errorMessage, function (value) {
      const { path, createError } = this;

      let isStrong = true;

      if (typeof value == "undefined") {
        return true;
      }

      if (options?.minLowercase) {
        if (!/[a-z]/.test(String(value))) {
          isStrong = false;
        }
      }
      if (options?.minUppercase) {
        if (!/[A-Z]/.test(String(value))) {
          isStrong = false;
        }
      }
      if (options?.minNumbers) {
        if (!/\d/.test(String(value))) {
          isStrong = false;
        }
      }
      if (options?.minSymbols) {
        if (!/\W/.test(String(value))) {
          isStrong = false;
        }
      }

      return (
        isStrong ||
        createError({
          path,
          message: errorMessage,
        })
      );
    });
  },
);

const schema = yup.object().shape({
  name: yup.string().required("Please enter your name").min(8).max(60),
  email: yup.string().required("Please enter your email address").email(),
  password: yup.string().required("Please enter your password").min(8).max(16).isPasswordStrong(
    {
      minUppercase: 1,
      minSymbols: 1,
    },
    "password should contain at least 1 upper case letter and 1 symbol",
  ),
  address: yup.string().required("Please enter your home address").max(400),
  persona: yup.string().required("Please select a persona"),
});

const AddUser = ({ toggleModal }) => {
  const revalidator = useRevalidator();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  async function handleFormSubmtion(data) {
    console.log(data);
    const REMOTE_URL = "/api/v1/account/signup/";
    const addUserRequest = new Request(REMOTE_URL, {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    try {
      const response = await fetch(addUserRequest);
      const data = await response.json();
      if (data.status === "success") {
        toast.success(`${data.persona} added!`);
        toggleModal();
        revalidator.revalidate();
      }
      if (data.status === "error") {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    // submit(data, { method: "POST", encType: "application/json" });
  }

  return (
    <div className='bg-[#e7e3e2] p-2 w-[50vw] rounded-md border-tgOrange border-2 font-cinacav'>
      <span className='flex items-center justify-between gap-3'>
        <h3 className='text-2xl mr-2'>Add a new User</h3>
        <button
          onClick={toggleModal}
          className='hover:bg-red-600 p-1 hover:text-white duration-200 rounded-full aspect-square font-sans'
        >
          X
        </button>
      </span>
      <form onSubmit={handleSubmit(handleFormSubmtion)} method='post'>
        <label name='name' className='flex flex-col'>
          Name
          <input
            htmlFor='name'
            className='text-black my-1 p-2 rounded-md'
            placeholder='John doe'
            type='text'
            {...register("name")}
          />
          <pre className={`text-red-600 text-sm ${errors.name ? null : "invisible"}`}>
            {errors.name?.message}!
          </pre>
        </label>
        <label name='email' className='flex flex-col'>
          Email
          <input
            htmlFor='email'
            className='text-black my-1 p-2 rounded-md'
            placeholder='john@example.com'
            type='text'
            {...register("email")}
          />
          <pre className={`text-red-600 text-sm ${errors.email ? null : "invisible"}`}>
            {errors.email?.message}!
          </pre>
        </label>
        <label name='password' className='flex flex-col'>
          Password
          <input
            htmlFor='password'
            className='text-black my-1 p-2 rounded-md'
            placeholder='********'
            type='password'
            {...register("password")}
          />
          <pre className={`text-red-600 text-sm ${errors.password ? null : "invisible"}`}>
            {errors.password?.message}!
          </pre>
        </label>
        <label name='address' className='flex flex-col'>
          Address
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
          <span>
            <select className='rounded-md' name='persona' id='persona' {...register("persona")}>
              <option value='' disabled selected>
                Select persona
              </option>
              <option value='admin'>Admin</option>
              <option value='user'>User</option>
              <option value='owner'>Owner</option>
            </select>
            <pre className={`text-red-600 text-sm ${errors.persona ? null : "invisible"}`}>
              {errors.persona?.message}!
            </pre>
          </span>
          <button
            type='submit'
            className='border-2 border-[#797977] my-2  rounded-md hover:bg-white hover:font-semibold hover:text-black px-3 duration-100 ease-in'
          >
            Add user
          </button>
        </span>
      </form>
    </div>
  );
};

export default AddUser;
