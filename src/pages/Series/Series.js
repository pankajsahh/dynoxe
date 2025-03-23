import React, { useState, useEffect, useRef, Fragment } from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import "./index.scss";
import { postApi, getApi } from "../../utils/api";
import Loader from "../../components/Loader";
import { setContentDetails } from "../../modules/details/details.action";
import { setPlaybackData } from "../../modules/player/player.actions";
import {
  showMenu,
  setLastActiveItem,
  setLastActiveListItem,
} from "../../modules/menu/menu.action";
import KEY from "../../utils/key";
import { reportEvent } from "../../helpers/gaEvents";
import DetailsPopup from "../../components/DetailsPopup";
import CONSTANTS from "../../utils/constant";
import Popup from "../../components/Popup";
import SubscriptionPopup from "../../components/Popup/SubscriptionPopup";
import useAllCategories from "../Search/AllCatList";

const Series = (props) => {
  const { showMenu, auth, account, details, setPlaybackData } = props;
  const { video_id: id, title } = useParams();
  const [loader, setLoader] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const defaultFocus = useRef();
  const [errorPopup, showErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const addBtnRef = useRef();
  const moreBtnRef = useRef();
  const [isPremium, setIsPremium] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [season, setSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [subscriptionPopup, setSubscriptionPopup] = useState(false);
  let { type_id, video_id, video_type } = useParams();
  useEffect(() => {
    if (!details) {
      setLoader(true);
      fetchRentedData();
      fetchSubscriptionData();
      fetchData();
    } else {
      setLoader(false);
      setDefaultFocus();
    }
  }, []);

  useEffect(() => {
    if (details) {
      setDefaultFocus();
      setSeason(details?.session?.[0]);
    }
  }, [details]);

  useEffect(() => {
    if (season) {
      fetchEpisodesData();
    }
  }, [season]);

  const setDefaultFocus = () => {
    defaultFocus?.current?.focus();
  };

  const fetchData = async () => {
    let url = `${CONSTANTS.BASE_URL}section_detail`;
    let response = postApi(url, { type_id, video_id, video_type });
    response = await response;
    if (response) {
      if (response?.status == 200) {
        props.setContentDetails({
          relatedVideos: response.get_related_video
            ? [
                {
                  title: "related Videos",
                  data: response.get_related_video || [],
                },
              ]
            : [],
          result: response.result,
          session: response.session,
        });
        setLoader(false);
        if (defaultFocus?.current) {
          defaultFocus.current.focus();
        } else {
          moreBtnRef.current.focus();
        }
      } else {
        const { errors } = response;
        setErrorMessage(errors[0].message);
        setLoader(false);
        wrapperRef?.current?.focus();
      }
    }
  };

  const fetchRentedData = async () => {
    if (auth?.id) {
      let url = `${CONSTANTS.BASE_URL}user_rent_video_list`;
      let response = postApi(url, { user_id: auth?.id });
      response = await response;
      if (response && response?.status == 200) {
        let arr = [];
        if (video_type == 2) {
          arr = response?.tvshow?.filter((item) => item.id == video_id);
        } else {
          arr = response?.video?.filter((item) => item.id == video_id);
        }
        if (arr.length > 0) {
          setIsRented(true);
        } else {
          setIsRented(false);
        }
      }
    }
  };

  const fetchSubscriptionData = async () => {
    let url = `${CONSTANTS.BASE_URL}subscription_list`;
    let response = postApi(url, { user_id: auth?.id });
    response = await response;
    if (response && response?.status == 200) {
      let expiry_date = response?.result?.[0]?.expiry_date;
      if (expiry_date) {
        let premium = new Date(expiry_date).getTime() > Date.now();
        setIsPremium(premium);
      }
    }
  };

  const fetchEpisodesData = async () => {
    let url = `${CONSTANTS.BASE_URL}get_video_by_session_id`;
    let response = postApi(url, {
      session_id: season?.id,
      show_id: details?.id || id,
    });
    response = await response;
    if (response.result) {
      setEpisodes(response.result);
      setPlaybackData({ ...(response?.result?.[0] || {}) });
    }
  };

  const keydownHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const key = event.keyCode;
    switch (key) {
      case KEY.ENTER:
        clickHandler(event);
        break;
      case KEY.UP:
        if (event.target?.previousSibling) {
          event.target.previousSibling.focus();
        }
        break;
      case KEY.DOWN:
        if (event.target?.nextSibling) {
          event.target?.nextSibling.focus();
        }
        break;
      case KEY.BACK:
        // setLastActiveListItem({ item: "" });
        window.history.back();
        break;
    }
  };
  const clickHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const { name } = event.target.dataset;
    switch (name) {
      case "episode":
        props.history.push(`/season-episodes/${video_id}`);
        break;
      case "play_episode":
        play_first_episode();
        break;
      case "start_again":
        play_first_episode();
        break;
      case "more":
        setDetailsPopup(true);
        break;
    }
  };
  const focusHandler = (event) => {
    event.stopPropagation();
  };

  const play_first_episode = () => {
    if (!auth.isLogin) {
      props.history.push(`/auth`);
      return;
    }

    if (details?.result?.is_premium == 0 && details?.result?.is_rent == 0) {
      if (details?.result?.video_upload_type == "youtube") {
        setErrorMessage("This video can't be played");
        showErrorPopup(true);
        return;
      }
      props.history.push(`/player`);
    }

    if (details?.result?.is_rent == 1) {
      if (!isRented) {
        // setErrorMessage("Please rent to play this content!");
        setErrorMessage(`Rent ${details?.result?.name} on Mahuaplay at`);
        setSubscriptionPopup(true);
        return;
      }
      if (details?.result?.video_upload_type == "youtube") {
        setErrorMessage("This video can't be played");
        showErrorPopup(true);
        return;
      }
      props.history.push(`/player`);
    }

    if (details?.result?.is_premium == 1) {
      if (!isPremium) {
        // setErrorMessage("Please subscribe to play this content!");
        setErrorMessage("Subscribe to Mahuaplay at");
        setSubscriptionPopup(true);
        return;
      }
      if (details?.result?.video_upload_type == "youtube") {
        setErrorMessage("This video can't be played");
        showErrorPopup(true);
        return;
      }
      props.history.push(`/player`);
    }
  };

  const popupCallback = (result, isInWatchlist) => {
    setDetailsPopup(false);
    switch (result) {
      case "back":
      case "close":
        if (moreBtnRef?.current) {
          moreBtnRef.current.focus();
        }
        break;
    }
  };

  const errorPopupCallback = (result) => {
    showErrorPopup(false);
    setErrorMessage("");
    switch (result) {
      case "back":
      case "done":
        if (defaultFocus.current) {
          defaultFocus.current.focus();
        }
        break;
      default:
        if (defaultFocus.current) {
          defaultFocus.current.focus();
        }
        break;
    }
  };

  const getWatchBtnText = () => {
    // if (!auth.isLogin) {
    //   return "Login to watch";
    // }

    // if (!details?.result?.is_premium && !details?.result?.is_rent) {
    //   return "Play: Episode 1";
    // }

    // if (details?.result?.is_premium && !isPremium) {
    //   return "Subscribe";
    // }

    // if (details?.result?.is_rent) {
    //   return "Rent Series";
    // }

    return "Play: Episode 1";
  };

  const subscriptionPopupCallback = () => {
    showErrorPopup(false);
    setSubscriptionPopup(false);
    setErrorMessage("");
    if (defaultFocus && defaultFocus.current) {
      defaultFocus.current.focus();
    }
    fetchRentedData();
  };

  return (
    <Fragment>
      {details ? (
        <div
          className="series-details-page"
          style={{
            backgroundImage: `url('${details?.result?.landscape}')`,
          }}
        >
          <div className="series-details-container">
            <div className="logo"></div>
            <div className="series-name">{details?.result?.name}</div>
            <div className="badge-list"></div>
            <div className="series-description">
              {details?.result?.description}
            </div>
            <div
              className="button-container"
              onKeyDown={(event) => keydownHandler(event)}
              onClick={(event) => clickHandler(event)}
              onFocus={(event) => focusHandler(event)}
            >
              <button
                className="btn play"
                tabIndex={0}
                ref={defaultFocus}
                data-name="play_episode"
              >
                <span className="icon" data-name="play_episode"></span>
                {getWatchBtnText()}
                {/* Play: Episode 1 */}
              </button>
              {auth?.accessToken ? (
                isInWatchlist ? (
                  <button
                    className="btn added"
                    tabIndex={0}
                    data-name="remove"
                    onClick={(event) => clickHandler(event)}
                    onKeyDown={(event) => keydownHandler(event)}
                    onFocus={(event) => focusHandler(event)}
                    ref={addBtnRef}
                  >
                    <span className="icon" data-name="add"></span>remove
                  </button>
                ) : (
                  <button
                    className="btn add"
                    tabIndex={0}
                    data-name="add"
                    onClick={(event) => clickHandler(event)}
                    onKeyDown={(event) => keydownHandler(event)}
                    onFocus={(event) => focusHandler(event)}
                    ref={addBtnRef}
                  >
                    <span className="icon" data-name="add"></span>Add
                  </button>
                )
              ) : null}
              <button className="btn" tabIndex={0} data-name="start_again">
                Start Again
              </button>
              <button className="btn" tabIndex={0} data-name="episode">
                Episodes
              </button>
              {/* <button
                className="btn"
                tabIndex={0}
                data-name="more"
                ref={moreBtnRef}
              >
                More Info
              </button> */}
              {/* <button className="btn" tabIndex={0} data-name="trailer">
                Watch Trailer
              </button> */}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
      {detailsPopup && details ? (
        <DetailsPopup
          popupCallback={popupCallback}
          details={details}
          auth={auth}
          account={account}
          history={props.history}
          type="series"
        />
      ) : null}
      {errorPopup ? (
        <Popup
          style={{ justifyContent: "center" }}
          message={errorMessage}
          okBtn={CONSTANTS.MESSAGE.OK}
          keyDownHandler={errorPopupCallback}
        />
      ) : null}
      {subscriptionPopup ? (
        <SubscriptionPopup
          message={errorMessage}
          okBtn={CONSTANTS.MESSAGE.OK}
          popupCallback={subscriptionPopupCallback}
        />
      ) : null}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  menu: state.menu,
  details: state.details.detailsData,
  account: state.account,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setContentDetails,
      showMenu,
      setPlaybackData,
      setLastActiveListItem,
      setLastActiveItem,
    },
    dispatch
  );
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Series);
