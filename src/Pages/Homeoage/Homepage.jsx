import React from "react";

const Homepage = () => {
  return (
    <div className="text-4xl font-bold text-center">
      this is homepage <br />
      Hero Banner <br />A visually appealing section with a meaningful image,
      descriptive text, and a clear call-to-action button (like View Product,
      Book a Product, etc., also clickable).
      <br /> Our Products (6 cards from MongoDB with limit) <br />
      Cards include image, name, short desc, price “View Details” button <br />
      How It Works (Step-by-step) <br />
      Customer Feedback (Carousel)
      <br /> Add 2 Extra section Design 🎯 When the user clicks the "View
      Details" button, they are redirected to the product details page.
    </div>
  );
};

export default Homepage;
