import store from "../modules/root-reducer";
import { getLanguage } from "../utils/util";
export const get = (url, header = {}) => {
  const { token } = header;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    requestOptions.headers["Authorization"] = `Bearer ${token}`;
    requestOptions.headers["Accept-Language"] = getLanguage();
  }
  return fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => data);
};

export const post = (url, data, header = {}) => {
  const { token } = header;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  if (token) {
    requestOptions.headers["Authorization"] = `Bearer ${token}`;
    requestOptions.headers["Accept-Language"] = getLanguage();
  }
  return fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => data);
};
