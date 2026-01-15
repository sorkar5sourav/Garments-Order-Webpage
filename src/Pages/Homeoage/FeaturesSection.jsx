import React from "react";
import { motion } from "framer-motion";
import Section from "../../Components/ui/Section";
import { staggerContainer, staggerItem } from "../../utils/animations";

const features = [
  {
    title: "End-to-end tracking",
    description:
      "Follow every order from request to delivery with role-based updates for buyers, managers, and admins.",
  },
  {
    title: "Production-focused design",
    description:
      "Built specifically for garment factories, with quantities, minimum orders, and capacity in mind.",
  },
  {
    title: "Secure payments",
    description:
      "Stripe-powered checkout and clear payment states keep finance and operations aligned.",
  },
  {
    title: "Actionable dashboards",
    description:
      "Overview cards and charts turn raw order data into insights your team can actually use.",
  },
];

const FeaturesSection = () => {
  return (
    <Section
      title="Why Teams Use This Platform"
      subtitle="Focused on the daily realities of managing garment orders and production."
      className="bg-base-100"
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={staggerItem}
            className="bg-base-200 rounded-2xl p-4 md:p-5 flex flex-col gap-2 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-secondary">
              {feature.title}
            </h3>
            <p className="text-sm text-base-content/80">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default FeaturesSection;

