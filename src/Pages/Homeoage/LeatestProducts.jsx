import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import ProductCard from "../../Components/ProductCard";
import Loading from "../../Components/atoms/Loading";

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
    <div className="py-12 bg-base-200">
      <div className="max-w-8xl max-w-380 rounded-3xl py-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary mb-6">
            Latest Products
          </h2>
          <p className="text-lg text-base-content leading-relaxed">
            Check out our newest additions to the collection
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestProducts;
