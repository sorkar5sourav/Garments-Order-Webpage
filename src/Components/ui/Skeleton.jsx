import React from "react";
import { radii } from "../../Theme/tokens";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-base-300/60 ${radii.card} ${className}`}
    />
  );
};

export default Skeleton;

