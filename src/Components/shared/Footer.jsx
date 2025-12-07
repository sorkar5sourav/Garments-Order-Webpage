import { Link } from "react-router";
import logo from "../../assets/Logo.png";
const Footer = () => {
  const fLInks = [
    "Services",
    "Coverage",
    "About Us",
    "Pricing",
    "Blog",
    "Contact",
  ];
  return (
    <footer className="bg-[#0b0b0b] flex flex-col justify-center items-center p-10 md:rounded-2xl">
      <aside className="max-w-3xl text-center">
        <div className="flex justify-center items-end">
          <img src={logo} className="h-10 w-10" alt="" />
          <h3 className="text-3xl text-white font-bold -ms-2.5">zapShift</h3>
        </div>
        <p className="black5 max-w-[80vw] mx-auto mt-4">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments we deliver on
          time, every time.
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
      {/* <nav className="flex items-center gap-4">
        <img src={LD} alt="" />
        <img src={twitter} alt="" />
        <img src={FB} alt="" />
        <img src={YT} alt="" />
      </nav> */}
    </footer>
  );
};

export default Footer;
