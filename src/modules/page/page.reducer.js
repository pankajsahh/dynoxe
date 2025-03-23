const initialState = {
  data: [],
  categories: [],
  collections: [],
  collectionVideos: [],
  myVideos: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_PAGE_DATA":
      return {
        ...state,
        data: [...action.data],
      };
    case "SET_CATEGORIES_DATA":
      return {
        ...state,
        categories: [...action.data],
      };
    case "SET_COLLECTION_DATA":
      return {
        ...state,
        collections: [...action.data],
      };
    case "SET_COLLECTION_VIDEOS":
      return {
        ...state,
        collectionVideos: [...action.data],
      };
    case "SET_MY_VIDEOS":
      return {
        ...state,
        myVideos: [...action.data],
      };
    default:
      return state;
  }
};
