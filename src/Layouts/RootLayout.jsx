import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/shared/Navbar";
import Footer from "../Components/shared/Footer";
const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen mx-auto">
      <Navbar />
      <div className="flex-1 mt-24">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
