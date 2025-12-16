import { Link } from "react-router";
import ErrorIMG from "../../assets/404.png";
import usePageTitle from "../../hooks/usePageTitle";

const ErrorPage = () => {
  usePageTitle("Page Not Found - Garments Order");

  return (
      <div className="relative min-h-screen">
        <img
          src={ErrorIMG}
          className="absolute top-0 left-0 w-full min-h-screen object-left object-cover"
          alt="Error Logo"
        />
        <Link
          to="/"
          className="btn w-60 h-20 absolute top-80 md:top-120 left-20 lg:left-40 text-3xl bg-blue-900 text-white rounded-3xl z-10"
        >
       ⬅️ Go Home
        </Link>
      </div>
  );
};

export default ErrorPage;
