import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import ProductCard from "../../Components/ProductCard";
import Loading from "../../Components/atoms/Loading";

const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const axiosInstance = useAxios();

  const { data: productData = { products: [], pagination: {} }, isLoading } =
    useQuery({
      queryKey: ["all-products", currentPage],
      queryFn: async () => {
        const response = await axiosInstance.get("/products", {
          params: { page: currentPage, limit: ITEMS_PER_PAGE },
        });
        return response.data || { products: [], pagination: {} };
      },
    });

  const { products = [], pagination = {} } = productData;

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

        {isLoading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="btn btn-sm"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`btn btn-sm ${
                        page === currentPage ? "btn-active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="btn btn-sm"
                >
                  Next
                </button>
              </div>
            )}

            {/* Page Info */}
            {pagination.totalProducts > 0 && (
              <div className="text-center text-sm text-gray-500 mt-4">
                Page {pagination.currentPage} of {pagination.totalPages} |
                Showing {products.length} of {pagination.totalProducts} products
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
