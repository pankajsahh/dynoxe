import React, { Fragment, useState, useEffect, useRef } from "react";
import "./index.scss";
import KEY from "../../utils/key";
import { postApi, getApi } from "../../utils/api";

const DetailsPopup = (props) => {
  const { setPlaybackData, type } = props;
  const playBtnRef = useRef();
  const closeBtnRef = useRef();
  const addBtnRef = useRef();
  const descriptionRef = useRef();
  const scrollHeight = useRef();
  scrollHeight.current = 0;
  const {
    popupCallback,
    details,
    auth,
    account,
    history,
    setMyVideos,
    watchDetails,
  } = props;
  const [isInWatchlist, setIsInWachlist] = useState(false);
  const [upcoming, setUpcoming] = useState(false);
  useEffect(() => {
    const isComingSoon =
      (details?.availableFrom &&
        new Date(details.availableFrom).getTime() > Date.now()) ||
      false;
    setUpcoming(isComingSoon);
    checkWatchList();
    setTimeout(() => {
      if (playBtnRef?.current) {
        playBtnRef.current.focus();
      } else if (closeBtnRef?.current) {
        closeBtnRef.current.focus();
      }
    }, 200);
  }, []);

  const leftHandler = (e) => {
    if (e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };
  const rightHandler = (e) => {
    if (e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const upHandler = (e, item) => {
    if (
      item == "close" ||
      item == "resume" ||
      item == "play" ||
      item == "add" ||
      item == "remove" ||
      item == "subscribe" ||
      item == "register"
    ) {
      descriptionRef?.current?.focus();
    } else {
      if (scrollHeight.current > 0) {
        scrollHeight.current = 0;
      }
      scrollHeight.current -= 20;
      descriptionRef?.current?.scrollTo({
        top: scrollHeight.current,
        behavior: "smooth",
      });
    }
  };
  const downHandler = (e, item) => {
    if (scrollHeight.current < 0) {
      scrollHeight.current = 0;
    }
    if (
      descriptionRef.current.scrollTop ==
      descriptionRef.current.scrollHeight - descriptionRef.current.offsetHeight
    ) {
      if (playBtnRef?.current) {
        playBtnRef.current.focus();
      } else if (closeBtnRef?.current) {
        closeBtnRef.current.focus();
      }
    } else {
      scrollHeight.current += 20;
      descriptionRef?.current?.scrollTo({
        top: scrollHeight.current,
        behavior: "smooth",
      });
    }
  };

  const keydownHandler = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const key = e.keyCode;
    switch (key) {
      case KEY.UP:
        upHandler(e, item);
        break;
      case KEY.DOWN:
        downHandler(e, item);
        break;
      case KEY.LEFT:
        leftHandler(e);
        break;
      case KEY.RIGHT:
        rightHandler(e);
        break;
      case KEY.ENTER:
        clickHandler(e, item);
        break;
      case KEY.BACK:
        popupCallback("back", isInWatchlist);
        break;
    }
  };

  const clickHandler = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    switch (item) {
      case "close":
      case "subscribe":
      case "register":
        popupCallback(item, isInWatchlist);
        break;
      case "login":
        history.push("/login");
        break;
      case "add":
        addToWatchList();
        break;
      case "remove":
        removeFromWatchList();
        break;
      case "play":
        getPlayerUrl();
        break;
      case "resume":
        getPlayerUrl();
        break;
    }
  };

  const getPlayerUrl = async () => {
    // const { accessToken } = auth;
    // const query = getPlayableUrlQuery(details);
    // let response = postApi(query, accessToken);
    // response = await response;
    // response = response && JSON.parse(response);
    // if (response && response.data) {
    //   getContentMetadata(response.data.playVideo || response.data.playDRM);
    // }
  };

  const getContentMetadata = async (url) => {
    let response = getApi(url);
    response = await response;
    response = response && JSON.parse(response);
    setPlaybackData({ ...response, position: watchDetails?.position || 0 });
    setTimeout(() => {
      props.history.push(`/player`);
    }, 200);
  };

  const focusHandler = (e) => {
    // setLastActiveItem({ item: e.target.id });
  };

  const addToWatchList = async () => {
    const { accessToken } = auth;
    const query = addToWatchlistQuery(details);
    let response = postApi(query, accessToken);
    response = await response;
    if (response) {
      if (addBtnRef && addBtnRef.current) {
        addBtnRef.current.focus();
      }
      setMyVideos([]);
      checkWatchList();
    }
  };

  const removeFromWatchList = async () => {
    const { accessToken } = auth;
    const query = removeFromWatchlistQuery(details);
    let response = postApi(query, accessToken);
    response = await response;
    if (response) {
      if (addBtnRef && addBtnRef.current) {
        addBtnRef.current.focus();
      }
      setMyVideos([]);
      checkWatchList();
    }
  };

  const checkWatchList = async () => {
    const { accessToken } = auth;
    const query = checkWatchlistQuery(details);
    let response = postApi(query, accessToken);
    response = await response;
    if (response) {
      response = JSON.parse(response);
      setIsInWachlist(response?.data?.isInWatchlist || false);
      // setTimeout(() => {
      //   if (playBtnRef && playBtnRef.current) {
      //     playBtnRef.current.focus();
      //   }
      // }, 500);
    }
  };

  const getButtons = () => {
    const { subscriptionAccount, activeUserFreePass } = account;
    const { isLogin } = auth;
    let isActive = false;
    if (subscriptionAccount && subscriptionAccount.isActive) {
      isActive = true;
    }

    if (type == "series") {
      return (
        <div
          className="btn"
          tabIndex={0}
          id="close-btn"
          ref={closeBtnRef}
          onClick={(event) => clickHandler(event, "close")}
          onKeyDown={(event) => keydownHandler(event, "close")}
          onFocus={(event) => focusHandler(event)}
        >
          close
        </div>
      );
    }

    if (!isLogin) {
      return (
        <Fragment>
          {details?.isFree ? (
            <div className="trial-message">
              Register to watch this video for free
            </div>
          ) : (
            <div className="trial-message">Subscribe now to start watching</div>
          )}
          <div
            className="btn subscribe"
            tabIndex={0}
            id="free-trial-btn"
            onClick={(event) =>
              clickHandler(event, details?.isFree ? "register" : "subscribe")
            }
            onKeyDown={(event) =>
              keydownHandler(event, details?.isFree ? "register" : "subscribe")
            }
            onFocus={(event) => focusHandler(event)}
            ref={playBtnRef}
          >
            {details?.isFree ? "Register to watch" : "Subscribe to watch"}
          </div>
          <div
            className="btn"
            tabIndex={0}
            id="close-btn"
            ref={closeBtnRef}
            onClick={(event) => clickHandler(event, "close")}
            onKeyDown={(event) => keydownHandler(event, "close")}
            onFocus={(event) => focusHandler(event)}
          >
            close
          </div>
          <div
            className="btn"
            tabIndex={0}
            id="login-btn"
            onClick={(event) => clickHandler(event, "login")}
            onKeyDown={(event) => keydownHandler(event, "login")}
            onFocus={(event) => focusHandler(event)}
          >
            Log In
          </div>
        </Fragment>
      );
    }

    if (isLogin && !isActive && !activeUserFreePass) {
      return (
        <Fragment>
          <div className="trial-message">Subscribe now to start watching</div>
          <div
            className="btn subscribe"
            tabIndex={0}
            id="free-trial-btn"
            onClick={(event) => clickHandler(event, "subscribe")}
            onKeyDown={(event) => keydownHandler(event, "subscribe")}
            onFocus={(event) => focusHandler(event)}
            ref={playBtnRef}
          >
            Subscribe to watch
          </div>
          <div
            className="btn"
            tabIndex={0}
            id="close-btn"
            ref={closeBtnRef}
            onClick={(event) => clickHandler(event, "close")}
            onKeyDown={(event) => keydownHandler(event, "close")}
            onFocus={(event) => focusHandler(event)}
          >
            close
          </div>
        </Fragment>
      );
    }

    if (isLogin && (isActive || activeUserFreePass)) {
      return (
        <Fragment>
          {!upcoming ? (
            <div
              className="btn play"
              tabIndex={0}
              id="play-btn"
              onClick={(event) => clickHandler(event, "play")}
              onKeyDown={(event) => keydownHandler(event, "play")}
              onFocus={(event) => focusHandler(event)}
              ref={playBtnRef}
            >
              <span className="icon"></span>
              {watchDetails?.position ? "Start Watching" : "Play"}
            </div>
          ) : null}
          {watchDetails?.position && !upcoming ? (
            <div
              className="btn play"
              tabIndex={0}
              id="continue-watch-btn"
              onClick={(event) => clickHandler(event, "resume")}
              onKeyDown={(event) => keydownHandler(event, "resume")}
              onFocus={(event) => focusHandler(event)}
              ref={playBtnRef}
            >
              <span className="icon"></span>
              Resume
            </div>
          ) : null}
          <div
            className="btn"
            tabIndex={0}
            id="close-btn"
            ref={closeBtnRef}
            onClick={(event) => clickHandler(event, "close")}
            onKeyDown={(event) => keydownHandler(event, "close")}
            onFocus={(event) => focusHandler(event)}
          >
            close
          </div>
        </Fragment>
      );
    }
  };

  return (
    <div
      className="details-popup"
      style={{
        backgroundImage: `url('${details?.heroImageUrl}?w=1482&h=833&fit=crop&crop=edges')`,
      }}
    >
      <div className="popup-wrapper">
        <div className="title-wrapper">
          <div className="title">{details?.result?.title}</div>
        </div>
        <div className="details-wrapper">
          <div
            className="left-section"
            ref={descriptionRef}
            data-name="description"
            tabIndex={0}
            dangerouslySetInnerHTML={{
              __html: details?.result?.summaryLong?.replace(/\n/g, "<br/>"),
            }}
            onClick={(event) => clickHandler(event, "description")}
            onKeyDown={(event) => keydownHandler(event, "description")}
            onFocus={(event) => focusHandler(event)}
          >
            {/* {details.summaryLong?.replace(/\n/g, "<br/>")} */}
          </div>
          <div className="right-section">
            <div className="title">
              {details?.result?.categories?.join(",")}
            </div>
            <div className="time-wrapper">
              {details?.durationInSeconds ? (
                <span className="time">
                  {Math.floor(details?.durationInSeconds / (1000 * 60))} Mins
                </span>
              ) : null}
              <span className="age-rating">
                {details?.result?.category_name || "NR"}
              </span>
            </div>
            <hr className="line-breaker" />
            <div className="title">Cast & Crew</div>
            <div className="cast-crew-details">{details?.result?.cast}</div>
          </div>
        </div>
        <div className="button-wrapper">
          {getButtons()}
          {auth.isLogin ? (
            isInWatchlist ? (
              <div
                className="btn added"
                tabIndex={0}
                id="add-btn"
                ref={addBtnRef}
                onClick={(event) => clickHandler(event, "remove")}
                onKeyDown={(event) => keydownHandler(event, "remove")}
                onFocus={(event) => focusHandler(event)}
              >
                <span className="icon"></span>
                remove
              </div>
            ) : (
              <div
                className="btn add"
                tabIndex={0}
                id="add-btn"
                ref={addBtnRef}
                onClick={(event) => clickHandler(event, "add")}
                onKeyDown={(event) => keydownHandler(event, "add")}
                onFocus={(event) => focusHandler(event)}
              >
                <span className="icon"></span>
                add
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DetailsPopup;
