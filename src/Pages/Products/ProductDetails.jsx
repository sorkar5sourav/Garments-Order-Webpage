import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products");
        const selectedProduct = response.data.find((p) => p._id === id);

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
    if (user.role === "admin" || user.role === "manager") {
      alert("Admins and Managers cannot place orders.");
      return;
    }

    // Check account status
    if (user.role === "pending") {
      alert(
        "Your account is pending approval. Please wait for admin approval."
      );
      return;
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.productName}
              </h1>

              {/* Price */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200">
                <p className="text-gray-600 text-sm mb-2">Price per unit</p>
                <p className="text-4xl font-bold text-blue-600">
                  ৳{product.price}
                </p>
              </div>

              {/* Availability */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">
                    Available Quantity
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {product.availableQuantity}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Minimum Order</p>
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
                  (user && (user.role === "admin" || user.role === "manager"))
                }
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
              >
                {!user
                  ? "Login to Order"
                  : user.role === "admin" || user.role === "manager"
                  ? "Admins Cannot Order"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Description
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {product.productDescription}
            </p>
          </div>

          {/* Product Specifications */}
          <div className="border-t border-gray-200 p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                <p className="text-gray-700">{product.category}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Price per Unit
                </h3>
                <p className="text-gray-700">৳{product.price}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Available Quantity
                </h3>
                <p className="text-gray-700">
                  {product.availableQuantity} units
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Minimum Order
                </h3>
                <p className="text-gray-700">{product.minimumOrder} units</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
