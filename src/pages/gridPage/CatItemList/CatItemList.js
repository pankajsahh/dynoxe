import "./index.scss";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import placeholder from "../../../assets/image/placeholder.svg";
import { oldESscrollTo } from "../../../utils/util";
import usePageData from "../../../helpers/pageApi";
import CONSTANTS from "../../../utils/constant";
import Loader from "../../../components/Loader";
const CatItem = ({
  item,
  focusHandler,
  isFocused,
  itemPosition,
  itemIndex,
  videoType,
  setfocusedGridItem,
}) => {
  let videoData = item;
  let cardWidth = 193;
  let watchedTime = item.seconds;
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
      setfocusedGridItem(item);
    },
    onBlur: () => {
      setfocusedGridItem(null);
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
      className={`list-item ${itemPosition(itemIndex)} ${
        focused ? "focused" : ""
      }`}
      onClick={clickHandler}
    >
      <img
        width={cardWidth}
        height={280}
        src={
          (videoType == "series"
            ? videoData.imagePath
            : videoData?.posterImage) ||
          "https://s3-alpha-sig.figma.com/img/3267/8dc2/7b5e762f2f606216c312d39d07dc8542?Expires=1736726400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YZcMcTAHD5eBD1J~YQ-V0rSMBl2sLOSIS7is7aKi-xnbrA2z8C07IQpVo8F9gZkqwNAtsRChGWdzSi2YMoj2DxJ~CYO1drmE-yEimCCoNImaSiMWjMPfzctQJ7u4ihT33fjAbN6fYhaDjXzGXgqondcV0n1e1EQq0MkQRJ16bbGlmeah1tFuy-VxbyK1CMBvRtBhzCNCf6Qfj-0vi0krvIJ6kamY~t-U8OYSpNO9gIZGU8QB2r9YCDxmaaLZSiciZFfgPLotk0Ilurec0aIVsygAaY30J27iw7Umxgi8LrH65Fz6tIG4mGUI8dEfpdS6vMPRFSj1ubTu87Iy0E4t3w__"
        }
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

const CatItemList = memo(
  ({ setfocusedGridItem, selectedCatagory, isFocused, pageType }) => {
    const { ref, focusKey } = useFocusable();
    let selectedCatagoryId = selectedCatagory?.id;
    let url = `${CONSTANTS.BASE_URL}/${pageType}/category/id/${selectedCatagoryId}`;
    if (selectedCatagory?.category == "Recently Added") {
      url = `${CONSTANTS.BASE_URL}/${pageType}/all`;
    }
    const { pageData, loading } = usePageData(url);
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
      let itemsInRow = 6; // hard coded
      let yaxis = "top";
      let totalNoOfItemsInBottomArray = totalItems % itemsInRow;
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
        <div ref={ref} className="CatItemListContainer">
          <div ref={scrollinRef} className="CatList">
            {!loading ? (
              displayedItems?.map((item, index) => (
                <CatItem
                  isFocused={isFocused && index == 0 ? true : false}
                  key={index}
                  item={item}
                  setfocusedGridItem={setfocusedGridItem}
                  itemIndex={index}
                  itemPosition={itemPositionIdentifier}
                  focusHandler={onRowFocus}
                  videoType={pageType}
                />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </FocusContext.Provider>
    );
  }
);

export default CatItemList;
