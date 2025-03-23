import React, { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch } from "react-redux";
import { setAuthInfo } from "../../modules/auth/auth.action";
import "./index.scss";
import CONSTANTS from "../../utils/constant";
import Popup from "../../components/Popup";
import { FocusableButton } from "../../components/button";
import { getlocaliseText } from "../../utils/localisation";
import { DropDown } from "../../components/dropDown";
import { TextBox } from "../../components/textBox/index";
import {
  getLanguage,
  getParentalLock,
  getParentalLockNumber,
  setLanguage,
  setParentalLock,
  setParentalLockNumber,
} from "../../utils/util";
import {
  FocusContext,
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
const LanguageSetter = () => {
  const onTagChange = (option) => {
    setLanguage(option.value);
    window.location.reload();
  };

  let languageArray = [
    {
      label: "english",
      value: "en",
    },
    {
      label: "arabic",
      value: "ar",
    },
  ];

  return (
    <div className="LangContainer">
      <div className="Title">
        {getlocaliseText("ChangeLanguageText", "Language")}
      </div>
      <DropDown
        focusKey={"LangBtn"}
        className="LanguageBtn"
        placeholder={`${getlocaliseText(
          "ChangeLanguageText",
          "Language"
        )} : ${getLanguage()}`}
        setSelectedTag={onTagChange}
        isFocused={false}
        Allcatagories={languageArray}
        Dtype="language"
      />
    </div>
  );
};
 export const InputBoxOTP = ({
  otpInputtedValue,
  setotpInputtedValue,
  OTPBoxDigits,
}) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onEnterPress: () => {
      focusSelf();
      inputRef.current.focus();
    },
    onFocus: () => {
      inputRef.current.focus();
    },
  });
  let inputRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value.slice(0, OTPBoxDigits);
    setotpInputtedValue(value);
  };

  const isFocused = (index) => {
    if (focused) {
      if (otpInputtedValue.length === 0 && index === 0) return true;
      if (otpInputtedValue.length === 1 && index === 1) return true;
      if (otpInputtedValue.length === 2 && index === 2) return true;
      if (otpInputtedValue.length >= 3 && index === 3) return true;
    }

    return false;
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        onClick={() => {
          focusSelf();
          inputRef.current.focus();
        }}
        className="inputContainer"
      >
        <div className="otpBoxParent">
          {Array.from({ length: OTPBoxDigits }).map((_, index) => (
            <div
              key={index}
              id={`otpBox${index}`}
              className={`otpBox ${isFocused(index) ? "focused" : ""}`}
              onClick={() => {
                focusSelf();
                inputRef.current.focus();
              }}
            >
              {otpInputtedValue[index]}
            </div>
          ))}
        </div>
        <input
          ref={inputRef}
          style={{ opacity: 0 }}
          className="BoxInput"
          placeholder={""}
          value={otpInputtedValue}
          onChange={handleChange}
          type="number"
        />
      </div>
    </FocusContext.Provider>
  );
};

