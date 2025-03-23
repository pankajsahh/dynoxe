import React, { useEffect, useRef } from "react";

import "./index.scss";

import KEY from "../../utils/key";

const Subtitle = (props) => {
  const { callbackHandler, textTracks, selectedLanguage } = props;
  const listRef = useRef();

  useEffect(() => {
    if (listRef && listRef.current) {
      listRef.current.focus();
    }
  }, []);

  const keyDown = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    let key = e.keyCode;
    switch (key) {
      case KEY.DOWN:
        if (e.target.nextSibling) {
          e.target.nextSibling.focus();
        }
        break;
      case KEY.UP:
        if (e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
        break;
      case KEY.ENTER:
        callbackHandler(item);
        break;
      case KEY.BACK:
        callbackHandler("back");
        break;
    }
  };

  const clickHandler = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    callbackHandler(item);
  };

  return (
    <div className="subtitle-popup">
      <div className="wrapper">
        <ul className="list" id="list">
          {textTracks && textTracks.length > 0
            ? textTracks.map((item, i) => {
                return (
                  <li
                    tabIndex={0}
                    onKeyDown={(e) => keyDown(e, item)}
                    onClick={(e) => clickHandler(e, item)}
                    className={`${
                      selectedLanguage === item.language ? "active" : ""
                    }`}
                    ref={i == 0 ? listRef : null}
                  >
                    {item.language}
                  </li>
                );
              })
            : null}
          <li
            tabIndex={0}
            onKeyDown={(e) => keyDown(e, "none")}
            onClick={(e) => clickHandler(e, "none")}
            className={`${selectedLanguage === "none" ? "active" : ""}`}
          >
            none
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Subtitle;
