import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxios from "../../hooks/useAxios";
import ProductCard from "../../Components/ProductCard";
import Loading from "../../Components/atoms/Loading";
import { fadeInUp, staggerContainer, staggerItem } from "../../utils/animations";

const LatestProducts = () => {
  const axiosInstance = useAxios();
  const [limit, setLimit] = useState(8);

  // Reduce the number of cards on medium screens and below to 6
  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth < 1024 ? 6 : 8);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: productData = { products: [], pagination: {} }, isLoading } =
    useQuery({
      queryKey: ["latest-products", limit],
      queryFn: async () => {
        const response = await axiosInstance.get("/products", {
          params: { limit, sortBy: "createdAt", order: "desc" },
        });
        return response.data || { products: [], pagination: {} };
      },
    });

  const { products = [] } = productData;

  return (
    <motion.div 
      className="py-12 bg-base-200"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={{ once: true }}
    >
      <div className="max-w-8xl max-w-380 rounded-3xl py-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-secondary mb-6">
            Latest Products
          </h2>
          <p className="text-lg text-base-content leading-relaxed">
            Check out our newest additions to the collection
          </p>
        </motion.div>

        {isLoading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products available</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LatestProducts;
