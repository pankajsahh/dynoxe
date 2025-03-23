import React, { useEffect } from "react";
import KEY from "../../utils/key";
import { toFormatedDate } from "../../utils/util";

import "./index.scss";
import { reportEvent } from "../../helpers/gaEvents";

const MyAccount = (props) => {
  useEffect(() => {
    reportEvent({
      event_name: "screen_view",
      params: {
        screen_name: "Account page",
      },
    });
  }, []);
  const {
    account: { subscriptionAccount, activeUserFreePass },
    auth,
  } = props;
  // const keydownHandler = (event) => {
  //   const key = event.keyCode;
  //   switch (key) {
  //     case KEY.LEFT:
  //       if (props.refAccountBtn && props.refAccountBtn.current) {
  //         props.refAccountBtn.current.focus();
  //       }
  //       break;
  //     case KEY.BACK:
  //       props.history.push("/home-page");
  //       break;
  //   }
  // };
  return (
    <>
      <div className="my-account-page">
        <h2 className="title">My Details</h2>
        <div className="field-wrapper">
          <span className="field-name">Email:</span>
          <span className="field-value">{auth.email}</span>
        </div>
        <div className="field-wrapper">
          <span className="field-name">First Name:</span>
          <span className="field-value">{auth.firstName}</span>
        </div>
        <div className="field-wrapper">
          <span className="field-name">Second Name:</span>
          <span className="field-value">{auth.lastName}</span>
        </div>
        {subscriptionAccount ? <h2 className="title">Subscription</h2> : null}
        <div className="description">
          {
            subscriptionAccount?.currentSubscriptionPlan?.howToManage
              ?.description
          }
        </div>

        {/* <div
        className="subscription-btn"
        tabIndex={0}
        ref={props.buttonRef}
        onKeyDown={keydownHandler}
      >
        Change plan
      </div> */}
      </div>
      {activeUserFreePass ? (
        <div className="free-pass">
          You currently have a free pass active on this account, valid
          until:&nbsp;
          <span>{toFormatedDate(activeUserFreePass?.toExpireAt)}</span>
        </div>
      ) : null}
    </>
  );
};

export default MyAccount;
