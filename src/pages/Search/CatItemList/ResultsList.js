import "./index.scss";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import placeholder from "../../../assets/image/placeholder.svg";
import { getLanguage, oldESscrollTo } from "../../../utils/util";
import Loader from "../../../components/Loader";
import { selectedLiveCatagory, selectedLiveChannel, selectedLiveData } from "../../../modules/menu/menu.action";
import CONSTANTS from "../../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const CatItem = ({
  item,
  focusHandler,
  isFocused,
  itemPosition,
  itemIndex,
}) => {
  let videoType = item.itemType;
  let videoData = item;
  let cardWidth = 120;
  let cardHeight = 178;
  let watchPercentage = Math.max(0, Number(item?.percentage / 100));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { ref, focused, focusSelf } = useFocusable({
    onFocus: (props) => {
      console.log(videoData,'focusedData');
      focusHandler(props);
    },
    onEnterPress: () => {
      clickHandler();
    },
  });

  const defaultChannelFinder = async ({ id, category }) => {
    try {
      let channelId = id;
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
        (item) => Number(item.id) == Number(channelId)
      );
      if(selectedLiveChannelIndex==-1) selectedLiveChannelIndex=0;
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
      console.log(channelList, "catt", channelId);
    } catch (error) {
      console.error("Error fetching channel data:", error);
    }
  };


  const clickHandler = async () => {
    if (videoType == "live") {
      if (videoData.type == 1) {
        navigate(`/movieDetails`, {
          state: {
            id: videoData.id,
            type: 'movie',
          },
        });
      } else if (videoData.type == 2) {
        navigate(`/seriesDetails`, {
          state: {
            id: videoData.id,
            type: 'series',
          },
        });
      } else if (videoData.type == 3) {
        await defaultChannelFinder({
          id: videoData?.id,
          category: videoData?.category,
          type: "live",
        });
  
        navigate(`/live`, {
          state: {
            id: videoData?.id,
            category: videoData?.category,
            type: "live",
          },
        });
      }
    }else{
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
        height={cardHeight}
        style={{ objectFit: "contain" }}
        src={
          (videoType == "series"
            ? videoData.imagePath
            : videoType == "live"
            ? videoData?.image
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
    let itemsInRow = 6; // hard coded
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
