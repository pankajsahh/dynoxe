import axios from "axios";
import store from "../modules/root-reducer";
export const get = async (url, headers = {}) => {
  let config = {
    method: "get",
    url,
    headers,
  };
  let response = await axios(config);
  return response.data;
};

export const post = async (url, data, headers = {}) => {
  let config = {
    method: "post",
    url,
    headers,
    data,
  };

  const response = await axios(config);
  return response.data;
};
