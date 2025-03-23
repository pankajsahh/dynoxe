import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import {
  FocusContext,
  setFocus,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { oldESscrollTo, generateUUID, getLanguage } from "../../utils/util";
import usePageData from "../../helpers/pageApi";
import CONSTANTS from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import loveIcon from "../../assets/image/navIcons/love.svg";
import {
  selectedLiveCatagory,
  selectedLiveChannel,
  selectedLiveData,
} from "../../modules/menu/menu.action";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BoxItem = ({
  focusHandeler,
  submenu,
  type,
  isLikedChannel,
  isFocused,
  isSelected,
  onclick,
  itemIndex,
  startHold,
  stopHold,
}) => {
  const { ref, focused, focusSelf } = useFocusable({
    saveLastFocusedChild: true,
    onEnterPress: () => {
      if (type == "channel") {
        startHold(submenu, isLikedChannel);
      }
      onclick(itemIndex);
    },
    onEnterRelease: () => {
      if (type == "channel") {
        stopHold();
      }
    },
    onFocus: (layout, props, focusDetails) => {
      focusHandeler(layout, props, focusDetails);
    },
    onArrowPress: (props) => {
      if (props == "right" && type == "channel") {
        return false;
      } else {
        return true;
      }
    },
  });
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, []);
  return (
    <div
      ref={ref}
      onMouseDown={() => {
        if (type == "channel") {
          startHold(submenu, isLikedChannel);
        }
      }}
      onMouseUp={() => {
        if (type == "channel") {
          stopHold();
        }
      }}
      className={`SubMenuItem ${type} ${
        isLikedChannel?.isFav && type == "channel" ? "Favriote" : ""
      }  ${isSelected ? "selected" : ""} ${focused ? "focused" : ""}`}
      onClick={() => {
        onclick(itemIndex);
      }}
    >
      <p>{type == "channel" ? submenu?.name : submenu}</p>
      {isLikedChannel?.isFav && type == "channel" && (
        <img
          className="LikedLive"
          width={30}
          height={30}
          src={loveIcon}
          alt="likedThat"
        />
      )}
    </div>
  );
};
const LiveFavList = async (auth) => {
  try {
    const response = await axios.get(`${CONSTANTS.BASE_URL}/favorites/live`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Accept-Language': getLanguage(), 
      },
    });
    const favoriteChannels = response.data;
    return favoriteChannels.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
