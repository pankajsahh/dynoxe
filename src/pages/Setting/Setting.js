import React, { useCallback, useEffect, useRef, useState } from "react";

import "./index.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CONSTANTS from "../../utils/constant";
import usePageData from "../../helpers/pageApi";
import {
  FocusContext,
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import Loader from "../../components/Loader";

const Settings = (props) => {
  const { pathname } = useLocation();
  console.log(pathname, "pathname");
  let url = CONSTANTS.BASE_URL + "/terms";
  let title = "";
  if (pathname == "/terms") {
    title = "Terms and Conditions";
    url = CONSTANTS.BASE_URL + "/terms";
  } else if (pathname == "/contact") {
    url = CONSTANTS.BASE_URL + "/contactus";
  }
  const { pageData, loading, error } = usePageData(url);
  console.log(pageData, loading, error, "privacy");

  const scrollingAreaRef = useRef(null);

  const scrollHandler = useCallback(
    (props) => {
      if (props == "down") {
        if (scrollingAreaRef?.current) {
          try {
            scrollingAreaRef?.current?.scrollTo({
              top: scrollingAreaRef.current.scrollTop + 200,
              behavior: "smooth",
            });
          } catch (e) {}
          return false;
        }
      } else if (props == "up") {
        if (
          scrollingAreaRef?.current &&
          scrollingAreaRef.current.scrollTop > 0
        ) {
          try {
            scrollingAreaRef?.current?.scrollTo({
              top: scrollingAreaRef.current.scrollTop - 200,
              behavior: "smooth",
            });
          } catch (e) {}
          return false;
        }
      } else if (props == "left") {
        setFocus("MENU");
        return false;
      }
      return true;
    },
    [scrollingAreaRef]
  );
  return (
    <div className="setting-container">
      {pageData?.data?.termsdata ? (
        <div className="SelectedMenuViewer">
          <div className="centerInfo">
            <div className="Title">{title}</div>
            <div className="desc" ref={scrollingAreaRef}>
              <ScrollableTextArea
                content={pageData?.data?.termsdata}
                isFocused={true}
                scrollHandler={scrollHandler}
              />
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export const ScrollableTextArea = ({ content, isFocused, scrollHandler }) => {
  const { ref, focusSelf, focused } = useFocusable({
    onArrowPress: (props) => {
      return scrollHandler(props);
    },
  });
  useEffect(() => {
    if (isFocused) focusSelf();
  }, []);
  return (
    <>
      <div
        ref={ref}
        className={focused ? "focusedText" : ""}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
};
export default Settings;
