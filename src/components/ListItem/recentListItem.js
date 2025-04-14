import React, { memo, useEffect } from "react";
import "./index.scss";
import placeholder from "../../assets/image/placeholder.png";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
const RecentListItem = ({ listData, focusHandler, isFocused, itemIndex }) => {
  let videoType = listData?.type;
  let cardWidth = 240;
  let watchedTime = listData.seconds;
  let totalTime = listData?.duration;
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
    let id = listData?.movieid|| listData?.id||"";
    console.log(id, "Detailsid");
    navigate(`/${videoType}Details`, {
      state: {
        id: id,
        type: videoType,
      },
    });
  };
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);
  let imgUrl = listData.image;
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
        src={imgUrl || placeholder}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = placeholder;
        }}
        loading="lazy"
        alt="..."
      />
      {listData?.title && <div className="title">{listData.title}</div>}
      {listData?.rentp && <div className="leftTag">{listData.rentp}</div>}
      {listData?.buyp && <div className="leftTag">{listData.buyp}</div>}
      {(!listData?.buyp && !listData?.rentp) && <div className="leftTag">Free</div>}
      <div
        style={{ width: cardWidth * watchPercentage + "px" }}
        className="watchedLine"
      ></div>
    </div>
  );
};

export default memo(RecentListItem);
