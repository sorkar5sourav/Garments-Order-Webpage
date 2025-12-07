import RootLayout from "../Layouts/RootLayout";
import Homepage from "../Pages/Homeoage/Homepage";
import { createBrowserRouter } from "react-router";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Homepage /> },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
