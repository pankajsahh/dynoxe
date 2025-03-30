import React, { Fragment, useCallback, useEffect } from "react";
import "./index.scss";
import List from "../List/index";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { oldESscrollTo } from "../../utils/util";

const ListContainer = ({ listData, isFocused }) => {
  const { ref, focusKey, focusSelf } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true,
  });

  useEffect(() => {
    if (isFocused) focusSelf();
  }, [isFocused, focusSelf]);

  const onRowFocus = useCallback(
    ({ y }) => oldESscrollTo(ref.current, 0, y),
    [ref]
  );

  const order = ["sliderdata", "recadddata", "buyrentdata"];

  const moviesAndTvData = {
    moviesdata: listData?.moviesdata || [],
    tvshowdata: listData?.tvshowdata || [],
  };

  const filteredListData = { ...listData };
  delete filteredListData.moviesdata;
  delete filteredListData.tvshowdata;

  const sortedKeys = filteredListData
    ? Object.keys(filteredListData).sort(
        (a, b) => order.indexOf(a) - order.indexOf(b)
      )
    : [];

  const sortedValues = sortedKeys.map((key) => filteredListData[key]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="list-container">
        {sortedValues.map((item, index) => {
          let TrayTitle = sortedKeys[index]
          if( sortedKeys[index]=="buyrentdata"){
            TrayTitle = "Buy Now"
          }
          return item?.length > 0 ? (
            <Fragment key={index}>
              <List
                trayName={TrayTitle}
                trayClassName={
                  sortedKeys[index] === "sliderdata" ? "sliderdata" : ""
                }
                listData={item}
                focusHandler={onRowFocus}
                isFocused={index === 0}
                trayindex={index}
                trayItemType={
                  sortedKeys[index] === "sliderdata"
                    ? "sliderdata"
                    : "recentlyViewed"
                }
              />
            </Fragment>
          ) : null;
        })}
      </div>
    </FocusContext.Provider>
  );
};

export default ListContainer;
