import React from "react";
import { Link } from "react-router";
import Card from "./ui/Card";
import fallbackImage from "../assets/1.png";

const ProductCard = ({ product }) => {
  const imageSrc = product.productImage || product.photoUrl || fallbackImage;
  const createdAt =
    product.createdAt && !isNaN(new Date(product.createdAt))
      ? new Date(product.createdAt).toLocaleDateString()
      : null;

  return (
    <Card>
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-base-300 rounded-t-2xl overflow-hidden">
        <img
          src={imageSrc}
          alt={product.productName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-secondary mb-1 line-clamp-1">
          {product.productName}
        </h3>

        {/* Short Description */}
        {product.productDescription && (
          <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
            {product.productDescription}
          </p>
        )}

        {/* Meta: Price, Stock, Date */}
        <div className="flex justify-between items-end gap-3 mb-4 mt-auto">
          <div>
            <p className="text-xs text-base-content/70">Price</p>
            <p className="text-xl font-bold text-primary">
              ৳{product.price?.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-base-content/70">In Stock</p>
            <p className="text-sm font-semibold text-success">
              {product.availableQuantity}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-base-content/60 mb-4">
          <span>Min order: {product.minimumOrder} units</span>
          {createdAt && <span>Added: {createdAt}</span>}
        </div>

        {/* View Details Button */}
        <Link
          to={`/products/${product._id}`}
          className="btn btn-primary text-base-300 font-bold w-full mt-auto"
        >
          View Details
        </Link>
      </div>
    </Card>
  );
};

export default ProductCard;
