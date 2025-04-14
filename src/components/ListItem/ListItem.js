import React, { memo, useEffect } from "react";
import "./index.scss";
import placeholder from "../../assets/image/placeholder.png";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { FocusableButton } from "../../components/button/index";
import { getLanguage, typeMapper } from "../../utils/util";
import { useNavigate } from "react-router-dom";
import { getlocaliseText } from "../../utils/localisation";
import axios from "axios";
import CONSTANTS from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedLiveCatagory,
  selectedLiveChannel,
  selectedLiveData,
} from "../../modules/menu/menu.action";
const BannerListItem = ({ listData, focusHandler, isFocused, itemIndex }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { ref, focused, focusSelf } = useFocusable({
    onFocus: (props) => {
      focusHandler(props);
    },
    onEnterPress: () => {
      clickHandler();
    },
  });
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);
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
    let pageName = typeMapper(listData.type);
    if (pageName === "live") {
      await defaultChannelFinder({
        id: listData?.relation_id,
        category: listData?.extra,
        type: pageName,
      });

      navigate(`/live`, {
        state: {
          id: listData?.relation_id,
          category: listData?.extra,
          type: pageName,
        },
      });
    }
    if (pageName !== "live") {
      let id = listData?.movieid|| listData?.id||"";
      console.log(id, "Detailsid");
      navigate(`/${pageName}Details`, {
        state: {
          id: id,
          type: pageName,
        },
      });
    }
  };
  return (
    <div
      ref={ref}
      className={`list-item banner ${focused ? "focused" : ""}`}
      onClick={clickHandler}
      style={itemIndex === 0 ? {} : { marginLeft: "10px" }}
    >
      <img
        width={382.16}
        height={542.96}
        src={listData.poster_image}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = placeholder;
        }}
        loading="lazy"
        alt="..."
      />
      <div className="bottomCover">
        <div className="title">{listData.title}</div>
        <FocusableButton
          focusable={false}
          className={`watchNowBtn ${focused ? "focused" : ""}`}
          focusKey={"watchNow"}
          onClick={clickHandler}
        >
          {getlocaliseText("watchNowBtnText", "Watch Now")} &nbsp;{" "}
          {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-play"
              viewBox="0 0 16 16"
            >
              <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z" />
            </svg>
          }{" "}
        </FocusableButton>
      </div>
    </div>
  );
};

export default memo(BannerListItem);
