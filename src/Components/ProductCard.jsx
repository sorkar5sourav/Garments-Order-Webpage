import React from "react";
import { Link } from "react-router";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
        <img
          src={product.productImage || "https://via.placeholder.com/400x300"}
          alt={product.productName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-secondary mb-2 truncate">
          {product.productName}
        </h3>

        {/* Price and Quantity */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-base-CONTENT">Price</p>
            <p className="text-2xl font-bold text-blue-600">৳{product.price}</p>
          </div>
          <div>
            <p className="text-sm text-base-CONTENT">In Stock</p>
            <p className="text-lg font-semibold text-green-600">
              {product.availableQuantity}
            </p>
          </div>
        </div>

        {/* Minimum Order */}
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <p className="text-xs text-gray-700">
            Minimum Order:{" "}
            <span className="font-semibold">{product.minimumOrder} units</span>
          </p>
        </div>

        {/* View Details Button */}
        <Link
          to={`/products/${product._id}`}
          className="btn btn-primary w-full"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
