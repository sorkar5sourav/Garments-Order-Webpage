import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/shared/Navbar";
import Footer from "../Components/shared/Footer";
const RootLayout = () => {
  return (
    <div className="flex flex-col gap-10 md:gap-20 min-h-screen md:p-5 max-w-[1600px] mx-auto">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
