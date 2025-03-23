const initialState = { showSplash: true };

export default (state = initialState, action) => {
  switch (action.type) {
    case "HIDE_SPLASH":
      return { ...state, showSplash: false };
    default:
      return state;
  }
};
