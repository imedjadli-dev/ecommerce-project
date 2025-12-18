import React from "react";

const Loader = () => {
  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="loader" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
