import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import ProductCard from "../../Components/ProductCard";
import usePageTitle from "../../hooks/usePageTitle";
import ProductCardSkeleton from "../../Components/ui/ProductCardSkeleton";

const AllProducts = () => {
  usePageTitle("All Products - Garments Order");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const axiosInstance = useAxios();
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Reduce the number of cards on medium screens and below to 6
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1024 ? 12 : 16);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      queryKey: [
        "all-products",
        currentPage,
        debouncedSearchTerm,
        category,
        minPrice,
        maxPrice,
        sortBy,
        itemsPerPage,
      ],
      queryFn: async () => {
        const [sortField, sortOrder] = sortBy.split("-");
        const response = await axiosInstance.get("/products", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearchTerm,
            category: category === "all" ? undefined : category,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            sortBy: sortField,
            order: sortOrder,
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

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const hasActiveFilters = category !== "all" || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-500">
            Explore our complete collection of premium garments
          </p>
        </div>

        {/* Search Bar + Filter Button + Sort */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Bar with Filter Button */}
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-80">
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
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
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn ${isFilterOpen ? "btn-primary" : "btn-outline"} gap-2`}
            >
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="badge badge-primary badge-sm">
                  {[category !== "all" ? 1 : 0, minPrice ? 1 : 0, maxPrice ? 1 : 0].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium mb-1">Sort by</label>
            <select
              className="select select-bordered w-full sm:w-48"
              value={sortBy}
              onChange={handleFilterChange(setSortBy)}
            >
              <option value="createdAt-desc">Newest first</option>
              <option value="createdAt-asc">Oldest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="availableQuantity-desc">
                Stock: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* Filter Sidebar Overlay (All Screen Sizes) */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsFilterOpen(false)}
          ></div>
        )}

        {/* Main Content Area with Sidebar */}
        <div className="flex gap-6 relative">
          {/* Filter Sidebar */}
          <aside
            className={`${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            } fixed top-0 h-screen left-0 z-50 w-80 bg-base-100 shadow-xl p-6 overflow-y-auto transition-transform duration-300 ease-in-out`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-secondary">
                Category
              </label>
              <select
                className="select select-bordered w-full"
                value={category}
                onChange={handleFilterChange(setCategory)}
              >
                <option value="all">All categories</option>
                <option value="Shirt">Shirt</option>
                <option value="Pant">Pant</option>
                <option value="Jacket">Jacket</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-secondary">
                Price Range
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-base-content/70 mb-1">
                    Min price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={handleFilterChange(setMinPrice)}
                    className="input input-bordered w-full"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-base-content/70 mb-1">
                    Max price
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={handleFilterChange(setMaxPrice)}
                    className="input input-bordered w-full"
                    placeholder="Any"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-sm w-full"
              >
                Clear Filters
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div className="flex-1">

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      </div>
    </div>
  );
};

export default AllProducts;
