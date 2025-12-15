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
  ];
  return (
    <footer className="bg-[#38211e] w-full p-10 md:rounded-2xl">
         <div className="flex justify-center lg:justify-start items-center flex-col mb-6">
            <img src={logo} className="w-40" alt="" />
            <h1 className="text-3xl font-bold text-[#105e91] text-center lg:text-left mt-4">
              Garments Order & <br />
              <span className="text-[#F08024]">Production Tracker System</span>
            </h1>
          </div>
      {/* Two aside sections side by side on larger screens, stacked on small screens */}
      <div className="flex flex-col items-center lg:flex-row gap-10 mb-10">
        {/* Left/Top aside - Main content */}
        <aside className="flex-1 max-w-3xl">
       
          <p className="black5 max-w-[80vw] mx-auto lg:mx-0 lg:max-w-none mb-6 text-center lg:text-left">
            The Garments Order & Production Tracker System is a web-based platform
            designed to help small and medium-sized garment factories manage their
            production workflow.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 black5 my-6 justify-around lg:justify-start items-center">
            {fLInks.map((link, index) => (
              <Link
                key={index}
                className="hover:text-primary text-center"
                to={`/${link.toLowerCase().replace(" ", "-")}`}
              >
                {link}
              </Link>
            ))}
          </div>
        </aside>

        {/* Right/Bottom aside - Contact section */}
        <aside className="flex-1 max-w-3xl">
          <div className="border-t lg:border-t-0 lg:border-l border-gray-600 pt-8 lg:pt-0 lg:pl-8">
            <h3 className="text-xl font-semibold text-white mb-6 text-center lg:text-left">Contact Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center lg:text-left">
              <div>
                <h4 className="text-lg font-medium text-[#F08024] mb-3">Admin & Manager</h4>
                <p className="black5 mb-2">
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href="mailto:admin@garmentsorder.com"
                    className="hover:text-[#F08024] transition-colors"
                  >
                    admin@garmentsorder.com
                  </a>
                </p>
                <p className="black5">
                  <span className="font-medium">Manager:</span>{" "}
                  <a
                    href="mailto:manager@garmentsorder.com"
                    className="hover:text-[#F08024] transition-colors"
                  >
                    manager@garmentsorder.com
                  </a>
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-[#F08024] mb-3">Phone Numbers</h4>
                <p className="black5 mb-2">
                  <span className="font-medium">Support:</span>{" "}
                  <a
                    href="tel:+15551234567"
                    className="hover:text-[#F08024] transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </p>
                <p className="black5 mb-2">
                  <span className="font-medium">Sales:</span>{" "}
                  <a
                    href="tel:+15559876543"
                    className="hover:text-[#F08024] transition-colors"
                  >
                    +1 (555) 987-6543
                  </a>
                </p>
                <p className="black5">
                  <span className="font-medium">Emergency:</span>{" "}
                  <a
                    href="tel:+15551112222"
                    className="hover:text-[#F08024] transition-colors"
                  >
                    +1 (555) 111-2222
                  </a>
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom section - Copyright and Social Media */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-600">
        <p className="black5 text-center lg:text-left">
          Copyright © {new Date().getFullYear()} - All right reserved
        </p>
        <nav className="flex items-center gap-4">
          <img src={LD} alt="LinkedIn" className="w-6 h-6" />
          <img src={twitter} alt="Twitter" className="w-6 h-6" />
          <img src={FB} alt="Facebook" className="w-6 h-6" />
          <img src={YT} alt="YouTube" className="w-6 h-6" />
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
