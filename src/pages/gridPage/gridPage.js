import React, { useState } from "react";
import "./index.scss";
import Loader from "../../components/Loader";
import CONSTANTS from "../../utils/constant";
import usePageData from "../../helpers/pageApi";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useLocation } from "react-router-dom";
import CatList from "./CatList/CatList";
import CatItemList from "./CatItemList/CatItemList";
import { getlocaliseText } from "../../utils/localisation";

const GridPage = () => {
  const { ref, focusKey } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true,
  });
  const location = useLocation();
  let pageType = location?.state?.PageType == "movies" ? "movie" : "series";
  let url = `${CONSTANTS.BASE_URL}/get_movie`;
  if (pageType == "movie") {
    url = `${CONSTANTS.BASE_URL}/get_movie`;
  } else {
    url = `${CONSTANTS.BASE_URL}/get_tvshow`;
  }
  const { pageData, loading } = usePageData(url);
  let CategoryList = [];
  if (pageData) {
    CategoryList = [...pageData?.data?.categories];
  }
  const [selectedCatIndex, setSelectedCatIndex] = useState(null);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="Grid-page">
        <div className="Grid-page-container">
          {CategoryList && (
            <>
              <CatList
                CategoryList={CategoryList}
                selectedCatIndex={selectedCatIndex}
                setSelectedCatIndex={(index)=>{
                  console.log("index",index)
                  if(index==selectedCatIndex){
                    setSelectedCatIndex(null);
                  }else{
                    setSelectedCatIndex(index);
                  }
                  
                }}
              />
              <CatItemList
                selectedCatagory={selectedCatIndex!==null?CategoryList[selectedCatIndex]:null}
                isFocused={true}
                pageData={pageData}
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
