import React, { memo, useEffect } from "react";
import "./index.scss";
import placeholder from "../../assets/image/placeholder.svg";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import {
  selectedLiveCatagory,
  selectedLiveChannel,
  selectedLiveData,
} from "../../modules/menu/menu.action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CONSTANTS from "../../utils/constant";
import { getLanguage } from "../../utils/util";
const RecentListItem = ({ listData, focusHandler, isFocused, itemIndex }) => {
  let videoData = listData?.episode || listData?.movie;
  let videoType = listData?.episode
    ? "series"
    : listData?.movie
    ? "movie"
    : null;
  let cardWidth = 193;
  let watchedTime = listData.seconds;
  let totalTime = videoData?.duration;
  let watchPercentage =
    isNaN(watchedTime) || isNaN(totalTime) || totalTime === 0
      ? 0
      : watchedTime / totalTime;
  watchPercentage = Math.min(Math.max(watchPercentage, 0), 1);
  const navigate = useNavigate();
  const { ref, focused, focusSelf } = useFocusable({
    onFocus: (props) => {
      focusHandler(props);
    },
    onEnterPress: () => {
      clickHandler();
    },
  });
  const clickHandler = () => {
    navigate(`/${videoType}Details`, {
      state: {
        id: videoData.id,
        type: videoType,
      },
    });
  };
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);

  return (
    <div
      ref={ref}
      className={`list-item recent ${focused ? "focused" : ""}`}
      onClick={clickHandler}
      style={{ marginLeft: itemIndex !== 0 ? "10px" : "0px" }}
    >
      <img
        width={cardWidth}
        height={280}
        src={videoData?.poster_image || placeholder}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = placeholder;
        }}
        loading="lazy"
        alt="..."
      />
      <div
        style={{ width: cardWidth * watchPercentage + "px" }}
        className="watchedLine"
      ></div>
    </div>
  );
};
export const FavMovieListItem = memo(
  ({ listData, focusHandler, isFocused, itemIndex }) => {
    let videoData = listData;
    let videoType = "movie";
    let cardWidth = 193;
    let watchedTime = videoData.seconds;
    let totalTime = videoData?.duration;
    let watchPercentage =
      isNaN(watchedTime) || isNaN(totalTime) || totalTime === 0
        ? 0
        : watchedTime / totalTime;
    watchPercentage = Math.min(Math.max(watchPercentage, 0), 1);
    const navigate = useNavigate();
    const { ref, focused, focusSelf } = useFocusable({
      onFocus: (props) => {
        focusHandler(props);
      },
      onEnterPress: () => {
        clickHandler();
      },
    });
    const clickHandler = () => {
      console.log(videoData);
      navigate(`/${videoType}Details`, {
        state: {
          id: videoData.id,
          type: videoType,
        },
      });
    };
    useEffect(() => {
      if (isFocused) {
        focusSelf();
      }
    }, [focusSelf]);

    return (
      <div
        ref={ref}
        className={`list-item recent ${focused ? "focused" : ""}`}
        onClick={clickHandler}
        style={{ marginLeft: itemIndex !== 0 ? "10px" : "0px" }}
      >
        <img
          width={cardWidth}
          height={280}
          src={videoData?.image || placeholder}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = placeholder;
          }}
          loading="lazy"
          alt="..."
        />
        <div
          style={{ width: cardWidth * watchPercentage + "px" }}
          className="watchedLine"
        ></div>
      </div>
    );
  }
);
export const FavSeriesListItem = memo(
  ({ listData, focusHandler, isFocused, itemIndex }) => {
    let videoData = listData;
    let videoType = "series";
    let cardWidth = 193;
    let watchedTime = listData.seconds;
    let totalTime = videoData?.duration;
    let watchPercentage =
      isNaN(watchedTime) || isNaN(totalTime) || totalTime === 0
        ? 0
        : watchedTime / totalTime;
    watchPercentage = Math.min(Math.max(watchPercentage, 0), 1);
    const navigate = useNavigate();
    const { ref, focused, focusSelf } = useFocusable({
      onFocus: (props) => {
        focusHandler(props);
      },
      onEnterPress: () => {
        clickHandler();
      },
    });
    const clickHandler = () => {
      console.log(listData, "this data");
      navigate(`/${videoType}Details`, {
        state: {
          id: videoData.id,
          type: videoType,
        },
      });
    };
    useEffect(() => {
      if (isFocused) {
        focusSelf();
      }
    }, [focusSelf]);

    return (
      <div
        ref={ref}
        className={`list-item recent ${focused ? "focused" : ""}`}
        onClick={clickHandler}
        style={{ marginLeft: itemIndex !== 0 ? "10px" : "0px" }}
      >
        <img
          width={cardWidth}
          height={280}
          src={videoData?.image || placeholder}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = placeholder;
          }}
          loading="lazy"
          alt="..."
        />
        <div
          style={{ width: cardWidth * watchPercentage + "px" }}
          className="watchedLine"
        ></div>
      </div>
    );
  }
);
export const FavLiveListItem = memo(
  ({ listData, focusHandler, isFocused, itemIndex }) => {
    let videoData = listData;
    let cardWidth = 193;
    let watchedTime = videoData.seconds;
    let totalTime = videoData?.duration;
    let watchPercentage =
      isNaN(watchedTime) || isNaN(totalTime) || totalTime === 0
        ? 0
        : watchedTime / totalTime;
    watchPercentage = Math.min(Math.max(watchPercentage, 0), 1);
    const navigate = useNavigate();
    const { ref, focused, focusSelf } = useFocusable({
      onFocus: (props) => {
        focusHandler(props);
      },
      onEnterPress: () => {
        clickHandler();
      },
    });
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const defaultChannelFinder = async ({ channelName, category }) => {
      try {
        let channelname = channelName;
        let channelCat = category;
        const response = await axios.get(
          `${CONSTANTS.BASE_URL}/live/category/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": getLanguage(),
            },
          }
        );
        const selectedLiveCatagoryIndex = response?.data?.findIndex(
          (item) => item == channelCat
        );
        const channelResponse = await axios.get(
          `${CONSTANTS.BASE_URL}/live/all?category=${response?.data[selectedLiveCatagoryIndex]}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": getLanguage(),
            },
          }
        );
        let channelList = Object.values(channelResponse?.data);

        let selectedLiveChannelIndex = channelList?.findIndex(
          (item) => item.name == channelname
        );
        console.log(selectedLiveChannelIndex, "findind");
        if (selectedLiveChannelIndex == -1) selectedLiveChannelIndex = 0;
        dispatch(
          selectedLiveCatagory({
            selectedLiveCatagory: selectedLiveCatagoryIndex,
          })
        );
        dispatch(
          selectedLiveChannel({ selectedLiveChannel: selectedLiveChannelIndex })
        );
        dispatch(
          selectedLiveData({
            selectedLiveData: channelList[selectedLiveChannelIndex],
          })
        );
        console.log(channelList, "catt", channelname);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };
    const clickHandler = async () => {
      console.log(listData, "this data");
      try {
        let liveChannelData = listData.channel;
        await defaultChannelFinder({
          channelName: liveChannelData?.name,
          category: liveChannelData?.category,
          type: "live",
        });
      } catch (e) {}
      navigate(`/live`, {
        state: {
          id: videoData.id,
          code_id: videoData.code_id,
          type: "live",
          channelName: videoData?.channel?.name,
        },
      });
    };
    useEffect(() => {
      if (isFocused) {
        focusSelf();
      }
    }, [focusSelf]);

    return (
      <div
        ref={ref}
        className={`list-item recent ${focused ? "focused" : ""}`}
        onClick={clickHandler}
        style={{ marginLeft: itemIndex !== 0 ? "10px" : "0px" }}
      >
        <img
          width={cardWidth}
          height={280}
          src={videoData?.channel?.logoLink || placeholder}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = placeholder;
          }}
          loading="lazy"
          alt="..."
        />
        <div
          style={{ width: cardWidth * watchPercentage + "px" }}
          className="watchedLine"
        ></div>
      </div>
    );
  }
);
export default memo(RecentListItem);
