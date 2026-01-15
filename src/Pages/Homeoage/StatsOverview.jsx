import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import Section from "../../Components/ui/Section";
import Loading from "../../Components/atoms/Loading";
import ErrorState from "../../Components/ui/ErrorState";
import { staggerContainer, staggerItem } from "../../utils/animations";

const StatsOverview = () => {
  const axiosInstance = useAxios();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/home-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <Section title="Platform Overview">
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      </Section>
    );
  }

  if (isError || !data) {
    return (
      <Section title="Platform Overview">
        <ErrorState message="Unable to load stats right now." />
      </Section>
    );
  }

  const cards = [
    {
      label: "Active Users",
      value: data.usersCount,
      helper: "Accounts created across all roles",
    },
    {
      label: "Products",
      value: data.productsCount,
      helper: "Available garments in the catalog",
    },
    {
      label: "Total Orders",
      value: data.ordersCount,
      helper: "Orders placed through the system",
    },
    {
      label: "Completed Orders",
      value: data.completedOrders,
      helper: "Orders marked as delivered",
    },
  ];

  return (
    <Section
      title="Production Snapshot"
      subtitle="A quick overview of activity in the Garments Order & Production Tracker."
      className="bg-base-200"
    >
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.label}
            variants={staggerItem}
            className="bg-base-100 rounded-2xl shadow-md p-4 md:p-5 flex flex-col gap-1 hover:shadow-lg transition-shadow"
          >
            <span className="text-xs uppercase tracking-wide text-base-content/60">
              {card.label}
            </span>
            <motion.span 
              className="text-2xl md:text-3xl font-bold text-primary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {card.value ?? 0}
            </motion.span>
            <span className="text-xs text-base-content/70">{card.helper}</span>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};

export default StatsOverview;

