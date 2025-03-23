export function setKey(key, value) {
  if (window.localStorage) {
    if (value) {
      if (typeof value === 'object') {
        window.localStorage.setItem(key, JSON.stringify(value));
      } else {
        window.localStorage.setItem(key, value);
      }
    }
  }
}

export function getKey(key) {
  if (window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function clearKey() {
  if (window.localStorage) {
    window.localStorage.clear();
  }
}

export function deleteKey(key) {
  if (window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

