
import {
  FaUsers,
  FaBoxOpen,
  FaPlus,
  FaClock,
  FaCheckSquare,
  FaUserCircle,
  FaSearch,
  FaMoneyBill,
} from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";
import { Link, NavLink, Outlet } from "react-router";
import useRole from "../hooks/useRole";
import logoImg from "../assets/Logo.png";
import useAuth from "../hooks/useAuth";
import ThemeToggle from "../Components/atoms/ThemeToggle";

const DashboardLayout = () => {
 const { user } = useAuth();
  const { role } = useRole();
  return (
    <div className="drawer lg:drawer-open w-full min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex-1">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300 shadow-sm">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost lg:hidden"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="flex-1 px-4">
            <span className="text-lg font-semibold">Garments Order Dashboard</span>
          </div>
          <ThemeToggle />
          <div className="dropdown dropdown-end flex items-center">
             
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={user?.photoURL || "https://via.placeholder.com/150"}
                    alt={user?.displayName || "User"}
                    title={user?.displayName || "User"}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a>{user?.email}</a>
                </li>
              </ul>
               <p className="ml-2 font-semibold">
                  {user?.displayName || "User"}
                </p>
            </div>
        </nav>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <Link to="/">
                <img src={logoImg} alt="" />
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
              >
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="is-drawer-close:hidden">Home page</span>
              </Link>
            </li>

            {/* buyer only links */}
            {role === "buyer" && (
              <>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Orders"
                    to="/dashboard/my-orders"
                  >
                    <FaClipboardList />
                    <span className="is-drawer-close:hidden">My Orders</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Track Order"
                    to="/dashboard/track-order"
                  >
                    <FaSearch />
                    <span className="is-drawer-close:hidden">Track Order</span>
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payment History"
                    to="/dashboard/payment-history"
                  >
                    <FaMoneyBill />
                    <span className="is-drawer-close:hidden">Payment History</span>
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Profile"
                    to="/dashboard/profile"
                  >
                    <FaUserCircle />
                    <span className="is-drawer-close:hidden">My Profile</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* admin only links */}
            {role === "admin" && (
              <>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Users"
                    to="/dashboard/manage-users"
                  >
                    <FaUsers />
                    <span className="is-drawer-close:hidden">Manage Users</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="All Products"
                    to="/dashboard/all-products"
                  >
                    <FaBoxOpen />
                    <span className="is-drawer-close:hidden">All Products</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="All Orders"
                    to="/dashboard/all-orders"
                  >
                    <FaClipboardList />
                    <span className="is-drawer-close:hidden">All Orders</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* manager only links */}
            {role === "manager" && (
              <>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Add Product"
                    to="/dashboard/add-product"
                  >
                    <FaPlus />
                    <span className="is-drawer-close:hidden">Add Product</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage Products"
                    to="/dashboard/manage-products"
                  >
                    <FaBoxOpen />
                    <span className="is-drawer-close:hidden">
                      Manage Products
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Pending Orders"
                    to="/dashboard/pending-orders"
                  >
                    <FaClock />
                    <span className="is-drawer-close:hidden">
                      Pending Orders
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Approve Orders"
                    to="/dashboard/approved-orders"
                  >
                    <FaCheckSquare />
                    <span className="is-drawer-close:hidden">
                      Approve Orders
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Profile"
                    to="/dashboard/manager-profile"
                  >
                    <FaUserCircle />
                    <span className="is-drawer-close:hidden">My Profile</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
