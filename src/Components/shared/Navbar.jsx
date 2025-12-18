import { Link, NavLink, useLocation } from "react-router";
import Logo from "../atoms/Logo";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import ThemeToggle from "../atoms/ThemeToggle";

const NavBar = () => {
  const { user, logOut } = useAuth();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  const handleLogOut = () => {
    logOut()
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "btn btn-primary rounded-full text-base-300" : "";

  useEffect(() => {
    if (location.pathname !== "/") return;

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const aboutUsSection = document.getElementById("about-us");
    const footerSection = document.getElementById("footer");

    if (aboutUsSection) observer.observe(aboutUsSection);
    if (footerSection) observer.observe(footerSection);

    const handleScroll = () => {
      const aboutUsRect = aboutUsSection?.getBoundingClientRect();
      const footerRect = footerSection?.getBoundingClientRect();

      if (aboutUsRect && footerRect) {
        const isAboutUsVisible =
          aboutUsRect.top < window.innerHeight / 2 &&
          aboutUsRect.bottom > window.innerHeight / 2;
        const isFooterVisible =
          footerRect.top < window.innerHeight / 2 &&
          footerRect.bottom > window.innerHeight / 2;

        if (!isAboutUsVisible && !isFooterVisible) {
          setActiveSection("home");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAboutUsClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      scrollToSection("about-us");
    }
  };

  const handleContactClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      scrollToSection("footer");
    }
  };

  const getHomepageButtonClass = (section) => {
    if (location.pathname !== "/") return "";
    return activeSection === section
      ? "btn btn-primary rounded-full text-base-300"
      : "";
  };

  const beforeLoginLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={
            location.pathname === "/"
              ? getHomepageButtonClass("home")
              : navLinkClass
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/products" className={navLinkClass}>
          All Products
        </NavLink>
      </li>

      <li>
        <a
          href="#about-us"
          onClick={handleAboutUsClick}
          className={getHomepageButtonClass("about-us")}
        >
          About Us
        </a>
      </li>

      <li>
        <a
          href="#footer"
          onClick={handleContactClick}
          className={getHomepageButtonClass("footer")}
        >
          Contact
        </a>
      </li>
    </>
  );

  const afterLoginLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={
            location.pathname === "/"
              ? getHomepageButtonClass("home")
              : navLinkClass
          }
        >
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
    <div className="navbar bg-base-200 md:rounded-2xl shadow-sm px-5 lg:py-5 sticky top-0 z-50">
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
        <Link to="/" className="ml-2 flex items-center">
          <Logo></Logo>
          {/* <img src={LogoText} alt="" /> */}
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal items-center px-1">{links}</ul>
      </div>
      <div className="navbar-end gap-2">
        <ThemeToggle />
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
                className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52"
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
              className="btn btn-primary rounded-lg text-base-300 font-bold"
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
              className="btn btn-primary rounded-lg text-base-300"
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
