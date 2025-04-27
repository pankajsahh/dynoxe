import "./index.scss";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import placeholder from "../../../assets/image/placeholder.png";
import { oldESscrollTo } from "../../../utils/util";
import usePageData from "../../../helpers/pageApi";
import CONSTANTS from "../../../utils/constant";
import Loader from "../../../components/Loader";
const CatItemn = ({
  item,
  focusHandler,
  isFocused,
  itemPosition,
  itemIndex,
  videoType,
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
            ? videoData.image
            : videoData?.image) ||
          placeholder}
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




const CatItem = ({
  item,
  focusHandler,
  isFocused,
  itemIndex,
  videoType,
 }) => {
  let cardWidth = 240;
  let watchedTime = item?.seconds;
  let totalTime = item?.duration;
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
    let id = item?.movieid|| item?.id||"";
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
  let imgUrl = item.image;
  return (
    <div
      ref={ref}
      className={`list-item recent ${focused ? "focused" : ""}`}
      onClick={clickHandler}
      style={{ marginRight: "10px"}}
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
      {item?.title && <div className="title">{item.title}</div>}
      {item?.rentp && <div className="leftTag">{item.rentp}</div>}
      {item?.buyp && <div className="leftTag">{item.buyp}</div>}
      {(!item?.buyp && !item?.rentp) && <div className="leftTag">Free</div>}
      <div
        style={{ width: cardWidth * watchPercentage + "px" }}
        className="watchedLine"
      ></div>
    </div>
  );
};




const CatItemList = memo(
  ({ pageData, selectedCatagory, isFocused, pageType }) => {
    if(pageType=="movie"){
      if(selectedCatagory==null){
        pageData = pageData?.data?.movies.flatMap(obj => obj.movie_data) || [];
      }else{
        pageData = pageData?.data?.movies.find(item=>item.name==selectedCatagory?.name)?.movie_data || [];
      }
    }else{  
      pageData = pageData?.data?.tvshows;
    }
    const { ref, focusKey } = useFocusable();
    
    const scrollinRef = useRef(null);


    const onRowFocus = useCallback(
      ({ y }) => {
        oldESscrollTo(scrollinRef.current, 0, y);
      },
      [scrollinRef]
    );

    return (
      <FocusContext.Provider value={focusKey}>
        <div ref={ref} className="CatItemListContainer">
          <div ref={scrollinRef} className="CatList">
            {pageData?.length>0 ? (
              pageData?.map((item, index) => (
                <CatItem
                  isFocused={index == 0 ? true : false}
                  key={index}
                  item={item}
                  itemIndex={index}
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
