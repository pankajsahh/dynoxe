const initialState = {
  data: null,
  selectedIndex: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CAROUSEL_DATA":
      return {
        ...state,
        data: action.data,
      };
    case "SELECTED_INDEX":
      return {
        ...state,
        selectedIndex: action.index,
      };
    default:
      return state;
  }
};
