import CONSTANTS from "../../utils/constant";

let authInfo = localStorage.getItem( CONSTANTS.siteName + "_login_data",);
// let isLogin = localStorage.getItem("isLogin") || false;
// console.log("authInfo=== ", authInfo);
// isLogin = isLogin === "true" || isLogin === true;
authInfo = authInfo ? JSON.parse(authInfo) : {};

const initialState = {


  user_email: authInfo.user_email || "",
  image: authInfo.image || "",
  user_phone: authInfo.user_phone || "",
  user_fullname: authInfo.user_fullname || "",
  user_id: authInfo.user_id || "",
  isLogin: authInfo.isLogin || "",
  mnumber: authInfo.mnumber || "",
  userlog: authInfo.userlog || "",
  username: authInfo.username || "",


  

};
const derivedState = {

  email:  "",
  image:  "",
  user_phone:  "",
  user_fullname:  "",
  user_id:  "",


};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  const type = action && action.type;
  switch (type) {
    case "SET_TOKEN":
      return { ...state, ...action.data };
    case "SET_AUTH_INFO":
      if (action.data) {
        return { ...state, ...action.data };
      } else {
        return { ...state, ...derivedState };
      }
    case "SET_LOGIN_STATUS":
      return { ...state, ...action.data };
    default:
      return state;
  }
};
