export const openExitPopup = (data) => ({
  type: "EXIT_POPUP",
  data,
});

export const setAppConfig = (data) => ({
  type: "APP_CONFIG",
  data,
});

export const setAppLanguage = (data) => ({
  type: "APP_LANGUAGE",
  languages: data.languages,
});