const FocusableCheckBox = ({ isChecked, setIsChecked }) => {
  const { ref, focusKey, focused } = useFocusable({
    onEnterPress: () => {
      setIsChecked(!isChecked);
    },
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`sliderCheckBox `}>
        <label className={`switch`} htmlFor="checkbox">
          <input
            checked={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            type="checkbox"
            id="checkbox"
          />
          <div className={`slider round ${focused ? "focused" : ""}`}>
            {focused && <div className="FocusDiv"></div>}
          </div>
        </label>
      </div>
    </FocusContext.Provider>
  );
};
const ParentalLock = (props) => {
  const defaultBoxValue = String(getParentalLockNumber());
  const defaultcheckBox = getParentalLock() === 'true' ? true : false;
  const [otpInputtedValue, setotpInputtedValue] = useState(defaultBoxValue);
  const [isChecked, setIsChecked] = useState(defaultcheckBox);
  let defaultMessage = {
    message: "",
    flag: false,
    isError: false,
  };
  const [showMessage, setshowMessage] = useState(defaultMessage);
  const MessageTimerRef = useRef(null);
  const SaveParentalLock = () => {
    clearTimeout(MessageTimerRef.current);
    const otpRegex = /^\d{4}$/;
    if (otpInputtedValue.length == 4 && otpRegex.test(otpInputtedValue)) {
      setParentalLockNumber(otpInputtedValue);
      setshowMessage({
        message: "Your parental lock pin is saved",
        flag: true,
        isError: false,
      });
    } else {
      setshowMessage({
        message: "Please enter correct Pin  only numbers allowed",
        flag: true,
        isError: true,
      });
    }
    MessageTimerRef.current = setTimeout(() => {
      setshowMessage(defaultMessage);
    }, 5000);
  };
  const setParentalLockToggle = (flag) => {
    clearTimeout(MessageTimerRef.current);
    const otpRegex = /^\d{4}$/;;
    if (otpInputtedValue.length == 4 && otpRegex.test(otpInputtedValue)) {
      console.log("valid");
      setParentalLock(flag);
      setIsChecked(flag);
    } else {
      setIsChecked(false);
      setshowMessage({
        message: "Please set Parental Lock first",
        flag: true,
        isError: true,
      });
    }
    MessageTimerRef.current = setTimeout(() => {
      setshowMessage(defaultMessage);
    }, 5000);
  };
  console.log(isChecked,"crr val");
  return (
    <>
      <div className="ParentalLock">
        <div className="title">{getlocaliseText("settingsPagePARENTAL_LOCK", "Parental Lock")}</div>
        <div className="ActivateLock">
          <div className="title">{getlocaliseText("settingsPageACTIVATE_PARENTAL_LOCK","Activate Parental lock")}</div>
          <div className="checkBox">
            <FocusableCheckBox
              isChecked={isChecked}
              setIsChecked={setParentalLockToggle}
            />
          </div>
        </div>
        <InputBoxOTP
          OTPBoxDigits={4}
          otpInputtedValue={otpInputtedValue}
          setotpInputtedValue={setotpInputtedValue}
        />
        <div className="BtnWrapper">
          <FocusableButton className="SaveBtn" onClick={SaveParentalLock}>
            {getlocaliseText("settingsPageLOGOUT", "Save")}
          </FocusableButton>
        </div>
        {showMessage.flag && (
          <div className="saveMessage">
            <div
              style={
                showMessage.isError
                  ? { background: "red" }
                  : { background: "#34C759" }
              }
              className="message"
            >
              {showMessage.message}
            </div>{" "}
          </div>
        )}
      </div>
    </>
  );
};

const Profile = (props) => {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("language");
  useEffect(() => {
    let rootDiv = document.getElementById("root");
    let menuDiv = document.getElementsByClassName("menu-list");
    if (rootDiv && menuDiv.length > 0) {
      rootDiv.style.background = "black";
      menuDiv[0].style.background = "black";
    }
    return () => {
      let rootDiv = document.getElementById("root");
      let menuDiv = document.getElementsByClassName("menu-list");
      if (rootDiv && menuDiv.length > 0) {
        rootDiv.style.background = "#151515";
        menuDiv[0].style.background = "#151515";
      }
    };
  }, []);

  const clickHandler = (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    } catch (e) {}
    setShowPopup(true);
  };

  const logoutPopupCallback = (type) => {
    switch (type) {
      case "done":
        localStorage.removeItem("show_tv_login_data");
        localStorage.removeItem("isLogin");
        dispatch(setAuthInfo(null));
        break;
      case "cancel":
      case "back":
        setShowPopup(false);
        break;
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="page-content">
          <div className="SubMenuContainer">
            <FocusableButton
              className="login-btn"
              onClick={() => setSelectedMenu("language")}
            >
              {getlocaliseText("settingsPageLANGUAGE", "Language")}
            </FocusableButton>
            <FocusableButton
              className="login-btn"
              onClick={() => setSelectedMenu("parentalLock")}
            >
              {getlocaliseText("settingsPagePARENTAL_LOCK", "Parental Lock")}
            </FocusableButton>
            <FocusableButton className="login-btn" onClick={()=>{}}>
              {getlocaliseText("settingsPageAUTO_INTRO", "Auto Intro")}
            </FocusableButton>
            <FocusableButton
              className="login-btn"
              focusKey={"LogoutBtn"}
              onClick={clickHandler}
            >
              {getlocaliseText("settingsPageLOGOUT", "Logout")}
            </FocusableButton>
          </div>
          <div className="SelectedMenuViewer">
            {selectedMenu == "parentalLock" && <ParentalLock />}
            {selectedMenu == "language" && <LanguageSetter />}
          </div>
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
    </>
  );
};

export default Profile;
