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
  const navigate = useNavigate();
  const likedSeries = async () => {

    let userId = auth?.user_id;




    let data = new FormData();
    data.append('movieid', location?.state?.id);
    data.append('userid', userId ? userId : '');
    if (!bookMarked) {
      try {

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${CONSTANTS.BASE_URL}/addwatchlist`,
          data: data
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
          method: 'post',
          maxBodyLength: Infinity,
          url: `${CONSTANTS.BASE_URL}/removewatchlist`,
          data: data
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
  const userAutherisedToPlay = async () => {
    return true;
  }
  const getPageData = async () => {
    let userId = auth?.user_id;

    try {
      let data = new FormData();
      data.append('movieid', location?.state?.id);
      data.append('userid', userId ? userId : '');
      data.append('coun', '');
      data.append('epi', '');
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${CONSTANTS.BASE_URL}/detail_page`,
        data: data
      };

      const response = await axios.request(config);
      setPageData(response?.data?.data)
      setBookmarked(response?.data?.data.watchliststatus==0 ? false : true)
    } catch (error) {
      console.error("Error fetching page data:", error);
      setPageData(null)
    }
  }
  useEffect(() => {
    if (noMenuRoute.includes(location.pathname)) {
      dispatch(showMenu({ showMenu: false }));
    } else {
      dispatch(showMenu({ showMenu: true }));
    }
    getPageData();
  }, []);
  let ContentMetadata = [pageData?.ryear, ...(pageData?.moviecat ? pageData.moviecat.split(',') : []), pageData?.time];
  console.log(bookMarked, "pageData");
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          backgroundImage: `url('${pageData?.image || placeholder
            }')`,
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
                  {userAutherisedToPlay() ? "Watch Now" : "Subscribe Now"}&nbsp;{" "}

                </FocusableButton>
                <FocusableButton
                  isFocused={false}
                  className={`LikeBtn ${bookMarked ? "Liked" : ""}`}
                  focusKey={"LikeBtn"}
                  onClick={likedSeries}
                >
                  + Add to MyList
                </FocusableButton>
              </div>
            </div>
            <div className="imdbInfo"></div>
          </div>
        </div>


        {!pageData && <Loader />}
      </div>
    </FocusContext.Provider>
  );
};

export default MovieDetailsPage;
