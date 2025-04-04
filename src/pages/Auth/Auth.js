import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Profile } from "../Profile/Profile";
import { showMenu } from "../../modules/menu/menu.action";

const Auth = (props) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showMenu({ showMenu: true }));
  }, []);
  return <Fragment>{<Profile />}</Fragment>;
};

export default Auth;
