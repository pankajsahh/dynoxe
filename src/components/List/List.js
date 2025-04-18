import React, { Fragment, memo, useCallback, useEffect, useRef } from "react";
import "./index.scss";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { oldESscrollTo } from "../../utils/util";
import RecentListItem from "../ListItem/recentListItem";
import { SliderItem } from "../ListItem/slider";

const List = (props) => {
  const {
    isFocused,
    listData,
    trayName,
    focusHandler,
    trayindex = 0,
    trayItemType,
    trayClassName,
  } = props;
  const { ref, focusKey, focusSelf } = useFocusable({
    focusable: listData && listData.length > 0,
    trackChildren: true,
    saveLastFocusedChild: true,
    onFocus: (props) => {
      focusHandler(props, trayindex);
    },
  });
  let scrollingRef = useRef();
  const onRowFocus = useCallback(
    ({ x }, props) => {
      if (scrollingRef && scrollingRef?.current) {
        try {
          oldESscrollTo(scrollingRef.current, x, 0);
        } catch (e) {
          console.log("Error in scrolling", e);
        }
        // }
      }
    },
    [scrollingRef]
  );
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        style={trayindex > 0 ? { paddingBottom: "20px" } : {paddingTop:"0px"}}
        className={`trayModule`}
        ref={ref}
      >
        {trayName && trayName != "banner" && (
          <div className="tray-title">{trayName}</div>
        )}
        <div ref={scrollingRef} className={`list-wrapper ${trayClassName}`}>
          {listData?.length &&
            listData?.map((item, index) => {
              if (trayItemType == "sliderdata") {
                return (
                  <Fragment key={index}>
                    <SliderItem
                      itemIndex={index}
                      totalItems ={listData?.length}
                      listData={item}
                      focusHandler={onRowFocus}
                      isFocused={isFocused && index == 0 ? true : false}
                    />
                  </Fragment>
                );
              }
              return (
                <Fragment key={index}>
                  <RecentListItem
                    itemIndex={index}
                    listData={item}
                    focusHandler={onRowFocus}
                    isFocused={isFocused && index == 0 ? true : false}
                  />
                </Fragment>
              );
            })}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default memo(List);
