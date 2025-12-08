import { Link } from "react-router";
import NavBar from "../../Components/shared/Navbar";
import Footer from "../../Components/shared/Footer";

const ErrorPage = () => {
  return (
    <div className="flex flex-col min-h-screen gap-6 justify-between px-5 items-center max-w-[1440px] mx-auto">
      <NavBar />
      <div className="text-center relative md:rounded-xl overflow-hidden">
        <img
          src="https://syhzhuelbxgnhopnwjgc.supabase.co/storage/v1/object/public/media/blog/404_page_cover.jpg"
          className="w-full"
          alt="Error Logo"
        />
        <Link
          to="/"
          className="btn btn-primary absolute hidden md:flex md:bottom-6 left-1/2 transform -translate-x-1/2 rounded-lg"
        >
          Go Home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default ErrorPage;
