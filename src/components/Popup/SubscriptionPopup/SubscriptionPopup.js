import React, { useRef, useEffect } from "react";
import "./index.scss";
import KEY from "../../../utils/key";
import { platform } from "../../../utils/generic";

const SubscriptionPopup = (props) => {
  const { message } = props;
  const { popupCallback } = props;
  const gobackRef = useRef();
  const okbtnRef = useRef();
  const qrCodeWrapperRef = useRef();
  const subscriptionUrl = "https://mahuaplay.com/Subscription";

  useEffect(() => {
    okbtnRef?.current?.focus();
    const qrcode = new window.QRCode(qrCodeWrapperRef.current);
    qrcode.makeCode(`${subscriptionUrl}`);
  }, []);

  const keydownHandler = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const key = e.keyCode;
    switch (key) {
      case KEY.UP:
        if (item === "okay") {
          gobackRef?.current?.focus();
        }
        break;
      case KEY.DOWN:
        if (item === "back") {
          okbtnRef?.current?.focus();
        }
        break;
      case KEY.ENTER:
      case KEY.BACK:
        clickHandler(e);
        break;
    }
  };

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    popupCallback();
  };

  return (
    <div className="freetrial-popup">
      <div className="header">
        <span className="logo"></span>
        <div
          className="back-button"
          tabIndex={0}
          onKeyDown={(event) => keydownHandler(event, "back")}
          onClick={(event) => clickHandler(event)}
          ref={gobackRef}
        >
          <span className="logo"></span>
          <span className="text">Go Back</span>
        </div>
        <div className="content-wrapper">
          <div className="title">How to watch</div>
          <div className="sub-title">
            {message}:
            <br /> {subscriptionUrl}
          </div>
          <div className="qrcode-wrapper" ref={qrCodeWrapperRef}></div>
          <span
            tabIndex={0}
            className="btn"
            onKeyDown={(event) => keydownHandler(event, "okay")}
            onClick={(event) => clickHandler(event)}
            ref={okbtnRef}
          >
            Continue
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;
