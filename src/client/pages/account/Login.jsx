import React, { useContext, useEffect } from "react";
import { Form, useNavigate, useSubmit, redirect } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import toast from "react-hot-toast";
import { LoginContext } from "../../context/loginContext";

export const action = async ({ dispatch, request, params }) => {
  console.log("loginAcction fired");
  const userData = await request.json();
  const REMOTE_URL = "/api/v1/account/login/";
  const loginRequest = new Request(REMOTE_URL, {
    method: "post",
    body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" },
  });
  const response = fetch(loginRequest);
  response.then((resolvedResponce) =>
    resolvedResponce.json().then((data) => {
      console.log(data);
      if (data.status == "success") {
        dispatch({ type: "LOGIN", payload: data });
        if (data.status == "success") {
          return redirect("/");
        }
      }
    }),
  );
  toast.promise(response, {
    loading: "Logging in...",
    success: "Success",
    error: "oops some error has occured...",
  });
  return null;
};

const schema = yup.object().shape({
  email: yup.string().required("Please enter your email address").email(),
  password: yup.string().required("Please enter your password").min(8).max(16),
});

const Login = () => {
  const navigator = useNavigate();
  const submit = useSubmit();
  const { loginState, dispatch } = useContext(LoginContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  function handleFormSubmtion(data) {
    submit(data, { method: "POST", encType: "application/json" });
  }

  useEffect(() => {
    if (loginState.login) {
      navigator("/");
    }
  }, [loginState]);

  useEffect(() => {
    const toastId = toast("admin email : admin@admin.com , passowrd : adminadmin");
    return () => {
      toast.dismiss(toastId);
    };
  }, []);
  return (
    <main className='min-h-screen bg-[rgb(34,193,195)] bg-loginGradient font-cinacav'>
      <div className='min-h-[90vh] min-w-full p-3 flex gap-4 flex-grow justify-center items-center'>
        <div className='text-white max-w-[60vw] md:max-w-[24vw] md:min-w-[23vw]'>
          <h2 className='text-4xl my-4'>Login</h2>
          <Form
            onSubmit={handleSubmit(handleFormSubmtion)}
            method='post'
            className='flex flex-col my-2'
          >
            <label name='email' className='flex flex-col'>
              Email
              <input
                htmlFor='email'
                className='text-black my-2 p-2 rounded-md'
                placeholder='joe@example.com'
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
                className='text-black my-2 p-2 rounded-md'
                placeholder='********'
                type='password'
                {...register("password")}
              />
              <pre className={`text-red-600 text-sm ${errors.password ? null : "invisible"}`}>
                {errors.password?.message}!
              </pre>
            </label>
            <button
              type='submit'
              className='border-2 my-2  rounded-md hover:bg-white hover:font-semibold hover:text-yellow-400 duration-100 ease-in'
            >
              Login
            </button>
          </Form>
          <hr />
          <div className='w-full'>
            <h4 className='text-sm text-center my-2'>Dont have an account?</h4>
            <button
              onClick={() => {
                navigator("/signup", { replace: true });
              }}
              className='border-2 my-2 rounded-md w-full hover:bg-white hover:font-semibold hover:text-yellow-400 duration-100 ease-in'
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
