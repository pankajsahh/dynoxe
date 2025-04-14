import React, { memo, useEffect } from "react";
import { bindActionCreators, compose } from "redux";
import { connect, useDispatch } from "react-redux";
import { hideSplash } from "../../modules/splash/splash.actions";
import {
  showMenu,
  setMenuData,
  setSelectedMenu,
} from "../../modules/menu/menu.action";
import {
  setAppConfig,
  setAppLanguage,
} from "../../modules/common/common.actions";
import splashIcon from "../../assets/clientImages/splash.png";
import CONSTANTS from "../../utils/constant";
import "./index.scss";
import { getlocaliseText } from "../../utils/localisation";

const Splash = (props) => {
  useEffect(() => {
    fetchData();
  }, []);
  const dispatch = useDispatch();
  const fetchData = async () => {
    let arr = getlocaliseText("menu", [
      {
        id: 5,
        name: "Search",
        icon: "searchIcon",
        type_id: "search",
      },
      {
        id: 1,
        name: "Home",
        icon: "homeIcon",
        type_id: "home",
      },
      {
        id: 3,
        name: "Movies",
        icon: "movieIcon",
        type_id: "movies",
      },
      {
        id: 4,
        name: "My List",
        icon: "loveIcon",
        type_id: "favorites",
      },
      
      {
        id: 6,
        name: "Profile",
        icon: "profileIcon",
        type_id: "auth",
      },
      {
        id: 6,
        name: "Settings",
        icon: "profileIcon",
        type_id: "settings",
      },
    ]);
    dispatch(setMenuData({ menuData: arr }));
    dispatch(showMenu({ showMenu: true }));
    // setSelectedMenu({ selectedMenu: arr[0].type_id });
    dispatch(hideSplash({ showSplash: false }));
  };

  const videoEnded = () => {
    dispatch(showMenu({ showMenu: true }));
    dispatch(hideSplash({ showSplash: false }));
    // this.props.hideSplash({ showSplash: false });
  };

  return (
    <div className="splash">
      {/* <video
        id="videoplayer"
        onEnded={videoEnded}
        autoPlay={true}
        preload="auto"
        muted={true}
      /> */}
      <img src={splashIcon} alt="SplashIcon" />
    </div>
  );
};

export default memo(Splash);
