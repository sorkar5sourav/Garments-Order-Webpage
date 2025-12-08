import React, { useEffect, useState, useRef, useCallback } from "react";
import useAxios from "../../hooks/useAxios";
import ProductCard from "../../Components/ProductCard";
import Loading from "../../Components/atoms/Loading";

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const axiosInstance = useAxios();
  const observerTarget = useRef(null);

  const ITEMS_PER_LOAD = 6;

  // Initial fetch of all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products");
        setAllProducts(response.data);
        // Load first 6 products
        setDisplayedProducts(response.data.slice(0, ITEMS_PER_LOAD));
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

  // Load more products
  const loadMoreProducts = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const newProducts = allProducts.slice(
        currentLength,
        currentLength + ITEMS_PER_LOAD
      );
      setDisplayedProducts((prev) => [...prev, ...newProducts]);

      // Check if there are more products to load
      if (currentLength + ITEMS_PER_LOAD >= allProducts.length) {
        setHasMore(false);
      }
      setLoadingMore(false);
    }, 300);
  }, [displayedProducts.length, allProducts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          hasMore &&
          displayedProducts.length > 0
        ) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreProducts, loadingMore, hasMore, displayedProducts.length]);

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

        {displayedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products available</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Intersection observer target */}
            <div ref={observerTarget} className="py-10 text-center">
              {loadingMore && hasMore && (
                <div className="flex justify-center items-center space-x-2">
                  <span className="loading loading-spinner loading-lg"></span>
                  <span className="text-gray-600">
                    Loading more products...
                  </span>
                </div>
              )}
              {!hasMore && displayedProducts.length > 0 && (
                <p className="text-gray-500 text-lg">
                  No more products to load
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
