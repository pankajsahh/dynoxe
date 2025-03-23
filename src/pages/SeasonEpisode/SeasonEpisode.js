import React, { useState, useEffect, useRef, Fragment } from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import "./index.scss";
import KEY from "../../utils/key";
import { scrollVWithoutAnimation, getVW } from "../../utils/util";
import { formatPageDataForSeries } from "../../utils/data-formator";
import { setContentDetails } from "../../modules/details/details.action";
import { setPlaybackData } from "../../modules/player/player.actions";
import { postApi, getApi } from "../../utils/api";
import Loader from "../../components/Loader";
import CONSTANTS from "../../utils/constant";
import Popup from "../../components/Popup";
import SubscriptionPopup from "../../components/Popup/SubscriptionPopup";

const SeasonEpisode = (props) => {
  const { auth, details, setPlaybackData } = props;
  const { id, title } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPopup, showErrorPopup] = useState(false);
  const [loader, setLoader] = useState(false);
  const [season, setSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [subscriptionPopup, setSubscriptionPopup] = useState(false);
  const activeSeason = useRef();
  const activeEpisode = useRef();

  useEffect(() => {
    fetchRentedData();
    fetchSubscriptionData();
    if (details?.session) {
      setSeason(details?.session?.[0]);
    }
    if (activeSeason?.current) {
      activeSeason.current.focus();
    }
  }, []);

  useEffect(() => {
    if (season) {
      fetchData();
    }
  }, [season]);

  const fetchSubscriptionData = async () => {
    if (auth?.id) {
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
    }
  };

  const fetchRentedData = async () => {
    if (auth?.id) {
      let url = `${CONSTANTS.BASE_URL}user_rent_video_list`;
      let response = postApi(url, { user_id: auth?.id });
      response = await response;
      if (response && response?.status == 200) {
        let arr = [];
        if (details?.result?.video_type == 2) {
          arr = response?.tvshow?.filter(
            (item) => item.id == details?.result?.id
          );
        } else {
          arr = response?.video?.filter(
            (item) => item.id == details?.result?.id
          );
        }

        if (arr.length > 0) {
          setIsRented(true);
        } else {
          setIsRented(false);
        }
      }
    }
  };

  const fetchData = async () => {
    let url = `${CONSTANTS.BASE_URL}get_video_by_session_id`;
    let response = postApi(url, {
      session_id: season?.id,
      show_id: details?.id || id,
    });
    response = await response;
    if (response.result) {
      setEpisodes(response.result);
    }
  };

  const seasonKeydownHandler = (event, data) => {
    const key = event.keyCode;
    switch (key) {
      case KEY.ENTER:
        seasonClickHandler(event, data);
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
      case KEY.LEFT:
        break;
      case KEY.RIGHT:
        if (activeEpisode?.current) {
          activeEpisode.current.focus();
        }
        break;
      case KEY.BACK:
        window.history.back();
        break;
    }
  };
  const seasonClickHandler = (event, data) => {
    activeSeason.current = event.target;
    setEpisodes([]);
    setSeason(data);
  };
  const seasonFocusHandler = (event) => {};

  const episodeKeydownHandler = (event, item, index) => {
    event.stopPropagation();
    event.preventDefault();
    const key = event.keyCode;
    switch (key) {
      case KEY.ENTER:
        episodeClickHandler(event, item, index);
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
      case KEY.LEFT:
        if (activeSeason?.current) {
          activeSeason.current.focus();
        }
        break;
      case KEY.RIGHT:
        break;
      case KEY.BACK:
        window.history.back();
        break;
    }
  };
  const episodeClickHandler = (event, itemData, index) => {
    event.stopPropagation();
    event.preventDefault();
    activeEpisode.current = event.target;
    setPlaybackData(itemData);

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
      setTimeout(() => {
        props.history.push(`/player`);
      }, 100);
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
      setTimeout(() => {
        props.history.push(`/player`);
      }, 100);
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
      setTimeout(() => {
        props.history.push(`/player`);
      }, 100);
    }
  };

  const episodeFocusHandler = (event, item) => {
    activeEpisode.current = event.target;
    let { row } = event.target.dataset;
    scrollVWithoutAnimation(parseInt(row, 10), getVW(250), ".episode-item", 1);
  };

  const errorPopupCallback = (result) => {
    showErrorPopup(false);
    setErrorMessage("");
    switch (result) {
      case "back":
      case "done":
        if (activeEpisode && activeEpisode.current) {
          activeEpisode.current.focus();
        }
        break;
      default:
        if (activeEpisode && activeEpisode.current) {
          activeEpisode.current.focus();
        }
        break;
    }
  };

  const subscriptionPopupCallback = () => {
    showErrorPopup(false);
    setSubscriptionPopup(false);
    setErrorMessage("");
    if (activeEpisode && activeEpisode.current) {
      activeEpisode.current.focus();
    }
    fetchRentedData();
  };

  return (
    <Fragment>
      <div
        className="series-episode-page"
        style={{
          backgroundImage: `url('${details?.squareImageUrl}')`,
        }}
      >
        {details ? (
          <div className="series-details-container">
            <div className="left-section">
              <div className="left-top">
                <div className="logo"></div>
                <div className="series-name">{details?.title}</div>
                <div className="badge-list"></div>
              </div>
              <div className="left-bottom">
                <ul className="season-list">
                  {details?.session?.map((item, index) => {
                    return (
                      <li
                        className="season-item"
                        tabIndex={0}
                        ref={index == 0 ? activeSeason : null}
                        onKeyDown={(event) => seasonKeydownHandler(event, item)}
                        onClick={(event) => seasonClickHandler(event, item)}
                        onFocus={(event) => seasonFocusHandler(event, item)}
                      >
                        <span className="season-name">{item?.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="right-section">
              <div className="season-title">{season?.name}</div>
              <div className="episode-list-container">
                <ul className="episode-list">
                  {episodes?.map((item, index) => {
                    return (
                      <li
                        className="episode-item"
                        tabIndex={0}
                        ref={index == 0 ? activeEpisode : null}
                        onKeyDown={(event) =>
                          episodeKeydownHandler(event, item, index)
                        }
                        onClick={(event) =>
                          episodeClickHandler(event, item, index)
                        }
                        onFocus={(event) => episodeFocusHandler(event, item)}
                        data-row={index + 1}
                        data-index={index}
                      >
                        <img
                          src={item?.landscape}
                          alt="image"
                          className="thumbnail"
                        />
                        {item?.is_premium ? (
                          <div className="premium">
                            <span className="crown"></span>
                            <span>premium</span>
                          </div>
                        ) : null}
                        {item?.is_rent ? <div className="rent"></div> : null}
                        <div className="episode-details">
                          <div className="episode-name">{item?.name}</div>
                          <div className="episode-description">
                            {item?.description}
                          </div>
                          <div className="episode-duration">
                            {parseInt(item?.video_duration / (1000 * 60))} mins
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
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
  playerData: state.player,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setContentDetails, setPlaybackData }, dispatch);
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  SeasonEpisode
);
