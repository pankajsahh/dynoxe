import React, {
  Fragment,
  useEffect,
  useState,
  memo,
  useRef,
  useCallback,
} from "react";
import "./index.scss";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import List from "../../components/List";
import { oldESscrollTo } from "../../utils/util";
import usePageData from "../../helpers/pageApi";
import CONSTANTS from "../../utils/constant";
import { getlocaliseText } from "../../utils/localisation";

const Favorites = () => {
  const { ref, focusKey } = useFocusable({});
  const { pageData: liveData } = usePageData(`${CONSTANTS.BASE_URL}/favorites/live`);
  const { pageData: movieData} = usePageData(`${CONSTANTS.BASE_URL}/favorites/movie`);
  const { pageData: seriesData } = usePageData(`${CONSTANTS.BASE_URL}/favorites/series`);
  const onRowFocus = useCallback(
    ({ y }) => {
      console.log(y);
      oldESscrollTo(ref.current, 0, y);
    },
    [ref]
  );
console.log(liveData,movieData,seriesData);
  return (
    <Fragment>
      <FocusContext.Provider value={focusKey}>
        <div ref={ref} className={`favorites-page`}>
          <div className="Title">Favorites</div>
          <div className="movies-container">
            {movieData?.data && (
              <List
                trayClassName="movies-list"
                trayName={getlocaliseText("FavMovieTrayName","Movies")}
                listData={movieData.data}
                focusHandler={onRowFocus}
                isFocused={true}
                trayItemType="FavMovies"
              />
            )}
          </div>
          <div className="series-container">
            {seriesData?.data && (
              <List
                trayClassName="tv-series-list"
                trayName={getlocaliseText("FavSeriesTrayName","TV Series")}
                listData={seriesData.data}
                focusHandler={onRowFocus}
                isFocused={false}
                trayItemType="FavSeries"
              />
            )}
          </div>
          <div className="Live-container">
            {liveData?.data && (
              <List
                trayClassName="Live-list"
                trayName={getlocaliseText("FavLiveTrayName","Live")}
                listData={liveData.data}
                focusHandler={onRowFocus}
                isFocused={false}
                trayItemType="FavLive"
              />
            )}
          </div>
        </div>
      </FocusContext.Provider>
    </Fragment>
  );
};

export default memo(Favorites);
