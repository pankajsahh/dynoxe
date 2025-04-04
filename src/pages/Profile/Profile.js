import React, { useEffect, useState, useRef, Fragment } from "react";

import { getlocaliseText } from "../../utils/localisation";
import { FocusableButton } from "../../components/button";
import "./index.scss";
import { useNavigate } from "react-router-dom";
export const Profile = (props) => {
  const navigate = useNavigate();
  return (
    <div className="profile-container">
      <div className="page-content">
        <div className="SubMenuContainer">
          {/* <FocusableButton
            className="login-btn"
            onClick={() => {
              console.log("object");
              navigate("/login")
            }}
            isFocused={true}
          >
            {getlocaliseText("settingsPageLANGUAGE", "Login with Code")}
          </FocusableButton> */}
          <FocusableButton
            className="login-btn"
            onClick={() => {
              console.log("object");
              navigate("/login")
            }}
          >
            {getlocaliseText("settingsPageAUTO_INTRO", "Login with Email Id")}
          </FocusableButton>
        </div>
      </div>
    </div>
  );
};
