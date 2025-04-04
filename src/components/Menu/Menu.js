import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";

import { setPagedata } from "../../modules/page/page.actions";
import {
  setSelectedMenu,
  setLastActiveListItem,
  setMenuMode,
} from "../../modules/menu/menu.action";
import homeIcon from "../../assets/image/navIcons/home.svg";
import Info from "../../assets/clientimages/info.png";
import Mail from "../../assets/clientimages/mail.png";
import Tos from "../../assets/clientimages/tos.png";
import LeftArrow from "../../assets/clientimages/chevron-left.png";
import liveIcon from "../../assets/image/navIcons/live.svg";
import loveIcon from "../../assets/image/navIcons/love.svg";
import movieIcon from "../../assets/image/navIcons/movie.svg";
import Series from "../../assets/image/navIcons/tve.svg";
import settingIcon from "../../assets/image/navIcons/settings.svg";
import searchIcon from "../../assets/image/navIcons/search.svg";
import profileIcon from "../../assets/image/navIcons/profile.png";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../../assets/clientImages/logo.png";
import BrandLogoSmall from "../../assets/clientImages/smallLogo.png";

// import { tveIcon } from "../../assets/image/navIcons/tve";

function MenuItems({ menuClick, isFocused, item, itemIndex }) {
  const { ref, focusSelf, focused } = useFocusable({
    onEnterPress: () => {
      menuClick(item.type_id);
    },
  });
  const findIcons = (menuName) => {
    switch (menuName) {
      case "home":
        return homeIcon;
      case "live":
        return liveIcon;
      case "movies":
        return movieIcon;
      case "series":
        return Series;
      case "favorites":
        return loveIcon;
      case "search":
        return searchIcon;
      case "auth":
        return profileIcon;
      case "settings":
        return settingIcon;
      default:
        return null;
    }
  };
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);
  return (
    <>
      <li
        role="none"
        key={item.type_id}
        style={itemIndex == 0 ? { marginTop: "100px" } : {}}
        className={`menu-item ${focused ? "active" : ""}`}
        ref={ref}
        tabIndex={0}
        onClick={() => menuClick(item.type_id)}
      >
        <div className="LogoCover">
          <img
            width={48}
            height={48}
            style={
              focused
                ? {
                    padding: "7px",
                    background: "#179EFB",
                    borderRadius: "10px",
                  }
                : { padding: "7px", color: "white" }
            }
            src={findIcons(item.type_id)}
            alt={item.type_id}
          />
        </div>
        <span className={`title ${focused ? "active" : ""}`}>{item.name}</span>
      </li>
    </>
  );
}
function SettingItems({
  menuClick,
  isFocused,
  item,
  itemIndex,
  closeSettings,
}) {
  const { ref, focusSelf, focused } = useFocusable({
    onEnterPress: () => {
      menuClick(item.type_id);
    },
    onArrowPress: (dir) => {
      if (dir == "left") {
        closeSettings();
      }
    },
  });
  const findIcons = (menuName) => {
    switch (menuName) {
      case "terms":
        return Tos;
      case "privacy":
        return Info;
      case "contact":
        return Mail;
      default:
        return null;
    }
  };
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);
  return (
    <>
      <li
        role="none"
        key={item.type_id}
        style={itemIndex == 0 ? {} : {}}
        className={`menu-item Settings ${focused ? "active" : ""}`}
        ref={ref}
        tabIndex={0}
        onClick={() => menuClick(item.type_id)}
      >
        <div className="LogoCover">
          <img
            width={48}
            height={48}
            style={
              focused
                ? {
                    padding: "7px",
                    background: "#179EFB",
                    borderRadius: "10px",
                  }
                : { padding: "7px", color: "white" }
            }
            src={findIcons(item.type_id)}
            alt={item.type_id}
          />
        </div>
        <span className={`title ${focused ? "active" : ""}`}>{item.name}</span>
      </li>
    </>
  );
}

function Menu() {
  const dispatch = useDispatch();
  const [settingsTab, setSettingsTab] = useState(false);
  const { ref, focusKey } = useFocusable({
    focusKey: "MENU",
    onFocus: () => {
      dispatch(setMenuMode({ mode: "large" }));
    },
    onBlur: () => {
      if(!settingsTab){
        dispatch(setMenuMode({ mode: "small" }));
      }
    },
  });
  const { mode, isKeyboardOpen, menuData, selectedMenu } = useSelector(
    (state) => state.menu
  );

  const navigate = useNavigate();
  const location = useLocation();
  const clickHandler = (menu) => {
    if (menu == "settings") {
      setSettingsTab(true);
      return;
    }
    if (location.pathname != `/${menu}`) {
      dispatch(setSelectedMenu({ selectedMenu: menu }));
      dispatch(setLastActiveListItem({ item: "" }));
      dispatch(setPagedata([]));
      navigate(`/${menu}`, {
        state: {
          PageType: menu,
        },
      });
    }
  };
  let settingsTabs = [
    {
      id: 1,
      name: "Terms Of Use",
      icon: "termsIcon",
      type_id: "terms",
    },
    {
      id: 2,
      name: "Privacy Policy",
      icon: "privacyIcon",
      type_id: "privacy",
    },
    {
      id: 3,
      name: "Contact Us",
      icon: "contactIcon",
      type_id: "contact",
    },
  ];
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`menu-container small `}>
        <ul
          className={`menu-list ${mode}`}
          style={{ top: isKeyboardOpen ? "200px" : "0px" }}
        >
          <div className="BrandLogo">
            {mode == "large" && (
              <img width={164} height={34} src={BrandLogo} alt="BrandLogo" />
            )}
            {mode == "small" && (
              <img
                width={63}
                height={67}
                src={BrandLogoSmall}
                alt="BrandLogoSmall"
              />
            )}
          </div>
          {settingsTab && <div className="SettingText">Settings</div>}
          {settingsTab && mode == "large" && (
            <div className="RepArrow">
              <img  width={32} height={42} src={LeftArrow} alt="LeftArrow" />
            </div>
          )}
          {!settingsTab &&
            menuData?.length &&
            menuData.map((item, index) => {
              return (
                <MenuItems
                  itemIndex={index}
                  key={item.type_id}
                  item={item}
                  isFocused={location.pathname == `/${item.type_id}`}
                  menuClick={clickHandler}
                />
              );
            })}
          {settingsTab &&
            settingsTabs?.map((item, index) => {
              return (
                <SettingItems
                  itemIndex={index}
                  key={item.type_id}
                  item={item}
                  isFocused={location.pathname == `/${item.type_id}`}
                  menuClick={clickHandler}
                  closeSettings={() => setSettingsTab(false)}
                />
              );
            })}
        </ul>
      </div>
    </FocusContext.Provider>
  );
}

export default Menu;
