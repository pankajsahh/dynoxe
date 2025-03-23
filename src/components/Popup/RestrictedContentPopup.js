import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import KEY from "../../utils/key";
import { FocusableButton } from "../button";
import {
  FocusContext,
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { getParentalLockNumber } from "../../utils/util";
const InputBoxOTP = ({
  otpInputtedValue,
  setotpInputtedValue,
  OTPBoxDigits,
  hasError,
}) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onEnterPress: () => {
      focusSelf();
      inputRef.current.focus();
    },
    onFocus: () => {
      inputRef.current.focus();
    },
    onArrowPress: (prop) => {
      if (prop == "down") {
        console.log("object");
        setFocus("SUBMITBTN");
      }
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
              {hasError && <div className="errorBox"></div>}
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

const RestrictedContentPopup = (props) => {
  const { keyDownHandler, title, cancelBtn, okBtn } = props;
  const [errorWhileAccess, setErrorWhileAccess] = useState("");
  const { ref, focusKey } = useFocusable({
    focusKey: "controllbtn",
    isFocusBoundary: true,
  });
  const WrongPinTimer = useRef(null);
  const [otpInputtedValue, setotpInputtedValue] = useState("");
  const verifyPin = () => {
    const CurrentPin = getParentalLockNumber();
    if (String(CurrentPin) == String(otpInputtedValue)) {
      console.log(CurrentPin, otpInputtedValue, "dd pp");
      return true;
    }
    console.log(CurrentPin, otpInputtedValue, "dd");
    return false;
  };
  const onSubmitClick = () => {
    clearTimeout(WrongPinTimer.current);
    if (verifyPin()) {
      keyDownHandler(true);
    } else {
      setErrorWhileAccess("Wrong pin. Please Try again");
    }
    WrongPinTimer.current = setTimeout(() => {
      setErrorWhileAccess("");
    }, 5000);
  };

  return (
    <div className="exit-popup">
      <div className="wrapper">
        {title && <div className="title">{title}</div>}
        {errorWhileAccess && <div className="message">{errorWhileAccess}</div>}

        <FocusContext.Provider value={focusKey}>
          <InputBoxOTP
            OTPBoxDigits={4}
            otpInputtedValue={otpInputtedValue}
            setotpInputtedValue={setotpInputtedValue}
            hasError={errorWhileAccess == "" ? false : true}
          />
          <div ref={ref} className="btnWrap">
            {cancelBtn && (
              <FocusableButton
                className="btn"
                focusKey={"CancelBtn"}
                isFocused={true}
                onClick={() => keyDownHandler(false)}
              >
                {cancelBtn}
              </FocusableButton>
            )}
            {okBtn && (
              <FocusableButton
                className="btn"
                focusKey={"SUBMITBTN"}
                isFocused={false}
                onClick={() => onSubmitClick(okBtn)}
              >
                {okBtn}
              </FocusableButton>
            )}
          </div>
        </FocusContext.Provider>
      </div>
    </div>
  );
};

export default RestrictedContentPopup;
