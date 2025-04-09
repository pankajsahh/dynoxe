import React, { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import KEY from "../../utils/key";
import { setAuthInfo } from "../../modules/auth/auth.action";
import { showMenu, setSelectedMenu } from "../../modules/menu/menu.action";
import logo from "../../assets/image/BrandLogo.svg";
import AuthBG from "../../assets/clientImages/AuthBG.png";
import { setAppConfig } from "../../modules/common/common.actions";
import { TextBox } from "../../components/textBox";
import {
  useFocusable,
  FocusContext,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { FocusableButton } from "../../components/button";
import { getApi } from "../../utils/api";
import { uuid } from "../../utils/util";
import CONSTANTS from "../../utils/constant";
import Popup from "../../components/Popup";
import axios from "axios";
const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const menu = useSelector((state) => state.menu);
  const { ref, focusKey, focusSelf } = useFocusable({
    trackChildren: true,
  });
  const [isSignUpPage, setSignUpPage] = useState(false);

  const [AuthData, setAuthData] = useState({
    fullname: "",
    emailid: "",
    mobile: "",
    pwd: "",
    mnumber: "",
  });
  const [Error, setError] = useState(null);
  useEffect(() => {
    focusSelf();
    if (menu.showMenu) {
      dispatch(showMenu({ showMenu: false }));
    }
  }, [menu.showMenu]);

  const onkeydownOnthisPage = (e) => {
    switch (e.keyCode) {
      case KEY.ENTER:
        // setFocus("submitBtn");
        break;
      case KEY.BACK:
        if (token) {
          dispatch(showMenu({ showMenu: true }));
          navigate(-1);
        }
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onkeydownOnthisPage);
    return () => {
      document.removeEventListener("keydown", onkeydownOnthisPage);
    };
  }, []);
  const AuthHandler = async () => {
    console.log(AuthData, "aaknoi");
    let url = `${CONSTANTS.BASE_URL}/login`;
    if (isSignUpPage) {
      url = `${CONSTANTS.BASE_URL}/register`;
    }
    const formdata = new FormData();
    for (let key in AuthData) {
      if (AuthData[key]) {
        formdata.append(key, AuthData[key]);
      }
    }
    try {
      const response = await axios.post(url, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data, "res");

      if (response?.status == true) {
        let data = { ...response, isLogin: true };
        localStorage.setItem(
          CONSTANTS.siteName + "_login_data",
          JSON.stringify(data)
        );
        dispatch(setAuthInfo(data));
        navigate("/home");
      } else {
        setError(response?.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message, "error");
    }
  };
  const popupCallback = (type) => {
    switch (type) {
      case "retry":
        setFocus("CodeInput");
        setError(null);
        break;
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${AuthBG})`, backgroundSize: "contain" }}
      className="login-container"
      ref={ref}
    >
      <FocusContext.Provider value={focusKey}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          className="input-wrapper"
        >
          <div className="title">Sign In</div>
          {isSignUpPage && (
            <TextBox
              className="CodeInput"
              placeholder={"Full Name"}
              isFocused={true}
              value={AuthData.fullname}
              onChange={(value) => {
                setAuthData((state) => {
                  return { ...state, fullname: value };
                });
              }}
              type="text"
            />
          )}
          {!isSignUpPage && (
            <TextBox
              className="CodeInput"
              placeholder={"Email or Phone Number"}
              isFocused={true}
              value={AuthData.mnumber}
              onChange={(value) => {
                setAuthData((state) => {
                  return { ...state, mnumber: value };
                });
              }}
              type="text"
            />
          )}
          {isSignUpPage && (
            <TextBox
              className="CodeInput"
              placeholder={"Enter Email"}
              isFocused={false}
              value={AuthData.emailid}
              onChange={(value) => {
                setAuthData((state) => {
                  return { ...state, emailid: value };
                });
              }}
              type="text"
            />
          )}
          {isSignUpPage && (
            <TextBox
              className="CodeInput"
              placeholder={"Phone Number"}
              isFocused={false}
              value={AuthData.mobile}
              onChange={(value) => {
                setAuthData((state) => {
                  return { ...state, mobile: value };
                });
              }}
              type="text"
            />
          )}
          <TextBox
            className="CodeInput"
            placeholder={"password"}
            isFocused={false}
            value={AuthData.pwd}
            onChange={(value) => {
              setAuthData((state) => {
                return { ...state, pwd: value };
              });
            }}
            type="password"
          />
          {!isSignUpPage ? (
            <>
              <FocusableButton
                className="CodeSubmit"
                onClick={() => {
                  if (isSignUpPage) {
                    setSignUpPage(false);
                  } else {
                    AuthHandler();
                  }
                }}
              >
                Log In
              </FocusableButton>
              <FocusableButton
                className="CodeSubmit"
                onClick={() => {
                  if (!isSignUpPage) {
                    setSignUpPage(true);
                  } else {
                    AuthHandler();
                  }
                }}
              >
                Sign Up
              </FocusableButton>
            </>
          ) : (
            <>
              <FocusableButton
                className="CodeSubmit"
                onClick={() => {
                  if (!isSignUpPage) {
                    setSignUpPage(true);
                  } else {
                    AuthHandler();
                  }
                }}
              >
                Sign Up
              </FocusableButton>
              <FocusableButton
                className="CodeSubmit"
                onClick={() => {
                  if (isSignUpPage) {
                    setSignUpPage(false);
                  } else {
                    AuthHandler();
                  }
                }}
              >
                Log In
              </FocusableButton>
            </>
          )}
        </div>
      </FocusContext.Provider>

      {Error != null && (
        <Popup
          message={Error}
          title="Error"
          retry="retry"
          keyDownHandler={popupCallback}
        />
      )}
    </div>
  );
};

export default Login;
