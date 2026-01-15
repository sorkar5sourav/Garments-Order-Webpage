import React from "react";
import { radii } from "../../Theme/tokens";

const EmptyState = ({ title, message, action }) => {
  return (
    <div
      className={`bg-base-100 ${radii.card} border border-base-300 p-8 text-center space-y-3`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-base-content/70">{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;

