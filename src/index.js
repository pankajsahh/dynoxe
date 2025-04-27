import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { init } from "@noriginmedia/norigin-spatial-navigation";
import "./index.scss";
import { createRoot } from 'react-dom/client'

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


createRoot(document.getElementById('root')).render(
  <RootApp/>,
)

