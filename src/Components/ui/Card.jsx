import React from "react";
import { radii, shadows } from "../../Theme/tokens";

const baseClasses = `bg-base-100 ${radii.card} ${shadows.card} flex flex-col h-full`;

const Card = ({ className = "", children, ...rest }) => {
  return (
    <div className={`${baseClasses} ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;

