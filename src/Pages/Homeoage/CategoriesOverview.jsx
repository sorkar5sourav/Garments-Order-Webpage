import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import Section from "../../Components/ui/Section";
import ProductCardSkeleton from "../../Components/ui/ProductCardSkeleton";
import EmptyState from "../../Components/ui/EmptyState";
import { staggerContainer, staggerItem } from "../../utils/animations";

const CategoriesOverview = () => {
  const axiosInstance = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["categories-summary"],
    queryFn: async () => {
      const res = await axiosInstance.get("/products/categories-summary");
      return res.data || { categories: [] };
    },
  });

  const categories = data?.categories || [];

  return (
    <Section
      title="Key Product Categories"
      subtitle="See how your garments catalog is distributed across major categories."
    >
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          message="Once managers add products, category insights will appear here."
        />
      ) : (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.category || "uncategorized"}
              variants={staggerItem}
              className="bg-base-100 rounded-2xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-1">
                  {cat.category || "Uncategorized"}
                </h3>
                <p className="text-sm text-base-content/70 mb-3">
                  {cat.totalProducts} product
                  {cat.totalProducts !== 1 ? "s" : ""} listed
                </p>
              </div>
              <p className="text-xs text-base-content/60">
                Available units:{" "}
                <span className="font-semibold">{cat.totalAvailable}</span>
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Section>
  );
};

export default CategoriesOverview;

