import React, { memo, useEffect, useState } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { TextBox } from "../../components/textBox";
import Loader from "../../components/Loader";
import searchIcon from "../../assets/image/navIcons/search.svg";
import dropDown from "../../assets/image/dropdown.svg";
import { DropDown } from "../../components/dropDown";
import Keyboard from "../../components/keyboard";
import axios from "axios";
import CONSTANTS from "../../utils/constant";
import { noMenuRoute } from "../../App";
import { showMenu } from "../../modules/menu/menu.action";
import ResultsList from "./CatItemList/ResultsList";
import { getlocaliseText } from "../../utils/localisation";
import useAllCategories from "./AllCatList";
import { getLanguage } from "../../utils/util";
let searchTimeout = null;
const Search = (props) => {
  const { token } = useSelector((state) => state.auth);
  let [searchTitle, setSearchTitle] = useState("");
  let [searchTag, setSearchTag] = useState("");
  let [searchDescription, setSearchDescription] = useState("");
  let [selectedEdit, setSelectedEdit] = useState("searchTitle");
  let [searchResults, setSearchResults] = useState([]);
  let [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const handleKeyPressForDescription = (key) => {
    let finalKey = key;
    if (key === "SPACE") {
      finalKey = " ";
    } else if (key === "BACKSPACE") {
      setSearchDescription((desc) => desc.slice(0, -1));
      return;
    }
    setSearchDescription((desc) => {
      let text = desc + finalKey;
      if (text.length >= 3) {
        featchCurrChange(searchTag, text, searchTitle);
      }
      return text;
    });
  };

  const featchCurrChange = async (sTag, sDesc, sTitle) => {
    setLoader(true);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(async () => {
      const movieResults =await FindMovieResults(sTag, sDesc, sTitle);
      const seriesResults =await FindSeriesResults(sTag, sDesc, sTitle);
      const liveResults = await FindLiveResults(sTag, sDesc, sTitle);
      setSearchResults([...movieResults, ...seriesResults,...liveResults]);
      setLoader(false);
    }, 1000);
  };

  const handleKeyPressForTitle = (key) => {
    let finalKey = key;
    if (key === "SPACE") {
      finalKey = " ";
    } else if (key === "BACKSPACE") {
      setSearchTitle((title) => title.slice(0, -1));
      return;
    }
    setSearchTitle((title) => {
      let text = title + finalKey;
      if (text.length >= 3) {
        featchCurrChange(searchTag, searchDescription, text);
      }
      return text;
    });
  };
  const onKeyBoardKeyPress = (key) => {
    if (selectedEdit === "searchDescription") {
      handleKeyPressForDescription(key);
    } else {
      handleKeyPressForTitle(key);
    }
    console.log(key, "keypressed");
  };

  const FindMovieResults = async (sTag, sDesc, sTitle) => {
    try {
      let promises = [];
      if (sTitle?.length >= 3) {
        promises.push(
          axios.get(`${CONSTANTS.BASE_URL}/movie/search/title/${sTitle}`, {
            headers: { Authorization: `Bearer ${token}` , 'Accept-Language': getLanguage(),},
            
          })
        );
      }
      if (sTag?.length >= 3) {
        promises.push(
          axios.get(`${CONSTANTS.BASE_URL}/movie/search/tag/${sTag}`, {
            headers: { Authorization: `Bearer ${token}`, 'Accept-Language': getLanguage(), },
          })
        );
      }
      if (sDesc?.length >= 3) {
        promises.push(
          axios.get(`${CONSTANTS.BASE_URL}/movie/search/description/${sDesc}`, {
            headers: { Authorization: `Bearer ${token}`, 'Accept-Language': getLanguage(), },
          })
        );
      }

      const [titleResponse, tagResponse, descriptionResponse] =
        await Promise.allSettled(promises);

      const titleResults =
        titleResponse?.status === "fulfilled" ? titleResponse.value.data : [];
      const tagResults =
        tagResponse?.status === "fulfilled" ? tagResponse.value.data : [];
      const descriptionResults =
        descriptionResponse?.status === "fulfilled"
          ? descriptionResponse.value.data
          : [];

      const combinedResults = [
        ...titleResults,
        ...tagResults,
        ...descriptionResults,
      ];
      return combinedResults.map((item) => ({ ...item, itemType: "movie" }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const FindLiveResults = async (sTag, sDesc, sTitle) => {
    try {
      let promises = [];
      if (sTitle?.length >= 3) {
        promises.push(
          axios.get(`${CONSTANTS.BASE_URL}/list/search?search=${sTitle}`, {
            headers: { Authorization: `Bearer ${token}` , 'Accept-Language': getLanguage(),},
            
          })
        );
      }
      // if (sTag?.length >= 3) {
      //   promises.push(
      //     axios.get(`${CONSTANTS.BASE_URL}/list/search?search=${sTag}`, {
      //       headers: { Authorization: `Bearer ${token}`, 'Accept-Language': getLanguage(), },
      //     })
      //   );
      // }
      // if (sDesc?.length >= 3) {
      //   promises.push(
      //     axios.get(`${CONSTANTS.BASE_URL}/list/search?search=${sDesc}`, {
      //       headers: { Authorization: `Bearer ${token}`, 'Accept-Language': getLanguage(), },
      //     })
      //   );
      // }

      const [titleResponse] =
        await Promise.allSettled(promises);

      const titleResults =
        titleResponse?.status === "fulfilled" ? titleResponse.value.data.data : [];
        console.log(titleResults,"titleres");
      // const tagResults =
      //   tagResponse?.status === "fulfilled" ? tagResponse.value.data : [];
      // const descriptionResults =
      //   descriptionResponse?.status === "fulfilled"
      //     ? descriptionResponse.value.data
      //     : [];

      const combinedResults = [
        ...titleResults,
        // ...tagResults,
        // ...descriptionResults,
      ];
      return combinedResults.map((item) => ({ ...item, itemType: 'live' }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const FindSeriesResults = async (sTag, sDesc, stitle) => {
    try {
      let promises = [];
      if (stitle?.length >= 3) {
        promises.push(
          axios.get(`${CONSTANTS.BASE_URL}/series/search/title/${stitle}`, {
            headers: { Authorization: `Bearer ${token}`, 'Accept-Language': getLanguage(), },
          })
        );
      }
      if (sTag?.length >= 3) {
        promises.push(
          axios.get(`${CONSTANTS.BASE_URL}/series/search/tag/${sTag}`, {
            headers: { Authorization: `Bearer ${token}`, 'Accept-Language': getLanguage(), },
          })
        );
      }
      if (sDesc?.length >= 3) {
        promises.push(
          axios.get(
            `${CONSTANTS.BASE_URL}/series/search/description/${sDesc}`,
            {
              headers: { Authorization: `Bearer ${token}`, 'Accept-Language': getLanguage(), },
            }
          )
        );
      }

      const [titleResponse, tagResponse, descriptionResponse] =
        await Promise.allSettled(promises);

      const titleResults =
        titleResponse?.status === "fulfilled" ? titleResponse.value.data : [];
      const tagResults =
        tagResponse?.status === "fulfilled" ? tagResponse.value.data : [];
      const descriptionResults =
        descriptionResponse?.status === "fulfilled"
          ? descriptionResponse.value.data
          : [];

      const combinedResults = [
        ...titleResults,
        ...tagResults,
        ...descriptionResults,
      ];
      return combinedResults.map((item) => ({ ...item, itemType: "series" }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const focustOnOneInputClearALL = (selectedItem) => {
    setSelectedEdit(selectedItem);
  };
  const onTagChange = (label) => {
    setSearchTag(label.label);
    featchCurrChange(label.label, searchDescription, searchTitle);
  };
  useEffect(() => {
    if (noMenuRoute.includes(location.pathname)) {
      dispatch(showMenu({ showMenu: false }));
    } else {
      dispatch(showMenu({ showMenu: true }));
    }
  }, []);
  let Allcatagories = useAllCategories();
  return (
    <div className="search-page">
      <div className="PageTitle">
        {getlocaliseText("SearchPageTitle", "Search")}
      </div>
      <div className="MainSerch">
        <div className="SerchContainer">
          <div className={`search-section `}>
            <div className="SearchByTitleContainer">
              <TextBox
                focusKey={"SearchByTitle"}
                className="SearchByTitle"
                placeholder={getlocaliseText(
                  "SearchPageBytitelText",
                  "Search by Title"
                )}
                isFocused={true}
                value={searchTitle}
                onClick={() => {
                  focustOnOneInputClearALL("searchTitle");
                }}
                onChange={setSearchTitle}
                isSearchPage={true}
                type="text"
              />
              <img className="searchIcon" src={searchIcon} alt="searchIcon" />
            </div>

            <div className="SearchByDescriptionContainer">
              <TextBox
                focusKey={"SearchByDescription"}
                className="SearchByDescription"
                placeholder={getlocaliseText(
                  "SearchPageByDescText",
                  "Search by Description"
                )}
                isFocused={false}
                value={searchDescription}
                isSearchPage={true}
                onClick={() => {
                  focustOnOneInputClearALL("searchDescription");
                }}
                onChange={setSearchDescription}
                type="text"
              />
              <img className="searchIcon" src={searchIcon} alt="searchIcon" />
            </div>

            <div className="SearchByTagContainer">
              <DropDown
                focusKey={"SearchByTag"}
                className="SearchByTag"
                placeholder={getlocaliseText("SearchPageByTagText", "Tags")}
                setSelectedTag={onTagChange}
                isFocused={false}
                Allcatagories={Allcatagories}
              />
              <img className="dropIcon" src={dropDown} alt="searchIcon" />
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
        <div className="keyBoardContainer">
          <Keyboard focusablekey="KEYBOARD" onKeyPress={onKeyBoardKeyPress} />
        </div>
      </div>
    </div>
  );
};

export default memo(Search);
