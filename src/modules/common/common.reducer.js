const initialState = {
  exitPopup: false,
  config: { language_id: 0 },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "EXIT_POPUP":
      return {
        ...state,
        exitPopup: action.exitPopup,
      };
    case "APP_CONFIG":
      return {
        ...state,
        config: { ...state.config, ...action.data },
      };
    case "APP_LANGUAGE":
      return {
        ...state,
        config: { ...state.config, languages: action.languages },
      };
    default:
      return state;
  }
};
