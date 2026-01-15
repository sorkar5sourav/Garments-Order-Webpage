import React from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../../utils/animations";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Register & Login",
      description:
        "Create an account or log in to access our platform. Choose your role as a buyer, manager, or admin.",
      icon: "👤",
    },
    {
      id: 2,
      title: "Browse Products",
      description:
        "Explore our latest garments collection. View product details, prices, and availability.",
      icon: "🛍️",
    },
    {
      id: 3,
      title: "Place Your Order",
      description:
        "Select your desired products, add them to your cart, and submit your order for approval.",
      icon: "📝",
    },
    {
      id: 4,
      title: "Make Payment",
      description:
        "Once approved, proceed to secure payment via Stripe. We accept various payment methods.",
      icon: "💳",
    },
    {
      id: 5,
      title: "Track Your Order",
      description:
        "Monitor your order status in real-time. Get updates on production and delivery progress.",
      icon: "📦",
    },
    {
      id: 6,
      title: "Receive & Enjoy",
      description:
        "Receive your high-quality garments. Leave feedback and place new orders anytime.",
      icon: "🎉",
    },
  ];

  return (
    <motion.section 
      className="bg-base-300 py-10 md:py-20"
      initial="hidden"
      whileInView="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
      viewport={{ once: true }}
    >
      <div className="my-10 max-w-360 mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-secondary mb-6">
            How It Works
          </h2>
          <p className="text-lg text-base-content leading-relaxed">
            Follow these simple steps to order and track your garments
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={staggerItem}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body text-center">
                <motion.div 
                  className="text-4xl mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {step.icon}
                </motion.div>
                <div className="badge badge-primary text-base-300 mb-4 text-lg font-bold">
                  Step {step.id}
                </div>
                <h4 className="card-title text-xl mb-2">{step.title}</h4>
                <p className="text-base-content">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
};

export default HowItWorks;
