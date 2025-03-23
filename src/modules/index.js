import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import logger from "redux-logger";
import createRootReducer from "./root-reducer";

const isClient = typeof window !== "undefined";

export default (history, initialState = {}) => {
  const middlewares = [thunk, routerMiddleware(history)];

  if (isClient && process.env.NODE_ENV !== "production") {
    middlewares.push(logger);
  }

  const store = createStore(
    createRootReducer(history),
    initialState,
    applyMiddleware(...middlewares)
  );
  return store;
};
