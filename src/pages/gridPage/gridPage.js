import React, { Fragment, useCallback, useEffect, useState } from "react";
import "./index.scss";
import Loader from "../../components/Loader";
import CONSTANTS from "../../utils/constant";
import usePageData from "../../helpers/pageApi";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { formatTimeHHMM, oldESscrollTo } from "../../utils/util";
import { FocusableButton } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import CatList from "./CatList/CatList";
import CatItemList from "./CatItemList/CatItemList";
import { getlocaliseText } from "../../utils/localisation";

const GridPage = () => {
  const { ref, focusKey } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true,
  });
  const location = useLocation();
  const [focusedGridItem, setfocusedGridItem] = useState(null);
  let pageType = location?.state?.PageType == "movies" ? "movie" : "series";
  const { pageData, loading, error } = usePageData(
    `${CONSTANTS.BASE_URL}/${pageType}/category/all`
  );
  let CategoryList = [];
  if (pageData) {
    CategoryList = [
      { category: "Recently Added", categoryAr: "الأعلى تقييمًا", id: 20000 },
      ...pageData,
    ];
  }
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);
  const findMovieName = () => {
    if (focusedGridItem?.title) {
      return focusedGridItem.title;
    }
    return location?.state?.PageType == "movies"
      ? getlocaliseText("GridMoviePageTitle", "movies")
      : getlocaliseText("GridSeriesPageTitle", "series");
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="Grid-page">
        <div className="title">{findMovieName()}</div>
        <div className="Grid-page-container">
          {CategoryList && (
            <>
              <CatList
                CategoryList={CategoryList}
                selectedCatIndex={selectedCatIndex}
                setSelectedCatIndex={setSelectedCatIndex}
              />
              <CatItemList
                setfocusedGridItem={setfocusedGridItem}
                selectedCatagory={CategoryList[selectedCatIndex]}
                isFocused={true}
                pageType={pageType}
              />
            </>
          )}
        </div>
        {loading && <Loader />}
      </div>
    </FocusContext.Provider>
  );
};

export default GridPage;
