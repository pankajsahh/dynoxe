import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";

import { setPagedata } from "../../modules/page/page.actions";
import {
  setSelectedMenu,
  setLastActiveListItem,
} from "../../modules/menu/menu.action";
import homeIcon from "../../assets/image/navIcons/home.svg";
import liveIcon from "../../assets/image/navIcons/live.svg";
import loveIcon from "../../assets/image/navIcons/love.svg";
import movieIcon from "../../assets/image/navIcons/movie.svg";
import Series from "../../assets/image/navIcons/tve.svg";
import profileIcon from "../../assets/image/navIcons/settings.svg";
import searchIcon from "../../assets/image/navIcons/search.svg";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import SubMenu from "./SubMenu";

// import { tveIcon } from "../../assets/image/navIcons/tve";

function MenuItems({ menuClick, isFocused, item }) {
  const { ref, focusSelf, focused } = useFocusable({
    onEnterPress: () => {
      menuClick(item.type_id);
    },
  });
  const location = useLocation();
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
      className={`menu-item ${focused ? "active" : ""}`}
      ref={ref}
      tabIndex={0}
      onClick={() => menuClick(item.type_id)}
    >
      <div
        style={focused ? { background: "#DA513D" } : {}}
        className="LogoCover"
      >
        <img src={findIcons(item.type_id)} alt={item.type_id} />
      </div>
      <span className="title">{item.name}</span>
      </li>
      {item.type_id=='live' && location.pathname=='/live' && <SubMenu  />}
      </>
  );
}

function Menu() {
  const { ref, focusKey } = useFocusable({
    focusKey:"MENU"
  });
  const { mode, isKeyboardOpen, menuData, selectedMenu } = useSelector(
    (state) => state.menu
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const clickHandler = (menu) => {
    if (location.pathname != `/${menu}`) {
      dispatch(setSelectedMenu({ selectedMenu: menu }));
      dispatch(setLastActiveListItem({ item: "" }));
      dispatch(setPagedata([]));
      navigate(`/${menu}`,{
        state: {
          PageType: menu,
        },
      });
    }
  };

  const isActive = (item) => {
    if (selectedMenu == item?.type_id) {
      return true;
    }
    return false;
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={`menu-container ${mode}`}>
        <ul
          className="menu-list"
          style={{ top: isKeyboardOpen ? "200px" : "0px" }}
        >
          {menuData?.length &&
            menuData.map((item, index) => {
              return (
                <MenuItems
                  key={item.type_id}
                  item={item}
                  isFocused={location.pathname == `/${item.type_id}`}
                  isActive={isActive}
                  menuClick={clickHandler}
                />
              );
            })}
        </ul>
      </div>
    </FocusContext.Provider>
  );
}

export default Menu;
