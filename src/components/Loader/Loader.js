import React from "react";

import "./index.scss";
import loader from "../../assets/images/loader.png";

const Loader = () => {
  return (
    <div className="loader">
      <div  className="loaderDiv"></div>
      {/* <img src={loader} alt="loader" /> */}
    </div>
  );
};

export default Loader;
