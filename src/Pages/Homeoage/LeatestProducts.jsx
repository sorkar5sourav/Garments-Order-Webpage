import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import ProductCard from "../../Components/ProductCard";
import Loading from "../../Components/atoms/Loading";

const LatestProducts = () => {
  const axiosInstance = useAxios();

  const { data: productData = { products: [], pagination: {} }, isLoading } =
    useQuery({
      queryKey: ["latest-products"],
      queryFn: async () => {
        const response = await axiosInstance.get("/products", {
          params: { limit: 6 },
        });
        return response.data || { products: [], pagination: {} };
      },
    });

  const { products = [] } = productData;

  return (
    <div className="py-12">
      <div className="max-w-8xl bg-base-200 rounded-3xl py-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Latest Products
          </h2>
          <p className="text-lg text-base-CONTENT">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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