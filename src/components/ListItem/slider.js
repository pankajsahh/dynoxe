import React, { memo, useEffect } from "react";
import "./index.scss";
import placeholder from "../../assets/image/placeholder.svg";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
const Slider = ({ listData, focusHandler, isFocused, itemIndex }) => {
  let videoData = listData?.episode || listData?.movie;
  let videoType = listData?.type
    console.log(listData);
  let cardWidth = 240;
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
        height={135}
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

export default memo(Slider);
