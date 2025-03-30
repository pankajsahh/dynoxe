import React, { memo, useEffect } from "react";
import "./index.scss";
import placeholder from "../../assets/image/placeholder.svg";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

export const SliderItem = memo(
  ({ listData, focusHandler, isFocused, itemIndex, totalItems }) => {
    let videoData = listData?.episode || listData?.movie;
    let videoType = listData?.type;
    let description = "";
    if (videoType == "Movies") {
      description = listData?.moviedesc;
    }
    let title = "";
    if (videoType == "Movies") {
      title = listData?.movietitle;
    }
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
    let ContentMetadata = [" PG ", "R+", "1h 20m", "2020"];
    return (
      <div
        ref={ref}
        className={`list-item slider ${focused ? "focused" : ""}`}
        onClick={clickHandler}
        style={{ marginRight: "10px" }}
      >
        <div className="InfoPart">
          {listData?.title && <div className="title">{listData.title}</div>}
          {listData?.rentp && <div className="leftTag">{listData.rentp}</div>}
          {listData?.buyp && <div className="leftTag">{listData.buyp}</div>}
          {!listData?.buyp && !listData?.rentp && (
            <div className="leftTag">Free</div>
          )}
          <div className="title">{title}</div>
          <div className="subtitle">
            {ContentMetadata?.map((item, index) => {
              if (index == 0) {
                return item;
              }
              return " | " + item;
            })}
          </div>

          <div className="description">{description}</div>
        </div>
        {focused && (
          <div className="tracker">
            {Array.from({ length: totalItems }).map((_, index) => (
              <div
                key={index}
                className={`bit ${itemIndex == index ? "active" : ""}`}
              ></div>
            ))}
          </div>
        )}

        <div className="imgWrapper">
          <img
            width={570}
            height={375}
            src={listData?.fimg || placeholder}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = placeholder;
            }}
            loading="lazy"
            alt="..."
          />
        </div>
      </div>
    );
  }
);
