const initialState = {
  selectedContent: null,
  detailsData: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CONTENT_DETAILS":
      return {
        ...state,
        detailsData: action.data,
      };
    case "SELECTED_CONTENT":
      return {
        ...state,
        selectedContent: action.data,
      };
    default:
      return state;
  }
};
