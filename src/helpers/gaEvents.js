import { getDeviceType } from "../utils/generic";
import store from "../store";

const userProperty = {
  loginStatus: false,
  userEmail: "",
  userId: "",
  trialStatus: false,
  subscriptionType: "none",
};
const googleCradentials = {
  SAMSUNG: {
    measurementId: "",
    api_secret: "",
  },
  LG: {
    measurementId: "",
    api_secret: "",
  },
};

function triggerCollectApi(payload) {}

export function pageView(data) {
  const obj = {
    page_name: data.pagename,
  };
  triggerCollectApi("page_view", obj);
}
export function playbackEvent(data) {
  const event = data.event;
  const obj = {
    Platform: `${getPlatform()} TV`,
    ContentID: data.contentID,
    VideoCategory: data.videoCategory,
    VideoTitle: data.videoName,
  };
  triggerCollectApi(event, obj);
}

export function reportEvent(data) {}
