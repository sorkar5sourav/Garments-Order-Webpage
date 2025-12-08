import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import ProductCard from "../../Components/ProductCard";
import Loading from "../../Components/atoms/Loading";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axiosInstance]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-600">
            Explore our complete collection of premium garments
          </p>
        </div>

        {products.length === 0 ? (
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

export default AllProducts;
