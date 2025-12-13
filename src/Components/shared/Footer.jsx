import { Link } from "react-router";
import logo from "../../assets/Logo.png";
import FB from "../../assets/FB.png";
import LD from "../../assets/LD.png";
import twitter from "../../assets/twitter.png";
import YT from "../../assets/YT.png";
const Footer = () => {
  const fLInks = [
    "Services",
    "Dashboard",
    "About Us",
    "Login",
    "Blog",
    "Contact",
  ];
  return (
    <footer className="bg-[#38211e] flex flex-col w-full justify-center items-center p-10 md:rounded-2xl">
      <aside className="max-w-3xl md:text-center">
        <div className="flex justify-center items-center flex-col">
          <img src={logo} className="w-40" alt="" />
          <h1 className="text-3xl font-bold text-[#105e91]">
            Garments Order & <br />
            <span className="text-[#F08024]">Production Tracker System</span>
          </h1>
        </div>
        <p className="black5 max-w-[80vw] mx-auto mt-4">
          The Garments Order & Production Tracker System is a web-based platform
          designed to help small and medium-sized garment factories manage their
          production workflow.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 black5 my-10 justify-center items-center">
          {fLInks.map((link, index) => (
            <Link
              key={index}
              className="hover:text-primary "
              to={`/${link.toLowerCase().replace(" ", "-")}`}
            >
              {link}
            </Link>
          ))}
        </div>
        <p className="black5">
          Copyright © {new Date().getFullYear()} - All right reserved
        </p>
      </aside>
      <nav className="flex items-center gap-4">
        <img src={LD} alt="" />
        <img src={twitter} alt="" />
        <img src={FB} alt="" />
        <img src={YT} alt="" />
      </nav>
    </footer>
  );
};

export default Footer;
