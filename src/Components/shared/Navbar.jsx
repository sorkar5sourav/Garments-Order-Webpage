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

  // Before Login: Home, All-Products, About Us, Contact, Login, Register
  // After Login: Home, All-Products, Dashboard, Logout
  const beforeLoginLinks = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/products" className={navLinkClass}>
          All Products
        </NavLink>
      </li>

      <li>
        <NavLink to="/about-us" className={navLinkClass}>
          About Us
        </NavLink>
      </li>

      <li>
        <NavLink to="/contact" className={navLinkClass}>
          Contact
        </NavLink>
      </li>
    </>
  );

  const afterLoginLinks = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/products" className={navLinkClass}>
          All Products
        </NavLink>
      </li>

      <li>
        <NavLink to="/dashboard" className={navLinkClass}>
          Dashboard
        </NavLink>
      </li>
    </>
  );

  const links = user ? afterLoginLinks : beforeLoginLinks;
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
      <div className="navbar-end gap-2">
        {user ? (
          <>
            {/* User Avatar with dropdown */}
            <div className="dropdown dropdown-end">
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
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a>{user?.displayName || "User"}</a>
                </li>
                <li>
                  <a>{user?.email}</a>
                </li>
                <li>
                  <a onClick={handleLogOut}>Logout</a>
                </li>
              </ul>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogOut}
              className="btn btn-primary rounded-lg text-black font-bold"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link className="btn rounded-lg" to="/login">
              Login
            </Link>
            <Link
              className="btn btn-primary rounded-lg text-black"
              to="/register"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
