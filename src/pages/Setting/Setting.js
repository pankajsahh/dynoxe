import React, { useEffect, useState, useRef, Fragment } from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  setMenuMode,
  showMenu,
  setMenuData,
  setSelectedMenu,
} from "../../modules/menu/menu.action";
import { setAuthInfo, setLoginStatus } from "../../modules/auth/auth.action";
import { setAccountInfo } from "../../modules/account/account.action";
import CONSTANTS from "../../utils/constant";
import "./index.scss";
import Logout from "../Logout";
import MyAccount from "../MyAccount";
import KEY from "../../utils/key";

const Setting = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");
  const myAccountRef = useRef();
  const goBackRef = useRef();
  const changePlanButtonRef = useRef();
  useEffect(() => {
    // getAccountData();
    if (myAccountRef && myAccountRef.current) {
      myAccountRef.current.focus();
    }
  }, []);

  // const getAccountData = async () => {
  //   const { accessToken } = props.auth;
  //   if (accessToken) {
  //     const query = getAccountInfoQuery();
  //     let response = postApi(query, accessToken);
  //     response = await response;
  //     if (response) {
  //       response = JSON.parse(response);
  //       if (response.data && response.data.me) {
  //         props.setAccountInfo(response.data.me);
  //       }
  //     }
  //   }
  // };

  const getComponent = (value) => {
    switch (value) {
      case "my-account":
        return <MyAccount auth={props.auth} account={props.account} />;
      case "logout":
        return <Logout logoutPopup={showPopup} callback={popupCallback} />;
      default:
        return <MyAccount auth={props.auth} account={props.account} />;
    }
  };

  const clickHandler = (event, code) => {
    event.preventDefault();
    event.stopPropagation();
    if (code === "logout") {
      setShowPopup(true);
    }
    setSelectedMenu(code);
  };

  const keydownHandler = (event, code) => {
    event.preventDefault();
    event.stopPropagation();
    const key = event.keyCode;
    switch (key) {
      case KEY.ENTER:
        clickHandler(event, code);
        break;
      case KEY.UP:
        if (event.target.previousSibling) {
          event.target.previousSibling.focus();
        } else if (goBackRef && goBackRef.current) {
          goBackRef.current.focus();
        }
        break;
      case KEY.DOWN:
        if (event.target.nextSibling) {
          event.target.nextSibling.focus();
        }
        break;
      case KEY.RIGHT:
        if (changePlanButtonRef && changePlanButtonRef?.current) {
          changePlanButtonRef?.current?.focus();
        }
        break;
      case KEY.BACK:
        window.history.back();
        break;
    }
  };

  const gobackClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.history.back();
  };

  const gobackKeydownHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const key = event.keyCode;
    switch (key) {
      case KEY.ENTER:
      case KEY.BACK:
        gobackClickHandler(event);
        break;
      case KEY.DOWN:
        if (myAccountRef && myAccountRef.current) {
          myAccountRef.current.focus();
        }
        break;
    }
  };

  const popupCallback = (type) => {
    switch (type) {
      case "done":
        logout();
        break;
      case "cancel":
        setShowPopup(false);
        if (myAccountRef && myAccountRef.current) {
          myAccountRef.current.focus();
        }
        break;
    }
  };

  const logout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userDetails");
    const MENUS = CONSTANTS.MENUS.GUEST;
    props.setMenuData({ menuData: MENUS });
    props.setSelectedMenu({ selectedMenu: MENUS[0].code });
    props.setAuthInfo(null);
    props.setLoginStatus({ isLogin: false });
    props.setAccountInfo(null);
    props.history.push("/home");
  };

  return (
    <div className="setting-page">
      <div className="setting-wrapper">
        <div className="menu-section">
          <div className="title">Settings</div>
          <div
            className="go-back"
            tabIndex={0}
            ref={goBackRef}
            onClick={gobackClickHandler}
            onKeyDown={gobackKeydownHandler}
          >
            <span className="icon"></span>
            Go Back
          </div>
          <ul className="menu-list">
            {CONSTANTS.SETTING_MENUS.map((item, index) => {
              return (
                <li
                  className={`menu-item ${
                    item.code === selectedMenu ? "active" : ""
                  }`}
                  key={item.code}
                  tabIndex={0}
                  ref={index === 0 ? myAccountRef : null}
                  onClick={(event) => clickHandler(event, item.code)}
                  onKeyDown={(event) => keydownHandler(event, item.code)}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="content-section">{getComponent(selectedMenu)}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  account: state.account,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setMenuMode,
      setAuthInfo,
      setLoginStatus,
      showMenu,
      setMenuData,
      setSelectedMenu,
      setAccountInfo,
    },
    dispatch
  );
};

export default withRouter(
  compose(connect(mapStateToProps, mapDispatchToProps))(Setting)
);
