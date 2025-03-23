const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  receivesNewsletter: false,
  subscriptionAccount: {
    isActive: false,
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  const type = action && action.type;
  switch (type) {
    case "SET_ACCOUNT_INFO":
      if (action.data) {
        return { ...state, ...action.data };
      } else {
        return { ...state, ...initialState };
      }
    default:
      return state;
  }
};
