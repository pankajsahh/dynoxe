export function mimeType(url) {
  if (url?.includes(".m3u8")) {
    return "application/x-mpegURL";
  }
  if (url?.includes(".mpd")) {
    return "application/dash+xml";
  }
  if (url?.includes(".mp4")) {
    return "video/mp4";
  }
  if (url?.includes(".ts")) {
    return "video/mp2t";
  }
  return "application/vnd.apple.mpegURL";
}

export const scrollH = function (index, itemWidth, trayRef, scrollindex) {
  var placeToMove = 0;
  if (!scrollindex && scrollindex !== 0) {
    scrollindex = 3;
  }

  if (index >= scrollindex) {
    placeToMove = index - scrollindex;
  }

  var moveValue = itemWidth * placeToMove;
  if (trayRef && moveValue > 0) {
    trayRef.style.marginLeft = "-" + moveValue + "vw";
  } else if (trayRef) {
    trayRef.style.marginLeft = "-" + 0 + "vw";
  }
};
export function throttle(func, wait) {
  let timeout;
  let lastArgs;
  let lastThis;
  let result;
  let lastCallTime = 0;
  const invokeFunc = (time) => {
    result = func.apply(lastThis, lastArgs);
    lastCallTime = time;
    return result;
  };

  return function (...args) {
    lastArgs = args;
    lastThis = this;

    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    const timeRemaining = wait - timeSinceLastCall;

    if (timeSinceLastCall >= wait) {
      return invokeFunc(now);
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    if (timeRemaining <= 0) {
      timeout = setTimeout(() => invokeFunc(now), wait);
    }

    return result;
  };
}
export const oldESscrollTo = (element, toX, toY, duration = 300) => {
  try {
    element.scrollTo({
      top: toY,
      left: toX,
      behavior: "smooth",
    });
  } catch (e) {
    //   if(element){
    //     if (duration <= 0) return;
    //     var startX = element.scrollLeft;
    //     var startY = element.scrollTop;
    //     var deltaX = toX - startX;
    //     var deltaY = toY - startY;
    //     var perTickX = deltaX / duration * 10;
    //     var perTickY = deltaY / duration * 10;
    //     setTimeout(function() {
    //         element.scrollLeft = element.scrollLeft + perTickX;
    //         element.scrollTop = element.scrollTop + perTickY;
    //         if (element.scrollLeft === toX && element.scrollTop === toY) return;
    //         throttleScrollTo(element, toX, toY, duration - 10);
    //     }, 10);
    // }
  }
};
export const scrollVWithoutAnimation = function (
  index,
  height,
  parent,
  scrollindex
) {
  var placeToMove = 0;
  if (!scrollindex) {
    scrollindex = 0;
  }
  if (index >= scrollindex) {
    placeToMove = index - scrollindex;
  }
  var current = document.querySelector(parent);
  if (current) {
    current.style.marginTop = "-" + height * placeToMove + "vw";
  }
};

export function setActiveElement(
  event,
  index,
  width = 0,
  scrollindex = 0,
  element
) {
  var key = event.keyCode;
  if (key === 39 && index > scrollindex) {
    event.target.classList.remove("active");
    scrollH(index, width, element, scrollindex);
    event.target.nextSibling.classList.add("active");
  }
  if (key === 37 && index > scrollindex && index < prevIndex) {
    event.target.classList.remove("active");
    scrollH(index, width, element, scrollindex);
    event.target.previousSibling.classList.add("active");
  }

  if (key === 37 && index > scrollindex && index > prevIndex) {
    index -= 2;
    event.target.classList.remove("active");
    scrollH(index, width, element, scrollindex);
    event.target.previousSibling.classList.add("active");
  }
  prevIndex = index;
}

export function activeElement(element, scrollClass) {
  if (document.querySelector(`li[scrollClass="${scrollClass}"].active`)) {
    document
      .querySelector(`li[scrollClass="${scrollClass}"].active`)
      .classList.remove("active");
  }
  element.classList.add("active");
  // element.scrollIntoView();
}

function mouseWheelCallback(e) {
  let wDelta = e.wheelDelta < 0 ? "down" : "up";
  if (wDelta === "up") {
    scrollUP(e);
  } else if (wDelta === "down") {
    scrollDOWN(e);
  }
}

function scrollUP() {}
function scrollDOWN() {}

export function getVW(t) {
  let w = 1920 * 0.01;
  return t / w;
}

export function getOrientationHeight(orientation) {
  switch (orientation) {
    case "portrait":
      return 392;
    case "landscape":
      return 312;
    case "left":
      return 312;
    default:
      return 312;
  }
}
export const typeMapper = (type) => {
  switch (type) {
    case 1:
      return "live";
    case 2:
      return "movie";
    case 3:
      return "series";
    case 4:
      return "season";
    case 5:
      return "episode";
  }
};
export function getOrientationWidth(orientation) {
  switch (orientation) {
    case "portrait":
      return 263;
    case "landscape":
      return 315;
    case "left":
      return 218;
    default:
      return 218;
  }
}

export function getScrollableRow(orientation) {
  // switch (orientation) {
  //   case "portrait":
  //     return 5;
  //   case "landscape":
  //     return 4;
  //   case "left":
  //     return 4;
  //   default:
  //     return 4;
  // }
  switch (orientation) {
    case "portrait":
      return 4;
    case "landscape":
      return 4;
    case "left":
      return 4;
    default:
      return 4;
  }
}
export function formatTimeHHMM(t) {
  if (!t) return;
  let time = new Date(t);
  let hours = time.getHours();
  let minutes = time.getMinutes();
  return `${hours}h ${minutes}m`;
}
export function toFormatedDate(t) {
  if (!t) return;
  let time = new Date(t);
  let days = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };
  let months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    12: "Dec",
  };
  var day = days[time.getDay()];
  var month = months[time.getMonth()];
  var date = time.getDate();
  var year = time.getFullYear();
  var hours = time.getHours();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  var minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${day} ${month} ${date}, ${year} ${hours}:${minutes} ${ampm}`;
}

document.addEventListener("mousewheel", mouseWheelCallback);
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
let languageCache = (() => {
  let cachedLanguage = null;
  let cachedParentalLock = null;
  let cachedParentalLockNum = null;

  return {
    setLanguage: (language) => {
      localStorage.setItem("ShowTv_app_language", language);
      cachedLanguage = language; // Update the cached language
    },
    getLanguage: () => {
      let gotTheLSData = localStorage.getItem("ShowTv_app_language");
      if (!cachedLanguage && gotTheLSData) {
        cachedLanguage = gotTheLSData; // default to 'en' if not set
      }
      return cachedLanguage || "en";
    },
    setParentalLock: (lock) => {
      localStorage.setItem("ShowTv_parental_lock", lock);
      cachedParentalLock = lock; // Update the cached parental lock
    },
    getParentalLock: () => {
      let gotTheLSData = localStorage.getItem("ShowTv_parental_lock");
      if (!cachedParentalLock && gotTheLSData) {
        cachedParentalLock = gotTheLSData; // default to 'off' if not set
      }
      return cachedParentalLock || 'false';
    },
    setParentalLockNumber: (lock) => {
      localStorage.setItem("ShowTv_parental_key", lock);
      cachedParentalLockNum = lock; // Update the cached parental lock
    },
    getParentalLockNumber: () => {
      let gotTheLSData = localStorage.getItem("ShowTv_parental_key");
      if (!cachedParentalLockNum && gotTheLSData) {
        cachedParentalLockNum = gotTheLSData; // default to 'off' if not set
      }
      return cachedParentalLockNum || "";
    },
  };
})();

export const setLanguage = languageCache.setLanguage;
export const getLanguage = languageCache.getLanguage;
export const setParentalLock = languageCache.setParentalLock;
export const getParentalLock = languageCache.getParentalLock;
export const setParentalLockNumber = languageCache.setParentalLockNumber;
export const getParentalLockNumber = languageCache.getParentalLockNumber;
