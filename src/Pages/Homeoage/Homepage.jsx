import React from "react";
import Banner from "./Banner";
import StatsOverview from "./StatsOverview";
import LatestProducts from "./LeatestProducts";
import CategoriesOverview from "./CategoriesOverview";
import HowItWorks from "./HowItWorks";
import FeaturesSection from "./FeaturesSection";
import CustomerFeedback from "./CustomerFeedback";
import BlogHighlights from "./BlogHighlights";
import FaqSection from "./FaqSection";
import AboutUs from "./AboutUs";
import LeaveReview from "./LeaveReview";
import usePageTitle from "../../hooks/usePageTitle";

const Homepage = () => {
  usePageTitle("Garments Order - Premium Fashion & Textiles");

  return (
    <>
      <Banner />
      <StatsOverview />
      <LatestProducts />
      <CategoriesOverview />
      <HowItWorks />
      <FeaturesSection />
      <CustomerFeedback />
      <BlogHighlights />
      <FaqSection />
      <AboutUs />
      <LeaveReview />
    </>
  );
};

export default Homepage;
