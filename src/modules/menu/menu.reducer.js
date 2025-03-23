
const initialState = {
  showMenu: false,
  selectedMenu: "",
  mode: "small",
  menuData: [],
  menuRef: null,
  lastActive: null,
  lastActiveList: null,
  isKeyboardOpen: false,
  selectedLiveChannel:0,
  selectedLiveCatagory:0,
  selectedLiveData:null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_LIVE_CAT_SELECTED":
      return {
        ...state,
        selectedLiveCatagory: action.selectedLiveCatagory,
      };
    case "SET_LIVE_CHANNEL_DATA":
      return {
        ...state,
        selectedLiveData: action.selectedLiveData,
      };
    case "SET_LIVE_CHANNEL_SELECTED":
      return {
        ...state,
        selectedLiveChannel: action.selectedLiveChannel,
      };
    case "SET_SELECTED_MENU":
      return {
        ...state,
        selectedMenu: action.selectedMenu,
      };
    case "SET_ACTIVE_MENU_REF":
      return {
        ...state,
        menuRef: action.menuRef,
      };
    case "SHOW_MENU":
      return {
        ...state,
        showMenu: action.showMenu,
      };
    case "SET_MENU_DATA":
      return {
        ...state,
        menuData: action.menuData,
      };
    case "SET_MENU_MODE":
      return {
        ...state,
        mode: action.mode,
      };
    case "SET_LAST_ACTIVE":
      return {
        ...state,
        lastActive: action.item,
      };
    case "SET_LAST_ACTIVE_LIST":
      return {
        ...state,
        lastActiveList: action.item,
      };
    case "SET_LAST_ACTIVE_SUB_LIST":
      return {
        ...state,
        lastActiveSubList: action.item,
      };
    case "SET_KEYBOARD_OPEN":
      return {
        ...state,
        isKeyboardOpen: action.open,
      };
    default:
      return state;
  }
};
