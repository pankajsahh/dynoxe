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
  const order = [
    "sliderdata",
    "recadddata",
    "moviesdata",
    "tvshowdata",
    "buyrentdata",
  ];
  const sortedEntries = listData
    ? Object.entries(listData).sort(
        ([keyA], [keyB]) => order.indexOf(keyA) - order.indexOf(keyB)
      )
    : [];

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="list-container">
        {sortedEntries.map(([key, item], index) => {
          if (!item?.length) return null;

          if (key === "moviesdata") {
            return item.map((category, catIndex) => (
              <Fragment key={`${index}-${catIndex}`}>
                <List
                  trayName={category.name}
                  trayClassName="movies-category"
                  listData={category.movie_data}
                  focusHandler={onRowFocus}
                  isFocused={index === 0 && catIndex === 0}
                  trayindex={catIndex}
                  trayItemType="movieCategory"
                />
              </Fragment>
            ));
          }
          if (key === "tvshowdata") {
            return item.map((category, catIndex) => (
              <Fragment key={`${index}-${catIndex}`}>
                <List
                  trayName={category.name}
                  trayClassName="movies-category"
                  listData={category.tvshow_data}
                  focusHandler={onRowFocus}
                  isFocused={index === 0 && catIndex === 0}
                  trayindex={catIndex}
                  trayItemType="movieCategory"
                />
              </Fragment>
            ));
          }

          let TrayTitle = key;
          if (key === "buyrentdata") {
            TrayTitle = "Buy Now";
          } else if (key === "recadddata") {
            TrayTitle = "Recently Added";
          }else if(key === "sliderdata"){
            TrayTitle=""
          }
          return (
            <Fragment key={index}>
              <List
                trayName={TrayTitle}
                trayClassName={key === "sliderdata" ? "sliderdata" : ""}
                listData={item}
                focusHandler={onRowFocus}
                isFocused={index === 0}
                trayindex={index}
                trayItemType={
                  key === "sliderdata" ? "sliderdata" : "recentlyViewed"
                }
              />
            </Fragment>
          );
        })}
      </div>
    </FocusContext.Provider>
  );
};

export default ListContainer;
