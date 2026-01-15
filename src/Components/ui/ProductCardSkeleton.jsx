import React from "react";
import Skeleton from "./Skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full">
      <Skeleton className="w-full h-64 mb-3" />
      <Skeleton className="w-24 h-5 mb-2" />
      <Skeleton className="w-3/4 h-6 mb-3" />
      <div className="flex justify-between gap-2 mb-3">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-20 h-5" />
      </div>
      <Skeleton className="w-full h-10 mt-auto" />
    </div>
  );
};

export default ProductCardSkeleton;

