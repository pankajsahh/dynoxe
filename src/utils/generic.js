export const exit = (device) => {
  if(device === 'samsungTv') {
  tizen.application.getCurrentApplication().exit();
  } else if(device === 'lgTv') {
    window.close();
  }
};

export const getNetworkStatus = () => {
  return window.navigator.onLine;
};

export const getDeviceLanguage = () => {
  return new Promise((resolve, reject) => {
    webOS.service.request("luna://com.webos.settingsservice", {
      method: "getSystemSettings",
      parameters: {
        keys: ["localeInfo"],
      },
      onSuccess: function (inResponse) {
        resolve(
          inResponse?.settings?.localeInfo?.locales["UI"]?.slice(0, 2) || "en"
        );
      },
      onFailure: function (inError) {
        resolve("en");
      },
    });
  });
};
export const platform = () => {
  return "webos";
};
export const getDeviceType = () => {
  return "lg";
};

export const deviceUID = () => {
  return new Promise((fulfill, reject) => {
    if (localStorage.getItem("deviceId")) {
      fulfill(localStorage.getItem("deviceId"));
      return;
    }
    const UUID = uuid();
    try {
      window.webOS.service.request("luna://com.webos.service.sm", {
        method: "deviceid/getIDs",
        parameters: {
          idType: ["LGUDID"],
        },
        onSuccess(inResponse) {
          if (inResponse && inResponse.returnValue) {
            const deviceList = inResponse.idList;
            if (deviceList && deviceList.length) {
              const deviceData = deviceList[0];
              if (deviceData && deviceData.idValue) {
                localStorage.setItem("deviceId", deviceData.idValue);
                fulfill(deviceData.idValue);
              } else {
                localStorage.setItem("deviceId", UUID);
                fulfill(UUID);
              }
            } else {
              localStorage.setItem("deviceId", UUID);
              fulfill(UUID);
            }
          } else {
            localStorage.setItem("deviceId", UUID);
            fulfill(UUID);
          }
        },
        onFailure(inError) {
          localStorage.setItem("deviceId", UUID);
          fulfill(UUID);
        },
      });
    } catch (e) {
      localStorage.setItem("deviceId", UUID);
      fulfill(UUID);
    }
  });
};

export const getDevicePlatformVersion = () => {
  return new Promise((fulfill, reject) => {
    try {
      window.webOS.deviceInfo((device) => {
        fulfill(device.sdkVersion);
      });
    } catch (err) {
      fulfill("3.5");
    }
  });
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