
import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Register & Login",
      description: "Create an account or log in to access our platform. Choose your role as a buyer, manager, or admin.",
      icon: "👤",
    },
    {
      id: 2,
      title: "Browse Products",
      description: "Explore our latest garments collection. View product details, prices, and availability.",
      icon: "🛍️",
    },
    {
      id: 3,
      title: "Place Your Order",
      description: "Select your desired products, add them to your cart, and submit your order for approval.",
      icon: "📝",
    },
    {
      id: 4,
      title: "Make Payment",
      description: "Once approved, proceed to secure payment via Stripe. We accept various payment methods.",
      icon: "💳",
    },
    {
      id: 5,
      title: "Track Your Order",
      description: "Monitor your order status in real-time. Get updates on production and delivery progress.",
      icon: "📦",
    },
    {
      id: 6,
      title: "Receive & Enjoy",
      description: "Receive your high-quality garments. Leave feedback and place new orders anytime.",
      icon: "🎉",
    },
  ];

  return (
    <div className="my-10 bg-base-300 rounded-3xl py-10 max-w-7xl mx-auto md:mb-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-secondary mb-6">How It Works</h2>
        <p className="text-lg text-base-content leading-relaxed">
          Follow these simple steps to order and track your garments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="card-body text-center">
              <div className="text-4xl mb-4">{step.icon}</div>
              <div className="badge badge-primary text-base-300 mb-4 text-lg font-bold">
                Step {step.id}
              </div>
              <h4 className="card-title text-xl mb-2">{step.title}</h4>
              <p className="text-base-CONTENT">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;