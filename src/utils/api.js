import CONSTANTS from "./constant";
import axios from "axios";

export function getApi(url, params = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    platform: "web",
  };

  return axios
    .get(url, { headers, params })
    .then((response) => response.data)
    .catch((error) => console.log("error", error));
}

export function postApi(url, body = null) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  const requestOptions = {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : body,
    redirect: "follow",
  };

  return fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.log("error", error));
}
