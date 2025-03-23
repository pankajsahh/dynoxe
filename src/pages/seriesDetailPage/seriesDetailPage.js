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
import SeasonGrid from "./seasonGrid/seasonGrid";
import axios from "axios";
import { useSelector } from "react-redux";
import { getlocaliseText } from "../../utils/localisation";
import RestrictedContentPopup from "../../components/Popup/RestrictedContentPopup";

const SeriesDetailPage = (props) => {
  const { ref, focusKey } = useFocusable({
    focusable: false,
    trackChildren: true,
    saveLastFocusedChild: true,
  });
  let location = useLocation();
  let seriesId = location.state.id;
  const { pageData, loading, error } = usePageData(
    `${CONSTANTS.BASE_URL}/series/id/${seriesId}`
  );
  const { token } = useSelector((state) => state.auth);
  const [islikedSeries, setLikedSeries] = useState(false);
  const navigate = useNavigate();
  const likedSeries = async () => {
    if (!islikedSeries) {
      try {
        const response = await axios.post(
          `${CONSTANTS.BASE_URL}/favorites/series`,
          { series_id: seriesId },
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
        console.log(response.data.status);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        let config = {
          method: "DELETE",
          maxBodyLength: Infinity,
          url: `${CONSTANTS.BASE_URL}/favorites/series?series_id=${location?.state?.id}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": getLanguage(),
          },
        };

        const response = await axios.request(config);
        console.log(response, "develete req");
        if (response.data.status) {
          setLikedSeries(false);
        }
        console.log(response.data.status);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const [restrictedContent, setRestrictedContent] = useState(false);
  useEffect(() => {
    let parentalLockEnabled = getParentalLock() === "false" ? false : true;
    let isRestrictedContent = [
      "R",
      "TV-14",
      "+18",
      "TVMA",
      "Unrated",
      "NR",
    ].includes(pageData?.contentRating);
    console.log(isRestrictedContent);
    setRestrictedContent(parentalLockEnabled && isRestrictedContent);
    if (pageData?.is_favorite) {
      setLikedSeries(true);
    }
  }, [pageData?.is_favorite]);

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
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          backgroundImage: `url('${pageData?.imagePath || placeholder}')`,
          backgroundSize: "contain",
          backgroundBlendMode: "overlay",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="series-details-page"
      >
        <div className="series-details-container">
          <div className="imageCover">
            <img
              width={248}
              height={360}
              src={pageData?.bannerImage || placeholder}
              onError={(e) => {
                e.target.onerror = null; // prevents looping
                e.target.src = placeholder;
              }}
              alt="..."
            />
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
                    navigate("/player", {
                      state: {
                        playerType: "series",
                        playerData: pageData,
                      },
                    });
                  }}
                >
                  {getlocaliseText("PlayNowBtnText", "Play Now")} &nbsp;{" "}
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
        <div className="series-grid">
          <SeasonGrid seriesId={seriesId} />
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

export default SeriesDetailPage;
