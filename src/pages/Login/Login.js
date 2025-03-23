import React, { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import KEY from "../../utils/key";
import { setAuthInfo } from "../../modules/auth/auth.action";
import { showMenu, setSelectedMenu } from "../../modules/menu/menu.action";
import logo from "../../assets/image/BrandLogo.svg";
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
const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const menu = useSelector((state) => state.menu);
  const { ref, focusKey, focusSelf } = useFocusable({
    trackChildren: true,
  });
  const [loginCode, setLoginCode] = useState("");
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
  const qrCodeWrapperRef = useRef();
  const subscriptionUrl = "https://pankajsahh.netlify.app";
  useEffect(() => {
    const qrcode = new window.QRCode(qrCodeWrapperRef.current);
    qrcode.makeCode(`${subscriptionUrl}`);
    document.addEventListener("keydown", onkeydownOnthisPage);
    return () => {
      document.removeEventListener("keydown", onkeydownOnthisPage);
    };
  }, []);
  const validateCode = async () => {
    let url = `${CONSTANTS.BASE_URL}/check`;
    let response = getApi(url, {
      uuid: uuid(),
      code: loginCode,
    });
    response = await response;
    console.log(response,"res");
    // response = JSON.parse(response);
    if (response?.status == true) {
      let data = { ...response, isLogin: true };
      localStorage.setItem("show_tv_login_data", JSON.stringify(data));
      dispatch(setAuthInfo(data));
      navigate("/home");
    } else {
      setError(response?.message);
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
    <div className="login-container" ref={ref}>
      <img
        src={logo}
        style={{ marginTop: "40px" }}
        alt="logo"
        width={"716"}
        height={"214"}
      />

      <FocusContext.Provider value={focusKey}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          className="input-wrapper"
        >
          <TextBox
            focusKey={"CodeInput"}
            className="CodeInput"
            placeholder={"Please insert the 10 digit code to login"}
            isFocused={true}
            value={loginCode}
            onChange={setLoginCode}
            type="text"
          /> 
          <FocusableButton
            className="CodeSubmit"
            focusKey={"submitBtn"}
            onClick={validateCode}
          >
            Submit
          </FocusableButton>
        </div>
      </FocusContext.Provider>

      <div className="qrcode-container">
        <div className="qrcode-wrapper" ref={qrCodeWrapperRef}></div>
      </div>
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
