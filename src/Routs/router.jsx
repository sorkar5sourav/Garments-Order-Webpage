import RootLayout from "../Layouts/RootLayout";
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
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../Pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/Payment/PaymentCancel";
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import AdminProducts from "../Pages/Dashboard/Admin/AdminProducts";
import AdminOrders from "../Pages/Dashboard/Admin/AdminOrders";
import ManagerAddProduct from "../Pages/Dashboard/Manager/ManagerAddProduct";
import ManageProducts from "../Pages/Dashboard/Manager/ManageProducts";
import PendingOrders from "../Pages/Dashboard/Manager/PendingOrders";
import ApprovedOrders from "../Pages/Dashboard/Manager/ApprovedOrders";
import ManagerProfile from "../Pages/Dashboard/Manager/ManagerProfile";
import TrackOrder from "../Pages/Dashboard/TrackOrder";
import MyOrders from "../Pages/Dashboard/MyOrders";
import MyProfile from "../Pages/Dashboard/MyProfile";

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
      {
        path: "products",
        element: <AllProducts />,
      },
      {
        path: "products/:id",
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
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
        path: "track-order/:orderId",
        element: <TrackOrder />,
      },
      {
        path: "profile",
        element: <MyProfile />,
      },
      {
        path: "payment/:parcelId",
        element: <Payment />,
      },
      // {
      //   path: 'payment-history',
      //   element: <PaymentHistory />
      // },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled />,
      },
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
