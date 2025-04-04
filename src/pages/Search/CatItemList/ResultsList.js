import "./index.scss";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import placeholder from "../../../assets/image/placeholder.svg";
import { oldESscrollTo } from "../../../utils/util";
const CatItem = ({
  item,
  focusHandler,
  isFocused,
  itemPosition,
  itemIndex,
}) => {
  let videoType = item?.type;
  let videoData = item;
  let cardWidth = 240;
  let cardHeight = 135;
  let watchPercentage = Math.max(0, Number(item?.percentage / 100));
  const navigate = useNavigate();
  const { ref, focused, focusSelf } = useFocusable({
    onFocus: (props) => {
      console.log(videoData, "focusedData");
      focusHandler(props);
    },
    onEnterPress: () => {
      clickHandler();
    },
  });

  const clickHandler = async () => {
    if (videoType == "live") {
      if (videoData.type == 1) {
        navigate(`/movieDetails`, {
          state: {
            id: videoData.id,
            type: "movie",
          },
        });
      } else if (videoData.type == 2) {
        navigate(`/seriesDetails`, {
          state: {
            id: videoData.id,
            type: "series",
          },
        });
      } else if (videoData.type == 3) {
        navigate(`/live`, {
          state: {
            id: videoData?.id,
            category: videoData?.category,
            type: "live",
          },
        });
      }
    } else {
      navigate(`/${videoType}Details`, {
        state: {
          id: videoData.id,
          type: videoType,
        },
      });
    }
  };
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);
  let imgUrl = item.movieimg;
  if (videoType == "Movies") {
    imgUrl = item.movieimg;
  }
  return (
    <div
      ref={ref}
      className={`list-item recent ${itemPosition(itemIndex)} ${
        focused ? "focused" : ""
      }`}
      onClick={clickHandler}
    >
      <img
        width={cardWidth}
        height={cardHeight}
        style={{ objectFit: "contain" }}
        src={imgUrl}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = placeholder;
        }}
        loading="lazy"
        alt="..."
      />
      {item?.title && <div className="title">{item.title}</div>}
      {item?.rentp && <div className="leftTag">{item.rentp}</div>}
      {item?.buyp && <div className="leftTag">{item.buyp}</div>}
      {!item?.buyp && !item?.rentp && <div className="leftTag">Free</div>}
      <div
        style={{ width: cardWidth * watchPercentage + "px" }}
        className="watchedLine"
      ></div>
    </div>
  );
};

const ResultsList = memo(({ searchResults, isFocused }) => {
  const { ref, focusKey } = useFocusable();
  const pageData = searchResults;
  const [displayedItems, setDisplayedItems] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(24);
  const scrollinRef = useRef(null);

  useEffect(() => {
    if (pageData) {
      setDisplayedItems(pageData.slice(0, itemsToShow));
    }
  }, [pageData, itemsToShow]);

  const onRowFocus = useCallback(
    ({ y }) => {
      oldESscrollTo(scrollinRef.current, 0, y);
      if (y + window.innerHeight >= scrollinRef.current.scrollHeight) {
        setItemsToShow((prev) => prev + 24);
      }
    },
    [scrollinRef]
  );

  const itemPositionIdentifier = (Itemindex) => {
    let totalItems = displayedItems.length;
    let itemsInRow = 4; // hard coded
    let yaxis = "top";
    let totalNoOfItemsInBottomArray = totalItems % itemsInRow;
    if (itemsInRow < totalItems) {
      if (totalNoOfItemsInBottomArray == 0) {
        if (Itemindex >= totalItems - itemsInRow) {
          yaxis = "bottom";
        }
      } else {
        if (
          Itemindex >= totalItems - itemsInRow &&
          totalItems - Itemindex <= totalNoOfItemsInBottomArray
        ) {
          yaxis = "bottom";
        }
      }
    }

    if (Itemindex % itemsInRow == 0) {
      return "start " + yaxis;
    } else if ((Itemindex + 1) % itemsInRow == 0) {
      return "end " + yaxis;
    } else {
      return "mid " + yaxis;
    }
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="ResultsListContainer">
        <div ref={scrollinRef} className="CatList">
          {displayedItems?.map((item, index) => (
            <CatItem
              isFocused={isFocused && index == 0 ? true : false}
              key={index}
              item={item}
              itemIndex={index}
              itemPosition={itemPositionIdentifier}
              focusHandler={onRowFocus}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
});

export default ResultsList;
