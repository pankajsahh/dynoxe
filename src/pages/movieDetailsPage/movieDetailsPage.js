import React, { Fragment, useCallback, useEffect, useState } from "react";
import "./index.scss";
import Loader from "../../components/Loader";
import CONSTANTS from "../../utils/constant";
import placeholder from "../../assets/image/placeholder.svg";
import loveIcon from "../../assets/image/navIcons/love.svg";
import usePageData from "../../helpers/pageApi";
import List from "../../components/List";
import {
  FocusContext,
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import {
  formatTimeHHMM,
  getLanguage,
  getParentalLock,
  oldESscrollTo,
} from "../../utils/util";
import { FocusableButton } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { getlocaliseText } from "../../utils/localisation";
import Popup from "../../components/Popup";
import RestrictedContentPopup from "../../components/Popup/RestrictedContentPopup";

const MovieDetailsPage = () => {
  const { ref, focusKey } = useFocusable({
    focusable: false,
    trackChildren: true,
    saveLastFocusedChild: true,
  });
  let location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { pageData, loading, error } = usePageData(
    `${CONSTANTS.BASE_URL}/movie/id/${location?.state?.id}` //
  );

  const youMayLike = usePageData(`${CONSTANTS.BASE_URL}/movie/recommended`);
  const [restrictedContent, setRestrictedContent] = useState(false);
  const [islikedSeries, setLikedSeries] = useState(false);
  const navigate = useNavigate();
  let watchPercentage =
    isNaN(pageData?.watch_time) ||
    isNaN(pageData?.duration) ||
    pageData?.duration === 0
      ? 0
      : pageData.watch_time / pageData?.duration;
  watchPercentage = Math.min(Math.max(watchPercentage, 0), 1);
  let listData = youMayLike?.pageData;
  const onRowFocus = useCallback(
    ({ y, height }, trayIndex) => {
      oldESscrollTo(ref.current, 0, y);
    },
    [ref]
  );
  console.log(pageData, "pageData");
  const likedSeries = async () => {
    if (!islikedSeries) {
      try {
        const response = await axios.post(
          `${CONSTANTS.BASE_URL}/favorites/movie`,
          { video_id: location?.state?.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": getLanguage(),
            },
          }
        );
        if (response.data.status) {
          setLikedSeries(true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        let config = {
          method: "DELETE",
          maxBodyLength: Infinity,
          url: `${CONSTANTS.BASE_URL}/favorites/movie?video_id=${location?.state?.id}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.request(config);
        if (response.data.status) {
          setLikedSeries(false);
        }
        console.log(response.data.status);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {
    if (pageData?.is_favorite) {
      setLikedSeries(true);
    } else {
      setLikedSeries(false);
    }
    let parentalLockEnabled = getParentalLock() === "false" ? false : true;
    let isRestrictedContent = ["R", "+18", "TVMA", "Unrated", "NR"].includes(
      pageData?.contentRating
    );
    setRestrictedContent(parentalLockEnabled && isRestrictedContent);
  }, [pageData]);

  const popupCallback = (prop) => {
    if (prop) {
      setRestrictedContent(false);
      setFocus("watchNow");
    } else {
      navigate(-1);
    }
  };
  let ContentMetadata = [];
  if (formatTimeHHMM(pageData?.duration)) {
    ContentMetadata.push(formatTimeHHMM(pageData?.duration));
  }
  if (pageData?.category) {
    ContentMetadata.push(pageData?.category);
  }
  if (pageData?.contentRating) {
    ContentMetadata.push(pageData?.contentRating);
  }
  console.log(pageData,"pageData");
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          backgroundImage: `url('${
            pageData?.imagePath || placeholder
          }')`,
          backgroundSize: "contain",
          backgroundBlendMode: "overlay",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
      
        }}
        className="movie-details-page"
      >
        <div className="movie-details-container">
          <div className="imageCover">
            <img
              width={248}
              height={360}
              src={pageData?.posterImagePath || placeholder}
              onError={(e) => {
                e.target.onerror = null; // prevents looping
                e.target.src = placeholder;
              }}
              alt="..."
            />
            <div
              style={{ width: 248 * watchPercentage + "px" }}
              className="resumeTimeLine"
            ></div>
          </div>
          <div className="Information">
            <div className="basicInfo">
              <div className="header">
                <div className="title">{pageData?.title}</div>
                <div className="subtitle">
                  {ContentMetadata?.map((item, index) => {
                    if (index == 0) {
                      return item;
                    }
                    return " | " + item;
                  })}
                </div>
              </div>

              <div className="description">{pageData?.description}</div>
              <div className="buttonsContainer">
                <FocusableButton
                  isFocused={true}
                  className={`watchNowBtn`}
                  focusKey={"watchNow"}
                  onClick={() => {
                    // set player data
                    console.log(pageData?.watch_time, ":");
                    navigate("/player", {
                      state: {
                        playerType: "movie",
                        playerData: pageData,
                        resumeFrom: pageData?.watch_time,
                      },
                    });
                  }}
                >
                  {getlocaliseText("watchNowBtnText", "Watch Now")}&nbsp;{" "}
                  {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-play"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z" />
                    </svg>
                  }{" "}
                </FocusableButton>
                <FocusableButton
                  isFocused={false}
                  className={`LikeBtn ${islikedSeries ? "Liked" : ""}`}
                  focusKey={"LikeBtn"}
                  onClick={likedSeries}
                >
                  <img src={loveIcon} alt="loveIcon" />
                </FocusableButton>
              </div>
            </div>
            <div className="imdbInfo">
              <div style={{ height: "72px" }} className="imdbRating">
                {" "}
                <span className="imdblogo">IMDb</span> {pageData?.rating}
              </div>
              <div className="translatedDescription">
                {/* {pageData?.description} */}
              </div>
              <div style={{ height: "71px" }} className=""></div>
            </div>
          </div>
        </div>
        <div className="you-may-like-container">
          {listData?.length && (
            <List
              trayClassName="you-may-like-list"
              trayName={getlocaliseText(
                "youMayLikeTrayTitle",
                "You may also like"
              )}
              listData={listData}
              focusHandler={onRowFocus}
              isFocused={false}
              trayItemType="YouMayLike"
            />
          )}
        </div>

        {loading && <Loader />}
      </div>
      {restrictedContent ? (
        <RestrictedContentPopup
          title={getlocaliseText("settingsPagePARENTAL_LOCK", "Parental Lock")}
          cancelBtn={getlocaliseText("restrictedPopupCancel", "Cancel")}
          okBtn={getlocaliseText("restrictedPopupSUBMIT", "Submit")}
          keyDownHandler={popupCallback}
        />
      ) : null}
    </FocusContext.Provider>
  );
};

export default MovieDetailsPage;
