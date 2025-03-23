import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { init } from "@noriginmedia/norigin-spatial-navigation";
import "./index.scss";

const RootApp = () => {
  init({
    debug: false,
    visualDebug: false,
  });
  
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

ReactDOM.render(<RootApp />, document.getElementById("root"));
