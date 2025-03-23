let authInfo = localStorage.getItem("show_tv_login_data");
// let isLogin = localStorage.getItem("isLogin") || false;
// console.log("authInfo=== ", authInfo);
// isLogin = isLogin === "true" || isLogin === true;
authInfo = authInfo ? JSON.parse(authInfo) : {};
const initialState = {
  token: authInfo.token || "",
  refresh_token: authInfo.refresh_token || "",
  status: authInfo.status || false,
  email: authInfo.email || "",
  image: authInfo.image || "",
  phone: authInfo.phone || "",
  name: authInfo.name || "",
  id: authInfo.id || "",
  user_name: authInfo.user_name || "",
  expired_at: authInfo.days || "",
};
const derivedState = {
  token:  "",
  status: false,
  email:  "",
  image:  "",
  phone:  "",
  name:  "",
  id:  "",
  user_name:  "",
  expired_at:  "",
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
