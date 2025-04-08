import React, { Fragment, useState, useEffect, useRef } from "react";
import KEY from "../../utils/key";
import { exit } from "../../utils/generic";
import CONSTANTS from "../../utils/constant";
import "./index.scss";
import Popup from "../Popup";
import { toFormatedDate } from "../../utils/util";

const Carousel = (props) => {
  const { data, mode, fref, lastActive, setCarouselIndex, carouselIndex } =
    props;
  const [exitPopup, setExitPopup] = useState(false);
  const [carouselData, setCarouselData] = useState(data || []);
  const [currentIndex, setCurrentIndex] = useState(carouselIndex);
  const [selectedData, setSelectedData] = useState(null);
  const rotateInterval = useRef();
  const actionTimeout = useRef();
  const carouselRef = useRef();

  useEffect(() => {
    if (data && data.length > 0) {
      setCarouselData(data);
      // setCurrentIndex(0);
      // setCarouselIndex(0);
      autoRotate();
    }
    return () => {
      if (rotateInterval?.current) {
        clearInterval(rotateInterval.current);
      }
      if (actionTimeout?.current) {
        clearTimeout(actionTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (carouselData && carouselData.length > 0) {
      setSelectedData({
        ...carouselData[currentIndex],
      });
      setCarouselIndex(currentIndex);
    }
  }, [currentIndex]);

  const autoRotate = () => {
    if (rotateInterval?.current) {
      clearInterval(rotateInterval.current);
    }
    rotateInterval.current = setInterval(() => {
      rotateRight();
    }, 10000);
  };
  const rotateLeft = () => {
    setCurrentIndex((currentIndex) => {
      if (currentIndex > 0) {
        return currentIndex - 1;
      } else {
        return carouselData.length - 1;
      }
    });
    if (actionTimeout?.current) {
      clearTimeout(actionTimeout.current);
    }
    actionTimeout.current = setTimeout(() => {
      autoRotate();
    }, 5000);
  };
  const rotateRight = () => {
    setCurrentIndex((currentIndex) => {
      if (currentIndex < carouselData.length - 1) {
        return currentIndex + 1;
      } else {
        return 0;
      }
    });
    if (actionTimeout?.current) {
      clearTimeout(actionTimeout.current);
    }
    actionTimeout.current = setTimeout(() => {
      autoRotate();
    }, 5000);
  };

  const debounce = (fn, delay = 1000) => {
    let timerId = null;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  };

  const showExitPopup = debounce(() => {
    setExitPopup(true);
  }, 100);

  const keyDownHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const key = e.keyCode;
    switch (key) {
      case KEY.DOWN:
        if (lastActive) {
          document.querySelector(`#${lastActive}`).focus();
        } else if (document.querySelector(`#row-0-0`)) {
          document.querySelector(`#row-0-0`).focus();
        }
        break;
      case KEY.LEFT:
        leftHandler(e);
        break;
      case KEY.RIGHT:
        rightHandler(e);
        break;
      case KEY.ENTER:
        clickHandler(e);
        break;
      case KEY.BACK:
        showExitPopup();
        // setExitPopup(true);
        break;
    }
  };

  const leftHandler = (e) => {
    if (rotateInterval?.current) {
      clearInterval(rotateInterval.current);
    }
    if (currentIndex == 0 && props?.menuRef?.current) {
      props.menuRef.current.focus();
      props.setLastActiveItem({ item: e.target.id });
    } else {
      rotateLeft();
    }
  };

  const rightHandler = (e) => {
    if (rotateInterval?.current) {
      clearInterval(rotateInterval.current);
    }
    rotateRight();
  };

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.clickHandler(selectedData);
  };

  const focusHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fref?.current) {
      fref.current.scrollIntoView({
        behavior: "auto",
        block: "start",
        inline: "start",
      });
    }
  };

  const popupCallback = (type) => {
    switch (type) {
      case "done":
        exit(CONSTANTS.device);
        break;
      case "cancel":
        setExitPopup(false);
        if (fref && fref.current) {
          fref.current.focus();
        }
        break;
    }
  };

  return (
    <Fragment>
      <div
        className="carousel-container"
        style={{
          backgroundImage: `url('${
            selectedData?.full_width || selectedData?.landscape
          }')`,
        }}
        // ref={carouselRef}
        id="carousel-wrapper"
        ref={fref}
        tabIndex={0}
        onKeyDown={keyDownHandler}
        onClick={clickHandler}
        onFocus={focusHandler}
      >
        {/* {selectedData?.isComingSoon ? (
          <div className="comingsoon-banner">{selectedData?.formatedDate}</div>
        ) : null} */}
        <div className={`details-wrapper ${mode}`}>
          <div className="title">{selectedData?.name}</div>
          <div className="genre">
            {selectedData?.category_name ? (
              <Fragment>
                <span className="text">{selectedData.category_name}</span>
                <span className="text">|</span>
              </Fragment>
            ) : null}
            {/* {selectedData?.productionYear ? (
              <Fragment>
                <span className="text">{selectedData.productionYear}</span>
                <span className="text">|</span>
              </Fragment>
            ) : null}
            {selectedData?.durationInSeconds ? (
              <span className="text">
                {Math.floor(selectedData.durationInSeconds / 60)} Mins
              </span>
            ) : null} */}
          </div>

          {/* <div
            className="more-details"
            ref={fref}
            tabIndex={0}
            onKeyDown={keyDownHandler}
            onClick={clickHandler}
            onFocus={focusHandler}
            id="more-details"
          >
            Find out more
          </div> */}
          <div className="indicator-wrapper">
            {carouselData && carouselData.length > 0
              ? carouselData.map((item, i) => {
                  return (
                    <span
                      key={item.id}
                      className={`indicator ${
                        i === currentIndex ? "active" : ""
                      }`}
                    ></span>
                  );
                })
              : null}

            {/* <span className="indicator active"></span>
          <span className="indicator"></span> */}
          </div>
        </div>
      </div>
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

export default Carousel;
