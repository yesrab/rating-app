import React, { useContext, useEffect } from "react";
import { Form, redirect, useActionData, useNavigate, useSubmit } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/loginContext";

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

export const action = async ({ dispatch, request, params }) => {
  console.log("loginAcction fired");
  const REMOTE_URL = "/api/v1/account/signup/";
  const userData = await request.json();

  const signupRequest = new Request(REMOTE_URL, {
    method: "post",
    body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" },
  });
  const response = fetch(signupRequest);
  response.then((resolvedResponce) =>
    resolvedResponce.json().then((data) => {
      dispatch({ type: "LOGIN", payload: data });
      if (data.status == "success") {
        return redirect("/");
      }
    }),
  );
  toast.promise(response, {
    loading: "Signing up...",
    success: "Account created!",
    error: "oops some error has occured...",
  });
  return null;
};

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
});

const SignUp = () => {
  const navigator = useNavigate();
  const submit = useSubmit();
  const { loginState, dispatch } = useContext(LoginContext);
  useEffect(() => {
    if (loginState.login) {
      navigator("/");
    }
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  function handleFormSubmtion(data) {
    // console.log(data);
    submit(data, { method: "POST", encType: "application/json" });
  }
  return (
    <main className='min-h-screen bg-[rgb(34,193,195)] bg-loginGradient font-cinacav'>
      <div className='min-h-[90vh] min-w-full p-3 flex gap-4 flex-grow justify-center items-center'>
        <div className='text-white max-w-[60vw] md:max-w-[30vw] md:min-w-[25vw]'>
          <h2 className='text-3xl mb-2'>Create your account</h2>
          <Form
            onSubmit={handleSubmit(handleFormSubmtion)}
            method='post'
            className='flex flex-col my-1'
          >
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
            <button
              type='submit'
              className='border-2 my-1  rounded-md hover:bg-white hover:font-semibold hover:text-yellow-400 duration-100 ease-in'
            >
              Sign up
            </button>
          </Form>
          <hr />
          <div className='w-full'>
            <h4 className='text-sm text-center my-1'>Already have an account?</h4>
            <button
              onClick={() => {
                navigator("/login", { replace: true });
              }}
              className='border-2 my-1 rounded-md w-full hover:bg-white hover:font-semibold hover:text-yellow-400 duration-100 ease-in'
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
