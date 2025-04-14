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
import placeholder from "../../assets/image/placeholder.png";
import CONSTANTS from "../../utils/constant";
import { getlocaliseText } from "../../utils/localisation";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { noMenuRoute } from "../../App";
import { showMenu } from "../../modules/menu/menu.action";

const GridListItem = ({ listData, focusHandler, isFocused, itemIndex }) => {
  let videoType = listData?.type;
  let cardWidth = 240;
  let watchedTime = listData.seconds;
  let totalTime = listData?.duration;
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
    let id = listData?.movieid || listData?.id || "";
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
  let imgUrl = listData.image;
  return (
    <div
      ref={ref}
      className={`list-item recent ${focused ? "focused" : ""}`}
      onClick={clickHandler}
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
      {listData?.title && <div className="title">{listData.title}</div>}
      {listData?.rentp && <div className="leftTag">{listData.rentp}</div>}
      {listData?.buyp && <div className="leftTag">{listData.buyp}</div>}
      {(!listData?.buyp && !listData?.rentp) && <div className="leftTag">Free</div>}
    </div>
  );
};



const Favorites = () => {
  const { ref, focusKey } = useFocusable({});
  const auth = useSelector((state) => state.auth);
  const [watchlistdata, setWatchlistData] = useState([]);
  const [isLoader, setLoader] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const scrollinRef = useRef(null);

  const onRowFocus = useCallback(
    ({ y }) => {
      oldESscrollTo(scrollinRef.current, 0, y);
    },
    [scrollinRef]
  );


  const getMywatchList = async () => {
    setLoader(true);
    let userId = auth.user_id ? auth.user_id : auth.userlog;
    const formData = new FormData();
    formData.append("userid", userId);
    formData.append("coun", "india");
    try {
      const response = await axios.post(CONSTANTS.BASE_URL + "/mywatchlist", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setWatchlistData(response.data.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching watchlist:", error);
    }
  }






  useEffect(() => {
    getMywatchList();
     if (noMenuRoute.includes(location.pathname)) {
          dispatch(showMenu({ showMenu: false }));
        }else{
          dispatch(showMenu({ showMenu: true }));
        }
  }, [])
  return (
    <Fragment>
      <FocusContext.Provider value={focusKey}>
        <div ref={ref} className={`favorites-page`}>
          <div className="Title">My List</div>

          <div ref={ref} className="favContainer">
            <div ref={scrollinRef} className="FavCatList">
              {!isLoader ? (
                watchlistdata?.map((item, index) => (
                  <GridListItem
                    itemIndex={index}
                    listData={item}
                    focusHandler={onRowFocus}
                    isFocused={index == 0 ? true : false}
                  />
                ))
              ) : (
                <Loader />
              )}
            </div>
          </div>

        </div>
      </FocusContext.Provider>
    </Fragment>
  );
};

export default memo(Favorites);
