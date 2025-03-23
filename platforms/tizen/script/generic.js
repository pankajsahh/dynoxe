export const exit = () => {
  tizen.application.getCurrentApplication().exit();
};

export const getNetworkStatus = () => {
  return window.navigator.onLine;
};
export const platform = () => {
  return "tizen";
};

export const deviceUID = () => {
  return new Promise((fulfill, reject) => {
    if (localStorage.getItem("uuid")) {
      fulfill(localStorage.getItem("deviceId"));
      return;
    }
    try {
      var uuid = tizen.systeminfo.getCapability(
        "http://tizen.org/system/tizenid"
      );
      localStorage.setItem("uuid", uuid);
      fulfill(uuid);
    } catch (err) {
      fulfill("");
    }
  });
};

export const getDeviceLanguage = () => {
  return new Promise((resolve, reject) => {
    if (tizen) {
      tizen.systeminfo.getPropertyValue(
        "LOCALE",
        function (locale) {
          var lang = locale.language;
          resolve(lang.slice(0, 2) || "en");
        },
        function (error) {
          resolve("en");
        }
      );
    } else {
      resolve("en");
    }
  });
};

export const getDeviceType = () => {
  return "samsung";
};

function generateUUID() {
  // Fallback UUID generator for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}
export const uuid = () => {
    let deviceId = localStorage.getItem('showTv_device_id');
    if (!deviceId) {
        // Generate a UUID (Version 4)
        deviceId = generateUUID(); // Modern browsers support this
        localStorage.setItem('showTv_device_id', deviceId);
    }
    return deviceId;
};