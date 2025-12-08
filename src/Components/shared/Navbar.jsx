import { Link, NavLink } from "react-router";
import Logo from "../atoms/Logo";
import useAuth from "../../hooks/useAuth";

const NavBar = () => {
  const { user, logOut } = useAuth();

  const handleLogOut = () => {
    logOut()
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "btn btn-primary rounded-full text-black" : "";
  //Home, All-Product, About Us, Contact, Login, and Register.
  //Home, All-Products, Dashboard, User Avatar, and Logout Button.
  const links = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Services
        </NavLink>
      </li>

      <li>
        <NavLink to="/products" className={navLinkClass}>
          All Products
        </NavLink>
      </li>

      <li>
        <NavLink to="/contact" className={navLinkClass}>
          Contact
        </NavLink>
      </li>

      {user ? (
        <>
          <li>
            <NavLink to="/dashboard/my-parcels" className={navLinkClass}>
              My Parcels
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/about-us" className={navLinkClass}>
              About Us
            </NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div className="navbar bg-base-100 rounded-2xl shadow-sm p-5 ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <button className="btn btn-ghost text-xl">
          <Logo></Logo>
        </button>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal items-center px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <a
            onClick={handleLogOut}
            className="btn btn-primary rounded-lg text-black font-bold"
          >
            Log Out
          </a>
        ) : (
          <div className="flex items-center">
            <Link className="btn rounded-lg" to="/login">
              Sign in
            </Link>
            <Link
              className="btn btn-primary rounded-lg text-black ml-4"
              to="/register"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
