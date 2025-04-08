import React, { Fragment, useEffect, useState, memo, useRef } from "react";
import "./index.scss";
import KEY from "../../utils/key";
import CONSTANTS from "../../utils/constant";
import Popup from "../../components/Popup";
import { exit } from "../../utils/generic";
import Loader from "../../components/Loader";
import usePageData from "../../helpers/pageApi";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import ListContainer from "../../components/ListContainer/ListContainer";

const Home = () => {
  const { pageData, loading, error } = usePageData(`${CONSTANTS.BASE_URL}/home_page`);
  console.log(pageData);
  const [exitPopup, setExitPopup] = useState(false);
  const { ref, focusKey } = useFocusable({})
  const listItemRef = useRef();
  const popupCallback = (type) => {
    switch (type) {
      case "done":
        exit(CONSTANTS.device);
        break;
      case "cancel":
        if (listItemRef && listItemRef.current) {
          listItemRef.current.focus();
        }
        setExitPopup(false);
        break;
    }
  };
  const onBackBtn = (event) => {
    if (event.keyCode === KEY.BACK) {
      setExitPopup(true);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown",  onBackBtn);
    return () => {
      document.removeEventListener("keydown", onBackBtn);
    }
  }, []);

  return (
    <Fragment>
      <FocusContext.Provider value={focusKey}>
        <div ref={ref} className={`home-page`}>
          {pageData && (
            <ListContainer
            listData={pageData.data}
            isFocused={true}
            />
          )}
          {error != null && <div className="home-page">
            <div className={`list-section`}>
              <div
                className="error-message"
                ref={listItemRef}
                data-col={0}
                id="no-data"
                onKeyDown={(e) => keydownHandler(e, null, 0, 0)}
              >
                {" "}
                No data found
              </div>
            </div>
          </div>}
          {loading && <Loader />}
        </div>
      </FocusContext.Provider>
      {exitPopup ? (
        <Popup
          message={CONSTANTS.MESSAGE.EXIT_MESSAGE}
          cancelBtn={CONSTANTS.MESSAGE.NO}
          okBtn={CONSTANTS.MESSAGE.YES}
          keyDownHandler={popupCallback}
        />
      ) : null}
    </Fragment>
  );
};


export default memo(Home);
