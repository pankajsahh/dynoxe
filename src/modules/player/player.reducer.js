const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case "PLAYBACK_DATA":
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};
