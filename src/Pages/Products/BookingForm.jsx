import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    productTitle: "",
    price: 0,
    quantity: location.state?.quantity ?? null,
    firstName: "",
    lastName: "",
    contactNumber: "",
    deliveryAddress: "",
    additionalNotes: "",
  });

  const [quantityError, setQuantityError] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products");
        const selectedProduct = response.data.find((p) => p._id === id);

        if (selectedProduct) {
          setProduct(selectedProduct);
          setFormData((prev) => ({
            ...prev,
            productTitle: selectedProduct.productName,
            price: selectedProduct.price,
            quantity: location.state?.quantity || selectedProduct.minimumOrder,
          }));
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

  // Ensure quantity defaults to product.minimumOrder when product loads
  useEffect(() => {
    if (!product) return;

    // If a quantity was passed via location state, keep it
    if (location.state?.quantity) return;

    setFormData((prev) => ({
      ...prev,
      quantity: prev.quantity ?? product.minimumOrder,
    }));
  }, [product, location.state]);

  const validateQuantity = (qty) => {
    if (!product) return false;

    if (qty < product.minimumOrder) {
      setQuantityError(
        `Quantity cannot be less than minimum order (${product.minimumOrder} units)`
      );
      return false;
    }

    if (qty > product.availableQuantity) {
      setQuantityError(
        `Quantity cannot be greater than available quantity (${product.availableQuantity} units)`
      );
      return false;
    }

    setQuantityError("");
    return true;
  };

  const handleQuantityChange = (e) => {
    if (!product) return;
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) return;

    const min = product.minimumOrder;
    const max = product.availableQuantity || value;
    const step = min;

    if (value < min) value = min;
    if (value > max) value = max;

    // Snap to nearest step relative to min
    const stepsFromMin = Math.round((value - min) / step);
    value = min + stepsFromMin * step;

    // Ensure bounds after snapping
    if (value < min) value = min;
    if (value > max) value = max;

    setFormData((prev) => ({
      ...prev,
      quantity: value,
    }));
    validateQuantity(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate quantity
    if (!validateQuantity(formData.quantity)) {
      return;
    }

    // Validate required fields
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.contactNumber.trim() ||
      !formData.deliveryAddress.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        productId: id,
        email: formData.email,
        productTitle: formData.productTitle,
        price: formData.price,
        quantity: formData.quantity,
        totalPrice: formData.price * formData.quantity,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        deliveryAddress: formData.deliveryAddress,
        additionalNotes: formData.additionalNotes,
        orderDate: new Date().toISOString(),
      };

      // Send order to backend
      const response = await axiosInstance.post("/orders", orderData);

      if (response.status === 201) {
        alert("Order placed successfully!");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Complete Your Order
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Product Information
              </h2>

              <div className="space-y-4">
                {/* Product Title */}
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Product Title
                  </p>
                  <p className="text-gray-900 text-lg font-semibold">
                    {formData.productTitle}
                  </p>
                </div>

                {/* Price and Quantity Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">
                      Price per Unit
                    </p>
                    <p className="text-gray-900 text-lg font-bold">
                      ৳{formData.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">
                      Available Quantity
                    </p>
                    <p className="text-gray-900 text-lg font-bold">
                      {product.availableQuantity} units
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Quantity Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Details
              </h2>

              {/* Order Quantity */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Order Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  min={product.minimumOrder}
                  max={product.availableQuantity}
                  step={product.minimumOrder}
                  className="input input-bordered w-full"
                />
                <div className="flex justify-between text-sm mt-2">
                  <p className="text-gray-500">
                    Min: {product.minimumOrder} units | Max:{" "}
                    {product.availableQuantity} units
                  </p>
                </div>
                {quantityError && (
                  <p className="text-red-600 text-sm mt-2 font-semibold">
                    {quantityError}
                  </p>
                )}
              </div>

              {/* Order Price (Read-only, Auto-calculated) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Total Order Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={`৳${(
                    formData.price * formData.quantity
                  ).toLocaleString()}`}
                  readOnly
                  className="input input-bordered w-full bg-gray-100 text-gray-600 text-lg font-bold"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Auto-calculated based on quantity
                </p>
              </div>
            </div>

            {/* Customer Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Customer Information
              </h2>

              {/* Email (Auto-filled, Display only) */}
              <div className="mb-4 pb-4 border-b border-gray-300">
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Email
                </p>
                <p className="text-gray-900 text-lg font-semibold">
                  {formData.email}
                </p>
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Enter contact number"
                  required
                />
              </div>

              {/* Delivery Address */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter delivery address"
                  rows="3"
                  required
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Additional Notes / Instructions
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter any additional notes or special instructions (optional)"
                  rows="3"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || !!quantityError}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
