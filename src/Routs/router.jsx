import RootLayout from "../Layouts/RootLayout";
import AuthLayout from "../Layouts/AuthLayout";
import Homepage from "../Pages/Homeoage/Homepage";
import { createBrowserRouter } from "react-router";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import AllProducts from "../Pages/Products/AllProducts";
import ProductDetails from "../Pages/Products/ProductDetails";
import BookingForm from "../Pages/Products/BookingForm";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import DashboardLayout from "../Layouts/DashboardLayout";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import AdminProducts from "../Pages/Dashboard/Admin/AdminProducts";
import AdminOrders from "../Pages/Dashboard/Admin/AdminOrders";
import ManagerAddProduct from "../Pages/Dashboard/Manager/ManagerAddProduct";
import ManageProducts from "../Pages/Dashboard/Manager/ManageProducts";
import PendingOrders from "../Pages/Dashboard/Manager/PendingOrders";
import ApprovedOrders from "../Pages/Dashboard/Manager/ApprovedOrders";
import ManagerProfile from "../Pages/Dashboard/Manager/ManagerProfile";
import TrackOrder from "../Pages/Dashboard/Buyer/TrackOrder";
import MyOrders from "../Pages/Dashboard/Buyer/MyOrders";
import MyProfile from "../Pages/Dashboard/Buyer/MyProfile";
import PaymentSuccess from "../Pages/Dashboard/Buyer/Payment/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/Buyer/Payment/PaymentCancelled";
import About from "../Pages/Static/About";
import Contact from "../Pages/Static/Contact";
import Blog from "../Pages/Static/Blog";
import Help from "../Pages/Static/Help";
import Privacy from "../Pages/Static/Privacy";
import Terms from "../Pages/Static/Terms";
// import PaymentHistory from "../Pages/Dashboard/Buyer/Payment/PaymentHistory";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Homepage /> },
      {
        path: "products",
        element: <AllProducts />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "booking/:id",
        element: (
          <PrivateRoute>
            <BookingForm />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
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
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "track-order",
        element: <TrackOrder />,
      },
      {
        path: "track-order/:orderId",
        element: <TrackOrder />,
      },
      {
        path: "profile",
        element: <MyProfile />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },
      // {
      //   path: "payment-history",
      //   element: <PaymentHistory />,
      // },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-products",
        element: (
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        ),
      },
      {
        path: "all-orders",
        element: (
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        ),
      },
      {
        path: "add-product",
        element: (
          <ManagerRoute>
            <ManagerAddProduct />
          </ManagerRoute>
        ),
      },
      {
        path: "manage-products",
        element: (
          <ManagerRoute>
            <ManageProducts />
          </ManagerRoute>
        ),
      },
      {
        path: "pending-orders",
        element: (
          <ManagerRoute>
            <PendingOrders />
          </ManagerRoute>
        ),
      },
      {
        path: "approved-orders",
        element: (
          <ManagerRoute>
            <ApprovedOrders />
          </ManagerRoute>
        ),
      },
      {
        path: "manager-profile",
        element: (
          <ManagerRoute>
            <ManagerProfile />
          </ManagerRoute>
        ),
      },
    ],
  },
  {
    path: "/*",
    element: <ErrorPage />,
  },
]);
