import React, { useEffect, useRef } from "react";
import "./index.scss";
import Player from "../Player/Player";
import { useDispatch, useSelector } from "react-redux";
import KEY from "../../utils/key";
import { useLocation, useNavigate } from "react-router-dom";
import {
  selectedLiveCatagory,
  selectedLiveChannel,
  selectedLiveData,
  showMenu,
} from "../../modules/menu/menu.action";
import Remote from "../../assets/image/remotecontroll.svg";
import { getlocaliseText } from "../../utils/localisation";
import axios from "axios";
import CONSTANTS from "../../utils/constant";
import { getLanguage } from "../../utils/util";
const LivePlayer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inactivityTimerRef = useRef(null);
  const handleInactivity = () => {
    dispatch(showMenu({ showMenu: false }));
  };
  const turnOnMenu = () => {
    dispatch((dispatch, getState) => {
      const { menu } = getState();
      if (!menu.showMenu) {
        dispatch(showMenu({ showMenu: true }));
      }
    });
  };
  const visibilityChange = (event) => {
    const key = event?.keyCode;
    switch (key) {
      case KEY.BACK:
        navigate(-1);
        break;
      default:
        turnOnMenu();
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = setTimeout(handleInactivity, 6000);
    }
  };
  useEffect(() => {
    visibilityChange();
    document.addEventListener("keydown", visibilityChange);
    return () => {
      document.removeEventListener("keydown", visibilityChange);
      clearTimeout(inactivityTimerRef.current);
    };
  }, []);
  return (
    <div className="LivePlayerPage">
      <Player isLivePlayer={true} />
      <FavoriteLiveButton />
    </div>
  );
};

const FavoriteLiveButton = () => {
  const menu = useSelector((state) => state.menu);

  return (
    <div>
      {menu.showMenu && (
        <div className={`FavoriteButton `}>
          <img width={30} height={30} src={Remote} alt="remote" />
          {getlocaliseText("livePlayerLikeText", "Hold ok to add to favorite")}
        </div>
      )}
    </div>
  );
};

export default LivePlayer;
