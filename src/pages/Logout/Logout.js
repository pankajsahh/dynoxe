import React, { Fragment, useEffect } from "react";
import "./index.scss";
import CONSTANTS from "../../utils/constant";
import LogoutPopup from "../../components/Popup/LogoutPopup";
import { reportEvent } from "../../helpers/gaEvents";
const Logout = (props) => {
  const { logoutPopup, callback } = props;

  useEffect(() => {
    reportEvent({
      event_name: "screen_view",
      params: {
        screen_name: "Logout page",
      },
    });
  }, []);
  return (
    <Fragment>
      {!logoutPopup ? (
        <div className="logout-page">
          <div className="title">Log out</div>
          <div className="description">
            Log out of your Marquee TV account on this device
          </div>
        </div>
      ) : (
        <LogoutPopup
          message={CONSTANTS.MESSAGE.LOGOUT_MESSAGE}
          cancelBtn={CONSTANTS.MESSAGE.LOGOUT_NO}
          okBtn={CONSTANTS.MESSAGE.LOGOUT_YES}
          keyDownHandler={callback}
        />
      )}
    </Fragment>
  );
};

export default Logout;
