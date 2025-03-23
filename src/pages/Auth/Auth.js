import React, { Fragment } from "react";
import { useSelector } from "react-redux";
// import "./index.scss";
import Login from "../Login";
import Profile from "../Profile";

const Auth = (props) => {
  const { token } = useSelector((state) => state.auth);
  return <Fragment>{!token ? <Login /> : <Profile />}</Fragment>;
};

export default Auth;
