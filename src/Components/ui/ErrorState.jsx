import React from "react";
import { radii } from "../../Theme/tokens";

const ErrorState = ({ title = "Something went wrong", message }) => {
  return (
    <div
      className={`bg-error/10 ${radii.card} border border-error/40 p-6 text-center space-y-2`}
    >
      <h3 className="text-lg font-semibold text-error">{title}</h3>
      {message && <p className="text-base-content/80">{message}</p>}
    </div>
  );
};

export default ErrorState;

