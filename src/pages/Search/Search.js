import React, { memo, useEffect, useState } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";
import { TextBox } from "../../components/textBox";
import Loader from "../../components/Loader";
import searchIcon from "../../assets/image/navIcons/search.svg";
import { noMenuRoute } from "../../App";
import { showMenu } from "../../modules/menu/menu.action";
import ResultsList from "./CatItemList/ResultsList";
import { getlocaliseText } from "../../utils/localisation";
import axios from "axios";
import CONSTANTS from "../../utils/constant";
const debounce = (fn, delay = 1000) => {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};
const Search = (props) => {
  //   let [searchTitle, setSearchTitle] = useState("");
  let [searchResults, setSearchResults] = useState([]);
  let [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const fetchSearchResults = async (terms) => {
    if (terms.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoader(true);
    try {
      const response = await axios.post(CONSTANTS.BASE_URL + "/homesearch", {
        term: terms,
      });
      console.log(response, "response");
      setSearchResults(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoader(false);
    }
  };
  const dbfetchSearch = debounce(fetchSearchResults, 1000);

  useEffect(() => {
    if (noMenuRoute.includes(location.pathname)) {
      dispatch(showMenu({ showMenu: false }));
    } else {
      dispatch(showMenu({ showMenu: true }));
    }
  }, []);

  return (
    <div className="search-page">
      <div className="MainSerch">
        <div className="SerchContainer">
          <div className={`search-section `}>
            <div className="SearchByTitleContainer">
              <TextBox
                focusKey={"SearchByTitle"}
                className="SearchByTitle"
                placeholder={getlocaliseText(
                  "SearchPageBytitelText",
                  "Search ..."
                )}
                isFocused={true}
                // value={searchTitle}
                onClick={() => {
                  console.log("object");
                }}
                onChange={(term) => {
                  dbfetchSearch(term);
                }}
                type="text"
              />
              <img className="searchIcon" src={searchIcon} alt="searchIcon" />
            </div>
          </div>

          <div className="Results">
            {searchResults.length > 0 && (
              <ResultsList
                searchResults={searchResults}
                isFocused={false}
                pageType={"movie"}
              />
            )}
            {loader ? <Loader /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Search);
