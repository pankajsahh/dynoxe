import React, { useCallback, useEffect, useState } from "react";
import "./index.scss";
import Loader from "../../components/Loader";
import CONSTANTS from "../../utils/constant";
import placeholder from "../../assets/image/placeholder.png";
import loveIcon from "../../assets/image/navIcons/love.svg";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

import { FocusableButton } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getlocaliseText } from "../../utils/localisation";
import { noMenuRoute } from "../../App";
import { showMenu } from "../../modules/menu/menu.action";

const MovieDetailsPage = () => {
  const { ref, focusKey } = useFocusable({
    focusable: false,
    trackChildren: true,
    saveLastFocusedChild: true,
  });
  const [pageData, setPageData] = useState(null);
  let location = useLocation();
  let dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [bookMarked, setBookmarked] = useState(false);
  const [showSubscribePopup, promptSubscribe] = useState(false);
  const navigate = useNavigate();
  const likedSeries = async () => {
    let userId = auth?.user_id;

    let data = new FormData();
    data.append("movieid", location?.state?.id);
    data.append("userid", userId ? userId : "");
    if (!bookMarked) {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${CONSTANTS.BASE_URL}/addwatchlist`,
          data: data,
        };

        const response = await axios.request(config);
        if (response.data.status) {
          setBookmarked(true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${CONSTANTS.BASE_URL}/removewatchlist`,
          data: data,
        };

        const response = await axios.request(config);
        if (response.data.status) {
          setBookmarked(false);
        }
        console.log(response.data.status);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getPageData = async () => {
    let userId = auth?.user_id;

    try {
      let data = new FormData();
      data.append("movieid", location?.state?.id);
      data.append("userid", userId ? userId : "");
      data.append("coun", "");
      data.append("freewatch", "Watch Now");
      data.append("epi", "");
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${CONSTANTS.BASE_URL}/detail_page`,
        data: data,
      };

      const response = await axios.request(config);
      setPageData(response?.data?.data);
      setBookmarked(response?.data?.data.watchliststatus == 0 ? false : true);
    } catch (error) {
      console.error("Error fetching page data:", error);
      setPageData(null);
    }
  };
  useEffect(() => {
    if (noMenuRoute.includes(location.pathname)) {
      dispatch(showMenu({ showMenu: false }));
    } else {
      dispatch(showMenu({ showMenu: true }));
    }
    getPageData();
  }, []);
  let ContentMetadata = [
    pageData?.ryear,
    ...(pageData?.moviecat ? pageData.moviecat.split(",") : []),
    pageData?.time,
  ];
  console.log(bookMarked, "pageData");
  const playMovie = async () => {
    if (pageData?.moviestatus === 3) {
      console.log(pageData?.watch_time, ":");
      navigate("/player", {
        state: {
          playerType: "movie",
          playerData: pageData,
          resumeFrom: pageData?.watch_time,
        },
      });
    } else if (pageData?.moviestatus === 1) {
      console.log("User has bought this content.");
      // set player data
      console.log(pageData?.watch_time, ":");
      navigate("/player", {
        state: {
          playerType: "movie",
          playerData: pageData,
          resumeFrom: pageData?.watch_time,
        },
      });
    } else if (pageData?.moviestatus === 2) {
      console.log("User has rented this content.");
      // set player data
      console.log(pageData?.watch_time, ":");
      navigate("/player", {
        state: {
          playerType: "movie",
          playerData: pageData,
          resumeFrom: pageData?.watch_time,
        },
      });
    } else if (pageData?.moviestatus === 4) {
      console.log("Available via subscription.");
      if (hasValidSubscription(auth?.subscription?.[0])) {
        // set player data
        console.log(pageData?.watch_time, ":");
        navigate("/player", {
          state: {
            playerType: "movie",
            playerData: pageData,
            resumeFrom: pageData?.watch_time,
          },
        });
      } else {
        promptSubscribe(true);
      }
    } else if (pageData?.moviestatus === 0) {
      console.log("User has not bought or rented the content.");
      promptSubscribe(true);
    } else if (pageData?.moviestatus === 5) {
      console.log("User not logged in.");
      navigate("/login");
    } else {
      console.log("Unknown status.");
    }
   
  };
   function hasValidSubscription(subscription) {
      if (!Array.isArray(subscription) || subscription.length === 0)
        return false;

      const sub = subscription[0];
      const expiryStr = sub.expiry_date?.replace("Next billing date ", "");

      if (!expiryStr) return false;

      // Convert to Date object
      const expiryDate = new Date(expiryStr);
      const today = new Date();

      // Set both to midnight for accurate date-only comparison
      expiryDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return expiryDate > today;
    }
      const popupCallback = (type) => {
        switch (type) {
          case "done":
            promptSubscribe(false);
            break;
          case "cancel":
            break;
        }
      };
    
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          backgroundImage: `url('${pageData?.image || placeholder}')`,
          backgroundSize: "contain",
          backgroundBlendMode: "overlay",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="movie-details-page"
      >
        <div className="movie-details-container">
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
              <div className="metadata">
                <div className="key">Cast</div>
                <div className="seprator"> : </div>
                <div className="value">{pageData?.moviecast}</div>
              </div>
              <div className="metadata">
                <div className="key">Director</div>
                <div className="seprator"> : </div>
                <div className="value">{pageData?.moviedirector}</div>
              </div>
              <div className="metadata">
                <div className="key">Producer</div>
                <div className="seprator"> : </div>
                <div className="value">{pageData?.movieproducer}</div>
              </div>
              <div className="buttonsContainer">
                <FocusableButton
                  isFocused={true}
                  className={`watchNowBtn`}
                  focusKey={"watchNow"}
                  onClick={playMovie}
                >
                  {pageData?.moviestatus === 5?"Login to watch":hasValidSubscription()||pageData?.moviestatus === 3|| pageData?.moviestatus === 1||pageData?.moviestatus === 2||pageData?.moviestatus === 4 ? "Watch Now" : "Subscribe Now"}&nbsp;{" "}
                </FocusableButton>
                <FocusableButton
                  isFocused={false}
                  className={`trailer`}
                  focusKey={"trailer"}
                  onClick={() => {
                    navigate("/player", {
                      state: {
                        playerType: "movietrailer",
                        playerData: pageData,
                        resumeFrom: pageData?.watch_time,
                      },
                    });
                  }}
                >
                  Trailer
                </FocusableButton>
                <FocusableButton
                  isFocused={false}
                  className={`LikeBtn ${bookMarked ? "Liked" : ""}`}
                  focusKey={"LikeBtn"}
                  onClick={likedSeries}
                >
                  {!bookMarked ? " + Add to MyList" : " + Remove from MyList"}
                </FocusableButton>
              </div>
            </div>
            <div className="imdbInfo"></div>
          </div>
        </div>

        {!pageData && <Loader />}
      </div>
      {showSubscribePopup ? (
        <Popup
          message={"Subscribe to watch this content"}
          okBtn={"ok"}
          keyDownHandler={popupCallback}
        />
      ) : null}
    </FocusContext.Provider>
  );
};

export default MovieDetailsPage;
