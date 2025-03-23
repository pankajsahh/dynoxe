export const showMenu = (data) => ({
  type: "SHOW_MENU",
  ...data,
});
export const selectedLiveCatagory = (data) => ({
  type: "SET_LIVE_CAT_SELECTED",
  ...data,
});
export const selectedLiveChannel = (data) => ({
  type: "SET_LIVE_CHANNEL_SELECTED",
  ...data,
});
export const selectedLiveData = (data) => ({
  type: "SET_LIVE_CHANNEL_DATA",
  ...data,
});

export const setSelectedMenu = (data) => ({
  type: "SET_SELECTED_MENU",
  ...data,
});

export const setActiveMenuRef = (data) => ({
  type: "SET_ACTIVE_MENU_REF",
  ...data,
});

export const setMenuData = (data) => ({
  type: "SET_MENU_DATA",
  ...data,
});

export const setMenuMode = (data) => ({
  type: "SET_MENU_MODE",
  ...data,
});

export const setLastActiveItem = (data) => ({
  type: "SET_LAST_ACTIVE",
  ...data,
});

export const setLastActiveListItem = (data) => ({
  type: "SET_LAST_ACTIVE_LIST",
  ...data,
});

export const setLastActiveSubListItem = (data) => ({
  type: "SET_LAST_ACTIVE_SUB_LIST",
  ...data,
});

export const setKeyboardOpen = (data) => ({
  type: "SET_KEYBOARD_OPEN",
  ...data,
});
