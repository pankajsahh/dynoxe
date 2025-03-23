import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthInfo, setToken } from "../modules/auth/auth.action";
import CONSTANTS from "../utils/constant";
import { useLocation, useNavigate } from "react-router-dom";
import { noMenuRoute } from "../App";
import { showMenu } from "../modules/menu/menu.action";
import { getLanguage } from "../utils/util";
let requested_refresh_token = false;
const usePageData = (url) => {
  const [pageData, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, refresh_token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // if token is expired then run refresh token api if refresh token api is success then set token in local storage and in redux store
  // else logout user and redirect to login page
  const fetchData = async (Atuhtoken) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Atuhtoken}`,
          'Accept-Language': getLanguage(), // Add the language code here
        },
      });
      setData(response.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        // Token has expired, attempt to refresh
        console.log("Token expired, refreshing...");
        await refreshTokenAndRetry();
      } else {
        setError(err);
        console.error("Error fetching home data:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  const refreshTokenAndRetry = async () => {
    if (requested_refresh_token) {
      localStorage.removeItem("show_tv_login_data");
      localStorage.removeItem("isLogin");
      dispatch(setAuthInfo(null));
      navigate("/login");
      return;
    }
    try {
      const refreshResponse = await axios.post(
        `${CONSTANTS.BASE_URL}/refresh_token`,
        { refresh_token: refresh_token }
      );
      const newToken = refreshResponse.data.message;
      console.log("New token:", refreshResponse);
      dispatch(setToken({ token: newToken }));
      let UpdateAuthData = {
        ...JSON.parse(localStorage.getItem("show_tv_login_data")),
        token: newToken,
      };
      localStorage.setItem(
        "show_tv_login_data",
        JSON.stringify(UpdateAuthData)
      );
      requested_refresh_token = true;
      fetchData(newToken);
    } catch (err) {
      console.error("Error refreshing token:", err);
      return logoutAndRedirect();
    }
  };
  useEffect(() => {
    if (noMenuRoute.includes(location.pathname)) {
      dispatch(showMenu({ showMenu: false }));
    }else{
      dispatch(showMenu({ showMenu: true }));
    }
    fetchData(token);
  }, [url]);

  return { pageData, loading, error };
};

export default usePageData;
