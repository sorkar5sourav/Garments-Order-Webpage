import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import usePageTitle from "../../hooks/usePageTitle";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role, status, suspendFeedback, suspendReason } = useRole();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const axiosInstance = useAxios();

  usePageTitle(product ? `${product.productName} - Product Details` : "Product Details");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products", {
          params: { limit: 1000 }, // Fetch all products to ensure we find the one we need
        });
        const selectedProduct = response.data.products?.find((p) => p._id === id);

        if (selectedProduct) {
          setProduct(selectedProduct);
          setError(null);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, axiosInstance]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= product.minimumOrder && value <= product.availableQuantity) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="alert alert-error">
          <span>{error || "Product not found"}</span>
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

  return (
    <div className="min-h-screen bg-base-200 rounded-3xl py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="btn btn-ghost mb-6"
        >
          ← Back to Products
        </button>

        <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <img
                src={
                  product.productImage || "https://via.placeholder.com/500x500"
                }
                alt={product.productName}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* Product Information */}
            <div>
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl font-bold text-secondary mb-4">
                {product.productName}
              </h1>

              {/* Price */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <p className="text-base-CONTENT text-sm mb-2">Price per unit</p>
                <p className="text-4xl font-bold text-blue-600">
                  ৳{product.price}
                </p>
              </div>

              {/* Availability */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-base-CONTENT text-sm mb-1">
                    Available Quantity
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {product.availableQuantity}
                  </p>
                </div>
                <div>
                  <p className="text-base-CONTENT text-sm mb-1">Minimum Order</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {product.minimumOrder} units
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
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
                <p className="text-sm text-gray-500 mt-2">
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
                className="btn btn-primary text-gray-500 w-full mb-4"
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
                <p className="text-red-600 text-center font-semibold">
                  Out of Stock
                </p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              Product Description
            </h2>
            <p className="text-base-content leading-relaxed text-lg">
              {product.productDescription}
            </p>
          </div>

          {/* Product Specifications */}
          <div className="border-t border-gray-200 p-8 bg-base-200">
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
                <p className="text-base-content">৳{product.price}</p>
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
