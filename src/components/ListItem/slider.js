import React, { memo, useEffect } from "react";
import "./index.scss";
import placeholder from "../../assets/image/placeholder.png";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

export const SliderItem = memo(
  ({ listData, focusHandler, isFocused, itemIndex, totalItems }) => {
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
      let id = listData?.movieid|| listData?.id||"";
      console.log(id, "Detailsid");
      navigate(`/${videoType}Details`, {
        state: {
          id:id,
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
