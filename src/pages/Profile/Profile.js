import React, { useEffect, useState } from "react";

import { getlocaliseText } from "../../utils/localisation";
import { FocusableButton } from "../../components/button";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthInfo } from "../../modules/auth/auth.action";
import Popup from "../../components/Popup";
import CONSTANTS from "../../utils/constant";
import axios from "axios";
export const Profile = (props) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const logoutPopupCallback = (type) => {
    console.log(type, "type");
    switch (type) {
      case "done":
        localStorage.removeItem( CONSTANTS.siteName + "_login_data");
        dispatch(setAuthInfo(null));
        setShowPopup(false);
        break;
      case "cancel":
      case "back":
        setShowPopup(false);
        break;
    }
  };

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
          {auth.isLogin && (
            <>
              <div className="user-info">
                <div className="myProfile">My Profile</div>
                <div className="user-name">
                  <div>Name:</div> 
                  <div className="value">{auth?.name}</div>
                </div>
                <div className="user-email">
                  <div>Email Id:</div> <div className="value"> {auth?.emailid}</div>
                </div>
                <FocusableButton
                className="login-btn"
                onClick={(e) => {
                  try {
                    e.preventDefault();
                    e.stopPropagation();
                  } catch (e) {}
                  setShowPopup(true);
                }}
              >
                Logout
              </FocusableButton>
              </div>

              
            </>
          )}
          {!auth?.isLogin && (
            <FocusableButton
              className="login-btn"
              isFocused={true}
              onClick={() => {
                console.log("object");
                navigate("/login");
              }}
            >
              {getlocaliseText("settingsPageAUTO_INTRO", "Login with Email Id")}
            </FocusableButton>
          )}
        </div>
      </div>
      {showPopup ? (
        <Popup
          message={CONSTANTS.MESSAGE.LOGOUT_MESSAGE}
          cancelBtn={CONSTANTS.MESSAGE.NO}
          okBtn={CONSTANTS.MESSAGE.OK}
          keyDownHandler={logoutPopupCallback}
        />
      ) : null}
    </div>

  );
};
