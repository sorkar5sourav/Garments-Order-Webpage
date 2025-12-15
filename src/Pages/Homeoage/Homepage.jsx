import React from "react";
import Banner from "./Banner";
import LatestProducts from "./LeatestProducts";
import HowItWorks from "./HowItWorks";
import CustomerFeedback from "./CustomerFeedback";
import AboutUs from "./AboutUs";
import LeaveReview from "./LeaveReview";

const Homepage = () => {
  return (
    <div className="">
      <Banner/>
      <LatestProducts/>
      <HowItWorks/>
      <CustomerFeedback/>
      <AboutUs/>
      <LeaveReview/>
    </div>
  );
};

export default Homepage;
