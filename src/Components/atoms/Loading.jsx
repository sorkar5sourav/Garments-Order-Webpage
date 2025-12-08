import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen">
      <div className="max-w-sm relative">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
      <p className="text-lg font-semibold text-gray-600">Loading...</p>
    </div>
  );
};

export default Loading;
