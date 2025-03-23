import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import auth from "./auth/auth.reducer";
import splash from "./splash/splash.reducer";
import player from "./player/player.reducer";
import menu from "./menu/menu.reducer";
import common from "./common/common.reducer";
import page from "./page/page.reducer";
import carousel from "./carousel/carousel.reducer";
import details from "./details/details.reducer";
import account from "./account/account.reducer";

export default function (history) {
  return combineReducers({
    splash,
    auth,
    router: connectRouter(history),
    player,
    menu,
    common,
    page,
    carousel,
    details,
    account,
  });
}
