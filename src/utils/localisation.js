import { getLanguage } from "./util";

let genericArabTexts = {
  menu: [
    {
      id: 1,
      name: "الرئيسية",
      icon: "homeIcon",
      type_id: "home",
    },
    {
      id: 2,
      name: "البث المباشر",
      icon: "liveIcon",
      type_id: "live",
    },
    {
      id: 3,
      name: "الأفلام",
      icon: "movieIcon",
      type_id: "movies",
    },
    {
      id: 3,
      name: "المسلسلات",
      icon: "SeriesIcon",
      type_id: "series",
    },
    {
      id: 4,
      name: "المفضلة",
      icon: "loveIcon",
      type_id: "favorites",
    },
    {
      id: 5,
      name: "البحث",
      icon: "searchIcon",
      type_id: "search",
    },
    {
      id: 6,
      name: "الملف الشخصي",
      icon: "profileIcon",
      type_id: "auth",
    },
  ],
  recentlyViewedTrayText: "تم عرضها مؤخرًا",
  watchNowBtnText: "شاهد الآن",
  PlayNowBtnText: "شغل الآن",
  livePlayerLikeText: "اضغط مطولًا على موافق لإضافة إلى المفضلة.",
  PlayerNetworkErrorMessage: "تعذّر تحميل الفيديو. يرجى المحاولة مرة أخرى.",
  RetryBtnText: "إعادة المحاولة",
  youMayLikeTrayTitle: "قد يعجبك",
  SeariesSeasonText: "م",
  GridMoviePageTitle: "أفلام",
  GridSeriesPageTitle: "مسلسلات",
  FavMovieTrayName: "أفلام",
  FavSeriesTrayName: "مسلسلات تلفزيونية",
  FavLiveTrayName: "مباشر",
  SearchPageTitle: "بحث",
  SearchPageBytitelText: "البحث بالعنوان",
  SearchPageByDescText: "البحث بالوصف",
  SearchPageByTagText: "علامة",
  logOutPopUpMessages: {
    EXIT_MESSAGE: "هل تريد الخروج؟",
    LOGOUT_MESSAGE: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    LOGOUT_YES: "تسجيل الخروج",
    LOGOUT_NO: "إلغاء",
    YES: "نعم",
    NO: "لا",
    OK: "موافق",
  },

  settingsPageLANGUAGE: "اللغة",
  settingsPagePARENTAL_LOCK: "قفل الوالدين",
  settingsPageCLEAR_CACHE: "مسح الذاكرة المؤقتة",
  settingsPageAUTO_INTRO: "المقدمة التلقائية",
  settingsPageLOGOUT: "تسجيل الخروج",
  ChangeLanguageText:'اللغة',
  restrictedPopupCancel: "إلغاء",
  restrictedPopupSUBMIT: "إرسال",
  settingsPageACTIVATE_PARENTAL_LOCK: "تفعيل قفل الوالدين"

};

export function getlocaliseText(id, defaultText) {
  let language = getLanguage();
  let FoundGenricText = defaultText;
  if (language == "ar") {
    FoundGenricText = genericArabTexts?.[id];
  }
  if (FoundGenricText) return FoundGenricText;
  return defaultText;
}
