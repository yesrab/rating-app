import { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import DashBoard, { loader as dashBoardLoader } from "./pages/dashboard/DashBoard";
import Login, { action as loginAction } from "./pages/account/Login";
import SignUp, { action as signUpAction } from "./pages/account/SignUp";
import { LoginContext } from "./context/loginContext";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const { loginState, dispatch } = useContext(LoginContext);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route
          loader={({ request, params }) => dashBoardLoader({ loginState, request, params })}
          index
          element={<DashBoard />}
        />
        <Route>
          <Route
            path='/login'
            action={({ request, params }) => loginAction({ dispatch, request, params })}
            element={<Login />}
          />
          <Route
            path='/signup'
            action={({ request, params }) => signUpAction({ dispatch, request, params })}
            element={<SignUp />}
          />
        </Route>
      </Route>,
    ),
  );
  return (
    <>
      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            fontFamily: "CDM",
            background: "#319aef",
            boreder: "2px solid white",
            color: "white",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
