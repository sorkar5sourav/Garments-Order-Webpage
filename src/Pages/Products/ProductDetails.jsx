import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import usePageTitle from "../../hooks/usePageTitle";
import ProductCard from "../../Components/ProductCard";
import fallbackImage from "../../assets/1.png";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role, status, suspendFeedback, suspendReason } = useRole();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const axiosInstance = useAxios();

  // Fetch product by ID
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Fetch reviews for this product
  const { data: reviewsData = { reviews: [] } } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const response = await axiosInstance.get("/reviews", {
        params: { productId: id, status: "approved" },
      });
      return response.data;
    },
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedData = { products: [] } } = useQuery({
    queryKey: ["related-products", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${id}/related`);
      return response.data;
    },
    enabled: !!id && !!product,
  });

  usePageTitle(
    product ? `${product.productName} - Product Details` : "Product Details"
  );

  // Initialize quantity when product changes
  React.useEffect(() => {
    if (product?.minimumOrder) {
      setQuantity(product.minimumOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (
      product &&
      value >= product.minimumOrder &&
      value <= product.availableQuantity
    ) {
      setQuantity(value);
    }
  };

  const handleOrder = () => {
    if (!user) {
      navigate("/login", { state: { pathname: `/products/${id}` } });
      return;
    }

    // Check user role - don't allow admins or managers to order
    if (role === "admin" || role === "manager") {
      alert("Admins and Managers cannot place orders.");
      return;
    }

    // Check account status for buyers
    if (role === "buyer") {
      if (status === "suspended") {
        alert(
          `Your account is suspended. ${
            suspendFeedback || suspendReason
              ? `Feedback: ${suspendFeedback || suspendReason}`
              : "You cannot place new bookings."
          }`
        );
        return;
      }

      if (status !== "active") {
        alert("Admin approval required to place orders.");
        return;
      }
    }

    // Navigate to booking form
    navigate(`/booking/${id}`, { state: { quantity } });
  };

  if (productLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="alert alert-error">
          <span>
            {productError?.response?.data?.message ||
              productError?.message ||
              "Product not found"}
          </span>
        </div>
      </div>
    );
  }

  const quantityOptions = [];
  for (
    let i = product.minimumOrder;
    i <= Math.min(product.availableQuantity, product.minimumOrder * 10);
    i += product.minimumOrder
  ) {
    quantityOptions.push(i);
  }

  // Get gallery images or use productImage/photoUrl as fallback
  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : product.productImage || product.photoUrl
      ? [product.productImage || product.photoUrl]
      : [fallbackImage];

  const mainImage = galleryImages[selectedImageIndex] || fallbackImage;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="btn btn-ghost mb-6"
        >
          ← Back to Products
        </button>

        <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
          {/* Main Product Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              {/* Main Image Carousel */}
              <div className="relative aspect-square bg-base-300 rounded-lg overflow-hidden">
                {galleryImages.length > 1 ? (
                  <Carousel
                    selectedItem={selectedImageIndex}
                    onChange={setSelectedImageIndex}
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    className="w-full h-full"
                  >
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="w-full h-full">
                        <img
                          src={img || fallbackImage}
                          alt={`${product.productName} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <img
                    src={mainImage}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnail Gallery (if multiple images) */}
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === idx
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img || fallbackImage}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div>
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl font-bold text-secondary mb-4">
                {product.productName}
              </h1>

              {/* Price */}
              <div className="mb-6 pb-6 border-b-2 border-base-300">
                <p className="text-base-content/70 text-sm mb-2">Price per unit</p>
                <p className="text-4xl font-bold text-primary">
                  ৳{product.price?.toLocaleString()}
                </p>
              </div>

              {/* Availability */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-base-content/70 text-sm mb-1">
                    Available Quantity
                  </p>
                  <p className="text-2xl font-bold text-success">
                    {product.availableQuantity}
                  </p>
                </div>
                <div>
                  <p className="text-base-content/70 text-sm mb-1">Minimum Order</p>
                  <p className="text-2xl font-bold text-warning">
                    {product.minimumOrder} units
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-base-content font-semibold mb-2">
                  Order Quantity
                </label>
                <select
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="select select-bordered w-full"
                >
                  {quantityOptions.map((qty) => (
                    <option key={qty} value={qty}>
                      {qty} units
                    </option>
                  ))}
                </select>
                <p className="text-sm text-base-content/70 mt-2">
                  Total: ৳{(product.price * quantity).toLocaleString()}
                </p>
              </div>

              {/* Order Button */}
              <button
                onClick={handleOrder}
                disabled={
                  product.availableQuantity < product.minimumOrder ||
                  role === "admin" ||
                  role === "manager" ||
                  (role === "buyer" && status !== "active") ||
                  status === "suspended"
                }
                className="btn btn-primary text-base-100 w-full mb-4"
              >
                {!user
                  ? "Login to Order"
                  : role === "admin" || role === "manager"
                  ? "Admins Cannot Order"
                  : status === "suspended"
                  ? "Account Suspended"
                  : role === "buyer" && status !== "active"
                  ? "Admin approval required to place orders"
                  : "Place Order"}
              </button>

              {product.availableQuantity < product.minimumOrder && (
                <p className="text-error text-center font-semibold">
                  Out of Stock
                </p>
              )}
            </div>
          </div>

          {/* Overview Section */}
          <div className="border-t border-base-300 p-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">Overview</h2>
            <div className="space-y-4">
              <p className="text-base-content leading-relaxed text-lg">
                {product.productDescription}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-base-content/70 mb-1">Category</p>
                  <p className="font-semibold text-secondary">
                    {product.category}
                  </p>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-base-content/70 mb-1">Price</p>
                  <p className="font-semibold text-secondary">
                    ৳{product.price?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-base-content/70 mb-1">In Stock</p>
                  <p className="font-semibold text-success">
                    {product.availableQuantity} units
                  </p>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-base-content/70 mb-1">Min Order</p>
                  <p className="font-semibold text-warning">
                    {product.minimumOrder} units
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="border-t border-base-300 p-8 bg-base-200">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Product Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-base-100 p-4 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2">Category</h3>
                <p className="text-base-content">{product.category}</p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2">
                  Price per Unit
                </h3>
                <p className="text-base-content">৳{product.price?.toLocaleString()}</p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2">
                  Available Quantity
                </h3>
                <p className="text-base-content">
                  {product.availableQuantity} units
                </p>
              </div>
              <div className="bg-base-100 p-4 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2">
                  Minimum Order
                </h3>
                <p className="text-base-content">{product.minimumOrder} units</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-base-300 p-8">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Customer Reviews
            </h2>
            {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
              <div className="space-y-4">
                {reviewsData.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-base-200 p-4 rounded-lg border border-base-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-secondary">
                          {review.reviewerName || "Anonymous"}
                        </p>
                        <p className="text-sm text-base-content/70">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      {review.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-warning text-lg">★</span>
                          <span className="font-semibold">{review.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-base-content mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base-content/70 text-center py-8">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>

          {/* Related Products Section */}
          {relatedData.products && relatedData.products.length > 0 && (
            <div className="border-t border-base-300 p-8 bg-base-200">
              <h2 className="text-2xl font-bold text-secondary mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedData.products.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