function ChannelMenu({ catagories }) {
  const menu = useSelector((state) => state.menu);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [channelList, setchannelList] = useState([]);

  const { ref, focusKey } = useFocusable({
    saveLastFocusedChild: true,
  });
  const scrollingRef = useRef();
  const onRowFocus = useCallback(
    ({ y }) => {
      oldESscrollTo(scrollingRef.current, 0, y);
    },
    [scrollingRef]
  );
  let [AllFavList, setFavList] = useState([]);

  const fetchPageData = async () => {
    try {
      const response = await axios.get(
        `${CONSTANTS.BASE_URL}/live/all?category=${
          catagories[menu.selectedLiveCatagory]
        }`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
            'Accept-Language': getLanguage(), 
          },
        }
      );
      const list = Object.values(response.data);
      if (menu.selectedLiveData == null && list?.length > 0) {
        dispatch(selectedLiveData({ selectedLiveData: list[0] }));
      }
      try {
        let FavList = await LiveFavList(auth);
        if (FavList.length > 0) {
          setFavList(FavList);
        }
        setchannelList(list);
      } catch (e) {}
    } catch (error) {
      console.error("Error fetching page data:", error);
    }
  };
  const getLatestFavdata = async () => {
    let FavList = await LiveFavList(auth);
    if (FavList.length > 0) {
      setFavList(FavList);
    }
  };
  useEffect(() => {
    fetchPageData();
  }, [menu.selectedLiveCatagory]);

  const onchannelclick = (itemIndex) => {
    if (menu.selectedLiveData.name != channelList[itemIndex].name) {
      dispatch(selectedLiveData({ selectedLiveData: channelList[itemIndex] }));
      dispatch(selectedLiveChannel({ selectedLiveChannel: itemIndex }));
    }
  };
  let isLikedChannel = (channel, AllList) => {
    if (AllList.length > 0) {
      let FoundThisChannel = AllList.find((item) => {
        return item.channel.name == channel.name;
      });
      if (FoundThisChannel) {
        return { FavId: FoundThisChannel.id, isFav: true };
      }
    }
    return { FavId: 0, isFav: false };
  };

  const addToFavLive = async (CurrentChannel, isLiked) => {
    if (!(isLiked?.isFav == true ? true : false)) {
      try {
        const response = await axios.post(
          `${CONSTANTS.BASE_URL}/favorites/live`,
          { channel: CurrentChannel },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
              'Accept-Language': getLanguage(), 
            },
          }
        );
        if (response.data.status) {
          getLatestFavdata();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        let config = {
          method: "DELETE",
          maxBodyLength: Infinity,
          url: `${CONSTANTS.BASE_URL}/favorites/live?id=${isLiked?.FavId}`,
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Accept-Language': getLanguage(), 
          },
        };
        const response = await axios.request(config);
        if (response.data.status) {

          getLatestFavdata();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  let timerRef = useRef(null);

  const startHold = useCallback((CurrentChannel, isLiked) => {
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        clearTimeout(timerRef.current);
        timerRef.current=null;
        addToFavLive(CurrentChannel, isLiked);
      }, 2000);
    }
  }, []);

  const stopHold = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        style={channelList.length > 14 ? { height: "720px" } : {}}
        className="SubMenu channel"
        ref={ref}
      >
        <div
          ref={scrollingRef}
          style={channelList.length > 14 ? { height: "720px" } : {}}
          className="listWrapper"
        >
          {channelList?.map((submenu, index) => (
            <BoxItem
              key={`${submenu?.name} ${index}`}
              type={"channel"}
              isSelected={index == menu?.selectedLiveChannel}
              isFocused={index == menu?.selectedLiveChannel}
              submenu={submenu}
              focusHandeler={onRowFocus}
              onclick={onchannelclick}
              itemIndex={index}
              startHold={startHold}
              stopHold={stopHold}
              isLikedChannel={isLikedChannel(submenu, AllFavList)}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
}

function SubMenu() {
   let location = useLocation();
    console.log(location.state,"live state")
  const { pageData, loading, error } = usePageData(
    `${CONSTANTS.BASE_URL}/live/category/all`
  );
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu);
  const { ref, focusKey } = useFocusable({
    saveLastFocusedChild: true,
  });
  const scrollingRef = useRef();
  const onRowFocus = useCallback(
    ({ y }) => {
      oldESscrollTo(scrollingRef.current, 0, y);
    },
    [scrollingRef]
  );
  const onCatagoryClick = (itemIndex) => {
    dispatch(selectedLiveData({ selectedLiveData: null }));
    dispatch(selectedLiveCatagory({ selectedLiveCatagory: itemIndex }));
    dispatch(selectedLiveChannel({ selectedLiveChannel: 0 }));
  };
  return (
    <>
      <FocusContext.Provider value={focusKey}>
        <div
          style={pageData?.length > 14 ? { height: "720px" } : {}}
          className="SubMenu"
          ref={ref}
        >
          <div
            ref={scrollingRef}
            style={pageData?.length > 14 ? { height: "720px" } : {}}
            className="listWrapper"
          >
            {pageData?.map((submenu, index) => (
              <BoxItem
                key={`${submenu} ${index}`}
                type={"category"}
                isSelected={index == menu.selectedLiveCatagory}
                isFocused={index == menu?.selectedLiveCatagory}
                submenu={submenu}
                focusHandeler={onRowFocus}
                onclick={onCatagoryClick}
                itemIndex={index}
              />
            ))}
          </div>
        </div>
      </FocusContext.Provider>
      {pageData?.length && <ChannelMenu catagories={pageData} />}
    </>
  );
}

export default SubMenu;
