export function setAuthInfo(data) {
  return {
    type: 'SET_AUTH_INFO',
    data
  };
}

export function setLoginStatus(data) {
  return {
    type: 'SET_LOGIN_STATUS',
    data
  };
}

export function setToken(data) {
  return {
    type: 'SET_TOKEN',
    data
  };
}
