import React from "react";

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div>
        <div className="loader"></div>
        <div className="loader-text">Processing Stk...</div>
      </div>
    </div>
  );
};

export default Loader;