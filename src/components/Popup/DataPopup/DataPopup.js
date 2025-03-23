import React, { useEffect, useRef } from "react";
import "./index.scss";
import KEY from "../../../utils/key";
export const DataPopup = (props) => {
  const { popupData, popupCallback, defaultValue } = props;
  const defaultFocusEle = useRef();
  useEffect(() => {
    if (defaultFocusEle?.current) {
      defaultFocusEle?.current?.focus();
    }
  }, []);

  const keydownHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const key = e.keyCode;
    switch (key) {
      case KEY.ENTER:
        clickHandler(e);
        break;
      case KEY.UP:
        if (e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
        break;
      case KEY.DOWN:
        if (e.target.nextSibling) {
          e.target.nextSibling.focus();
        }
        break;
      case KEY.BACK:
        popupCallback("close");
        break;
    }
  };
  const clickHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { value, type, label } = e.target.dataset;
    popupCallback("selected", { type, value, label });
  };
  return (
    <div className="modal-wrapper">
      <div className="modal-wrapper__content-wrapper">
        <ul
          className="data-list"
          onKeyDown={keydownHandler}
          onClick={clickHandler}
        >
          {popupData?.map((item, index) => {
            return (
              <li
                className={`data-list-item ${
                  defaultValue == item ? "active" : ""
                }`}
                tabIndex={0}
                key={item}
                data-label={item}
                data-value={item}
                ref={
                  defaultValue == item
                    ? defaultFocusEle
                    : index == 0
                    ? defaultFocusEle
                    : null
                }
              >
                <span data-value={item}>+ {item}</span>
                <span className="check" data-value={item}></span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

