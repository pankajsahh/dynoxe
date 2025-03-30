import home from "../assets/images/home.svg";
import profile from "../assets/images/profile.svg";
import my_videos from "../assets/images/my_videos.svg";
import search from "../assets/images/search.svg";
import categories from "../assets/images/categories.svg";
import collections from "../assets/images/collections.svg";
import settings from "../assets/images/settings.svg";
import { getlocaliseText } from "./localisation";

const CONSTANTS = {};
CONSTANTS.BASE_URL = "https://dynoxe.com/Apis";
CONSTANTS.siteName = "dynoxe";
CONSTANTS.MESSAGE = getlocaliseText("logOutPopUpMessages",{
  EXIT_MESSAGE: "Do you want to exit?",
  LOGOUT_MESSAGE: "Are you sure you want to log out?",
  LOGOUT_YES: "Logout",
  LOGOUT_NO: "Cancel",
  YES: "Exit",
  NO: "Cancel",
  OK: "Ok",
});

CONSTANTS.MENUS = [
  {
    name: "Home",
    code: "home",
    image: home,
  },
  {
    name: "Movie",
    code: "movie",
    image: profile,
  },
  {
    name: "Music",
    code: "music",
    image: search,
  },
  {
    name: "TV Show",
    code: "tv-show",
    image: categories,
  },
];

CONSTANTS.SETTING_MENUS = [
  {
    name: "My Account",
    code: "my-account",
  },
  {
    name: "Logout",
    code: "logout",
  },
  {
    name: "Help",
    code: "help",
  },
  {
    name: "Terms Of Service",
    code: "terms-of-service",
  },
  {
    name: "Privacy Policy",
    code: "privacy-policy",
  },
];

CONSTANTS.COUNTRY_CODE = [91];

export default CONSTANTS;
