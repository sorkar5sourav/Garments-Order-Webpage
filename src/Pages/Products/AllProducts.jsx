import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import ProductCard from "../../Components/ProductCard";
import Loading from "../../Components/atoms/Loading";
import usePageTitle from "../../hooks/usePageTitle";

const AllProducts = () => {
  usePageTitle("All Products - Garments Order");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 12;
  const axiosInstance = useAxios();

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: productData = { products: [], pagination: {} }, isLoading } =
    useQuery({
      queryKey: ["all-products", currentPage, debouncedSearchTerm],
      queryFn: async () => {
        const response = await axiosInstance.get("/products", {
          params: {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearchTerm,
          },
        });
        return response.data || { products: [], pagination: {} };
      },
    });

  const { products = [], pagination = {} } = productData;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-500">
            Explore our complete collection of premium garments
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input input-bordered w-full pr-10"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {debouncedSearchTerm && (
          <div className="text-center mb-6">
            <p className="text-base-CONTENT">
              {pagination.totalProducts > 0
                ? `Found ${pagination.totalProducts} product${
                    pagination.totalProducts !== 1 ? "s" : ""
                  } for "${debouncedSearchTerm}"`
                : `No products found for "${debouncedSearchTerm}"`}
            </p>
          </div>
        )}

        {isLoading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              {debouncedSearchTerm
                ? "No products found matching your search"
                : "No products available"}
            </p>
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
